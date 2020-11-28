import React from "react";
import { blueColor } from "../utils/colors";

const Title = ({ title, style = {} }) => {
  return (
    <div style={{ marginTop: 32, ...style }}>
      <h1 style={{ textAlign: "center", color: blueColor }}>{title}</h1>
    </div>
  );
};

export default Title;
