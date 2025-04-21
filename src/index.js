require("dotenv").config();

const express = require("express")
const app = express()
const port = 3000
const userRoutes = require("./routes/users")
const { connectDB }=require("./utils/db.js")
const path = require("path")
const productRoutes = require("./routes/products")
const invoiceRoutes = require("./routes/invoices")


// MIDDLEWARE
app.use(express.json())
    app.use((req, res, next) => {
        req.requestTime = Date.now();
        req.arithmetical_value = 4 * 7; 
        next();
});

connectDB()

// cors middleware
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*")
    res.header(
     "Access-Control-Allow-Headers",
     "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    )
    next()
   })

   
// ROUTES
app.use("/api/users", userRoutes)
app.use("/api/products", productRoutes)
app.use("/api/invoices", invoiceRoutes)


// ecommerce
app.get("/", (req, res) => {
    res.send("Welcome to my API ! e-commerce backed 🤳")
   })

// image folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")))

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})

