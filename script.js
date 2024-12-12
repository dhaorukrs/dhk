document.addEventListener("DOMContentLoaded", () => {
  const saveButton = document.getElementById("save-wallet");
  const walletInput = document.getElementById("wallet-input");
  const walletDisplay = document.getElementById("wallet-display");
  const walletAddressSpan = document.getElementById("wallet-address");

  const pointsDisplay = document.getElementById("points-display");

  const footer = document.getElementById("footer");

  // Load points from localStorage (default to 1000 if not found)
  let points = localStorage.getItem("points") ? parseInt(localStorage.getItem("points")) : 1000;
  pointsDisplay.textContent = `$DGPW: ${points}`;

  // Show loading screen for 3 seconds before displaying the main content
  setTimeout(() => {
    document.getElementById("loading-screen").style.display = "none";
    document.getElementById("main-content").style.display = "block";
    footer.classList.remove("hidden"); // Show the footer after loading
  }, 3000);

  // Daily Check-In Logic
  const lastCheckIn = localStorage.getItem("lastCheckIn");
  const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format

  if (lastCheckIn !== today) {
    document.getElementById("daily-check-in").classList.remove("hidden");
    localStorage.setItem("lastCheckIn", today);
    points += 1000;
    pointsDisplay.textContent = `Points: ${points}`;
    localStorage.setItem("points", points); // Save updated points to localStorage
  }

  saveButton.addEventListener("click", () => {
    const walletAddress = walletInput.value.trim();
    if (walletAddress) {
      localStorage.setItem("walletAddress", walletAddress); // Store the wallet address
      walletInput.style.display = "none"; // Hide the input field
      saveButton.style.display = "none"; // Hide the save button
      walletDisplay.style.display = "flex"; // Show the wallet address display
      walletAddressSpan.textContent = formatWalletAddress(walletAddress); // Display formatted wallet address
    }
  });

  // Load the wallet address from localStorage (if any)
  const savedWalletAddress = localStorage.getItem("walletAddress");
  if (savedWalletAddress) {
    walletInput.style.display = "none";
    saveButton.style.display = "none";
    walletDisplay.style.display = "flex";
    walletAddressSpan.textContent = formatWalletAddress(savedWalletAddress);
  }

  // Format the wallet address to show first 3 and last 3 characters
  function formatWalletAddress(address) {
    return `${address.slice(0, 3)}...${address.slice(-3)}`;
  }

  // Task button functionality
  const taskButtons = document.querySelectorAll(".start-task");

  taskButtons.forEach(button => {
    const taskId = button.getAttribute("data-link"); // Get the link for the task
    const buttonKey = `task_${taskId}`; // Create a unique key for this task button

    // Check if the task is already in the loading or completed state in localStorage
    if (localStorage.getItem(buttonKey) === "loading") {
      button.classList.add("loading");
      button.textContent = "Verifying...";
    } else if (localStorage.getItem(buttonKey) === "completed") {
      button.classList.add("completed");
      button.textContent = "Completed";
    }

    button.addEventListener("click", function() {
      if (!button.classList.contains("loading") && !button.classList.contains("completed")) {
        // Mark the button as loading
        button.classList.add("loading");
        button.textContent = "Verifying...";

        // Save the loading state to localStorage
        localStorage.setItem(buttonKey, "loading");

        // Open the link in a new tab (search the link)
        window.open(taskId, "_blank");

        // Simulate waiting for 15 seconds (15000ms)
        setTimeout(() => {
          button.classList.remove("loading");
          button.classList.add("completed");
          button.textContent = "Completed";
          points += 500; // Add points after task completion
          pointsDisplay.textContent = `$DGPW: ${points}`;

          // Save the updated points and completed state to localStorage
          localStorage.setItem("points", points);
          localStorage.setItem(buttonKey, "completed");
        }, 15000); // 15 seconds delay to simulate task completion
      }
    });
  });

  const copyLinkButton = document.getElementById("copy-link-button");
  const copyLinkInput = document.getElementById("copy-link");

  // Copy button functionality
  copyLinkButton.addEventListener("click", () => {
    copyLinkInput.select();
    document.execCommand("copy"); // Copy the link to clipboard

    // Show custom message
    const customMessage = document.createElement("div");
    customMessage.textContent = "Link successfully copied!";
    customMessage.style.position = "fixed";
    customMessage.style.top = "10px";
    customMessage.style.left = "50%";
    customMessage.style.transform = "translateX(-50%)";
    customMessage.style.padding = "10px 20px";
    customMessage.style.background = "rgba(255, 0, 0, 0.8)";
    customMessage.style.color = "white";
    customMessage.style.border = "2px solid red";
    customMessage.style.borderRadius = "5px";
    customMessage.style.zIndex = "1000";
    customMessage.style.textAlign = "center";
    customMessage.style.fontWeight = "bold";

    document.body.appendChild(customMessage);

    // Remove the message after 3 seconds
    setTimeout(() => {
      document.body.removeChild(customMessage);
    }, 3000);
  });
});