const logger = (store) => (next) => (action) => {
  // console.group(action.type);
  // console.log("ACTION:", { action });
  const returnValue = next(action);
  // console.log("STATE:", store.getState());
  // console.groupEnd();

  return returnValue;
};

export default logger;
