var web;
var joined = false;
var isAudioMuted=false;
var client = AgoraRTC.createClient({
  mode: "rtc",
  codec: "vp8"
});
var localTracks = {
  videoTrack: null,
  audioTrack: null,
  audioMixingTrack: null,
  audioEffectTrack: null
};


var remoteUsers = {};
var audioMixing = {
  state: "IDLE",
  duration: 0
};
const playButton = $(".play");
let audioMixingProgressAnimation;

var volume=50;
function decreaseVolume() {
  if (volume >0){
    if (volume <=10) {
    volume -= 1;
    volumeLevel.textContent=volume;
    setVolume(volume);
    }else{
  volume -= 10;
  volumeLevel.textContent=volume;
  setVolume(volume);}
  }
}

var volumeLevel = document.getElementById("volumeLevel");
function increaseVolume() {
  if (volume <100){
    if (volume <10) {
    volume += 1;
    volumeLevel.textContent=volume;
    setVolume(volume);
    }else{
  volume += 10;
  volumeLevel.textContent=volume;
  setVolume(volume);}
  }
}

$("#toggle-audio").click(async function(e) {
  if (isAudioMuted) {
    await unmuteAudio();
    isAudioMuted = false;
    $(this).text("Mute Audio");
  } else {
    await muteAudio();
    isAudioMuted = true;
    $(this).text("Unmute Audio");
  }
});

$("#join-form").submit(async function(e) {
  e.preventDefault();
  if ($("#join").text() === "Join") {
    startVc(cid, chat);
    $("#join").text("Leave");
  } else {
    audience(cid, chat);
    $("#join").text("Join");
  }
});


$("#audio-effect").click(async function(e) {
  await playEffect(1, {
    source: "audio.mp3"
  });
  console.log("play audio effect success");
});



$(".audio-bar .progress").click(function(e) {
  setAudioMixingPosition(e.offsetX);
  return false;
});

// $("#volume").click(function (e) {
//   setVolume($("#volume").val());
// });
var isAudioMixing = false;
var audioMixingSource = null;

$("#local-audio-mixing").click(function(e) {
  if (!isAudioMixing) {
    const file = $("#local-file").prop("files")[0];
    if (!file) {
      console.warn("Please choose an audio file.");
      return;
    }
    startAudioMixing(file);
    $(this).text("Stop Audio");
    isAudioMixing = true;
  } else {
    stopAudioMixing();
    $(this).text("Play Audio");
    isAudioMixing = false;
  }
  return false;
});

// $("#local-audio-mixing").click(function (e) {
//   // get selected file
//   const file = $("#local-file").prop("files")[0];
//   if (!file) {
//     console.warn("Please choose an audio file");
//     return;
//   }

//   // Pass the selected file to the stream function
//   stream(file);
// });

// async function stream(audioFile) {
//   // Create a new audio element
//   const audioElement = document.createElement("audio");
//   audioElement.src = URL.createObjectURL(audioFile);
//   audioElement.controls = true;

//   // Wait for the audio element to load the audio file
//   await new Promise((resolve, reject) => {
//     audioElement.addEventListener("loadeddata", resolve);
//     audioElement.addEventListener("error", reject);
//   });

//   // Play the audio
//   try {
//     audioElement.play();
//   } catch (error) {
//     console.log(error);
//   }

//   // Capture the audio stream
//   const audioStream = audioElement.captureStream();

//   // Create a custom audio track using the captured audio stream
//   const localTracks = {};
//   localTracks.audioTrack = await AgoraRTC.createCustomAudioTrack({
//     mediaStreamTrack: audioStream.getAudioTracks()[0]
//   });

//   // Publish the local tracks to the client
//   await client.publish(Object.values(localTracks));
// }


$(".play").click(function() {
  if (audioMixing.state === "IDLE" || audioMixing.state === "LOADING") return;
  toggleAudioMixing();
  return false;
});

function setAudioMixingPosition(clickPosX) {
  if (audioMixing.state === "IDLE" || audioMixing.state === "LOADING") return;
  const newPosition = clickPosX / $(".progress").width();
  localTracks.audioTrack.seekAudioBuffer(newPosition * audioMixing.duration);
}

function setVolume(value) {
  localTracks.audioTrack.setVolume(parseInt(value));
  console.log(value);
}

async function startAudioMixing(file) {
  if (audioMixing.state === "PLAYING" || audioMixing.state === "LOADING") return;
  const options = {};
  if (file) {
    options.source = file;
  } else {
    options.source = "HeroicAdventure.mp3";
  }
  try {
    audioMixing.state = "LOADING";
    if (localTracks.audioTrack) {
      await client.unpublish(localTracks.audioTrack);
    }
    localTracks.audioTrack = await AgoraRTC.createBufferSourceAudioTrack(options);
    await client.publish(localTracks.audioTrack);
    //localTracks.audioTrack.play();
    localTracks.audioTrack.startProcessAudioBuffer({
      loop: false
    });
    audioMixing.duration = localTracks.audioTrack.duration;
    $(".audio-duration").text(toMMSS(audioMixing.duration));
    $(".play").toggleClass('active', true);
    setAudioMixingProgress();
    audioMixing.state = "PLAYING";
    console.log("start audio mixing");
    //setVolume(volume);
  } catch (e) {
    audioMixing.state = "IDLE";
    console.error(e);
  }
}

function toggleAudioMixing() {
  if (audioMixing.state === "PAUSE") {
    playButton.toggleClass('active', true);

    // resume audio mixing
    localTracks.audioTrack.resumeProcessAudioBuffer();
    audioMixing.state = "PLAYING";
  } else {
    playButton.toggleClass('active', false);

    // pause audio mixing
    localTracks.audioTrack.pauseProcessAudioBuffer();
    audioMixing.state = "PAUSE";
  }
}


function stopAudioMixing() {
  if (audioMixing.state === "IDLE" || audioMixing.state === "LOADING") return;
  audioMixing.state = "IDLE";
  localTracks.audioTrack.stopProcessAudioBuffer();
  localTracks.audioTrack.stop();
  $(".progress-bar").css("width", "0%");
  $(".audio-current-time").text(toMMSS(0));
  $(".audio-duration").text(toMMSS(0));
  $(".play").toggleClass('active', false);
  cancelAnimationFrame(audioMixingProgressAnimation);
  console.log("stop audio mixing");
}

async function resume() {
  await stream();
}

function pause() {
  localTracks.audioTrack.pauseProcessAudioBuffer();
  audioMixing.state = "PAUSE";
}

function setProgressBar(percentage) {
  const progressBar = document.getElementById("p-bar");
  progressBar.style.width = `${percentage}%`;
  progressBar.setAttribute("aria-valuenow", percentage);
}

function setAudioMixingProgress() {
  audioMixingProgressAnimation = requestAnimationFrame(setAudioMixingProgress);
  const currentTime = localTracks.audioTrack.getCurrentTime();
  $(".progress-bar").css("width", `${currentTime / audioMixing.duration * 100}%`);
  $(".audio-current-time").text(toMMSS(currentTime));
}

async function join() {
  [options.uid] = await Promise.all([
    client.join(options.appid, options.channel, options.token || null, options.uid || null),
  ]);
  joined = true;
  console.log("publish success");
}

async function leave() {
  stopAudioMixing();
  for (trackName in localTracks) {
    var track = localTracks[trackName];
    if (track) {
      track.stop();
      track.close();
      localTracks[trackName] = null;
    }
  }
  remoteUsers = {};
  $("#remote-playerlist").html("");
  await client.leave();
  $("#local-player-name").text("");
  $("#join").attr("disabled", false);
  
  $("#audio-mixing").attr("disabled", true);
  
  $("#stop-audio-mixing").attr("disabled", true);
  $("#local-audio-mixing").attr("disabled", true);
  console.log("client leaves channel success");
}

async function subscribe(uid2) {
  var userList = client.remoteUsers;
  console.log(userList);
  for (const user of userList) {
    if (user.uid === uid2) {
      await client.subscribe(user, "audio");
      user.audioTrack.play();
      console.log("audio enabled for " + user.uid);
    }
  }
}

async function unsubscribe(uid2) {
  var userList = client.remoteUsers;
  for (const user of userList) {
    if (user.uid === uid2) {
      await client.unsubscribe(user, "audio");
      console.log("audio disabled for " + user.uid);
    }
  }
}

async function tt() {
  var userList = client.remoteUsers;
  console.log(userList);
  for (const user of userList) {
    await client.subscribe(user, "audio");
    user.audioTrack.play();
  }
}

async function handleUserPublished(user, mediaType) {
  console.log(user);
  console.log("subb");
}

async function handleUserUnpublished(user, mediaType) {
  var id = user.uid;
  if (userId !== '') {
    var uss = dict[userId];
    if (uss === id) {
      await client.unsubscribe(user, mediaType);
    }
  }
}

async function muteAudio() {
  localTracks.audioTrack.setMuted(true);
}

async function unmuteAudio() {
  localTracks.audioTrack.setMuted(false);
}

function toMMSS(second) {
  let MM = parseInt(second / 60);
  let SS = parseInt(second % 60);
  MM = MM < 10 ? "0" + MM : MM;
  SS = SS < 10 ? "0" + SS : SS;
  return `${MM}:${SS}`;
}
