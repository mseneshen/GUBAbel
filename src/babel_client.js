const ipc = require("node-ipc");

ipc.config.id = "babel";
ipc.config.retry = 1500;

module.exports = {
  setInputLang(new_inputlang) {
    inputlang = new_inputlang;
    if (ipc.of.babel) {
      ipc.of.babel.emit("inputlang", inputlang);
    }
  },
  setOutputLang(new_outputlang) {
    outputlang = new_outputlang;
    if (ipc.of.babel) {
      ipc.of.babel.emit("outputlang", outputlang);
    }
  },
  setupBabelClient(browser_window, inputLang, outputLang) {
    ipc.connectTo("babel", function() {
      ipc.of.babel.on("connect", function() {
        ipc.log("## connected to world ##".rainbow, ipc.config.delay);

        ipc.of.babel.emit("inputlang", inputLang);
        ipc.of.babel.emit("outputlang", outputLang);

        ipc.of.babel.emit("start_transcript", "");
      });
      ipc.of.babel.on("disconnect", function() {
        ipc.log("disconnected from world".notice);
      });
      ipc.of.babel.on("transcript", function(data) {
        ipc.log("got a transcript from world: ".debug, data);

        browser_window.webContents.send("transcript", data);
      });
    });
  }
};
