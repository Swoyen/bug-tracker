import { FormatListNumberedTwoTone } from "@material-ui/icons";
import { createSelector, createSlice } from "@reduxjs/toolkit";

import { RESTRICTEDENDPOINTS } from "../api/config";
import { apiCallBegan, apiCallWithFormDataBegan } from "./api";

const projectsSlice = createSlice({
  name: "projects",
  initialState: {
    list: [],
    recentProjects: [],
    loadedProject: {},
    loading: false,
    lastFetch: null,
    projectSettingsShownId: -1,
    projectCreateShown: false,
  },
  reducers: {
    projectsRequested: (projects, action) => {
      projects.loading = true;
      projects.lastFetch = Date.now();
    },

    projectsReceived: (projects, action) => {
      projects.list = action.payload;
      projects.loading = false;
    },

    projectReceived: (projects, action) => {
      projects.loadedProject = action.payload;
      projects.loading = false;
    },

    projectAdded: (projects, action) => {
      projects.list.push(action.payload);
    },

    recentProjectReceived: (projects, action) => {
      let rp = action.payload;
      rp.sort((a, b) => b.recentOrder - a.recentOrder);
      projects.recentProjects = rp;
    },

    recentProjectAdded: (project, action) => {},

    projectModified: (projects, action) => {
      projects.list = projects.list.map((project) =>
        project.projectId !== action.payload.projectId
          ? project
          : action.payload
      );
    },

    projectRemoved: (projects, action) => {
      projects.list = projects.list.filter(
        (project) => project.projectId !== action.payload.projectId
      );
    },

    projectsRequestFailed: (projects, action) => {
      projects.loading = false;
    },

    projectSettingsShown: (projects, action) => {
      projects.projectSettingsShownId = action.payload;
    },

    projectSettingsHidden: (projects) => {
      projects.projectSettingsShownId = -1;
      projects.loadedProject = {};
    },

    projectCreateShown: (projects) => {
      projects.projectCreateShown = true;
    },

    projectCreateHidden: (projects) => {
      projects.projectCreateShown = false;
    },
  },
});

// Action creators
export const loadProjects = () => (dispatch, getState) => {
  return dispatch(
    apiCallBegan({
      url: RESTRICTEDENDPOINTS.PROJECT,
      onStart: projectsRequested.type,
      onSuccess: projectsReceived.type,
      onError: projectsRequestFailed.type,
    })
  );
};

export const loadProject = (id) => (dispatch) => {
  return dispatch(
    apiCallBegan({
      url: RESTRICTEDENDPOINTS.PROJECT + "/" + id,
      onStart: projectsRequested.type,
      onSuccess: projectReceived.type,
      onError: projectsRequestFailed.type,
    })
  );
};

export const setProjectSettingsShown = (show, id) => (dispatch) => {
  if (show) {
    dispatch(projectSettingsShown(id));
    dispatch(loadProject(id));
  } else dispatch(projectSettingsHidden());
};

export const setProjectCreateShown = (show) => (dispatch) => {
  if (show) dispatch(projectCreateShown());
  else dispatch(projectCreateHidden());
};

export const modifyProject = (id, project) => (dispatch) => {
  return dispatch(
    apiCallWithFormDataBegan({
      url: RESTRICTEDENDPOINTS.PROJECT + "/" + id,
      method: "put",
      data: project,
      onStart: projectsRequested.type,
      onSuccess: projectModified.type,
      onError: projectsRequestFailed.type,
    })
  );
};

export const removeProject = (id) => (dispatch) => {
  return dispatch(
    apiCallBegan({
      url: RESTRICTEDENDPOINTS.PROJECT + "/" + id,
      method: "delete",
      onSuccess: [projectRemoved.type, projectSettingsHidden.type],
    })
  );
};

export const loadRecentProjects = () => (dispatch) => {
  return dispatch(
    apiCallBegan({
      url: RESTRICTEDENDPOINTS.RECENTPROJECTS,
      onSuccess: recentProjectReceived.type,
    })
  );
};

export const addRecentProjects = (id, userId) => (dispatch, getState) => {
  let recentProject = {
    openedProjectId: id,
    openedByUserId: userId,
  };
  return dispatch(
    apiCallBegan({
      url: RESTRICTEDENDPOINTS.RECENTPROJECTS,
      method: "post",
      data: recentProject,
      onSuccess: recentProjectAdded.type,
    })
  );
};

export const addProject = (project) => (dispatch) => {
  return dispatch(
    apiCallWithFormDataBegan({
      url: RESTRICTEDENDPOINTS.PROJECT,
      method: "post",
      data: project,
      onSuccess: projectAdded.type,
    })
  );
  // return dispatch(
  //   apiCallBegan({
  //     url: RESTRICTEDENDPOINTS.PROJECT,
  //     method: "post",
  //     data: project,
  //     onSuccess: projectAdded.type,
  //   })
  // );
};

// Selectors
export const getAllProjects = createSelector(
  (state) => state.entities.projects,
  (projects) => projects.list
);

export const getProjectShown = createSelector(
  (state) => state.entities.projects,
  (projects) => projects.projectSettingsShownId
);

export const getLoadedProject = createSelector(
  (state) => state.entities.projects,
  (projects) => projects.loadedProject
);

export const getRecentProjects = createSelector(
  (state) => state.entities.projects,
  (projects) => projects.recentProjects
);

export const getProjectCreateShown = createSelector(
  (state) => state.entities.projects,
  (projects) => projects.projectCreateShown
);

const {
  projectsReceived,
  projectsRequested,
  projectsRequestFailed,
  projectSettingsShown,
  projectSettingsHidden,
  projectReceived,
  projectModified,
  projectRemoved,
  recentProjectReceived,
  recentProjectAdded,
  projectCreateShown,
  projectCreateHidden,
  projectAdded,
} = projectsSlice.actions;
export default projectsSlice.reducer;
