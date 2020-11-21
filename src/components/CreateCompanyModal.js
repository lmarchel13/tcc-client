import React, { useEffect, useState } from "react";
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
import Divider from "@material-ui/core/Divider";
import FormGroup from "@material-ui/core/FormGroup";
import Checkbox from "@material-ui/core/Checkbox";

import TimePicker from "./TimePicker";

import { API, Cache, IbgeClient } from "../providers";

import { makeStyles } from "@material-ui/core/styles";
import { blueBg, blueColor } from "../utils/colors";
import { Button, Paper } from "@material-ui/core";

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

const WEEK_DAYS = [
  { value: 0, label: "S" },
  { value: 1, label: "T" },
  { value: 2, label: "Q" },
  { value: 3, label: "Q" },
  { value: 4, label: "S" },
  { value: 5, label: "S" },
  { value: 6, label: "D" },
];

export default function CreateCompanyModal({ open, setOpen }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postcode, setPostcode] = useState("");
  const [documentType, setDocumentType] = useState("");
  const [document, setDocument] = useState("");
  const [startTime, setStartTime] = useState("08:00");
  const [endTime, setEndTime] = useState("17:00");
  const [openDays, setOpenDays] = useState([]);
  const [plan, setPlan] = useState("");

  const [foundCity, setFoundCity] = useState("");

  const [cityOptions, setCityOptions] = useState([]);
  const [stateOptions, setStateOptions] = useState([]);
  const [planOptions, setPlanOptions] = useState([]);

  const [snackBarData, setSnackBarData] = useState({});
  const [openSnackBar, setOpenSnackBar] = React.useState(false);

  const resetSnackBarState = () => {
    setOpenSnackBar(false);
    setSnackBarData({});
  };

  const classes = useStyles();
  const top = 50;
  const left = 50;

  const onSubmit = async () => {
    const payload = {
      name,
      description,
      email,
      phone,
      address,
      city,
      state,
      postcode,
      documentType,
      document,
      startTime,
      endTime,
      openDays,
      plan,
    };

    const token = Cache.getToken();
    console.log({ payload, token });

    try {
      const { err, data } = await API.createCompany(payload, token);
      if (err) {
        setSnackBarData({ text: err.description, severity: "error" });
        setOpenSnackBar(true);
        return;
      }

      setOpen(false);
    } catch (error) {
      console.log(error);
      setSnackBarData({ text: error.message, severity: "error" });
      setOpenSnackBar(true);
    }
  };

  useEffect(() => {
    const fetchPlans = async () => {
      const { err, data } = await API.getPlans();

      if (err) return;

      setPlanOptions(data);
    };

    const fetchStates = async () => {
      const { err, data } = await IbgeClient.getStates();

      if (err) return;

      setStateOptions(data);
    };

    fetchStates();
    fetchPlans();
  }, []);

  useEffect(() => {
    setCityOptions([]);
    const fetchCities = async () => {
      const { err, data } = await IbgeClient.getCitiesByState(state);
      if (err) return;

      setCityOptions(data);
      setCity(foundCity);
    };

    fetchCities();
  }, [state]);

  let time;
  const handlePostcodeChange = async (e) => {
    setPostcode(e.target.value);
    clearTimeout(time);

    time = setTimeout(async () => {
      try {
        const {
          data: { localidade, uf, logradouro },
        } = await IbgeClient.getAddressByPostCode(e.target.value);

        setFoundCity(localidade);
        setState(uf);
      } catch (error) {
        console.log(error);
      }
    }, 1500);
  };

  const handlePlan = (id) => {
    const plans = planOptions.map((plan) => {
      if (plan.id === id) {
        plan.selected = true;
        setPlan(id);
      } else {
        plan.selected = false;
      }

      return plan;
    });

    setPlanOptions(plans);
  };

  const handleOpenDaysChange = (day) => {
    if (openDays.includes(day)) {
      setOpenDays(openDays.filter((val) => val !== day));
    } else {
      setOpenDays([...openDays, day]);
    }
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
          <h2>Criar empresa</h2>

          <div style={{ display: "flex", flex: 1, width: "100%" }}>
            <TextField
              label="Nome"
              style={{ flex: 1 }}
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
          </div>
          <div style={{ display: "flex", flex: 1, width: "100%" }}>
            <TextField
              label="Descrição"
              style={{ flex: 1 }}
              onChange={(e) => {
                setDescription(e.target.value);
              }}
            />
          </div>
          <div style={{ display: "flex", flex: 1, width: "100%" }}>
            <TextField
              label="E-mail"
              style={{ flex: 1, marginRight: 8 }}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
            <TextField
              label="Telefone"
              style={{ flex: 1, marginLeft: 8 }}
              onChange={(e) => {
                setPhone(e.target.value);
              }}
            />
          </div>
          <div style={{ display: "flex", flex: 1, width: "100%" }}>
            <TextField
              label="Endereço"
              style={{ flex: 1, marginRight: 8 }}
              onChange={(e) => {
                setAddress(e.target.value);
              }}
            />
            <TextField label="CEP" style={{ flex: 1, marginLeft: 8 }} onChange={handlePostcodeChange} />
          </div>
          <div style={{ display: "flex", flex: 1, width: "100%", marginTop: 16 }}>
            <FormControl style={{ flex: 1, marginRight: 8 }}>
              <InputLabel id="state-select">UF</InputLabel>
              <Select id="state-select" value={state} onChange={(e) => setState(e.target.value)}>
                {stateOptions &&
                  stateOptions.length &&
                  stateOptions.map(({ state }) => {
                    return (
                      <MenuItem key={state} value={state}>
                        {state}
                      </MenuItem>
                    );
                  })}
              </Select>
            </FormControl>
            <FormControl style={{ flex: 9, marginLeft: 8 }}>
              <InputLabel id="city-select">Cidade</InputLabel>
              <Select id="city-select" value={city} onChange={(e) => setCity(e.target.value)}>
                {cityOptions &&
                  cityOptions.length &&
                  cityOptions.map(({ city }) => {
                    return (
                      <MenuItem key={city} value={city}>
                        {city}
                      </MenuItem>
                    );
                  })}
              </Select>
            </FormControl>
          </div>
          <div style={{ display: "flex", flex: 1, width: "100%", marginTop: 16 }}>
            <FormControl component="fieldset">
              <FormLabel component="legend">Documento</FormLabel>
              <RadioGroup row aria-label="position" name="position">
                <FormControlLabel
                  value="CPF"
                  control={<Radio style={{ color: blueColor }} />}
                  label="CPF"
                  onChange={(e) => setDocumentType(e.target.value)}
                />
                <FormControlLabel
                  value="CNPJ"
                  control={<Radio style={{ color: blueColor }} />}
                  label="CNPJ"
                  onChange={(e) => setDocumentType(e.target.value)}
                />
              </RadioGroup>
            </FormControl>
            <TextField
              label="Número do documento"
              style={{ flex: 1, marginLeft: 8 }}
              onChange={(e) => {
                setDocument(e.target.value);
              }}
            />
          </div>
          <div style={{ display: "flex", flex: 1, width: "100%", marginTop: 16 }}>
            <div style={{ alignSelf: "center", marginRight: 8, flex: 1 }}>
              <InputLabel id="start-end-time-label">Horário de funcionamento</InputLabel>
            </div>
            <div style={{ display: "flex", marginLeft: 8, flex: 1 }}>
              <TimePicker label="Abertura" time={startTime} setTime={setStartTime} defaultValue="08:00" />
              <TimePicker label="Fechamento" time={endTime} setTime={setEndTime} defaultValue="17:00" />
            </div>
            <Divider orientation="vertical" flexItem style={{ marginLeft: 6 }} />
            <div style={{ alignSelf: "center", marginLeft: 16, padding: 0, flex: 1 }}>
              <InputLabel id="open-days-label">Dias da semana</InputLabel>
            </div>
            <div style={{ flex: 5 }}>
              <FormControl component="fieldset" name="days-checkbox">
                <FormGroup aria-label="position" row>
                  {WEEK_DAYS.map((day) => {
                    return (
                      <FormControlLabel
                        key={day.value}
                        value={day.value}
                        control={<Checkbox style={{ color: blueColor, margin: 0, padding: 0 }} />}
                        label={day.label}
                        labelPlacement="top"
                        onChange={() => handleOpenDaysChange(day.value)}
                      />
                    );
                  })}
                </FormGroup>
              </FormControl>
            </div>
          </div>
          <div style={{ display: "flex", flex: 1, width: "100%", marginTop: 16, flexDirection: "column" }}>
            <div style={{ alignSelf: "center", marginRight: 8, flex: 1 }}>
              <InputLabel id="plans-label">Planos</InputLabel>
            </div>
            <div style={{ alignSelf: "center", marginRight: 8, display: "flex", flex: 1 }}>
              {planOptions.map(({ id, name, value, selected }) => {
                return (
                  <Paper
                    style={{ height: 120, width: 160, margin: 16, border: selected ? `2px solid ${blueColor}` : "" }}
                    onClick={() => handlePlan(id)}
                    key={id}
                  >
                    <div
                      style={{
                        display: "flex",
                        flex: "1",
                        alignItems: "center",
                        flexDirection: "column",
                        margin: 32,
                      }}
                    >
                      <div style={{ flex: 1, alignSelf: "center" }}>
                        <span style={{ fontSize: 28, fontWeight: "bold" }}>{name}</span>
                      </div>
                      <div style={{ flex: 1, marginTop: 8 }}>
                        <span style={{ fontSize: 18 }}>
                          {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value)}
                        </span>
                      </div>
                    </div>
                  </Paper>
                );
              })}
            </div>
          </div>

          <Button
            style={{ backgroundColor: blueBg, color: blueColor, width: "70%", margin: "0 auto", marginTop: 16 }}
            onClick={onSubmit}
          >
            Criar
          </Button>
        </div>
      </Modal>
    </div>
  );
}
