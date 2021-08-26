const logger = (param) => (store) => (next) => (action) => {
  //console.log(param);
  //console.log(next);
  return next(action);
};

export default logger;
