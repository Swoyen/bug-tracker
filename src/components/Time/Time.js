import React, { useState, useEffect } from "react";
import TimeTracker from "./TimeTracker";
import TimeList from "./TimeList";
import { useContext } from "react";
import { TimeContext } from "../../context/TimeContext";

const Time = () => {
  return (
    <>
      <TimeTracker></TimeTracker>
      <TimeList></TimeList>
    </>
  );
};

export default Time;
