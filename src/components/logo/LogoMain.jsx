import React from 'react';
import logo from "assets/images/koideli-logo.png";

const Logo = ({ onClick }) => {
  return (
    <img
      src={logo}
      alt="InkMelo"
      width={60}
      height={60}
      style={{ cursor: 'pointer' }} // Add pointer cursor to indicate it is clickable
      onClick={onClick} // Attach the onClick event to make it clickable
    />
  );
};

export default Logo;
