import { ipcRenderer } from "electron";
import { Store } from "vuex";

export const updater = (store: Store<any>) => {
  // send a message to main process every time
  // there is a mutation.
  store.subscribe((mutation, state) => {
    if (!store.IS_CAPTION_WINDOW) {
      ipcRenderer.send("vuexMutation", mutation);
    } else {
      console.log("helo i am caption windough");
    }
  });
};
