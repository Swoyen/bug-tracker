import { useMsal } from "@azure/msal-react";
import React, { useState, createContext, useEffect } from "react";
import { useCallback } from "react";
import { createAuthenticatedEndPoint, RESTRICTEDENDPOINTS } from "../api";

export const TimeContext = createContext();

export const TimeProvider = (props) => {
  const [timeList, setTimeList] = useState([]);
  const { instance, accounts } = useMsal();
  const [timeListGroupedByDate, setTimeListGroupedByDate] = useState([]);
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const [timeTrackIdToDelete, setTimeTrackIdToDelete] = useState(-1);
  const [actionsShownId, setActionsShownId] = useState(-1);
  const [openTimeEdit, setOpenTimeEdit] = useState(false);
  const [timeTrackIdToEdit, setTimeTrackIdToEdit] = useState(-1);
  const [timeListDateToFetch, setTimeListDateToFetch] = useState({});
  const [timeGroupVisible, setTimeGroupVisible] = useState([]);

  const fetchTimeList = useCallback(async () => {
    const apiObj = await createAuthenticatedEndPoint(
      instance,
      accounts,
      RESTRICTEDENDPOINTS.TIMER
    );

    let result = apiObj.fetchAll();
    result
      .then((res) => {
        setTimeList(res.data);
        var date = new Date();
        date.setDate(date.getDate() - 3);
        setTimeListDateToFetch(date);
      })
      .catch((err) => console.log(err));
  }, [instance, accounts]);

  useEffect(() => {
    fetchTimeList();
  }, [fetchTimeList]);

  const fetchTimeListByDate = async () => {
    console.log(timeListDateToFetch);
    const apiObj = await createAuthenticatedEndPoint(
      instance,
      accounts,
      RESTRICTEDENDPOINTS.TIMER,
      { start: timeListDateToFetch }
    );

    let result = apiObj.fetchAll();
    result
      .then((res) => {
        setTimeListDateToFetch((date) => {
          var newDt = date;
          newDt.setDate(date.getDate() - 3);
          return newDt;
        });
        console.log(res.data);
        setTimeList((timeList) => {
          var newTimeList = [...timeList, ...res.data];
          return newTimeList;
        });
      })
      .catch((err) => console.log(err));
  };

  const groupTimeListByDate = (timeList) => {
    var uniqueDates = [];
    var date = new Date();
    var tempTimeList = [];
    var map = new Map();
    timeList.forEach((timeTrack) => {
      if (timeTrack.stop) {
        date = new Date(timeTrack.startTime + "Z");
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
      }
    });
    uniqueDates.forEach((date) => {
      let dateStr = date.date + "/" + date.month + "/" + date.year;
      var values = map.get(dateStr);
      var timeTracks = [];
      values.forEach((value) => timeTracks.push(value));
      tempTimeList.push({ date: date, timeTrack: timeTracks });
    });
    tempTimeList.reverse();
    console.log("temp", tempTimeList);
    tempTimeList = tempTimeList.sort((a, b) => {
      var ad = a.date;
      var d1 = ad.date;
      var m1 = ad.month;
      var y1 = ad.year;
      var bd = b.date;
      var d2 = bd.date;
      var m2 = bd.month;
      var y2 = bd.year;
      var date1 = new Date(d1, m1, y1);
      var date2 = new Date(d2, m2, y2);
      var t1 = date1.getTime();
      var t2 = date2.getTime();
      if (t1 < t2) {
        return 1;
      } else if (t1 > t2) {
        return -1;
      }
      return 0;
    });
    var tempVis = [];

    setTimeGroupVisible(tempVis);

    if (timeGroupVisible.length === uniqueDates.length) {
      // nothing
    } else if (uniqueDates.length > timeGroupVisible.length) {
      var diff = uniqueDates.length - timeGroupVisible.length;
      var temp = timeGroupVisible;
      for (var j = 0; j < diff; j++) {
        temp.push(false);
      }
      setTimeGroupVisible([...temp]);
    }
    for (var i = 0; i < uniqueDates.length; i++) {
      tempTimeList[i] = { ...tempTimeList[i], visible: timeGroupVisible[i] };
    }
    setTimeListGroupedByDate([...tempTimeList]);
    console.log("new Approechj", tempTimeList);
  };

  useEffect(() => {
    if (timeList.length !== 0) {
      groupTimeListByDate(timeList);
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
        setOpenTimeEdit(false);
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
        openTimeEdit,
        setOpenTimeEdit,
        timeTrackIdToEdit,
        setTimeTrackIdToEdit,
        fetchTimeList,
        fetchTimeListByDate,
        timeGroupVisible,
        setTimeGroupVisible,
      }}
    >
      {props.children}
    </TimeContext.Provider>
  );
};
