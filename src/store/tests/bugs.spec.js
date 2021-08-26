import configureStore from "../configureStore";
import { addBug, getUnresolvedBugs, loadBugs, resolveBug } from "../bugs";
import MockAdapter from "axios-mock-adapter";
import axios from "axios";

describe("bugsSlice", () => {
  let fakeAxios;
  let store;

  beforeEach(() => {
    fakeAxios = new MockAdapter(axios);
    store = configureStore();
  });

  const bugsSlice = () => store.getState().entities.bugs;

  const createState = () => ({
    entities: {
      bugs: {
        list: [],
      },
    },
  });

  it("should add the bug to the store if it's saved to the server", async () => {
    /// Arrange
    const bug = { description: "a" };
    const savedBug = { ...bug, id: 1 };
    fakeAxios.onPost("/bugs").reply(200, savedBug);

    /// Act
    await store.dispatch(addBug(bug));

    /// Assert
    expect(bugsSlice().list).toContainEqual(savedBug);
  });

  it("should not add the bug to the store if it's saved to the server", async () => {
    /// Arrange
    const bug = { description: "a" };
    fakeAxios.onPost("/bugs").reply(500);

    /// Act
    await store.dispatch(addBug(bug));

    /// Assert
    expect(bugsSlice().list).toHaveLength(0);
  });

  it("should set the bug to resolved when sending a patch request and saved to the server", async () => {
    /// Arrange
    const id = 1;
    fakeAxios.onPost("/bugs").reply(200, { id, resolved: false });
    fakeAxios.onPatch("/bugs/" + id).reply(200, { id, resolved: true });

    /// Act
    await store.dispatch(addBug({}));
    await store.dispatch(resolveBug(id));

    /// Assert
    expect(bugsSlice().list[0].resolved).toBe(true);
  });

  it("should not set the bug to resolved when sending a patch request and not saved to the server", async () => {
    /// Arrange
    const id = 1;
    fakeAxios.onPost("/bugs").reply(200, { id, resolved: false });
    fakeAxios.onPatch("/bugs/" + id).reply(500);

    /// Act
    await store.dispatch(addBug({}));
    await store.dispatch(resolveBug(id));

    /// Assert
    expect(bugsSlice().list[0].resolved).not.toBe(true);
  });

  describe("loading bugs", () => {
    describe("if the bugs exist in th cache", () => {
      it("they shouldn't be fetched from the server", async () => {
        fakeAxios.onGet("/bugs").reply(200, [{ id: 1 }]);

        await store.dispatch(loadBugs());
        await store.dispatch(loadBugs());

        expect(fakeAxios.history.get.length).toBe(1);
      });
    });

    describe("if the bugs don't exist in the cache", () => {
      it("they should be fetched from the server and put in the store", async () => {
        fakeAxios.onGet("/bugs").reply(200, [{ id: 1 }]);

        await store.dispatch(loadBugs());

        expect(fakeAxios.history.get.length).toBe(1);
      });

      describe("loading indicator", () => {
        it("should be true while fetching the bugs", () => {
          fakeAxios.onGet("/bugs").reply(() => {
            expect(bugsSlice().loading).toBe(true);
            return [200, [{ id: 1 }]];
          });

          store.dispatch(loadBugs());
        });

        it("should be false after fetching the bugs", async () => {
          fakeAxios.onGet("/bugs").reply(200, [{ id: 1 }]);

          await store.dispatch(loadBugs());

          expect(bugsSlice().loading).toBe(false);
        });

        it("should be false if server returns an error", async () => {
          fakeAxios.onGet("/bugs").reply(500);

          await store.dispatch(loadBugs());

          expect(bugsSlice().loading).toBe(false);
        });
      });
    });
  });

  describe("selectors", () => {
    it("getUnresolvedBugs", () => {
      const state = createState();
      state.entities.bugs.list = [
        { id: 1, resolved: true },
        { id: 2, resolved: false },
        { id: 3, resolved: false },
      ];

      const result = getUnresolvedBugs(state);
      expect(result).toHaveLength(2);
    });
  });
});
