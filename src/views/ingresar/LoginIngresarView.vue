<template>
  <div class="login-page">
    <!-- BOTÓN INICIO -->
    <button class="btn-inicio" @click="goToHome">inicio</button>

    <!-- TARJETA DE BIENVENIDA -->
    <div class="welcome-card">
      <h1 class="title">Bienvenido</h1>
      <p class="subtitle">
        Puedes reservar tus citas médicas el mismo día y puedes pagarla tan sólo
        con un click.
      </p>

      <!-- OPCIONES DE DOCUMENTO -->
      <div class="document-options">
        <button
          :class="['doc-btn', { active: selectedDoc === 'dni' }]"
          @click="selectedDoc = 'dni'"
        >
          DNI
        </button>
        <button
          :class="['doc-btn', { active: selectedDoc === 'carnet' }]"
          @click="selectedDoc = 'carnet'"
        >
          Carnet extranjería
        </button>
        <button
          :class="['doc-btn', { active: selectedDoc === 'pasaporte' }]"
          @click="selectedDoc = 'pasaporte'"
        >
          Pasaporte
        </button>
      </div>

      <!-- FORMULARIO -->
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label class="label-handwritten">Número de documento</label>
          <input
            type="text"
            v-model="documentNumber"
            placeholder="Número de documento"
            class="input-field"
            required
          />
        </div>

        <div class="form-group">
          <label class="label-handwritten">Contraseña*</label>
          <div class="password-container">
            <input
              :type="showPassword ? 'text' : 'password'"
              v-model="password"
              placeholder="Contraseña"
              class="input-field"
              required
            />
            <button
              type="button"
              class="toggle-password"
              @click="showPassword = !showPassword"
              :aria-label="
                showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'
              "
            >
              {{ showPassword ? "👁️" : "👁️‍🗨️" }}
            </button>
          </div>
        </div>

        <!-- reCAPTCHA SIMULADO -->
        <div class="recaptcha-box">
          <input type="checkbox" id="recaptcha" v-model="recaptchaChecked" />
          <label for="recaptcha">No soy un robot</label>
          <div class="recaptcha-icon">🤖</div>
        </div>

        <!-- 🔹 ENLACE CORREGIDO -->
        <p class="forgot-password" @click="goToRecover">
          ¿Olvidaste tu contraseña?
        </p>

        <button
          type="submit"
          class="btn-ingresar"
          :disabled="!recaptchaChecked"
        >
          Ingresar
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const selectedDoc = ref("dni");
const documentNumber = ref("");
const password = ref("");
const showPassword = ref(false);
const recaptchaChecked = ref(false);

function goToHome() {
  router.push("/");
}

function goToRecover() {
  // 🔹 Ruta correcta dentro de tu SessionLayout
  router.push("/reservar-cita/recuperar-password");
}
//SE COMENTO LA FUNCION ORIGINAL PARA REALIZAR UNA VALIDACION MAS SENCILLA
// function handleLogin() {
//   if (!recaptchaChecked.value) {
//     alert("Por favor, verifica que no eres un robot");
//     return;
//   }

//   if (!documentNumber.value || !password.value) {
//     alert("Por favor, complete todos los campos");
//     return;
//   }

//   alert(`Ingresando con documento: ${documentNumber.value}`);
//   // Aquí iría la lógica de autenticación
// }
function handleLogin() {
  if (!documentNumber.value || !password.value || !recaptchaChecked.value) {
    alert("Completa todos los campos");
    return;
  }

  // Aquí iría tu validación normal…

  router.push({ name: "Bienvenida" });
}
</script>

<style scoped>
/* ⬇️ TU CSS ORIGINAL — SIN CAMBIOS */
@import url("https://fonts.googleapis.com/css2?family=Caveat:wght@400;700&family=Patrick+Hand&display=swap");

* {
  box-sizing: border-box;
}

.login-page {
  min-height: 100vh;
  background-color: #c8cdd2;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  position: relative;
}

/* BOTÓN INICIO */
.btn-inicio {
  position: absolute;
  top: 20px;
  left: 20px;
  background-color: transparent;
  border: 3px solid #38a881;
  color: #2c2c2c;
  font-family: "Patrick Hand", cursive;
  font-size: 18px;
  padding: 8px 24px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.btn-inicio:hover {
  background-color: #38a881;
  color: white;
  transform: translateY(-2px);
}

/* TARJETA */
.welcome-card {
  background: rgba(230, 235, 240, 0.95);
  border-radius: 30px;
  padding: 40px;
  max-width: 550px;
  width: 100%;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2);
  margin: 80px 20px 20px;
}

.title {
  font-family: "Caveat", cursive;
  font-size: clamp(32px, 8vw, 48px);
  font-weight: 700;
  text-align: center;
  margin-bottom: 15px;
  color: #2c2c2c;
  word-wrap: break-word;
}

.subtitle {
  font-family: "Patrick Hand", cursive;
  font-size: clamp(14px, 3vw, 17px);
  text-align: center;
  margin-bottom: 25px;
  color: #2c2c2c;
  line-height: 1.5;
  word-wrap: break-word;
}

/* OPCIONES DE DOCUMENTO */
.document-options {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 10px;
  margin-bottom: 25px;
}

.doc-btn {
  font-family: "Patrick Hand", cursive;
  background-color: transparent;
  border: 2px solid #38a881;
  color: #2c2c2c;
  padding: 10px 12px;
  border-radius: 10px;
  cursor: pointer;
  font-size: clamp(13px, 2.5vw, 16px);
  transition: all 0.3s ease;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.doc-btn.active {
  background-color: #38a881;
  color: white;
}

.doc-btn:hover {
  background-color: #38a881;
  color: white;
}

/* FORMULARIO */
.form-group {
  margin-bottom: 20px;
}

.label-handwritten {
  font-family: "Caveat", cursive;
  font-size: clamp(20px, 4vw, 24px);
  font-weight: 600;
  display: block;
  margin-bottom: 8px;
  color: #2c2c2c;
  word-wrap: break-word;
}

.input-field {
  width: 100%;
  max-width: 100%;
  padding: 14px 18px;
  border: 2px solid #38a881;
  border-radius: 12px;
  font-family: "Patrick Hand", cursive;
  font-size: clamp(14px, 3vw, 16px);
  background-color: rgba(255, 255, 255, 0.9);
  transition: all 0.3s ease;
  box-sizing: border-box;
}

.input-field:focus {
  outline: none;
  border-color: #2d8a6a;
  box-shadow: 0 0 0 3px rgba(56, 168, 129, 0.2);
}

.input-field::placeholder {
  color: #999;
  font-size: clamp(13px, 2.5vw, 15px);
}

.password-container {
  position: relative;
  width: 100%;
}

.password-container .input-field {
  padding-right: 50px;
}

.toggle-password {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  font-size: 20px;
  padding: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #2c2c2c;
  transition: opacity 0.3s ease;
}

.toggle-password:hover {
  opacity: 0.7;
}

/* reCAPTCHA */
.recaptcha-box {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 15px;
  border: 2px solid #ddd;
  border-radius: 10px;
  margin-bottom: 15px;
  background-color: rgba(255, 255, 255, 0.9);
  flex-wrap: wrap;
}

.recaptcha-box input[type="checkbox"] {
  width: 24px;
  height: 24px;
  min-width: 24px;
  cursor: pointer;
  flex-shrink: 0;
}

.recaptcha-box label {
  font-family: "Patrick Hand", cursive;
  font-size: clamp(14px, 3vw, 16px);
  flex: 1;
  cursor: pointer;
  min-width: 120px;
}

.recaptcha-icon {
  font-size: 28px;
  flex-shrink: 0;
}

/* OLVIDASTE CONTRASEÑA */
.forgot-password {
  font-family: "Caveat", cursive;
  font-size: clamp(18px, 3.5vw, 20px);
  color: #2c2c2c;
  text-align: center;
  display: block;
  margin-bottom: 20px;
  text-decoration: none;
  word-wrap: break-word;
  cursor: pointer;
}

.forgot-password:hover {
  text-decoration: underline;
  color: #38a881;
}

/* BOTÓN INGRESAR */
.btn-ingresar {
  width: 100%;
  max-width: 100%;
  padding: 14px;
  background-color: #7a8088;
  color: white;
  border: none;
  border-radius: 12px;
  font-family: "Patrick Hand", cursive;
  font-size: clamp(18px, 4vw, 22px);
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
  box-sizing: border-box;
}

.btn-ingresar:hover:not(:disabled) {
  background-color: #5f656d;
  transform: translateY(-2px);
}

.btn-ingresar:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* RESPONSIVE */
@media (max-width: 768px) {
  .login-page {
    padding: 15px;
  }

  .welcome-card {
    padding: 30px 20px;
    border-radius: 20px;
    margin: 70px 10px 10px;
  }

  .btn-inicio {
    top: 15px;
    left: 15px;
    padding: 6px 18px;
    font-size: 16px;
  }

  .document-options {
    grid-template-columns: 1fr;
  }

  .doc-btn {
    padding: 12px;
  }
}

@media (max-width: 480px) {
  .welcome-card {
    padding: 25px 15px;
    margin: 60px 5px 5px;
  }

  .btn-inicio {
    top: 10px;
    left: 10px;
    padding: 5px 15px;
    font-size: 14px;
  }

  .input-field {
    padding: 12px 15px;
  }

  .password-container .input-field {
    padding-right: 45px;
  }

  .recaptcha-box {
    padding: 12px;
    gap: 8px;
  }
}

@media (max-width: 360px) {
  .login-page {
    padding: 10px;
  }

  .welcome-card {
    padding: 20px 12px;
  }
}
</style>
