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
//atm class
class ATM {
  constructor(bank) {
    this.bank = bank;
  }
  checkBalance(accountNumber) {
    const account = this.bank.getAccount(accountNumber);
    console.log(account.balance);
  }
  deposit(accountNumber, amount) {
    const account = this.bank.getAccount(accountNumber);
    account.deposit(amount);
    console.log(
      `Deposited:${amount}` + " " + `Account balance${account.balance}`
    );
  }
  withdraw(accountNumber, amount) {
    const account = this.bank.getAccount(accountNumber);
    account.withdraw(amount);
    console.log(
      `Withdrawn:${amount}` + " " + `Account balance${account.balance}`
    );
  }
}

const myBank = new Bank("alex");
myBank.addAccount(new account(123456789, "alex", 1000));
const atm = new ATM(myBank);
atm.checkBalance(123456789);
atm.deposit(123456789, 100);
atm.withdraw(123456789, 1);

var firstname = document.getElementById("firstnameInput").value;
var lastname = document.getElementById("lastnameInput").value;
var email = document.getElementById("emailInput").value;
var password = document.getElementById("confirmPassword").value;
var accountNumber = document.getElementById("accountNumber").value;
var data = {
  firstname: firstname,
  lastname: lastname,
  email: email,
  password: password,
  accountNumber: accountNumber,
};
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
      }); //
  } catch (err) {
    console.log(err);
  }
}

//fetch data from database and append Account numbers on the select
function selectCustomer() {
  const selectedCustomer = document.getElementById("holder");
  fetch("http://localhost:3000/displayCustomers")
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

function showCustomers() {
  const customerTable = document.getElementById("customerTable");
  fetch("http://localhost:3000/displayCustomers")
    .then((response) => response.json())
    .then((data) => {
      let html = "";
      data.forEach((customer) => {
        return (html += `<tr>
			<td>${customer.accountNumber}</td>
			<td>${customer.firstname} ${customer.lastname}</td>      
			<td></td>
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
  const transactionType = document.getElementById("transactionType").value;
  const accountNumber = document.getElementById("holder").value;
  const amount = document.getElementById("amount").value;
  const transactionData = { transactionType, accountNumber, amount };
  console.log(transactionData);
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
        ).innerHTML = `Your ${transactionType} transaction of kshs${amount} been completed successfully`;
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
			<td>${transaction.transactionType}</td>
      <td></td>  
			<td></td>      
      <td>${transaction.amount}</td> 
			</tr>	`);
        // insert the generated html into the appropriate element
      });
      transactionTable.innerHTML = html;
    });
}

showtransactions();
