document.addEventListener("DOMContentLoaded", function () {
    const modal = document.getElementById("addFamilyModal");
    const openBtn = document.getElementById("openModalBtn");
    const closeBtn = document.querySelector(".close-btn");

    if (!modal || !openBtn || !closeBtn) return; // Safety check

    // Open modal
    openBtn.addEventListener("click", () => {
        modal.style.display = "flex";
    });

    // Close modal when clicking X
    closeBtn.addEventListener("click", () => {
        modal.style.display = "none";
    });

    // Close when clicking outside
    window.addEventListener("click", (event) => {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });
});
