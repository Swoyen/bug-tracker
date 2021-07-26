import React, { useState, useEffect } from "react";
import TimeTracker from "./TimeTracker";
import TimeList from "./TimeList";
import { createRestrictedAPIEndPoint, RESTRICTEDENDPOINTS } from "../../api";

const Time = () => {
  const [timeList, setTimeList] = useState([]);

  useEffect(() => {
    createRestrictedAPIEndPoint(RESTRICTEDENDPOINTS.TIMER)
      .fetchAll()
      .then((res) => setTimeList(res.data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <>
      <TimeTracker timeList={timeList}></TimeTracker>
      <TimeList timeList={timeList} setTimeList={setTimeList}></TimeList>
    </>
  );
};

export default Time;
