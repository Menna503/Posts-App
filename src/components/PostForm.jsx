import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import AddIcon from "@mui/icons-material/Add";
import { Box, Card, IconButton, TextField } from "@mui/material";
import { useState } from "react";
import { Description } from "@mui/icons-material";
import { object, string } from "yup";
import axios from "axios";
import { toast } from 'react-toastify';
import { API_BASE_URL } from "../config";

export default function PostForm({
  loginUser,
  token,
  initialData,
  isEdit,
  onClose,
  setRefresh
  
}) {
  const [open, setOpen] = React.useState(false);
  const handleClose = () => {
    isEdit ? onClose() : setOpen(false);
  };
  const handleClickOpen = () => {
    if(!token){
      toast.error("Please login first");
      return
    }

    setOpen(true);
  };
 
  const [formData, setFormData] = useState({
    title: isEdit ? initialData.title : "",
    description: isEdit ? initialData.description : "",
    imgUrl: isEdit ? initialData.imgUrl : "",
  });
  const [formError, setFormError] = useState({
    title: "",
    description: "",
    imgUrl: "",
  });
  const postSchema = object({
    title: string().required(),
    description: string().required(),
    imgUrl: string().required(),
  });
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError({
      title: "",
      description: "",
      imgUrl: "",
    });
    try {
      await postSchema.validate(formData, { abortEarly: false });
      console.log("login id", loginUser);
      console.log(token);
      let res;
      console.log("isEdit",isEdit);
      if (isEdit) {
       res = await axios.patch(`${API_BASE_URL}/posts/${initialData?.id}`,formData ,{
          headers: { Authorization: `Bearer ${token}` },
        });
         toast.success("Post updated  successfully!");
      } else {
         res = await axios.post(
          `${API_BASE_URL}/posts`,
          { ...formData, userId:loginUser },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        toast.success("Post added successfully!");
        console.log("added sucessfully");
      }
      console.log(res);
      console.log("setRefresh type:", typeof setRefresh);

      setRefresh(prev => !prev); 
      setFormData({
        title:"",
        description:"",
        imgUrl:""
      })
      handleClose();
    } catch (err) {
      toast.error("Something went wrong  refresh and try again!");
      console.dir(err);
     err.inner&& err.inner.forEach((element) => {
        setFormError((prev) => ({
          ...prev,
          [element.path]: element.errors,
        }));
      });
    }

    console.log(formData);
  };
  const handelChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  return (
    <React.Fragment>
      {/* <Button variant="outlined" onClick={handleClickOpen}>
        Open alert dialog
      </Button> */}
      <IconButton
        sx={{
          zIndex: 1000,
          position: "fixed",
          bottom: { xs: 50, md: 30 },
          right: { xs: 5, md: 30 },
        }}
        onClick={handleClickOpen}
      >
        <AddIcon
          fontSize="inherit"
          color="primary"
          sx={{ fontSize: { xs: "2.5em", md: "3em" } }}
        ></AddIcon>
      </IconButton>
      <Dialog
        open={open | isEdit}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        sx={{ "& .MuiDialog-paper": { width: "600px" } }}
      >
        <DialogTitle id="alert-dialog-title" sx={{ textAlign: "center" }}>
          {"Add New Post"}
        </DialogTitle>
        <DialogContent>
          <Box
            component="form"
            display={"flex"}
            flexDirection={"column"}
            gap={3}
          >
            <TextField
              id="title"
              name="title"
              label="Title"
              variant="outlined"
              value={formData.title}
              onChange={handelChange}
              helperText={formError.title}
              error={formError.title}
            />
            <TextField
              id="description"
              label="description"
              name="description"
              value={formData.description}
              onChange={handelChange}
              multiline
              rows={4}
              helperText={formError.description}
              error={formError.description}
            />
            <TextField
              id="ImageUrl"
              name="imgUrl"
              label="Image Url"
              value={formData.imgUrl}
              onChange={handelChange}
              variant="outlined"
              helperText={formError.imgUrl}
              error={formError.imgUrl}
            />
            <DialogActions>
              <Button onClick={handleClose}>cancle</Button>
              <Button type="submit" onClick={handleSubmit} autoFocus>
                submit
              </Button>
            </DialogActions>
          </Box>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
}
