const { spawn } = require("child_process");
const http = require("http");

const app = spawn("node", ["app.js"], {
  env: {
    ...process.env,
    MONGODB_URI: process.env.MONGODB_URI || "mongodb://localhost:27017"
  }
});

app.stdout.on("data", (data) => {
  console.log(`APP: ${data}`);
});

app.stderr.on("data", (data) => {
  console.error(`APP ERROR: ${data}`);
});

setTimeout(() => {
  http.get("http://localhost:3000", (res) => {
    let data = "";

    res.on("data", (chunk) => {
      data += chunk;
    });

    res.on("end", () => {
      if (res.statusCode === 200) {
        console.log("Test passed ✅");
        app.kill();
        process.exit(0);
      } else {
        console.error("Test failed ❌");
        console.error(data);
        app.kill();
        process.exit(1);
      }
    });
  }).on("error", (err) => {
    console.error("Request failed ❌");
    console.error(err.message);
    app.kill();
    process.exit(1);
  });
}, 8000);