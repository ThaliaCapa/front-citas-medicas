<template>
  <div class="reserva-container">
    <!-- FONDO CON IMAGEN -->
    <div class="background-image"></div>

    <!-- TARJETA DE BIENVENIDA -->
    <div class="welcome-card">
      <!-- LOGO -->
      <div class="card-logo">
        <div class="logo-icon">🏥</div>
        <div class="logo-text">
          Tópico <br />
          <span class="logo-subtitle">Los Ángeles</span>
        </div>
      </div>

      <h1 class="welcome-title">Bienvenido al Portal</h1>

      <p class="welcome-text">
        Somos la Red de Clínicas San Pablo, contamos con un staff médico
        especializado y tecnología avanzada, con procesos de seguridad y calidad
        en la atención de cada paciente.
      </p>

      <div class="button-group">
        <button class="btn-ingresar" @click="goToIngresar">Ingresar</button>
        <button class="btn-registrar" @click="goToRegistro">Registrar</button>
      </div>
    </div>

    <!-- BANNER INFERIOR -->
    <div class="bottom-banner">
      Si eres nuevo, regístrate y podrás gozar de todos los beneficios.
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();

function goToIngresar() {
  router.push({ name: "Ingresar" });
}


function goToRegistro() {
  router.push("/registro");
}
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Caveat:wght@400;700&family=Patrick+Hand&display=swap");

.reserva-container {
  position: relative;
  min-height: calc(100vh - 100px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 40px 20px;
  overflow: hidden;
}

/* FONDO */
.background-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url("https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg");
  background-size: cover;
  background-position: center;
  filter: blur(3px);
  z-index: -1;
}

/* TARJETA DE BIENVENIDA */
.welcome-card {
  background: rgba(200, 205, 210, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 30px;
  padding: 50px 60px;
  max-width: 600px;
  width: 100%;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.25);
  text-align: center;
  position: relative;
  z-index: 1;
}

/* LOGO */
.card-logo {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 25px;
  gap: 12px;
}

.logo-icon {
  font-size: 60px;
}

.logo-text {
  font-family: Arial, sans-serif;
  font-size: 24px;
  line-height: 1.1;
  text-align: left;
  color: #2c2c2c;
}

.logo-subtitle {
  font-size: 14px;
  color: #666;
}

/* TÍTULO */
.welcome-title {
  font-family: "Caveat", cursive;
  font-size: 52px;
  font-weight: 700;
  color: #2c2c2c;
  margin-bottom: 20px;
}

/* TEXTO */
.welcome-text {
  font-family: "Patrick Hand", cursive;
  font-size: 19px;
  line-height: 1.6;
  color: #2c2c2c;
  margin-bottom: 35px;
  text-align: left;
}

/* BOTONES */
.button-group {
  display: flex;
  gap: 20px;
  justify-content: center;
}

.btn-ingresar,
.btn-registrar {
  font-family: "Patrick Hand", cursive;
  padding: 14px 45px;
  font-size: 20px;
  border: none;
  border-radius: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
}

.btn-ingresar {
  background-color: #7a8088;
  color: white;
}

.btn-ingresar:hover {
  background-color: #5f656d;
  transform: translateY(-2px);
}

.btn-registrar {
  background-color: #38a881;
  color: white;
}

.btn-registrar:hover {
  background-color: #2d8a6a;
  transform: translateY(-2px);
}

/* BANNER INFERIOR */
.bottom-banner {
  background-color: #38a881;
  color: #2c2c2c;
  font-family: "Patrick Hand", cursive;
  font-size: 20px;
  padding: 20px 40px;
  border-radius: 25px;
  margin-top: 30px;
  max-width: 650px;
  text-align: center;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
}

/* RESPONSIVE */
@media (max-width: 768px) {
  .welcome-card {
    padding: 35px 30px;
  }

  .welcome-title {
    font-size: 42px;
  }

  .welcome-text {
    font-size: 17px;
  }

  .button-group {
    flex-direction: column;
  }

  .btn-ingresar,
  .btn-registrar {
    width: 100%;
  }

  .bottom-banner {
    font-size: 18px;
    padding: 15px 25px;
  }
}
</style>
