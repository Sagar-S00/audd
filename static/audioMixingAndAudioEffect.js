var web;
var joined = false;
let isRecording = false;
let mediaRecorder = null;
let recorder;
var recordinguser;
var client = AgoraRTC.createClient(
{
	mode: "rtc",
	codec: "vp8",
});
var localTracks = {
	videoTrack: null,
	audioTrack: null,
	audioTrack: null,
	audioEffectTrack: null,
};
var localTrackState = {
	videoTrackMuted: false,
	audioTrackMuted: false,
};
let myArray = get_users();
console.log(myArray);
let audioElement = document.getElementById('audio');
let chunks = [];
let recordButton = document.getElementById('record-button');
let stopButton = document.getElementById('stop-button');
var remoteUsers = {};
var audioMixing = {
	state: "IDLE",
	duration: 0,
};

function getRandomImage()
{
	const randomIndex = Math.floor(Math.random() * 15) + 1;
	return `/image/${randomIndex}.png`
}

function toggleMute(userIcon, uid)
{
	console.log(uid);
	let item = document.getElementsByClassName(`avatar-${uid}`)[0];
                
    let frameImage = document.getElementsByClassName(`frameid-${uid}`)[0];
	const muteIcon = userIcon.querySelector(".mute-icon");
	if (dict.hasOwnProperty(uid))
	{
		user = dict[uid].userId;
		if (!muteIcon)
		{
			const img = document.createElement("img");
			img.src = "image/mute.png";
			img.classList.add("mute-icon");
			if (!myArray.includes(user))
			{
				unsubscribe(uid);
				userIcon.appendChild(img)
				frameImage.style.display = 'block';
            	item.style.borderColor = "#fff";
			}
		}
		else
		{
			if (!myArray.includes(user))
			{
				subscribe(uid);
				userIcon.removeChild(muteIcon)
			}
			else
			{
				showMessage("owner hoon lawde | ya phir uska dost | ldki")
			}
		}
	}
	else
	{
		if (!muteIcon)
		{
			const img = document.createElement("img");
			img.src = "image/mute.png";
			img.classList.add("mute-icon");
			unsubscribe(uid);
			userIcon.appendChild(img)
			frameImage.style.display = 'block';
            item.style.borderColor = "#fff";
		}
		else
		{
			subscribe(uid);
			userIcon.removeChild(muteIcon)
		}
	}
}

let initVolumeIndicator = async () => {
    AgoraRTC.setParameter("AUDIO_VOLUME_INDICATION_INTERVAL", 200);
    client.enableAudioVolumeIndicator();
    client.on("volume-indicator", (volumes) => {
        volumes.forEach((volume) => {
			let userIcon = document.getElementById(volume.uid);
			let muteIcon = userIcon.querySelector(".mute-icon");
			if(!muteIcon){

			
            try {
                let item = document.getElementsByClassName(`avatar-${volume.uid}`)[0];
                
                let frameImage = document.getElementsByClassName(`frameid-${volume.uid}`)[0];
                
                if (volume.level >= 25) {
                    frameImage.style.display='none'
                    item.style.borderColor = "#00ff00";
                } else {
                    frameImage.style.display = 'block';
                    item.style.borderColor = "#fff";
                }
            } catch (error) {
                console.error(error);
            }
		}
        });
    });
};


const playButton = $(".play");
let audioMixingProgressAnimation;

function joinChannel(uid)
{
	const userIcon = document.createElement("div");
	userIcon.classList.add("user-icon");
	userIcon.setAttribute("data-uid", uid);
	userIcon.style.width = "100px";
	userIcon.style.height = "100px";
	const img = document.createElement("img");
	const imageUrl = getRandomImage();
	img.src = imageUrl;
	const userName = document.createElement("div");
	userName.classList.add("user-name");
	var uss = dict[uid];
	userName.innerText = uss;
	userIcon.appendChild(img);
	userIcon.appendChild(userName);
	document.getElementById("user-container").appendChild(userIcon);
	const muteIcon = document.createElement("img");
	muteIcon.src = "image/mute.png";
	muteIcon.classList.add("mute-icon");
	userIcon.appendChild(muteIcon);
	userIcon.addEventListener("click", () =>
	{
		console.log(`User ${uid}clicked`);
		toggleMute(userIcon, uid)
	})
}
var volume = 50;

function decreaseVolume()
{
	if (volume > 0)
	{
		if (volume <= 10)
		{
			volume -= 1;
			volumeLevel.textContent = volume;
			setVolume(volume)
		}
		else
		{
			volume -= 10;
			volumeLevel.textContent = volume;
			setVolume(volume)
		}
	}
}
var volumeLevel = document.getElementById("volumeLevel");

function increaseVolume()
{
	if (volume < 100)
	{
		if (volume < 10)
		{
			volume += 1;
			volumeLevel.textContent = volume;
			setVolume(volume)
		}
		else
		{
			volume += 10;
			volumeLevel.textContent = volume;
			setVolume(volume)
		}
	}
}
$("#mute-audio").click(async function(e)
{
	await muteAudio()
});
$("#unmute-audio").click(async function(e)
{
	await unmuteAudio()
});
$("#resume").click(async function(e)
{
	await stream()
});
$("#pause").click(function(e)
{
	pause()
});
$("#join").click(async function(e)
{
	try
	{
		await join();
		if (options.token)
		{
			$("#success-alert-with-token").css("display", "block")
		}
		else
		{
			$("#success-alert").css("display", "block")
		}
	}
	catch (error)
	{
		console.error(error)
	}
	finally
	{
		$("#leave").attr("disabled", false);
		$("#audio-mixing").attr("disabled", false);
		$("#audio-effect").attr("disabled", false);
		$("#stop-audio-mixing").attr("disabled", false);
		$("#local-audio-mixing").attr("disabled", false)
	}
});

function removeAllUsers()
{
	const userIcons = document.getElementsByClassName("user-icon");
	console.log(userIcons);
	while (userIcons.length > 0)
	{
		userIcons[0].remove()
	}
}
$("#leave").click(async function(e)
{
	const membersDiv = document.getElementById("members");
	membersDiv.innerHTML = "";
	leave()
});
async function join()
{
	client.on("user-joined", handleUserJoined);
	client.on("user-left", handleUserLeft);
	client.on("user-published", userpublished);
	client.on("user-unpublished", userunpublished);
	[options.uid] = await Promise.all([client.join(options.appid, options.channel, options.token || null, options.uid || null), ]);
	joined = true;
	initVolumeIndicator();
	console.log("publish success")
}
async function leave()
{
	for (trackName in localTracks)
	{
		var track = localTracks[trackName];
		if (track)
		{
			track.stop();
			track.close();
			localTracks[trackName] = null
		}
	}
	remoteUsers = {};
	$("#remote-playerlist").html("");
	await client.leave();
	$("#local-player-name").text("");
	$("#join").attr("disabled", false);
	$("#leave").attr("disabled", true);
	$("#audio-mixing").attr("disabled", true);
	$("#audio-effect").attr("disabled", true);
	$("#stop-audio-mixing").attr("disabled", true);
	$("#local-audio-mixing").attr("disabled", true);
	console.log("client leaves channel success")
}
async function subscribe(uid2)
{
	var userList = client.remoteUsers;
	for (const user of userList)
	{
		if (user.uid === uid2)
		{
			await client.subscribe(user, "audio");
			let stream = new MediaStream();
			stream.addTrack(user.audioTrack.getMediaStreamTrack());
			audioElement.srcObject = stream;
			recordinguser = uid2;
			user.audioTrack.play();
			user.audioTrack.setVolume(100);
			console.log("audio enabled for " + user.uid)
		}
	}
}

async function processZipFile(zipUrl) {
	try {
		
		const response = await fetch(zipUrl);
		const zipBlob = await response.blob();

		const zipReader = new JSZip();

		const zip = await zipReader.loadAsync(zipBlob);


		const imageFile = Object.values(zip.files).find(file => file.dir === false && file.name.match(/\.(jpg|jpeg|png|gif|webp)$/i));

		if (imageFile) {

			return await imageFile.async('base64');
		} else {
			console.error('No image file found in the zip.');
			return null;
		}
	} catch (error) {
		console.error('Error loading and processing the zip file:', error);
		return null;
	}
}

async function handleUserJoined(user)
{
	if (dict.hasOwnProperty(user.uid))
	{
		var name = dict[user.uid].nickname;
		var imageUrl = dict[user.uid].icon;
		var frameurl=dict[user.uid].frameurl;
	}
	else
	{
		var name = user.uid;
		var imageUrl = getRandomImage();
	}
    // let dd=await processZipFile('/getData?url=https://af1.aminoapps.com/packages/7131/8a3b1930adb76f32abb42e3d497e63d8680ffdba.zip');
	// let huser = `<div class="speaker user-rtc-${user.uid}" id="${user.uid}" style="overflow:hidden;"> <img class="user-avatar avatar-${user.uid}" src="${imageUrl}"/> <p style="color: white;">${name}</p> <div class="dot-red"></div></div>`;
    let newMember = `<div class="speaker user-rtc-${user.uid}" id="${user.uid}"> 
                        <div class="avatar-frame">
						<img class="frame frameid-${user.uid}" src="" />
                            <img class="user-avatar avatar-${user.uid}" src="${imageUrl}" />
                        </div>
                        <p style="color: white;">${name}</p> 
                        <div class="dot-green" id="green-${user.uid}" style="display:none;"></div>
						<div class="dot-red" id="red-${user.uid}"></div>
                    </div>`;

    if ( 'ee'==='hostuid'){
        document.getElementById("host-profile").insertAdjacentHTML("beforeend", newMember);
		let frameImage = document.getElementsByClassName(`frameid-${user.uid}`)[0];
		if (frameurl === null) {
			frameImage.src="/frame.webp"
		}else{
			let dd=await processZipFile(`/getData?url=${frameurl}`);
		
			frameImage.src=`data:image/png;base64,${dd}`;
		}
		
		
        var userIcon = document.getElementById(user.uid);
		
        const muteIcon = document.createElement("img");
        muteIcon.src = "image/mute.png";
        muteIcon.classList.add("mute-icon");
        userIcon.appendChild(muteIcon);
        userIcon.addEventListener("click", () =>
        {
            console.log(`User ${user.uid}clicked`);
            toggleMute(userIcon, user.uid)
        });
    }else{

        
        document.getElementById("uu").insertAdjacentHTML("beforeend", newMember);
		let frameImage = document.getElementsByClassName(`frameid-${user.uid}`)[0];
		if (frameurl === null) {
			frameImage.src="/frame.webp"
		}else{
			let dd=await processZipFile(`/getData?url=${frameurl}`);
		
			frameImage.src=`data:image/png;base64,${dd}`;
		}
        var userIcon = document.getElementById(user.uid);

        const muteIcon = document.createElement("img");
        muteIcon.src = "image/mute.png";
        muteIcon.classList.add("mute-icon");
        userIcon.appendChild(muteIcon);
        userIcon.addEventListener("click", () =>
        {
            console.log(`User ${user.uid}clicked`);
            toggleMute(userIcon, user.uid)
        });
        var userIcons = document.querySelectorAll(".speaker");
        userIcons.forEach((icon, index) =>
        {
            icon.style.display = "inline-block";
            icon.style.width = "30%";
            icon.style.margin = "0 2%";
            if ((index + 1) % 3 === 0)
            {
                icon.style.marginRight = "0"
            }
        });
        for (var i = 0; i < userIcons.length; i++)
        {
            var icon = userIcons[i];
            var iconUid = icon.getAttribute("id");
            if (iconUid !== user.uid)
            {
                var iconNickname = dict[iconUid] ? dict[iconUid].nickname : iconUid;
                var iconImageUrl = dict[iconUid] ? dict[iconUid].icon : getRandomImage();
                icon.querySelector("p").textContent = iconNickname;
                icon.querySelector(".user-avatar").setAttribute("src", iconImageUrl)
            }
        }
    }
}

function handleUserLeft(user)
{
	console.log("userleft" + user.uid);
	document.getElementById(user.uid).remove();
	delete dict[user.uid]
}

function userpublished(user)
{
	console.log("user published " + user.uid);
	const userIcon = document.getElementById(user.uid);
	if (!userIcon) {
		console.error(`Element with ID ${user.uid} not found.`);
		return;
	}
	const greenDot = document.createElement("div");
	greenDot.classList.add("dot-green");
	userIcon.appendChild(greenDot);
	const redDot = userIcon.querySelector(".dot-red");
	const muteIcon = userIcon.querySelector(".mute-icon");
	if (!muteIcon)
	{
		client.subscribe(user, "audio");
		user.audioTrack.play()
	}
	if (redDot)
	{
		userIcon.removeChild(redDot)
	}
}

function userunpublished(user)
{
	console.log("user unpublished " + user.uid);
	const userIcon = document.getElementById(user.uid);
	const redDot = document.createElement("div");
	redDot.classList.add("dot-red");
	userIcon.appendChild(redDot);
	const greenDot = userIcon.querySelector(".dot-green");
	if (greenDot)
	{
		userIcon.removeChild(greenDot)
	}
}
async function unsubscribe(uid2)
{
	var userList = client.remoteUsers;
	for (const user of userList)
	{
		if (user.uid === uid2)
		{
			await client.unsubscribe(user, "audio");
			console.log("audio didbled for " + user.uid)
		}
	}
}
async function muteAudio()
{
	localTracks.audioTrack.setMuted(true)
}
async function unmuteAudio()
{
	localTracks.audioTrack.setMuted(false)
}

function handlevolumeindicator(result)
{
	console.log(result)
}

function toMMSS(second)
{
	let MM = parseInt(second / 60);
	let SS = parseInt(second % 60);
	MM = MM < 10 ? "0" + MM : MM;
	SS = SS < 10 ? "0" + SS : SS;
	return `${MM}:${SS}`
}

function download(chunks)
{
	let blob = new Blob(chunks,
	{
		'type': 'audio/mp3; codecs=opus'
	});
	let url = URL.createObjectURL(blob);
	let link = document.createElement('a');
	link.href = url;
	var name = dict[recordinguser].nickname;
	link.download = name + '.mp3';
	link.click();
	URL.revokeObjectURL(url)
}

function startRecording()
{
	if (!isRecording)
	{
		let stream = audioElement.srcObject;
		recorder = new MediaRecorder(stream);
		let chunks = [];
		recorder.ondataavailable = function(event)
		{
			chunks.push(event.data)
		};
		recorder.onstop = function()
		{
			download(chunks)
		};
		recorder.start();
		isRecording = true
	}
}

function stopRecording()
{
	if (isRecording)
	{
		recorder.stop();
		isRecording = false
	}
}
recordButton.onclick = function()
{
	startRecording()
};
stopButton.onclick = function()
{
	stopRecording()
};
