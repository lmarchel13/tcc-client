import React, { Fragment, useState, useEffect } from "react";
import { connect } from "react-redux";
import moment from "moment";
import { Card, CardContent, Button, Typography, TextField, Paper } from "@material-ui/core";

import Title from "./Title";
import SnackBar from "./SnackBar";

import { blueBg, blueColor } from "../utils/colors";
import { API } from "../providers";

// import { io } from "socket.io-client";
// const socket = io("http://localhost:8000");

const UserCard = ({ name, timestamp, lastMessage, onClick }) => {
  return (
    <Card
      style={{
        backgroundColor: blueBg,
        borderBottom: `0.2px solid ${blueColor}`,
        borderRadius: "0px",
      }}
      onClick={onClick}
    >
      <CardContent style={{ height: 40, maxHeight: 40 }}>
        <Typography variant="body2" component="p" style={{ color: "grey", float: "right" }}>
          {timestamp}
        </Typography>
        <Typography variant="h6" component="h3" style={{ fontFamily: "Futura", color: blueColor }} noWrap={true}>
          {name}
        </Typography>
        <Typography variant="body2" component="p" style={{ color: "grey" }} noWrap={true}>
          {lastMessage}
        </Typography>
      </CardContent>
    </Card>
  );
};

const MessageCard = ({ data }) => {
  const { id, text, sender } = data;
  const floatStyle = sender === "USER" ? "left" : "right";
  const bgColor = sender === "USER" ? "lightgray" : blueBg;

  return (
    <div key={id}>
      <Card
        style={{
          backgroundColor: bgColor,
          maxWidth: 300,
          margin: 5,
          float: floatStyle,
        }}
      >
        <Typography variant="body2" component="p" noWrap={false} style={{ padding: 8, wordWrap: "break-word" }}>
          {text}
        </Typography>
      </Card>
    </div>
  );
};

const ChatWindow = ({ authedUser, socket }) => {
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [conversations, setConversations] = useState([]);
  const [conversationOpen, setConversationOpen] = useState({});
  const [messagesInChat, setMessagesInChat] = useState([]);

  const [snackBarData, setSnackBarData] = useState({});
  const [openSnackBar, setOpenSnackBar] = useState(false);

  socket.on("NEW_MESSAGE_FROM_USER", ({ message, conversationId }) => {
    let changed = false;

    conversations.forEach((conv) => {
      if (!changed && conv && conv.id === conversationId && conv.messages && Array.isArray(conv.messages)) {
        conv.messages.push(message);
        changed = true;
      }
    });

    if (changed) {
      console.log("setting new conversations");
      setConversations(conversations);
      console.log("Message added to conversation");

      if (conversationOpen.id === conversationId) {
        setMessagesInChat([...messagesInChat, message]);
      }
    }
  });

  useEffect(() => {
    const fetchConversations = async () => {
      if (authedUser.jwt) {
        const { err, data } = await API.getCompanyConversations(authedUser.jwt);

        if (err) {
          setSnackBarData({ text: err.description, severity: "error" });
          setOpenSnackBar(false);
          return;
        }

        setConversations(data);
      }
    };

    fetchConversations();
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleMessageSend = async () => {
    const payload = {
      sender: "COMPANY",
      text: newMessage,
      companyId: conversationOpen.company.id,
    };

    const { err, data } = await API.sendMessage(conversationOpen.id, payload, authedUser.jwt);

    if (err) {
      setSnackBarData({ text: err.description, severity: "error" });
      setOpenSnackBar(false);
      return;
    }

    console.log("duplicated???", [...messagesInChat, data]);

    setMessagesInChat([...messagesInChat, data]);
    setNewMessage("");
  };

  const openChat = (conversation) => {
    setConversationOpen(conversation);
    const { messages = [] } = conversation;
    setMessagesInChat(messages);
  };

  return (
    <Fragment>
      <Title title="Minhas mensagens" />
      {!loading && (
        <div style={{ display: "flex", flex: 1 }}>
          <Paper
            elevation={12}
            style={{
              margin: "0 auto",
              display: "flex",
              width: "100%",
              minHeight: 600,
              maxHeight: 80,
              minWidth: 800,
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
              {conversations.length > 0 &&
                conversations.map((conversation) => {
                  const {
                    id,
                    user: { firstName },
                    messages = [],
                  } = conversation;
                  if (messages.length === 0) return null;

                  const format = "DD/MM/YYYY HH:mm";
                  const { text: lastMessage, createdAt: timestamp } = messages[messages.length - 1];

                  return (
                    <UserCard
                      key={id}
                      name={firstName}
                      timestamp={moment(timestamp).format(format)}
                      lastMessage={lastMessage}
                      onClick={() => openChat(conversation)}
                    />
                  );
                })}
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
                id="chat-body"
                style={{
                  flex: 10,
                  width: "100%",
                  backgroundColor: "whitesmoke",
                  alignSelf: "flex-start",
                  display: "flex",
                  flexDirection: "column",
                  overflowY: "auto",
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
      <SnackBar data={snackBarData} open={openSnackBar} setOpen={setOpenSnackBar} />
    </Fragment>
  );
};

const mapStateToProps = ({ authedUser, socket }) => {
  return { authedUser, socket };
};

export default connect(mapStateToProps)(ChatWindow);
