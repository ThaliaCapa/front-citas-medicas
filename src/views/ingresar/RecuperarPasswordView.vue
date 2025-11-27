<template>
  <div class="recover-page">
    <!-- BOTÓN INICIO -->
    <button class="btn-inicio" @click="goToHome">inicio</button>

    <!-- TARJETA DE RECUPERACIÓN -->
    <div class="recover-card">
      <h1 class="title">Olvidaste tu<br />contraseña</h1>

      <p class="description">
        Te enviaremos una nueva contraseña a tu<br />
        correo registrado.
      </p>

      <form @submit.prevent="sendRecovery">
        <div class="form-group">
          <label class="label-handwritten">Correo</label>
          <input
            type="email"
            v-model="email"
            placeholder="Ingrese su correo"
            class="input-field"
            required
          />
        </div>

        <div class="buttons-box">
          <button type="submit" class="btn-enviar">Enviar</button>
          <button type="button" class="btn-cancelar" @click="goBack">
            Cancelar
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const email = ref("");

function goToHome() {
  router.push("/");
}

function goBack() {
  router.back();
}

function sendRecovery() {
  if (!email.value.trim()) {
    alert("Por favor, ingrese su correo.");
    return;
  }
  alert(`Se envió un correo a: ${email.value}`);
}
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Caveat:wght@400;700&family=Patrick+Hand&display=swap");

/* CONTENEDOR PRINCIPAL */
.recover-page {
  min-height: 100vh;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #c8cdd2;
  padding: 15px;
  box-sizing: border-box;
  position: relative;
  overflow: hidden;
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
  padding: 8px 22px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 10;
}

.btn-inicio:hover {
  background-color: #38a881;
  color: white;
}

/* TARJETA CENTRAL */
.recover-card {
  width: 100%;
  max-width: 430px;
  background: rgba(230, 235, 240, 0.95);
  border-radius: 25px;
  padding: 32px 26px;
  text-align: center;
  box-shadow: 0 8px 28px rgba(0, 0, 0, 0.18);
  box-sizing: border-box;
}

/* TÍTULO */
.title {
  font-family: "Caveat", cursive;
  font-size: 34px;
  font-weight: 700;
  margin-bottom: 10px;
  color: #2c2c2c;
}

/* DESCRIPCIÓN */
.description {
  font-family: "Patrick Hand", cursive;
  font-size: 17px;
  margin-bottom: 20px;
  color: #2c2c2c;
  line-height: 1.35;
}

/* FORMULARIO */
.form-group {
  text-align: left;
  margin-bottom: 18px;
}

.label-handwritten {
  font-family: "Caveat", cursive;
  font-size: 22px;
  margin-bottom: 5px;
  color: #2c2c2c;
}

.input-field {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #38a881;
  border-radius: 12px;
  background-color: rgba(255, 255, 255, 0.9);
  font-family: "Patrick Hand", cursive;
  font-size: 16px;
  box-sizing: border-box;
}

.input-field:focus {
  border-color: #2d8a6a;
  box-shadow: 0 0 0 3px rgba(56, 168, 129, 0.3);
  outline: none;
}

/* BOTONES */
.buttons-box {
  display: flex;
  justify-content: center;
  gap: 14px;
  margin-top: 10px;
}

.btn-enviar,
.btn-cancelar {
  padding: 12px 25px;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  font-family: "Patrick Hand", cursive;
  font-size: 16px;
  transition: all 0.25s ease;
}

/* BOTÓN ENVIAR */
.btn-enviar {
  background-color: #7a8088;
  color: white;
}

.btn-enviar:hover {
  background-color: #5f656d;
}

/* BOTÓN CANCELAR */
.btn-cancelar {
  background-color: transparent;
  border: 2px solid #38a881;
  color: #2c2c2c;
}

.btn-cancelar:hover {
  background-color: #38a881;
  color: white;
}

/* RESPONSIVE */
@media (max-width: 480px) {
  .recover-card {
    padding: 22px 18px;
    max-width: 360px;
  }

  .title {
    font-size: 30px;
  }

  .description {
    font-size: 15px;
  }

  .btn-inicio {
    top: 12px;
    left: 12px;
    padding: 6px 14px;
    font-size: 14px;
  }
}
</style>
