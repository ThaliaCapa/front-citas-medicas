<template>
  <div class="perfil-page">
    <!-- CONTENIDO PRINCIPAL -->
    <main class="main-content">
      <h1 class="title">¡Bienvenido {{ nombreUsuario }}!</h1>
      <p class="subtitle">
        Aquí podrás reservar, pagar, reprogramar tus citas presenciales o
        teleconsultas y acceder a tu información de manera fácil y segura.
      </p>

      <div class="content-wrapper">
        <!-- SECCIÓN DE PERFIL -->
        <div class="perfil-section">
          <!-- FOTO DE PERFIL Y BOTÓN RESERVAR -->
          <div class="profile-header">
            <div class="profile-info-box">
              <div class="profile-photo">
                <img v-if="userPhoto" :src="userPhoto" alt="Foto de perfil" />
                <div v-else class="photo-placeholder">👤</div>
              </div>
              <div class="profile-text">
                <p class="profile-title">Mi Perfil clínico</p>
                <button class="edit-button" @click="editarPerfil">
                  Editar mi perfil
                </button>
              </div>
            </div>

            <!-- BOTÓN RESERVAR -->
            <button class="btn-reservar" @click="reservarCita">
              Reservar una cita presencial
            </button>
          </div>

          <!-- CAMPOS DE INFORMACIÓN -->
          <div class="info-fields">
            <div class="info-field">
              <label>Sexo:</label>
              <span class="field-value">{{ userData.sexo }}</span>
            </div>

            <div class="info-field">
              <label>Edad:</label>
              <span class="field-value">{{ userData.edad }}</span>
            </div>

            <div class="info-field">
              <label>Peso:</label>
              <span class="field-value">{{ userData.peso }}</span>
            </div>

            <div class="info-field">
              <label>Altura:</label>
              <span class="field-value">{{ userData.altura }}</span>
            </div>

            <div class="info-field">
              <label>Grupo Sanguíneo:</label>
              <span class="field-value">{{ userData.grupoSanguineo }}</span>
            </div>
          </div>

          <!-- CITAS PRESENCIALES PROGRAMADAS - DESPLEGABLE -->
          <div class="section-accordion">
            <div class="accordion-header" @click="toggleCitasPresenciales">
              <span>Citas Presenciales Programadas</span>
              <span class="arrow" :class="{ open: showCitasPresenciales }"
                >˅</span
              >
            </div>
            <transition name="slide">
              <div v-if="showCitasPresenciales" class="accordion-content">
                <div
                  v-if="citasPresenciales.length === 0"
                  class="empty-message"
                >
                  No tienes citas programadas
                </div>
                <div
                  v-else
                  class="cita-item"
                  v-for="cita in citasPresenciales"
                  :key="cita.id"
                >
                  <p><strong>Fecha:</strong> {{ cita.fecha }}</p>
                  <p><strong>Hora:</strong> {{ cita.hora }}</p>
                  <p><strong>Especialidad:</strong> {{ cita.especialidad }}</p>
                  <p><strong>Doctor:</strong> {{ cita.doctor }}</p>
                </div>
              </div>
            </transition>
          </div>

          <!-- HISTORIAL DE CITAS - DESPLEGABLE -->
          <div class="section-accordion">
            <div class="accordion-header" @click="toggleHistorial">
              <span>Historial de Citas Presenciales</span>
              <span class="arrow" :class="{ open: showHistorial }">˅</span>
            </div>
            <transition name="slide">
              <div v-if="showHistorial" class="accordion-content">
                <div v-if="historialCitas.length === 0" class="empty-message">
                  No tienes historial de citas
                </div>
                <div
                  v-else
                  class="cita-item"
                  v-for="cita in historialCitas"
                  :key="cita.id"
                >
                  <p><strong>Fecha:</strong> {{ cita.fecha }}</p>
                  <p><strong>Hora:</strong> {{ cita.hora }}</p>
                  <p><strong>Especialidad:</strong> {{ cita.especialidad }}</p>
                  <p><strong>Doctor:</strong> {{ cita.doctor }}</p>
                  <p><strong>Estado:</strong> {{ cita.estado }}</p>
                </div>
              </div>
            </transition>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import { authService } from "../../services/authService";

const router = useRouter();

const nombreUsuario = ref("Usuario");

const userPhoto = ref("");
const userData = reactive({
  sexo: "Cargando...",
  edad: "Cargando...",
  peso: "Cargando...",
  altura: "Cargando...",
  grupoSanguineo: "Cargando...",
});

const showCitasPresenciales = ref(false);
const showHistorial = ref(false);

const citasPresenciales = ref([]);

const historialCitas = ref([]);

onMounted(() => {
  cargarDatosUsuario();
});

function cargarDatosUsuario() {
  const usuarioActual = authService.getUsuarioActual();
  
  if (!usuarioActual) {
    router.push({ name: "Ingresar" });
    return;
  }

  console.log("Usuario actual:", usuarioActual);

  if (usuarioActual.persona) {
    const persona = usuarioActual.persona;
    
    nombreUsuario.value = `${persona.nombres} ${persona.apellido_paterno}`;
    
    userData.sexo = persona.genero || "No especificado";
    
    if (persona.fecha_nacimiento) {
      const hoy = new Date();
      const nacimiento = new Date(persona.fecha_nacimiento);
      let edad = hoy.getFullYear() - nacimiento.getFullYear();
      const mes = hoy.getMonth() - nacimiento.getMonth();
      if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
        edad--;
      }
      userData.edad = edad.toString();
    } else {
      userData.edad = "No especificado";
    }
    
    userData.peso = persona.peso || "No especificado";
    userData.altura = persona.altura || "No especificado";
    userData.grupoSanguineo = persona.grupo_sanguineo || "No especificado";
  } else {
    nombreUsuario.value = "Usuario";
  }
}

function goToInicio() {
  router.push("/");
}

function goToContacto() {
  router.push("/contacto");
}

function editarPerfil() {
  router.push({ name: "EditarPerfil" });
}

function reservarCita() {
  router.push("/reservar-cita");
}

function toggleCitasPresenciales() {
  showCitasPresenciales.value = !showCitasPresenciales.value;
}

function toggleHistorial() {
  showHistorial.value = !showHistorial.value;
}
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Caveat:wght@400;700&family=Patrick+Hand&display=swap");

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.perfil-page {
  min-height: 100vh;
  background-color: #b8bdc4;
}

.header {
  background-color: #e8eaed;
  padding: 20px 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.logo {
  display: flex;
  align-items: center;
  gap: 15px;
}

.logo-img {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  object-fit: cover;
}

.logo-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.logo-title {
  font-family: "Caveat", cursive;
  font-size: 28px;
  font-weight: 700;
  color: #2c2c2c;
  line-height: 1;
}

.logo-subtitle {
  font-family: "Patrick Hand", cursive;
  font-size: 14px;
  color: #666;
  line-height: 1;
}

.nav {
  display: flex;
  gap: 40px;
  align-items: center;
}

.nav-link {
  font-family: "Caveat", cursive;
  font-size: 24px;
  color: #2c2c2c;
  text-decoration: none;
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
}

.nav-link:hover {
  color: #5bc9ab;
}

.nav-link.active {
  color: #5bc9ab;
  font-weight: 700;
}

.nav-link.active::after {
  content: "";
  position: absolute;
  bottom: -5px;
  left: 0;
  right: 0;
  height: 3px;
  background-color: #5bc9ab;
  border-radius: 2px;
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
  margin-bottom: 20px;
  color: #2c2c2c;
}

.subtitle {
  font-family: "Patrick Hand", cursive;
  font-size: clamp(15px, 2.5vw, 18px);
  text-align: center;
  margin-bottom: 50px;
  color: #2c2c2c;
  line-height: 1.7;
  max-width: 950px;
  margin-left: auto;
  margin-right: auto;
}

.content-wrapper {
  max-width: 1000px;
  margin: 0 auto;
}

.perfil-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.profile-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 30px;
  flex-wrap: wrap;
  margin-bottom: 10px;
}

.profile-info-box {
  display: flex;
  align-items: center;
  gap: 20px;
  flex: 1;
  min-width: 250px;
}

.profile-photo {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  background-color: #5bc9ab;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.profile-photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.photo-placeholder {
  font-size: 45px;
  color: white;
}

.profile-text {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.profile-title {
  font-family: "Patrick Hand", cursive;
  font-size: 20px;
  font-weight: 600;
  color: #2c2c2c;
}

.edit-button {
  background: none;
  border: none;
  font-family: "Patrick Hand", cursive;
  font-size: 16px;
  color: #5bc9ab;
  text-decoration: underline;
  cursor: pointer;
  padding: 0;
  text-align: left;
  transition: color 0.3s ease;
}

.edit-button:hover {
  color: #4ab89a;
}

.btn-reservar {
  background-color: #5bc9ab;
  color: #2c2c2c;
  border: none;
  border-radius: 15px;
  padding: 16px 35px;
  font-family: "Patrick Hand", cursive;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  white-space: nowrap;
}

.btn-reservar:hover {
  background-color: #4ab89a;
  transform: translateY(-2px);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.2);
}

.info-fields {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 15px;
}

.info-field {
  background-color: rgba(255, 255, 255, 0.8);
  border: 2px solid #5bc9ab;
  border-radius: 12px;
  padding: 14px 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  transition: all 0.3s ease;
}

.info-field:hover {
  background-color: rgba(255, 255, 255, 0.95);
  transform: translateX(5px);
}

.info-field label {
  font-family: "Patrick Hand", cursive;
  font-size: 17px;
  font-weight: 600;
  color: #2c2c2c;
  min-width: 150px;
}

.field-value {
  font-family: "Patrick Hand", cursive;
  font-size: 16px;
  color: #2c2c2c;
}

.section-accordion {
  background-color: #5bc9ab;
  border-radius: 12px;
  overflow: hidden;
  margin-top: 15px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
}

.accordion-header {
  padding: 18px 25px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;
  user-select: none;
}

.accordion-header:hover {
  background-color: #4ab89a;
}

.accordion-header span:first-child {
  font-family: "Patrick Hand", cursive;
  font-size: 18px;
  font-weight: 600;
  color: #2c2c2c;
}

.arrow {
  font-size: 16px;
  color: #2c2c2c;
  transition: transform 0.3s ease;
}

.arrow.open {
  transform: rotate(180deg);
}

.accordion-content {
  background-color: rgba(255, 255, 255, 0.95);
  padding: 20px;
  border-top: 2px solid rgba(0, 0, 0, 0.1);
}

.empty-message {
  font-family: "Patrick Hand", cursive;
  font-size: 15px;
  color: #666;
  text-align: center;
  padding: 15px;
  font-style: italic;
}

.cita-item {
  background-color: rgba(255, 255, 255, 0.9);
  border: 2px solid #5bc9ab;
  border-radius: 10px;
  padding: 15px;
  margin-bottom: 12px;
  transition: all 0.3s ease;
}

.cita-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.cita-item:last-child {
  margin-bottom: 0;
}

.cita-item p {
  font-family: "Patrick Hand", cursive;
  font-size: 15px;
  color: #2c2c2c;
  margin-bottom: 6px;
}

.cita-item p:last-child {
  margin-bottom: 0;
}

.cita-item strong {
  font-weight: 600;
  color: #5bc9ab;
}

.slide-enter-active {
  transition: all 0.4s ease;
}

.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from {
  max-height: 0;
  opacity: 0;
  padding-top: 0;
  padding-bottom: 0;
}

.slide-leave-to {
  max-height: 0;
  opacity: 0;
  padding-top: 0;
  padding-bottom: 0;
}

@media (max-width: 1024px) {
  .profile-header {
    flex-direction: column;
    align-items: stretch;
  }

  .btn-reservar {
    width: 100%;
    text-align: center;
  }
}

@media (max-width: 768px) {
  .header {
    flex-direction: column;
    gap: 20px;
    padding: 20px 30px;
  }

  .nav {
    gap: 25px;
    flex-wrap: wrap;
    justify-content: center;
  }

  .nav-link {
    font-size: 20px;
  }

  .main-content {
    padding: 35px 25px;
  }

  .profile-info-box {
    flex-direction: column;
    text-align: center;
    align-items: center;
  }

  .edit-button {
    text-align: center;
  }

  .info-field {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .info-field label {
    min-width: auto;
  }
}

@media (max-width: 480px) {
  .header {
    padding: 15px 20px;
  }

  .logo-img {
    width: 50px;
    height: 50px;
  }

  .logo-title {
    font-size: 24px;
  }

  .logo-subtitle {
    font-size: 12px;
  }

  .nav {
    gap: 18px;
  }

  .nav-link {
    font-size: 18px;
  }

  .main-content {
    padding: 25px 15px;
  }

  .accordion-header span:first-child {
    font-size: 15px;
  }

  .btn-reservar {
    padding: 14px 25px;
    font-size: 16px;
  }
}
</style>