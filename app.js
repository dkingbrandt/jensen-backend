

const credentials = {secretUser:"user" , secretPassword:"password"}

const auditLog = require("audit-log")
const cors = require("cors")
const express = require("express")
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')
const fs = require("fs")
const https = require("https")




const app = express()



 




const PORT = process.env.PORT || 3000

let option = {
   key: fs.readFileSync("abels-key.pem"),
   cert: fs.readFileSync("abels-cert.pem")
};




app.use('./healthcheck', require('./routes/healthcheck.routes'));

app.use(express.urlencoded({ extended: true }));
app.use(cors())

app.get("/", (req ,res)=>{
   headers={"http_status":200, "cache-control":  "no-cache"}
   body={"status": "available"}
   res.status(200).send(body)
})

app.get("/health", (req ,res)=>{
   headers={"http_status":200, "cache-control":  "no-cache"}
   body={"status": "available"}
   res.status(200).send(body)
})


app.post('/authorize', (req, res) => {
   // Insert Login Code Here
   
   
   let user = req.body.user;
   let password = req.body.password;
   console.log(`User ${user}`)
   console.log(`Password ${password}`)
   

   

   //   app.use(auditLogExpress.middleware);
   

   if(user===credentials.secretUser && password===credentials.secretPassword){
      
      auditLog.addTransport("console");
      auditLog.logEvent( `user with the credentials ${user} and password ${password} just logged in`,"https://dan-backend.herokuapp.com/authorize")
      // auditLog.logEvent("kungen")
      const token = jwt.sign({
         
            data: 'foobar'
            
      // deepcode ignore HardcodedSecret: <please specify a reason of ignoring this>
      }, 'your-secret-key-here', { expiresIn: 60 * 60 }); 

      console.log(token)
      res.status(200).send(token)
  }else{
      console.log("Not authorized")
      res.status(200).send({"STATUS":"FAILURE"})
   }
});

app.listen(PORT , ()=>{
     console.log(`STARTED LISTENING ON PORT ${PORT}`)
});

// https.createServer(option, app).listen(443, function(){
//    console.log("HTTPS LISTENING ON 443")
// })