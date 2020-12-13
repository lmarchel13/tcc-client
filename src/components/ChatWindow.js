import React, { Fragment, useState, useEffect, useCallback } from "react";
import { connect } from "react-redux";
import moment from "moment";
import { Card, CardContent, Button, Typography, TextField, Paper } from "@material-ui/core";

import Title from "./Title";
import SnackBar from "./SnackBar";

import { blueBg, blueColor } from "../utils/colors";
import { API } from "../providers";

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
    <div key={id} className="message-card">
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
  const [conversations, setConversations] = useState({});
  const [conversationOpen, setConversationOpen] = useState({});
  const [messagesInChat, setMessagesInChat] = useState({});

  const [snackBarData, setSnackBarData] = useState({});
  const [openSnackBar, setOpenSnackBar] = useState(false);

  const scrollDown = () => {
    const chat = document.getElementById("chat-body");
    if (chat) {
      const chatSize = chat.getElementsByClassName("message-card").length;
      chat.scrollTo({ top: Math.round(+chatSize / 10) * +chat.clientHeight });
    }
  };

  const updateConversations = useCallback(
    (id, message) => {
      if (!conversations[id]) return;

      const newConversationsObject = { ...conversations };

      newConversationsObject[id].updatedAt = new Date();
      newConversationsObject[id].messages.push(message);

      setConversations(newConversationsObject);
    },
    [conversations]
  );

  const updateMessagesInChat = useCallback(
    async (id, message) => {
      if (messagesInChat[id]) return;

      messagesInChat[id] = message;
      setMessagesInChat(messagesInChat);
    },
    [messagesInChat]
  );

  const handleMessageSend = async () => {
    const payload = {
      sender: "COMPANY",
      text: newMessage,
      companyId: conversationOpen.company.id,
    };

    const { err, data: message } = await API.sendMessage(conversationOpen.id, payload, authedUser.jwt);

    if (err) {
      setSnackBarData({ text: err.description, severity: "error" });
      setOpenSnackBar(false);
      return;
    }

    updateMessagesInChat(message.id, message);
    updateConversations(conversationOpen.id, message);
    setNewMessage("");
    scrollDown();
  };

  const openChat = (conversation) => {
    setNewMessage("");

    const messagesObj = {};
    const { messages = [] } = conversation;

    messages.forEach((msg) => {
      messagesObj[msg.id] = msg;
    });

    setConversationOpen(conversation);
    setMessagesInChat(messagesObj);
  };

  const fetchConversations = async () => {
    if (authedUser.jwt) {
      const { err, data } = await API.getCompanyConversations(authedUser.jwt);

      if (err) {
        setSnackBarData({ text: err.description, severity: "error" });
        setOpenSnackBar(false);
        return;
      }

      const conversationsObj = {};
      data.forEach((conv) => {
        conversationsObj[conv.id] = conv;
      });

      setConversations(conversationsObj);
    }
  };

  useEffect(() => {
    if (socket) {
      socket.off("NEW_MESSAGE_FROM_USER");
      socket.off("NEW_CONVERSATION");

      socket.on("NEW_MESSAGE_FROM_USER", ({ message, conversationId }) => {
        if (conversationOpen.id === conversationId) {
          updateMessagesInChat(message.id, message).then(() => {
            scrollDown();
          });
        }

        if (conversations[conversationId]) {
          updateConversations(conversationId, message);
        } else {
          fetchConversations();
        }
      });
    }
  }, [socket, conversationOpen, updateConversations, updateMessagesInChat]);

  useEffect(() => {
    fetchConversations().then(() => {
      setLoading(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    scrollDown();
  }, [conversationOpen]);

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
                overflow: "auto",
              }}
            >
              {Object.keys(conversations).length > 0 &&
                Object.keys(conversations).map((convId) => {
                  const conversation = conversations[convId];
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
                      onClick={() => {
                        openChat(conversation);
                      }}
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
                {Object.keys(messagesInChat).length > 0 &&
                  Object.keys(messagesInChat).map((msgId) => {
                    const msg = messagesInChat[msgId];
                    return <MessageCard key={msgId} data={msg} />;
                  })}
              </div>
              {/* Text Field */}
              {Object.keys(conversationOpen).length > 0 && (
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
                    disabled={Object.keys(messagesInChat).length === 0}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") handleMessageSend();
                    }}
                  />
                  <Button
                    variant="contained"
                    style={{ backgroundColor: blueColor, color: "white" }}
                    onClick={handleMessageSend}
                    disabled={Object.keys(messagesInChat).length === 0}
                  >
                    Enviar
                  </Button>
                </div>
              )}
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
