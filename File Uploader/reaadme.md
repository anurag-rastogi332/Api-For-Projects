1.sabse pehel humne ek lecture -17 naam ka ek folder bnaya 
2.uske baad usme humne npm init -y kiya 
3. npm i express ejs mongoose ye sab bhi install kiya 
4. uske baad humne lecture-17 me humne views naam ka ek folder bnaya uske ander ek index.ejs naam ki file bnayi usme humne project ka naam image uploader likha 

5. type module kiya humne uske baad package.json me.

6.uske baad humne server.js file bnayi lecture no-17 me .

7.phir humne server.js me import kiya express module  ko - use krne ke liye 

8. ab hum ek server bnayenge -
onst app=express();

const port=3000;
app.listen(port,()=>console.log(`server is running on port ${port}`))

ye ban gaya server aur isko humne nodemon server.js se run bnaya 

9. ab hum ek mongoose ko import karenge apne server,js me 



// MongoDB connection using environment variable
mongoose.connect(process.env.MONGODB_URI, {
  dbName: "nodejs_mastery_course",
}).then(() => console.log("mongodb connected...!")).catch((err) => console.log(err));

// Add a .env file in your project root:
// MONGODB_URI=your_mongodb_connection_string_here

10.  //rendering ejs file krenge hum

app.get('/',(req,res)=>{
    res.render("index.ejs",{url:null})
})

isme hum image ka url diya hai jisse ki user jo image upload karen use hum user ko show kra sake 

11. ab hum index.js ka code likhenge achhe se 

<body>
    <div class="container">
        <form action="" method="post" enctype="multipart/form-data">
            <div class="form-group">
                <input type="file" name="file" id="file-input">
            </div>
            <div class="form-group">
                <input type="submit" value="upload">
            </div>
            <div id="uploaded-image-contentner">
                <% if(url){ %>
                    <h2>file uploaded successfully</h2>
                    <img src="<%= url %>" alt="uploaded image">
                <% } %>
            </div>
        </form>
    </div>
</body>


12. ab hum server.js me apna logic ko likhenge -

hum apni saari images ko cloudinary per upload krte hai uska url le lete hai jiska url hum mongodb me rakh lete hai 

sabese pehle hum multer npm ko install karenge lecture 17 me iska use hum image ko upload krne ke liye krte  hai node js me 

uske baad hum npm i cloudinary ko bhi install krna hain

13.
 import multer from 'multer'; is code se multer ko import karo 

 ab hum coudinary ko import karenge 
 import { v2 as cloudinary } from 'cloudinary';   is code se 

 ab hum 
 import { v2 as cloudinary } from 'cloudinary';


    // Configuration
    cloudinary.config({ 
        cloud_name: 'ddvprjnrz', 
        api_key: '474342161292251', 
        api_secret: '<your_api_secret>' // Click 'View API Keys' above to copy your API secret
    });
  
  aur isme api secret  key ko daale 

  14.

app.post('/upload', upload.single('avatar'), function (req, res, next) {
  // req.file is the `avatar` file
  // req.body will hold the text fields, if there were any
})   isko hum use karenge for uploading 


ab 

disk storage ko dalenge 

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '/tmp/my-uploads')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix)
  }
})

const upload = multer({ storage: storage })


15.

ab path module ko import kare 


16 ab hum coudinary per image upload karne ka code likhenge 


16. ab humari jo file upload hui hai use hum mongodb per upload krenge 

to ab hum sabse pehle schema bnayenge 
mongo db me image ko save krne ke liye 
