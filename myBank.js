$(document).ready(function () {
  $("#transactNavLink").click(function () {
    $("#transactCard").toggleClass("d-none");
    $("#balanceCard").addClass("d-none");
    $("#transactionCard").addClass("d-none");

    $("#openAccountCard").addClass("d-none");
  });

  $("#balanceNavLink").click(function () {
    $("#balanceCard").toggleClass("d-none");
    $("#transactCard").addClass("d-none");
    $("#transactionCard").addClass("d-none");
    $("#openAccountCard").addClass("d-none");
  });

  $("#transactionNavLink").click(function () {
    $("#transactionCard").toggleClass("d-none");
    $("#transactCard").addClass("d-none");
    $("#balanceCard").addClass("d-none");
    $("#openAccountCard").addClass("d-none");
  });
  $("#openAccountNavLink").click(function () {
    $("#openAccountCard").toggleClass("d-none");
    $("#transactCard").addClass("d-none");
    $("#balanceCard").addClass("d-none");
    $("#transactionCard").addClass("d-none");
  });
});

//bank class
class Bank {
  constructor(name) {
    this.name = name;
    this.accounts = [];
  }
  addAccount(account) {
    this.accounts.push(account);
  }
  getAccount(accountNumber) {
    return this.accounts.find((account) => account.number === accountNumber);
  }
}
//account class
class account {
  constructor(number, holder, balance) {
    this.number = number;
    this.balance = balance;
    this.holder = holder;
  }
  deposit(amount) {
    this.balance += amount;
  }
  withdraw(amount) {
    if (amount > this.balance) {
      console.log("insufficient funds");
    } else {
      this.balance -= amount;
    }
  }
}

const myBank = new Bank("alex");

var firstname = document.getElementById("firstnameInput").value;
var lastname = document.getElementById("lastnameInput").value;
var email = document.getElementById("emailInput").value;
var dob = document.getElementById("dobInput").value;
var accountNumber = document.getElementById("accountNumber").value;

document.getElementById("openAccount").addEventListener("click", function (e) {
  e.preventDefault();
  console.log(data);
  openAccount(data);
});

function openAccount(data) {
  try {
    fetch("http://localhost:3000/register", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        document.getElementById("success").innerHTML =
          "Your account has been registered";
      });
  } catch (err) {
    console.log(err);
  }
}

//get balance
function getBalance() {
  fetch("http://localhost:3000/showCustomersList")
    .then((response) => response.json())
    .then((data) => {
      let balance = data.balance;
      console.log(balance);
    });
  return balance;
}

//fetch data from database and append Account numbers on the select
function selectCustomer() {
  const selectedCustomer = document.getElementById("holder");
  fetch("http://localhost:3000/showCustomersList")
    .then((response) => response.json())
    .then((data) => {
      data.forEach((accountNumber) => {
        const option = document.createElement("option");
        option.value = accountNumber.accountNumber;
        option.innerHTML = accountNumber.accountNumber;
        selectedCustomer.appendChild(option);
      });
    });
}
selectCustomer();

//Customer list
//fetch data from database and append Account numbers on the select
function showCustomersList() {
  var html = "";
  fetch("http://localhost:3000/showCustomersList")
    .then((response) => response.json())
    .then((data) => {
      data.forEach((customers) => {
        return (html += `<tr>
        <td>${customers.accountNumber}</td>
        <td>${customers.firstname} ${customers.lastname}</td>
        <td>${customers.email}</td>
        <td>${customers.dob}</td>
        </tr>`);
      });
      document.getElementById("customerListTable").innerHTML = html;
    });
}
showCustomersList();

function showCustomers() {
  const customerTable = document.getElementById("customerTable");
  fetch("http://localhost:3000/showCustomersList")
    .then((response) => response.json())
    .then((data) => {
      let html = "";
      data.forEach((customer) => {
        return (html += `<tr>
      <td>${customer.accountNumber}</td>
			<td>${customer.firstname} ${customer.lastname}</td> 
      <td>${customer.balance}</td>
			</tr>	`);
        // insert the generated html into the appropriate element
      });
      customerTable.innerHTML = html;
    });
}

showCustomers();

//transaction form
document.getElementById("submitTransaction").addEventListener("click", () => {
  submitTransaction();
});

//insert transaction
function submitTransaction() {
  let transactionType = document.getElementById("transactionType").value;
  let amount = document.getElementById("amount").value;
  let balance = getBalance.balance;
  if (transactionType == "Withdraw") {
    if (balance < amount) {
      alert("Insufficient balance");
    }
    balance = balance - amount;
  } else {
    balance = balance + amount;
  }
  let accountNumber = document.getElementById("holder").value;
  let current_time = new Date();
  let current_year = current_time.getFullYear();
  let current_month = current_time.getMonth();
  let current_day = current_time.getDate();
  let current_hours = current_time.getHours();
  let current_minutes = current_time.getMinutes();
  let current_seconds = current_time.getSeconds();
  let transactionDate = current_year + "-" + current_month + "-" + current_day;
  const time = current_hours + ":" + current_minutes + ":" + current_seconds;
  const transactionData = {
    transactionType,
    accountNumber,
    amount,
    transactionDate,
    time,
    balance,
  };
  console.log(transactionDate);

  try {
    fetch("http://localhost:3000/transaction", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(transactionData),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        document.getElementById(
          "trasactionMessage"
        ).innerHTML = `${transactionType} transaction of kshs${amount} has been completed successfully`;
      });
  } catch (err) {
    console.log(err);
  }
}

//fetch transactions
function showtransactions() {
  const transactionTable = document.getElementById("transactionTable");
  fetch("http://localhost:3000/displayTransactions")
    .then((response) => response.json())
    .then((data) => {
      let html = "";
      data.forEach((transaction) => {
        return (html += `<tr>        
			<td>${transaction.transactionId}</td>      
			<td>${transaction.accountNumber}</td>
			<td>${transaction.transactionType}</td>
      <td>${transaction.transactionDate}</td>  
			<td>${transaction.time}</td>      
      <td>${transaction.amount}</td> 
			</tr>	`);
        // insert the generated html into the appropriate element
      });
      transactionTable.innerHTML = html;
    });
}

showtransactions();

//create new account
document.getElementById("newAccount").addEventListener("click", (event) => {
  event.preventDefault();
  //create a new account
  createNewAccount();
});
function createNewAccount() {
  let lastAccountNumber = lastCustomer.accountNumber;
  let newAccountNumber = lastAccountNumber + 1;
  document.getElementById("accountNumber").value = newAccountNumber;
  document.getElementById("firstnameInput").value = "";
  document.getElementById("lastnameInput").value = "";
  document.getElementById("emailInput").value = "";
  document.getElementById("dobInput").value = "";
}

//delete account
document.getElementById("deleteAccount").addEventListener("click", (event) => {
  event.preventDefault();
  let accountNumber = document.getElementById("searchInput").value;
  console.log(accountNumber);
  try {
    fetch(
      `http://localhost:3000/deleteAccount?accountNumber=${accountNumber}`,
      {
        method: "DELETE",
        headers: {
          "content-type": "application/json",
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (!data.error) {
          document.getElementById(
            "messageDelete"
          ).innerHTML = `Account ${accountNumber} has been deleted successfully`;
        } else {
          const message = document.createElement("p");
          message.innerHTML = data.error;
          document.getElementById("messageDelete").appendChild(message);
        }
      });
  } catch (err) {
    console.log(err);
  }
});

//delete transaction
document
  .getElementById("deleteTransactionButton")
  .addEventListener("click", (event) => {
    event.preventDefault();
    let transactionId = document.getElementById("searchTransactionInput").value;
    console.log(transactionId);
    try {
      fetch(
        `http://localhost:3000/deleteTransaction?accountNumber=${transactionId}`,
        {
          method: "DELETE",
          headers: {
            "content-type": "application/json",
          },
        }
      )
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          if (!data.error) {
            document.getElementById(
              "messageDelete"
            ).innerHTML = `transaction ${transactionId} has been deleted successfully`;
          } else {
            const message = document.createElement("p");
            message.innerHTML = data.error;
            document.getElementById("messageDelete").appendChild(message);
          }
        });
    } catch (err) {
      console.log(err);
    }
  });
