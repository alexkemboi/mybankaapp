var express = require("express");
var mysql = require("mysql");
var cors = require("cors");
var bodyParser = require("body-parser");

var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "bank",
});

var app = express();
app.use(bodyParser.json());

app.use(cors());

app.post("/register", function (req, res) {
  try {
    const { firstname, lastname, email, password } = req.body;
    connection.query(
      "INSERT INTO personaldetails (accountNumber,firstname,lastname,email,password) VALUES (?,?, ?, ?, ?)",
      [accountNumber,firstname, lastname, email, password],
      function (err) {
        if (err) console.log(err);
        res.status(200).send({ message: "Data inserted successfully" });
      }
    );
  } catch (err) {
    console.log(err);
  }
});

app.listen(3000, function () {
  console.log("server is running");
});
