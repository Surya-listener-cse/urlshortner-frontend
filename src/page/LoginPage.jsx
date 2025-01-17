import React, { useContext, useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Link, Outlet, useNavigate } from "react-router-dom";
import axios from "axios";
import * as yup from "yup";
import { useFormik } from "formik";
import { Alert, Snackbar } from "@mui/material";
import UrlContext from "../context/UrlContext";
import ThreeDotLoading from "../component/Loading";

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const theme = createTheme();

export default function Login() {
  const urlContext = useContext(UrlContext);
  const { loading, setLoading } = urlContext;

  const [enter, setEnter] = useState(false);
  const [data, setData] = useState("");
  const [type, setType] = useState("success");

  const navigate = useNavigate();

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setEnter(false);
  };

  const loginformdata = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: yup.object({
      email: yup.string().required("Email is required").email(),
      password: yup
        .string()
        .min(8, "enter minimum 8 char")
        .required("Password is required"),
    }),
    onSubmit: (userdata) => {
      setLoading("SET_LOADING");
      axios
        .post("https://urlshortner-backend-x4um.onrender.com/login", userdata)
        .then((response) => {
          setLoading("LOADED");
          setType("success");
          setEnter(true);
          setData("success");

          if (response.data) {
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("username", response.data.user["firstname"]);
            navigate(`/${response.data.user["firstname"]}`);
          }
        })
        .catch((err) => {
          setLoading("LOADED");
          setType("warning");
          setEnter(true);
          if (err.response.data) {
            setData(`${err.response.data}`);
          } else {
            setData("something went wrong");
          }
        });
    },
  });

  return (
    <>
      <ThemeProvider theme={theme}>
        <Grid container component="main" sx={{ height: "100vh" }}>
          <CssBaseline />
          <Grid
            item
            xs={false}
            sm={4}
            md={7}
            sx={{
              backgroundImage: "url(https://picsum.photos/1200/800)",
              backgroundRepeat: "no-repeat",
              backgroundColor: (t) =>
                t.palette.mode === "light"
                  ? t.palette.grey[50]
                  : t.palette.grey[900],
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <Grid
            item
            xs={12}
            sm={8}
            md={5}
            component={Paper}
            elevation={6}
            square
          >
            <Box
              sx={{
                my: 8,
                mx: 4,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
                <LockOutlinedIcon />
              </Avatar>
              <Typography component="h1" variant="h5">
                Sign in
              </Typography>
              <Box
                component="form"
                noValidate
                onSubmit={loginformdata.handleSubmit}
                sx={{ mt: 1 }}
              >
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  value={loginformdata.values.email}
                  onChange={loginformdata.handleChange}
                  autoFocus
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  value={loginformdata.values.password}
                  onChange={loginformdata.handleChange}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Sign In
                </Button>
                <Grid container>
                  <Grid item xs>
                    <Link to="/forget_password">Forgot password?</Link>
                  </Grid>
                  <Grid item>
                    <Link to="/register">
                      {"Don't have an account? Sign Up"}
                    </Link>
                  </Grid>
                </Grid>
                <Copyright sx={{ mt: 5 }} />
              </Box>
            </Box>
          </Grid>
        </Grid>
      </ThemeProvider>
      {loginformdata.errors.email ? (
        <Alert
          severity="warning"
          sx={{
            float: "right",
            position: "absolute",
            top: "0px",
            right: "0px",
          }}
        >
          {loginformdata.errors.email}
        </Alert>
      ) : (
        <></>
      )}
      {loginformdata.errors.password ? (
        <Alert
          severity="warning"
          sx={{
            float: "right",
            position: "absolute",
            top: "50px",
            right: "0px",
          }}
        >
          {loginformdata.errors.password}
        </Alert>
      ) : (
        <></>
      )}
      <Snackbar
        open={enter}
        autoHideDuration={2000}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        onClose={handleClose}
      >
        <Alert severity={type} sx={{ width: "100%" }}>
          {data}
        </Alert>
      </Snackbar>
      <div className={loading ? "d-block" : "d-none"}>
        <ThreeDotLoading />
      </div>
      <Outlet />
    </>
  );
}