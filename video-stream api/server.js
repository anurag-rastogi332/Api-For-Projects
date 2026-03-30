const express = require("express");
const fs = require("fs");
const app = express();

app.get("/", (req, res) => {
  res.send(`
    <h2>मेरा Streaming Video</h2>
    <video width="500" controls>
      <source src="/video" type="video/mp4">
    </video>
  `);
});

app.get("/video", (req, res) => {
  const path = "video.mp4";
  const stat = fs.statSync(path);
  const size = stat.size;

  const range = req.headers.range;
  if (!range) return res.status(400).send("Range header नहीं मिला");

  const start = Number(range.replace("bytes=", "").split("-")[0]);
  const end = size - 1;

  res.writeHead(206, {
    "Content-Range": `bytes ${start}-${end}/${size}`,
    "Accept-Ranges": "bytes",
    "Content-Type": "video/mp4",
  });

  fs.createReadStream(path, { start, end }).pipe(res);
});

app.listen(3000, () => console.log("Server चालू है http://localhost:3000"));


