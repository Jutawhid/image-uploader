import { db, storage } from "../firebase";
import { deleteObject, ref } from "firebase/storage";
import Link from "next/link";
import { useState } from "react";
import * as React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import FolderIcon from "@mui/icons-material/Folder";
import DeleteIcon from "@mui/icons-material/Delete";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Image from "next/image";
import { toast } from "react-toastify";
const theme = createTheme();

const Demo = styled("div")(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
}));

export default function Home({ Allimages, user }) {
  // const database = getFirestore();
  const [images, setimages] = useState([]);
  const [dense, setDense] = React.useState(false);
  const [secondary, setSecondary] = React.useState(false);
  console.log("All Images", Allimages);
  React.useEffect(() => {
    setimages(Allimages);
  }, [images]);
  const handledelete = async (id, imageUrl) => {
    // const docRef = db.collection("images", e);

    await db
      .collection("images")
      .doc(id)
      .delete()
      .then((res) => {
        console.log("res", res);
        toast.success("Image Successfully Deleted");
        setTimeout(() => {
          location.reload();
        }, 2000);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  console.log("image", images);
  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} md={12}>
              <Typography sx={{ mt: 4, mb: 2 ,textAlign: 'center'}} variant="h6" component="div">
                Uploaded By Admin
              </Typography>
              <Demo>
                <List dense={dense}>
                  {images?.filter((role) => role.role == "admin")?.length !==
                  0 ? (
                    <>
                      {images
                        ?.filter((role) => role.role == "admin")
                        ?.map((image) => {
                          return (
                            <ListItem>
                              <ListItemAvatar>
                                <Avatar>
                                  <Image
                                    src={image.imageUrl}
                                    alt={image?.title}
                                    width={50}
                                    height={50}
                                  />
                                </Avatar>
                              </ListItemAvatar>
                              <ListItemText />
                              {image?.title && image.title}
                              {image?.postedBy == user?.uid && (
                                <IconButton
                                  edge="end"
                                  aria-label="delete"
                                  onClick={() => handledelete(image.id)}
                                >
                                  <DeleteIcon />
                                </IconButton>
                              )}
                            </ListItem>
                          );
                        })}
                    </>
                  ) : (
                    <p style={{ color: "gray" }}>No Image Uploaded</p>
                  )}
                </List>
              </Demo>
            </Grid>
          </Grid>
        </Box>
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} md={12}>
              <Typography sx={{ mt: 4, mb: 2, textAlign: 'center' }} variant="h6" component="div">
                Uploaded By Users
              </Typography>
              <Demo>
                <List dense={dense}>
                  {images?.filter((role) => role.role == "admin")?.length !==
                  0 ? (
                    <>
                      {images
                        ?.filter((role) => role.role == "user")
                        ?.map((image) => {
                          return (
                            <ListItem>
                              <ListItemAvatar>
                                <Avatar>
                                  {/* <FolderIcon /> */}
                                  {/* <Image src={image.imageUrl} width="50" height="50" /> */}
                                  <Image
                                    // loader={myLoader}
                                    src={image.imageUrl}
                                    alt={image?.title}
                                    width={50}
                                    height={50}
                                  />
                                </Avatar>
                              </ListItemAvatar>
                              <ListItemText />
                              {image?.title && image.title}
                              {image?.postedBy == user?.uid && (
                                <IconButton
                                  edge="end"
                                  aria-label="delete"
                                  onClick={() => handledelete(image.id)}
                                >
                                  <DeleteIcon />
                                </IconButton>
                              )}
                            </ListItem>
                          );
                        })}
                    </>
                  ) : (
                    <p style={{ color: "gray" }}>No Image Uploaded</p>
                  )}
                </List>
              </Demo>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export async function getServerSideProps(context) {
  const querySnap = await db
    .collection("images")
    .orderBy("createdAt", "desc")
    .get();
  const Allimages = querySnap.docs.map((docSnap) => {
    return {
      ...docSnap.data(),
      createdAt: docSnap.data().createdAt.toMillis(),
      id: docSnap.id,
    };
  });

  return {
    props: { Allimages }, // will be passed to the page component as props
  };
}
