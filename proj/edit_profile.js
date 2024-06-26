function updateProfile() {
  const name = document.getElementById("uName").value;
  const dob = document.getElementById("uDOB").value;
  const email = document.getElementById("uEmail").value;
  const password = document.getElementById("uPass").value;
  const phone = document.getElementById("uPhone").value;

  const userData = {
    name: name,
    dob: dob,
    email: email,
    password: password,
    phone: phone,
  };

  fetch("/updateProfile", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Profile Updated!", data);
      // Redirect to profile
      window.location.href = "/profile.html";
    })
    .catch((error) => {
      console.error("Error updating profile:", error);
    });
}

function onCancel() {
  // Redirect to profile page without making a server request
  window.location.href = "/profile.html";
}

function onHover(x, src) {
  x.src = src;
}
function onMouseOut(x, src) {
  x.src = src;
}
