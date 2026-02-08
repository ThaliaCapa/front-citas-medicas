<template>
  <div class="admin-horarios-page">
    <main class="main-content">
      <h1 class="title">Gestión de Horarios</h1>
      <p class="subtitle">
        Administra los horarios de los doctores: crear individuales o masivos.
      </p>

      <!-- TABS -->
      <div class="tabs">
        <button
          class="tab"
          :class="{ active: tabActivo === 'crear' }"
          @click="tabActivo = 'crear'"
        >
          ➕ Crear Horarios
        </button>
        <button
          class="tab"
          :class="{ active: tabActivo === 'listar' }"
          @click="tabActivo = 'listar'"
        >
          📋 Ver Horarios
        </button>
      </div>

      <!-- TAB: CREAR HORARIOS -->
      <div v-if="tabActivo === 'crear'" class="tab-content">
        <div class="crear-container">
          <h2 class="section-title">Crear Horarios</h2>

          <!-- MODO DE CREACIÓN -->
          <div class="modo-selector">
            <label>
              <input type="radio" v-model="modoCreacion" value="individual" />
              Individual (un horario)
            </label>
            <label>
              <input type="radio" v-model="modoCreacion" value="masivo" />
              Masivo (múltiples horarios)
            </label>
          </div>

          <!-- FORMULARIO INDIVIDUAL -->
          <form v-if="modoCreacion === 'individual'" @submit.prevent="crearHorarioIndividual" class="form-horario">
            <div class="form-row">
              <div class="form-group">
                <label>Doctor *</label>
                <select v-model="formIndividual.iddoctor" required>
                  <option value="">Seleccionar doctor</option>
                  <option v-for="doctor in doctores" :key="doctor.id" :value="doctor.id">
                    Dr(a). {{ doctor.nombres }} {{ doctor.apellido_paterno }}
                  </option>
                </select>
              </div>
              <div class="form-group">
                <label>Fecha *</label>
                <input v-model="formIndividual.fecha" type="date" required />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Hora *</label>
                <input v-model="formIndividual.hora" type="time" required />
              </div>
              <div class="form-group">
                <label>Día de la Semana</label>
                <select v-model="formIndividual.diasemana">
                  <option value="">Auto (según fecha)</option>
                  <option value="lunes">Lunes</option>
                  <option value="martes">Martes</option>
                  <option value="miércoles">Miércoles</option>
                  <option value="jueves">Jueves</option>
                  <option value="viernes">Viernes</option>
                  <option value="sábado">Sábado</option>
                  <option value="domingo">Domingo</option>
                </select>
              </div>
            </div>

            <button type="submit" class="btn-crear" :disabled="creandoIndividual">
              {{ creandoIndividual ? 'Creando...' : 'Crear Horario' }}
            </button>
          </form>

          <!-- FORMULARIO MASIVO -->
          <form v-else @submit.prevent="crearHorariosMasivos" class="form-horario">
            <div class="form-group">
              <label>Doctor *</label>
              <select v-model="formMasivo.iddoctor" required>
                <option value="">Seleccionar doctor</option>
                <option v-for="doctor in doctores" :key="doctor.id" :value="doctor.id">
                  Dr(a). {{ doctor.nombres }} {{ doctor.apellido_paterno }}
                </option>
              </select>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Fecha Inicio *</label>
                <input v-model="formMasivo.fechaInicio" type="date" required />
              </div>
              <div class="form-group">
                <label>Fecha Fin *</label>
                <input v-model="formMasivo.fechaFin" type="date" required />
              </div>
            </div>

            <div class="form-group">
              <label>Días de la Semana *</label>
              <div class="dias-semana">
                <label v-for="dia in diasSemana" :key="dia.value">
                  <input type="checkbox" :value="dia.value" v-model="formMasivo.dias" />
                  {{ dia.label }}
                </label>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Hora Inicio *</label>
                <input v-model="formMasivo.horaInicio" type="time" required />
              </div>
              <div class="form-group">
                <label>Hora Fin *</label>
                <input v-model="formMasivo.horaFin" type="time" required />
              </div>
            </div>

            <div class="form-group">
              <label>Intervalo (minutos) *</label>
              <select v-model="formMasivo.intervalo" required>
                <option value="15">15 minutos</option>
                <option value="30">30 minutos</option>
                <option value="60">60 minutos</option>
              </select>
            </div>

            <div class="preview-info">
              <p><strong>Vista previa:</strong></p>
              <p>Se crearán aproximadamente {{ calcularHorariosACrear() }} horarios</p>
            </div>

            <button type="submit" class="btn-crear" :disabled="creandoMasivo">
              {{ creandoMasivo ? 'Creando horarios...' : 'Crear Horarios Masivos' }}
            </button>
          </form>
        </div>
      </div>

      <!-- TAB: LISTAR HORARIOS -->
      <div v-else class="tab-content">
        <div class="listar-container">
          <h2 class="section-title">Horarios Registrados</h2>

          <!-- FILTROS -->
          <div class="filtros">
            <div class="form-group">
              <label>Filtrar por Doctor</label>
              <select v-model="filtroDoctor" @change="cargarHorarios">
                <option value="">Todos los doctores</option>
                <option v-for="doctor in doctores" :key="doctor.id" :value="doctor.id">
                  Dr(a). {{ doctor.nombres }} {{ doctor.apellido_paterno }}
                </option>
              </select>
            </div>
            <div class="form-group">
              <label>Filtrar por Fecha</label>
              <input v-model="filtroFecha" type="date" @change="cargarHorarios" />
            </div>
            <button class="btn-limpiar" @click="limpiarFiltros">Limpiar Filtros</button>
          </div>

          <!-- TABLA DE HORARIOS -->
          <div v-if="cargandoHorarios" class="loading">
            <div class="spinner"></div>
            <p>Cargando horarios...</p>
          </div>

          <div v-else-if="horarios.length === 0" class="sin-datos">
            <p>📅 No hay horarios registrados</p>
          </div>

          <table v-else class="tabla-horarios">
            <thead>
              <tr>
                <th>ID</th>
                <th>Doctor</th>
                <th>Fecha</th>
                <th>Día</th>
                <th>Hora</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="horario in horarios" :key="horario.id">
                <td>{{ horario.id }}</td>
                <td>{{ getNombreDoctor(horario.iddoctor) }}</td>
                <td>{{ formatearFecha(horario.fecha) }}</td>
                <td>{{ horario.diasemana || 'N/A' }}</td>
                <td>{{ horario.hora }}</td>
                <td>
                  <span :class="['badge', horario.disponible ? 'disponible' : 'ocupado']">
                    {{ horario.disponible ? 'Disponible' : 'Ocupado' }}
                  </span>
                </td>
                <td class="acciones">
                  <button class="btn-eliminar" @click="eliminarHorario(horario)" title="Eliminar">
                    🗑️
                  </button>
                </td>
              </tr>
            </tbody>
          </table>

          <div class="pagination">
            <p>Mostrando {{ horarios.length }} horarios</p>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { supabase } from '../../lib/supabaseClient';

// Estados
const tabActivo = ref('crear');
const modoCreacion = ref('individual');
const cargandoHorarios = ref(false);
const creandoIndividual = ref(false);
const creandoMasivo = ref(false);

const doctores = ref<any[]>([]);
const horarios = ref<any[]>([]);

const filtroDoctor = ref('');
const filtroFecha = ref('');

const diasSemana = [
  { value: 1, label: 'Lun' },
  { value: 2, label: 'Mar' },
  { value: 3, label: 'Mié' },
  { value: 4, label: 'Jue' },
  { value: 5, label: 'Vie' },
  { value: 6, label: 'Sáb' },
  { value: 0, label: 'Dom' },
];

const formIndividual = ref({
  iddoctor: null as number | null,
  fecha: '',
  hora: '',
  diasemana: '',
});

const formMasivo = ref({
  iddoctor: null as number | null,
  fechaInicio: '',
  fechaFin: '',
  dias: [] as number[],
  horaInicio: '',
  horaFin: '',
  intervalo: '30',
});

onMounted(async () => {
  await cargarDoctores();
  await cargarHorarios();
});

async function cargarDoctores() {
  const { data, error } = await supabase
    .from('persona')
    .select('id, nombres, apellido_paterno, apellido_materno')
    .eq('idrol', 120)
    .order('nombres');

  if (error) {
    console.error('Error al cargar doctores:', error);
    return;
  }

  doctores.value = data || [];
  console.log('✅ Doctores cargados:', doctores.value.length);
}

async function cargarHorarios() {
  cargandoHorarios.value = true;

  try {
    let query = supabase
      .from('horario')
      .select('*')
      .order('fecha', { ascending: true })
      .order('hora', { ascending: true });

    if (filtroDoctor.value) {
      query = query.eq('iddoctor', filtroDoctor.value);
    }

    if (filtroFecha.value) {
      query = query.eq('fecha', filtroFecha.value);
    }

    const { data, error } = await query;

    if (error) throw error;

    // Verificar disponibilidad
    const horariosConDisponibilidad = await Promise.all(
      (data || []).map(async (horario) => {
        const { data: citas } = await supabase
          .from('cita')
          .select('id')
          .eq('idhorario', horario.id)
          .eq('estado', 1);

        return {
          ...horario,
          disponible: !citas || citas.length === 0,
        };
      })
    );

    horarios.value = horariosConDisponibilidad;
    console.log('✅ Horarios cargados:', horarios.value.length);
  } catch (error) {
    console.error('Error al cargar horarios:', error);
    alert('Error al cargar horarios');
  } finally {
    cargandoHorarios.value = false;
  }
}

function limpiarFiltros() {
  filtroDoctor.value = '';
  filtroFecha.value = '';
  cargarHorarios();
}

function getNombreDoctor(iddoctor: number) {
  const doctor = doctores.value.find(d => d.id === iddoctor);
  return doctor ? `Dr(a). ${doctor.nombres} ${doctor.apellido_paterno}` : 'N/A';
}

function formatearFecha(fecha: string) {
  const date = new Date(fecha + 'T00:00:00');
  return date.toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function getDiaSemana(fecha: string) {
  const date = new Date(fecha + 'T00:00:00');
  const dias = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
  return dias[date.getDay()];
}

async function crearHorarioIndividual() {
  if (!formIndividual.value.iddoctor || !formIndividual.value.fecha || !formIndividual.value.hora) {
    alert('Por favor completa todos los campos obligatorios');
    return;
  }

  creandoIndividual.value = true;

  try {
    const diasemana = formIndividual.value.diasemana || getDiaSemana(formIndividual.value.fecha);

    const { error } = await supabase
      .from('horario')
      .insert({
        iddoctor: formIndividual.value.iddoctor,
        fecha: formIndividual.value.fecha,
        hora: formIndividual.value.hora + ':00',
        diasemana: diasemana,
      });

    if (error) throw error;

    alert('✅ Horario creado exitosamente');
    
    // Reset form
    formIndividual.value = {
      iddoctor: null,
      fecha: '',
      hora: '',
      diasemana: '',
    };

    await cargarHorarios();
  } catch (error: any) {
    console.error('Error al crear horario:', error);
    alert('❌ Error al crear horario: ' + error.message);
  } finally {
    creandoIndividual.value = false;
  }
}

function calcularHorariosACrear() {
  if (!formMasivo.value.fechaInicio || !formMasivo.value.fechaFin || 
      !formMasivo.value.horaInicio || !formMasivo.value.horaFin || 
      formMasivo.value.dias.length === 0) {
    return 0;
  }

  const inicio = new Date(formMasivo.value.fechaInicio);
  const fin = new Date(formMasivo.value.fechaFin);
  const dias = Math.ceil((fin.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24)) + 1;

  const horaInicioParts = formMasivo.value.horaInicio.split(':');
  const horaInicioH = parseInt(horaInicioParts[0] || '0');
  const horaInicioM = parseInt(horaInicioParts[1] || '0');
  
  const horaFinParts = formMasivo.value.horaFin.split(':');
  const horaFinH = parseInt(horaFinParts[0] || '0');
  const horaFinM = parseInt(horaFinParts[1] || '0');
  
  const minutosTotales = (horaFinH * 60 + horaFinM) - (horaInicioH * 60 + horaInicioM);
  const intervalo = parseInt(formMasivo.value.intervalo);
  const horasPorDia = Math.floor(minutosTotales / intervalo);

  const diasSeleccionados = formMasivo.value.dias.length;
  const diasHabiles = Math.ceil(dias * (diasSeleccionados / 7));

  return diasHabiles * horasPorDia;
}

async function crearHorariosMasivos() {
  if (!formMasivo.value.iddoctor || !formMasivo.value.fechaInicio || !formMasivo.value.fechaFin ||
      formMasivo.value.dias.length === 0 || !formMasivo.value.horaInicio || !formMasivo.value.horaFin) {
    alert('Por favor completa todos los campos obligatorios');
    return;
  }

  creandoMasivo.value = true;

  try {
    const horariosACrear: any[] = [];
    
    const fechaInicio = new Date(formMasivo.value.fechaInicio);
    const fechaFin = new Date(formMasivo.value.fechaFin);
    
    // Generar todas las fechas
    for (let fecha = new Date(fechaInicio); fecha <= fechaFin; fecha.setDate(fecha.getDate() + 1)) {
      const diaSemana = fecha.getDay();
      
      // Verificar si este día está seleccionado
      if (!formMasivo.value.dias.includes(diaSemana)) continue;
      
      const fechaStr = fecha.toISOString().split('T')[0]!;
      const diasemana = getDiaSemana(fechaStr);
      
      // Generar horas para este día
      const horaInicioParts = formMasivo.value.horaInicio.split(':');
      const horaInicioH = parseInt(horaInicioParts[0] || '0');
      const horaInicioM = parseInt(horaInicioParts[1] || '0');
      
      const horaFinParts = formMasivo.value.horaFin.split(':');
      const horaFinH = parseInt(horaFinParts[0] || '0');
      const horaFinM = parseInt(horaFinParts[1] || '0');
      const intervalo = parseInt(formMasivo.value.intervalo);
      
      let horaActual = horaInicioH * 60 + horaInicioM;
      const horaFinal = horaFinH * 60 + horaFinM;
      
      while (horaActual < horaFinal) {
        const h = Math.floor(horaActual / 60);
        const m = horaActual % 60;
        const horaStr = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:00`;
        
        horariosACrear.push({
          iddoctor: formMasivo.value.iddoctor,
          fecha: fechaStr,
          hora: horaStr,
          diasemana: diasemana,
        });
        
        horaActual += intervalo;
      }
    }

    console.log(`📅 Creando ${horariosACrear.length} horarios...`);

    const { error } = await supabase
      .from('horario')
      .insert(horariosACrear);

    if (error) throw error;

    alert(`✅ ${horariosACrear.length} horarios creados exitosamente`);
    
    // Reset form
    formMasivo.value = {
      iddoctor: null,
      fechaInicio: '',
      fechaFin: '',
      dias: [],
      horaInicio: '',
      horaFin: '',
      intervalo: '30',
    };

    await cargarHorarios();
  } catch (error: any) {
    console.error('Error al crear horarios masivos:', error);
    alert('❌ Error al crear horarios: ' + error.message);
  } finally {
    creandoMasivo.value = false;
  }
}

async function eliminarHorario(horario: any) {
  if (!horario.disponible) {
    alert('⚠️ No se puede eliminar un horario que ya tiene una cita agendada');
    return;
  }

  const confirmar = confirm(`¿Eliminar horario del ${formatearFecha(horario.fecha)} a las ${horario.hora}?`);
  if (!confirmar) return;

  try {
    const { error } = await supabase
      .from('horario')
      .delete()
      .eq('id', horario.id);

    if (error) throw error;

    alert('✅ Horario eliminado');
    await cargarHorarios();
  } catch (error: any) {
    console.error('Error al eliminar:', error);
    alert('❌ Error al eliminar: ' + error.message);
  }
}
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Caveat:wght@400;700&family=Patrick+Hand&display=swap");

.admin-horarios-page {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 40px 20px;
}

.main-content {
  max-width: 1400px;
  margin: 0 auto;
}

.title {
  font-family: "Caveat", cursive;
  font-size: 42px;
  font-weight: 700;
  color: #2c2c2c;
  margin-bottom: 10px;
}

.subtitle {
  font-family: "Patrick Hand", cursive;
  font-size: 18px;
  color: #666;
  margin-bottom: 30px;
}

/* TABS */
.tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 30px;
}

.tab {
  background-color: white;
  border: 2px solid #5bc9ab;
  color: #5bc9ab;
  padding: 12px 25px;
  border-radius: 10px 10px 0 0;
  font-family: "Patrick Hand", cursive;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.tab.active {
  background-color: #5bc9ab;
  color: white;
}

.tab-content {
  background: white;
  border-radius: 0 15px 15px 15px;
  padding: 30px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.section-title {
  font-family: "Caveat", cursive;
  font-size: 32px;
  font-weight: 700;
  color: #2c2c2c;
  margin-bottom: 25px;
}

/* MODO SELECTOR */
.modo-selector {
  display: flex;
  gap: 30px;
  margin-bottom: 25px;
  padding: 15px;
  background-color: #f9f9f9;
  border-radius: 10px;
}

.modo-selector label {
  font-family: "Patrick Hand", cursive;
  font-size: 16px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.modo-selector input[type="radio"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

/* FORMULARIO */
.form-horario {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-family: "Patrick Hand", cursive;
  font-size: 16px;
  font-weight: 600;
  color: #2c2c2c;
}

.form-group input,
.form-group select {
  padding: 12px;
  border: 2px solid #ddd;
  border-radius: 10px;
  font-family: "Patrick Hand", cursive;
  font-size: 15px;
  transition: border-color 0.3s;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #5bc9ab;
}

.dias-semana {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

.dias-semana label {
  display: flex;
  align-items: center;
  gap: 5px;
  font-family: "Patrick Hand", cursive;
  font-size: 15px;
  cursor: pointer;
}

.preview-info {
  background-color: #e3f2fd;
  padding: 15px;
  border-radius: 10px;
  border-left: 4px solid #2196f3;
}

.preview-info p {
  font-family: "Patrick Hand", cursive;
  font-size: 15px;
  margin: 5px 0;
}

.btn-crear {
  background-color: #5bc9ab;
  color: white;
  border: none;
  padding: 15px 30px;
  border-radius: 10px;
  font-family: "Patrick Hand", cursive;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  align-self: flex-start;
}

.btn-crear:hover:not(:disabled) {
  background-color: #4ab89a;
  transform: translateY(-2px);
}

.btn-crear:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* FILTROS */
.filtros {
  display: flex;
  gap: 15px;
  align-items: flex-end;
  margin-bottom: 25px;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 10px;
}

.btn-limpiar {
  background-color: #e0e0e0;
  border: none;
  padding: 12px 20px;
  border-radius: 10px;
  font-family: "Patrick Hand", cursive;
  font-size: 15px;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-limpiar:hover {
  background-color: #d0d0d0;
}

/* TABLA */
.loading,
.sin-datos {
  text-align: center;
  padding: 60px 20px;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid #5bc9ab;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.tabla-horarios {
  width: 100%;
  border-collapse: collapse;
}

.tabla-horarios thead {
  background-color: #5bc9ab;
  color: white;
}

.tabla-horarios th {
  padding: 15px;
  text-align: left;
  font-family: "Patrick Hand", cursive;
  font-size: 16px;
  font-weight: 600;
}

.tabla-horarios td {
  padding: 12px 15px;
  border-bottom: 1px solid #eee;
  font-family: "Patrick Hand", cursive;
  font-size: 15px;
}

.tabla-horarios tbody tr:hover {
  background-color: #f9f9f9;
}

.badge {
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
}

.badge.disponible {
  background-color: #d4edda;
  color: #155724;
}

.badge.ocupado {
  background-color: #f8d7da;
  color: #721c24;
}

.acciones {
  display: flex;
  gap: 10px;
}

.btn-eliminar {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  padding: 5px;
  transition: transform 0.2s;
}

.btn-eliminar:hover {
  transform: scale(1.2);
}

.pagination {
  margin-top: 20px;
  text-align: center;
}

.pagination p {
  font-family: "Patrick Hand", cursive;
  font-size: 15px;
  color: #666;
}

/* RESPONSIVE */
@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }

  .filtros {
    flex-direction: column;
    align-items: stretch;
  }

  .tabla-horarios {
    font-size: 13px;
  }

  .tabla-horarios th,
  .tabla-horarios td {
    padding: 8px;
  }
}
</style>