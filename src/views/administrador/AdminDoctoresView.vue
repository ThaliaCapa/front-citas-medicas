<template>
  <div class="admin-doctores-page">
    <main class="main-content">
      <h1 class="title">Gestión de Doctores</h1>
      <p class="subtitle">
        Administra los médicos de la clínica: crear, editar y asignar especialidades.
      </p>

      <!-- BOTÓN CREAR NUEVO DOCTOR -->
      <div class="header-actions">
        <button class="btn-nuevo" @click="abrirModalCrear">
          ➕ Nuevo Doctor
        </button>
      </div>

      <!-- TABLA DE DOCTORES -->
      <div class="tabla-container">
        <div v-if="cargando" class="loading">
          <div class="spinner"></div>
          <p>Cargando doctores...</p>
        </div>

        <div v-else-if="doctores.length === 0" class="sin-datos">
          <p>📋 No hay doctores registrados</p>
          <button class="btn-crear-primero" @click="abrirModalCrear">
            Crear primer doctor
          </button>
        </div>

        <table v-else class="tabla-doctores">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre Completo</th>
              <th>Documento</th>
              <th>Especialidad</th>
              <th>Sede</th>
              <th>Teléfono</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="doctor in doctores" :key="doctor.id">
              <td>{{ doctor.id }}</td>
              <td>{{ getNombreCompleto(doctor) }}</td>
              <td>{{ doctor.numero_documento }}</td>
              <td>{{ getNombreEspecialidad(doctor.idespecialidad) }}</td>
              <td>{{ doctor.sede || 'Sin asignar' }}</td>
              <td>{{ doctor.telefono || 'N/A' }}</td>
              <td class="acciones">
                <button class="btn-editar" @click="abrirModalEditar(doctor)" title="Editar">
                  ✏️
                </button>
                <button class="btn-eliminar" @click="confirmarEliminar(doctor)" title="Eliminar">
                  🗑️
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- MODAL CREAR/EDITAR DOCTOR -->
      <div v-if="mostrarModal" class="modal-overlay" @click="cerrarModal">
        <div class="modal-content" @click.stop>
          <div class="modal-header">
            <h2>{{ modoEdicion ? 'Editar Doctor' : 'Nuevo Doctor' }}</h2>
            <button class="btn-cerrar" @click="cerrarModal">✖</button>
          </div>

          <form @submit.prevent="guardarDoctor" class="form-doctor">
            <div class="form-row">
              <div class="form-group">
                <label>Nombres *</label>
                <input
                  v-model="formulario.nombres"
                  type="text"
                  required
                  placeholder="Ej: Juan Carlos"
                />
              </div>
              <div class="form-group">
                <label>Apellido Paterno *</label>
                <input
                  v-model="formulario.apellido_paterno"
                  type="text"
                  required
                  placeholder="Ej: García"
                />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Apellido Materno *</label>
                <input
                  v-model="formulario.apellido_materno"
                  type="text"
                  required
                  placeholder="Ej: López"
                />
              </div>
              <div class="form-group">
                <label>Género *</label>
                <select v-model="formulario.genero" required>
                  <option value="">Seleccionar</option>
                  <option value="masculino">Masculino</option>
                  <option value="femenino">Femenino</option>
                </select>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Tipo de Documento *</label>
                <select v-model="formulario.idtipodocumento" required>
                  <option value="">Seleccionar</option>
                  <option v-for="tipo in tiposDocumento" :key="tipo.id" :value="tipo.id">
                    {{ tipo.nombre }}
                  </option>
                </select>
              </div>
              <div class="form-group">
                <label>Número de Documento *</label>
                <input
                  v-model="formulario.numero_documento"
                  type="text"
                  required
                  placeholder="Ej: 12345678"
                  maxlength="20"
                />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Especialidad *</label>
                <select v-model="formulario.idespecialidad" required>
                  <option value="">Seleccionar</option>
                  <option v-for="esp in especialidades" :key="esp.id" :value="esp.id">
                    {{ esp.nombre }}
                  </option>
                </select>
              </div>
              <div class="form-group">
                <label>Sede *</label>
                <select v-model="formulario.sede" required>
                  <option value="">Seleccionar</option>
                  <option value="centro">Centro</option>
                  <option value="los angeles">Los Ángeles</option>
                  <option value="norte">Norte</option>
                </select>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Teléfono</label>
                <input
                  v-model="formulario.telefono"
                  type="tel"
                  placeholder="Ej: 987654321"
                  maxlength="15"
                />
              </div>
              <div class="form-group">
                <label>Fecha de Nacimiento</label>
                <input
                  v-model="formulario.fecha_nacimiento"
                  type="date"
                />
              </div>
            </div>

            <div class="form-actions">
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
import { ref, onMounted } from 'vue';
import { supabase } from '../../lib/supabaseClient';

// Estados
const cargando = ref(false);
const guardando = ref(false);
const mostrarModal = ref(false);
const modoEdicion = ref(false);
const doctorEditando = ref<any>(null);

const doctores = ref<any[]>([]);
const especialidades = ref<any[]>([]);
const tiposDocumento = ref<any[]>([]);

const formulario = ref({
  nombres: '',
  apellido_paterno: '',
  apellido_materno: '',
  numero_documento: '',
  genero: '',
  fecha_nacimiento: '',
  telefono: '',
  sede: '',
  idespecialidad: null as number | null,
  idtipodocumento: null as number | null,
  idrol: 120, // ID del rol "Doctor" - ajusta según tu BD
});

onMounted(async () => {
  await cargarDatos();
});

async function cargarDatos() {
  cargando.value = true;
  try {
    await Promise.all([
      cargarDoctores(),
      cargarEspecialidades(),
      cargarTiposDocumento(),
    ]);
  } catch (error) {
    console.error('Error al cargar datos:', error);
    alert('Error al cargar los datos');
  } finally {
    cargando.value = false;
  }
}

async function cargarDoctores() {
  const { data, error } = await supabase
    .from('persona')
    .select('*')
    .eq('idrol', 120) // Solo doctores
    .order('id', { ascending: false });

  if (error) {
    console.error('Error al cargar doctores:', error);
    throw error;
  }

  doctores.value = data || [];
  console.log('✅ Doctores cargados:', doctores.value.length);
}

async function cargarEspecialidades() {
  const { data, error } = await supabase
    .from('lista')
    .select('id, nombre')
    .eq('idlistavalor', 21) // ID de la lista de especialidades
    .order('nombre');

  if (error) {
    console.error('Error al cargar especialidades:', error);
    throw error;
  }

  especialidades.value = data || [];
  console.log('✅ Especialidades cargadas:', especialidades.value.length);
}

async function cargarTiposDocumento() {
  const { data, error } = await supabase
    .from('lista')
    .select('id, nombre')
    .eq('idlistavalor', 20) // ID de la lista de tipos de documento
    .order('nombre');

  if (error) {
    console.error('Error al cargar tipos de documento:', error);
    throw error;
  }

  tiposDocumento.value = data || [];
  console.log('✅ Tipos de documento cargados:', tiposDocumento.value.length);
}

function getNombreCompleto(doctor: any) {
  return `Dr(a). ${doctor.nombres} ${doctor.apellido_paterno} ${doctor.apellido_materno}`;
}

function getNombreEspecialidad(idEspecialidad: number) {
  const especialidad = especialidades.value.find(e => e.id === idEspecialidad);
  return especialidad ? especialidad.nombre : 'Sin especialidad';
}

function abrirModalCrear() {
  modoEdicion.value = false;
  doctorEditando.value = null;
  resetFormulario();
  mostrarModal.value = true;
}

function abrirModalEditar(doctor: any) {
  modoEdicion.value = true;
  doctorEditando.value = doctor;
  
  // Llenar formulario con datos del doctor
  formulario.value = {
    nombres: doctor.nombres,
    apellido_paterno: doctor.apellido_paterno,
    apellido_materno: doctor.apellido_materno,
    numero_documento: doctor.numero_documento,
    genero: doctor.genero,
    fecha_nacimiento: doctor.fecha_nacimiento || '',
    telefono: doctor.telefono || '',
    sede: doctor.sede || '',
    idespecialidad: doctor.idespecialidad,
    idtipodocumento: doctor.idtipodocumento,
    idrol: 120,
  };
  
  mostrarModal.value = true;
}

function cerrarModal() {
  mostrarModal.value = false;
  resetFormulario();
}

function resetFormulario() {
  formulario.value = {
    nombres: '',
    apellido_paterno: '',
    apellido_materno: '',
    numero_documento: '',
    genero: '',
    fecha_nacimiento: '',
    telefono: '',
    sede: '',
    idespecialidad: null,
    idtipodocumento: null,
    idrol: 120,
  };
}

async function guardarDoctor() {
  guardando.value = true;

  try {
    if (modoEdicion.value && doctorEditando.value) {
      // EDITAR
      const { error } = await supabase
        .from('persona')
        .update({
          nombres: formulario.value.nombres,
          apellido_paterno: formulario.value.apellido_paterno,
          apellido_materno: formulario.value.apellido_materno,
          numero_documento: formulario.value.numero_documento,
          genero: formulario.value.genero,
          fecha_nacimiento: formulario.value.fecha_nacimiento || null,
          telefono: formulario.value.telefono || null,
          sede: formulario.value.sede,
          idespecialidad: formulario.value.idespecialidad,
          idtipodocumento: formulario.value.idtipodocumento,
          fechamodificacion: new Date().toISOString(),
        })
        .eq('id', doctorEditando.value.id);

      if (error) throw error;

      alert('✅ Doctor actualizado exitosamente');
    } else {
      // CREAR
      const { error } = await supabase
        .from('persona')
        .insert({
          ...formulario.value,
          tipo: 'doctor',
          fechacreacion: new Date().toISOString(),
          fechamodificacion: new Date().toISOString(),
        });

      if (error) throw error;

      alert('✅ Doctor creado exitosamente');
    }

    cerrarModal();
    await cargarDoctores();
  } catch (error: any) {
    console.error('Error al guardar doctor:', error);
    alert('❌ Error al guardar: ' + error.message);
  } finally {
    guardando.value = false;
  }
}

async function confirmarEliminar(doctor: any) {
  const confirmar = confirm(
    `¿Estás seguro de eliminar al Dr(a). ${doctor.nombres} ${doctor.apellido_paterno}?\n\nEsta acción no se puede deshacer.`
  );

  if (!confirmar) return;

  try {
    const { error } = await supabase
      .from('persona')
      .delete()
      .eq('id', doctor.id);

    if (error) throw error;

    alert('✅ Doctor eliminado exitosamente');
    await cargarDoctores();
  } catch (error: any) {
    console.error('Error al eliminar doctor:', error);
    alert('❌ Error al eliminar: ' + error.message);
  }
}
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Caveat:wght@400;700&family=Patrick+Hand&display=swap");

.admin-doctores-page {
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

.header-actions {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;
}

.btn-nuevo {
  background-color: #5bc9ab;
  color: white;
  border: none;
  padding: 12px 25px;
  border-radius: 10px;
  font-family: "Patrick Hand", cursive;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-nuevo:hover {
  background-color: #4ab89a;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(91, 201, 171, 0.3);
}

/* TABLA */
.tabla-container {
  background: white;
  border-radius: 15px;
  padding: 25px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.loading {
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

.sin-datos {
  text-align: center;
  padding: 60px 20px;
}

.sin-datos p {
  font-family: "Patrick Hand", cursive;
  font-size: 20px;
  color: #999;
  margin-bottom: 20px;
}

.btn-crear-primero {
  background-color: #5bc9ab;
  color: white;
  border: none;
  padding: 12px 25px;
  border-radius: 10px;
  font-family: "Patrick Hand", cursive;
  font-size: 16px;
  cursor: pointer;
}

.tabla-doctores {
  width: 100%;
  border-collapse: collapse;
}

.tabla-doctores thead {
  background-color: #5bc9ab;
  color: white;
}

.tabla-doctores th {
  padding: 15px;
  text-align: left;
  font-family: "Patrick Hand", cursive;
  font-size: 16px;
  font-weight: 600;
}

.tabla-doctores td {
  padding: 12px 15px;
  border-bottom: 1px solid #eee;
  font-family: "Patrick Hand", cursive;
  font-size: 15px;
}

.tabla-doctores tbody tr:hover {
  background-color: #f9f9f9;
}

.acciones {
  display: flex;
  gap: 10px;
}

.btn-editar,
.btn-eliminar {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  padding: 5px;
  transition: transform 0.2s;
}

.btn-editar:hover,
.btn-eliminar:hover {
  transform: scale(1.2);
}

/* MODAL */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 20px;
  padding: 30px;
  max-width: 700px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
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
  font-weight: 700;
  color: #2c2c2c;
  margin: 0;
}

.btn-cerrar {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #999;
}

.form-doctor {
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

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  margin-top: 20px;
}

.btn-cancelar,
.btn-guardar {
  padding: 12px 25px;
  border: none;
  border-radius: 10px;
  font-family: "Patrick Hand", cursive;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-cancelar {
  background-color: #e0e0e0;
  color: #666;
}

.btn-cancelar:hover {
  background-color: #d0d0d0;
}

.btn-guardar {
  background-color: #5bc9ab;
  color: white;
}

.btn-guardar:hover:not(:disabled) {
  background-color: #4ab89a;
}

.btn-guardar:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* RESPONSIVE */
@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }

  .tabla-doctores {
    font-size: 13px;
  }

  .tabla-doctores th,
  .tabla-doctores td {
    padding: 8px;
  }
}
</style>