// Function to initialize modal - can be called multiple times
function initializeModal() {
    console.log("Initializing modal...");
    
    const modal = document.getElementById("addFamilyModal");
    const openBtn = document.getElementById("openModalBtn");
    const closeBtn = document.querySelector(".close-btn");
    // Try multiple ways to find the form
    let familyForm = document.getElementById("familyForm");
    if (!familyForm && modal) {
        // Try finding form inside modal
        familyForm = modal.querySelector("form");
    }
    if (!familyForm) {
        familyForm = document.querySelector("form#familyForm");
    }
    
    console.log("Elements found:", { 
        modal: !!modal, 
        openBtn: !!openBtn, 
        closeBtn: !!closeBtn, 
        familyForm: !!familyForm 
    });
    
    // Try multiple selectors to find the table body
    let tableBody = document.querySelector(".table-container tbody");
    if (!tableBody) {
        tableBody = document.querySelector("table tbody");
    }
    if (!tableBody) {
        const table = document.querySelector("table");
        if (table) {
            tableBody = table.querySelector("tbody");
        }
    }

    if (!modal || !openBtn || !closeBtn || !familyForm) {
        console.warn("Required elements not found yet, will retry...", { 
            modal: !!modal, 
            openBtn: !!openBtn, 
            closeBtn: !!closeBtn, 
            familyForm: !!familyForm 
        });
        return false; // Return false to indicate not ready
    }

    // If we already initialized, don't do it again
    if (openBtn.hasAttribute('data-initialized')) {
        console.log("Modal already initialized");
        return true;
    }

    // Mark as initialized
    openBtn.setAttribute('data-initialized', 'true');
    
    if (!tableBody) {
        console.warn("Table body not found - form submission will be disabled");
    }

    // Error message element
    const errorMessage = document.getElementById("errorMessage");

    // Store references in a way that can be accessed
    window.modalData = {
        modal: modal,
        openBtn: openBtn,
        closeBtn: closeBtn,
        familyForm: familyForm,
        tableBody: tableBody,
        errorMessage: errorMessage
    };

    // Function to show error message
    function showError(message) {
        const errMsg = window.modalData?.errorMessage || document.getElementById("errorMessage");
        if (errMsg) {
            errMsg.textContent = message;
            errMsg.style.display = "flex";
            errMsg.scrollIntoView({ behavior: "smooth", block: "nearest" });
        } else {
            alert(message); // Fallback if error message element doesn't exist
        }
    }

    // Function to hide error message
    function hideError() {
        const errMsg = window.modalData?.errorMessage || document.getElementById("errorMessage");
        if (errMsg) {
            errMsg.style.display = "none";
        }
    }

    // Function to remove error styling from inputs
    function clearErrorStyling() {
        const form = window.modalData?.familyForm || document.getElementById("familyForm");
        if (form) {
            const inputs = form.querySelectorAll("input");
            inputs.forEach(input => input.classList.remove("error"));
        }
    }

    // Open modal
    openBtn.addEventListener("click", function(e) {
        e.preventDefault();
        console.log("Open button clicked");
        const currentModal = window.modalData?.modal || document.getElementById("addFamilyModal");
        if (currentModal) {
            currentModal.style.display = "flex";
            hideError();
            clearErrorStyling();
            console.log("Modal opened");
        } else {
            console.error("Modal element not found when trying to open");
            alert("Error: Modal not found. Please refresh the page.");
        }
    });

    // Close modal when clicking X
    if (closeBtn) {
    closeBtn.addEventListener("click", () => {
            const currentModal = window.modalData?.modal || document.getElementById("addFamilyModal");
            const form = window.modalData?.familyForm || document.getElementById("familyForm");
            if (currentModal) {
                currentModal.style.display = "none";
            }
            if (form) {
                form.reset();
            }
            hideError();
            clearErrorStyling();
        });
    }

    // Close when clicking outside
    window.addEventListener("click", (event) => {
        const currentModal = window.modalData?.modal || document.getElementById("addFamilyModal");
        if (event.target === currentModal && currentModal) {
            currentModal.style.display = "none";
            const form = window.modalData?.familyForm || document.getElementById("familyForm");
            if (form) {
                form.reset();
            }
            hideError();
            clearErrorStyling();
        }
    });

    // Handle form submission
    familyForm.addEventListener("submit", function (e) {
        e.preventDefault();
        hideError();
        clearErrorStyling();

        try {
            // Check if table body exists (try to find it again in case DOM changed)
            let currentTableBody = window.modalData?.tableBody;
            if (!currentTableBody) {
                currentTableBody = document.querySelector(".table-container tbody");
            }
            if (!currentTableBody) {
                currentTableBody = document.querySelector("table tbody");
            }
            if (!currentTableBody) {
                showError("Error: Cannot find the evacuees inventory table. Please refresh the page.");
                console.error("Table body not found during submission");
                return;
            }
            
            // Use currentTableBody instead of tableBody for the rest of the function
            const tbody = currentTableBody;

            // Get form values
            const headOfFamily = document.getElementById("headOfFamily").value.trim();
            const address = document.getElementById("address").value.trim();
            const contactNumber = document.getElementById("contactNumber").value.trim();
            const disasterType = document.getElementById("disasterType").value.trim();
            const evacuationCenter = document.getElementById("evacuationCenter").value.trim();
            const totalFamilyNumbers = parseInt(document.getElementById("totalFamilyNumbers").value) || 0;
            const seniorCitizens = parseInt(document.getElementById("seniorCitizens").value) || 0;
            const pwd = parseInt(document.getElementById("pwd").value) || 0;
            const children = parseInt(document.getElementById("children").value) || 0;

            // Validate required fields
            const errors = [];
            const errorFields = [];

            if (!headOfFamily) {
                errors.push("Head of Family Name is required");
                errorFields.push(document.getElementById("headOfFamily"));
            }
            if (!address) {
                errors.push("Address is required");
                errorFields.push(document.getElementById("address"));
            }
            if (!contactNumber) {
                errors.push("Contact Number is required");
                errorFields.push(document.getElementById("contactNumber"));
            }
            if (!disasterType) {
                errors.push("Disaster Type is required");
                errorFields.push(document.getElementById("disasterType"));
            }
            if (!evacuationCenter) {
                errors.push("Evacuation Center Assigned is required");
                errorFields.push(document.getElementById("evacuationCenter"));
            }
            if (totalFamilyNumbers <= 0) {
                errors.push("Total Family Numbers must be greater than 0");
                errorFields.push(document.getElementById("totalFamilyNumbers"));
            }
            if (seniorCitizens < 0) {
                errors.push("No. of Senior Citizens cannot be negative");
                errorFields.push(document.getElementById("seniorCitizens"));
            }
            if (pwd < 0) {
                errors.push("No. of PWD cannot be negative");
                errorFields.push(document.getElementById("pwd"));
            }
            if (children < 0) {
                errors.push("No. of Children cannot be negative");
                errorFields.push(document.getElementById("children"));
            }

            // Validate that total members don't exceed total family numbers
            const totalMembers = seniorCitizens + pwd + children;
            if (totalMembers > totalFamilyNumbers) {
                errors.push("Total members (Seniors + PWD + Children) cannot exceed Total Family Numbers");
            }

            // If there are validation errors, show them
            if (errors.length > 0) {
                showError(errors.join(". "));
                errorFields.forEach(field => {
                    if (field) field.classList.add("error");
                });
                return;
            }

            // Remove empty placeholder rows first
            const allRows = tbody.querySelectorAll("tr");
            allRows.forEach(row => {
                const firstCell = row.querySelector("td");
                // Check if row is empty (first cell is empty or row has only empty cells)
                if (firstCell) {
                    const hasContent = Array.from(row.querySelectorAll("td")).some(cell => cell.textContent.trim() !== "");
                    if (!hasContent) {
                        row.remove();
                    }
                }
            });

            // Get the highest Family ID from existing rows (after removing empty ones)
            const existingRows = tbody.querySelectorAll("tr");
            let maxId = 0;
            existingRows.forEach(row => {
                const firstCell = row.querySelector("td:first-child");
                if (firstCell && firstCell.textContent.trim()) {
                    const idText = firstCell.textContent.trim();
                    const id = parseInt(idText);
                    if (!isNaN(id) && id > 0) {
                        if (id > maxId) {
                            maxId = id;
                        }
                    }
                }
            });
            const newFamilyId = maxId + 1;

            // Create new table row
            const newRow = document.createElement("tr");
            newRow.innerHTML = `
                <td>${newFamilyId}</td>
                <td>${headOfFamily}</td>
                <td>${seniorCitizens}</td>
                <td>${pwd}</td>
                <td>${children}</td>
                <td>${totalMembers}</td>
                <td>${evacuationCenter}</td>
                <td class="action-buttons">
                    <button class="action-btn view-btn">View</button>
                    <button class="action-btn update-btn">Update</button>
                    <button class="action-btn delete-btn">Delete</button>
                </td>
            `;

            // Insert new row
            tbody.appendChild(newRow);

            // Reset form and close modal
            familyForm.reset();
            clearErrorStyling();
            hideError();
            modal.style.display = "none";

            // Success message (optional - you can remove this if not needed)
            console.log("Family record added successfully with ID:", newFamilyId);

        } catch (error) {
            console.error("Error submitting form:", error);
            showError("An unexpected error occurred. Please try again. Error: " + error.message);
        }
    });

    // Clear errors when user starts typing
    const formInputs = familyForm.querySelectorAll("input");
    formInputs.forEach(input => {
        input.addEventListener("input", function() {
            this.classList.remove("error");
            const errMsg = window.modalData?.errorMessage || document.getElementById("errorMessage");
            if (errMsg && errMsg.style.display !== "none") {
                hideError();
        }
    });
});

    return true; // Return true to indicate success
}

// Function to wait for elements and initialize
function waitForElementsAndInitialize() {
    const modal = document.getElementById("addFamilyModal");
    const openBtn = document.getElementById("openModalBtn");
    const closeBtn = document.querySelector(".close-btn");
    // Try multiple ways to find the form
    let familyForm = document.getElementById("familyForm");
    if (!familyForm && modal) {
        // Try finding form inside modal
        familyForm = modal.querySelector("form");
    }
    if (!familyForm) {
        familyForm = document.querySelector("form#familyForm");
    }
    
    if (modal && openBtn && closeBtn && familyForm) {
        console.log("All elements found, initializing modal...");
        initializeModal();
        return true;
    } else {
        console.log("Waiting for elements...", {
            modal: !!modal,
            openBtn: !!openBtn,
            closeBtn: !!closeBtn,
            familyForm: !!familyForm
        });
        return false;
    }
}

// Function to try initializing with retries
function tryInitializeWithRetries() {
    let attempts = 0;
    const maxAttempts = 10;
    const delay = 200; // 200ms between attempts
    
    function attempt() {
        attempts++;
        console.log(`Initialization attempt ${attempts}/${maxAttempts}...`);
        
        if (waitForElementsAndInitialize()) {
            console.log("Successfully initialized!");
            return;
        }
        
        if (attempts < maxAttempts) {
            setTimeout(attempt, delay);
        } else {
            console.error("Failed to find required elements after", maxAttempts, "attempts");
            console.error("Final elements status:", {
                modal: !!document.getElementById("addFamilyModal"),
                openBtn: !!document.getElementById("openModalBtn"),
                closeBtn: !!document.querySelector(".close-btn"),
                familyForm: !!document.getElementById("familyForm"),
                formInModal: !!(document.getElementById("addFamilyModal")?.querySelector("form"))
            });
            alert("Error: Could not find required elements. Please refresh the page.");
        }
    }
    
    attempt();
}

// Try to initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener("DOMContentLoaded", function () {
        console.log("DOM loaded, starting initialization attempts...");
        tryInitializeWithRetries();
        // Initialize search functionality with retries
        tryInitializeSearchWithRetries();
    });
} else {
    // DOM is already loaded
    console.log("DOM already loaded, starting initialization attempts...");
    tryInitializeWithRetries();
    // Initialize search functionality with retries
    tryInitializeSearchWithRetries();
}

// Also try on window load as a fallback
window.addEventListener("load", function() {
    if (!window.modalData || !window.modalData.familyForm) {
        console.log("Window loaded, checking if modal needs initialization...");
        if (waitForElementsAndInitialize()) {
            console.log("Modal initialized on window load");
        }
    }
    
    // Initialize search functionality with retries
    tryInitializeSearchWithRetries();
});

// Search functionality
function initializeSearch() {
    // Try multiple ways to find search input
    let searchInput = document.getElementById("searchInput");
    if (!searchInput) {
        searchInput = document.querySelector(".search-input");
    }
    if (!searchInput) {
        searchInput = document.querySelector("input[placeholder='Search']");
    }
    
    let searchButton = document.getElementById("searchButton");
    if (!searchButton) {
        searchButton = document.querySelector(".search-button");
    }
    
    const tableBody = document.querySelector(".table-container tbody") || document.querySelector("table tbody");
    
    if (!searchInput || !tableBody) {
        console.warn("Search elements not found", { 
            searchInput: !!searchInput, 
            searchButton: !!searchButton,
            tableBody: !!tableBody 
        });
        return false; // Return false to indicate not ready
    }
    
    // Prevent double initialization
    if (searchInput.hasAttribute('data-search-initialized')) {
        console.log("Search already initialized");
        return true;
    }
    searchInput.setAttribute('data-search-initialized', 'true');
    
    function performSearch() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        const rows = tableBody.querySelectorAll("tr");
        
        // Remove existing "no results" message
        const existingNoResults = tableBody.querySelector("tr.no-results-message");
        if (existingNoResults) {
            existingNoResults.remove();
        }
        
        console.log("Performing search for:", searchTerm);
        console.log("Total rows found:", rows.length);
        
        let visibleCount = 0;
        
        rows.forEach((row, index) => {
            // Skip empty placeholder rows and no-results message
            if (row.classList.contains("no-results-message")) {
                return;
            }
            
            const firstCell = row.querySelector("td:first-child");
            if (!firstCell || !firstCell.textContent.trim()) {
                row.style.display = "none";
                return;
            }
            
            // Get all text content from the row (excluding action buttons column)
            const cells = row.querySelectorAll("td");
            let rowText = "";
            cells.forEach((cell, cellIndex) => {
                // Skip the action buttons column (last column)
                if (!cell.classList.contains("action-buttons")) {
                    const cellText = cell.textContent.trim().toLowerCase();
                    rowText += cellText + " ";
                }
            });
            
            // Show or hide row based on search term
            const matches = searchTerm === "" || rowText.includes(searchTerm);
            
            if (matches) {
                row.style.display = "";
                visibleCount++;
                console.log(`Row ${index + 1} matches:`, rowText.trim());
            } else {
                row.style.display = "none";
            }
        });
        
        console.log("Visible rows after search:", visibleCount);
        
        // Show "No results found" message if search has no matches
        if (searchTerm !== "" && visibleCount === 0) {
            const noResultsRow = document.createElement("tr");
            noResultsRow.className = "no-results-message";
            noResultsRow.innerHTML = `
                <td colspan="8" style="text-align: center; padding: 40px; color: #999; font-style: italic;">
                    No results found for "${searchTerm}"
                </td>
            `;
            tableBody.appendChild(noResultsRow);
            console.log("No results found for:", searchTerm);
        }
    }
    
    // Search on button click
    if (searchButton) {
        searchButton.addEventListener("click", function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log("Search button clicked");
            performSearch();
        });
    } else {
        console.warn("Search button not found");
    }
    
    // Search on Enter key press
    searchInput.addEventListener("keypress", function(e) {
        if (e.key === "Enter") {
            e.preventDefault();
            console.log("Enter key pressed in search");
            performSearch();
        }
    });
    
    // Search as you type (with debounce)
    let searchTimeout;
    searchInput.addEventListener("input", function() {
        console.log("Search input changed:", searchInput.value);
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(function() {
            console.log("Executing search after debounce");
            performSearch();
        }, 300); // Wait 300ms after user stops typing
    });
    
    // Also perform search immediately if there's already text in the input
    if (searchInput.value.trim() !== "") {
        performSearch();
    }
    
    console.log("Search functionality initialized successfully");
    return true;
}

// Delete button functionality
function initializeDeleteButtons() {
    const tableBody = document.querySelector(".table-container tbody") || document.querySelector("table tbody");
    
    if (!tableBody) {
        console.warn("Table body not found for delete buttons");
        return;
    }
    
    // Use event delegation to handle delete buttons (works for dynamically added rows)
    tableBody.addEventListener("click", function(e) {
        if (e.target && e.target.classList.contains("delete-btn")) {
            e.preventDefault();
            e.stopPropagation();
            
            const button = e.target;
            const row = button.closest("tr");
            
            if (!row) {
                console.warn("Could not find row for delete button");
                return;
            }
            
            // Get the head of family name for confirmation
            const cells = row.querySelectorAll("td");
            const headOfFamily = cells[1] ? cells[1].textContent.trim() : "this record";
            
            // Confirm deletion
            if (confirm(`Are you sure you want to delete the record for "${headOfFamily}"?`)) {
                // Remove the row
                row.remove();
                console.log("Record deleted:", headOfFamily);
                
                // If there's a search active, re-run the search to update the display
                const searchInput = document.getElementById("searchInput") || 
                                   document.querySelector(".search-input") ||
                                   document.querySelector("input[placeholder='Search']");
                if (searchInput && searchInput.value.trim() !== "") {
                    // Trigger search again to update display
                    const searchEvent = new Event("input", { bubbles: true });
                    searchInput.dispatchEvent(searchEvent);
                }
            }
        }
    });
    
    console.log("Delete button functionality initialized");
}

// Initialize delete buttons when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener("DOMContentLoaded", function () {
        initializeDeleteButtons();
    });
} else {
    initializeDeleteButtons();
}

// Also initialize on window load
window.addEventListener("load", function() {
    initializeDeleteButtons();
});

// Function to wait for search elements and initialize
function waitForSearchAndInitialize() {
    let searchInput = document.getElementById("searchInput");
    if (!searchInput) {
        searchInput = document.querySelector(".search-input");
    }
    if (!searchInput) {
        searchInput = document.querySelector("input[placeholder='Search']");
    }
    
    const tableBody = document.querySelector(".table-container tbody") || document.querySelector("table tbody");
    
    if (searchInput && tableBody) {
        console.log("All search elements found, initializing...");
        return initializeSearch();
    } else {
        console.log("Waiting for search elements...", {
            searchInput: !!searchInput,
            tableBody: !!tableBody
        });
        return false;
    }
}

// Function to try initializing search with retries
function tryInitializeSearchWithRetries() {
    let attempts = 0;
    const maxAttempts = 10;
    const delay = 200;
    
    function attempt() {
        attempts++;
        console.log(`Search initialization attempt ${attempts}/${maxAttempts}...`);
        
        if (waitForSearchAndInitialize()) {
            console.log("Search successfully initialized!");
            return;
        }
        
        if (attempts < maxAttempts) {
            setTimeout(attempt, delay);
        } else {
            console.warn("Failed to initialize search after", maxAttempts, "attempts");
        }
    }
    
    attempt();
}
