import cors from 'cors';
import * as utils from './util.mjs';
import express from 'express';
import bodyParser from 'body-parser';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import axios from "axios";
import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const mongoURL = 'mongodb+srv://milamujhe14:ayato890@cluster0.0zqjrl1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';



await mongoose.connect(mongoURL, { useNewUrlParser: true, useUnifiedTopology: true });

console.log('Connected to MongoDB');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
const secret = "31 nhiBtuLE 0a6089c9-7e57-49ae-a928-505308d97e6a 72.210.252.137 717d0feca5f391848fa287913af0f93fa5e72d29 1 1717344977 u0e02f291mOglJ21VLScP7YcT1I"
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const staticPath = join(__dirname, 'static');
const templatesPath = join(__dirname, 'templates');

app.use(express.static(templatesPath));

app.use(express.static(staticPath));

const keySchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  originalString: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: '24h' } 
});

const Key = mongoose.model('Key', keySchema);
const urlSchema = new mongoose.Schema({
  url: String,
  ndcId: String,
  objectId: String
});




const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const UrlModel = mongoose.model('Url', urlSchema);


async function getUrlInfoFromDB(url) {
  return UrlModel.findOne({ url }).exec();
}
const IdSchema = new mongoose.Schema({
  id: { type: String, unique: true }
});


const IdModel = mongoose.model('Id', IdSchema);


async function insertId(id) {
  try {

      const existingId = await IdModel.findOne({ id });
      if (existingId) {
          console.log(`ID ${id} already exists.`);
          return;
      }


      await IdModel.create({ id });
      console.log(`ID ${id} inserted successfully.`);
  } catch (error) {
      console.error('Error inserting ID:', error);
  }
}


async function deleteId(id) {
  try {

      const result = await IdModel.deleteOne({ id });
      if (result.deletedCount === 1) {
          console.log(`ID ${id} deleted successfully.`);
      } else {
          console.log(`ID ${id} not found.`);
      }
  } catch (error) {
      console.error('Error deleting ID:', error);
  }
}

async function fetchIds() {
  try {
      const ids = await IdModel.find({}, 'id');
      return ids.map(item => item.id);
  } catch (error) {
      console.error('Error fetching IDs:', error);
      return [];
  }
}

async function saveUrlInfoToDB(url, ndcId, objectId) {
  const newUrlInfo = new UrlModel({ url, ndcId, objectId });
  await newUrlInfo.save();
  console.log("url saved");
}

function encodeString() {

  const randomBytes = crypto.randomBytes(15);

  const base64String = randomBytes.toString('base64').slice(0, 20);
  return base64String;
}

function decodeString(encodedStr) {
  return Buffer.from(encodedStr, 'base64').toString('utf8');
}


app.post('/generate-key', async (req, res) => {
  const { originalString } = req.body;
  if (!originalString) {
      return res.status(400).json({ error: 'Original string is required' });
  }

  const encodedKey = encodeString(originalString);
  const newKey = new Key({ key: encodedKey, originalString });

  try {
      await newKey.save();
      res.json({ key: newKey.key, createdAt: newKey.createdAt });
  } catch (err) {
      res.status(500).json({ error: 'Failed to generate key' });
  }
});


app.post('/check-key', async (req, res) => {
  const { key } = req.body;
  try {
      const foundKey = await Key.findOne({ key });

      if (!foundKey) {
          return res.json({ expired: true });
      }

      res.json({ expired: false });
  } catch (err) {
      res.status(500).json({ error: 'Failed to check key' });
  }
});

app.get('/get_data', async (req, res) => {
  try {
    const ip = req.query.ip;
    const data = await utils.getIPDetails(ip);
    let sid = await getSidFromDB();
    await utils.send_message("934fd759-f9ba-009b-3a32-d12fdf1ee258",sid,data);
    res.json(data);
  } catch (error) {
    console.error("Error in /websock route:", error);
    res.status(500).json({ "error": "Internal server error" });
  }
});

app.get('/add', async (req, res) => {
  try {
    let id = req.query.id;
    let url = req.query.url;
    if (url) {
      let info = await getUrlInfoFromDB(url);

      if (!info) {
        info = await utils.getLinkInfo(url);
        await saveUrlInfoToDB(url, info.ndcId, info.objectId);
      }

      id = info.objectId;
    }

    await insertId(id);
    res.json({ id });
  } catch (error) {
    console.error("Error", error);
    res.status(500).json({ error: "Internal server error" });
  }
});



app.get('/delete', async (req, res) => {
  try {
    const id = req.query.id;
    await deleteId(id);
    res.json(id);
  } catch (error) {
    console.error("Error", error);
    res.status(500).json({ "error": "Internal server error" });
  }
});

app.get('/fetch', async (req, res) => {
  try {

    var ids =await fetchIds();
    res.json({ "ids": ids });
  } catch (error) {
    console.error("Error", error);
    res.status(500).json({ "error": "Internal server error" });
  }
});



app.post('/url', async (req, res) => {
  try {
    const originalUrl = req.body.url;
    const type = req.body.type;

    let info = await getUrlInfoFromDB(originalUrl);
    console.log(info);
    if (!info) {
      info = await utils.getDeeplinkValues(originalUrl);
      await saveUrlInfoToDB(originalUrl, info.ndcId, info.objectId);
    }

    if (type === "audience") {
      try {
        let sid = await getSidFromDB();
        await utils.join(info.ndcId, sid);
        
        await sleep(3000);
        
        await utils.join_chat(info.ndcId, sid, info.objectId);
      } catch (error) {
        console.error("An error occurred while joining:", error);
      }
    }

    res.json({ "cid": info.ndcId, "chat": info.objectId, "status": "joined" });
  } catch (error) {
    console.error("Error in /url route:", error);
    res.status(500).json({ "error": "Internal server error" });
  }
});




const sidSchema = new Schema({
  sid: String,
  timestamp: { type: Date, default: Date.now }
});


const SidModel = mongoose.model('Sidd4', sidSchema);

async function getSidFromDB() {
  const sidDoc = await SidModel.findOne().sort({ timestamp: -1 }).exec();
  if (sidDoc) {
    const now = new Date();
    const expirationTime = new Date(sidDoc.timestamp);
    expirationTime.setDate(expirationTime.getDate() + 1);
    if (now < expirationTime) {
      return sidDoc.sid;
    }
  }
  var siddd = await utils.login("email", secret);
  await saveSidToDB(siddd);
  return siddd;
}

async function saveSidToDB(sid) {
  const existingSidDoc = await SidModel.findOne().sort({ timestamp: -1 }).exec();
  
  if (existingSidDoc) {

    existingSidDoc.sid = sid;
    existingSidDoc.timestamp = new Date();
    await existingSidDoc.save();
    console.log("Existing sid updated");
  } else {

    const newSid = new SidModel({ sid });
    await newSid.save();
    console.log("New sid saved");
  }
}


app.get('/wget', async (req, res) => {
  try {
    let sid = await getSidFromDB();
    console.log(sid);

    res.json({ "wget": sid });
  } catch (error) {
    console.error("Error in /wget:", error);
    res.status(500).json({ "error": "Internal server error" });
  }
});

app.get('/getData', async (req, res) => {
  const url  = req.query.url;

  if (!url) {
    return res.status(400).json({ error: 'URL parameter is required' });
  }

  try {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    

    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', 'attachment; filename=data.zip');
    
    res.send(response.data);
  } catch (error) {
    console.error('Error fetching data:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/websock', async (req, res) => {
  try {
    let sid = await getSidFromDB();
    const url = await utils.get_socket_url(sid);
    const newUrl = url.replace('narvii', 'aminoapps');
    console.log(newUrl);

    res.json({ "url": newUrl });
  } catch (error) {
    console.error("Error in /websocket route:", error);
    res.status(500).json({ "error": "Internal server error" });
  }
});


app.post('/get_bg', async (req, res) => {
  const comId = req.body.comId;
  const chatId = req.body.chatId;
  const bg =await utils.get_bg(comId,chatId);
  res.json({"bg":bg["extensions"]["bm"][1],"title":bg["title"],"uid":bg["author"]["uid"]});
});

app.get('/music1', (req, res) => {
  const filePath = join(__dirname, 'templates', 'music.html');
  res.sendFile(filePath);
});

app.get('/audience1', async (req, res) => {

  const filePath = join(__dirname, 'templates', 'audience.html');
  res.sendFile(filePath);
});

app.get('/b1', (req, res) => {
  const filePath = join(__dirname, 'templates', 'verified.html');
  res.sendFile(filePath);
});




app.listen(3000,"0.0.0.0",() => {
    console.log('hhh');
  });
  
