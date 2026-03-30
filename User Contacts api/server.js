// express module import
import express from "express"; //exprerss ko import kiya
import mongoose from "mongoose"; //mongoose ko import kiya
import multer from "multer"; //multer ko import kiya jisse ki gum files ko le sake
import path from "path"; // path ko import kiya jisse ki hum file ke path ko leke mongodb me save kr sake
import { v2 as cloudinary } from "cloudinary"; // cloudinary ko import kiya jisme humari files upload hongi aur unke path ko mongodb me save kiya jaega

// server setup
const app = express();

// cloudinary config
cloudinary.config({
  cloud_name: "ddvprjnrz",
  api_key: "474342161292251",
  api_secret: "-sx_jOzsBgsCzPZOsyAjke9sHhc"
});

// MongoDB connection- yaha humne apne mongodb ko server se connect kiya hai
mongoose
  .connect(
    process.env.MONGODB_URI,
    {
      dbName: "Backend-series-lec-18",
    }
  )
  .then(() => console.log("MongoDB connected..!"))
  .catch((err) => console.log(err));

// set view engine
app.set("view engine", "ejs");

// render login page- yaha render ka mtlb hai ki humne apne login page ko render kiya hai
app.get("/", (req, res) => {
  res.render("login.ejs", { url: null });
});

//rendering register page - yaha humne apne register page ko render kiya hai
app.get("/register", (req, res) => {
  res.render("register.ejs", { url: null });
});

// multer setup
const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

const upload = multer({ storage: storage });

// MongoDB schema
const imageSchema = new mongoose.Schema({
  filename: String,
  public_id: String,
  imgUrl: String,
});

const Image = mongoose.model("cloudinary", imageSchema);

// upload route
app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const localPath = req.file.path;

    const cloudinaryRes = await cloudinary.uploader.upload(localPath, {
      folder: "nodejs_mastery_course2025",
    });

    const dbRes = await Image.create({
      filename: req.file.originalname,
      public_id: cloudinaryRes.public_id,
      imgUrl: cloudinaryRes.secure_url,
    });

    res.render("index.ejs", { url: cloudinaryRes.secure_url });
  } catch (err) {
    console.error("Upload Error:", err);
    res.status(500).json({ error: "File upload failed", details: err.message });
  }
});

// start server
const port = 3000;
app.listen(port, () => console.log(`server is running on port ${port}`));