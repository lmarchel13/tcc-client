import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";

import SnackBar from "./SnackBar";
import CreateCompanyModal from "./CreateCompanyModal";
import { API, Cache } from "../providers";
import { blueBg, blueColor } from "../utils/colors";

const MyCompanies = ({ authedUser }) => {
  const [companies, setCompanies] = useState([]);
  const [snackBarData, setSnackBarData] = useState({});
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [openModal, setOpenModal] = React.useState(false);

  const resetSnackBarState = () => {
    setOpenSnackBar(false);
    setSnackBarData({});
  };

  useEffect(() => {
    const fetchUserCompanies = async () => {
      if (!authedUser) return;
      resetSnackBarState();

      const token = Cache.getToken();
      const { data, err } = await API.getUserCompanies({ userId: authedUser, token });

      if (err) {
        setSnackBarData({ text: err.description, severity: "error" });
        setOpenSnackBar(true);
        return;
      }

      setCompanies(data);
    };

    fetchUserCompanies();
  }, [authedUser]);

  return (
    <div>
      <SnackBar data={snackBarData} open={openSnackBar} setOpen={setOpenSnackBar} />

      {!companies.length && (
        <Paper
          elevation={3}
          style={{
            margin: "0 auto",
            display: "flex",
            width: "40%",
            height: "300",
            marginTop: 64,
            padding: 32,
            flexDirection: "column",
          }}
        >
          <span style={{ width: "80%", margin: "0 auto", textAlign: "center", fontSize: 24 }}>
            Nenhuma empresa encontrada. Deseja criar sua primeira empresa?
          </span>
          <Button
            variant="contained"
            style={{ backgroundColor: blueBg, color: blueColor, width: "20%", margin: "0 auto", marginTop: 32 }}
            onClick={() => setOpenModal(true)}
          >
            Criar empresa
          </Button>
        </Paper>
      )}

      <CreateCompanyModal open={openModal} setOpen={setOpenModal} userId={authedUser} />
    </div>
  );
};

const mapStateToProps = ({ authedUser }) => {
  return { authedUser };
};

export default connect(mapStateToProps)(MyCompanies);
