const func =
  ({ dispatch, getState }) =>
  (next) =>
  (action) => {
    if (typeof action == "function") {
      console.log(getState());
      action(dispatch, getState);
    } else {
      next(action);
    }
  };

export default func;
