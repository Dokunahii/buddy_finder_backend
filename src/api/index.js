let express = require("express");
let path = require("path");
const cors = require("cors");
const { Pool } = require("pg");
const { DATABASE_URL } = process.env;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

let app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: {
    require: true,
  },
});

async function getPostgresVersion() {
  const client = await pool.connect();
  try {
    const response = await client.query("SELECT version()");
    console.log(response.rows[0]);
  } finally {
    client.release();
  }
}

getPostgresVersion();

app.post("/newuser", (req, res) => {
  const client = pool.connect();
  try {
    const query = "INSERT INTO userinfo (firebaseuid, name, useraddress, routines, meetings) VALUES ($1, $2, $3, $4, $5) RETURNING *";
      const params = [req.body.uid, req.body.name, req.body.userAddress, req.body.routines, req.body.meetings]
      const response = client.query(query,params)
  } catch (err) {
    console.log(err.stack)
    res.status(500).json("failed to sign up, please try again later")
  } finally {
    client.release()
  }
})

app.get("/", (req,res) => {
  res.sendFile(path.join(__dirname + "/index.html"))
})

app.listen(3000, () => {
  console.log("Server is running on port 3000");
})

module.exports = app;