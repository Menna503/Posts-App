import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import * as yup from "yup";
import axios from "axios";
import { Stack, Button, Typography } from "@mui/material";
import { object, string, ref } from "yup";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from '../config'
const userSchema = object({
  email: string().required("Email is required"),
  password: string().required("Password is required"),
});
export default function Login({handelSignin}) {
   const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [formError, setFormError] = useState({
    email: "",
    password: "",
  });

  const handelSubmit = async (e) => {
    setFormError({
      email: "",
      password: "",
    });
    e.preventDefault();
    try {
      const user = await userSchema.validate(formData, { abortEarly: false });
      console.log(user);
     const res = await axios.post(`${API_BASE_URL}/login`, {
      email: formData.email,
      password: formData.password,
    });
    console.log(res);
       if(res.status===200){
        // localStorage.setItem("token",res.data.accessToken);
        handelSignin(res.data.accessToken);
        navigate('/');
       }
       else{
         setFormError((prev) => ({
          ...prev,
          password: "Email or password is incorrect",
        }));
       }
       
     
      // const users = res.data;
      // const loginUser = users.find(
      //   (i) => i.email === formData.email && i.password === formData.password
      // );
      // console.log(loginUser);
      // if (loginUser) {
      //   // go to post page
      // } else {
 
      //   setFormError((prev) => ({
      //     ...prev,
      //     password: "Email or password is incorrect",
      //   }));
      // }
    } catch (error) {
      console.dir(error);
      if(error.name="ValidationError"&&error.inner){
      error.inner.forEach((element) => {
        setFormError((prev) => ({
          ...prev,
          [element.path]: element.errors,
        }));
      });}
       if(error.response && error.response.status===400){
       setFormError((prev) => ({
        ...prev,
        password: "Email or password is incorrect",
      }));
    }
    }
   
  };

  const handelChange = (e) => {
    const { name, value } = e.target;

    const updatedData = {
      ...formData,
      [name]: value,
    };

    setFormData(updatedData);
  };

  return (
    <>
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={3}
        justifyContent={"center"}
        paddingBottom={{ xs: 3, md: 0 }}
      >
        <Box sx={{ flex: 1, display: "flex", justifyContent: "end" }}>
          <Box
            component="img"
            src="src/assets/form.svg"
            alt="Sign Up Illustration"
            sx={{
              width: { xs: "100%", md: "90%" },
              height: "auto",
            }}
          />
        </Box>
        <Box
          component="form"
          onSubmit={handelSubmit}
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: 2,
            alignItems: { xs: "center", md: "flex-start" },
          }}
        >
          <Typography
            variant="h1"
            component="h2"
            fontSize={"36px"}
            textAlign={"center"}
            width={"80%"}
            fontWeight={600}
          >
            welcome back
          </Typography>

          <TextField
            id="email"
            label="Email"
            name="email"
            value={formData.email}
            onChange={handelChange}
            variant="outlined"
            helperText={formError.email}
            error={formError.email}
            sx={{
              "& .MuiInputBase-input": {
                fontSize: "18px",
                padding: "12px",
              },
              width: { xs: "100%", md: "80%" },
            }}
          />
          <TextField
            id="password"
            label="Password"
            name="password"
            variant="outlined"
            value={formData.password}
            onChange={handelChange}
            helperText={formError.password}
            error={formError.password}
            sx={{
              "& .MuiInputBase-input": {
                fontSize: "18px",
                padding: "12px",
              },
              width: { xs: "100%", md: "80%" },
            }}
          />

          <Button
            type="submit"
            variant="contained"
            sx={{ width: { xs: "100%", md: "80%" }, padding: "12px" }}
          >
            Sign in
          </Button>
          <Typography
            variant="p"
            component="p"
            fontSize={"16px"}
            textAlign={"center"}
            width={"80%"}
            fontWeight={400}
          >
            If you do not have an account please{" "}
            <span
              style={{
                color: "blue",
                cursor: "pointer",
                textDecoration: "underline",
              }}
              onClick={() => navigate("/signup")}
            >
              Sign up
            </span>
          </Typography>
        </Box>
      </Stack>
    </>
  );
}
