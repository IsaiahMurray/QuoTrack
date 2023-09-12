document.addEventListener("DOMContentLoaded", function () {
    // Initialize the current date
    const currentDate = new Date();
    document.getElementById("currentDate").textContent = currentDate.toLocaleDateString();

    // Retrieve data from local storage or initialize if not present
    let savedMonth = localStorage.getItem("currentMonth");
    const currentMonth = currentDate.getMonth() + 1; // JavaScript months are 0-based

    if (!savedMonth || savedMonth !== currentMonth.toString()) {
        // Reset the data if it's a new month
        localStorage.setItem("currentMonth", currentMonth.toString());
        localStorage.setItem("totalInvoices", "0");
        localStorage.setItem("invoicesCompletedToday", "0");
        savedMonth = currentMonth.toString();
    }

    let totalInvoices = parseInt(localStorage.getItem("totalInvoices")) || 0;
    let invoicesCompletedToday = parseInt(localStorage.getItem("invoicesCompletedToday")) || 0;
    let monthlyTarget = parseInt(localStorage.getItem("monthlyTarget")) || 750; // Default value

    // Populate the edit monthly target input field with the current target
    document.getElementById("editMonthlyTarget").value = monthlyTarget;

    // Calculate the remaining workdays in the month
    const totalDaysInMonth = new Date(currentDate.getFullYear(), currentMonth, 0).getDate();
    const remainingWorkdays = getRemainingWorkdays(currentDate, totalDaysInMonth);

    // Calculate remaining invoices for today and the month
    const invoicesRemainingToday = Math.ceil((monthlyTarget - totalInvoices) / remainingWorkdays);
    const remainingMonth = monthlyTarget - totalInvoices;

    // Update the displayed values
    document.getElementById("totalInvoices").textContent = totalInvoices;
    document.getElementById("completedToday").value = invoicesCompletedToday;
    document.getElementById("remainingToday").textContent = invoicesRemainingToday;
    document.getElementById("remainingMonth").textContent = remainingMonth;
});

function updateData() {
    // Get the values from input fields
    const invoicesCompletedToday = parseInt(document.getElementById("completedToday").value);

    // Update the total invoices and invoices completed today
    let totalInvoices = parseInt(localStorage.getItem("totalInvoices")) || 0;
    totalInvoices += invoicesCompletedToday;
    localStorage.setItem("totalInvoices", totalInvoices.toString());
    localStorage.setItem("invoicesCompletedToday", invoicesCompletedToday.toString());

    // Calculate the remaining workdays in the month
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const totalDaysInMonth = new Date(currentDate.getFullYear(), currentMonth, 0).getDate();
    const remainingWorkdays = getRemainingWorkdays(currentDate, totalDaysInMonth);

    // Calculate remaining invoices for today and the month
    const monthlyTarget = parseInt(localStorage.getItem("monthlyTarget")) || 750;
    const invoicesRemainingToday = Math.ceil((monthlyTarget - totalInvoices) / remainingWorkdays);
    const remainingMonth = monthlyTarget - totalInvoices;

    // Update the displayed values
    document.getElementById("totalInvoices").textContent = totalInvoices;
    document.getElementById("remainingToday").textContent = invoicesRemainingToday;
    document.getElementById("remainingMonth").textContent = remainingMonth;
}

function editMonthlyTarget() {
    // Get the new monthly target from the input field
    const newMonthlyTarget = parseInt(document.getElementById("editMonthlyTarget").value);

    // Update the monthly target in local storage
    localStorage.setItem("monthlyTarget", newMonthlyTarget.toString());

    // Call the updateData function to refresh the display
    updateData();
}

function getRemainingWorkdays(date, totalDaysInMonth) {
    const currentDate = date.getDate();
    let remainingWorkdays = 0;

    for (let day = currentDate + 1; day <= totalDaysInMonth; day++) {
        date.setDate(day);
        if (date.getDay() >= 1 && date.getDay() <= 5) {
            // Count weekdays (Monday to Friday)
            remainingWorkdays++;
        }
    }

    return remainingWorkdays;
}
