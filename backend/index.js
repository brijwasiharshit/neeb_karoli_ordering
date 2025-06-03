const express = require("express");
const cors = require("cors");
const mongoDB = require("./db");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// ✅ Connect to MongoDB
mongoDB();
app.use(cors({
  // origin: ["http://localhost:3000"],
  ["https://neeb-karoli-ordering-frontend.onrender.com"], 
  credentials: true
}));
app.use(express.json());

// ✅ API Routes
app.use("/api", require("./Routes/mainRoutes"));


// ✅ Default Route
app.get("/", (req, res) => {
    res.send("Hello World!");
});

// ✅ Start Server
app.listen(port, () => {
    console.log(`✅ Server is running on port ${port}`);
});
