// Store all expenses inside this array
let expenses = [];


// Get the expense form from HTML
const expenseForm = document.getElementById("expense-form");

// Get the table body where expenses will be displayed
const expenseTableBody = document.getElementById("expense-table-body");
const monthSelector = document.getElementById("month-selector");

// Get the summary card elements from HTML
const totalExpensesElement = document.getElementById("total-expenses");
const todayExpensesElement = document.getElementById("today-expenses");
const totalCategoriesElement = document.getElementById("total-categories");
const totalTransactionsElement = document.getElementById("total-transactions");

// Get all category rows from the Expense Overview
const categoryRows = document.querySelectorAll(".category-row"); 
const expenseChart = document.getElementById("expense-chart");


// =====================================================
// ADD NEW EXPENSE
// =====================================================

// Listen for the form submission
expenseForm.addEventListener("submit", function (event) {

    // Stop the page from refreshing when the form is submitted
    event.preventDefault();


    // Get values entered by the user
    const amountInput = document.getElementById("amount").value;
    const categoryInput = document.getElementById("category").value;
    const descriptionInput = document.getElementById("description").value;
    const dateInput = document.getElementById("date").value;


    // Convert the amount from text into a number
    const amount = Number(amountInput);


    // Create an expense object
    const newExpense = {

        amount: amount,
        category: categoryInput,
        description: descriptionInput,
        date: dateInput

    };


    // Add the new expense object to the expenses array
    expenses.push(newExpense);

    // Save the expense to local storage
    saveExpenses();

    // Update the expense table
    renderExpenses();

    // Update all summary cards
    updateSummary();
    updateCategoryBreakdown();


    // Clear all form fields
    expenseForm.reset();

});



// =====================================================
// DISPLAY EXPENSES IN THE TABLE
// =====================================================

function renderExpenses() {

    // Remove the existing rows from the table
    expenseTableBody.innerHTML = "";
// Get only expenses from the selected month
    const selectedExpenses = getSelectedMonthExpenses();

    // Go through the selected month's expenses
    selectedExpenses.forEach(function (expense) {
        // Create a new table row
        const row = document.createElement("tr");


        // Create Description cell
        const descriptionCell = document.createElement("td");

        // Put the expense description inside the cell
        descriptionCell.textContent = expense.description;


        // Create Category cell
        const categoryCell = document.createElement("td");

        // Put the expense category inside the cell
        categoryCell.textContent = expense.category;


        // Create Date cell
        const dateCell = document.createElement("td");

        // Put the expense date inside the cell
        dateCell.textContent = expense.date;


        // Create Amount cell
        const amountCell = document.createElement("td");

        // Put the expense amount inside the cell
        amountCell.textContent = `₹${expense.amount}`;


        // Add all cells to the table row
        row.append(
            descriptionCell,
            categoryCell,
            dateCell,
            amountCell
        );


        // Add the row to the table
        expenseTableBody.append(row);

    });

}



// =====================================================
// UPDATE TOTAL EXPENSES
// =====================================================

function updateTotalExpenses() {

     // Get only expenses from the selected month
    const selectedExpenses = getSelectedMonthExpenses();

    let total = 0;

    selectedExpenses.forEach(function (expense) {

        total = total + expense.amount;

    });

    totalExpensesElement.textContent = `₹${total}`;
    
}

// =====================================================
// CREATE MONTH SELECTOR
// =====================================================

function createMonthSelector() {

    // List of all months
    const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    ];

    // Get the current date
    const currentDate = new Date();

    // Get the current month
    const currentMonth = currentDate.getMonth();

    // Go through every month
    months.forEach(function (month, index) {

        // Create an option
        const option = document.createElement("option");

        // Put the month name inside the option
        option.textContent = month;

        // Store the month number as the value
        option.value = index;

        // Add the option to the selector
        monthSelector.appendChild(option);

    });

    // Select the current month
    monthSelector.value = currentMonth;
}
function getSelectedMonthExpenses() {

    const selectedMonth = Number(monthSelector.value);

    const filteredExpenses = expenses.filter(function (expense) {

        const expenseDate = new Date(expense.date);

        return expenseDate.getMonth() === selectedMonth;

    });

    return filteredExpenses;
}
// =====================================================
// MONTH SELECTOR
// =====================================================

monthSelector.addEventListener("change", function () {

    console.log("Month changed!");

    const selectedMonth = monthSelector.value;

    console.log("Selected month:", selectedMonth);

    const selectedExpenses = getSelectedMonthExpenses();

    console.log("Selected expenses:", selectedExpenses);
// Refresh the expense table
    renderExpenses();
    // Update the summary cards
    updateSummary();

    // Update the overview category breakdown
    updateCategoryBreakdown();

    // Update the chart
    updateExpenseChart();
});

// =====================================================
// UPDATE TODAY'S EXPENSES
// =====================================================

function updateTodayExpenses() {

    // Get today's date
    // Example: 2026-09-26
    const today = new Date().toISOString().split("T")[0];


    // Start today's total at zero
    let total = 0;


    // Go through every expense
    expenses.forEach(function (expense) {


        // Check if the expense date is today
        if (expense.date === today) {

            // Add the amount to today's total
            total = total + expense.amount;

        }

    });


    // Display today's total
    todayExpensesElement.textContent = `₹${total}`;

}



// =====================================================
// UPDATE TOTAL CATEGORIES
// =====================================================

function updateTotalCategories() {

    // Get only expenses from the selected month
    const selectedExpenses = getSelectedMonthExpenses();

    const categories = [];

    selectedExpenses.forEach(function (expense) {

        if (!categories.includes(expense.category)) {

            categories.push(expense.category);

        }

    });

    totalCategoriesElement.textContent = categories.length;
   
}



// =====================================================
// UPDATE TOTAL TRANSACTIONS
// =====================================================

function updateTotalTransactions() {

  // Get only expenses from the selected month
    const selectedExpenses = getSelectedMonthExpenses();

    totalTransactionsElement.textContent = selectedExpenses.length;
}



// =====================================================
// UPDATE ALL SUMMARY CARDS
// =====================================================

function updateSummary() {

    // Update Total Expenses
    updateTotalExpenses();

 updateTodayExpenses();

    // Update Total Categories
    updateTotalCategories();


    // Update Total Transactions
    updateTotalTransactions();

}

// =====================================================
// UPDATE EXPENSE OVERVIEW
// =====================================================

function updateCategoryBreakdown() {

    // Get only expenses from the selected month
    const selectedExpenses = getSelectedMonthExpenses();

    // Store the total amount for each category
    const categoryTotals = {};

    // Go through selected month expenses
    selectedExpenses.forEach(function (expense) {

        // If the category already exists
        if (categoryTotals[expense.category]) {

            // Add the new amount to the existing amount
            categoryTotals[expense.category] =
                categoryTotals[expense.category] + expense.amount;

        } else {

            // Create the category with its first amount
            categoryTotals[expense.category] = expense.amount;

        }

    });


    // Calculate the total expense for the selected month
    let total = 0;

    selectedExpenses.forEach(function (expense) {

        total = total + expense.amount;

    });


    // Update every category row on the page
    categoryRows.forEach(function (row) {

        // Get the category name
        const categoryName =
            row.querySelector(".category-name").textContent.trim();

        // Get the amount element
        const amountElement =
            row.querySelector("strong");

        // Get the percentage element
        const percentageElement =
            row.querySelector("small");

         const dot =
        row.querySelector(".category-dot");

        // Get the amount spent in this category
        const categoryAmount =
            categoryTotals[categoryName] || 0;


        // Start percentage at zero
        let percentage = 0;


        // Only calculate percentage if there are expenses
        if (total > 0) {

            percentage =
                (categoryAmount / total) * 100;

        }


        // Display category amount
        amountElement.textContent =
            `₹${categoryAmount}`;


        // Display category percentage
        percentageElement.textContent =
            `${percentage.toFixed(1)}%`;

             // Give the dot the same color as the chart
    dot.style.backgroundColor =
        getCategoryColor(categoryName);

    });
   
     
}



// =====================================================
// GET CATEGORY COLOR
// =====================================================

function getCategoryColor(category) {

    // Give each category its own color
    if (category === "Food") {
        return "#22c55e";
    }

    if (category === "Transport") {
        return "#3b82f6";
    }

    if (category === "Shopping") {
        return "#f59e0b";
    }

    if (category === "Bills") {
        return "#ef4444";
    }

    if (category === "Entertainment") {
        return "#8b5cf6";
    }

    if (category === "Others") {
        return "#6b7280";
    }

    // Default color
    return "#9ca3af";
}

// =====================================================
// UPDATE EXPENSE CHART
// =====================================================

function updateExpenseChart() {
     // Get expenses from the selected month
    const selectedExpenses = getSelectedMonthExpenses();

    // Store the amount for each category
    const categoryTotals = {};

    // Calculate category totals
    selectedExpenses.forEach(function (expense) {

        if (categoryTotals[expense.category]) {

            categoryTotals[expense.category] =
                categoryTotals[expense.category] + expense.amount;

        } else {

            categoryTotals[expense.category] =
                expense.amount;

        }

    });


    // Calculate total expense
    let total = 0;

    selectedExpenses.forEach(function (expense) {

        total = total + expense.amount;

    });

    if(total === 0){
        expenseChart.style.background = "#e5e7eb";

        return;
    }


    // Store chart colors and percentages
    let gradientParts = [];

    let currentPercentage = 0;


    // Go through every category
    Object.keys(categoryTotals).forEach(function (category) {

        const amount = categoryTotals[category];

        // Calculate percentage
        const percentage = (amount / total) * 100;


        // Get the existing category color
        const color = getCategoryColor(category);


        // Calculate where this section ends
        const endPercentage =
            currentPercentage + percentage;


        // Add this category to the gradient
        gradientParts.push(
            `${color} ${currentPercentage}% ${endPercentage}%`
        );


        // Move to the next section
        currentPercentage = endPercentage;

    });


        // Create the donut chart
        expenseChart.style.background =
            `conic-gradient(${gradientParts.join(", ")})`;

    
}

// =====================================================
// DELETE ALL EXPENSES
// =====================================================

// Get the Delete All button
const deleteAllButton =
    document.getElementById("delete");

// Get the delete confirmation modal
const deleteModal =
    document.getElementById("delete-modal");

// Get the Cancel button
const cancelDeleteButton =
    document.getElementById("cancel-delete");

// Get the Confirm Delete button
const confirmDeleteButton =
    document.getElementById("confirm-delete");


// Open the confirmation modal
deleteAllButton.addEventListener("click", function () {

    deleteModal.style.display = "flex";

});


// Close the modal when Cancel is clicked
cancelDeleteButton.addEventListener("click", function () {

    deleteModal.style.display = "none";

});


// Delete everything when Delete All is clicked
confirmDeleteButton.addEventListener("click", function () {

    // Remove all expenses
    expenses = [];

    // Remove saved expenses from local storage
    localStorage.removeItem("expenses");

    // Update the table
    renderExpenses();

    // Update the summary cards
    updateSummary();

    // Update the category breakdown and chart
    updateCategoryBreakdown();

    // Close the modal
    deleteModal.style.display = "none";

});

// =====================================================
// SAVE EXPENSES TO LOCAL STORAGE
// =====================================================

function saveExpenses() {

    // Convert the expenses array into text
    const expensesData = JSON.stringify(expenses);

    // Save the expenses in the browser
    localStorage.setItem("expenses", expensesData);

}

function loadExpenses() {

    // Get saved expenses from the browser
    const savedExpenses = localStorage.getItem("expenses");

    // Check if saved expenses exist
    if (savedExpenses) {

        // Convert the saved text back into an array
        expenses = JSON.parse(savedExpenses);

    }

}

// =====================================================
// RUN WHEN THE PAGE LOADS
// =====================================================
// Load previously saved expenses
loadExpenses();

createMonthSelector();

// Display expenses in the table
renderExpenses();

// Calculate and display all summary cards
updateSummary();

updateCategoryBreakdown();

updateExpenseChart();