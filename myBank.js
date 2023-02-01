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

var firstname = document.getElementById("firstnameInput").value;
var lastname = document.getElementById("lastnameInput").value;
var email = document.getElementById("emailInput").value;
var dob = document.getElementById("dobInput").value;
var accountNumber = document.getElementById("accountNumber").value;
var customerAccountData = {
  firstname: firstname,
  lastname: lastname,
  email: email,
  dob: dob,
  accountNumber: accountNumber,
  balance: 0,
};
document.getElementById("openAccount").addEventListener("click", function (e) {
  e.preventDefault();
  console.log(customerAccountData);
  openAccount(customerAccountData);
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
  showCustomers();
  showCustomersList();
}

//fetch data from database and append Account numbers on the select
function selectCustomer() {
  const selectedCustomer = document.getElementById("holderAccountNumber");
  fetch("http://localhost:3000/showCustomersList")
    .then((response) => response.json())
    .then((data) => {
      data.forEach((accountNumber) => {
        const option = document.createElement("option");
        option.value = accountNumber.accountNumber;
        option.innerHTML = accountNumber.accountNumber;
        option.id = accountNumber.id;
        selectedCustomer.appendChild(option);
      });
    });
}
selectCustomer();

//Customer list
function showCustomersList() {
  var html = "";
  fetch("http://localhost:3000/showCustomersList")
    .then((response) => response.json())
    .then((data) => {
      const pageSize = 5;
      let pageNumber = 1;

      function updateTable(pageNumber) {
        let html = "";
        const customersList = paginate(data, pageNumber, pageSize);
        customersList.forEach((customers) => {
          html += `<tr>
          <td>${customers.accountNumber}</td>
          <td>${customers.firstname} ${customers.lastname}</td>
          <td>${customers.email}</td>
          <td>${customers.dob}</td>
          </tr>`;
        });
        document.getElementById("customerListTable").innerHTML = html;
      }

      function paginate(items, pageNumber, pageSize) {
        const startIndex = (pageNumber - 1) * pageSize;
        return items.slice(startIndex, startIndex + pageSize);
      }

      document
        .getElementById("previousCustomerPage")
        .addEventListener("click", () => {
          if (pageNumber > 1) {
            pageNumber -= 1;
            updateTable(pageNumber);
          }
        });

      document
        .getElementById("nextCustomerPage")
        .addEventListener("click", () => {
          if (pageNumber * pageSize < data.length) {
            pageNumber += 1;
            updateTable(pageNumber);
          }
        });

      updateTable(pageNumber);
    });
}
showCustomersList();

function showCustomers() {
  const customerTable = document.getElementById("customerTable");
  fetch("http://localhost:3000/showCustomersList")
    .then((response) => response.json())
    .then((data) => {
      const pageSize = 5;
      let pageNumber = 1;

      function updateTable(pageNumber) {
        let html = "";
        const customers = paginate(data, pageNumber, pageSize);
        customers.forEach((customer) => {
          html += `<tr>
      <td>${customer.accountNumber}</td>
      <td>${customer.firstname} ${customer.lastname}</td> 
      <td>${customer.balance}</td>
    </tr>`;
        });
        customerTable.innerHTML = html;
      }

      function paginate(items, pageNumber, pageSize) {
        const startIndex = (pageNumber - 1) * pageSize;
        return items.slice(startIndex, startIndex + pageSize);
      }

      document.getElementById("previous-page").addEventListener("click", () => {
        if (pageNumber > 1) {
          pageNumber -= 1;
          updateTable(pageNumber);
        }
      });

      document.getElementById("next-page").addEventListener("click", () => {
        if (pageNumber * pageSize < data.length) {
          pageNumber += 1;
          updateTable(pageNumber);
        }
      });

      updateTable(pageNumber);
    });
}

showCustomers();

//transaction form
document.getElementById("submitTransaction").addEventListener("click", () => {
  submitTransaction();
});

//insert transaction
function submitTransaction() {
  let accountNumber = document.getElementById("holderAccountNumber").value;
  let transactionType = document.getElementById("transactionType").value;
  let amount = document.getElementById("transactAmount").value;

  // Create a Promise to get balance
  const getBalance = () => {
    const select = document.getElementById("holderAccountNumber");
    const selectedIndex = select.selectedIndex;
    const selectedAccountNumber = select.options[selectedIndex].value;
    console.log(selectedAccountNumber);
    return new Promise((resolve, reject) => {
      fetch(
        `http://localhost:3000/showCustomerBalance?selectedAccountNumber=${selectedAccountNumber}`
      )
        .then((response) => response.json())
        .then((data) => {
          let balance = data.length === 0 ? 0 : data[data.length - 1].balance;
          console.log(balance);
          if (transactionType == "Withdraw") {
            if (balance < amount) {
              alert("Insufficient balance");
              balance = parseInt(balance) - parseInt(amount);
            }
            balance = parseInt(balance) - parseInt(amount);
          } else {
            balance = parseInt(balance) + parseInt(amount);
          }
          resolve(balance);
        });
    });
  };

  let current_time = new Date();
  let current_year = current_time.getFullYear();
  let current_month = current_time.getMonth();
  let current_day = current_time.getDate();
  let current_hours = current_time.getHours();
  let current_minutes = current_time.getMinutes();
  let current_seconds = current_time.getSeconds();
  let transactionDate = current_year + "-" + current_month + "-" + current_day;
  const time = current_hours + ":" + current_minutes + ":" + current_seconds;

  // Use the resolved value of the Promise in the transactionData object
  getBalance().then((balance) => {
    const transactionData = {
      transactionType,
      accountNumber,
      amount,
      transactionDate,
      time,
      balance,
    };
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
          ).innerHTML = `${transactionType} transaction of kshs${amount} has been completed successfully`;
        });
    } catch (err) {
      console.log(err);
    }
    showtransactions();
  });
}

//fetch transactions
function showtransactions() {
  const transactionTable = document.getElementById("transactionTable");
  fetch("http://localhost:3000/displayTransactions")
    .then((response) => response.json())
    .then((data) => {
      const pageSize = 5;
      let pageNumber = 1;

      function updateTable(pageNumber) {
        let html = "";
        const customersTransactions = paginate(data, pageNumber, pageSize);
        customersTransactions.forEach((transaction) => {
          html += `<tr>        
          <td>${transaction.transactionId}</td>      
          <td>${transaction.accountNumber}</td>
          <td>${transaction.transactionType}</td>
          <td>${transaction.transactionDate}</td>  
          <td>${transaction.time}</td>      
          <td>${transaction.amount}</td> 
          </tr>	`;
        });
        transactionTable.innerHTML = html;
      }

      function paginate(items, pageNumber, pageSize) {
        const startIndex = (pageNumber - 1) * pageSize;
        return items.slice(startIndex, startIndex + pageSize);
      }

      document
        .getElementById("previousTransactionPage")
        .addEventListener("click", () => {
          if (pageNumber > 1) {
            pageNumber -= 1;
            updateTable(pageNumber);
          }
        });

      document
        .getElementById("nextTransactionPage")
        .addEventListener("click", () => {
          if (pageNumber * pageSize < data.length) {
            pageNumber += 1;
            updateTable(pageNumber);
          }
        });

      updateTable(pageNumber);
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
  fetch("http://localhost:3000/showCustomersList")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log(data);
      let lastAccountNumber = data[data.length - 1].accountNumber;
      let newAccountNumber = lastAccountNumber + 1;
      console.log(lastAccountNumber);
      document.getElementById("accountNumber").value = newAccountNumber;
      document.getElementById("firstnameInput").value = "";
      document.getElementById("lastnameInput").value = "";
      document.getElementById("emailInput").value = "";
      document.getElementById("dobInput").value = "";
    });
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
