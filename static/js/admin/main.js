var formNewDebate = document.getElementById("form_new_debate");
var formEditDebate = document.getElementById("form_edit_debate");
var msgError = document.getElementById("msg_error");
var msgStatus = document.getElementById("msg_status");

function init() {
  if (formNewDebate) {
    formNewDebate.addEventListener("submit", submitForm);
  }

  if (formEditDebate) {
    formEditDebate.addEventListener("submit", submitForm);
  }
}

function submitForm(e) {
  e.preventDefault();

  var url = "create";

  if (formEditDebate && e.target.id === formEditDebate.id) {
    url = "edit";
  }

  var errors = [];
  var debate_type = document.getElementsByName("type")[0].value;
  var title = document.getElementsByName("title")[0].value;
  var description = document.getElementsByName("debateDescription")[0].value;
  var debate_status = document.getElementsByName("status")[0].value;
  var voting_status = document.getElementsByName("voting_status")[0].value;

  if (isAlphaNumericWithCharacters(title)) {
    errors.push("Title must be alphanumeric or allowed chars (,_\"-') ");
  }

  if (isAlphaNumericWithCharacters(description)) {
    errors.push("Description must be alphanumeric or allowed chars (,_\"-') ");
  }

  var data = {
    debate_type,
    title,
    description,
    debate_status,
    voting_status
  };

  // Checking fields have at least some value
  for (var k in data) {
    if (data.hasOwnProperty(k)) {
      if (data[k] === undefined || data[k] === "") {
        errors.push(`${k}`);
      }
    }
  }

  if (errors.length > 0) {
    reportError(
      `Fill in all fields please.<br />${errors.join(", ")} are missing`
    );
  } else {
    try {
      var promise = new Promise((resolve, reject) => {
        resolve(submitData(`/api/debate/${url}`, data));
      });
      promise.then(response => {
        if (response.status === "error") {
          reportError(`Issue with fetch: ${response.data}`);
        } else if (response.status === "ok") {
          reportStatus("New debate added");

          if (url === "edit") {
            reportStatus("Debate edited");
            location.reload();
          } else {
            reportStatus("New debate added");
            clearForm();
          }
        }
      });
    } catch (error) {
      reportError(`Issue with form submission: ${error}`);
    }
  }
}

function submitData(url, data) {
  return fetch(url, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  })
    .then(response => {
      if (response.status >= 200 && response.status < 300) {
        return {
          status: "ok",
          data
        };
      } else {
        var error = new Error(response.statusText || response.status);
        error.response = response;
        return {
          status: "error",
          data: error
        };
      }
    })
    .catch(error => ({
      status: "error",
      data: error
    }));
}

function reportError(msg) {
  msgError.innerHTML = msg;
  msgError.classList.remove("hide");
  msgStatus.classList.add("hide");
}

function reportStatus(msg) {
  msgStatus.innerHTML = msg;
  msgStatus.classList.remove("hide");
  msgError.classList.add("hide");
}

function clearForm() {
  formNewDebate.reset();
}

function isAlphaNumeric(str) {
  return regexCheck(/^[a-z0-9]+$/gim, str);
}

function isAlphaNumericWithCharacters(str) {
  return regexCheck(/^[a-z0-9'",-_ ]+$/gim, str);
}

function regexCheck(regex, str) {
  var result = regex.exec(str);
  if (result === null) {
    return true;
  }
  return false;
}

init();
