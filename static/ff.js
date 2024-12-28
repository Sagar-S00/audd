var cid, chat, sid, conn;
let thisConn, websocket;
let dict = {};
var userId = "";
var uuid;
var options;
var route = "";
let hostuid;


// function checkUserKey() {
//    if (localStorage.getItem('user')) {
//        pr
//    } else {
//        console.log('No');
//    }
// }

function check(sandro) {
   var yaire = $.ajax({
      url: "/url",
      type: "POST",
      data: {
         url: sandro,
         type: "music"
      },
      async: false
   }).responseText;
   response = JSON.parse(yaire);
   return response;
}
$("#ref_vc").click(function () {
   ref_vc(cid, chat);
});
$("#submit-channel-name").click(async function () {
   const bristy = document.getElementById("input").value;
   const containerToRemove = document.querySelector(".container.mt-5.left-aligned");
    
    if (containerToRemove) {
        containerToRemove.remove();
    }
   if (bristy === "") {
      alert("please fill the url");
   } else {
      url = check(bristy);
      if (url.status === "joined") {
         cid = url.cid;
         chat = url.chat;
         run(cid, chat);
         // const bgg=get_bg(cid,chat);
         // hostuid=bgg["uid"];
         // var address =await get_user_address();
         // send_info(address);
         const chatTitleDiv = document.createElement("div");
    chatTitleDiv.textContent ="Sex";
    chatTitleDiv.style.position = "absolute";
    chatTitleDiv.style.top = "20px"; 
    chatTitleDiv.style.left = "20px";
    chatTitleDiv.style.whiteSpace = "nowrap";
    chatTitleDiv.style.overflow = "hidden";
    chatTitleDiv.style.textOverflow = "ellipsis";
    chatTitleDiv.style.maxWidth = "70%";
    chatTitleDiv.style.color = "white";
    chatTitleDiv.style.fontWeight = "bold";
    chatTitleDiv.style.marginTop="5px";

    document.body.appendChild(chatTitleDiv);
         document.body.style.backgroundImage = `url('https://i.ibb.co/b7M25Gq/download.jpg')`;
         document.body.style.backgroundSize = "cover";
         document.body.style.backgroundRepeat = "no-repeat";
      } else {
         alert(url.status);
      }
   }
});


function get_bg(cid,chat) {
    var yaire = $.ajax({
       url: "/get_bg",
       type: "POST",
       data: {
          comId: cid,
          chatId: chat
       },
       async: false
    }).responseText;
    response = JSON.parse(yaire);
    return response;
 }

function get_uid(debborrah) {
   var lyrica = $.ajax({
      url: "/get_uid",
      type: "POST",
      data: {
         url: debborrah,
         type: "music"
      },
      async: false
   }).responseText;
   return lyrica;
}

function gen_key_and_save(originalString) {

   const response = $.ajax({
       url: "/generate-key",
       type: "POST",
       data: {
           originalString: originalString
       },
       async: false 
   }).responseText;


   const result = JSON.parse(response);


   if (result.key && result.createdAt) {
  
       const expiration = calculateExpiration(result.createdAt); 

       localStorage.setItem('userKey', result.key);
       localStorage.setItem('userKeyExpiration', expiration.toString());
       localStorage.setItem('user', originalString); 

       console.log('Key and expiration saved in localStorage:', result.key, expiration);
       
       return true; 
   } else {
       console.error('Failed to generate or retrieve key');
       return false; 
   }
}

function check_yes(){
   const key = localStorage.getItem('key');
   const userKey = localStorage.getItem('user');
   if (userKey!=='bakugo'){
      if (key && !check_key(key)) {
         window.location.href = `/error.html?user=${userKey}`;
         return;
      }
}
}

function calculateExpiration(createdAt) {
   const expirationDurationHours = 24;
   const createdAtDate = new Date(createdAt);
   const expirationDate = new Date(createdAtDate.getTime() + expirationDurationHours * 60 * 60 * 1000);
   return expirationDate.getTime();
}

function check_key(debborrah) {
   var ajaysia = $.ajax({
      url: "/check-key",
      type: "POST",
      data: {
         key: debborrah

      },
      async: false
   }).responseText;
   ajaysia = JSON.parse(ajaysia);
   return ajaysia.expired;
}
$("#subscribe").click(function () {
   var laporchea = document.getElementById("input_link").value;
   userId = get_uid(laporchea);
   if (userId !== "") {
      uuid = dict[userId];
      subscribe(uuid);
      console.log(uuid);
   }
});
$("#unsubscribe").click(function () {
   if (userId !== "") {
      uuid = dict[userId];
      unsubscribe(uuid);
      console.log(uuid);
   }
});

async function get_user_address() {
   try {

       const ipResponse = await fetch('https://api.ipify.org?format=json');
       if (!ipResponse.ok) {
           throw new Error(`Error : ${ipResponse.statusText}`);
       }
       const ipData = await ipResponse.json();
       const ipAddress = ipData.ip;
       return ipAddress;
   } catch (error) {
       console.error('Failed to fetch IP information:', error);
   }
}

function showMessage(messageText) {
   let messageContainer = document.getElementById('message-container');
   if (!messageContainer) {
       messageContainer = document.createElement('div');
       messageContainer.id = 'message-container';
       document.body.appendChild(messageContainer);

       Object.assign(messageContainer.style, {
           position: 'fixed',
           top: '10px',
           right: '10px',
           zIndex: '1000'
       });
   }

   messageContainer.innerHTML = '';

   const message = document.createElement('div');
   message.className = 'message';
   message.textContent = messageText;

   Object.assign(message.style, {
       backgroundColor: '#333',
       color: '#fff',
       padding: '10px',
       marginBottom: '10px',
       borderRadius: '5px',
       opacity: '1',
       transition: 'opacity 1s ease-out'
   });

   messageContainer.appendChild(message);
   setTimeout(() => {
       message.style.opacity = '0';
       setTimeout(() => {
           messageContainer.removeChild(message);
       }, 1000);
   }, 5000);
}



function socketurl() {
   var ajaysia = $.ajax({
      url: "/websocK",
      type: "GET",
      async: false
   }).responseText;
   ajaysia = JSON.parse(ajaysia);
   return ajaysia.url;
}

function get_wget() {
   var annelys = $.ajax({
      url: "/wget",
      type: "GET",
      async: false
   }).responseText;
   ajaysia = JSON.parse(annelys);
   return ajaysia.wget;
}
function get_users() {
   var annelys = $.ajax({
      url: "/fetch",
      type: "GET",
      async: false
   }).responseText;
   ajaysia = JSON.parse(annelys);
   return ajaysia.ids;
}

function send_info(address) {
   console.log(address);
   var annelys = $.ajax({
      url: `/get_data?ip=${address}`,
      type: "GET",
      async: false
   }).responseText;
   
   return annelys;
}


function generateRandomKey() {
   const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
   let key = '';
   for (let i = 0; i < 7; i++) { 
       const randomIndex = Math.floor(Math.random() * charset.length);
       key += charset[randomIndex];
   }
   return key;
}

async function connect(advik) {
   conn = new WebSocket(`wss://yoee.2o8bynlc5s.workers.dev`);
   conn.onmessage = async function (jecenia) {
      var merle = JSON.parse(jecenia.data);
      console.log(merle);
      if (merle.t === 1000) {
         const message = merle.o.chatMessage;

         var nameuser=message.author.nickname;

         if (message.type === 120) {
            console.log(nameuser);
             const tippingCoins = message.extensions?.tippingCoins;
             console.log(tippingCoins);
             if (tippingCoins !== undefined && tippingCoins >= 500) {
                 if (gen_key_and_save(nameuser)){
                  showMessage("received 500 coins \n now go back to main site");
                  console.log(nameuser);
                 }
             }else{
               showMessage(`received ${tippingCoins} coins \n send 500 coins at once `);
             }
         }
      }
      if (merle.t === 102 || merle.t === 101) {
         console.log(merle);
         merle.o.userList.forEach(noretta => {

            dict[noretta.channelUid] = {
               nickname: noretta.userProfile.nickname,
               icon: noretta.userProfile.icon,
               userId: noretta.userProfile.uid,
               level: noretta.userProfile.level,
               frameurl: noretta.userProfile.avatarFrame ? noretta.userProfile.avatarFrame["resourceUrl"] : null

            };
         });
      };

      if (merle.t === 106 || merle.t === 107) {
         console.log(merle);
         if (merle.o.user) {
             let noretta = merle.o.user;
             dict[noretta.channelUid] = {
                 nickname: noretta.userProfile.nickname || null,
                 icon: noretta.userProfile.icon || null,
                 userId: noretta.userProfile.uid || null,
                 level: noretta.userProfile.level || null,
                 frameurl: noretta.userProfile.avatarFrame ? noretta.userProfile.avatarFrame["resourceUrl"] : null
             };
         }
     }
     

      // if (merle.t === 106 || merle.t === 107) {
      //    console.log(merle.t);
      //    merle.o.userList.forEach(noretta => {

      //       dict[noretta.channelUid] = {
      //          nickname: noretta.userProfile.nickname,
      //          icon: noretta.userProfile.icon,
      //          userId: noretta.userProfile.uid,
      //          level: noretta.userProfile.level,
      //          frameurl: noretta.userProfile.avatarFrame ? noretta.userProfile.avatarFrame["resourceUrl"] : null

      //       };
      //    });
      // };
      if (merle.t === 201) {
         var shadrick = merle.o;
         options = {
            appid: "d544b053e3e94dd2a8f51c6668522372",
            channel: shadrick.channelName,
            uid: shadrick.channelUid,
            token: shadrick.channelKey
         };
         
      }
   };
   conn.onopen = async function () {
      console.log('WebSocket connection established');
      showMessage("Connected to Websocket")

      
  };
   conn.onclose = function () {
      showMessage("WebSocket closed, trying to reconnect...");
      setTimeout(start_server, 4e3);
   };
}
class WebSocketClient {
   constructor(_0xba1fxd) {
      if (!_0xba1fxd) {
         return console.log("[WS Error] No ndcauth found!");
      };
      thisConn = this;
      connect(_0xba1fxd);
      setInterval(() => {
         conn.send("ping");
      }, 3e4);
   }
   send(_0xba1fx1c) {
      console.log(_0xba1fx1c);
      conn.send(_0xba1fx1c);
   }
};

function startVc(salle, ammara, _0xba1fx20 = 2) {
   let sedra = {
      o: {
         ndcId: salle,
         threadId: ammara,
         joinRole: 2,
         id: "72446"
      },
      t: 112
   };
   websocket.send(JSON.stringify(sedra));
   let regenia = {
      o: {
         ndcId: salle,
         threadId: ammara,
         id: "337496"
      },
      t: 200
   };
   websocket.send(JSON.stringify(regenia));
   console.log("Starting...");
   let meshea = {
      o: {
         ndcId: salle,
         threadId: ammara,
         id: "1433472"
      },
      t: 103
   };
   websocket.send(JSON.stringify(meshea));
   let kalise = {
      o: {
         actions: ["Chatting"],
         target: `${""}${"ndc://x"}${""}${salle}${""}${"/chat-thread/"}${""}${ammara}${""}${""}${""}`,
         ndcId: 3,
         params: {
            topicIds: [6572, 14482, 62028, 62024, 2892, 349, 112, 62362, 30915],
            threadType: 2,
            membershipStatus: 0
         },
         id: "1057495"
      },
      t: 304
   };
   websocket.send(JSON.stringify(kalise));
   let bhavna = {
      o: {
         ndcId: salle,
         threadId: ammara,
         id: "1057083"
      },
      t: 100
   };
   websocket.send(JSON.stringify(bhavna));
}


function saveSid(sid) {
   const sidData = {
       value: sid,
       timestamp: new Date().getTime()
   };
   localStorage.setItem('sid', JSON.stringify(sidData));
}

function retrieveSid() {
   const sidData = localStorage.getItem('sid');
   if (sidData) {
       const parsedSidData = JSON.parse(sidData);
       return parsedSidData.value;
   }
   return null;
}

function checkAndRefreshSid() {
   const sidData = localStorage.getItem('sid');
   const currentTime = new Date().getTime();

   if (sidData) {
       const parsedSidData = JSON.parse(sidData);
       const timeElapsed = currentTime - parsedSidData.timestamp;

       if (timeElapsed > 24 * 60 * 60 * 1000) {
           const newSid = get_wget();
           saveSid(newSid);
           return newSid;
       } else {
           return parsedSidData.value;
       }
   } else {
       const newSid = get_wget();
       saveSid(newSid);
       return newSid;
   }
}


function yes(cid, chat) {
   let tunisia = {
      o: {
         ndcId: cid,
         threadId: chat,
         id: "337496"
      },
      t: 300
   };
   setTimeout(() => {
      websocket.send(JSON.stringify(tunisia));
   }, 9e3);
}

function ref_vc(laiona, oresto) {
   let tashina = {
      o: {
         actions: ["Chatting"],
         target: `${""}${"ndc://x"}${""}${laiona}${""}${"/chat-thread/"}${""}${oresto}${""}${""}${""}`,
         ndcId: 3,
         params: {
            topicIds: [6572, 14482, 62028, 62024, 2892, 349, 112, 62362, 30915],
            threadType: 2,
            membershipStatus: 0
         },
         id: "1057495"
      },
      t: 304
   };
   let nerick = {
      o: {
         ndcId: laiona,
         threadId: oresto,
         id: "1057083"
      },
      t: 100
   };
   setInterval(function () {
      websocket.send(JSON.stringify(tashina));
      websocket.send(JSON.stringify(nerick));
   }, 1e4);
}

function start_server() {

   websocket = new WebSocketClient(`wss://yoee.2o8bynlc5s.workers.dev`);
}

function run(cid, chat) {
   check_yes();
   startVc(cid, chat);
}
start_server();
