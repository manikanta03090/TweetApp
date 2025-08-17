import React from "react";
import { Box, Button, TextField, CircularProgress } from "@mui/material";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { signup } from "../api/api";

export default function SignupForm({ onSuccess, onError }) {
  return (
    <Formik
      initialValues={{ username: "", password: "", email: "" }}
      validationSchema={Yup.object({
        username: Yup.string().min(3).required("Username is required"),
        password: Yup.string().min(6).required("Password is required"),
        email: Yup.string().email("Invalid email").required("Email is required"),
      })}
      onSubmit={async (values, { setSubmitting }) => {
        try {
          await signup(values);
          onSuccess();
        } catch (err) {
          onError(err?.response?.data?.message || "Signup failed");
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
            label="Email"
            name="email"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.email && Boolean(errors.email)}
            helperText={touched.email && errors.email}
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
              Sign Up
            </Button>
            {isSubmitting && <CircularProgress size={24} sx={{ position: "absolute", right: 16, top: 8 }} />}
          </Box>
        </Form>
      )}
    </Formik>
  );
}
