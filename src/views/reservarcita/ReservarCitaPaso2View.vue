<template>
  <div class="reservar-cita-page">
    <main class="main-content">
      <h1 class="title">Reservar Cita</h1>
      <p class="subtitle">
        Selecciona con qué tipo de seguro cuentas y en qué especialidad deseas atenderte.
      </p>

      <!-- STEPPER / PROGRESS BAR -->
      <div class="stepper">
        <div class="step completed">
          <div class="step-circle completed"></div>
          <div class="step-line"></div>
        </div>
        <div class="step active">
          <div class="step-circle active"></div>
          <div class="step-line"></div>
        </div>
        <div class="step">
          <div class="step-circle"></div>
          <div class="step-line"></div>
        </div>
        <div class="step">
          <div class="step-circle"></div>
          <div class="step-line"></div>
        </div>
        <div class="step">
          <div class="step-circle"></div>
        </div>
      </div>

      <!-- LABEL DEL PASO ACTUAL -->
      <div class="step-label">
        <p>Paso 2: Seleccione Especialidad</p>
      </div>

      <!-- INFORMACIÓN DEL PACIENTE -->
      <div v-if="pacienteSeleccionado" class="paciente-info">
        <p>
          <strong>Paciente:</strong> 
          {{ pacienteSeleccionado.nombres }} 
          {{ pacienteSeleccionado.apellido_paterno }} 
          {{ pacienteSeleccionado.apellido_materno }}
          <span class="badge">{{ pacienteSeleccionado.tipo === 'titular' ? 'Titular' : 'Familiar' }}</span>
        </p>
      </div>

      <!-- LOADING SPINNER -->
      <div v-if="cargando" class="loading-container">
        <div class="spinner"></div>
        <p>Cargando especialidades...</p>
      </div>

      <!-- FORMULARIO -->
      <div v-else class="form-container">
        <!-- ¿CUENTA CON SEGURO? -->
        <div class="section">
          <h2 class="section-title">¿Cuenta con seguro?</h2>
          <div class="seguro-buttons">
            <button
              class="seguro-btn"
              :class="{ active: tieneSeguro === true }"
              @click="tieneSeguro = true"
            >
              SÍ, CUENTO CON SEGURO
            </button>
            <button
              class="seguro-btn"
              :class="{ active: tieneSeguro === false }"
              @click="tieneSeguro = false"
            >
              NO ESTOY ASEGURADO
            </button>
          </div>
        </div>

        <div class="divider"></div>

        <!-- ELIGE TU ESPECIALIDAD -->
        <div class="section">
          <h2 class="section-title-small">Elige tu Especialidad</h2>
          <div class="select-container">
            <select v-model="especialidadSeleccionada" class="custom-select">
              <option value="" disabled>SELECCIONE</option>
              <option 
                v-for="especialidad in especialidades" 
                :key="especialidad.id"
                :value="especialidad.id"
              >
                {{ especialidad.nombre }}
              </option>
            </select>
            <span class="select-icon">🖤</span>
          </div>
        </div>

        <!-- BOTONES DE ACCIÓN -->
        <div class="action-buttons">
          <button class="btn-regresar" @click="regresarPaso1">Regresar</button>
          <button
            class="btn-continuar"
            :disabled="!puedeContinuar"
            @click="continuarPaso3"
          >
            Continuar
          </button>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { especialidadService } from "../../services/especialidadService";

const router = useRouter();

// Estados del formulario
const cargando = ref(true);
const tieneSeguro = ref<boolean | null>(null);
const especialidadSeleccionada = ref("");
const especialidades = ref<any[]>([]);
const pacienteSeleccionado = ref<any>(null);

// Computed para habilitar el botón continuar
const puedeContinuar = computed(() => {
  return tieneSeguro.value !== null && especialidadSeleccionada.value !== "";
});

async function cargarDatos() {
  try {
    cargando.value = true;

    // Recuperar el paciente seleccionado del paso anterior
    const pacienteStr = sessionStorage.getItem("pacienteSeleccionado");
    if (pacienteStr) {
      pacienteSeleccionado.value = JSON.parse(pacienteStr);
      console.log("Paciente recuperado:", pacienteSeleccionado.value);
    } else {
      alert("No se encontró información del paciente. Regresando al paso 1...");
      router.push({ name: "ReservarCita" });
      return;
    }

    // Cargar especialidades
    const { data, error } = await especialidadService.obtenerEspecialidades();
    
    if (error) {
      console.error("Error al cargar especialidades:", error);
      alert("Error al cargar especialidades: " + error);
    } else {
      especialidades.value = data || [];
      console.log("Especialidades cargadas:", especialidades.value);
    }
  } catch (error) {
    console.error("Error al cargar datos:", error);
    alert("Error al cargar la información");
  } finally {
    cargando.value = false;
  }
}

function regresarPaso1() {
  router.push({ name: "ReservarCita" });
}

function continuarPaso3() {
  if (!puedeContinuar.value) {
    alert("Por favor completa todos los campos");
    return;
  }

  const datosPaso2 = {
    tieneSeguro: tieneSeguro.value,
    idEspecialidad: especialidadSeleccionada.value,
    nombreEspecialidad: especialidades.value.find(e => e.id === parseInt(especialidadSeleccionada.value))?.nombre
  };

  console.log("Datos del Paso 2:", datosPaso2);

  // Guardar los datos del paso 2
  sessionStorage.setItem("datosPaso2", JSON.stringify(datosPaso2));

  // Ir al paso 3
  router.push({ name: "ReservarCitaPaso3" });
}

onMounted(() => {
  cargarDatos();
});
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
  max-width: 1200px;
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
  font-size: clamp(15px, 2.5vw, 18px);
  text-align: center;
  margin-bottom: 40px;
  color: #2c2c2c;
  line-height: 1.6;
  max-width: 900px;
  margin-left: auto;
  margin-right: auto;
}

/* INFORMACIÓN DEL PACIENTE */
.paciente-info {
  background-color: rgba(91, 201, 171, 0.15);
  border: 2px solid #5bc9ab;
  border-radius: 15px;
  padding: 15px 25px;
  margin: 0 auto 30px;
  max-width: 950px;
  text-align: center;
}

.paciente-info p {
  font-family: "Patrick Hand", cursive;
  font-size: 18px;
  color: #2c2c2c;
  margin: 0;
}

.paciente-info strong {
  font-weight: 700;
}

.badge {
  display: inline-block;
  background-color: #5bc9ab;
  color: white;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  margin-left: 10px;
}

/* LOADING */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 60px 20px;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 5px solid rgba(91, 201, 171, 0.3);
  border-top-color: #5bc9ab;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-container p {
  font-family: "Patrick Hand", cursive;
  font-size: 18px;
  color: #2c2c2c;
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
  background-color: #5bc9ab;
  box-shadow: 0 0 0 4px rgba(91, 201, 171, 0.3);
}

.step-line {
  width: 120px;
  height: 4px;
  background-color: #7a8088;
  margin: 0 -2px;
}

.step.completed .step-line {
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

/* FORMULARIO */
.form-container {
  max-width: 950px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.section-title {
  font-family: "Caveat", cursive;
  font-size: 36px;
  font-weight: 700;
  color: #2c2c2c;
  text-align: center;
  margin-bottom: 10px;
}

.section-title-small {
  font-family: "Caveat", cursive;
  font-size: 32px;
  font-weight: 700;
  color: #2c2c2c;
  text-align: center;
  margin-bottom: 5px;
}

/* BOTONES DE SEGURO */
.seguro-buttons {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.seguro-btn {
  padding: 20px 30px;
  border: none;
  border-radius: 15px;
  background-color: rgba(255, 255, 255, 0.9);
  font-family: "Patrick Hand", cursive;
  font-size: 16px;
  font-weight: 600;
  color: #2c2c2c;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
  font-style: italic;
}

.seguro-btn:hover {
  background-color: white;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
}

.seguro-btn.active {
  background-color: #5bc9ab;
  color: white;
  box-shadow: 0 5px 15px rgba(91, 201, 171, 0.4);
}

/* DIVIDER */
.divider {
  width: 100%;
  height: 2px;
  background-color: rgba(0, 0, 0, 0.15);
  margin: 10px 0;
}

/* SELECT PERSONALIZADO */
.select-container {
  position: relative;
  width: 100%;
}

.custom-select {
  width: 100%;
  padding: 18px 55px 18px 25px;
  border: 3px solid #5bc9ab;
  border-radius: 15px;
  background-color: rgba(255, 255, 255, 0.9);
  font-family: "Patrick Hand", cursive;
  font-size: 18px;
  color: #2c2c2c;
  cursor: pointer;
  appearance: none;
  transition: all 0.3s ease;
  font-style: italic;
}

.custom-select:focus {
  outline: none;
  box-shadow: 0 4px 15px rgba(91, 201, 171, 0.3);
  background-color: white;
}

.select-icon {
  position: absolute;
  right: 25px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 24px;
  pointer-events: none;
}

/* BOTONES DE ACCIÓN */
.action-buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
}

.btn-regresar,
.btn-continuar {
  padding: 16px 40px;
  border: none;
  border-radius: 15px;
  font-family: "Patrick Hand", cursive;
  font-size: 20px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  min-width: 180px;
}

.btn-regresar {
  background-color: rgba(255, 255, 255, 0.9);
  color: #2c2c2c;
}

.btn-regresar:hover {
  background-color: white;
  transform: translateY(-2px);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.2);
}

.btn-continuar {
  background-color: #7a8088;
  color: white;
}

.btn-continuar:hover:not(:disabled) {
  background-color: #6a7078;
  transform: translateY(-2px);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.2);
}

.btn-continuar:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* RESPONSIVE */
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

  .step-label {
    margin-left: 0;
    width: 100%;
    text-align: center;
  }

  .paciente-info p {
    font-size: 16px;
  }

  .badge {
    font-size: 12px;
    padding: 3px 10px;
  }

  .seguro-buttons {
    grid-template-columns: 1fr;
    gap: 15px;
  }

  .seguro-btn {
    font-size: 14px;
    padding: 16px 20px;
  }

  .section-title {
    font-size: 30px;
  }

  .section-title-small {
    font-size: 26px;
  }

  .custom-select {
    font-size: 16px;
    padding: 15px 50px 15px 20px;
  }

  .action-buttons {
    flex-direction: column;
    gap: 15px;
  }

  .btn-regresar,
  .btn-continuar {
    width: 100%;
    font-size: 18px;
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

  .section-title {
    font-size: 26px;
  }

  .section-title-small {
    font-size: 24px;
  }

  .custom-select {
    font-size: 15px;
  }
}
</style>