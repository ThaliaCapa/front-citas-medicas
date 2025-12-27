<template>
  <div class="confirmacion-page">
    <main class="main-content">
      <!-- ÍCONO DE ÉXITO -->
      <div class="success-icon">
        <div class="checkmark-circle">
          <svg class="checkmark" viewBox="0 0 52 52">
            <circle
              class="checkmark-circle-bg"
              cx="26"
              cy="26"
              r="25"
              fill="none"
            />
            <path
              class="checkmark-check"
              fill="none"
              d="M14.1 27.2l7.1 7.2 16.7-16.8"
            />
          </svg>
        </div>
      </div>

      <!-- TÍTULO -->
      <h1 class="title">¡Cita Reservada Exitosamente!</h1>

      <!-- MENSAJE -->
      <p class="mensaje">
        Tu cita ha sido confirmada. Hemos enviado los detalles a tu correo
        electrónico.
      </p>

      <!-- STEPPER COMPLETO -->
      <div class="stepper">
        <div class="step completed">
          <div class="step-circle completed"></div>
          <div class="step-line completed"></div>
        </div>
        <div class="step completed">
          <div class="step-circle completed"></div>
          <div class="step-line completed"></div>
        </div>
        <div class="step completed">
          <div class="step-circle completed"></div>
          <div class="step-line completed"></div>
        </div>
        <div class="step completed">
          <div class="step-circle completed"></div>
          <div class="step-line completed"></div>
        </div>
        <div class="step completed">
          <div class="step-circle completed"></div>
        </div>
      </div>

      <!-- RESUMEN DE LA CITA -->
      <div class="resumen-container">
        <h2 class="resumen-title">Resumen de tu Cita</h2>

        <div class="resumen-content">
          <div class="resumen-item">
            <span class="resumen-label">📋 Paciente:</span>
            <span class="resumen-valor">{{ citaData.paciente }}</span>
          </div>

          <div class="resumen-item">
            <span class="resumen-label">🏥 Especialidad:</span>
            <span class="resumen-valor">{{ citaData.especialidad }}</span>
          </div>

          <div class="resumen-item">
            <span class="resumen-label">👨‍⚕️ Médico:</span>
            <span class="resumen-valor">{{ citaData.medico }}</span>
          </div>

          <div class="resumen-item">
            <span class="resumen-label">📍 Sede:</span>
            <span class="resumen-valor">{{ citaData.sede }}</span>
          </div>

          <div class="resumen-item">
            <span class="resumen-label">🚪 Consultorio:</span>
            <span class="resumen-valor">{{ citaData.consultorio }}</span>
          </div>

          <div class="resumen-item destacado">
            <span class="resumen-label">📅 Fecha y Hora:</span>
            <span class="resumen-valor">{{ citaData.fechaHora }}</span>
          </div>

          <div class="resumen-item destacado">
            <span class="resumen-label">💰 Precio:</span>
            <span class="resumen-valor">S/ {{ citaData.precio }}</span>
          </div>

          <div class="resumen-item estado">
            <span class="resumen-label">✅ Estado:</span>
            <span class="resumen-valor estado-confirmado">{{
              citaData.estado
            }}</span>
          </div>
        </div>
      </div>

      <!-- INFORMACIÓN ADICIONAL -->
      <div class="info-box">
        <h3 class="info-title">📌 Información Importante</h3>
        <ul class="info-list">
          <li>Por favor, llega 15 minutos antes de tu cita</li>
          <li>Recuerda traer tu documento de identidad</li>
          <li>Si tienes seguro, trae tu tarjeta de asegurado</li>
          <li>
            Puedes reprogramar o cancelar tu cita con 24 horas de anticipación
          </li>
        </ul>
      </div>

      <!-- BOTONES DE ACCIÓN -->
      <div class="action-buttons">
        <button class="btn-descargar" @click="descargarComprobante">
          📄 Descargar Comprobante
        </button>
        <button class="btn-perfil" @click="irAPerfil">👤 Ir a Mi Perfil</button>
        <button class="btn-inicio" @click="irAInicio">
          🏠 Volver al Inicio
        </button>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

// Datos de la cita confirmada
const citaData = reactive({
  paciente: "Juan Pérez",
  especialidad: "Medicina General",
  medico: "Dr. García López",
  sede: "Sede Principal - Lima",
  consultorio: "Consultorio 3B",
  fechaHora: "15/12/2024 - 10:00 AM",
  precio: "132.00",
  estado: "CONFIRMADA",
});

function descargarComprobante() {
  console.log("Descargar comprobante");
  alert("Descargando comprobante en PDF...");
  // Aquí iría la lógica para generar y descargar el PDF
}

function irAPerfil() {
  router.push({ name: "MiPerfil" });
}

function irAInicio() {
  router.push({ name: "Inicio" });
}
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Caveat:wght@400;700&family=Patrick+Hand&display=swap");

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.confirmacion-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #b8bdc4 0%, #a8b0b8 100%);
  padding: 40px 20px;
}

.main-content {
  max-width: 900px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;
}

/* ÍCONO DE ÉXITO */
.success-icon {
  margin-bottom: 10px;
  animation: scaleIn 0.6s ease-out;
}

@keyframes scaleIn {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.checkmark-circle {
  width: 120px;
  height: 120px;
  position: relative;
}

.checkmark {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  display: block;
  stroke-width: 3;
  stroke: #5bc9ab;
  stroke-miterlimit: 10;
  box-shadow: inset 0 0 0 #5bc9ab;
  animation: fill 0.4s ease-in-out 0.4s forwards,
    scale 0.3s ease-in-out 0.9s both;
}

.checkmark-circle-bg {
  stroke-dasharray: 166;
  stroke-dashoffset: 166;
  stroke-width: 3;
  stroke-miterlimit: 10;
  stroke: #5bc9ab;
  fill: white;
  animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
}

.checkmark-check {
  transform-origin: 50% 50%;
  stroke-dasharray: 48;
  stroke-dashoffset: 48;
  stroke: #5bc9ab;
  stroke-width: 4;
  animation: stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards;
}

@keyframes stroke {
  100% {
    stroke-dashoffset: 0;
  }
}

@keyframes fill {
  100% {
    box-shadow: inset 0 0 0 60px #5bc9ab;
  }
}

/* TÍTULO Y MENSAJE */
.title {
  font-family: "Caveat", cursive;
  font-size: clamp(36px, 5vw, 48px);
  font-weight: 700;
  color: #2c2c2c;
  text-align: center;
  animation: fadeInUp 0.8s ease-out 0.3s both;
}

.mensaje {
  font-family: "Patrick Hand", cursive;
  font-size: clamp(16px, 2vw, 20px);
  color: #2c2c2c;
  text-align: center;
  max-width: 600px;
  line-height: 1.6;
  animation: fadeInUp 0.8s ease-out 0.5s both;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* STEPPER */
.stepper {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0;
  margin: 20px 0;
  animation: fadeInUp 0.8s ease-out 0.7s both;
}

.step {
  display: flex;
  align-items: center;
}

.step-circle {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  background-color: #5bc9ab;
  flex-shrink: 0;
}

.step-line {
  width: 80px;
  height: 4px;
  background-color: #5bc9ab;
  margin: 0 -2px;
}

.step:last-child .step-line {
  display: none;
}

/* RESUMEN */
.resumen-container {
  width: 100%;
  background: white;
  border-radius: 20px;
  padding: 35px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  animation: fadeInUp 0.8s ease-out 0.9s both;
}

.resumen-title {
  font-family: "Caveat", cursive;
  font-size: 32px;
  font-weight: 700;
  color: #2c2c2c;
  margin-bottom: 25px;
  text-align: center;
}

.resumen-content {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.resumen-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background-color: #f8f9fa;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.resumen-item:hover {
  background-color: #e9ecef;
  transform: translateX(5px);
}

.resumen-item.destacado {
  background-color: #5bc9ab;
  color: white;
}

.resumen-item.destacado .resumen-label,
.resumen-item.destacado .resumen-valor {
  color: white;
  font-weight: 700;
}

.resumen-item.estado {
  background-color: #d4edda;
  border: 2px solid #5bc9ab;
}

.resumen-label {
  font-family: "Patrick Hand", cursive;
  font-size: 17px;
  font-weight: 600;
  color: #2c2c2c;
}

.resumen-valor {
  font-family: "Patrick Hand", cursive;
  font-size: 17px;
  color: #2c2c2c;
}

.estado-confirmado {
  color: #155724;
  font-weight: 700;
}

/* INFO BOX */
.info-box {
  width: 100%;
  background: #fff3cd;
  border: 2px solid #ffc107;
  border-radius: 15px;
  padding: 25px;
  animation: fadeInUp 0.8s ease-out 1.1s both;
}

.info-title {
  font-family: "Caveat", cursive;
  font-size: 26px;
  font-weight: 700;
  color: #856404;
  margin-bottom: 15px;
}

.info-list {
  font-family: "Patrick Hand", cursive;
  font-size: 16px;
  color: #856404;
  list-style-position: inside;
  line-height: 1.8;
}

.info-list li {
  margin-bottom: 8px;
}

/* BOTONES */
.action-buttons {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
  justify-content: center;
  width: 100%;
  animation: fadeInUp 0.8s ease-out 1.3s both;
}

.btn-descargar,
.btn-perfil,
.btn-inicio {
  padding: 16px 30px;
  border: none;
  border-radius: 15px;
  font-family: "Patrick Hand", cursive;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  flex: 1;
  min-width: 200px;
}

.btn-descargar {
  background-color: #5bc9ab;
  color: white;
}

.btn-descargar:hover {
  background-color: #4ab89a;
  transform: translateY(-2px);
  box-shadow: 0 6px 18px rgba(91, 201, 171, 0.4);
}

.btn-perfil {
  background-color: #7a8088;
  color: white;
}

.btn-perfil:hover {
  background-color: #6a7078;
  transform: translateY(-2px);
  box-shadow: 0 6px 18px rgba(122, 128, 136, 0.4);
}

.btn-inicio {
  background-color: white;
  color: #2c2c2c;
  border: 2px solid #7a8088;
}

.btn-inicio:hover {
  background-color: #f8f9fa;
  transform: translateY(-2px);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.2);
}

/* RESPONSIVE */
@media (max-width: 768px) {
  .confirmacion-page {
    padding: 30px 15px;
  }

  .resumen-container {
    padding: 25px 20px;
  }

  .resumen-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .action-buttons {
    flex-direction: column;
  }

  .btn-descargar,
  .btn-perfil,
  .btn-inicio {
    width: 100%;
    min-width: auto;
  }

  .step-circle {
    width: 28px;
    height: 28px;
  }

  .step-line {
    width: 50px;
  }
}

@media (max-width: 480px) {
  .checkmark-circle {
    width: 90px;
    height: 90px;
  }

  .checkmark {
    width: 90px;
    height: 90px;
  }

  .resumen-title {
    font-size: 26px;
  }

  .info-title {
    font-size: 22px;
  }

  .info-list {
    font-size: 14px;
  }
}
</style>
