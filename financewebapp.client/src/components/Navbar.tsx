import { Link, useMatch, useResolvedPath } from "react-router-dom";
import "../styleSheets/Navbar.css";
import React from "react";

const Navbar: React.FC = () => {
  return (
    <nav className="nav">
      <Link to="/" className="site-title">
        Finance Web App
      </Link>
      <ul>
        <CustomLink to="myportfolio">Min portefølje</CustomLink>
        <CustomLink to="trading">Trade side</CustomLink>
        <CustomLink to="calendar">Kalender</CustomLink>
        <CustomLink to="mypage">Min side</CustomLink>
      </ul>
    </nav>
  );
};

interface CustomLinkProps {
  to: string;
  children: React.ReactNode;
}

const CustomLink: React.FC<CustomLinkProps & React.AnchorHTMLAttributes<HTMLAnchorElement>> = ({ to, children, ...props }) => {
  const resolvedPath = useResolvedPath(to);
  const isActive = useMatch({ path: resolvedPath.pathname, end: true });
  
  return (
    <li className={isActive ? "active" : ""}>
      <Link to={to} {...props}>
        {children}
      </Link>
    </li>
  );
};

export default Navbar;