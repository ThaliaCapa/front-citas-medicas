<template>
  <div class="admin-dashboard-page">
    <main class="main-content">
      <div class="welcome-section">
        <h1 class="title">Panel de Administración</h1>
        <p class="subtitle">
          Bienvenido, {{ nombreAdmin }}. Gestiona los doctores y horarios de la clínica.
        </p>
      </div>

      <!-- TARJETAS DE ACCESO RÁPIDO -->
      <div class="cards-grid">
        
        <!-- CARD: GESTIÓN DE DOCTORES -->
        <div class="admin-card" @click="irADoctores">
          <div class="card-icon doctores">
            👨‍⚕️
          </div>
          <h2 class="card-title">Gestión de Doctores</h2>
          <p class="card-description">
            Crear, editar y administrar los médicos de la clínica
          </p>
          <div class="card-stats">
            <span class="stat-label">Total doctores:</span>
            <span class="stat-value">{{ totalDoctores }}</span>
          </div>
          <button class="card-button">
            Ir a Doctores →
          </button>
        </div>

        <!-- CARD: GESTIÓN DE HORARIOS -->
        <div class="admin-card" @click="irAHorarios">
          <div class="card-icon horarios">
            📅
          </div>
          <h2 class="card-title">Gestión de Horarios</h2>
          <p class="card-description">
            Crear y administrar los horarios disponibles de los doctores
          </p>
          <div class="card-stats">
            <span class="stat-label">Horarios activos:</span>
            <span class="stat-value">{{ totalHorarios }}</span>
          </div>
          <button class="card-button">
            Ir a Horarios →
          </button>
        </div>

        <!-- CARD: VER CITAS -->
        <div class="admin-card">
          <div class="card-icon citas">
            📋
          </div>
          <h2 class="card-title">Citas Programadas</h2>
          <p class="card-description">
            Ver y gestionar todas las citas médicas
          </p>
          <div class="card-stats">
            <span class="stat-label">Citas hoy:</span>
            <span class="stat-value">{{ citasHoy }}</span>
          </div>
          <button class="card-button" disabled>
            Próximamente
          </button>
        </div>

        <!-- CARD: REPORTES -->
        <div class="admin-card">
          <div class="card-icon reportes">
            📊
          </div>
          <h2 class="card-title">Reportes</h2>
          <p class="card-description">
            Estadísticas y reportes de la clínica
          </p>
          <div class="card-stats">
            <span class="stat-label">Pacientes total:</span>
            <span class="stat-value">{{ totalPacientes }}</span>
          </div>
          <button class="card-button" disabled>
            Próximamente
          </button>
        </div>

      </div>

      <!-- BOTÓN VOLVER -->
      <div class="actions">
        <button class="btn-volver" @click="volverInicio">
          ← Volver al Inicio
        </button>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { supabase } from '../../lib/supabaseClient';

const router = useRouter();

const nombreAdmin = ref('Administrador');
const totalDoctores = ref(0);
const totalHorarios = ref(0);
const citasHoy = ref(0);
const totalPacientes = ref(0);

onMounted(async () => {
  await cargarEstadisticas();
  cargarNombreAdmin();
});

function cargarNombreAdmin() {
  const usuarioStr = sessionStorage.getItem('usuarioActual');
  if (usuarioStr) {
    const usuario = JSON.parse(usuarioStr);
    nombreAdmin.value = usuario.nombres || 'Administrador';
  }
}

async function cargarEstadisticas() {
  try {
    // Contar doctores
    const { count: countDoctores } = await supabase
      .from('persona')
      .select('*', { count: 'exact', head: true })
      .eq('idrol', 120);
    totalDoctores.value = countDoctores || 0;

    // Contar horarios disponibles
    const hoy = new Date().toISOString().split('T')[0];
    const { count: countHorarios } = await supabase
      .from('horario')
      .select('*', { count: 'exact', head: true })
      .gte('fecha', hoy);
    totalHorarios.value = countHorarios || 0;

    // Contar citas de hoy
    const { count: countCitas } = await supabase
      .from('cita')
      .select('*', { count: 'exact', head: true })
      .eq('fecha', hoy);
    citasHoy.value = countCitas || 0;

    // Contar pacientes
    const { count: countPacientes } = await supabase
      .from('persona')
      .select('*', { count: 'exact', head: true })
      .eq('idrol', 119); // ID rol paciente
    totalPacientes.value = countPacientes || 0;

  } catch (error) {
    console.error('Error al cargar estadísticas:', error);
  }
}

function irADoctores() {
  router.push({ name: 'AdminDoctores' });
}

function irAHorarios() {
  router.push({ name: 'AdminHorarios' });
}

function volverInicio() {
  router.push({ name: 'BienvenidaIngresar' });
}
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Caveat:wght@400;700&family=Patrick+Hand&display=swap");

.admin-dashboard-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 40px 20px;
}

.main-content {
  max-width: 1400px;
  margin: 0 auto;
}

.welcome-section {
  text-align: center;
  margin-bottom: 50px;
  animation: fadeInDown 0.8s ease-out;
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.title {
  font-family: "Caveat", cursive;
  font-size: clamp(42px, 6vw, 56px);
  font-weight: 700;
  color: white;
  margin-bottom: 15px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
}

.subtitle {
  font-family: "Patrick Hand", cursive;
  font-size: clamp(16px, 2.5vw, 20px);
  color: rgba(255, 255, 255, 0.95);
  max-width: 700px;
  margin: 0 auto;
  line-height: 1.6;
}

/* CARDS GRID */
.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  margin-bottom: 40px;
}

.admin-card {
  background: white;
  border-radius: 20px;
  padding: 35px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
  animation: fadeInUp 0.8s ease-out;
  animation-fill-mode: both;
}

.admin-card:nth-child(1) {
  animation-delay: 0.1s;
}

.admin-card:nth-child(2) {
  animation-delay: 0.2s;
}

.admin-card:nth-child(3) {
  animation-delay: 0.3s;
}

.admin-card:nth-child(4) {
  animation-delay: 0.4s;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.admin-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.2);
}

.card-icon {
  width: 80px;
  height: 80px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 42px;
  margin-bottom: 20px;
  transition: transform 0.3s ease;
}

.admin-card:hover .card-icon {
  transform: scale(1.1) rotate(5deg);
}

.card-icon.doctores {
  background: linear-gradient(135deg, #5bc9ab 0%, #4ab89a 100%);
}

.card-icon.horarios {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.card-icon.citas {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.card-icon.reportes {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.card-title {
  font-family: "Caveat", cursive;
  font-size: 28px;
  font-weight: 700;
  color: #2c2c2c;
  margin-bottom: 12px;
}

.card-description {
  font-family: "Patrick Hand", cursive;
  font-size: 15px;
  color: #666;
  margin-bottom: 20px;
  line-height: 1.5;
  min-height: 60px;
}

.card-stats {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 10px;
  margin-bottom: 20px;
}

.stat-label {
  font-family: "Patrick Hand", cursive;
  font-size: 14px;
  color: #666;
}

.stat-value {
  font-family: "Caveat", cursive;
  font-size: 28px;
  font-weight: 700;
  color: #5bc9ab;
}

.card-button {
  width: 100%;
  background-color: #5bc9ab;
  color: white;
  border: none;
  padding: 14px 25px;
  border-radius: 12px;
  font-family: "Patrick Hand", cursive;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.card-button:hover:not(:disabled) {
  background-color: #4ab89a;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(91, 201, 171, 0.3);
}

.card-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
  opacity: 0.6;
}

/* ACCIONES */
.actions {
  display: flex;
  justify-content: center;
  margin-top: 40px;
}

.btn-volver {
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2px solid white;
  padding: 14px 30px;
  border-radius: 12px;
  font-family: "Patrick Hand", cursive;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.btn-volver:hover {
  background-color: white;
  color: #667eea;
  transform: translateY(-2px);
  box-shadow: 0 5px 20px rgba(255, 255, 255, 0.3);
}

/* RESPONSIVE */
@media (max-width: 768px) {
  .admin-dashboard-page {
    padding: 30px 15px;
  }

  .cards-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .admin-card {
    padding: 25px;
  }

  .card-icon {
    width: 60px;
    height: 60px;
    font-size: 32px;
  }
}
</style>