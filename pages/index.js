import { db } from "../firebase";
import { doc, updateDoc, deleteDoc} from "firebase/firestore";
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
const theme = createTheme();

const Demo = styled("div")(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
}));

export default function Home({ Allimages }) {
  const [images, setimages] = useState(Allimages);
  const [end, setEnd] = useState(false);
  const [dense, setDense] = React.useState(false);
  const [secondary, setSecondary] = React.useState(false);
  console.log("All Images", Allimages);
  const handledelete = async (e) => {
    const docRef = doc(
      db,
      "images",
      e
    );
    await deleteDoc(docRef)
      .then(() => {
        console.log(
          `${e.target.parentNode.children[0].textContent} has been deleted successfully.`
        );
      })
      .catch((error) => {
        console.log(error);
      });
  };
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
              <Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div">
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
                            <ListItem
                              secondaryAction={
                                <IconButton edge="end" aria-label="delete">
                                  <DeleteIcon />
                                </IconButton>
                              }
                            >
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
              <Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div">
                Uploaded By Users
              </Typography>
              <Demo>
                <List dense={dense}>
                  {images
                    ?.filter((role) => role.role == "user")
                    ?.map((image) => {
                      return (
                        <ListItem
                        >
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
                          <IconButton edge="end" aria-label="delete" onClick={() =>handledelete(image.id)}>
                              <DeleteIcon />
                            </IconButton>
                        </ListItem>
                      );
                    })}
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
