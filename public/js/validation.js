function usernameFieldValidation() {
  let username = document.getElementById("username").value;
  let error = document.getElementById("username-error");
  if (username.trim() == "") {
    error.classList.remove("hide");
    error.classList.add("error");
  } else {
    error.classList.remove("error");
    error.classList.add("hide");
  }
}

function nameValidation() {
  console.log("****");
  let firstname = document.getElementById("firstname").value;
  let lastname = document.getElementById("latname").value;
  let error = document.getElementById("name-error");
  if (firstname.trim() == "" || lastname.trim() == "") {
    error.classList.remove("hide");
    error.classList.add("error");
  } else {
    error.classList.remove("error");
    error.classList.add("hide");
  }
}

function ValidateEmail() {
  let email = document.getElementById("email").value;
  let error = document.getElementById("email-error");
  if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
    error.classList.remove("hide");
    error.classList.add("error");
  } else {
    error.classList.remove("error");
    error.classList.add("hide");
  }
}
