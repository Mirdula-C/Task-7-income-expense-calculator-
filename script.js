// Select elements from HTML page
const entryForm = document.getElementById("entry-form");
const descriptionInput = document.getElementById("description");
const amountInput = document.getElementById("amount");
const typeSelect = document.getElementById("type");
const entriesList = document.getElementById("entries-list");
const netBalance = document.getElementById("net-balance");
const totalIncome = document.getElementById("total-income");
const totalExpenses = document.getElementById("total-expenses");
const resetButton = document.getElementById("reset");

// Load entries from local storage or initialize
let entries = JSON.parse(localStorage.getItem("entries")) || [];

// Helper Functions
function updateOverview() {
  let income = 0, expenses = 0;

  // Calculate total income and expenses.
  entries.forEach(entry => {
    if (entry.type === "income") income += entry.amount;  
    else expenses += entry.amount; 
  });

   // Update income, expenses, and net balance in UI.
  totalIncome.textContent = `₹${income.toFixed(2)}`;     
  totalExpenses.textContent = `₹${expenses.toFixed(2)}`;
  netBalance.textContent = `₹${(income - expenses).toFixed(2)}`; 
}

//function saves the current state of the entries to localStorage
function saveToLocalStorage() {
  localStorage.setItem("entries", JSON.stringify(entries));
}

function renderEntries(filter = "all") {
  entriesList.innerHTML = "";   // Clear the current list

  // Filter entries
  const filteredEntries = entries.filter(entry => filter === "all" || entry.type === filter);
  
  // Create list items for each entry.
  filteredEntries.forEach((entry, index) => {
    const li = document.createElement("li");
    li.classList.add("entry");  

    li.innerHTML = `
        <span>${entry.description}: ${entry.type === "income" ? "+" : "-"}₹${entry.amount.toFixed(2)}</span>
      <div class="buttons">
        <button onclick="editEntry(${index})">Edit</button>
        <button onclick="deleteEntry(${index})">Delete</button>
      </div>
    `;
    entriesList.appendChild(li);  // Add entry to list.
  });
}

function addEntry(description, amount, type) {
  entries.push({ description, amount, type });  // Add new entry.
  saveToLocalStorage();  // Save changes.
  updateOverview();  // Update summary.
  renderEntries();  // Refresh list. 
}

function deleteEntry(index) {
  entries.splice(index, 1);  // Remove entry.
  saveToLocalStorage();
  updateOverview();
  renderEntries();
}

function editEntry(index) {
  const entry = entries[index];  // Get entry to edit.
   // Pre-fill the form with entry details.
  descriptionInput.value = entry.description;  
  amountInput.value = entry.amount;   
  typeSelect.value = entry.type;  

  deleteEntry(index); 
}

function resetForm() {
  descriptionInput.value = "";  // Clear description.
  amountInput.value = "";  // Clear amount.
  typeSelect.value = "income";  // Reset type to income.
}

// Add entry on form submit
entryForm.addEventListener("submit", (event) => {
  event.preventDefault();  // // Prevent reload.

  const description = descriptionInput.value.trim(); // Entry description.
  const amount = parseFloat(amountInput.value);  // Entry amount
  const type = typeSelect.value;  // entry type.

  if (description && !isNaN(amount) && amount > 0) {
    addEntry(description, amount, type);  // Add entry.
    resetForm();  // Clear form.
  }
});

// Clear form on reset button click.
resetButton.addEventListener("click", resetForm); 

// Filter entries on selection change.
document.querySelectorAll("input[name='filter']").forEach(radio => {
  radio.addEventListener("change", () => {
    renderEntries(radio.value);
  });
});

// Initial load
updateOverview();
renderEntries();
