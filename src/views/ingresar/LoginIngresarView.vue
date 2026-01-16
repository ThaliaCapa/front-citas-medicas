<template>
  <div class="login-page">
    <!-- BOTÓN INICIO (esquina superior izquierda) -->
    <button class="btn-inicio-esquina" @click="irAInicio">inicio</button>

    <div class="login-container">
      <div class="login-card">
        <h1 class="title">Bienvenido</h1>
        <p class="subtitle">
          Puedes reservar tus citas médicas el mismo día y puedes pagarla tan
          sólo con un click.
        </p>

        <!-- TIPO DE DOCUMENTO -->
        <div class="document-types">
          <button
            class="doc-btn"
            :class="{ active: tipoDocumento === 'dni' }"
            @click="tipoDocumento = 'dni'"
          >
            DNI
          </button>
          <button
            class="doc-btn"
            :class="{ active: tipoDocumento === 'carnet' }"
            @click="tipoDocumento = 'carnet'"
          >
            Carnet extranjería
          </button>
          <button
            class="doc-btn"
            :class="{ active: tipoDocumento === 'pasaporte' }"
            @click="tipoDocumento = 'pasaporte'"
          >
            Pasaporte
          </button>
        </div>

        <!-- FORMULARIO -->
        <form @submit.prevent="handleLogin">
          <div class="form-group">
            <label class="form-label">Número de documento</label>
            <input
              v-model="numeroDocumento"
              type="text"
              class="form-input"
              placeholder="Número de documento"
              required
            />
          </div>

          <div class="form-group">
            <label class="form-label">Contraseña*</label>
            <div class="password-container">
              <input
                v-model="password"
                :type="mostrarPassword ? 'text' : 'password'"
                class="form-input"
                placeholder="Contraseña"
                required
              />
              <button
                type="button"
                class="toggle-password"
                @click="mostrarPassword = !mostrarPassword"
              >
                {{ mostrarPassword ? "🙈" : "👁️" }}
              </button>
            </div>
          </div>

          <!-- RECAPTCHA -->
          <div class="recaptcha-box">
            <div class="recaptcha-placeholder">
              <input type="checkbox" v-model="recaptchaChecked" />
              <span>No soy un robot</span>
            </div>
          </div>

          <!-- OLVIDASTE CONTRASEÑA -->
          <div class="forgot-password">
            <a href="#" @click.prevent="irARecuperarPassword">
              ¿Olvidaste tu contraseña?
            </a>
          </div>

          <!-- BOTÓN INGRESAR -->
          <button
            type="submit"
            class="btn-ingresar"
            :disabled="!recaptchaChecked || loading"
          >
            {{ loading ? "Ingresando..." : "Ingresar" }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { authService } from "../../services/authService";

const router = useRouter();

const tipoDocumento = ref("dni");
const numeroDocumento = ref("");
const password = ref("");
const mostrarPassword = ref(false);
const recaptchaChecked = ref(false);
const loading = ref(false);

function irAInicio() {
  router.push({ name: "Inicio" });
}

function irARecuperarPassword() {
  router.push({ name: "RecuperarPassword" });
}

async function handleLogin() {
  if (!recaptchaChecked.value) {
    alert("Por favor, completa el reCAPTCHA");
    return;
  }

  if (!numeroDocumento.value || !password.value) {
    alert("Por favor completa todos los campos");
    return;
  }

  loading.value = true;

  try {
    console.log("Intentando iniciar sesión con documento:", numeroDocumento.value);

    const { data, error } = await authService.login(
      numeroDocumento.value,
      password.value
    );

    if (error) {
      console.error("Error al iniciar sesión:", error);
      alert("Credenciales incorrectas. Por favor verifica tus datos.");
      loading.value = false;
      return;
    }

    console.log("Login exitoso:", data);
    //alert("¡Bienvenido!");

    router.push({ name: "BienvenidaIngresar" });
  } catch (error) {
    console.error("Error inesperado:", error);
    alert("Ocurrió un error inesperado. Por favor intenta nuevamente.");
    loading.value = false;
  }
}
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Caveat:wght@400;700&family=Patrick+Hand&display=swap");

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.login-page {
  min-height: 100vh;
  background-color: #b8bdc4;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  position: relative;
}

.btn-inicio-esquina {
  position: absolute;
  top: 30px;
  left: 30px;
  background-color: transparent;
  border: 3px solid #5bc9ab;
  border-radius: 15px;
  padding: 12px 35px;
  font-family: "Patrick Hand", cursive;
  font-size: 18px;
  font-weight: 600;
  color: #5bc9ab;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-inicio-esquina:hover {
  background-color: #5bc9ab;
  color: white;
  transform: scale(1.05);
}

.login-container {
  width: 100%;
  max-width: 550px;
}

.login-card {
  background-color: rgba(255, 255, 255, 0.95);
  border-radius: 30px;
  padding: 45px 40px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
}

.title {
  font-family: "Caveat", cursive;
  font-size: 38px;
  font-weight: 700;
  color: #2c2c2c;
  text-align: center;
  margin-bottom: 15px;
}

.subtitle {
  font-family: "Patrick Hand", cursive;
  font-size: 16px;
  color: #2c2c2c;
  text-align: center;
  line-height: 1.5;
  margin-bottom: 30px;
}

.document-types {
  display: flex;
  gap: 10px;
  margin-bottom: 25px;
}

.doc-btn {
  flex: 1;
  padding: 12px 15px;
  border: 2px solid #5bc9ab;
  border-radius: 12px;
  background-color: white;
  font-family: "Patrick Hand", cursive;
  font-size: 15px;
  font-weight: 600;
  color: #2c2c2c;
  cursor: pointer;
  transition: all 0.3s ease;
}

.doc-btn:hover {
  background-color: #f0f9f6;
}

.doc-btn.active {
  background-color: #5bc9ab;
  color: white;
}

.form-group {
  margin-bottom: 20px;
}

.form-label {
  display: block;
  font-family: "Patrick Hand", cursive;
  font-size: 16px;
  font-weight: 600;
  color: #2c2c2c;
  margin-bottom: 8px;
}

.form-input {
  width: 100%;
  padding: 14px 18px;
  border: 3px solid #5bc9ab;
  border-radius: 12px;
  font-family: "Patrick Hand", cursive;
  font-size: 16px;
  color: #2c2c2c;
  transition: all 0.3s ease;
}

.form-input:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(91, 201, 171, 0.2);
}

.form-input::placeholder {
  color: #999;
}

.password-container {
  position: relative;
}

.toggle-password {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  font-size: 22px;
  cursor: pointer;
  padding: 5px;
}

.recaptcha-box {
  margin: 25px 0;
  padding: 20px;
  border: 2px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
}

.recaptcha-placeholder {
  display: flex;
  align-items: center;
  gap: 12px;
  font-family: "Patrick Hand", cursive;
  font-size: 16px;
}

.recaptcha-placeholder input[type="checkbox"] {
  width: 24px;
  height: 24px;
  cursor: pointer;
}

.forgot-password {
  text-align: center;
  margin: 15px 0 25px;
}

.forgot-password a {
  font-family: "Patrick Hand", cursive;
  font-size: 15px;
  color: #2c2c2c;
  text-decoration: none;
  transition: color 0.3s ease;
}

.forgot-password a:hover {
  color: #5bc9ab;
}

.btn-ingresar {
  width: 100%;
  padding: 16px;
  border: none;
  border-radius: 15px;
  background-color: #7a8088;
  color: white;
  font-family: "Patrick Hand", cursive;
  font-size: 20px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.btn-ingresar:hover:not(:disabled) {
  background-color: #6a7078;
  transform: translateY(-2px);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.2);
}

.btn-ingresar:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .login-page {
    padding: 30px 15px;
  }

  .btn-inicio-esquina {
    top: 20px;
    left: 20px;
    padding: 10px 25px;
    font-size: 16px;
  }

  .login-card {
    padding: 35px 30px;
  }

  .title {
    font-size: 32px;
  }

  .subtitle {
    font-size: 15px;
  }

  .document-types {
    flex-direction: column;
  }
}

@media (max-width: 480px) {
  .btn-inicio-esquina {
    padding: 8px 20px;
    font-size: 15px;
  }

  .login-card {
    padding: 30px 25px;
  }

  .title {
    font-size: 28px;
  }

  .doc-btn {
    font-size: 14px;
  }
}
</style>