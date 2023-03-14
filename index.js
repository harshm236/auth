const express = require("express");
const path = require("path");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const secret_key = "123";
const app = express();

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname + "/public")));
var data = [];

const jwtverify = (req, res, next) => {
  const token = req.body.token;
  console.log(token);
  next();
};

const Compare=(req,res,next)=>{
    const cred = req.body;
  data &&
    data.map((item) => {
      if (item.email === cred.email) {
        bcrypt.compare(cred.password, item.password, (err, valid) => {
          if (err) {
            console.log(err);
          } else if (valid === false) {
            res.send("invalid details");
          } else {
            const token = jwt.sign(cred, secret_key);
            console.log(token);
            // req.body.token = token;
            console.log("user logged in", cred.email);
            res.json({
                "token":token
            })
            next()
            // res.redirect("/auth/userdata");
          }
        });
      } else {
        res.send("user not registered");
        next()
      }
    });
}
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/home.html");
});
app.get("/register", (req, res) => {
  res.sendFile(__dirname + "/public/register.html");
});
app.post("/register", async (req, res) => {
  const cred = req.body;
  data &&
    data.map((item) => {
      if (cred.email === item.email) {
        res.send("email already in use");
      }
    });
  console.log(cred);
  {
    try {
      const salt = 10;
      const hash = await bcrypt.hash(cred.password, salt);
      console.log(hash);
      cred.password = hash;
      data.push(cred);
      res.send(data);
    } catch {
      if (Error) console.log("registeration unsuccessful");
    }
  }
});
app.get("/login", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});
app.post("/login",Compare, (req, res) => {
       res.redirect("/auth/userdata")
});
app.get("/auth/userdata", jwtverify, (req, res) => {
  res.send("userdata");
});
app.listen(3030, () => {
  console.log("server running at 3030");
});
