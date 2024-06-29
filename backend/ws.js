const dynamoose = require("dynamoose");
const mongoose = require('mongoose');
const { WebSocketServer } = require("ws");

const MONGO_PASSWORD = "cirossmonteiro";

const uri = `mongodb+srv://admin:${MONGO_PASSWORD}@cluster0.gzqlggm.mongodb.net/?retryWrites=true&w=majority`;

mongoose.connect(uri);

const wss = new WebSocketServer({ port: 3001 });

const AWS_ACCESS_KEY_ID = "AKIA6E6XYSKEISURCCZ7";

const AWS_SECRET_ACCESS_KEY = "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";

const AWS_REGION = "us-east-1";

const ddb = new dynamoose.aws.ddb.DynamoDB({
  "credentials": {
      "accessKeyId": AWS_ACCESS_KEY_ID,
      "secretAccessKey": AWS_SECRET_ACCESS_KEY
  },
  "region": AWS_REGION
});

dynamoose.aws.ddb.set(ddb);

const Order = dynamoose.model("Order", {"id": String});
const Shipment = dynamoose.model("Shipment", {"id": String});
const Table = new dynamoose.Table("chat", [Order, Shipment]);

const chatSchema = new mongoose.Schema({
  username: String,
  message: String
}, {
  timestamps: true
});

const chatCollection = mongoose.model("chat", chatSchema);

wss.on('connection', async function connection(ws) {
  /* console.log(6, "connected");
  const order = new Order({ id: "123"});
  console.log(6, order);
  order.save((error) => {
    if (error) {
        console.error(30, error);
    } else {
        console.log("Save operation was successful.");
    }
  });
  console.log(6, 27); */
  ws.send(JSON.stringify(await chatCollection.find()));
  ws.on('error', console.error);

  // ws.on('message', async function message(data) {
  //   const { username, message } = JSON.parse(data);
  //   const newMessage = await chatCollection.create({ username, message });
  //   console.log(59, newMessage);
  // });
  ws.on("message", event => {
    console.log(63, event);
  })
});