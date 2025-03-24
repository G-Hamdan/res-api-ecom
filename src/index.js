const express = require("express")
const app = express()
const port = 3000

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})

// MIDDLEWARE
app.use((req, res, next) => {
    const now = Date.now()
    req.requestTime = now
    next()
   })
   // data sent to the user
   app.get("/", (req, res) => {
    res.send(req.requestTime.toString())
   })

 app.get("/", (req, res) => {
     res.send(`Request Time: ${req.requestTime} | Arithmetical Value: ${req.arithmetical_value}`);
});

app.use(express.json())
 app.use((req, res, next) => {
     req.requestTime = Date.now();
     req.arithmetical_value = 4 * 7; 
    next();
 });