import Link from "next/link";
import { auth } from "../firebase";
import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import StarIcon from "@mui/icons-material/StarBorder";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import GlobalStyles from "@mui/material/GlobalStyles";
import Container from "@mui/material/Container";
import MenuIcon from "@mui/icons-material/Menu";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#1976d2",
    },
  },
});
export default function NavBar({ user }) {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <React.Fragment>
      <GlobalStyles
        styles={{ ul: { margin: 0, padding: 0, listStyle: "none" } }}
      />
      <CssBaseline />

      <ThemeProvider theme={darkTheme}>
        <AppBar
          position="static"
          color="default"
          elevation={0}
          sx={{ borderBottom: (theme) => `1px solid ${theme.palette.divider}` }}
        >
          <Toolbar sx={{ flexWrap: "wrap" }}>
            <Typography
              variant="h6"
              color="inherit"
              noWrap
              sx={{ flexGrow: 1 }}
            >
              {user ? (
                <>
                  {user?.uid == "Z5vixpDzQnS0DXauTSP7A0VVup43" ? (
                    <Link href="/" className="brand-logo">
                      Admin Board
                    </Link>
                  ) : (
                    <Link href="/" className="brand-logo">
                      User Board
                    </Link>
                  )}
                </>
              ) : (
                <Link href="/" className="brand-logo">
                  Public Board
                </Link>
              )}
            </Typography>
            {user && (
              <>
                <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
                  <IconButton
                    size="large"
                    aria-label="account of current user"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    onClick={handleOpenNavMenu}
                    color="inherit"
                  >
                    <MenuIcon />
                  </IconButton>
                  <Menu
                    id="menu-appbar"
                    anchorEl={anchorElNav}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "left",
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "left",
                    }}
                    open={Boolean(anchorElNav)}
                    onClose={handleCloseNavMenu}
                    sx={{
                      display: { xs: "block", md: "none" },
                    }}
                  >
                    <MenuItem >
                    <Link href={"/uploadImage"}>
                      <Typography textAlign="center">Upload Image</Typography>
                      </Link>
                    </MenuItem>
                  </Menu>
                </Box>
                <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
                  <Link href={"/uploadImage"}>
                    <Button sx={{ my: 2, color: "white", display: "block" }}>
                      Upload Image
                    </Button>
                  </Link>
                </Box>
              </>
            )}
            {user ? (
              <>
              <Button variant="outlined" sx={{ my: 1, mx: 1.5 }} onClick={() => auth.signOut()}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href={"/signup"}>
                  <Button variant="outlined" sx={{ my: 1, mx: 1.5 }}>
                    Sign up
                  </Button>
                </Link>
                <Link href={"/login"}>
                  <Button variant="outlined" sx={{ my: 1, mx: 1.5 }}>
                    Sign in
                  </Button>
                </Link>
              </>
            )}
          </Toolbar>
        </AppBar>
      </ThemeProvider>
    </React.Fragment>
  );
}
