import React from "react";
import { Box, Button, TextField, CircularProgress } from "@mui/material";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { signin } from "../api/api";

export default function LoginForm({ onSuccess, onError }) {
  return (
    <Formik
      initialValues={{ username: "", password: "" }}
      validationSchema={Yup.object({
        username: Yup.string().required("Username is required"),
        password: Yup.string().required("Password is required"),
      })}
      onSubmit={async (values, { setSubmitting }) => {
        try {
          const res = await signin(values);
          localStorage.setItem("token", res.data.token);
          localStorage.setItem("username", res.data.username);
          onSuccess();
          window.location.href = "/feed";
        } catch (err) {
          onError(err?.response?.data?.message || "Signin failed");
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {({ values, handleChange, handleBlur, touched, errors, isSubmitting }) => (
        <Form>
          <TextField
            fullWidth
            margin="normal"
            label="Username"
            name="username"
            value={values.username}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.username && Boolean(errors.username)}
            helperText={touched.username && errors.username}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Password"
            name="password"
            type="password"
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.password && Boolean(errors.password)}
            helperText={touched.password && errors.password}
          />
          <Box sx={{ mt: 2, position: "relative" }}>
            <Button type="submit" fullWidth variant="contained" color="primary" disabled={isSubmitting}>
              Sign In
            </Button>
            {isSubmitting && <CircularProgress size={24} sx={{ position: "absolute", right: 16, top: 8 }} />}
          </Box>
        </Form>
      )}
    </Formik>
  );
}
