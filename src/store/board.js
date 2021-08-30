import { BorderAll } from "@material-ui/icons";
import { createSelector, createSlice } from "@reduxjs/toolkit";
import moment from "moment";
import { RESTRICTEDENDPOINTS } from "../api/config";
import { apiCallBegan } from "./api";
import { modifyBug } from "./bug";

const boardSlice = createSlice({
  name: "board",
  initialState: {
    addCardVisibleList: [],
    bugsWithStatus: [],
    bugsGroupedWithStatusList: [],
    moveCardSilhouetteShownIndex: -1,
    moveCardYIndex: 0,
  },
  reducers: {
    addCardListInitialized: (board, action) => {
      let list = [];
      for (let i = 0; i < action.payload; i++) {
        list.push(false);
      }
      board.addCardVisibleList = list;
    },
    addCardShown: (board, action) => {
      board.addCardVisibleList = board.addCardVisibleList.map((_, index) =>
        index === action.payload ? true : false
      );
    },
    addCardHidden: (board, action) => {
      board.addCardVisibleList[action.payload] = false;
    },

    bugsWithStatusInitialized: (board, action) => {
      let bugs = action.payload.bugs;

      let { statuses } = action.payload;
      let bugsWithStatusList = [];
      statuses.forEach((status) =>
        bugsWithStatusList.push({ status: status, bugs: [] })
      );

      bugs.forEach((bug) => {
        var status = bug.status;
        var statusIndex = bugsWithStatusList.findIndex(
          (bugWithStatus) => bugWithStatus.status.statusId === status.statusId
        );
        bugsWithStatusList[statusIndex].bugs.push(bug);
      });

      bugsWithStatusList.forEach((bugsWithStatus) =>
        bugsWithStatus.bugs.sort((a, b) => a.cardOrder - b.cardOrder)
      );

      board.bugsGroupedWithStatusList = bugsWithStatusList;
    },

    bugStatusModified: (board, action) => {
      let { bugId, statusId, newBug, newStatus, yIndex } = action.payload;
      var bugGroups = [...board.bugsGroupedWithStatusList];
      // remove from old
      let oldStatusIndex = bugGroups.findIndex(
        (bugWithStatus) => bugWithStatus.status.statusId === statusId
      );
      bugGroups[oldStatusIndex].bugs = bugGroups[oldStatusIndex].bugs.filter(
        (bug) => bug.bugId !== bugId
      );
      // add in new
      let newStatusIndex = bugGroups.findIndex(
        (bugWithStatus) => bugWithStatus.status.statusId === newStatus.statusId
      );
      // before pushing
      // change card order of elemnts after by + 1
      if (yIndex + 1 <= bugGroups[newStatusIndex].bugs.length) {
        for (let i = yIndex; i < bugGroups[newStatusIndex].bugs.length; i++) {
          var prevCardOrder = bugGroups[newStatusIndex].bugs[i].cardOrder;
          bugGroups[newStatusIndex].bugs[i].cardOrder = prevCardOrder + 1;
        }
      }

      bugGroups[newStatusIndex].bugs.push(newBug);

      bugGroups[newStatusIndex].bugs = bugGroups[newStatusIndex].bugs.sort(
        (a, b) => a.cardOrder - b.cardOrder
      );
      board.bugsGroupedWithStatusList = bugGroups;
      board.moveCardSilhouetteShownIndex = -1;
    },

    moveCardSilhouetteShown: (board, action) => {
      let { index, yIndex } = action.payload;
      board.moveCardSilhouetteShownIndex = index;
      board.moveCardYIndex = yIndex;
    },
    moveCardSilhouetteHidden: (board) => {
      board.moveCardSilhouetteShownIndex = -1;
    },
  },
});

// Action creator
export const initializeAddCardList = (total) => (dispatch) => {
  dispatch(addCardListInitialized(total));
};

export const showAddCard = (index) => (dispatch) => {
  dispatch(addCardShown(index));
};

export const hideAddCard = (index) => (dispatch) => {
  dispatch(addCardHidden(index));
};

export const initializeBugsWithStatus = (bugs, statuses) => (dispatch) => {
  dispatch(bugsWithStatusInitialized({ bugs, statuses }));
};

export const modifyBugStatus =
  ({ bugId, statusId, steps }) =>
  (dispatch, getState) => {
    const { list: statuses } = getState().entities.statuses;
    const { bugsGroupedWithStatusList, moveCardYIndex } =
      getState().entities.board;
    // modify bug then status index
    // get bug
    var statusIndex = bugsGroupedWithStatusList.findIndex(
      (bugWithStatus) => bugWithStatus.status.statusId === statusId
    );
    var bug = bugsGroupedWithStatusList[statusIndex].bugs.find(
      (bug) => bug.bugId === bugId
    );
    var newBug = { ...bug };

    let newStatusIndex = statusIndex + steps;
    if (newStatusIndex >= 0 && newStatusIndex < statuses.length) {
      var newStatus = statuses[newStatusIndex];
      newBug.status = newStatus;

      // let result = dispatch(modifyBug(bugId, newBug));
      // result.then(
      //   dispatch(bugStatusModified({ bugId, newBug, statusId, newStatus }))
      // );
      // dispatch(bugStatusModified({ bugId, newBug, statusId, newStatus }));

      let newBugList = bugsGroupedWithStatusList[newStatusIndex].bugs;

      // if no bug before && after
      if (newBugList.length === 0) {
        var newCardOrder = 0;
        newBug.cardOrder = newCardOrder;
        dispatch(modifyBug(bugId, newBug));
        dispatch(
          bugStatusModified({
            bugId,
            newBug,
            statusId,
            newStatus,
            yIndex: moveCardYIndex,
          })
        );
      }
      // bugs only before
      else if (newBugList.length === moveCardYIndex) {
        // only append
        var cardOrder = newBugList[newBugList.length - 1].cardOrder;

        var newCardOrder = cardOrder + 1;
        newBug.cardOrder = newCardOrder;
        dispatch(modifyBug(bugId, newBug));
        dispatch(
          bugStatusModified({
            bugId,
            newBug,
            statusId,
            newStatus,
            yIndex: moveCardYIndex,
          })
        );
      }
      // bugs after
      else {
        // if no bugs before
        if (moveCardYIndex === 0) {
          newBug.cardOrder = 0;
          dispatch(modifyBug(bugId, newBug));
          dispatch(
            bugStatusModified({
              bugId,
              newBug,
              statusId,
              newStatus,
              yIndex: moveCardYIndex,
            })
          );
        }
        // if bug before
        else if (moveCardYIndex !== 0) {
          // get card order at index
          var cardOrder = newBugList[moveCardYIndex].cardOrder;
          newBug.cardOrder = cardOrder;
          dispatch(modifyBug(bugId, newBug));
          dispatch(
            bugStatusModified({
              bugId,
              newBug,
              statusId,
              newStatus,
              yIndex: moveCardYIndex,
            })
          );
        }
        var bugsAfter = bugsGroupedWithStatusList[newStatusIndex].bugs.filter(
          (_, i) => i >= moveCardYIndex
        );
        //modifyBugAfter
        bugsAfter.forEach((bug) => {
          var bugWithNewCardOrder = { ...bug, cardOrder: bug.cardOrder + 1 };
          dispatch(modifyBug(bug.bugId, bugWithNewCardOrder));
        });
      }
    }
  };

export const showMoveCardSilhouette =
  (statusId, steps, yIndex) => (dispatch, getState) => {
    const { bugsGroupedWithStatusList } = getState().entities.board;

    var statusIndex = bugsGroupedWithStatusList.findIndex(
      (bugWithStatus) => bugWithStatus.status.statusId === statusId
    );
    let newStatusIndex = statusIndex + steps;
    if (
      newStatusIndex >= 0 &&
      newStatusIndex < bugsGroupedWithStatusList.length
    ) {
      dispatch(moveCardSilhouetteShown({ index: newStatusIndex, yIndex }));
    }
  };

export const hideMoveCardSilhouette = () => (dispatch) => {
  dispatch(moveCardSilhouetteHidden());
};

// Selector
export const getAddCardVisibleList = createSelector(
  (state) => state.entities.board,
  (board) => board.addCardVisibleList
);

export const getAddCardVisible = (index) =>
  createSelector(
    (state) => state.entities.board,
    (board) => board.addCardVisibleList[index]
  );

export const getBugsWithStatus = createSelector(
  (state) => state.entities.board,
  (board) => board.bugsWithStatus
);

export const getBugsGroupedWithStatus = (statusId) =>
  createSelector(
    (state) => state.entities.board,
    (board) =>
      board.bugsGroupedWithStatusList.find(
        (bugWithStatus) => bugWithStatus.status.statusId === statusId
      )
  );

export const getMoveCardSilhouetteIndex = createSelector(
  (state) => state.entities.board,
  (board) => ({
    index: board.moveCardSilhouetteShownIndex,
    yIndex: board.moveCardYIndex,
  })
);

export const getMoveCardShownBugList = createSelector(
  (state) => state.entities.board,
  (board) => board.bugsGroupedWithStatusList[board.moveCardSilhouetteShownIndex]
);

const {
  addCardListInitialized,
  addCardShown,
  addCardHidden,
  bugsWithStatusInitialized,
  bugStatusModified,
  moveCardSilhouetteShown,
  moveCardSilhouetteHidden,
} = boardSlice.actions;
export default boardSlice.reducer;
