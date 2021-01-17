const ipc = require("node-ipc");

ipc.config.id = "babel";
ipc.config.retry = 1500;

export default function(browser_window) {
  ipc.connectTo("babel", function() {
    ipc.of.babel.on("connect", function() {
      ipc.log("## connected to world ##".rainbow, ipc.config.delay);

      ipc.of.babel.emit("inputlang", "en-CA");
      ipc.of.babel.emit("outputlang", "fr");

      ipc.of.babel.emit("start_transcript", "");
    });
    ipc.of.babel.on("disconnect", function() {
      ipc.log("disconnected from world".notice);
    });
    ipc.of.babel.on("transcript", function(data) {
      ipc.log("got a transcript from world: ".debug, data);

      browser_window.webContents.send('transcript', data);
    });
  });
}
