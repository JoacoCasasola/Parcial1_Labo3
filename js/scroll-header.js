window.addEventListener("scroll", transicion);

function transicion() {
  let header = document.querySelector("header");
  header.classList.toggle("transicion", window.scrollY > 60);
}
