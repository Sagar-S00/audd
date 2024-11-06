import * as crypto from "crypto";
import axios from "axios";
import { stringify } from "querystring";
import * as cheerio from 'cheerio';


const proxyConfig = false;


export async function getDeeplinkValues(url) {
  try {
      const { data } = await axios.get(url);
      const $ = cheerio.load(data);
      const scriptTag = $('script')
          .toArray()
          .find((script) => script.children[0] && script.children[0].data.includes('ServerData.deeplink'));

      if (scriptTag) {
          const match = /ServerData\.deeplink\s*=\s*"([^"]+)"/.exec(scriptTag.children[0].data);
          if (match) {
              const deeplink = match[1];
              const regex = /narviiapp:\/\/x(\d+)\/chat-thread\/([a-f0-9\-]+)/;
              const deeplinkMatch = regex.exec(deeplink);
              if (deeplinkMatch) {
                  return { ndcId: deeplinkMatch[1], objectId: deeplinkMatch[2] };
              }
          }
      }
      return null;
  } catch (error) {
      console.error('Error fetching or parsing the page:', error);
      return null;
  }
}

export async function getLinkInfo(code) {
  const url = `http://service.aminoapps.com/api/v1/g/s/link-resolution?q=${code}`;
  const response = await axios.get(url, {
    
    headers: buildHeaders(),
    proxy: proxyConfig
  });

  if (response.status === 200) {
    const linkInfo = response.data["linkInfoV2"]["extensions"]["linkInfo"];
    return linkInfo;
  } else {
    throw new Error("Failed to fetch link info.");
  }
}


export async function get_bg(comId,chatId) {
  const url = `http://service.aminoapps.com/api/v1/x${comId}/s/chat/thread/${chatId}`;

  const response = await axios.get(url, {
    headers: buildHeaders(),proxy: proxyConfig
  });

  if (response.status === 200) {
    const linkInfo = response.data["thread"];
    return linkInfo;
  } else {
    throw new Error("Failed to fetch link info.");
  }
}

export async function get_socket_url(sid) {
  var headers = {
    //'Host': 'aminoapps.com',
    'Cookie': `sid=${sid}`,
    'user-agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.61 Safari/537.36',
    'accept': '*/*',
    'referer':
    'http://aminoapps.com/partial/main-chat-window?ndcId=86797652&source=sidebar_community_list&action=click',
    'accept-language': 'en-US,en;q=0.9',
}
  const url = 'https://ff6.ncm5okz.workers.dev/proxy?url=http://aminoapps.com/api/chat/web-socket-url';

  const response = await axios.get(url, {
    headers: headers
  });

  if (response.status === 200) {
    const url = response.data["result"]["url"];
    return url;
  } else {
    throw new Error("Failed to fetch url");
  }
}

export async function login(email, password) {
  let data = JSON.stringify({
      "email": email,
      "v": 2,
      "secret": password,
      "deviceID": "19C51E1A6A83F6B34F954E7015AB7D6387DE977DE2535EB71D0629B7B7B78FABFFB5E15EC9B31996BA",
      "clientType": 100,
      "action": "normal",
      "timestamp": Date.now()
  });
  

  const response= await axios.post(
      "http://service.aminoapps.com/api/v1/g/s/auth/login",
      data, {
          headers: buildHeaders(data),proxy: proxyConfig});
  
      if (response.status === 200) {
        
           const sid = response.data.sid;
            return sid;
      } else {
            throw new Error("login failed");
        }
}


export async function join(comId, sid) {
  var url = `http://service.aminoapps.com/api/v1/x${comId}/s/community/join`;
  const data = { timestamp: Date.now() };
  const jsonData = JSON.stringify(data);
  
  const response = await axios.post(
    url,
    jsonData, 
    { headers: buildHeaders(jsonData, sid),proxy: proxyConfig } 
  );
  

  if (response.status === 200) {
    const linkInfo = response.data["api:message"];
    
    return linkInfo;
  } else {
    return null;
  }
}


export async function send_message(chatId, sid,message) {
  var url = `http://service.aminoapps.com/api/v1/g/s/chat/thread/${chatId}/message`;
  
                    

  let data = {
    type: 0,
    content:stringify(message),
    extensions: {mentionedArray: []},
    clientRefId:  Math.floor(Date.now() / 10 % 1000000000),
    timestamp: Date.now()
};
  const jsonData = JSON.stringify(data);
  
  const response = await axios.post(
    url,
    jsonData, 
    { headers: buildHeaders(jsonData, sid),proxy: proxyConfig } 
  );
  
 
  if (response.status === 200) {

    const linkInfo = response.data["api:message"];
    
    return linkInfo;
  } else {
    return null;
  }
}

export async function join_chat(comId, sid,chatId) {
  var url = `http://service.aminoapps.com/api/v1/x${comId}/s/chat/thread/${chatId}/member/bc108cca-c755-4ccd-8308-5f56ae3772bc`;
  const data = { timestamp: Date.now() };
  const jsonData = JSON.stringify(data);
  
  const response = await axios.post(
    url,
    jsonData,
    { headers: buildHeaders(jsonData, sid,"application/x-www-form-urlencoded"),proxy: proxyConfig } 
  );
  

  if (response.status === 200) {
    const linkInfo = response.data["api:message"];
    
    return linkInfo;
  } else {
    return response.data["api:message"];
  }
}

export async function getIPDetails(ip) {
  try {
      const response = await axios.get(`https://ipfind.co/?ip=${ip}`);
      const data = response.data;
      return {
          ip_address: data.ip_address,
          country: data.country,
          country_code: data.country_code,
          continent: data.continent,
          continent_code: data.continent_code,
          city: data.city,
          county: data.county,
          region: data.region,
          region_code: data.region_code,
          postal_code: data.postal_code,
          timezone: data.timezone,
          owner: data.owner,
          longitude: data.longitude,
          latitude: data.latitude,
          currency: data.currency
      };
  } catch (error) {
      console.error('Error fetching IP details:', error.message);
      throw error;
  }
}

export function getSignature(data) {
        let hmac = crypto.createHmac(
            "sha1",
            Buffer.from(
                "DFA5ED192DDA6E88A12FE12130DC6206B1251E44",
                "hex"
            )
        );
        hmac.update(data);
        return Buffer.from(
            Buffer.from("19", "hex") + hmac.digest("binary"),
            "binary"
        ).toString("base64");
    }


export function getDeviceI() {
  let id = crypto.randomBytes(20).toString("binary");
  let hmac = crypto.createHmac(
      "sha1",
      Buffer.from(
          "E7309ECC0953C6FA60005B2765F99DBBC965C8E9",
          "hex"
      )
  );
  hmac.update(Buffer.from(Buffer.from("19", "hex") + id, "binary"));
  return "19" + Buffer.from(id, "binary").toString("hex") + hmac.digest("hex");
}


export function buildHeaders(data, sid, type, sig) {
  var headers = {
    "Accept": "*/*",
    "Accept-Encoding": "gzip, deflate, br",
    "Accept-Language": "en-US,en;q=0.9",
    "Content-Type": "application/x-www-form-urlencoded",
    "User-Agent":"Apple iPhone12,1 iOS v15.5 Main/3.12.2",
    "Host": "service.aminoapps.com",
    "AUID":"3cf3a765-0651-40b9-9b98-605138748d8b",
    "Connection": "Upgrade",
    "NDCDEVICEID":"19C51E1A6A83F6B34F954E7015AB7D6387DE977DE2535EB71D0629B7B7B78FABFFB5E15EC9B31996BA"
  };
  if (data) {
    headers["Content-Length"] = String(data.length);
    headers["NDC-MSG-SIG"] = getSignature(data);
  }
  if (sid) {
    headers["NDCAUTH"] = "sid=" + sid;
  }
  if (type) {
    headers["Content-Type"] = type;
  }
  if (sig) {
    headers["NDC-MSG-SIG"] = sig;
  }

  return headers;
}
