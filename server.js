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

//register customers

app.post("/register", function (req, res) {
  try {
    const { firstname, lastname, email, dob, balance, accountNumber } =
      req.body;
    connection.query(
      "INSERT INTO personaldetails (firstname,lastname,email,dob) VALUES   (?,?, ?, ?)",
      [firstname, lastname, email, dob],
      function (err) {
        if (err) console.log(err);
        else {
          connection.query(
            "INSERT INTO accounts (accountNumber,balance) VALUES(?,?)",
            [accountNumber, balance],
            (err, result) => {
              if (err) console.log(err);
              res
                .status(200)
                .send({ message: `${accountNumber}Successfully activated` });
            }
          );
        }
      }
    );
  } catch (err) {
    console.log(err);
  }
});

// fetch all customers accounts details
app.get("/displayCustomers", (req, res) => {
  connection.query("SELECT * FROM accounts", (err, rows) => {
    if (err) {
      console.log(err);
    } else {
      res.status(200).send(rows);
    }
  });
});

// fetch customers list
app.get("/showCustomersList", (req, res) => {
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
    const { accountNumber, transactionType, amount, transactionDate, time } =
      req.body;
    connection.query(
      "INSERT INTO transactions(accountNumber, transactionType,amount,transactionDate,time) VALUES (?,?,?, ?,?)",
      [accountNumber, transactionType, amount, transactionDate, time],
      (err, result) => {
        if (err) console.log(err);
        res.status(200).send(result);
      }
    );
  } catch (err) {
    console.log(err);
  }
});

// route to fetch all transactions
app.get("/displayTransactions", (req, res) => {
  connection.query("SELECT * FROM transactions", (err, rows) => {
    if (err) {
      console.log(err);
    } else {
      res.status(200).send(rows);
    }
  });
});

//route to delete
app.delete("/deleteAccount", (req, res) => {
  const accountNumber = req.query;
  if (!accountNumber) {
    return res.status(400).json({ error: "Account number is required." });
  }

  connection.query(
    `SELECT * FROM personaldetails WHERE firstname = ?`,
    [accountNumber],
    (error, results) => {
      if (error) {
        return res
          .status(500)
          .json({ error: "An error occurred while querying the database." });
      }

      if (!results.length) {
        return res.status(404).json({ error: "Account not found." });
      }

      connection.query(
        `DELETE FROM personaldetails WHERE firstname = ?`,
        [accountNumber],
        (err) => {
          if (err) {
            return res
              .status(500)
              .json({ error: "An error occurred while deleting the account." });
          }
          res.json({ message: "Account deleted successfully." });
        }
      );
    }
  );
});

//route to delete transaction
app.delete("/deleteTransaction", (req, res) => {
  const transactionId = req.query;
  if (!transactionId) {
    return res
      .status(400)
      .json({ error: "Transaction ID number is required." });
  }

  connection.query(
    `SELECT * FROM transactions WHERE transactionId = ?`,
    [transactionId],
    (error, results) => {
      if (error) {
        return res
          .status(500)
          .json({ error: "An error occurred while querying the database." });
      }

      if (!results.length) {
        return res.status(404).json({ error: "Transaction not found." });
      }

      connection.query(
        `DELETE FROM transactions WHERE transactionId = ?`,
        [transactionId],
        (err) => {
          if (err) {
            return res.status(500).json({
              error: "An error occurred while deleting the transaction.",
            });
          }
          res.json({ message: "Transaction deleted successfully." });
        }
      );
    }
  );
});

//App is listening on port
app.listen(3000, function () {
  console.log("server is running");
});
