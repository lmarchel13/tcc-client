export const DEFINE_WEB_SOCKET = "DEFINE_WEB_SOCKET";

export const defineWebSocket = (socket) => ({
  type: DEFINE_WEB_SOCKET,
  socket,
});
