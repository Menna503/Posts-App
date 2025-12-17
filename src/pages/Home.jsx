import React, { useEffect, useState } from "react";
import Navbar from "../components/navbar";
import Card from "../components/Card";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { Box, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import PostForm from "../components/PostForm";
import axios from "axios";
import { API_BASE_URL } from '../config'
export default function Home({ token,handelLogout}) {
  const [data,setData]=useState(null)
  // const token = localStorage.getItem("token");
  let loginUser = null;

if (token) {
  try {
    const user = JSON.parse(atob(token.split(".")[1]));
    loginUser = user.sub;
    console.log("login user:",loginUser)

  } catch (err) {
    console.error("Invalid token:", err);
  }
}
  // const user = JSON.parse(atob(token.split(".")[1])); // فك التوكن وجيب بياناته
  // const loginUser = user.sub;
  const [refresh, setRefresh] = useState(false);
  useEffect(()=>{
    const fetchPosts=async()=>{
       const res= await axios.get(`${API_BASE_URL}/posts`,{
        headers: { Authorization: `Bearer ${token}` },
     
      });
       console.log("all data",res.data)
       setData(res.data);
       console.log(res);
    }
    fetchPosts()
  },[refresh]);
  return (
    <>
      <Navbar   handelLogout={handelLogout} ></Navbar>
      <Box
        display={"flex"}
        gap={3}
        flexWrap={"wrap"}
        justifyContent={"center"}
        mt={3}
        mb={8}
      >
        
       {data&&data.map(i=><Card key={i.id} id={i.id} title={i.title} description={i.description} imgUrl={i.imgUrl} userId={i.userId} loginUser={loginUser} token={token}  setRefresh={setRefresh}></Card>)}
      </Box>

      {/* <IconButton
        sx={{ zIndex: 1000, position: "fixed", bottom: 20, left: " 90%" }}
      >
        <AddIcon
          fontSize="large"
          color="primary"
          sx={{ fontSize: "3em" }}
        ></AddIcon>
      </IconButton> */}
        <PostForm loginUser={loginUser} token={token}  setRefresh={setRefresh}></PostForm>
    </>
  );
}
