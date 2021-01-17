"use strict";

// Translation context variables:
var inputlang = "en-CA";
var outputlang = "fr";

var ffmpeg_command = false;
var socket = false;
var recognizeStream = null;

const ipc = require("node-ipc");

function stopStream() {
  console.log("stopStream called");
  if(recognizeStream){
    recognizeStream.end();
    recognizeStream = null;
  }
}

async function transcribeAndTranslate(
  encoding = "FLAC",
  sampleRateHertz = 44100,
  languageCode = "en-CA",
  streamingLimit = 1800000,
  targetLanguage = "fr",
  // audioSourceName = 'Stereo Mix (Realtek(R) Audio)'
  audioSourceName = "Microphone (Realtek(R) Audio)"
) {
  const chalk = require("chalk");
  const { Writable } = require("stream");
  const recorder = require("node-record-lpcm16");

  // Imports the Google Cloud client library
  // Currently, only v1p1beta1 contains result-end-time
  const speech = require("@google-cloud/speech").v1p1beta1;
  const { Translate } = require("@google-cloud/translate").v2;
  const translate = new Translate();

  const ffmpeg = require("fluent-ffmpeg");
  const fs = require("fs");

  const client = new speech.SpeechClient();

  const config = {
    encoding: encoding,
    sampleRateHertz: sampleRateHertz,
    languageCode: languageCode
  };

  const request = {
    config,
    interimResults: true
  };

  recognizeStream = null;
  let restartCounter = 0;
  let audioInput = [];
  let lastAudioInput = [];
  let resultEndTime = 0;
  let isFinalEndTime = 0;
  let finalRequestEndTime = 0;
  let newStream = true;
  let bridgingOffset = 0;
  let lastTranscriptWasFinal = false;

  async function translateFinalizedTranscript(text) {
    const [translation] = await translate.translate(text, targetLanguage);

    console.log(
      "Got translation:\nOriginal text: " +
        text +
        "\nTranslated to " +
        targetLanguage +
        ": " +
        translation
    );

    if(socket) {
      console.log("Sending transcript to socket...");
      ipc.server.emit(socket, "transcript", translation);
    }
  }

  function startStream() {
    // Clear current audioInput
    audioInput = [];
    // Initiate (Reinitiate) a recognize stream
    recognizeStream = client
      .streamingRecognize(request)
      .on("error", err => {
        if (err.code === 11) {
          // restartStream();
        } else {
          console.error("API request error " + err);
        }
      })
      .on("data", speechCallback);

    // Restart stream when streamingLimit expires
    setTimeout(restartStream, streamingLimit);
  }

  const speechCallback = stream => {
    // console.log("Data from google:");
    // console.log(stream.results[0]);
    // Convert API result end time from seconds + nanoseconds to milliseconds
    resultEndTime =
      stream.results[0].resultEndTime.seconds * 1000 +
      Math.round(stream.results[0].resultEndTime.nanos / 1000000);

    // Calculate correct time based on offset from audio sent twice
    const correctedTime =
      resultEndTime - bridgingOffset + streamingLimit * restartCounter;

    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    let stdoutText = "";
    if (stream.results[0] && stream.results[0].alternatives[0]) {
      stdoutText =
        correctedTime + ": " + stream.results[0].alternatives[0].transcript;
    }

    if (stream.results[0].isFinal) {
      process.stdout.write(chalk.green(`${stdoutText}\n`));

      isFinalEndTime = resultEndTime;
      lastTranscriptWasFinal = true;

      // Send this to the translator:
      translateFinalizedTranscript(
        stream.results[0].alternatives[0].transcript
      );
    } else {
      // Make sure transcript does not exceed console character length
      if (stdoutText.length > process.stdout.columns) {
        stdoutText =
          stdoutText.substring(0, process.stdout.columns - 4) + "...";
      }
      process.stdout.write(chalk.red(`${stdoutText}`));

      lastTranscriptWasFinal = false;
    }
  };

  const audioInputStreamTransform = new Writable({
    write(chunk, encoding, next) {
      if (newStream && lastAudioInput.length !== 0) {
        // Approximate math to calculate time of chunks
        const chunkTime = streamingLimit / lastAudioInput.length;
        if (chunkTime !== 0) {
          if (bridgingOffset < 0) {
            bridgingOffset = 0;
          }
          if (bridgingOffset > finalRequestEndTime) {
            bridgingOffset = finalRequestEndTime;
          }
          const chunksFromMS = Math.floor(
            (finalRequestEndTime - bridgingOffset) / chunkTime
          );
          bridgingOffset = Math.floor(
            (lastAudioInput.length - chunksFromMS) * chunkTime
          );

          for (let i = chunksFromMS; i < lastAudioInput.length; i++) {
            recognizeStream.write(lastAudioInput[i]);
          }
        }
        newStream = false;
      }

      audioInput.push(chunk);

      if (recognizeStream) {
        recognizeStream.write(chunk);
      }

      next();
    },

    final() {
      if (recognizeStream) {
        recognizeStream.end();
      }
    }
  });

  function restartStream() {
    if (recognizeStream) {
      stopStream();
    }

    if (!ffmpeg_command) {
      console.log("ffmpeg dead, not restarting stream");
      console.log(ffmpeg_command);
      return;
    }

    if (resultEndTime > 0) {
      finalRequestEndTime = isFinalEndTime;
    }
    resultEndTime = 0;

    lastAudioInput = [];
    lastAudioInput = audioInput;

    restartCounter++;

    if (!lastTranscriptWasFinal) {
      process.stdout.write("\n");
    }
    process.stdout.write(
      chalk.yellow(`${streamingLimit * restartCounter}: RESTARTING REQUEST\n`)
    );

    newStream = true;

    startStream();
  }

  ffmpeg_command = ffmpeg("audio=" + audioSourceName)
    .inputOptions(["-f dshow", "-t 3600", "-ac 1"])
    .outputOptions([
      "-f " + encoding.toLowerCase(),
      "-sample_rate " + sampleRateHertz
    ])
    .on("start", function() {
      console.log("Start...\n");
    })
    .on("progress", function(progress) {
      //console.log('Processing: '+progress.percent+'% done');
    })
    .on("stderr", function(stderrLine) {
      //console.log('Stderr output: '+stderrLine);
    })
    .on("end", function() {
      console.log("Successfuly finished");
      ffmpeg_command = false;
    })
    .output(audioInputStreamTransform, { end: true });

  ffmpeg_command.run();

  console.log("");
  console.log("Listening, press Ctrl+C to stop.");
  console.log("");
  console.log("End (ms)       Transcript Results/Status");
  console.log("=========================================================");

  startStream();
  // [END speech_transcribe_infinite_streaming]
}

process.on("unhandledRejection", err => {
  console.error(err.message);
  process.exitCode = 1;
});

// transcribeAndTranslate(...process.argv.slice(2));

ipc.config.id = "babel";
ipc.config.retry = 1500;

function killFfmpeg() {
  if(ffmpeg_command) {
    ffmpeg_command.kill();
    ffmpeg_command = false;
  }

  stopStream();
}

ipc.serve(function() {
  ipc.server.on("inputlang", function(data, a_socket) {
    ipc.log("setting input language to: ".debug, data);
    inputlang = data;
    killFfmpeg();
    setTimeout(transcribeAndTranslate, 3000);
  });

  ipc.server.on("outputlang", function(data, a_socket) {
    ipc.log("setting output language to: ".debug, data);
    outputlang = data;
    killFfmpeg();
    setTimeout(transcribeAndTranslate, 3000);
  });


  ipc.server.on("start_transcript", function(data, a_socket) {
    ipc.log("got a request to start transcription process ".debug, data);
    socket = a_socket;


    ipc.server.emit(socket, "starting_transcription");
    transcribeAndTranslate();
  });

  ipc.server.on("socket.disconnected", function(a_socket, destroyedSockedID) {
    socket = false;
  })
});

ipc.server.start();
