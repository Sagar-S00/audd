let cid, chat, sid, conn;
let thisConn, websocket;
const dict = {};
let userId = "";
let uuid;
let options;

function toJson(data) {
  return JSON.parse(data.toString());
}

function check(url) {
  const r = $.ajax({
    url: "/url",
    type: "POST",
    data: {
      url: url,type:"audience"
    },
    async: false,
  }).responseText;
  const response = JSON.parse(r);
  return response;
}

function get_uid(url) {
  const response = $.ajax({
    url: '/get_uid',
    type: 'POST',
    data: { url: url },
    async: false
  }).responseText;
  return response;
}

function socketurl() {
 
  var response = $.ajax({
    url: '/websocket',
    type: 'POST',
    async: false
  }).responseText;
  response = JSON.parse(response);
  return response["url"]
};

function get_sid() {
  const response = $.ajax({
    url: '/sid',
    type: 'GET',
    async: false
  }).responseText;
  return response;
}

async function connect(url) {
  conn = new WebSocket(url);

  conn.onmessage = function(event) {
    const res = JSON.parse(event.data);
    if (res.t === 102 || res.t === 101) {
      res.o.userList.forEach(uid => {
        dict[uid.userProfile.uid] = uid.channelUid;
        console.log(dict);
      });
    }
    
    

    if (res.t === 201) {
      console.log(res.o);
      const vc = res.o;
      options = {
        appid: "d544b053e3e94dd2a8f51c6668522372",
        channel: vc.channelName,
        uid: vc.channelUid,
        token: vc.channelKey
      };
      join().then(() => {
        showMessage("vc started");
      }).catch(error => {
        showMessage("Failed to join:"+ error);
      });
    }
  };

  conn.onclose = function() {
    showMessage("WebSocket closed, trying to reconnect...");
    setTimeout(function() {
      connect(url); 
    }, 4000);
  };
}

class WebSocketClient {
  constructor(url) {
    if (!url) return console.log('[WS Error] No ndcauth found!');
    thisConn = this;
    connect(url);
    setInterval(() => {
      conn.send('ping');
    }, 30000);
  }

  send(data) {
    console.log(data);
    conn.send(data);
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

function get_wget() {
  var annelys = $.ajax({
     url: "/wget",
     type: "GET",
     async: false
  }).responseText;
  ajaysia = JSON.parse(annelys);
  return ajaysia.wget;
}

function startVc(comId, chatId, joinType = 1) {
  const data = {
    o: {
      ndcId: comId,
      threadId: chatId,
      joinRole: joinType,
      id: "2154531"
    },
    t: 112
  };

  setTimeout(function () {
    websocket.send(JSON.stringify(data));
  }, 1000);

  const data2 = {
    o: {
      ndcId: comId,
      threadId: chatId,
      channelType: 1,
      id: "2154531"
    },
    t: 108
  };

  websocket.send(JSON.stringify(data2));
}

function vc_token(comId, chatId) {
  const data3 = {
    o: {
      ndcId: comId,
      threadId: chatId,
      id: "337496"
    },
    t: 200
  };

  setTimeout(function () {
    websocket.send(JSON.stringify(data3));
  }, 3000);
}

function audience(comId, chatId, joinType = 1) {
  const data = {
    o: {
      ndcId: comId,
      threadId: chatId,
      joinRole: 2,
      id: "2154531"
    },
    t: 112
  };

  setTimeout(function () {
    websocket.send(JSON.stringify(data));
  }, 1000);
}

function end_vc(comId, chatId) {
  const data8 = {
    o: {
      ndcId: comId,
      threadId: chatId,
      id: "1433472",
    },
    t: 103,
  };

  websocket.send(JSON.stringify(data8));
}

function start_server() {

  websocket = new WebSocketClient(`wss://yoee.2o8bynlc5s.workers.dev`);
}

function run(cid, chat) {
  vc_token(cid, chat);
  audience(cid, chat);
}

$('#submit-channel-name').click(async function () {
  
  const uu = $('#input').val();

  if (uu === "") {
    alert("please fill the url");
  } else {
    const url = check(uu);
    cid = url["cid"];
    chat = url["chat"];
    run(cid, chat);

  }
});

$('#subscribe').click(function () {
  const urll = $('#input_link').val();
  userId = get_uid(urll);

  if (userId !== '') {
    uuid = dict[userId];
    subscribe(uuid);
    console.log(uuid);
  }
});

$('#end_vc').click(function () {
  end_vc(cid, chat);
});

$('#audience_vc').click(function () {
  audience(cid, chat);
});

$('#unsubscribe').click(function () {
  if (userId !== '') {
    uuid = dict[userId];
    unsubscribe(uuid);
    console.log(uuid);
  }
});
start_server();
