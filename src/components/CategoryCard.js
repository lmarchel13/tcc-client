import React, { useState } from "react";
import { useHistory } from "react-router-dom";

import { makeStyles } from "@material-ui/core/styles";
import {
  DirectionsCar,
  ImportantDevices,
  Home,
  SportsSoccer,
  Build,
  Face,
  Favorite,
  LocalLibrary,
  Announcement,
} from "@material-ui/icons";

import { blueColor } from "../utils/colors";

const ICONS = {
  DirectionsCar: DirectionsCar,
  ImportantDevices: ImportantDevices,
  Home: Home,
  SportsSoccer: SportsSoccer,
  Build: Build,
  Face: Face,
  Favorite: Favorite,
  LocalLibrary: LocalLibrary,
  Announcement: Announcement,
};

const useStyles = makeStyles({
  root: {
    backgroundColor: "white",
    minWidth: 300,
    maxWidth: 300,
    minHeight: 250,
    maxHeight: 250,
    display: "flex",
    flex: "1",
    alignItems: "center",
    flexDirection: "column",
    margin: 32,
    boxShadow: "10px 10px 99px -5px rgba(0,0,0,0.16)",
    borderRadius: "10px 10px 10px 10px",
    border: "0px solid #000000",
  },
});

const CategoryCard = ({ data: { id, name, icon } } = {}) => {
  const classes = useStyles();
  const IconComponent = ICONS[icon] || Build;
  const history = useHistory();

  const [isHover, setIsHover] = useState(false);

  const onClick = (id) => {
    history.push(`/categories/${id}`);
  };

  return (
    <div
      className={classes.root}
      id={id}
      onClick={() => onClick(id)}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      style={{ border: isHover ? `0.6px solid ${blueColor}` : "0.6px solid transparent" }}
    >
      <div style={{ display: "flex", flex: 1, justifyContent: "center" }}>
        <IconComponent
          style={{
            color: blueColor,
            fontSize: 90,
            alignSelf: "center",
          }}
        />
      </div>
      <div style={{ display: "flex", flex: 1, margin: "0 auto" }}>
        <span style={{ fontSize: 24, marginTop: 12 }}>{name}</span>
      </div>
    </div>
  );
};

export default CategoryCard;
