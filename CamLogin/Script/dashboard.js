let cameraStream = null;
let currentDateTime = null;

// Start camera
function startCamera() {
  navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
      document.getElementById('video').srcObject = stream;
      cameraStream = stream;
    })
    .catch(err => {
      alert("Unable to access the camera.");
      console.error(err);
    });
}

// Stop camera
function stopCamera() {
  if (cameraStream) {
    cameraStream.getTracks().forEach(track => track.stop());
    cameraStream = null;
    document.getElementById('video').srcObject = null;
  }
}

// Logout function with loader
function logout() {
  const loader = document.getElementById("LoadingID");
  if (loader) {
    loader.classList.remove("hidden");
    loader.classList.add("flex");
  }

  sessionStorage.clear();
  localStorage.clear();

  setTimeout(() => {
    window.location.href = "index.html";
  }, 1000);
}

// Attach logout to button
window.onload = () => {
  document.getElementById("logoutBtn").addEventListener("click", logout);
};

// Update live time every second
function startLiveClock() {
  setInterval(() => {
    if (!currentDateTime) return;
    currentDateTime.setSeconds(currentDateTime.getSeconds() + 1);

    const formatted = currentDateTime.toLocaleString('en-PH', {
      dateStyle: 'medium',
      timeStyle: 'medium',
      hour12: true
    });

    document.getElementById("time").textContent = `🕒 Time: ${formatted}`;
  }, 1000);
}

// Fetch time from timeapi.io
async function fetchTime() {
  try {
    const timeRes = await fetch("https://timeapi.io/api/Time/current/zone?timeZone=Asia/Manila");
    const timeData = await timeRes.json();

    currentDateTime = new Date(
      `${timeData.year}-${String(timeData.month).padStart(2, '0')}-${String(timeData.day).padStart(2, '0')}T${String(timeData.hour).padStart(2, '0')}:${String(timeData.minute).padStart(2, '0')}:${String(timeData.seconds).padStart(2, '0')}`
    );

    startLiveClock();
  } catch (error) {
    console.error("Time fetch failed:", error);
    document.getElementById("time").textContent = "🕒 Time: Unavailable";
  }
}

// Fetch location using geolocation first, fallback to IP
async function fetchLocation() {
  function fallbackToIP() {
    fetch("https://ipapi.co/json/")
      .then(res => res.json())
      .then(loc => {
        document.getElementById("location").textContent = `📍 Location: ${loc.city}, ${loc.region}, ${loc.country_name}`;
      })
      .catch(() => {
        document.getElementById("location").textContent = "📍 Location: Unavailable";
      });
  }

  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      async position => {
        const { latitude, longitude } = position.coords;
        try {
          const geoRes = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
          const geoData = await geoRes.json();
          const display = geoData.address.city || geoData.address.town || geoData.address.village || geoData.address.state;
          const country = geoData.address.country;
          document.getElementById("location").textContent = `📍 Location: ${display}, ${country}`;
        } catch {
          document.getElementById("location").textContent = `📍 Location: Lat ${latitude.toFixed(2)}, Lon ${longitude.toFixed(2)}`;
        }
      },
      () => fallbackToIP(),
      { timeout: 5000 }
    );
  } else {
    fallbackToIP();
  }
}

// Run all when DOM is ready
window.addEventListener("DOMContentLoaded", () => {
  fetchTime();
  fetchLocation();
});