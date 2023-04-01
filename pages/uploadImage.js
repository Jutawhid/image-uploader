import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { storage, db, serverTimestamp } from "../firebase";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Link from "next/link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { auth } from "../firebase";
import * as Yup from "yup";
import TextField from "@mui/material/TextField";
import LinearProgress from "@mui/material/LinearProgress";
import { toast } from "react-toastify";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import { CardActionArea } from "@mui/material";
const theme = createTheme();

export default function uploadImage({ user, Allimages }) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [image, setImage] = useState(null);
  const [imageList, setImageList] = useState(Allimages);
  const [url, setUrl] = useState("");
  const [progress, setProgress] = useState(0);
  const [uploadLimit, setUploadLimit] = useState(true);

  useEffect(() => {
    if (url) {
      try {
        db.collection("images").add({
          title,
          imageUrl: url,
          postedBy: user.uid,
          role: user.uid == "Z5vixpDzQnS0DXauTSP7A0VVup43" ? "admin" : "user",
          createdAt: serverTimestamp(),
        });
        // M.toast({ html: "Blog Created", classes: "green" });
        toast.success("Successfully Added");
        resetState();
      } catch (err) {
        // M.toast({ html: "error creating blog", classes: "red" });
        toast.error(err.message);
        console.log("Error", err.message);
        resetState();
      }
    }

    let limitCount = imageList?.filter(
      (item) => item?.postedBy == user?.uid
    )?.length;
    if (limitCount >= 2) {
      setUploadLimit(false);
    }
  }, [url, imageList]);
  const resetState = () => {
    setImage(null);
    setTitle("");
    setProgress(0);
    // setUrl("");
  };
  const SubmitDetails = () => {
    if (!title || !image) {
      toast.error("Please add all the fields");
      return;
    }
    if (uploadLimit) {
      var uploadTask = storage.ref().child(`image/${uuidv4()}`).put(image);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          var progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          if (progress == "100")
            //   M.toast({ html: "Image Uploaded", classes: "green" });
            toast.success("Image Uploaded");
          setProgress(100);
        },
        (error) => {
          // M.toast({ html: error.message, classes: "red" });
          toast.error(error.message);
        },
        () => {
          uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
            console.log("File available at", downloadURL);
            setUrl(downloadURL);
          });
        }
      );
    } else {
      toast.error("2 Limit end");
    }
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
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <CloudUploadIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Upload Image
          </Typography>
          <Box
            // component="form"
            // noValidate
            // onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Box marginY={2}>
                  <TextField
                    onChange={(e) => setTitle(e.target.value)}
                    label="Title"
                    name="title"
                    sx={{ width: "100%" }}
                  />
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  component="label"
                  sx={{ width: "100%" }}
                >
                  <span>Select Image</span>
                  {/* <input type="file" hidden /> */}
                  {/* {image ? (<span>{image}</span>) : (<span>Select Image</span>)} */}
                  <input
                    type="file"
                    hidden
                    onChange={(e) => setImage(e.target.files[0])}
                  />
                </Button>
                <div className="file-name">{image ? image.name : null}</div>
                {image && (
                  <Box className="my20" display="flex" alignItems="center">
                    <Box width="100%" mr={1}>
                      <LinearProgress variant="determinate" value={progress} />
                    </Box>
                    <Box minWidth={35}>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                      >{`${progress}%`}</Typography>
                    </Box>
                  </Box>
                )}
              </Grid>
            </Grid>
            <Button
              disabled={!image}
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={() => SubmitDetails()}
            >
              Submit
            </Button>
          </Box>
          {url != "" && (
            <Box>
              <Card sx={{ maxWidth: 345 }}>
                <CardActionArea>
                  <CardMedia
                    component="img"
                    height="140"
                    image={url}
                    alt="green iguana"
                  />
                </CardActionArea>
              </Card>
            </Box>
          )}
        </Box>
        <Grid container justifyContent="flex-start" sx={{ ml: "20px" }}>
          <Grid item>
            <Link href="/" variant="body2">
              Got To List
            </Link>
          </Grid>
        </Grid>
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
