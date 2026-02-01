<template>
  <div class="reservar-cita-page">
    <main class="main-content">
      <h1 class="title">Reservar Cita</h1>
      <p class="subtitle">
        ¡Es muy fácil! Puedes reservar tu cita buscando por médico o por fecha.
      </p>

      <!-- STEPPER -->
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

      <!-- LABEL DEL PASO -->
      <div class="step-label">
        <p>Paso 3: Seleccione Médico</p>
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
              @click="cambiarCriterio('medico')"
            >
              Buscar por Médico
            </button>
            <button
              class="criterio-btn"
              :class="{ active: criterioBusqueda === 'fecha' }"
              @click="cambiarCriterio('fecha')"
            >
              Buscar por Fecha
            </button>
          </div>
        </div>

        <!-- BÚSQUEDA POR MÉDICO -->
        <div v-if="criterioBusqueda === 'medico'" class="busqueda-medico-container">
          <!-- BUSCADOR DESPLEGABLE -->
          <div class="search-box">
            <div class="search-icon">🔍</div>
            <select v-model="medicoSeleccionado" class="select-medico" @change="alSeleccionarMedicoDropdown">
              <option value="">BUSCAR MÉDICO</option>
              <option v-for="doctor in doctores" :key="doctor.id" :value="doctor">
                Dr(a). {{ doctor.apellido_paterno }} {{ doctor.apellido_materno }} {{ doctor.nombres }}
              </option>
            </select>
            <div class="dropdown-icon">▼</div>
          </div>

          <!-- GRID DE DOCTORES -->
          <div v-if="!cargando && doctores.length > 0" class="doctores-carousel">
            <div class="doctores-scroll">
              <div
                v-for="doctor in doctores"
                :key="doctor.id"
                class="doctor-card-small"
                :class="{ selected: medicoSeleccionado?.id === doctor.id }"
                @click="seleccionarMedicoDirecto(doctor)"
              >
                <div class="doctor-image">
                  <img 
                    v-if="doctor.foto_url" 
                    :src="doctor.foto_url" 
                    :alt="doctor.nombres"
                  />
                  <div v-else class="doctor-placeholder">
                    <svg viewBox="0 0 100 100" fill="none">
                      <circle cx="50" cy="35" r="15" fill="#999"/>
                      <path d="M30 70 Q50 60 70 70 L70 85 Q50 75 30 85 Z" fill="#999"/>
                    </svg>
                  </div>
                </div>
                <div class="doctor-name">
                  Dr(a). {{ doctor.apellido_paterno }} {{ doctor.apellido_materno }} {{ doctor.nombres }}
                </div>
              </div>
            </div>
          </div>

          <!-- SECCIÓN SIMPLIFICADA: CALENDARIO + DOCTOR + HORARIOS -->
          <div v-if="medicoSeleccionado" class="seccion-simplificada">
            
            <!-- INFO DEL CALENDARIO (DEBUG) -->
            <div v-if="!cargandoHorarios" class="info-calendario" :style="{ 
              background: fechasConHorarios.length > 0 ? '#e8f5e9' : '#ffebee', 
              padding: '15px', 
              borderRadius: '10px', 
              marginBottom: '20px', 
              fontSize: '14px',
              border: fechasConHorarios.length > 0 ? '2px solid #4caf50' : '2px solid #f44336'
            }">
              <strong>{{ fechasConHorarios.length > 0 ? '✅' : '⚠️' }} Estado del calendario:</strong><br>
              • Médico seleccionado: {{ medicoSeleccionado.nombres }}<br>
              • Total horarios cargados: {{ todosLosHorariosMedico.length }}<br>
              • Fechas con horarios: {{ fechasConHorarios.length }}<br>
              <span v-if="fechasConHorarios.length > 0" style="color: #2e7d32;">
                ✓ Fechas disponibles: {{ fechasConHorarios.join(', ') }}<br>
                <strong>👆 Haz click en una fecha con el punto morado (●) para ver los horarios</strong>
              </span>
              <span v-else style="color: #c62828;">
                <br><strong>❌ Este médico no tiene horarios disponibles en el sistema</strong><br>
                💡 Por favor selecciona otro médico o contacta al administrador para agregar horarios.
              </span>
            </div>

            <!-- MENSAJE SI NO HAY HORARIOS -->
            <div v-if="!cargandoHorarios && fechasConHorarios.length === 0" class="sin-horarios-medico">
              <div class="icono-sin-horarios">📅</div>
              <h3>Sin horarios disponibles</h3>
              <p>El Dr(a). {{ medicoSeleccionado.apellido_paterno }} {{ medicoSeleccionado.nombres }} no tiene horarios registrados en el sistema.</p>
              <p class="sugerencia">Por favor, selecciona otro médico del listado superior.</p>
            </div>

            <!-- CALENDARIO (solo si hay horarios) -->
            <div v-if="fechasConHorarios.length > 0" class="calendario-simple">
              <div class="calendario-header">
                <button class="btn-mes" @click="cambiarMes(-1)">◀</button>
                <div class="mes-actual">
                  <select v-model="mesActual" class="select-mes" @change="cargarHorariosMedicoMes">
                    <option value="0">ENERO</option>
                    <option value="1">FEBRERO</option>
                    <option value="2">MARZO</option>
                    <option value="3">ABRIL</option>
                    <option value="4">MAYO</option>
                    <option value="5">JUNIO</option>
                    <option value="6">JULIO</option>
                    <option value="7">AGOSTO</option>
                    <option value="8">SEPTIEMBRE</option>
                    <option value="9">OCTUBRE</option>
                    <option value="10">NOVIEMBRE</option>
                    <option value="11">DICIEMBRE</option>
                  </select>
                  <select v-model="anioActual" class="select-anio" @change="cargarHorariosMedicoMes">
                    <option v-for="year in [2026, 2027, 2028]" :key="year" :value="year">
                      {{ year }}
                    </option>
                  </select>
                </div>
                <button class="btn-mes" @click="cambiarMes(1)">▶</button>
              </div>

              <div class="calendario-grid">
                <div class="dia-semana">Do</div>
                <div class="dia-semana">Lu</div>
                <div class="dia-semana">Ma</div>
                <div class="dia-semana">Mi</div>
                <div class="dia-semana">Ju</div>
                <div class="dia-semana">Vi</div>
                <div class="dia-semana">Sa</div>

                <div
                  v-for="dia in diasCalendario"
                  :key="dia.key"
                  class="dia-celda"
                  :class="{ 
                    'otro-mes': !dia.esDelMes,
                    'hoy': dia.esHoy,
                    'seleccionado': dia.fecha === fechaSeleccionadaMedico,
                    'disponible': fechasConHorarios.includes(dia.fecha) && dia.esDelMes,
                    'clickeable': dia.esDelMes
                  }"
                  @click="handleClickDia(dia)"
                  :title="getTituloDia(dia)"
                >
                  {{ dia.numero }}
                </div>
              </div>
            </div>

            <!-- DOCTOR Y HORARIOS DEBAJO -->
            <div class="doctor-horarios-simple">
              
              <!-- CARGANDO HORARIOS INICIALES -->
              <div v-if="cargandoHorarios" class="loading-center">
                <div class="spinner-small"></div>
                <p>Cargando horarios del médico...</p>
              </div>

              <!-- DOCTOR + HORARIOS -->
              <template v-else>
                <!-- NOMBRE DEL DOCTOR -->
                <div class="doctor-info-simple">
                  <div class="doctor-foto-grande">
                    <img 
                      v-if="medicoSeleccionado.foto_url" 
                      :src="medicoSeleccionado.foto_url" 
                      :alt="medicoSeleccionado.nombres"
                    />
                    <div v-else class="doctor-placeholder-grande">
                      <svg viewBox="0 0 200 200" fill="none">
                        <circle cx="100" cy="70" r="30" fill="#999"/>
                        <path d="M60 140 Q100 120 140 140 L140 170 Q100 150 60 170 Z" fill="#999"/>
                      </svg>
                    </div>
                  </div>
                  <h3 class="doctor-nombre-grande">
                    Dr(a). {{ medicoSeleccionado.apellido_paterno }} {{ medicoSeleccionado.apellido_materno }} {{ medicoSeleccionado.nombres }}
                  </h3>
                </div>

                <!-- MENSAJE SI NO HAY FECHA SELECCIONADA -->
                <div v-if="!fechaSeleccionadaMedico" class="mensaje-seleccionar">
                  <p>👆 Selecciona una fecha del calendario para ver los horarios disponibles</p>
                </div>

                <!-- HORARIOS DE LA FECHA SELECCIONADA -->
                <div v-else class="horarios-lista">
                  <div class="fecha-info">
                    <p>📅 {{ formatearFecha(fechaSeleccionadaMedico) }}</p>
                  </div>

                  <div v-if="horariosFechaSeleccionada.length > 0" class="horarios-disponibles">
                    <button
                      v-for="horario in horariosFechaSeleccionada"
                      :key="horario.id"
                      class="horario-btn"
                      :class="{ 
                        selected: horarioSeleccionado?.id === horario.id,
                        disabled: !horario.disponible 
                      }"
                      :disabled="!horario.disponible"
                      @click="seleccionarHorario(horario)"
                    >
                      {{ horario.hora }}
                    </button>
                  </div>
                  <p v-else class="sin-horarios">No hay horarios disponibles para esta fecha</p>
                </div>
              </template>
            </div>

          </div>
        </div>

        <!-- BÚSQUEDA POR FECHA -->
        <div v-else-if="criterioBusqueda === 'fecha'" class="busqueda-fecha-container">
          
          <div class="seccion-simplificada">
            
            <!-- PANEL DE DEBUG PARA FECHA -->
            <div v-if="fechaSeleccionada" class="info-calendario" style="background: #e3f2fd; padding: 15px; border-radius: 10px; margin-bottom: 20px; font-size: 14px;">
              <strong>🔍 DEBUG - Búsqueda por fecha:</strong><br>
              • Fecha seleccionada: {{ fechaSeleccionada }}<br>
              • Especialidad ID: {{ datosPaso2?.idEspecialidad }}<br>
              • Nombre especialidad: {{ datosPaso2?.nombreEspecialidad }}<br>
              • Médicos encontrados: {{ medicosDisponibles.length }}<br>
              • Cargando: {{ cargandoHorarios }}<br>
              <span v-if="medicosDisponibles.length > 0">
                • Médicos: {{ medicosDisponibles.map(m => m.doctor.nombres).join(', ') }}
              </span>
            </div>

            <!-- CALENDARIO -->
            <div class="calendario-simple">
              <div class="calendario-header">
                <button class="btn-mes" @click="cambiarMesFecha(-1)">◀</button>
                <div class="mes-actual">
                  <select v-model="mesActualFecha" class="select-mes" @change="cargarMedicosPorFecha">
                    <option value="0">ENERO</option>
                    <option value="1">FEBRERO</option>
                    <option value="2">MARZO</option>
                    <option value="3">ABRIL</option>
                    <option value="4">MAYO</option>
                    <option value="5">JUNIO</option>
                    <option value="6">JULIO</option>
                    <option value="7">AGOSTO</option>
                    <option value="8">SEPTIEMBRE</option>
                    <option value="9">OCTUBRE</option>
                    <option value="10">NOVIEMBRE</option>
                    <option value="11">DICIEMBRE</option>
                  </select>
                  <select v-model="anioActualFecha" class="select-anio" @change="cargarMedicosPorFecha">
                    <option v-for="year in [2026, 2027, 2028]" :key="year" :value="year">
                      {{ year }}
                    </option>
                  </select>
                </div>
                <button class="btn-mes" @click="cambiarMesFecha(1)">▶</button>
              </div>

              <div class="calendario-grid">
                <div class="dia-semana">Do</div>
                <div class="dia-semana">Lu</div>
                <div class="dia-semana">Ma</div>
                <div class="dia-semana">Mi</div>
                <div class="dia-semana">Ju</div>
                <div class="dia-semana">Vi</div>
                <div class="dia-semana">Sa</div>

                <div
                  v-for="dia in diasCalendarioFecha"
                  :key="dia.key"
                  class="dia-celda"
                  :class="{ 
                    'otro-mes': !dia.esDelMes,
                    'hoy': dia.esHoy,
                    'seleccionado': dia.fecha === fechaSeleccionada,
                    'clickeable': dia.esDelMes && dia.tieneHorarios
                  }"
                  @click="dia.esDelMes && seleccionarFecha(dia.fecha)"
                  :title="dia.esDelMes ? (dia.tieneHorarios ? 'Click para ver médicos disponibles' : 'Sin médicos disponibles') : ''"
                >
                  {{ dia.numero }}
                </div>
              </div>
            </div>

            <!-- MÉDICOS Y HORARIOS -->
            <div class="doctor-horarios-simple">
              
              <!-- MENSAJE INICIAL -->
              <div v-if="!fechaSeleccionada" class="mensaje-seleccionar">
                <p>👆 Selecciona una fecha del calendario para ver los médicos disponibles</p>
              </div>

              <!-- CARGANDO -->
              <div v-else-if="cargandoHorarios" class="loading-center">
                <div class="spinner-small"></div>
                <p>Buscando médicos disponibles...</p>
              </div>

              <!-- LISTA DE MÉDICOS CON HORARIOS -->
              <div v-else-if="medicosDisponibles.length > 0">
                <div class="fecha-info">
                  <p>📅 {{ formatearFecha(fechaSeleccionada) }}</p>
                </div>

                <div class="medicos-lista">
                  <div
                    v-for="item in medicosDisponibles"
                    :key="item.doctor.id"
                    class="medico-con-horarios"
                  >
                    <!-- INFO DEL MÉDICO -->
                    <div class="medico-header">
                      <div class="medico-foto-mediana">
                        <img 
                          v-if="item.doctor.foto_url" 
                          :src="item.doctor.foto_url" 
                          :alt="item.doctor.nombres"
                        />
                        <div v-else class="doctor-placeholder-mediano">
                          <svg viewBox="0 0 100 100" fill="none">
                            <circle cx="50" cy="35" r="15" fill="#999"/>
                            <path d="M30 70 Q50 60 70 70 L70 85 Q50 75 30 85 Z" fill="#999"/>
                          </svg>
                        </div>
                      </div>
                      <h4 class="medico-nombre-mediano">
                        Dr(a). {{ item.doctor.apellido_paterno }} {{ item.doctor.apellido_materno }} {{ item.doctor.nombres }}
                      </h4>
                    </div>

                    <!-- HORARIOS DEL MÉDICO -->
                    <div class="horarios-medico">
                      <button
                        v-for="horario in item.horarios"
                        :key="horario.id"
                        class="horario-btn"
                        :class="{ 
                          selected: horarioSeleccionado?.id === horario.id,
                          disabled: !horario.disponible 
                        }"
                        :disabled="!horario.disponible"
                        @click="seleccionarHorarioFecha(horario, item.doctor)"
                      >
                        {{ horario.hora }}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- SIN MÉDICOS -->
              <div v-else class="sin-horarios-medico">
                <div class="icono-sin-horarios">📅</div>
                <h3>Sin médicos disponibles</h3>
                <p>No hay médicos con horarios disponibles para {{ formatearFecha(fechaSeleccionada) }}</p>
                <p class="sugerencia">Por favor, selecciona otra fecha.</p>
              </div>

            </div>
          </div>

        </div>

        <!-- BOTONES DE ACCIÓN -->
        <div class="action-buttons" v-if="criterioBusqueda">
          <!-- Panel de estado (para debugging) -->
          <div style="width: 100%; background: #f0f0f0; padding: 10px; border-radius: 10px; margin-bottom: 15px; font-size: 14px;">
            <strong>Estado del botón:</strong><br>
            ✓ Horario seleccionado: {{ horarioSeleccionado ? 'SÍ (ID: ' + horarioSeleccionado.id + ')' : 'NO' }}<br>
            ✓ Médico seleccionado: {{ medicoSeleccionado ? 'SÍ (ID: ' + medicoSeleccionado.id + ')' : 'NO' }}<br>
            ✓ Guardando: {{ guardandoCita ? 'SÍ' : 'NO' }}<br>
            ✓ Botón habilitado: {{ horarioSeleccionado && !guardandoCita ? 'SÍ' : 'NO' }}
          </div>
          
          <button class="btn-regresar" @click="regresarPaso2" :disabled="guardandoCita">
            Regresar
          </button>
          <button
            class="btn-continuar"
            :disabled="!horarioSeleccionado || guardandoCita"
            @click="continuarPasoFinal"
            :title="!horarioSeleccionado ? 'Debes seleccionar un horario primero' : 'Continuar al siguiente paso'"
          >
            <span v-if="guardandoCita">⏳ Guardando...</span>
            <span v-else-if="!horarioSeleccionado">⚠️ Selecciona un horario</span>
            <span v-else>✓ Continuar</span>
          </button>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { doctorService } from "../../services/doctorService";
import { horarioService } from "../../services/horarioService";
import { supabase } from "../../lib/supabaseClient";

const router = useRouter();

const cargando = ref(false);
const cargandoHorarios = ref(false);
const guardandoCita = ref(false);
const criterioBusqueda = ref<"medico" | "fecha" | null>(null);
const datosPaso2 = ref<any>(null);

// Búsqueda por médico
const doctores = ref<any[]>([]);
const medicoSeleccionado = ref<any>(null);
const mesActual = ref(new Date().getMonth());
const anioActual = ref(new Date().getFullYear());
const fechaSeleccionadaMedico = ref("");
const todosLosHorariosMedico = ref<any[]>([]);
const horariosFechaSeleccionada = ref<any[]>([]);
const fechasConHorarios = ref<string[]>([]);
const horarioSeleccionado = ref<any>(null);

// Búsqueda por fecha
const mesActualFecha = ref(new Date().getMonth());
const anioActualFecha = ref(new Date().getFullYear());
const fechaSeleccionada = ref("");
const medicosDisponibles = ref<any[]>([]);

const diasCalendario = computed(() => {
  return generarDiasCalendario(anioActual.value, mesActual.value);
});

const diasCalendarioFecha = computed(() => {
  return generarDiasCalendario(anioActualFecha.value, mesActualFecha.value);
});

function generarDiasCalendario(anio: number, mes: number) {
  const primerDia = new Date(anio, mes, 1);
  const ultimoDia = new Date(anio, mes + 1, 0);
  const dias: any[] = [];

  // Días del mes anterior
  const diaSemanaInicio = primerDia.getDay();
  for (let i = diaSemanaInicio - 1; i >= 0; i--) {
    const fecha = new Date(primerDia);
    fecha.setDate(fecha.getDate() - i - 1);
    const fechaStr = fecha.toISOString().split("T")[0]!;
    dias.push({
      key: `prev-${i}`,
      numero: fecha.getDate(),
      fecha: fechaStr,
      esDelMes: false,
      esHoy: false,
      tieneHorarios: false,
    });
  }

  // Días del mes actual
  const hoy = new Date().toISOString().split("T")[0]!;
  for (let dia = 1; dia <= ultimoDia.getDate(); dia++) {
    const fecha = new Date(anio, mes, dia);
    const fechaStr = fecha.toISOString().split("T")[0]!;
    dias.push({
      key: `curr-${dia}`,
      numero: dia,
      fecha: fechaStr,
      esDelMes: true,
      esHoy: fechaStr === hoy,
      tieneHorarios: fechaStr >= hoy,
    });
  }

  // Días del mes siguiente
  const diasRestantes = 42 - dias.length;
  for (let i = 1; i <= diasRestantes; i++) {
    const fecha = new Date(anio, mes + 1, i);
    const fechaStr = fecha.toISOString().split("T")[0]!;
    dias.push({
      key: `next-${i}`,
      numero: i,
      fecha: fechaStr,
      esDelMes: false,
      esHoy: false,
      tieneHorarios: false,
    });
  }

  return dias;
}

onMounted(() => {
  const paso2Str = sessionStorage.getItem("datosPaso2");
  if (paso2Str) {
    datosPaso2.value = JSON.parse(paso2Str);
  } else {
    alert("No se encontraron datos del paso anterior");
    router.push({ name: "ReservarCita" });
  }
});

async function cambiarCriterio(criterio: "medico" | "fecha") {
  criterioBusqueda.value = criterio;
  medicoSeleccionado.value = null;
  horarioSeleccionado.value = null;
  fechaSeleccionada.value = "";
  fechaSeleccionadaMedico.value = "";
  medicosDisponibles.value = [];

  if (criterio === "medico") {
    await cargarDoctores();
  }
}

async function cargarDoctores() {
  cargando.value = true;
  try {
    const { data, error } = await doctorService.obtenerDoctoresPorEspecialidad(
      datosPaso2.value.idEspecialidad
    );
    if (error) {
      alert("Error al cargar doctores: " + error);
    } else {
      doctores.value = data || [];
    }
  } finally {
    cargando.value = false;
  }
}

async function seleccionarMedicoDirecto(doctor: any) {
  medicoSeleccionado.value = doctor;
  fechaSeleccionadaMedico.value = "";
  horarioSeleccionado.value = null;
  await cargarHorariosMedicoMes();
}

async function alSeleccionarMedicoDropdown() {
  if (medicoSeleccionado.value) {
    fechaSeleccionadaMedico.value = "";
    horarioSeleccionado.value = null;
    await cargarHorariosMedicoMes();
  }
}

async function cargarHorariosMedicoMes() {
  if (!medicoSeleccionado.value) return;
  
  console.log("🔄 Cargando horarios del médico:", medicoSeleccionado.value.id);
  cargandoHorarios.value = true;
  
  try {
    const { data, error } = await horarioService.obtenerHorariosPorDoctor(
      medicoSeleccionado.value.id
    );
    
    console.log("📡 Respuesta del servicio:");
    console.log("  - Error:", error);
    console.log("  - Data:", data);
    console.log("  - Cantidad de horarios:", data?.length || 0);
    
    if (error) {
      console.error("❌ Error al cargar horarios:", error);
      alert("Error al cargar horarios: " + error);
      todosLosHorariosMedico.value = [];
      fechasConHorarios.value = [];
    } else {
      todosLosHorariosMedico.value = data || [];
      
      // Obtener fechas únicas que tienen horarios
      const fechas = new Set(data?.map((h: any) => h.fecha) || []);
      fechasConHorarios.value = Array.from(fechas);
      
      console.log("✅ Horarios del médico cargados:", todosLosHorariosMedico.value);
      console.log("📅 Fechas con horarios:", fechasConHorarios.value);
      console.log("📊 Total fechas disponibles:", fechasConHorarios.value.length);
      
      // Debug: mostrar estructura de un horario
      if (data && data.length > 0) {
        console.log("🔍 Ejemplo de horario:", data[0]);
      }
    }
  } finally {
    cargandoHorarios.value = false;
    console.log("✅ Carga de horarios completada");
  }
}

function seleccionarFechaMedico(fecha: string) {
  console.log("🗓️ Fecha seleccionada:", fecha);
  console.log("📋 Todos los horarios del médico:", todosLosHorariosMedico.value);
  
  fechaSeleccionadaMedico.value = fecha;
  horarioSeleccionado.value = null;
  
  // Filtrar horarios de la fecha seleccionada
  horariosFechaSeleccionada.value = todosLosHorariosMedico.value.filter(
    (h: any) => h.fecha === fecha
  );
  
  console.log("✅ Horarios filtrados para", fecha, ":", horariosFechaSeleccionada.value);
  console.log("📊 Cantidad de horarios:", horariosFechaSeleccionada.value.length);
}

function handleClickDia(dia: any) {
  console.log("🖱️ Click en día:", dia);
  console.log("  - Fecha:", dia.fecha);
  console.log("  - Es del mes:", dia.esDelMes);
  console.log("  - Está en fechasConHorarios:", fechasConHorarios.value.includes(dia.fecha));
  console.log("  - fechasConHorarios completo:", fechasConHorarios.value);
  
  if (!dia.esDelMes) {
    console.log("⚠️ Día no es del mes actual");
    return;
  }
  
  if (fechasConHorarios.value.length === 0) {
    console.log("⚠️ El médico no tiene horarios disponibles");
    alert('❌ Este médico no tiene horarios disponibles.\n\n💡 Por favor selecciona otro médico.');
    return;
  }
  
  if (!fechasConHorarios.value.includes(dia.fecha)) {
    console.log("⚠️ Esta fecha no tiene horarios disponibles");
    const fechasDisponibles = fechasConHorarios.value.join('\n• ');
    alert(`⚠️ La fecha ${formatearFecha(dia.fecha)} no tiene horarios disponibles.\n\n✅ Fechas con horarios:\n• ${fechasDisponibles}`);
    return;
  }
  
  console.log("✅ Fecha válida, seleccionando...");
  seleccionarFechaMedico(dia.fecha);
}

function getTituloDia(dia: any): string {
  if (!dia.esDelMes) return "Día de otro mes";
  if (fechasConHorarios.value.includes(dia.fecha)) {
    return `${dia.fecha} - Tiene horarios disponibles (click para ver)`;
  }
  return `${dia.fecha} - Sin horarios disponibles`;
}

function seleccionarHorario(horario: any) {
  horarioSeleccionado.value = horario;
}

function cambiarMes(delta: number) {
  mesActual.value += delta;
  if (mesActual.value > 11) {
    mesActual.value = 0;
    anioActual.value++;
  } else if (mesActual.value < 0) {
    mesActual.value = 11;
    anioActual.value--;
  }
  if (medicoSeleccionado.value) {
    cargarHorariosMedicoMes();
  }
}

function cambiarMesFecha(delta: number) {
  mesActualFecha.value += delta;
  if (mesActualFecha.value > 11) {
    mesActualFecha.value = 0;
    anioActualFecha.value++;
  } else if (mesActualFecha.value < 0) {
    mesActualFecha.value = 11;
    anioActualFecha.value--;
  }
  // Limpiar selección al cambiar de mes
  fechaSeleccionada.value = "";
  medicosDisponibles.value = [];
}

async function cargarMedicosPorFecha() {
  // Esta función se puede usar en el futuro para pre-cargar datos del mes
  console.log("📅 Mes cambiado:", mesActualFecha.value, anioActualFecha.value);
}

async function seleccionarFecha(fecha: string) {
  console.log("════════════════════════════════════════");
  console.log("🗓️ SELECCIONAR FECHA - INICIO");
  console.log("════════════════════════════════════════");
  console.log("📅 Fecha seleccionada:", fecha);
  
  fechaSeleccionada.value = fecha;
  medicoSeleccionado.value = null;
  horarioSeleccionado.value = null;
  cargandoHorarios.value = true;
  
  try {
    console.log("📦 Datos del paso 2:", datosPaso2.value);
    console.log("🏥 ID Especialidad:", datosPaso2.value.idEspecialidad);
    console.log("📋 Nombre Especialidad:", datosPaso2.value.nombreEspecialidad);
    
    console.log("🔍 Llamando a horarioService.obtenerHorariosPorFecha...");
    console.log("   Parámetros:");
    console.log("   - fecha:", fecha);
    console.log("   - idEspecialidad:", datosPaso2.value.idEspecialidad);
    
    const { data, error } = await horarioService.obtenerHorariosPorFecha(
      fecha,
      datosPaso2.value.idEspecialidad
    );
    
    console.log("📡 RESPUESTA DEL SERVICIO:");
    console.log("   - Error:", error);
    console.log("   - Data completa:", data);
    console.log("   - Tipo de data:", typeof data);
    console.log("   - Es array:", Array.isArray(data));
    console.log("   - Cantidad de registros:", data?.length || 0);
    
    if (data && data.length > 0) {
      console.log("✅ Datos recibidos:");
      data.forEach((item: any, index: number) => {
        console.log(`   [${index}]:`, item);
      });
    }
    
    if (error) {
      console.error("❌ ERROR:", error);
      alert("Error al buscar horarios: " + JSON.stringify(error));
      medicosDisponibles.value = [];
    } else {
      console.log("🔄 Agrupando horarios por doctor...");
      
      // Agrupar horarios por doctor
      const horariosAgrupados = (data || []).reduce((acc: any, h: any) => {
        console.log("   Procesando horario:", h);
        console.log("   - Doctor ID:", h.doctor?.id);
        console.log("   - Doctor completo:", h.doctor);
        
        if (!acc[h.doctor.id]) {
          acc[h.doctor.id] = { doctor: h.doctor, horarios: [] };
        }
        acc[h.doctor.id].horarios.push(h);
        return acc;
      }, {});
      
      console.log("📊 Horarios agrupados:", horariosAgrupados);
      
      medicosDisponibles.value = Object.values(horariosAgrupados);
      
      console.log("✅ Resultado final:");
      console.log("   - Médicos disponibles:", medicosDisponibles.value);
      console.log("   - Total médicos:", medicosDisponibles.value.length);
      
      if (medicosDisponibles.value.length > 0) {
        console.log("👨‍⚕️ Detalle de médicos:");
        medicosDisponibles.value.forEach((item: any, index: number) => {
          console.log(`   [${index}] ${item.doctor.nombres}:`, item.horarios.length, "horarios");
        });
      } else {
        console.log("⚠️ No se encontraron médicos disponibles");
      }
    }
  } catch (err) {
    console.error("💥 EXCEPCIÓN CAPTURADA:", err);
    alert("Error inesperado: " + err);
  } finally {
    cargandoHorarios.value = false;
    console.log("════════════════════════════════════════");
    console.log("🗓️ SELECCIONAR FECHA - FIN");
    console.log("════════════════════════════════════════");
  }
}

function seleccionarMedicoFecha(item: any) {
  medicoSeleccionado.value = item.doctor;
}

function seleccionarHorarioFecha(horario: any, doctor: any) {
  horarioSeleccionado.value = horario;
  medicoSeleccionado.value = doctor;
}

function formatearFecha(fecha: string): string {
  const date = new Date(fecha + 'T00:00:00');
  const opciones: Intl.DateTimeFormatOptions = { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  return date.toLocaleDateString('es-ES', opciones);
}

function formatearFechaLarga(fecha: string): string {
  const date = new Date(fecha + 'T00:00:00');
  const opciones: Intl.DateTimeFormatOptions = { 
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  };
  return date.toLocaleDateString('es-PE', opciones);
}

function regresarPaso2() {
  router.push({ name: "ReservarCitaPaso2" });
}

async function continuarPasoFinal() {
  console.log("🔵 BOTÓN CONTINUAR CLICKEADO");
  console.log("📊 Estado actual:");
  console.log("  - horarioSeleccionado:", horarioSeleccionado.value);
  console.log("  - medicoSeleccionado:", medicoSeleccionado.value);
  console.log("  - guardandoCita:", guardandoCita.value);
  
  if (!horarioSeleccionado.value || !medicoSeleccionado.value) {
    console.log("⚠️ Falta seleccionar horario o médico");
    alert("Por favor selecciona un horario");
    return;
  }

  console.log("✅ Validación pasada, iniciando guardado...");
  guardandoCita.value = true;

  try {
    const pacienteStr = sessionStorage.getItem("pacienteSeleccionado");
    const paso2Str = sessionStorage.getItem("datosPaso2");
    
    console.log("📦 Datos del sessionStorage:");
    console.log("  - pacienteSeleccionado:", pacienteStr);
    console.log("  - datosPaso2:", paso2Str);
    
    if (!pacienteStr) {
      console.log("❌ No hay datos de paciente en sessionStorage");
      alert("Error: No se encontraron datos del paciente");
      router.push({ name: "ReservarCita" });
      return;
    }

    const pacienteSeleccionado = JSON.parse(pacienteStr);
    const datosPaso2Local = JSON.parse(paso2Str || "{}");

    console.log("📋 Datos para crear cita:", {
      paciente: pacienteSeleccionado,
      medico: medicoSeleccionado.value,
      horario: horarioSeleccionado.value
    });

    console.log("💾 Insertando en base de datos...");
    const { data: nuevaCita, error } = await supabase
      .from("cita")
      .insert({
        fecha: horarioSeleccionado.value.fecha,
        hora: horarioSeleccionado.value.hora,
        descripcion: `Consulta de ${datosPaso2Local.nombreEspecialidad || 'Medicina General'}`,
        estado: 1,
        idhorario: horarioSeleccionado.value.id,
        idpaciente: pacienteSeleccionado.id,
        iddoctor: medicoSeleccionado.value.id,
      })
      .select()
      .single();

    if (error) {
      console.error("❌ Error al crear cita:", error);
      alert("Error al reservar la cita: " + error.message);
      guardandoCita.value = false;
      return;
    }

    console.log("✅ Cita creada exitosamente:", nuevaCita);

    const datosCitaCompletos = {
      paciente: `${pacienteSeleccionado.nombres} ${pacienteSeleccionado.apellido_paterno} ${pacienteSeleccionado.apellido_materno}`,
      especialidad: datosPaso2Local.nombreEspecialidad || 'Medicina General',
      medico: `Dr(a). ${medicoSeleccionado.value.apellido_paterno} ${medicoSeleccionado.value.apellido_materno} ${medicoSeleccionado.value.nombres}`,
      sede: medicoSeleccionado.value.sede || 'Sede Principal - Lima',
      consultorio: 'Consultorio 3B',
      fechaHora: `${formatearFechaLarga(horarioSeleccionado.value.fecha)} - ${horarioSeleccionado.value.hora}`,
      precio: '132.00',
      doctor: medicoSeleccionado.value,
      horario: horarioSeleccionado.value,
      cita: nuevaCita,
    };

    sessionStorage.setItem("datosPaso3", JSON.stringify(datosCitaCompletos));

    console.log("🔄 Redirigiendo al Paso 4...");
    console.log("📦 Datos guardados en sessionStorage:", datosCitaCompletos);
    
    router.push({ name: "ReservarCitaPaso4" });
    
  } catch (error: any) {
    console.error("❌ Error inesperado:", error);
    alert("Error inesperado: " + error.message);
    guardandoCita.value = false;
  }
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
  padding-bottom: 50px;
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
  font-size: clamp(15px, 2.5vw, 18px);
  text-align: center;
  margin-bottom: 40px;
  color: #2c2c2c;
}

/* STEPPER */
.stepper {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
  gap: 0;
}

.step {
  display: flex;
  align-items: center;
}

.step-circle {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: #d9d9d9;
  border: 3px solid #999;
}

.step-circle.completed {
  background-color: #4caf50;
  border-color: #4caf50;
}

.step-circle.active {
  background-color: #2196f3;
  border-color: #2196f3;
}

.step-line {
  width: 80px;
  height: 3px;
  background-color: #d9d9d9;
}

.step-line.completed {
  background-color: #4caf50;
}

.step-label {
  text-align: center;
  margin-bottom: 30px;
}

.step-label p {
  font-family: "Patrick Hand", cursive;
  font-size: 18px;
  color: #2c2c2c;
  font-weight: 600;
}

/* FORMULARIO */
.form-container {
  background-color: white;
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.section {
  margin-bottom: 30px;
}

.section-title {
  font-family: "Patrick Hand", cursive;
  font-size: 24px;
  color: #2c2c2c;
  margin-bottom: 20px;
  text-align: center;
}

/* BOTONES DE CRITERIO */
.criterio-buttons {
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;
}

.criterio-btn {
  font-family: "Patrick Hand", cursive;
  font-size: 18px;
  padding: 15px 40px;
  border: 3px solid #6b2c91;
  background-color: white;
  color: #6b2c91;
  border-radius: 30px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
}

.criterio-btn:hover {
  background-color: #f3e5f5;
  transform: translateY(-2px);
}

.criterio-btn.active {
  background-color: #6b2c91;
  color: white;
}

/* BUSCADOR DESPLEGABLE */
.search-box {
  position: relative;
  display: flex;
  align-items: center;
  background-color: #6b2c91;
  border: none;
  border-radius: 15px;
  padding: 15px 25px;
  margin-bottom: 30px;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
  box-shadow: 0 4px 15px rgba(107, 44, 145, 0.3);
}

.search-icon {
  font-size: 24px;
  margin-right: 15px;
  color: white;
  background-color: #ff8c42;
  width: 45px;
  height: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
}

.select-medico {
  flex: 1;
  border: none;
  outline: none;
  font-family: "Patrick Hand", cursive;
  font-size: 18px;
  background-color: transparent;
  cursor: pointer;
  appearance: none;
  color: white;
  font-weight: 600;
}

.select-medico option {
  background-color: white;
  color: #2c2c2c;
}

.dropdown-icon {
  font-size: 18px;
  color: white;
  pointer-events: none;
}

/* GRID DE DOCTORES */
.doctores-carousel {
  overflow-x: auto;
  margin-bottom: 40px;
  padding: 10px 0;
}

.doctores-scroll {
  display: flex;
  gap: 20px;
  padding: 10px;
  min-width: min-content;
}

.doctor-card-small {
  flex: 0 0 auto;
  width: 180px;
  background-color: white;
  border: 3px solid #ddd;
  border-radius: 15px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.doctor-card-small:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.15);
  border-color: #6b2c91;
}

.doctor-card-small.selected {
  border-color: #6b2c91;
  background-color: #f3e5f5;
}

.doctor-image {
  width: 100px;
  height: 100px;
  margin: 0 auto 15px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid #6b2c91;
}

.doctor-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.doctor-placeholder {
  width: 100%;
  height: 100%;
  background-color: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.doctor-placeholder svg {
  width: 60%;
  height: 60%;
}

.doctor-name {
  font-family: "Patrick Hand", cursive;
  font-size: 14px;
  color: #2c2c2c;
  line-height: 1.3;
  font-weight: 600;
}

/* CALENDARIO */
.calendario-container {
  background-color: #f9f9f9;
  border-radius: 15px;
  padding: 30px;
  margin-bottom: 30px;
}

.sin-horarios-medico {
  text-align: center;
  padding: 60px 40px;
  background: white;
  border-radius: 15px;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.1);
}

.icono-sin-horarios {
  font-size: 80px;
  margin-bottom: 20px;
  opacity: 0.5;
}

.sin-horarios-medico h3 {
  font-family: "Patrick Hand", cursive;
  font-size: 28px;
  color: #2c2c2c;
  margin-bottom: 15px;
}

.sin-horarios-medico p {
  font-family: "Patrick Hand", cursive;
  font-size: 18px;
  color: #666;
  margin-bottom: 10px;
  line-height: 1.5;
}

.sin-horarios-medico .sugerencia {
  color: #6b2c91;
  font-weight: 600;
  font-size: 20px;
  margin-top: 25px;
}

/* DISEÑO SIMPLIFICADO */
.seccion-simplificada {
  margin-top: 40px;
  max-width: 900px;
  margin-left: auto;
  margin-right: auto;
}

.calendario-simple {
  background-color: #f9f9f9;
  border-radius: 15px;
  padding: 30px;
  margin-bottom: 30px;
}

.doctor-horarios-simple {
  background-color: white;
  border-radius: 15px;
  padding: 40px;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.1);
  min-height: 300px;
}

.loading-center {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
}

.loading-center .spinner-small {
  width: 50px;
  height: 50px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid #6b2c91;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

.loading-center p {
  font-family: "Patrick Hand", cursive;
  font-size: 18px;
  color: #666;
  font-weight: 600;
}

.doctor-info-simple {
  text-align: center;
  margin-bottom: 30px;
  padding-bottom: 25px;
  border-bottom: 2px solid #f0f0f0;
}

.doctor-foto-grande {
  width: 140px;
  height: 140px;
  margin: 0 auto 20px;
  border-radius: 50%;
  overflow: hidden;
  border: 5px solid #6b2c91;
}

.doctor-foto-grande img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.doctor-placeholder-grande {
  width: 100%;
  height: 100%;
  background-color: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.doctor-placeholder-grande svg {
  width: 70%;
  height: 70%;
}

.doctor-nombre-grande {
  font-family: "Patrick Hand", cursive;
  font-size: 26px;
  color: #2c2c2c;
  font-weight: 600;
  line-height: 1.3;
}

.mensaje-seleccionar {
  text-align: center;
  padding: 40px 20px;
}

.mensaje-seleccionar p {
  font-family: "Patrick Hand", cursive;
  font-size: 18px;
  color: #666;
  background-color: #f3e5f5;
  padding: 20px;
  border-radius: 15px;
  border: 2px dashed #6b2c91;
  display: inline-block;
}

.horarios-lista {
  margin-top: 20px;
}

.fecha-info {
  text-align: center;
  margin-bottom: 25px;
  padding: 15px;
  background-color: #fff3e0;
  border-radius: 10px;
  border: 2px solid #ff8c42;
}

.fecha-info p {
  font-family: "Patrick Hand", cursive;
  font-size: 20px;
  color: #ff8c42;
  font-weight: 600;
  margin: 0;
}

.horarios-disponibles {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 15px;
  margin-top: 20px;
}

.horario-btn {
  font-family: "Patrick Hand", cursive;
  font-size: 20px;
  font-weight: 600;
  padding: 20px;
  border: 3px solid #6b2c91;
  background-color: white;
  color: #6b2c91;
  border-radius: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.horario-btn:hover:not(.disabled) {
  background-color: #f3e5f5;
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(107, 44, 145, 0.3);
}

.horario-btn.selected {
  background-color: #6b2c91;
  color: white;
  box-shadow: 0 5px 15px rgba(107, 44, 145, 0.4);
}

.horario-btn.disabled {
  opacity: 0.4;
  cursor: not-allowed;
  border-color: #ccc;
  color: #999;
}

.sin-horarios {
  font-family: "Patrick Hand", cursive;
  font-size: 18px;
  text-align: center;
  color: #999;
  padding: 40px;
  background-color: #f9f9f9;
  border-radius: 10px;
}

.calendario-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}

.btn-mes {
  background-color: #2196f3;
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  cursor: pointer;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.btn-mes:hover {
  background-color: #1976d2;
  transform: scale(1.1);
}

.mes-actual {
  display: flex;
  gap: 15px;
}

.select-mes,
.select-anio {
  font-family: "Patrick Hand", cursive;
  font-size: 18px;
  font-weight: 600;
  padding: 10px 15px;
  border: 2px solid #6b2c91;
  border-radius: 10px;
  background-color: white;
  cursor: pointer;
  outline: none;
  color: #6b2c91;
}

.calendario-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 10px;
}

.dia-semana {
  font-family: "Patrick Hand", cursive;
  font-size: 16px;
  font-weight: 600;
  text-align: center;
  padding: 10px;
  color: #6b2c91;
}

.dia-celda {
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: "Patrick Hand", cursive;
  font-size: 16px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: white;
  border: 2px solid #ddd;
  position: relative;
}

.dia-celda.clickeable {
  cursor: pointer;
}

.dia-celda.otro-mes {
  color: #ccc;
  background-color: #f5f5f5;
  cursor: default;
}

.dia-celda.hoy {
  border-color: #ff8c42;
  font-weight: 700;
  background-color: #fff3e0;
}

.dia-celda.disponible {
  cursor: pointer;
  border-color: #6b2c91;
  font-weight: 600;
  color: #6b2c91;
  background-color: #f3e5f5;
}

.dia-celda.disponible::after {
  content: '●';
  position: absolute;
  bottom: 3px;
  right: 3px;
  font-size: 8px;
  color: #6b2c91;
}

.dia-celda.disponible:hover {
  background-color: #e1bee7;
  transform: scale(1.1);
  box-shadow: 0 3px 10px rgba(107, 44, 145, 0.3);
}

.dia-celda.seleccionado {
  background-color: #ff8c42;
  color: white;
  border-color: #ff8c42;
  font-weight: 700;
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(255, 140, 66, 0.4);
}

/* HORARIOS */
.loading-horarios {
  text-align: center;
  padding: 40px;
}

.spinner-small {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #6b2c91;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 15px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-horarios p {
  font-family: "Patrick Hand", cursive;
  font-size: 16px;
  color: #666;
}

.horarios-grid-vertical {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 20px;
  max-height: 400px;
  overflow-y: auto;
  padding-right: 10px;
}

.horarios-grid-vertical::-webkit-scrollbar {
  width: 6px;
}

.horarios-grid-vertical::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.horarios-grid-vertical::-webkit-scrollbar-thumb {
  background: #2196f3;
  border-radius: 10px;
}

.horarios-grid-vertical::-webkit-scrollbar-thumb:hover {
  background: #1976d2;
}

.horario-card {
  font-family: "Patrick Hand", cursive;
  font-size: 18px;
  font-weight: 600;
  padding: 15px;
  border: 3px solid #6b2c91;
  background-color: white;
  color: #6b2c91;
  border-radius: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.horario-card:hover:not(.disabled) {
  background-color: #f3e5f5;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(107, 44, 145, 0.3);
}

.horario-card.selected {
  background-color: #6b2c91;
  color: white;
}

.horario-card.disabled {
  opacity: 0.4;
  cursor: not-allowed;
  border-color: #ccc;
  color: #999;
}

.no-horarios {
  font-family: "Patrick Hand", cursive;
  font-size: 18px;
  text-align: center;
  color: #999;
  padding: 40px;
}

/* BÚSQUEDA POR FECHA */
.busqueda-fecha-container {
  margin-top: 30px;
}

.medicos-lista {
  margin-top: 25px;
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.medico-con-horarios {
  background-color: #f9f9f9;
  border-radius: 15px;
  padding: 25px;
  border: 2px solid #e0e0e0;
  transition: all 0.3s ease;
}

.medico-con-horarios:hover {
  border-color: #6b2c91;
  box-shadow: 0 4px 15px rgba(107, 44, 145, 0.15);
}

.medico-header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 2px solid #e0e0e0;
}

.medico-foto-mediana {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid #6b2c91;
  flex-shrink: 0;
}

.medico-foto-mediana img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.doctor-placeholder-mediano {
  width: 100%;
  height: 100%;
  background-color: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.doctor-placeholder-mediano svg {
  width: 60%;
  height: 60%;
}

.medico-nombre-mediano {
  font-family: "Patrick Hand", cursive;
  font-size: 22px;
  color: #2c2c2c;
  font-weight: 600;
  line-height: 1.3;
  margin: 0;
}

.horarios-medico {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
  gap: 12px;
}

.medicos-fecha-container {
  margin-top: 40px;
}

.fecha-seleccionada-titulo {
  font-family: "Patrick Hand", cursive;
  font-size: 22px;
  color: #2c2c2c;
  text-align: center;
  margin-bottom: 30px;
  font-weight: 600;
}

/* BOTONES DE ACCIÓN */
.action-buttons {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  margin-top: 40px;
  padding-top: 30px;
  border-top: 2px solid #e0e0e0;
}

.btn-regresar,
.btn-continuar {
  font-family: "Patrick Hand", cursive;
  font-size: 18px;
  font-weight: 600;
  padding: 15px 40px;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-regresar {
  background-color: #f5f5f5;
  color: #666;
  border: 2px solid #ddd;
}

.btn-regresar:hover {
  background-color: #e0e0e0;
  transform: translateY(-2px);
}

.btn-continuar {
  background-color: #ff8c42;
  color: white;
  flex: 1;
  max-width: 300px;
  margin-left: auto;
}

.btn-continuar:hover:not(:disabled) {
  background-color: #ff7722;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(255, 140, 66, 0.4);
}

.btn-continuar:disabled {
  background-color: #ccc;
  cursor: not-allowed;
  opacity: 0.6;
}

/* RESPONSIVE */
@media (max-width: 1024px) {
  .seccion-simplificada {
    max-width: 100%;
  }
}

@media (max-width: 768px) {
  .main-content {
    padding: 30px 20px;
  }

  .form-container {
    padding: 25px;
  }

  .criterio-buttons {
    flex-direction: column;
  }

  .criterio-btn {
    width: 100%;
  }

  .doctores-scroll {
    gap: 15px;
  }

  .doctor-card-small {
    width: 150px;
  }

  .calendario-grid {
    gap: 5px;
  }

  .dia-celda {
    font-size: 14px;
  }

  .horarios-disponibles {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 10px;
  }

  .horarios-medico {
    grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
    gap: 10px;
  }

  .medico-header {
    flex-direction: column;
    text-align: center;
  }

  .action-buttons {
    flex-direction: column;
  }

  .btn-continuar {
    max-width: 100%;
  }
}

@media (max-width: 480px) {
  .title {
    font-size: 32px;
  }

  .subtitle {
    font-size: 14px;
  }

  .step-circle {
    width: 25px;
    height: 25px;
  }

  .step-line {
    width: 50px;
  }

  .search-box {
    padding: 10px 15px;
  }

  .select-medico {
    font-size: 14px;
  }

  .calendario-container {
    padding: 20px 10px;
  }

  .btn-mes {
    width: 35px;
    height: 35px;
    font-size: 16px;
  }

  .select-mes,
  .select-anio {
    font-size: 14px;
    padding: 8px 10px;
  }
}
</style>