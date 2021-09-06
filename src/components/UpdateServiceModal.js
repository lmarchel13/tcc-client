import React, { useState, useEffect } from "react";
import { connect } from "react-redux";

import Modal from "@material-ui/core/Modal";
import TextField from "@material-ui/core/TextField";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormLabel from "@material-ui/core/FormLabel";
import Input from "@material-ui/core/Input";
import InputAdornment from "@material-ui/core/InputAdornment";

import SnackBar from "./SnackBar";
import TimePicker from "./TimePicker";

import { API } from "../providers";

import { makeStyles } from "@material-ui/core/styles";
import { blueBg, blueColor } from "../utils/colors";
import { Button } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 800,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

const UpdateServiceModal = ({ open, setOpen, authedUser, categories, data: service, onUpdateCallback }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [duration, setDuration] = useState("00:30");
  const [type, setType] = useState("");
  const [value, setValue] = useState("");

  const [snackBarData, setSnackBarData] = useState({});
  const [openSnackBar, setOpenSnackBar] = React.useState(false);

  const resetSnackBarState = () => {
    setOpenSnackBar(false);
    setSnackBarData({});
  };

  useEffect(() => {
    if (!service) return;
    setName(service.name);
    setDescription(service.description);
    setCategoryId(service.category);
    setType(service.type);
    setValue(service.value);
    setDuration(service.duration);
  }, [service]);

  const classes = useStyles();
  const top = 50;
  const left = 50;

  const onSubmit = async () => {
    resetSnackBarState();

    const payload = {
      name,
      description,
      categoryId,
      duration,
      type,
      value,
    };

    const token = authedUser.jwt;
    const { err } = await API.updateService(service.company.id, service.id, payload, token);

    if (err) {
      let msg = err.description;
      if (err.code === 400) {
        msg = "Preencha todos os campos requeridos";
      }
      setSnackBarData({ text: msg, severity: "error" });
    } else {
      setSnackBarData({ text: "Serviço atualizado com sucesso", severity: "success" });
      setOpen(false);
      onUpdateCallback(payload);
    }

    setOpenSnackBar(true);
  };

  return (
    <div>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <div
          style={{
            top: `${top}%`,
            left: `${left}%`,
            transform: `translate(-${top}%, -${left}%)`,
            display: "flex",
            flexDirection: "column",
          }}
          className={classes.paper}
        >
          <h2 style={{ marginBottom: 32, fontFamily: "Futura" }}>Atualizar serviço</h2>

          <div style={{ display: "flex", flex: 1, width: "100%" }}>
            <TextField
              label="Nome"
              style={{ flex: 1 }}
              onChange={(e) => setName(e.target.value)}
              value={name}
              focused={true}
              required={true}
            />
          </div>
          <div style={{ display: "flex", flex: 1, width: "100%" }}>
            <TextField
              label="Descrição"
              style={{ flex: 1 }}
              onChange={(e) => setDescription(e.target.value)}
              value={description}
              focused={true}
              required={true}
            />
          </div>
          <div style={{ display: "flex", flex: 1, width: "100%", marginTop: 16 }}>
            <FormControl style={{ flex: 1, marginRight: 8 }}>
              <InputLabel id="category-select" required={true}>
                Categoria
              </InputLabel>
              <Select id="category-select" value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
                {categories &&
                  categories.length &&
                  categories.map((category) => {
                    return (
                      <MenuItem key={category.id} value={category.id}>
                        {category.name}
                      </MenuItem>
                    );
                  })}
              </Select>
            </FormControl>
          </div>

          <div style={{ display: "flex", flex: 1, width: "100%", marginTop: 32 }}>
            <FormControl component="fieldset" style={{}}>
              <FormLabel component="legend" required={true}>
                Cobrança
              </FormLabel>
              <RadioGroup row aria-label="position" name="position">
                <FormControlLabel
                  value="fixed"
                  control={<Radio style={{ color: blueColor }} />}
                  label="Valor fixo"
                  onChange={(e) => setType(e.target.value)}
                  checked={type === "fixed"}
                />
                <FormControlLabel
                  value="by-hour"
                  control={<Radio style={{ color: blueColor }} />}
                  label="Por hora"
                  onChange={(e) => setType(e.target.value)}
                  checked={type === "by-hour"}
                />
              </RadioGroup>
            </FormControl>{" "}
            <TimePicker
              label="Duração *"
              time={duration}
              setTime={setDuration}
              defaultValue="00:30"
              style={{ marginLeft: 32, marginRight: 16, width: 100 }}
            />
            <FormControl style={{ flex: 1, marginLeft: 32 }}>
              <InputLabel htmlFor="standard-adornment-amount" required={true}>
                Valor
              </InputLabel>
              <Input
                style={{ width: "30%" }}
                id="standard-adornment-amount"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                startAdornment={<InputAdornment position="start">$</InputAdornment>}
              />
            </FormControl>
          </div>

          <Button
            style={{ backgroundColor: blueBg, color: blueColor, width: "70%", margin: "0 auto", marginTop: 16 }}
            onClick={onSubmit}
          >
            Atualizar
          </Button>
        </div>
      </Modal>
      <SnackBar data={snackBarData} open={openSnackBar} setOpen={setOpenSnackBar} />
    </div>
  );
};

const mapStateToProps = ({ authedUser, companies, categories }) => {
  return { authedUser, companies, categories };
};

export default connect(mapStateToProps)(UpdateServiceModal);
