import React from "react";
import TimeTracker from "./TimeTracker";
import TimeList from "./TimeList/TimeList";
import TimeEdit from "./TimeEdit/TimeEdit";

const Time = () => {
  return (
    <>
      <TimeTracker></TimeTracker>
      <TimeList></TimeList>
      <TimeEdit></TimeEdit>
    </>
  );
};

export default Time;
