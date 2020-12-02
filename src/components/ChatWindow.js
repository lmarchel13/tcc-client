import { Paper } from "@material-ui/core";
import { connect } from "react-redux";
import moment from "moment";

import React, { Fragment, useState, useEffect } from "react";

import { Chip, Card, CardContent, Button, Typography, TextField } from "@material-ui/core";

import Title from "./Title";
import { blueBg, blueColor } from "../utils/colors";
import { API } from "../providers";

const UserCard = ({ name, timestamp, lastMessage, onClick }) => {
  return (
    <Card
      style={{
        backgroundColor: blueBg,
        minWidth: 390,
        maxWidth: 390,
        borderBottom: `0.2px solid ${blueColor}`,
        borderRadius: "0px",
      }}
      onClick={onClick}
    >
      <CardContent>
        <Typography variant="body2" component="p" style={{ color: "grey", float: "right" }}>
          {timestamp}
        </Typography>
        <Typography variant="h5" component="h2" style={{ fontFamily: "Futura", color: blueColor }} noWrap={true}>
          {name}
        </Typography>
        <Typography variant="body2" component="p" noWrap={true} style={{ color: "grey" }}>
          {lastMessage}
        </Typography>
      </CardContent>
    </Card>
  );
};

const MessageCard = ({ data }) => {
  const { id, text, direction } = data;

  const floatStyle = direction === "from-user" ? "left" : "right";
  const bgColor = direction === "from-user" ? "lightgray" : blueBg;

  return (
    <div key={id}>
      <Card
        style={{
          backgroundColor: bgColor,
          maxWidth: 200,
          margin: 5,
          float: floatStyle,
          marginRight: 36,
        }}
      >
        <Typography variant="body2" component="p" noWrap={false} style={{ padding: 8 }}>
          {text}
        </Typography>
      </Card>
    </div>
  );
};

const ChatWindow = ({ user, authedUser, companies }) => {
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [messagesByUser, setMessagesByUser] = useState({});
  const [messagesInChat, setMessagesInChat] = useState([]);

  useEffect(() => {
    const fetchMessages = async () => {
      const myCompaniesIDs = companies.map((company) => company.id);

      const { data, err } = await API.getMessagesForCompanies(myCompaniesIDs, authedUser.jwt);

      if (err) {
        // todo: add err handler
        return;
      }

      setMessagesByUser(data);
    };

    fetchMessages();
    setLoading(false);
  }, []);

  const addMessage = (msg) => {
    setMessagesInChat([...messagesInChat, msg]);
  };

  const handleMessageSend = () => {
    const message = {
      direction: "from-owner",
      text: newMessage,
    };

    addMessage(message);
    setNewMessage("");
  };

  const openChat = (id) => {
    const messages = messagesByUser[id];
    setMessagesInChat(messages);
  };

  return (
    <Fragment>
      <Title title="Minhas mensages" />
      {!loading && (
        <div style={{ display: "flex", flex: 1 }}>
          <Paper
            elevation={12}
            style={{
              margin: "0 auto",
              display: "flex",
              width: "90%",
              height: 800,
              maxWidth: 1000,
              marginTop: 64,
              flexDirection: "row",
            }}
          >
            {/* Usuarios */}
            <div
              style={{
                flex: 3,
                border: `1px solid ${blueColor}`,
                borderRight: `0.2px solid ${blueColor}`,
                backgroundColor: "whitesmoke",
              }}
            >
              {Object.keys(messagesByUser).length > 0 &&
                Object.keys(messagesByUser).map((id) => {
                  const format = "DD/MM/YYYY HH:mm";
                  const userName = messagesByUser[id][0].sender.firstName;
                  const { text: lastMessage, createdAt: timestamp } = messagesByUser[id][messagesByUser[id].length - 1];

                  return (
                    <UserCard
                      key={id}
                      name={userName}
                      timestamp={moment(timestamp).format(format)}
                      lastMessage={lastMessage}
                      onClick={() => openChat(id)}
                    />
                  );
                })}
              {/*  */}
            </div>
            {/* Chat */}
            <div
              style={{
                display: "flex",
                flex: 7,
                border: `1px solid ${blueColor}`,
                borderLeft: `0.2px solid ${blueColor}`,
                flexDirection: "column",
                maxWidth: 700,
              }}
            >
              {/* Body */}
              <div
                style={{
                  flex: 12,
                  width: "100%",
                  background: "whitesmokes",
                  alignSelf: "flex-start",
                  display: "flex",
                  flexDirection: "column",
                  padding: 16,
                }}
              >
                {messagesInChat.length > 0 &&
                  messagesInChat.map((msg) => {
                    return <MessageCard key={msg.id} data={msg} />;
                  })}
              </div>
              {/* Text Field */}
              <div
                style={{
                  display: "flex",
                  flex: 1,
                  backgroundColor: "lightblue",
                  width: "100%",
                  alignSelf: "flex-end",
                  flexDirection: "row",
                }}
              >
                <TextField
                  className="send-message-text-field"
                  placeholder="Enviar uma mensagem..."
                  variant="outlined"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  fullWidth={true}
                  rowsMax={1}
                  style={{ padding: 5 }}
                  disabled={messagesInChat.length === 0}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") handleMessageSend();
                  }}
                />
                <Button
                  variant="contained"
                  style={{ backgroundColor: blueColor, color: "white" }}
                  onClick={handleMessageSend}
                  disabled={messagesInChat.length === 0}
                >
                  Enviar
                </Button>
              </div>
            </div>
          </Paper>
        </div>
      )}
    </Fragment>
  );
};

const mapStateToProps = ({ authedUser, companies }) => {
  return { authedUser, companies };
};

export default connect(mapStateToProps)(ChatWindow);
