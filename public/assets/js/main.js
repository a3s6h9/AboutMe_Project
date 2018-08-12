function copy() {
  var copyText = document.getElementById("URL");
  copyText.select();
  document.execCommand("copy");
  event.target.innerHTML = 'copied';
  event.target.classList.add('animated');
  event.target.classList.add('shake');
}

