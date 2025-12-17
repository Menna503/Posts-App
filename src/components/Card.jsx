import * as React from "react";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { red } from "@mui/material/colors";
import FavoriteIcon from "@mui/icons-material/Favorite";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Box } from "@mui/material";
import PostForm from "./PostForm";
import axios from "axios";
import { toast } from "react-toastify";
import ConfirmDeleteDialog from "./ConfirmDelete";
import { API_BASE_URL } from "../config";
const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme }) => ({
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

export default function RecipeReviewCard({
  title,
  description,
  id,
  imgUrl,
  userId,
  loginUser,
  token,
  setRefresh,
}) {
  const [clicked, setClicked] = React.useState(false);
  const [editOpen, setEditOpen] = React.useState(false);
  const [authorName, setAuthorName] = React.useState("");
  const [openConfirm, setOpenConfirm] = React.useState(false);
  const openDeleteConfirm = () => setOpenConfirm(true);
  const closeDeleteConfirm = () => setOpenConfirm(false);

  React.useEffect(() => {
    const fetchUserName = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAuthorName(res.data.name);
      } catch (err) {
        console.error("Failed to load author name", err);
        setAuthorName("Unknown");
      }
    };
    fetchUserName();
  }, [userId]);
  const handelClick = () => {
    setClicked(!clicked);
  };

  const handelEditOpen = () => {
    setEditOpen(true);
  };

  const handleEditClose = () => {
    setEditOpen(false);
  };
  const handeDelete = async () => {
    try {
      console.log("post id :", id);
      const res = await axios.delete(`${API_BASE_URL}/posts/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Post deleted successfully!");
      setRefresh((prev) => !prev);
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete post.");
    }
  };
  return (
    <>
      <Card
        sx={{
          maxWidth: 450,
          minWidth: 345,
          maxHeight: 600,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <CardHeader title={title} subheader={`by ${authorName}`} />
        <CardMedia
          component="img"
          height="194"
          image={imgUrl || "https://via.placeholder.com/345x194"} // fallback
          alt="Post image"
          sx={{
            objectFit: "cover",
          }}
        />
        <CardContent sx={{ flexGrow: 1, maxHeight: "100", overflowY: "auto" }}>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {description}
          </Typography>
        </CardContent>
        <CardActions
          disableSpacing
          sx={{ display: "flex", justifyContent: "space-between" }}
        >
          <Box>
            <IconButton aria-label="add to favorites" onClick={handelClick}>
              <FavoriteIcon sx={{ color: clicked ? red[500] : "gray" }} />
            </IconButton>
          </Box>
          {token && userId === loginUser && (
            <Box>
              <IconButton onClick={handelEditOpen}>
                <EditIcon />
              </IconButton>
              <IconButton onClick={openDeleteConfirm}>
                <DeleteIcon />
              </IconButton>
            </Box>
          )}
        </CardActions>
      </Card>

      {editOpen && (
        <PostForm
          loginUser={loginUser}
          userId={userId}
          token={token}
          initialData={{ id, title, description, imgUrl }}
          isEdit={editOpen}
          onClose={handleEditClose}
          setRefresh={setRefresh}
        />
      )}
      <ConfirmDeleteDialog
        open={openConfirm}
        onClose={closeDeleteConfirm}
        onConfirm={() => {
          handeDelete();
          closeDeleteConfirm();
        }}
      />
    </>
  );
}
