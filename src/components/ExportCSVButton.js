import React from "react";

import { Button } from "@material-ui/core";
import GetAppIcon from "@material-ui/icons/GetApp";

import { blueColor } from "../utils/colors";

const ExportCSVButton = ({ style = {}, onClick }) => {
  return (
    <div style={{ ...style }} onClick={onClick}>
      <Button style={{ color: blueColor, float: "right" }}>
        Exportar CSV
        <GetAppIcon style={{ color: blueColor }} />
      </Button>
    </div>
  );
};

export default ExportCSVButton;
