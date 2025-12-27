<template>
  <div class="reservar-cita-page">
    <main class="main-content">
      <h1 class="title">Reservar Cita</h1>
      <p class="subtitle">
        ¡Es muy fácil! Puedes reservar tu cita buscando por médico o por fecha.
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
        </div>
      </div>

      <!-- LABEL DEL PASO ACTUAL -->
      <div class="step-label">
        <p>Paso 3: Seleccione Medico</p>
      </div>

      <!-- FORMULARIO -->
      <div class="form-container">
        <!-- SELECCIONAR CRITERIO DE BÚSQUEDA -->
        <div class="section">
          <h2 class="section-title">Seleccionar criterio de búsqueda</h2>

          <div class="criterio-buttons">
            <button
              class="criterio-btn"
              :class="{ active: criterioBusqueda === 'medico' }"
              @click="criterioBusqueda = 'medico'"
            >
              Buscar por Medico
            </button>
            <button
              class="criterio-btn"
              :class="{ active: criterioBusqueda === 'fecha' }"
              @click="criterioBusqueda = 'fecha'"
            >
              Buscar por Fecha
            </button>
          </div>
        </div>

        <!-- BOTONES DE ACCIÓN -->
        <div class="action-buttons">
          <button class="btn-regresar" @click="regresarPaso2">Regresar</button>
          <button
            class="btn-continuar"
            :disabled="!criterioBusqueda"
            @click="continuarPaso4"
          >
            Continuar
          </button>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

// Estado del formulario
const criterioBusqueda = ref<"medico" | "fecha" | null>(null);

function regresarPaso2() {
  router.push({ name: "ReservarCitaPaso2" });
}

function continuarPaso4() {
  if (!criterioBusqueda.value) {
    alert("Por favor selecciona un criterio de búsqueda");
    return;
  }

  console.log("Criterio seleccionado:", criterioBusqueda.value);

  // Aquí irías al paso 4
  router.push({ name: "ReservarCitaPaso4" });
  alert(`Ir al Paso 4 - Búsqueda por ${criterioBusqueda.value}`);
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
  margin-bottom: 60px;
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
  max-width: 1100px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 50px;
}

.section {
  display: flex;
  flex-direction: column;
  gap: 30px;
  align-items: center;
}

.section-title {
  font-family: "Caveat", cursive;
  font-size: 38px;
  font-weight: 700;
  color: #2c2c2c;
  text-align: center;
}

/* BOTONES DE CRITERIO */
.criterio-buttons {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  max-width: 1100px;
}

.criterio-btn {
  padding: 22px 40px;
  border: 3px solid #5bc9ab;
  border-radius: 15px;
  background-color: rgba(255, 255, 255, 0.95);
  font-family: "Patrick Hand", cursive;
  font-size: 20px;
  font-weight: 600;
  color: #2c2c2c;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.criterio-btn:hover {
  background-color: white;
  transform: translateX(5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
}

.criterio-btn.active {
  background-color: #5bc9ab;
  color: white;
  border-color: #5bc9ab;
  box-shadow: 0 5px 15px rgba(91, 201, 171, 0.4);
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

  .stepper {
    gap: 0;
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

  .section-title {
    font-size: 32px;
  }

  .criterio-btn {
    font-size: 18px;
    padding: 18px 30px;
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
    font-size: 28px;
  }

  .criterio-btn {
    font-size: 16px;
    padding: 16px 25px;
  }
}
</style>
