import { useMsal } from "@azure/msal-react";
import React, { useState, createContext, useEffect } from "react";
import { createAuthenticatedEndPoint, RESTRICTEDENDPOINTS } from "../api";

export const TimeContext = createContext();

export const TimeProvider = (props) => {
  const [timeList, setTimeList] = useState([]);
  const { instance, accounts } = useMsal();
  const [timeListGroupedByDate, setTimeListGroupedByDate] = useState([]);
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const [timeTrackIdToDelete, setTimeTrackIdToDelete] = useState(-1);
  const [actionsShownId, setActionsShownId] = useState(-1);

  useEffect(() => {
    (async () => {
      const apiObj = await createAuthenticatedEndPoint(
        instance,
        accounts,
        RESTRICTEDENDPOINTS.TIMER
      );

      let result = apiObj.fetchAll();
      console.log(result);
      result
        .then((res) => setTimeList(res.data))
        .catch((err) => console.log(err));
    })();
  }, []);

  useEffect(() => {
    if (timeList.length !== 0) {
      var uniqueDates = [];
      var date = new Date();
      var tempTimeList = [];
      var map = new Map();
      timeList.forEach((timeTrack) => {
        date = new Date(timeTrack.startTime);
        let dateNum = date.getDate();
        let monthNum = date.getUTCMonth();
        let yearNum = date.getUTCFullYear();
        let dateObj = { date: dateNum, month: monthNum, year: yearNum };
        let dateStr = dateNum + "/" + monthNum + "/" + yearNum;
        if (
          !uniqueDates.some(
            (uniqueDate) =>
              uniqueDate.date === dateObj.date &&
              uniqueDate.month === dateObj.month &&
              uniqueDate.year === dateObj.year
          )
        ) {
          uniqueDates.push(dateObj);
          map.set(dateStr, new Set().add(timeTrack));
        } else {
          var addedTimeTracks = map.get(dateStr);
          map.set(dateStr, addedTimeTracks.add(timeTrack));
        }
      });
      uniqueDates.forEach((date) => {
        let dateStr = date.date + "/" + date.month + "/" + date.year;
        var values = map.get(dateStr);
        var timeTracks = [];
        values.forEach((value) => timeTracks.push(value));
        tempTimeList.push({ date: date, timeTrack: timeTracks });
      });
      setTimeListGroupedByDate([...tempTimeList]);
    }
  }, [timeList]);

  const deleteTimeRecord = async () => {
    (
      await createAuthenticatedEndPoint(
        instance,
        accounts,
        RESTRICTEDENDPOINTS.TIMER
      )
    )
      .delete(timeTrackIdToDelete)
      .then((res) => {
        let temp = timeList;
        temp = temp.filter((time) => time.timeTrackId !== timeTrackIdToDelete);
        console.log(temp);
        setTimeList(temp);
      })
      .catch((err) => console.log(err));
  };

  return (
    <TimeContext.Provider
      value={{
        timeList,
        setTimeList,
        openConfirmation,
        setOpenConfirmation,
        timeTrackIdToDelete,
        setTimeTrackIdToDelete,
        actionsShownId,
        setActionsShownId,
        deleteTimeRecord,
        timeListGroupedByDate,
      }}
    >
      {props.children}
    </TimeContext.Provider>
  );
};
