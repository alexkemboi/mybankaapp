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
    const { firstname, lastname, email, password, accountNumber } = req.body;
    connection.query(
      "INSERT INTO personaldetails (firstname,lastname,email,password,accountNumber) VALUES (?,?, ?, ?, ?)",
      [firstname, lastname, email, password, accountNumber],
      function (err) {
        if (err) console.log(err);
        res.status(200).send({ message: "Data inserted successfully" });
      }
    );
  } catch (err) {
    console.log(err);
  }
});

// fetch all customers
app.get("/displayCustomers", (req, res) => {
  connection.query("SELECT * FROM personaldetails", (err, rows) => {
    if (err) {
      console.log(err);
    } else {
      res.status(200).send(rows);
    }
  });
});

//insert transaction to database
app.post("/transaction", (req, res) => {
  try {
    const { accountNumber, transactionType, amount } = req.body;
    connection.query(
      "INSERT INTO transactions(accountNumber, transactionType,amount) VALUES (?, ?,?)",
      [accountNumber, transactionType, amount],
      (err, result) => {
        if (err) console.log(err);
        res.status(200).send(result);
      }
    );
  } catch (err) {
    console.log(err);
  }
});

// fetch all transactions
app.get("/displayTransactions", (req, res) => {
  connection.query("SELECT * FROM transactions", (err, rows) => {
    if (err) {
      console.log(err);
    } else {
      res.status(200).send(rows);
    }
  });
});

app.listen(3000, function () {
  console.log("server is running");
});
