<template>
  <div class="reservar-cita-page">
    <!-- CONTENIDO PRINCIPAL -->
    <main class="main-content">
      <h1 class="title">Reservar Cita</h1>
      <p class="subtitle">
        Reserva tu Cita o la de tu familiar haciendo click en su nombre.
      </p>

      <!-- STEPPER / PROGRESS BAR -->
      <div class="stepper">
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
          <div class="step-line"></div>
        </div>
        <div class="step">
          <div class="step-circle"></div>
        </div>
      </div>

      <!-- LABEL DEL PASO ACTUAL -->
      <div class="step-label">
        <p>Paso 1: Seleccione paciente</p>
      </div>

      <!-- LOADING SPINNER -->
      <div v-if="cargando" class="loading-container">
        <div class="spinner"></div>
        <p>Cargando información...</p>
      </div>

      <!-- FORMULARIO -->
      <div v-else class="form-container">
        <!-- TITULAR -->
        <div class="section">
          <h2 class="section-title">Titular</h2>
          <button
            class="titular-btn"
            :class="{ selected: pacienteSeleccionado?.id === usuarioActual?.id }"
            @click="seleccionarTitular"
          >
            {{ nombreCompletoTitular }}
          </button>
        </div>

        <!-- FAMILIAR -->
        <div class="section">
          <h2 class="section-title">Familiar</h2>
          
          <!-- Botón para registrar familiares -->
          <button class="btn-registrar-familiar" @click="mostrarModalRegistro = true">
            ➕ Registrar familiar
          </button>

          <!-- LISTA DE FAMILIARES -->
          <div v-if="familiares.length > 0" class="familiares-list">
            <button
              v-for="familiar in familiares"
              :key="familiar.id"
              class="familiar-btn"
              :class="{ selected: pacienteSeleccionado?.id === familiar.id }"
              @click="seleccionarFamiliar(familiar)"
            >
              {{ familiar.nombres }} {{ familiar.apellido_paterno }} {{ familiar.apellido_materno }}
            </button>
          </div>
          
          <p v-else class="no-familiares">
            No tienes familiares registrados. Haz clic en "Registrar familiar" para agregar uno.
          </p>

          <!-- BOTÓN CONTINUAR -->
          <button 
            class="btn-continuar" 
            :disabled="!pacienteSeleccionado"
            @click="continuarPaso2"
          >
            Continuar
          </button>
        </div>
      </div>

      <!-- MODAL PARA REGISTRAR FAMILIAR -->
      <div v-if="mostrarModalRegistro" class="modal-overlay" @click.self="cerrarModal">
        <div class="modal-content">
          <div class="modal-header">
            <h2>Registrar Familiar</h2>
            <button class="btn-cerrar" @click="cerrarModal">✕</button>
          </div>
          
          <form @submit.prevent="guardarFamiliar" class="modal-form">
            <div class="form-group">
              <label>Tipo de Documento</label>
              <select v-model="nuevoFamiliar.idtipodocumento" required>
                <option value="">Seleccione</option>
                <option value="1">DNI</option>
                <option value="2">Carnet de Extranjería</option>
                <option value="3">Pasaporte</option>
              </select>
            </div>

            <div class="form-group">
              <label>Número de Documento</label>
              <input 
                type="text" 
                v-model="nuevoFamiliar.numero_documento"
                placeholder="Ej: 12345678"
                required
              />
            </div>

            <div class="form-group">
              <label>Nombres</label>
              <input 
                type="text" 
                v-model="nuevoFamiliar.nombres"
                placeholder="Ej: Juan Carlos"
                required
              />
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Apellido Paterno</label>
                <input 
                  type="text" 
                  v-model="nuevoFamiliar.apellido_paterno"
                  placeholder="Ej: García"
                  required
                />
              </div>

              <div class="form-group">
                <label>Apellido Materno</label>
                <input 
                  type="text" 
                  v-model="nuevoFamiliar.apellido_materno"
                  placeholder="Ej: López"
                  required
                />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Fecha de Nacimiento</label>
                <input 
                  type="date" 
                  v-model="nuevoFamiliar.fecha_nacimiento"
                  required
                />
              </div>

              <div class="form-group">
                <label>Género</label>
                <select v-model="nuevoFamiliar.genero" required>
                  <option value="">Seleccione</option>
                  <option value="M">Masculino</option>
                  <option value="F">Femenino</option>
                </select>
              </div>
            </div>

            <div class="form-group">
              <label>Teléfono (opcional)</label>
              <input 
                type="tel" 
                v-model="nuevoFamiliar.telefono"
                placeholder="Ej: 987654321"
              />
            </div>

            <div class="modal-actions">
              <button type="button" class="btn-cancelar" @click="cerrarModal">
                Cancelar
              </button>
              <button type="submit" class="btn-guardar" :disabled="guardando">
                {{ guardando ? 'Guardando...' : 'Guardar' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { authService } from "../../services/authService";
import { familiarService, type Familiar } from "../../services/familiarService";

const router = useRouter();

// Estados
const cargando = ref(true);
const guardando = ref(false);
const mostrarModalRegistro = ref(false);
const usuarioActual = ref<any>(null);
const familiares = ref<Familiar[]>([]);
const pacienteSeleccionado = ref<any>(null);

// Formulario de nuevo familiar
const nuevoFamiliar = ref({
  numero_documento: "",
  apellido_paterno: "",
  apellido_materno: "",
  nombres: "",
  fecha_nacimiento: "",
  telefono: "",
  genero: "",
  idtipodocumento: "",
  idrol: 3, // Rol de Familiar
  idtitular: 0, // Se asignará dinámicamente
});

// Computed
const nombreCompletoTitular = computed(() => {
  if (!usuarioActual.value?.persona) return "Cargando...";
  const p = usuarioActual.value.persona;
  return `${p.nombres} ${p.apellido_paterno} ${p.apellido_materno}`;
});

// Funciones
async function cargarDatos() {
  try {
    cargando.value = true;
    
    // Obtener usuario actual
    usuarioActual.value = authService.getUsuarioActual();
    
    if (!usuarioActual.value || !usuarioActual.value.persona) {
      alert("No se pudo obtener la información del usuario. Por favor, inicia sesión nuevamente.");
      router.push({ name: "Login" });
      return;
    }

    console.log("Usuario actual:", usuarioActual.value);

    // Obtener familiares
    const idTitular = usuarioActual.value.persona.id;
    const { data, error } = await familiarService.obtenerFamiliares(idTitular);

    if (error) {
      console.error("Error al cargar familiares:", error);
      alert("Error al cargar familiares: " + error);
    } else {
      familiares.value = data || [];
      console.log("Familiares cargados:", familiares.value);
    }
  } catch (error) {
    console.error("Error al cargar datos:", error);
    alert("Error al cargar la información");
  } finally {
    cargando.value = false;
  }
}

function seleccionarTitular() {
  pacienteSeleccionado.value = {
    id: usuarioActual.value.persona.id,
    tipo: "titular",
    ...usuarioActual.value.persona
  };
  console.log("Titular seleccionado:", pacienteSeleccionado.value);
}

function seleccionarFamiliar(familiar: Familiar) {
  pacienteSeleccionado.value = {
    ...familiar,
    tipo: "familiar"
  };
  console.log("Familiar seleccionado:", pacienteSeleccionado.value);
}

async function guardarFamiliar() {
  try {
    guardando.value = true;

    // Asignar el ID del titular
    nuevoFamiliar.value.idtitular = usuarioActual.value.persona.id;

    console.log("Guardando familiar:", nuevoFamiliar.value);

    const { data, error } = await familiarService.registrarFamiliar(nuevoFamiliar.value);

    if (error) {
      alert("Error al registrar familiar: " + error);
      return;
    }

    alert("Familiar registrado exitosamente");
    
    // Recargar la lista de familiares
    await cargarDatos();
    
    // Cerrar modal y limpiar formulario
    cerrarModal();
  } catch (error) {
    console.error("Error al guardar familiar:", error);
    alert("Error al guardar familiar");
  } finally {
    guardando.value = false;
  }
}

function cerrarModal() {
  mostrarModalRegistro.value = false;
  // Limpiar formulario
  nuevoFamiliar.value = {
    numero_documento: "",
    apellido_paterno: "",
    apellido_materno: "",
    nombres: "",
    fecha_nacimiento: "",
    telefono: "",
    genero: "",
    idtipodocumento: "",
    idrol: 3,
    idtitular: 0,
  };
}

function continuarPaso2() {
  if (!pacienteSeleccionado.value) {
    alert("Por favor selecciona un paciente");
    return;
  }

  console.log("Continuar al paso 2 con paciente:", pacienteSeleccionado.value);
  
  // Guardar el paciente seleccionado para usarlo en el siguiente paso
  sessionStorage.setItem("pacienteSeleccionado", JSON.stringify(pacienteSeleccionado.value));
  
  router.push({ name: "ReservarCitaPaso2" });
}

// Cargar datos al montar el componente
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
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.section {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.section-title {
  font-family: "Caveat", cursive;
  font-size: 32px;
  font-weight: 700;
  color: #2c2c2c;
  text-align: center;
  margin-bottom: 5px;
}

/* BOTÓN TITULAR */
.titular-btn {
  width: 100%;
  padding: 18px 25px;
  border: 2px solid #5bc9ab;
  border-radius: 15px;
  background-color: rgba(255, 255, 255, 0.9);
  font-family: "Patrick Hand", cursive;
  font-size: 18px;
  color: #2c2c2c;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
  font-weight: 600;
}

.titular-btn:hover {
  background-color: #5bc9ab;
  color: white;
  transform: scale(1.02);
}

.titular-btn.selected {
  background-color: #5bc9ab;
  color: white;
  box-shadow: 0 5px 15px rgba(91, 201, 171, 0.4);
}

/* BOTÓN REGISTRAR FAMILIAR */
.btn-registrar-familiar {
  padding: 14px 25px;
  border: 2px dashed #5bc9ab;
  border-radius: 12px;
  background-color: transparent;
  font-family: "Patrick Hand", cursive;
  font-size: 16px;
  color: #5bc9ab;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
}

.btn-registrar-familiar:hover {
  background-color: rgba(91, 201, 171, 0.1);
  transform: translateY(-2px);
}

/* NO FAMILIARES */
.no-familiares {
  font-family: "Patrick Hand", cursive;
  font-size: 16px;
  color: #666;
  text-align: center;
  padding: 20px;
  font-style: italic;
}

/* FAMILIARES LIST */
.familiares-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
}

.familiar-btn {
  padding: 16px 25px;
  border: 2px solid #5bc9ab;
  border-radius: 12px;
  background-color: rgba(255, 255, 255, 0.9);
  font-family: "Patrick Hand", cursive;
  font-size: 18px;
  color: #2c2c2c;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;
}

.familiar-btn:hover {
  background-color: #5bc9ab;
  color: white;
  transform: translateX(5px);
}

.familiar-btn.selected {
  background-color: #5bc9ab;
  color: white;
  box-shadow: 0 5px 15px rgba(91, 201, 171, 0.4);
}

/* BOTÓN CONTINUAR */
.btn-continuar {
  background-color: #7a8088;
  color: white;
  border: none;
  border-radius: 15px;
  padding: 16px 40px;
  font-family: "Patrick Hand", cursive;
  font-size: 20px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  align-self: center;
  min-width: 200px;
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

/* MODAL */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-content {
  background-color: white;
  border-radius: 20px;
  padding: 30px;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}

.modal-header h2 {
  font-family: "Caveat", cursive;
  font-size: 32px;
  color: #2c2c2c;
  margin: 0;
}

.btn-cerrar {
  background: none;
  border: none;
  font-size: 28px;
  cursor: pointer;
  color: #666;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.btn-cerrar:hover {
  color: #2c2c2c;
  transform: rotate(90deg);
}

/* FORMULARIO MODAL */
.modal-form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

.form-group label {
  font-family: "Patrick Hand", cursive;
  font-size: 16px;
  color: #2c2c2c;
  font-weight: 600;
}

.form-group input,
.form-group select {
  padding: 12px 18px;
  border: 2px solid #ddd;
  border-radius: 10px;
  font-family: "Patrick Hand", cursive;
  font-size: 16px;
  color: #2c2c2c;
  transition: all 0.3s ease;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #5bc9ab;
  box-shadow: 0 0 0 3px rgba(91, 201, 171, 0.2);
}

/* MODAL ACTIONS */
.modal-actions {
  display: flex;
  gap: 15px;
  margin-top: 10px;
}

.btn-cancelar,
.btn-guardar {
  flex: 1;
  padding: 14px 25px;
  border: none;
  border-radius: 12px;
  font-family: "Patrick Hand", cursive;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-cancelar {
  background-color: #f0f0f0;
  color: #666;
}

.btn-cancelar:hover {
  background-color: #e0e0e0;
}

.btn-guardar {
  background-color: #5bc9ab;
  color: white;
}

.btn-guardar:hover:not(:disabled) {
  background-color: #4ab89a;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(91, 201, 171, 0.4);
}

.btn-guardar:disabled {
  opacity: 0.6;
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

  .form-row {
    grid-template-columns: 1fr;
  }

  .modal-content {
    padding: 20px;
  }

  .modal-actions {
    flex-direction: column;
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

  .modal-header h2 {
    font-size: 26px;
  }
}
</style>