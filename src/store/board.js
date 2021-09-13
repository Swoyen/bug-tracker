import { BorderAll } from "@material-ui/icons";
import { createSelector, createSlice } from "@reduxjs/toolkit";
import moment from "moment";
import { RESTRICTEDENDPOINTS } from "../api/config";
import { apiCallBegan } from "./api";
import bug, { modifyBug } from "./bug";

const boardSlice = createSlice({
  name: "board",
  initialState: {
    addCardVisibleList: [],
    bugsGroupedWithStatusList: [],
    bugsIdGroupedWithList: [],
    searchTerm: "",
    filterParams: "all",
    moveCardSilhouetteShownIndex: -1,
    moveCardSilhouetteHeight: 0,
    moveCardYIndex: 0,
    movedDownInSameStatus: false,
    bugHeightMap: [],
    labelsExpanded: false,
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

    bugRemovedFromBugStatusList: (board, action) => {
      let { bugId, statusId } = action.payload;
      let statusIndex = board.bugsGroupedWithStatusList.findIndex(
        (bs) => bs.status.statusId === statusId
      );
      console.log("statusIndex", statusIndex);
      let bws = board.bugsGroupedWithStatusList[statusIndex];
      bws = bws.bugs.filter((b) => b.bugId !== bugId);
      board.bugsGroupedWithStatusList[statusIndex].bugs = bws;
    },

    bugsWithStatusInitialized: (board, action) => {
      let { statuses, bugs } = action.payload;
      let bugsWithStatusList = [];
      let bugsIdGroupedWithList = [];
      statuses.forEach((status) => {
        bugsWithStatusList.push({ status: status, bugs: [] });
        bugsIdGroupedWithList.push({ status: status, bugs: [] });
      });

      bugs.forEach((bug) => {
        var status = bug.status;
        var statusIndex = bugsWithStatusList.findIndex(
          (bugWithStatus) => bugWithStatus.status.statusId === status.statusId
        );
        bugsWithStatusList[statusIndex].bugs.push(bug);
        bugsIdGroupedWithList[statusIndex].bugs.push(bug.bugId);
      });

      bugsWithStatusList.forEach((bugsWithStatus) =>
        bugsWithStatus.bugs.sort((a, b) => a.cardOrder - b.cardOrder)
      );

      board.bugsGroupedWithStatusList = bugsWithStatusList;
      board.bugsIdGroupedWithList = bugsIdGroupedWithList;
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
      //recalculate total height
      var oldStatusNewHeight =
        bugGroups[oldStatusIndex].totalHeight -
        board.bugHeightMap.find((bh) => bh.bugId === bugId).height;
      //console.log("old", oldStatusNewHeight);
      bugGroups[oldStatusIndex].totalHeight = oldStatusNewHeight;
      // add in new
      let newStatusIndex = bugGroups.findIndex(
        (bugWithStatus) => bugWithStatus.status.statusId === newStatus.statusId
      );
      var newStatusNewHeight =
        bugGroups[newStatusIndex].totalHeight === undefined
          ? board.bugHeightMap.find((bh) => bh.bugId === bugId).height
          : bugGroups[newStatusIndex].totalHeight +
            board.bugHeightMap.find((bh) => bh.bugId === bugId).height;

      bugGroups[newStatusIndex].totalHeight = newStatusNewHeight;
      // before pushing
      // change card order of elemnts after by + 1
      if (yIndex + 1 <= bugGroups[newStatusIndex].bugs.length) {
        for (let i = yIndex; i < bugGroups[newStatusIndex].bugs.length; i++) {
          var prevCardOrder = bugGroups[newStatusIndex].bugs[i].cardOrder;
          bugGroups[newStatusIndex].bugs[i].cardOrder = prevCardOrder + 1;
        }
      }

      bugGroups[newStatusIndex].bugs.push(newBug);

      // var newStatusNewHeight =
      //   bugGroups[newStatusIndex].totalHeight +
      //   board.bugHeightMap.find((bh) => bh.bugId === bugId).height;
      // bugGroups[newStatusIndex].totalHeight = newStatusNewHeight;

      bugGroups[newStatusIndex].bugs = bugGroups[newStatusIndex].bugs.sort(
        (a, b) => a.cardOrder - b.cardOrder
      );
      board.bugsGroupedWithStatusList = bugGroups;
      board.moveCardSilhouetteShownIndex = -1;
      board.movedDownInSameStatus = false;
    },

    moveCardSilhouetteShown: (board, action) => {
      let {
        index,
        yIndex,
        height,
        movedDownInSameStatus = false,
      } = action.payload;
      board.moveCardSilhouetteShownIndex = index;
      board.moveCardYIndex = yIndex;
      board.moveCardSilhouetteHeight = height;
      board.movedDownInSameStatus = movedDownInSameStatus;
    },
    moveCardSilhouetteHidden: (board) => {
      board.moveCardSilhouetteShownIndex = -1;
    },

    cardLabelsExpanded: (board) => {
      board.labelsExpanded = true;
    },

    cardLabelsCollapsed: (board) => {
      board.labelsExpanded = false;
    },

    cardHeightSet: (board, action) => {
      let { statusId, bugId, height } = action.payload;
      if (board.bugHeightMap.some((hm) => hm.bugId === bugId)) {
        //replace and return
        return;
      }

      board.bugHeightMap.push({ bugId, height });

      let statusIndex = board.bugsGroupedWithStatusList.findIndex(
        (bs) => bs.status.statusId === statusId
      );
      let bws = board.bugsGroupedWithStatusList[statusIndex];
      // var totalHeight = bws.totalHeight === undefined ? 0 : bws.totalHeight;

      bws.totalHeight =
        bws.totalHeight === undefined ? height : bws.totalHeight + height;

      board.bugsGroupedWithStatusList = board.bugsGroupedWithStatusList.map(
        (bs) => (bs.statusId === statusId ? bws : bs)
      );
    },
    searchTermSet: (board, action) => {
      board.searchTerm = action.payload;
    },
    filterParamSet: (board, action) => {
      board.filterParams = action.payload;
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

export const removeFromBugStatusList = (bugId, statusId) => (dispatch) => {
  dispatch(bugRemovedFromBugStatusList({ bugId, statusId }));
};

export const initializeBugsWithStatus = (bugs, statuses) => (dispatch) => {
  dispatch(bugsWithStatusInitialized({ bugs, statuses }));
};

export const modifyBugStatus =
  ({ bugId, statusId, steps, movedDownInSameStatus = false }) =>
  (dispatch, getState) => {
    const { list: statuses } = getState().entities.statuses;
    const bugList = getState().entities.bugs.list;
    const bug = bugList.find((bug) => bug.bugId === bugId);

    const { bugsGroupedWithStatusList, moveCardYIndex } =
      getState().entities.board;
    var oldYIndex = bugsGroupedWithStatusList
      .find((bgs) => bgs.status.statusId === statusId)
      .bugs.findIndex((bug) => bug.bugId === bugId);
    var newYIndex = moveCardYIndex;
    if (movedDownInSameStatus) {
      newYIndex = moveCardYIndex - 1;
      if (newYIndex < 0) newYIndex = 0;
    }
    var statusIndex = bugsGroupedWithStatusList.findIndex(
      (bugWithStatus) => bugWithStatus.status.statusId === statusId
    );
    var newBug = { ...bug };

    let newStatusIndex = statusIndex + steps;

    if (newStatusIndex >= 0 && newStatusIndex < statuses.length) {
      var newStatus = statuses[newStatusIndex];
      newBug.status = newStatus;

      let newBugList = bugsGroupedWithStatusList[newStatusIndex].bugs;
      if (newBugList.length === 0) {
        newYIndex = 0;
      }
      if (newYIndex >= newBugList.length) {
        newYIndex = newBugList.length;
      }

      var newCardOrder = 0;
      // if no bug before && after
      if (newBugList.length === 0) {
        newCardOrder = 0;
        newBug.cardOrder = newCardOrder;
        dispatch(modifyBug(bugId, newBug));
        dispatch(
          bugStatusModified({
            bugId,
            newBug,
            statusId,
            newStatus,
            yIndex: newYIndex,
          })
        );
      }
      // bugs only before
      else if (newBugList.length === newYIndex) {
        // only append
        var cardOrder = newBugList[newBugList.length - 1].cardOrder;

        newCardOrder = cardOrder + 1;
        newBug.cardOrder = newCardOrder;
        dispatch(modifyBug(bugId, newBug));
        dispatch(
          bugStatusModified({
            bugId,
            newBug,
            statusId,
            newStatus,
            yIndex: newYIndex,
          })
        );
      }
      // bugs after
      else {
        // if no bugs before
        if (newYIndex === 0) {
          newCardOrder = 0;
          if (!newBug) return;
          newBug.cardOrder = newCardOrder;
          //console.log(newBug);
          dispatch(modifyBug(bugId, newBug));
          dispatch(
            bugStatusModified({
              bugId,
              newBug,
              statusId,
              newStatus,
              yIndex: newYIndex,
            })
          );
        }
        // if bug before
        else if (newYIndex !== 0 && newYIndex > -1) {
          // get card order at index
          var prevCard = newBugList[newYIndex];
          if (prevCard === undefined) return;
          // if (!prevCard) return;
          newCardOrder = prevCard.cardOrder;
          newBug.cardOrder = newCardOrder;
          dispatch(modifyBug(bugId, newBug));
          dispatch(
            bugStatusModified({
              bugId,
              newBug,
              statusId,
              newStatus,
              yIndex: newYIndex,
            })
          );
        }
        var bugsAfter = bugsGroupedWithStatusList[newStatusIndex].bugs.filter(
          (_, i) => i >= newYIndex
        );
        //modifyBugAfter
        if (steps !== 0) {
          bugsAfter.forEach((b) => {
            // var bugWithNewCardOrder = { ...bug, cardOrder: bug.cardOrder + 1 };
            var bugToModify = bugList.find((bug) => bug.bugId === b.bugId);
            var bugWithNewCardOrder = {
              ...bugToModify,
              cardOrder: bugToModify.cardOrder + 1,
            };
            dispatch(modifyBug(b.bugId, bugWithNewCardOrder));
          });
        } else {
          var allBugs = bugsGroupedWithStatusList[newStatusIndex].bugs;
          if (newYIndex < allBugs.length) {
            // console.log(movedDownInSameStatus);
            for (let i = newYIndex + 1; i < allBugs.length; i++) {
              var bugWithNewCardOrder;
              if (bugId !== allBugs[i].bugId) {
                var bugToModify = bugList.find(
                  (bug) => bug.bugId === allBugs[i].bugId
                );

                bugWithNewCardOrder = {
                  ...bugToModify,
                  cardOrder: newCardOrder + i - newYIndex,
                };
              } else {
                var bugToModify = bugList.find(
                  (bug) => bug.bugId === allBugs[i - 1].bugId
                );

                bugWithNewCardOrder = {
                  ...bugToModify,
                  cardOrder: newCardOrder + i - newYIndex,
                };
              }
              dispatch(
                modifyBug(bugWithNewCardOrder.bugId, bugWithNewCardOrder)
              );
              //dispatch(modifyBug(bug.bugId, bugWithNewCardOrder));
            }
          }

          // bugsAfter.forEach((bug) => {
          //   console.log(bug);
          //   if (bug.bugId !== bugId) {
          //     var bugWithNewCardOrder = {
          //       ...bug,
          //       cardOrder: bug.cardOrder + 1,
          //     };
          //     dispatch(modifyBug(bug.bugId, bugWithNewCardOrder));
          //   }
          // });
        }
      }
    }
  };

export const showMoveCardSilhouette =
  (statusId, steps, yIndex, height, moveDown = false) =>
  (dispatch, getState) => {
    console.log("Y index", yIndex);
    const { bugsGroupedWithStatusList } = getState().entities.board;
    var statusIndex = bugsGroupedWithStatusList.findIndex(
      (bugWithStatus) => bugWithStatus.status.statusId === statusId
    );
    let newStatusIndex = statusIndex + steps;
    if (
      newStatusIndex >= 0 &&
      newStatusIndex < bugsGroupedWithStatusList.length
    ) {
      if (steps === 0) {
        //console.log(moveDown);
        if (moveDown) {
          dispatch(
            moveCardSilhouetteShown({
              index: newStatusIndex,
              yIndex: yIndex + 1,
              height,
              movedDownInSameStatus: true,
            })
          );
        } else {
          dispatch(
            moveCardSilhouetteShown({
              index: newStatusIndex,
              yIndex,
              height,
            })
          );
        }
      } else
        dispatch(
          moveCardSilhouetteShown({ index: newStatusIndex, yIndex, height })
        );
    }
  };

export const hideMoveCardSilhouette = () => (dispatch) => {
  dispatch(moveCardSilhouetteHidden());
};

export const setProjectCardLabelsExpanded = (expand) => (dispatch) => {
  expand ? dispatch(cardLabelsExpanded()) : dispatch(cardLabelsCollapsed());
};

export const setCardHeight = (statusId, bugId, height) => (dispatch) => {
  dispatch(cardHeightSet({ statusId, bugId, height }));
};

export const setSearchTerm = (term) => (dispatch) => {
  dispatch(searchTermSet(term));
};

export const setFilterParams = (param) => (dispatch) => {
  dispatch(filterParamSet(param));
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
    (state) => state.entities.board.bugsGroupedWithStatusList,
    (state) => state.entities.board.searchTerm,
    (state) => state.entities.board.filterParams,
    (bugWithStatusList, searchTerm, filterParams) => {
      const bugListWithStatus = bugWithStatusList.find((bugWithStatus) => {
        return bugWithStatus.status.statusId === statusId;
      });
      if (!bugListWithStatus) return;

      const filteredBugList = bugListWithStatus.bugs.filter((bug) => {
        if (filterParams === "all")
          return (
            bug.labels.some((label) =>
              label.label.name.toLowerCase().includes(searchTerm.toLowerCase())
            ) ||
            bug.bugName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            bug.bugDescription.toLowerCase().includes(searchTerm.toLowerCase())
          );
        else if (filterParams === "label")
          return bug.labels.some((label) =>
            label.label.name.toLowerCase().includes(searchTerm.toLowerCase())
          );
        else if (filterParams === "name")
          return bug.bugName.toLowerCase().includes(searchTerm.toLowerCase());
        else if (filterParams === "description")
          return bug.bugDescription
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
        return;
      });
      const newBugList = { ...bugListWithStatus, bugs: filteredBugList };

      return newBugList;
    }
  );

export const getMoveCardSilhouetteIndex = createSelector(
  (state) => state.entities.board,
  (board) => ({
    index: board.moveCardSilhouetteShownIndex,
    yIndex: board.moveCardYIndex,
    height: board.moveCardSilhouetteHeight,
  })
);

export const getMoveCardShownBugList = createSelector(
  (state) => state.entities.board,
  (board) => board.bugsGroupedWithStatusList[board.moveCardSilhouetteShownIndex]
);

export const getBugListWithSameStatus = (statusId) =>
  createSelector(
    (state) => state.entities.board.bugsGroupedWithStatusList,
    (statusList) => statusList.find((s) => s.status.statusId === statusId)
  );

export const getStatusIndex = (statusId) =>
  createSelector(
    (state) => state.entities.board.bugsGroupedWithStatusList,
    (statusList) => statusList.findIndex((s) => s.status.statusId === statusId)
  );

const {
  addCardListInitialized,
  addCardShown,
  addCardHidden,
  bugsWithStatusInitialized,
  bugStatusModified,
  moveCardSilhouetteShown,
  moveCardSilhouetteHidden,
  cardLabelsExpanded,
  cardLabelsCollapsed,
  cardHeightSet,
  bugRemovedFromBugStatusList,
  searchTermSet,
  filterParamSet,
} = boardSlice.actions;
export default boardSlice.reducer;
