<template>
  <div class="perfil-page">
    <!-- HEADER -->
    <header class="header">
      <div class="logo">
        <img src="./logo.png" alt="Tópico" class="logo-img" />
        <span class="logo-text">Tópico</span>
      </div>
      <nav class="nav">
        <a href="#" class="nav-link" @click.prevent="goToInicio">Inicio</a>
        <a href="#" class="nav-link" @click.prevent="goToContacto">Contáctanos</a>
        <a href="#" class="nav-link active">Mi perfil</a>
      </nav>
    </header>

    <!-- CONTENIDO PRINCIPAL -->
    <main class="main-content">
      <h1 class="title">¡Bienvenido!</h1>
      <p class="subtitle">
        Aquí podrás reservar, pagar, reprogramar tus citas presenciales o
        teleconsultas y acceder a tu información de manera fácil y segura.
      </p>

      <div class="content-wrapper">
        <!-- COLUMNA IZQUIERDA - PERFIL -->
        <div class="left-column">
          <!-- FOTO DE PERFIL -->
          <div class="profile-section">
            <div class="profile-photo">
              <img v-if="userPhoto" :src="userPhoto" alt="Foto de perfil" />
              <div v-else class="photo-placeholder">👤</div>
            </div>
            <div class="profile-info">
              <p class="profile-title">Mi Perfil clínico</p>
              <button class="edit-button" @click="editarPerfil">
                Editar mi perfil
              </button>
            </div>
          </div>

          <!-- CAMPOS DE INFORMACIÓN -->
          <div class="info-fields">
            <div class="info-field">
              <label>Sexo</label>
              <div class="field-value">{{ userData.sexo || '-' }}</div>
              <small class="field-subtitle">Edad</small>
            </div>

            <div class="info-field">
              <label>Peso</label>
              <div class="field-value">{{ userData.peso || '-' }}</div>
              <small class="field-subtitle">Altura</small>
            </div>

            <div class="info-field">
              <label>Grupo Sanguíneo</label>
              <div class="field-value">{{ userData.grupoSanguineo || '-' }}</div>
            </div>
          </div>

          <!-- CITAS PRESENCIALES PROGRAMADAS -->
          <div class="section-card" @click="toggleCitasPresenciales">
            <span>Citas Presenciales Programadas</span>
            <button class="favorite-btn">
              <span class="heart">🖤</span>
            </button>
          </div>

          <!-- HISTORIAL DE CITAS -->
          <div class="section-card" @click="toggleHistorial">
            <span>Historial de Citas Presenciales</span>
            <button class="favorite-btn">
              <span class="heart">🖤</span>
            </button>
          </div>
        </div>

        <!-- COLUMNA DERECHA - BOTÓN RESERVAR -->
        <div class="right-column">
          <button class="btn-reservar" @click="reservarCita">
            Reservar una cita presencial
          </button>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const userPhoto = ref("");
const userData = reactive({
  sexo: "Masculino",
  edad: "28 años",
  peso: "75 kg",
  altura: "1.75 m",
  grupoSanguineo: "O+",
});

function goToInicio() {
  router.push("/");
}

function goToContacto() {
  router.push("/contacto");
}

function editarPerfil() {
  console.log("Editar perfil");
  // Aquí iría la lógica para editar el perfil
}

function reservarCita() {
  router.push("/reservar-cita");
}

function toggleCitasPresenciales() {
  console.log("Mostrar citas presenciales programadas");
  // Aquí iría la lógica para mostrar/ocultar las citas
}

function toggleHistorial() {
  console.log("Mostrar historial de citas");
  // Aquí iría la lógica para mostrar/ocultar el historial
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

/* HEADER */
.header {
  background-color: #e8eaed;
  padding: 20px 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo-img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #5bc9ab;
}

.logo-text {
  font-family: "Caveat", cursive;
  font-size: 24px;
  font-weight: 700;
  color: #2c2c2c;
}

.nav {
  display: flex;
  gap: 40px;
  align-items: center;
}

.nav-link {
  font-family: "Caveat", cursive;
  font-size: 22px;
  color: #2c2c2c;
  text-decoration: none;
  transition: color 0.3s ease;
  cursor: pointer;
}

.nav-link:hover,
.nav-link.active {
  color: #5bc9ab;
  font-weight: 700;
}

/* CONTENIDO PRINCIPAL */
.main-content {
  padding: 40px 60px;
}

.title {
  font-family: "Caveat", cursive;
  font-size: clamp(36px, 6vw, 48px);
  font-weight: 700;
  text-align: center;
  margin-bottom: 15px;
  color: #2c2c2c;
}

.subtitle {
  font-family: "Patrick Hand", cursive;
  font-size: clamp(14px, 2.5vw, 16px);
  text-align: center;
  margin-bottom: 40px;
  color: #2c2c2c;
  line-height: 1.6;
  max-width: 900px;
  margin-left: auto;
  margin-right: auto;
}

.content-wrapper {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 30px;
  max-width: 1200px;
  margin: 0 auto;
}

/* COLUMNA IZQUIERDA */
.left-column {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.profile-section {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 10px;
}

.profile-photo {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: #5bc9ab;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  flex-shrink: 0;
}

.profile-photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.photo-placeholder {
  font-size: 40px;
  color: white;
}

.profile-info {
  flex: 1;
}

.profile-title {
  font-family: "Patrick Hand", cursive;
  font-size: 18px;
  font-weight: 600;
  color: #2c2c2c;
  margin-bottom: 5px;
}

.edit-button {
  background: none;
  border: none;
  font-family: "Patrick Hand", cursive;
  font-size: 15px;
  color: #2c2c2c;
  text-decoration: underline;
  cursor: pointer;
  padding: 0;
}

.edit-button:hover {
  color: #5bc9ab;
}

/* CAMPOS DE INFORMACIÓN */
.info-fields {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.info-field {
  background-color: rgba(255, 255, 255, 0.7);
  border: 2px solid #5bc9ab;
  border-radius: 12px;
  padding: 12px 18px;
}

.info-field label {
  font-family: "Patrick Hand", cursive;
  font-size: 16px;
  font-weight: 600;
  color: #2c2c2c;
  display: block;
  margin-bottom: 4px;
}

.field-value {
  font-family: "Patrick Hand", cursive;
  font-size: 15px;
  color: #2c2c2c;
}

.field-subtitle {
  font-family: "Patrick Hand", cursive;
  font-size: 14px;
  color: #666;
  display: block;
  margin-top: 2px;
}

/* SECCIONES CON FAVORITO */
.section-card {
  background-color: #5bc9ab;
  border-radius: 12px;
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 10px;
}

.section-card:hover {
  background-color: #4ab89a;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.section-card span {
  font-family: "Patrick Hand", cursive;
  font-size: 16px;
  font-weight: 600;
  color: #2c2c2c;
}

.favorite-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.heart {
  font-size: 24px;
  transition: transform 0.3s ease;
}

.favorite-btn:hover .heart {
  transform: scale(1.2);
}

/* COLUMNA DERECHA */
.right-column {
  display: flex;
  align-items: flex-start;
  padding-top: 100px;
}

.btn-reservar {
  background-color: #5bc9ab;
  color: #2c2c2c;
  border: none;
  border-radius: 15px;
  padding: 18px 35px;
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
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
}

/* RESPONSIVE */
@media (max-width: 1024px) {
  .content-wrapper {
    grid-template-columns: 1fr;
  }

  .right-column {
    padding-top: 0;
    justify-content: center;
  }

  .btn-reservar {
    width: 100%;
  }
}

@media (max-width: 768px) {
  .header {
    flex-direction: column;
    gap: 20px;
    padding: 20px;
  }

  .nav {
    gap: 20px;
    flex-wrap: wrap;
    justify-content: center;
  }

  .nav-link {
    font-size: 18px;
  }

  .main-content {
    padding: 30px 20px;
  }

  .profile-section {
    flex-direction: column;
    text-align: center;
  }

  .profile-photo {
    width: 100px;
    height: 100px;
  }
}

@media (max-width: 480px) {
  .header {
    padding: 15px;
  }

  .logo-text {
    font-size: 20px;
  }

  .nav {
    gap: 15px;
  }

  .nav-link {
    font-size: 16px;
  }

  .main-content {
    padding: 20px 15px;
  }

  .section-card span {
    font-size: 14px;
  }

  .btn-reservar {
    padding: 15px 25px;
    font-size: 16px;
  }
}
</style>