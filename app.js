const http = require("http");
const { MongoClient } = require("mongodb");

const url = process.env.MONGODB_URI || "mongodb://mongo:27017";
const client = new MongoClient(url);

async function start() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db("mydb");
    const collection = db.collection("test");

    const server = http.createServer(async (req, res) => {
      await collection.insertOne({ message: "Hello MongoDB", time: new Date() });
      const count = await collection.countDocuments();

      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end(`Hello from Node + MongoDB. Total docs: ${count}`);
    });

    server.listen(3000, () => {
      console.log("App running on port 3000");
    });
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
}

start();