<template>
  <div class="reservar-cita-page">
    <main class="main-content">
      <h1 class="title">Reservar Cita</h1>
      <p class="subtitle">
        Puedes pagar el día de la cita o pagar en línea de manera segura e ir
        directamente al consultorio del médico. Además evitarás colas.
      </p>

      <!-- STEPPER / PROGRESS BAR -->
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
        <div class="step active">
          <div class="step-circle active"></div>
          <div class="step-line"></div>
        </div>
        <div class="step">
          <div class="step-circle"></div>
        </div>
      </div>

      <!-- LABEL DEL PASO ACTUAL -->
      <div class="step-label">
        <p>Paso 4: Confirmación de cita</p>
      </div>

      <!-- CONTENIDO PRINCIPAL -->
      <div class="content-wrapper">
        <!-- COLUMNA IZQUIERDA: DATOS DE LA CITA -->
        <div class="datos-cita">
          <h2 class="section-header">DATOS DE TU CITA</h2>

          <div class="dato-item verde">
            <span class="dato-label">Paciente</span>
            <span class="dato-valor">{{ datoCita.paciente }}</span>
          </div>

          <div class="dato-item blanco">
            <span class="dato-label">Especialidad</span>
            <span class="dato-valor">{{ datoCita.especialidad }}</span>
          </div>

          <div class="dato-item verde">
            <span class="dato-label">Medico</span>
            <span class="dato-valor">{{ datoCita.medico }}</span>
          </div>

          <div class="dato-item blanco">
            <span class="dato-label">Sede</span>
            <span class="dato-valor">{{ datoCita.sede }}</span>
          </div>

          <div class="dato-item verde">
            <span class="dato-label">Consultorio</span>
            <span class="dato-valor">{{ datoCita.consultorio }}</span>
          </div>

          <div class="dato-item blanco">
            <span class="dato-label">Dia y Hora</span>
            <span class="dato-valor">{{ datoCita.diaHora }}</span>
          </div>

          <div class="dato-item verde">
            <span class="dato-label">Modo de Atencion :</span>
          </div>
        </div>

        <!-- COLUMNA DERECHA: INFORMACIÓN DE PAGO -->
        <div class="info-pago">
          <h2 class="pago-title">
            ¡Paga en línea de manera fácil, rápida, segura y evita las colas!
          </h2>

          <p class="pago-texto">
            Si tienes tarjeta de débito o crédito Visa, Mastercard o Diners,
            puedes hacer la transferencia a través de nuestro sistema de pagos.
          </p>
          <p class="pago-texto-small">
            Si tienes alguna duda puedes ubicarnos
            <a href="#" class="link-aqui">aquí</a>
          </p>

          <div class="precio-container">
            <span class="precio-label">Precio</span>
            <span class="precio-valor">S/ {{ datoCita.precio }}</span>
          </div>

          <button class="btn-reserva-paga" @click="reservarYPagar">
            Reserva y paga ahora
          </button>
        </div>
      </div>

      <!-- BOTONES DE ACCIÓN -->
      <div class="action-buttons">
        <button class="btn-regresar" @click="regresarPaso3">Regresar</button>
        <button class="btn-continuar" @click="reservarDiaCita">
          Reserva y paga el día de la cita
        </button>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

// Datos de la cita (se cargarán del sessionStorage)
const datoCita = reactive({
  paciente: "",
  especialidad: "",
  medico: "",
  sede: "",
  consultorio: "",
  diaHora: "",
  precio: "",
});

onMounted(() => {
  // Obtener datos del paso 3
  const paso3Str = sessionStorage.getItem("datosPaso3");
  
  console.log("📦 Recuperando datos del paso 3...");
  console.log("   - sessionStorage datosPaso3:", paso3Str);
  
  if (paso3Str) {
    const datosPaso3 = JSON.parse(paso3Str);
    console.log("✅ Datos parseados:", datosPaso3);
    
    // Asignar los datos a datoCita
    datoCita.paciente = datosPaso3.paciente || "No disponible";
    datoCita.especialidad = datosPaso3.especialidad || "No disponible";
    datoCita.medico = datosPaso3.medico || "No disponible";
    datoCita.sede = datosPaso3.sede || "Sede Principal - Lima";
    datoCita.consultorio = datosPaso3.consultorio || "Consultorio 3B";
    datoCita.diaHora = datosPaso3.fechaHora || "No disponible";
    datoCita.precio = datosPaso3.precio || "132.00";
    
    console.log("✅ Datos del Paso 3 cargados correctamente:");
    console.log("   - Paciente:", datoCita.paciente);
    console.log("   - Especialidad:", datoCita.especialidad);
    console.log("   - Médico:", datoCita.medico);
    console.log("   - Sede:", datoCita.sede);
    console.log("   - Consultorio:", datoCita.consultorio);
    console.log("   - Día y Hora:", datoCita.diaHora);
    console.log("   - Precio:", datoCita.precio);
  } else {
    console.error("❌ No se encontraron datos del paso 3 en sessionStorage");
    alert("No se encontraron datos de la cita. Regresando al inicio...");
    router.push({ name: "ReservarCita" });
  }
});

function regresarPaso3() {
  router.push({ name: "ReservarCitaPaso3" });
}

function reservarYPagar() {
  console.log("💳 Reservar y pagar ahora");
  // Simular proceso de pago
  alert("Procesando pago...");
  setTimeout(() => {
    router.push({ name: "ReservarCitaPaso5" });
  }, 1000);
}

function reservarDiaCita() {
  console.log("📅 Reservar y pagar el día de la cita");
  // Ir directamente a confirmación
  router.push({ name: "ReservarCitaPaso5" });
}
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Caveat:wght@400;700&family=Patrick+Hand&display=swap");

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.reservar-cita-page {
  min-height: 100vh;
  background-color: #b8bdc4;
}

.main-content {
  padding: 50px 60px;
  max-width: 1400px;
  margin: 0 auto;
}

.title {
  font-family: "Caveat", cursive;
  font-size: clamp(38px, 6vw, 52px);
  font-weight: 700;
  text-align: center;
  margin-bottom: 15px;
  color: #2c2c2c;
}

.subtitle {
  font-family: "Patrick Hand", cursive;
  font-size: clamp(14px, 2vw, 16px);
  text-align: center;
  margin-bottom: 40px;
  color: #2c2c2c;
  line-height: 1.6;
  max-width: 1000px;
  margin-left: auto;
  margin-right: auto;
}

/* STEPPER */
.stepper {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  gap: 0;
}

.step {
  display: flex;
  align-items: center;
}

.step-circle {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #7a8088;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.step-circle.completed {
  background-color: #5bc9ab;
}

.step-circle.active {
  background-color: #7a8088;
  box-shadow: 0 0 0 4px rgba(122, 128, 136, 0.3);
}

.step-line {
  width: 120px;
  height: 4px;
  background-color: #7a8088;
  margin: 0 -2px;
}

.step-line.completed {
  background-color: #5bc9ab;
}

.step:last-child .step-line {
  display: none;
}

/* LABEL DEL PASO */
.step-label {
  background-color: #7a8088;
  color: white;
  border-radius: 15px;
  padding: 12px 30px;
  display: inline-block;
  margin-bottom: 40px;
  margin-left: 60px;
}

.step-label p {
  font-family: "Patrick Hand", cursive;
  font-size: 18px;
  font-weight: 600;
  margin: 0;
}

/* CONTENIDO PRINCIPAL */
.content-wrapper {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  margin-bottom: 40px;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
}

/* DATOS DE LA CITA */
.datos-cita {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.section-header {
  font-family: "Caveat", cursive;
  font-size: 28px;
  font-weight: 700;
  color: #2c2c2c;
  margin-bottom: 15px;
  text-align: left;
}

.dato-item {
  padding: 14px 20px;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2px;
  min-height: 50px;
}

.dato-item.verde {
  background-color: #5bc9ab;
}

.dato-item.blanco {
  background-color: rgba(255, 255, 255, 0.9);
}

.dato-label {
  font-family: "Patrick Hand", cursive;
  font-size: 16px;
  font-weight: 600;
  color: #2c2c2c;
}

.dato-valor {
  font-family: "Patrick Hand", cursive;
  font-size: 16px;
  color: #2c2c2c;
}

/* INFORMACIÓN DE PAGO */
.info-pago {
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
  justify-content: center;
}

.pago-title {
  font-family: "Caveat", cursive;
  font-size: 30px;
  font-weight: 700;
  color: #2c2c2c;
  text-align: center;
  line-height: 1.3;
}

.pago-texto {
  font-family: "Patrick Hand", cursive;
  font-size: 15px;
  color: #2c2c2c;
  text-align: center;
  line-height: 1.5;
}

.pago-texto-small {
  font-family: "Patrick Hand", cursive;
  font-size: 13px;
  color: #2c2c2c;
  text-align: center;
}

.link-aqui {
  color: #5bc9ab;
  text-decoration: underline;
  font-weight: 600;
}

.precio-container {
  display: flex;
  align-items: center;
  gap: 15px;
  margin: 10px 0;
}

.precio-label {
  font-family: "Caveat", cursive;
  font-size: 28px;
  font-weight: 700;
  color: #2c2c2c;
}

.precio-valor {
  font-family: "Caveat", cursive;
  font-size: 32px;
  font-weight: 700;
  color: #2c2c2c;
}

.btn-reserva-paga {
  background-color: #7a8088;
  color: white;
  border: none;
  border-radius: 15px;
  padding: 16px 35px;
  font-family: "Patrick Hand", cursive;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  margin-top: 10px;
}

.btn-reserva-paga:hover {
  background-color: #6a7078;
  transform: translateY(-2px);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.2);
}

/* BOTONES DE ACCIÓN */
.action-buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 30px;
}

.btn-regresar,
.btn-continuar {
  padding: 16px 30px;
  border: none;
  border-radius: 15px;
  font-family: "Patrick Hand", cursive;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.btn-regresar {
  background-color: rgba(255, 255, 255, 0.9);
  color: #2c2c2c;
  min-width: 150px;
}

.btn-regresar:hover {
  background-color: white;
  transform: translateY(-2px);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.2);
}

.btn-continuar {
  background-color: #7a8088;
  color: white;
  min-width: 280px;
}

.btn-continuar:hover {
  background-color: #6a7078;
  transform: translateY(-2px);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.2);
}

/* RESPONSIVE */
@media (max-width: 968px) {
  .content-wrapper {
    grid-template-columns: 1fr;
    gap: 30px;
  }

  .step-label {
    margin-left: 0;
    width: 100%;
    text-align: center;
  }

  .action-buttons {
    flex-direction: column;
    gap: 15px;
  }

  .btn-regresar,
  .btn-continuar {
    width: 100%;
    min-width: auto;
  }
}

@media (max-width: 768px) {
  .main-content {
    padding: 35px 25px;
  }

  .step-circle {
    width: 30px;
    height: 30px;
  }

  .step-line {
    width: 60px;
    height: 3px;
  }

  .dato-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
    padding: 12px 16px;
  }

  .pago-title {
    font-size: 26px;
  }

  .pago-texto {
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  .main-content {
    padding: 25px 15px;
  }

  .step-circle {
    width: 25px;
    height: 25px;
  }

  .step-line {
    width: 40px;
  }

  .step-label p {
    font-size: 15px;
  }

  .section-header {
    font-size: 24px;
  }

  .dato-label,
  .dato-valor {
    font-size: 14px;
  }

  .pago-title {
    font-size: 22px;
  }
}
</style>