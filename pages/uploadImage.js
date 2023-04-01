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
import LinearProgress from '@mui/material/LinearProgress';
import { toast } from "react-toastify";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
const theme = createTheme();

export default function createblog({ user }) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [image, setImage] = useState(null);
  const [url, setUrl] = useState("");
  const [progress, setProgress] = useState(0);

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
      } catch (err) {
        // M.toast({ html: "error creating blog", classes: "red" });
        toast.error(err.message);
        console.log("Error", err.message);
      }
    }
  }, [url]);

  const SubmitDetails = () => {
    if (!title || !image) {
      toast.error("Please add all the fields");
      return;
    }
    var uploadTask = storage.ref().child(`image/${uuidv4()}`).put(image);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        if (progress == "100")
          //   M.toast({ html: "Image Uploaded", classes: "green" });
          toast.success("Image Uploaded");
          setProgress(100)
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
                    sx={{width:'100%'}}
                  />
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Button variant="contained" component="label" sx={{width:'100%'}}>
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
                      <LinearProgress
                        variant="determinate"
                        value={progress}
                      />
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
        </Box>
      </Container>
    </ThemeProvider>
    // <div className="input-field rootdiv">
    //     <h3>Create A Blog !!</h3>
    //     <input
    //     type="text"
    //     value={title}
    //     placeholder="Title"
    //     onChange={(e)=>setTitle(e.target.value)}

    //     />
    //     <textarea
    //      type="text"
    //      value={body}
    //      placeholder="body"
    //      onChange={(e)=>setBody(e.target.value)}

    //     />
    //      <div className="file-field input-field">
    //         <div className="btn #fb8c00 blue darken-1">
    //             <span>File</span>
    //             <input type="file"  onChange={(e)=>setImage(e.target.files[0])} />
    //         </div>
    //         <div className="file-path-wrapper">
    //             <input className="file-path validate" type="text" />
    //         </div>
    //      </div>
    //      <button className="btn #fb8c00 blue darken-1" onClick={()=>SubmitDetails()}>Submit Post</button>

    //      <style jsx>
    //          {`

    //          .rootdiv{
    //              margin:30px auto;
    //              max-width:600px;
    //              padding:20px;
    //              text-align:center;
    //          }
    //          `}
    //      </style>

    // </div>
  );
}
