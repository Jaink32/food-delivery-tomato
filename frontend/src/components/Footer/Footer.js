import React from "react";
import classes from "./footer.module.css";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={classes.footer}>
      <div className={classes.container}>
        <div className={classes.copyright}>
          © {currentYear} Tomato! | All Rights Reserved
        </div>
        {/* Add more footer content here if needed later */}
        {/* 
        <div className={classes.links}>
          <a href="/">Home</a>
          <a href="/about">About</a> 
          <a href="/privacy">Privacy Policy</a>
        </div>
        */}
      </div>
    </footer>
  );
}
