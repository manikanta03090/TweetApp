# Migrating from H2 to Azure SQL or AWS RDS (MySQL/PostgreSQL)

This guide explains how to migrate your Spring Boot TweetApp backend from the default H2 in-memory database to a managed cloud SQL database, such as **Azure SQL Database** or **AWS RDS** (MySQL/PostgreSQL).

---

## 1. Provision Your Cloud Database

- **Azure SQL**: Create a SQL Database via Azure Portal.
- **AWS RDS**: Create a MySQL or PostgreSQL instance via AWS Console.
- Note the following:
  - Hostname
  - Database name
  - Username
  - Password
  - Port (default: 1433 for Azure SQL, 3306 for MySQL, 5432 for PostgreSQL)

---

## 2. Update Spring Boot Configuration

**File to modify:**
- `src/main/resources/application.properties`

### Example for Azure SQL
```properties
# Comment out or remove H2 config
# spring.datasource.url=jdbc:h2:mem:tweetdb
# spring.datasource.driverClassName=org.h2.Driver
# spring.datasource.username=sa
# spring.datasource.password=
# spring.h2.console.enabled=true

# Azure SQL config
spring.datasource.url=jdbc:sqlserver://<AZURE_HOST>:1433;database=<DB_NAME>;encrypt=true;trustServerCertificate=false;hostNameInCertificate=*.database.windows.net;loginTimeout=30;
spring.datasource.username=<USERNAME>@<AZURE_HOST>
spring.datasource.password=<PASSWORD>
spring.datasource.driver-class-name=com.microsoft.sqlserver.jdbc.SQLServerDriver
spring.jpa.database-platform=org.hibernate.dialect.SQLServerDialect
```

### Example for AWS RDS MySQL
```properties
# Comment out/remove H2 config as above

# AWS RDS MySQL config
spring.datasource.url=jdbc:mysql://<RDS_HOST>:3306/<DB_NAME>?useSSL=true
spring.datasource.username=<USERNAME>
spring.datasource.password=<PASSWORD>
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.jpa.database-platform=org.hibernate.dialect.MySQLDialect
```

### Example for AWS RDS PostgreSQL
```properties
# Comment out/remove H2 config as above

# AWS RDS PostgreSQL config
spring.datasource.url=jdbc:postgresql://<RDS_HOST>:5432/<DB_NAME>
spring.datasource.username=<USERNAME>
spring.datasource.password=<PASSWORD>
spring.datasource.driver-class-name=org.postgresql.Driver
spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
```

---

## 3. Add the Appropriate JDBC Driver

**File to modify:**
- `pom.xml`

### For Azure SQL
Add inside `<dependencies>`:
```xml
<dependency>
  <groupId>com.microsoft.sqlserver</groupId>
  <artifactId>mssql-jdbc</artifactId>
  <version>12.6.1.jre11</version>
</dependency>
```

### For AWS RDS MySQL
```xml
<dependency>
  <groupId>mysql</groupId>
  <artifactId>mysql-connector-java</artifactId>
  <version>8.0.33</version>
</dependency>
```

### For AWS RDS PostgreSQL
```xml
<dependency>
  <groupId>org.postgresql</groupId>
  <artifactId>postgresql</artifactId>
  <version>42.7.3</version>
</dependency>
```

---

## 4. (Optional) Database Initialization
- If you want to auto-create tables, keep `spring.jpa.hibernate.ddl-auto=update` in `application.properties`.
- For production, consider using migrations (Flyway, Liquibase) instead.

---

## 5. Test the Connection
- Run your Spring Boot app.
- Check logs for successful DB connection.
- If you see errors, check:
  - Firewall rules (allow your IP)
  - Credentials
  - JDBC URL syntax

---

## 6. Security Note
- Never commit real credentials to GitHub.
- Use environment variables or a secrets manager for production.

---

## Summary Table
| Cloud DB     | Driver Dependency         | JDBC URL Example                                   | Hibernate Dialect               |
|--------------|--------------------------|----------------------------------------------------|---------------------------------|
| Azure SQL    | mssql-jdbc               | jdbc:sqlserver://host:1433;database=DB             | SQLServerDialect                |
| AWS RDS MySQL| mysql-connector-java     | jdbc:mysql://host:3306/DB?useSSL=true              | MySQLDialect                    |
| AWS RDS Postgres| postgresql            | jdbc:postgresql://host:5432/DB                     | PostgreSQLDialect               |

---

**Modify only `src/main/resources/application.properties` and `pom.xml` to switch databases.**

For more details, see the official docs:
- [Spring Boot DataSource Configuration](https://docs.spring.io/spring-boot/docs/current/reference/html/application-properties.html#application-properties-data)
- [Azure SQL JDBC](https://learn.microsoft.com/en-us/sql/connect/jdbc/building-the-connection-url)
- [AWS RDS Docs](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/CHAP_GettingStarted.html)
