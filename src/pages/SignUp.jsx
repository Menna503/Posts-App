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
  name: string().required("Name is required"),
  email: string().email("Invalid email").required("Email is required"),
  password: string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
  confirmPassword: string()
    .oneOf([ref("password")], "Passwords must match")
    .required("Confirm Password is required"),
});
export default function SignUP() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [formError, setFormError] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  //   const theme = useTheme();
  //   const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  //   const md = useMediaQuery(theme.breakpoints.down("md"));
  const handelSubmit = async (e) => {
    setFormError({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
    e.preventDefault();
    try {
      const user = await userSchema.validate(formData, { abortEarly: false });
     
      const res = await axios.post(`${API_BASE_URL}/users`, user);
      console.log("user added sucessfully", res);
      localStorage.setItem("token", res.data.accessToken);
      //reset form
      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
      // go to login page

      navigate("/login");
    } catch (error) {
      console.dir(error);
      error.inner.forEach((element) => {
        setFormError((prev) => ({
          ...prev,
          [element.path]: element.errors,
        }));
      });
    }
  };

  //   const handelChange = (e) => {
  //     const { name, value } = e.target;

  //     setFormData((prev) => ({
  //       ...prev,
  //       [name]: value,
  //     }));

  //     setFormError({
  //       name: "",
  //       email: "",
  //       password: "",
  //       confirmPassword: "",
  //     });
  //     try {
  //       const user = userSchema.validateSync(formData, { abortEarly: false });
  //       console.log(user);
  //     } catch (error) {
  //       console.dir(error);
  //       error.inner.forEach((element) => {
  //         setFormError((prev) => ({
  //           ...prev,
  //           [element.path]: element.errors,
  //         }));
  //       });
  //     }
  //   };
  //   const handelChange = (e) => {
  //   const { name, value } = e.target;

  //   setFormData((prev) => ({
  //     ...prev,
  //     [name]: value,
  //   }));

  //   // Validate only the current field
  //   yup
  //     .reach(userSchema, name)
  //     .validate(value)
  //     .then(() => {
  //       setFormError((prev) => ({
  //         ...prev,
  //         [name]: "",
  //       }));
  //     })
  //     .catch((error) => {
  //         console.dir(error);
  //       setFormError((prev) => ({
  //         ...prev,
  //         [name]: error.message,
  //       }));
  //     });
  // };
  const handelChange = (e) => {
    const { name, value } = e.target;

    const updatedData = {
      ...formData,
      [name]: value,
    };

    setFormData(updatedData);

    if (name === "confirmPassword") {
      // Validate full form because confirmPassword depends on password
      userSchema
        .validate(updatedData, { abortEarly: false })
        .then(() => {
          setFormError((prev) => ({
            ...prev,
            confirmPassword: "",
          }));
        })
        .catch((error) => {
          const confirmError = error.inner.find(
            (err) => err.path === "confirmPassword"
          );
          setFormError((prev) => ({
            ...prev,
            confirmPassword: confirmError ? confirmError.message : "",
          }));
        });
    } else {
      // Validate single field
      yup
        .reach(userSchema, name)
        .validate(value)
        .then(() => {
          setFormError((prev) => ({
            ...prev,
            [name]: "",
          }));
        })
        .catch((error) => {
          setFormError((prev) => ({
            ...prev,
            [name]: error.message,
          }));
        });
    }
  };

  return (
    <>
      {/* <TextField  error id="outlined-basic" label="Name" variant="outlined"   helperText="Email is required" required	 sx={{
    width: '100%',
    '& .MuiInputBase-input': {
    //   fontSize: '18px',
    //   padding: '12px',   
    },
    '& .MuiInputLabel-root': {
    //   fontSize: '16px',  
    }
  }}/> */}
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
            Create an account
          </Typography>

          <TextField
            id="name"
            label="Name"
            name="name"
            value={formData.name}
            onChange={handelChange}
            variant="outlined"
            helperText={formError.name}
            error={formError.name}
            sx={{
              "& .MuiInputBase-input": {
                fontSize: "18px",
                padding: "12px",
              },
              "& .MuiInputLabel-root": {
                //   fontSize: '14px',
              },

              width: { xs: "100%", md: "80%" },
            }}
          />
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
          <TextField
            id="confirm"
            label="Confirm Password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handelChange}
            variant="outlined"
            helperText={formError.confirmPassword}
            error={formError.confirmPassword}
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
            Sign UP
          </Button>
          <Typography
            variant="p"
            component="p"
            fontSize={"16px"}
            textAlign={"center"}
            width={"80%"}
            fontWeight={400}
          >
            Already have an account?{" "}
            <span
              style={{
                color: "blue",
                cursor: "pointer",
                textDecoration: "underline",
              }}
              onClick={() => navigate("/login")}
            >
              Sign in
            </span>
          </Typography>
        </Box>
      </Stack>
    </>
  );
}
