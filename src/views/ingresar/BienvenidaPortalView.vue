<template>
  <div class="bienvenida-page">
    <div class="content-container">
      <!-- COLUMNA IZQUIERDA: Tarjeta de Bienvenida -->
      <div class="welcome-card">
        <div class="logo-section">
          <div class="logo-icon">🏥</div>
          <div class="logo-text">
            <span class="logo-main">Tópico</span>
            <span class="logo-subtitle">Los Ángeles</span>
          </div>
        </div>

        <h1 class="title">Bienvenido al Portal</h1>

        <p class="description">
          Somos la Red de Clínicas San Pablo, contamos con un staff médico
          especializado y tecnología avanzada, con procesos de seguridad y
          calidad en la atención de cada paciente.
        </p>

        <div class="button-group">
          <button class="btn-ingresar" @click="irAIngresar">Ingresar</button>
          <button class="btn-registrar" @click="irARegistrar">Registrar</button>
        </div>

        <div class="info-box">
          <p class="info-text">
            Si eres nuevo, regístrate y podrás gozar de todos los beneficios.
          </p>
        </div>
      </div>

      <!-- COLUMNA DERECHA: Imagen del doctor -->
      <div class="image-section">
        <img
          src="https://st4.depositphotos.com/1325771/39154/i/450/depositphotos_391545206-stock-photo-happy-male-medical-doctor-portrait.jpg"
          alt="Doctor"
          class="doctor-image"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();

function irAIngresar() {
  router.push({ name: "Ingresar" });
}

function irARegistrar() {
  router.push({ name: "Registro" });
}
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Caveat:wght@400;700&family=Patrick+Hand&display=swap");

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.bienvenida-page {
  min-height: 100vh;
  background-color: #b8bdc4;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
}

.content-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  max-width: 1400px;
  width: 100%;
  align-items: center;
}

/* TARJETA DE BIENVENIDA */
.welcome-card {
  background-color: rgba(255, 255, 255, 0.95);
  border-radius: 30px;
  padding: 50px 45px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.logo-section {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 10px;
}

.logo-icon {
  font-size: 50px;
}

.logo-text {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
}

.logo-main {
  font-family: Arial, sans-serif;
  font-size: 24px;
  font-weight: 600;
  color: #2c2c2c;
}

.logo-subtitle {
  font-family: Arial, sans-serif;
  font-size: 12px;
  color: #666;
}

.title {
  font-family: "Caveat", cursive;
  font-size: 42px;
  font-weight: 700;
  color: #2c2c2c;
  margin-bottom: 10px;
}

.description {
  font-family: "Patrick Hand", cursive;
  font-size: 17px;
  color: #2c2c2c;
  line-height: 1.6;
  margin-bottom: 10px;
}

.button-group {
  display: flex;
  gap: 20px;
  margin-top: 10px;
}

.btn-ingresar,
.btn-registrar {
  flex: 1;
  padding: 16px 30px;
  border: none;
  border-radius: 15px;
  font-family: "Patrick Hand", cursive;
  font-size: 20px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.btn-ingresar {
  background-color: #7a8088;
  color: white;
}

.btn-ingresar:hover {
  background-color: #6a7078;
  transform: translateY(-2px);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.2);
}

.btn-registrar {
  background-color: #5bc9ab;
  color: #2c2c2c;
}

.btn-registrar:hover {
  background-color: #4ab89a;
  transform: translateY(-2px);
  box-shadow: 0 6px 18px rgba(91, 201, 171, 0.4);
}

.info-box {
  background-color: #5bc9ab;
  border-radius: 15px;
  padding: 20px 25px;
  margin-top: 10px;
}

.info-text {
  font-family: "Patrick Hand", cursive;
  font-size: 17px;
  color: #2c2c2c;
  font-weight: 600;
  text-align: center;
  line-height: 1.5;
}

/* IMAGEN DEL DOCTOR */
.image-section {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.doctor-image {
  width: 100%;
  height: 550px;
  object-fit: cover;
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
}

/* RESPONSIVE */
@media (max-width: 1024px) {
  .content-container {
    grid-template-columns: 1fr;
    gap: 30px;
  }

  .doctor-image {
    height: 400px;
  }

  .welcome-card {
    padding: 40px 35px;
  }
}

@media (max-width: 768px) {
  .bienvenida-page {
    padding: 30px 15px;
  }

  .welcome-card {
    padding: 35px 30px;
    gap: 20px;
  }

  .title {
    font-size: 36px;
  }

  .description {
    font-size: 16px;
  }

  .button-group {
    flex-direction: column;
    gap: 15px;
  }

  .doctor-image {
    height: 300px;
  }
}

@media (max-width: 480px) {
  .welcome-card {
    padding: 30px 25px;
  }

  .title {
    font-size: 32px;
  }

  .description {
    font-size: 15px;
  }

  .btn-ingresar,
  .btn-registrar {
    font-size: 18px;
    padding: 14px 25px;
  }

  .info-text {
    font-size: 15px;
  }
}
</style>
