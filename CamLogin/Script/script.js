 function login() {
    const userID = document.getElementById("userid").value;
    const userPassword = document.getElementById("password").value;

    fetch("http://kingsportal.ama.ph:8082/ama/auth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        APIKey: "NH1PSI2lh+26Y/e7GAJw7crLEfZyGDJd",
        UserID: userID,
        UserPassword: userPassword,
        SystemAccount: "KP"
      })
    })
    .then(response => response.json())
    .then(data => {
      console.log("API Response:", data);

      if (Array.isArray(data) && data.length > 0 && data[0].RESULT_CODE === "SCSS") {
        alert("Login Successful");
        
        // Optional: Save user info to localStorage
        localStorage.setItem("user", JSON.stringify(data[0]));

        // Redirect to dashboard
        window.location.href = "dashboard.html";
      } else {
        alert("Access Denied");
      }
    })
    .catch(error => {
      console.error("Error:", error);
      alert("Login failed. Please try again.");
    });
  }