import React, { useState, useEffect } from "react";
import { connect } from "react-redux";

import SnackBar from "./SnackBar";
import { API } from "../providers";
import CategoryCard from "./CategoryCard";

const Categories = () => {
  const [categories, setCategories] = useState([]);

  const [snackBarData, setSnackBarData] = useState({});
  const [openSnackBar, setOpenSnackBar] = React.useState(false);

  const resetSnackBarState = () => {
    setOpenSnackBar(false);
    setSnackBarData({});
  };

  useEffect(() => {
    const fetchCategories = async () => {
      resetSnackBarState();
      const { err, data } = await API.getCategories();

      if (err) {
        setSnackBarData({ text: err.description, severity: "error" });
        setOpenSnackBar(true);
        return;
      }

      setCategories(data);
    };

    fetchCategories();
  }, []);

  return (
    <div style={{ display: "flex", flex: 1, flexWrap: "wrap", width: "75%", margin: "0 auto", marginTop: 64 }}>
      <SnackBar data={snackBarData} open={openSnackBar} setOpen={setOpenSnackBar} />
      {!!categories.length &&
        categories.map((category) => {
          return <CategoryCard key={category.id} data={category} />;
        })}
    </div>
  );
};

const mapStateToProps = ({ authedUser }) => {
  return { authedUser };
};

export default connect(mapStateToProps)(Categories);
