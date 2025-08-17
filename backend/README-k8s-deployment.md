# Full Stack TweetApp: Kubernetes Deployment Guide with Observability

This guide explains how to deploy your TweetApp (Spring Boot backend + React frontend) to Kubernetes, with monitoring for **metrics**, **logs**, and **traces** using Prometheus, Grafana, and Zipkin.

---

## 1. Prerequisites
- Docker installed
- Kubernetes cluster (Minikube, Kind, AKS, EKS, GKE, etc.)
- `kubectl` configured
- [Helm](https://helm.sh/) installed (for easy monitoring stack setup)

---

## 2. Build Docker Images

### Backend (Spring Boot)
```sh
cd tweetapp
mvn clean package
# Build with OpenTelemetry agent in image (for tracing)
docker build -t tweetapp-backend:latest -f Dockerfile.backend .
```

### Frontend (React)
```sh
cd tweetapp-frontend
npm install
npm run build
# Build static file server image
docker build -t tweetapp-frontend:latest -f Dockerfile.frontend .
```

---

## 3. Write Kubernetes Manifests

### Backend Deployment & Service (`k8s/backend.yaml`)
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: tweetapp-backend
spec:
  replicas: 1
  selector:
    matchLabels:
      app: tweetapp-backend
  template:
    metadata:
      labels:
        app: tweetapp-backend
    spec:
      containers:
        - name: backend
          image: tweetapp-backend:latest
          ports:
            - containerPort: 8080
          env:
            - name: OTEL_EXPORTER_ZIPKIN_ENDPOINT
              value: "http://zipkin:9411/api/v2/spans"
            - name: OTEL_SERVICE_NAME
              value: "tweetapp"
            - name: JAVA_TOOL_OPTIONS
              value: "-javaagent:/otel/opentelemetry-javaagent.jar"
          volumeMounts:
            - name: otel-agent
              mountPath: /otel
      volumes:
        - name: otel-agent
          emptyDir: {}
---
apiVersion: v1
kind: Service
metadata:
  name: tweetapp-backend
spec:
  selector:
    app: tweetapp-backend
  ports:
    - port: 8080
      targetPort: 8080
```

### Frontend Deployment & Service (`k8s/frontend.yaml`)
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: tweetapp-frontend
spec:
  replicas: 1
  selector:
    matchLabels:
      app: tweetapp-frontend
  template:
    metadata:
      labels:
        app: tweetapp-frontend
    spec:
      containers:
        - name: frontend
          image: tweetapp-frontend:latest
          ports:
            - containerPort: 80
---
apiVersion: v1
kind: Service
metadata:
  name: tweetapp-frontend
spec:
  selector:
    app: tweetapp-frontend
  ports:
    - port: 80
      targetPort: 80
```

---

### Zipkin Deployment & Service (`k8s/zipkin.yaml`)
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: zipkin
spec:
  replicas: 1
  selector:
    matchLabels:
      app: zipkin
  template:
    metadata:
      labels:
        app: zipkin
    spec:
      containers:
        - name: zipkin
          image: openzipkin/zipkin:latest
          ports:
            - containerPort: 9411
---
apiVersion: v1
kind: Service
metadata:
  name: zipkin
spec:
  selector:
    app: zipkin
  ports:
    - port: 9411
      targetPort: 9411
```

---

## 4. Database Deployment & Integration

### PostgreSQL Deployment & Service (`k8s/postgres.yaml`)
```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: postgres-pvc
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 5Gi
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: postgres
spec:
  replicas: 1
  selector:
    matchLabels:
      app: postgres
  template:
    metadata:
      labels:
        app: postgres
    spec:
      containers:
        - name: postgres
          image: postgres:15
          env:
            - name: POSTGRES_DB
              value: tweetapp
            - name: POSTGRES_USER
              value: tweetuser
            - name: POSTGRES_PASSWORD
              value: tweetpass
          ports:
            - containerPort: 5432
          volumeMounts:
            - mountPath: /var/lib/postgresql/data
              name: postgres-storage
      volumes:
        - name: postgres-storage
          persistentVolumeClaim:
            claimName: postgres-pvc
---
apiVersion: v1
kind: Service
metadata:
  name: postgres
spec:
  ports:
    - port: 5432
  selector:
    app: postgres
```

### Backend Configuration for PostgreSQL
- Add these environment variables to your backend deployment (`k8s/backend.yaml`):
  ```yaml
  env:
    - name: SPRING_DATASOURCE_URL
      value: jdbc:postgresql://postgres:5432/tweetapp
    - name: SPRING_DATASOURCE_USERNAME
      value: tweetuser
    - name: SPRING_DATASOURCE_PASSWORD
      value: tweetpass
  ```
- Or update `application.properties` accordingly.
- **Security Note:** For production, use Kubernetes Secrets for DB credentials.

### Apply Database Manifests
```sh
kubectl apply -f k8s/postgres.yaml
```

Continue with the steps below to deploy monitoring and the rest of the stack.

---

## 5. Deploy Monitoring Stack (Prometheus, Grafana, Loki)

Install with Helm:
```sh
helm repo add grafana https://grafana.github.io/helm-charts
helm repo update
helm install monitoring grafana/loki-stack --set grafana.enabled=true,prometheus.enabled=true
```
- This will deploy Prometheus (metrics), Loki (logs), and Grafana (dashboards).
- Expose Grafana and Prometheus using `kubectl port-forward` or a LoadBalancer.

---

## 5. Deploy Everything to Kubernetes
```sh
kubectl apply -f k8s/
```

---

## 6. Access Your App & Dashboards
- **Frontend:** Expose `tweetapp-frontend` service (NodePort/LoadBalancer/Ingress)
- **Backend:** Expose if needed for direct API
- **Zipkin:** Expose `zipkin` service (NodePort/LoadBalancer)
- **Grafana:** Expose via Helm or `kubectl port-forward svc/monitoring-grafana 3000:80`
- **Prometheus:** Expose via Helm or `kubectl port-forward svc/monitoring-prometheus-server 9090:80`

---

## 7. Metrics, Logs, and Traces
- **Metrics:** Prometheus scrapes /actuator/prometheus (add Spring Boot Actuator + Micrometer Prometheus dependency)
- **Logs:** Loki collects container logs; view in Grafana
- **Traces:** Zipkin collects traces from backend (via OpenTelemetry agent)

---

## 8. Example Observability Integration
- **Spring Boot Actuator:**
  - Add to `pom.xml`:
    ```xml
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-actuator</artifactId>
    </dependency>
    <dependency>
      <groupId>io.micrometer</groupId>
      <artifactId>micrometer-registry-prometheus</artifactId>
    </dependency>
    ```
  - Expose `/actuator/prometheus` in `application.properties`:
    ```properties
    management.endpoints.web.exposure.include=health,info,prometheus
    management.endpoint.prometheus.enabled=true
    ```
- **Logs:**
  - No code change needed; Loki reads container logs.
- **Traces:**
  - Already enabled via OpenTelemetry agent and Zipkin.

---

## 9. Clean Up
```sh
kubectl delete -f k8s/
helm uninstall monitoring
```

---

## 10. References
- [Spring Boot + Kubernetes Docs](https://docs.spring.io/spring-boot/docs/current/reference/html/container-images.html)
- [Grafana Loki Stack](https://grafana.com/docs/loki/latest/)
- [Prometheus Operator](https://github.com/prometheus-operator/prometheus-operator)
- [Zipkin](https://zipkin.io/)
- [OpenTelemetry](https://opentelemetry.io/docs/instrumentation/java/)

---

**This guide provides a production-ready foundation for deploying, monitoring, and observing your full stack TweetApp in Kubernetes.**
