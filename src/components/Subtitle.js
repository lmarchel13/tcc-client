import React from "react";
import { blueColor } from "../utils/colors";

const Subtitle = ({ subtitle, style = {} }) => {
  return (
    <div style={{ marginTop: 32, ...style }}>
      <h2 style={{ textAlign: "center", color: blueColor }}>{subtitle}</h2>
    </div>
  );
};

export default Subtitle;
