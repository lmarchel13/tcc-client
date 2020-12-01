import React, { useState, useEffect, Fragment } from "react";
import { connect } from "react-redux";

import SnackBar from "./SnackBar";
import { API } from "../providers";
import CategoryCard from "./CategoryCard";
import Title from "./Title";

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
    <Fragment>
      <Title title="Categorias" />
      <div
        style={{
          display: "flex",
          flex: 1,
          flexWrap: "wrap",
          width: "75%",
          margin: "0 auto",
          marginTop: 64,
          justifyContent: "center",
        }}
      >
        {!!categories.length &&
          categories.map((category) => {
            return <CategoryCard key={category.id} data={category} />;
          })}
        <SnackBar data={snackBarData} open={openSnackBar} setOpen={setOpenSnackBar} />
      </div>
    </Fragment>
  );
};

const mapStateToProps = ({ authedUser }) => {
  return { authedUser };
};

export default connect(mapStateToProps)(Categories);
