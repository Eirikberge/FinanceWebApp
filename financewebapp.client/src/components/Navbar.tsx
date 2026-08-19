import { Link, useMatch, useResolvedPath } from "react-router-dom";
import React from "react";
import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";

const Navbar = () => {
  return (
    <AppBar position="static" sx={{ backgroundColor: "green" }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h4" component="div" sx={{ fontFamily: "Century Gothic, sans-serif" }}>
          Finance Web App
        </Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          <CustomLink to="myportfolio">Min portefølje</CustomLink>
          <CustomLink to="trading">Trade side</CustomLink>
          <CustomLink to="calendar">Kalender</CustomLink>
          <CustomLink to="mypage">Min side</CustomLink>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

type CustomLinkProps = {
  to: string;
  children: React.ReactNode;
}

const CustomLink = ({ to, children }: CustomLinkProps) => {
  const resolvedPath = useResolvedPath(to);
  const isActive = useMatch({ path: resolvedPath.pathname, end: true });

  return (
    <Button
      component={Link}
      to={to}
      sx={{
        color: "inherit",
        backgroundColor: isActive ? "#555" : "transparent",
        '&:hover': { backgroundColor: "#777" }
      }}
    >
      {children}
    </Button>
  );
};

export default Navbar;