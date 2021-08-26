const toast = (store) => (next) => (action) => {
  if (action.type === "error")
    console.error("TOASTIRFY ", action.payload.message);
  else return next(action);
};

export default toast;
