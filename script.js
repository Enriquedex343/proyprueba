// script.js: validación, autenticación simulada e interacciones

// ---------------------------------------------------------------
// AVISO DIDÁCTICO: estas credenciales están escritas en el código
// SOLO para practicar. NO es un mecanismo seguro de autenticación.
// En un sistema real, la verificación se hace en un servidor y las
// contraseñas se almacenan cifradas (hash), nunca en el navegador.
// ---------------------------------------------------------------
const DEMO_EMAIL = "demo@ejemplo.com";
const DEMO_PASSWORD = "Demo1234!";
const STORAGE_KEY = "correoRecordado"; // Solo se guarda el correo, nunca la contraseña

// Referencias a elementos del DOM
const form = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const emailError = document.getElementById("emailError");
const passwordError = document.getElementById("passwordError");
const rememberBox = document.getElementById("remember");
const toggleBtn = document.getElementById("togglePassword");
const message = document.getElementById("formMessage");

// Expresión regular sencilla para validar el formato del correo
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// --- Funciones de validación: devuelven un mensaje de error o "" si es válido ---
function validateEmail(value) {
  if (value === "") return "El correo electrónico es obligatorio.";
  if (!emailPattern.test(value)) return "Escribe un correo válido, por ejemplo nombre@ejemplo.com.";
  return "";
}

function validatePassword(value) {
  if (value === "") return "La contraseña es obligatoria.";
  if (value.length < 8) return "La contraseña debe tener al menos 8 caracteres.";
  return "";
}

// Muestra u oculta el error de un campo
function showError(input, errorEl, text) {
  errorEl.textContent = text;
  input.classList.toggle("invalid", text !== "");
  input.setAttribute("aria-invalid", text !== "" ? "true" : "false");
}

// Muestra un mensaje general (tipo: "success" o "fail")
function showMessage(text, type) {
  message.textContent = text;
  message.className = "message " + type;
}

// --- Mostrar / ocultar contraseña ---
toggleBtn.addEventListener("click", () => {
  const hidden = passwordInput.type === "password";
  passwordInput.type = hidden ? "text" : "password";
  toggleBtn.setAttribute("aria-pressed", String(hidden));
  toggleBtn.setAttribute("aria-label", hidden ? "Ocultar contraseña" : "Mostrar contraseña");
});

// --- Recuperar el correo guardado al cargar la página ---
const savedEmail = localStorage.getItem(STORAGE_KEY);
if (savedEmail) {
  emailInput.value = savedEmail;
  rememberBox.checked = true;
}

// --- Validación en tiempo real al salir de cada campo ---
emailInput.addEventListener("blur", () => showError(emailInput, emailError, validateEmail(emailInput.value.trim())));
passwordInput.addEventListener("blur", () => showError(passwordInput, passwordError, validatePassword(passwordInput.value)));

// --- Envío del formulario ---
form.addEventListener("submit", (event) => {
  event.preventDefault(); // Evita que la página se recargue

  const email = emailInput.value.trim();
  const password = passwordInput.value;
  message.className = "message";
  message.textContent = "";

  const emailMsg = validateEmail(email);
  const passMsg = validatePassword(password);
  showError(emailInput, emailError, emailMsg);
  showError(passwordInput, passwordError, passMsg);

  // Si hay errores, se detiene y se lleva el foco al primer campo con error
  if (emailMsg || passMsg) {
    (emailMsg ? emailInput : passwordInput).focus();
    return;
  }

  // Guardar o borrar el correo según la casilla (nunca la contraseña)
  if (rememberBox.checked) localStorage.setItem(STORAGE_KEY, email);
  else localStorage.removeItem(STORAGE_KEY);

  // Autenticación simulada (solo didáctica)
  if (email === DEMO_EMAIL && password === DEMO_PASSWORD) {
    showMessage("¡Bienvenido/a! Datos válidos: inicio de sesión exitoso.", "success");
  } else {
    showMessage("Credenciales incorrectas. Revisa tu correo y contraseña.", "fail");
  }
});

// Enlace de recuperación: en esta práctica solo muestra un aviso
document.getElementById("forgot").addEventListener("click", (e) => {
  e.preventDefault();
  showMessage("Función de recuperación no implementada en esta demo.", "fail");
});
