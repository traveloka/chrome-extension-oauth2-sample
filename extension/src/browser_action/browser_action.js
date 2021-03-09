function isLoggedIn (token) {
  return true;
  // return decodeJwt(token).exp > Date.now() / 1000;
}

function logout(){
  // Remove the idToken from storage
  localStorage.clear();
  main();
}

// Minimal jQuery
const $$ = document.querySelectorAll.bind(document);
const $  = document.querySelector.bind(document);


function renderProfileView(authResult){
  $('.default').classList.add('hidden');
  $('.profile').classList.remove('hidden');
  $('.access_token').innerHTML = JSON.stringify(authResult);
  $('.logout-button').addEventListener('click', logout);
}


function renderDefaultView(){
  $('.default').classList.remove('hidden');
  $('.profile').classList.add('hidden');
  $('.loading').classList.add('hidden');

  $('.login-button').addEventListener('click', () => {
    $('.default').classList.add('hidden');
    $('.loading').classList.remove('hidden');
    chrome.runtime.sendMessage({
      type: "authenticate"
    });
  });
}

function main () {
  const authResult = JSON.parse(localStorage.authResult || '{}');
  console.log(authResult);
  if (authResult.access_token) {
    console.log("main.acc")
    renderProfileView(authResult);
  } else {
    console.log("main.else")
    renderDefaultView();
  }
}


document.addEventListener('DOMContentLoaded', main);