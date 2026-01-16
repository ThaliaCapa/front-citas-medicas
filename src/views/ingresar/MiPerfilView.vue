<template>
  <div class="editar-perfil-page">
    <main class="main-content">
      <button class="btn-volver" @click="volver">← Volver</button>
      
      <h1 class="title">Editar Mi Perfil</h1>
      <p class="subtitle">Actualiza tu información personal</p>

      <form @submit.prevent="guardarCambios" class="form-perfil">
        <!-- Información Personal -->
        <div class="seccion">
          <h2 class="seccion-titulo">Información Personal</h2>
          
          <div class="form-row">
            <div class="form-group">
              <label>Nombres</label>
              <input v-model="formData.nombres" type="text" required />
            </div>
            
            <div class="form-group">
              <label>Apellido Paterno</label>
              <input v-model="formData.apellido_paterno" type="text" required />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Apellido Materno</label>
              <input v-model="formData.apellido_materno" type="text" required />
            </div>
            
            <div class="form-group">
              <label>Fecha de Nacimiento</label>
              <input v-model="formData.fecha_nacimiento" type="date" required />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Teléfono</label>
              <input v-model="formData.telefono" type="tel" required />
            </div>
            
            <div class="form-group">
              <label>Género</label>
              <select v-model="formData.genero" required>
                <option value="masculino">Masculino</option>
                <option value="femenino">Femenino</option>
              </select>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Sede</label>
              <select v-model="formData.sede" required>
                <option value="los-angeles">Los Ángeles</option>
                <option value="centro">Centro</option>
                <option value="norte">Norte</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Información Médica -->
        <div class="seccion">
          <h2 class="seccion-titulo">Información Médica</h2>
          
          <div class="form-row">
            <div class="form-group">
              <label>Peso (kg)</label>
              <input v-model="formData.peso" type="text" placeholder="Ejemplo: 70 kg" />
            </div>
            
            <div class="form-group">
              <label>Altura (m)</label>
              <input v-model="formData.altura" type="text" placeholder="Ejemplo: 1.75 m" />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Grupo Sanguíneo</label>
              <select v-model="formData.grupo_sanguineo">
                <option value="">Seleccionar</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Botones -->
        <div class="botones">
          <button type="button" class="btn-cancelar" @click="volver">
            Cancelar
          </button>
          <button type="submit" class="btn-guardar" :disabled="guardando">
            {{ guardando ? "Guardando..." : "Guardar Cambios" }}
          </button>
        </div>
      </form>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import { authService } from "../../services/authService";
import { personaService } from "../../services/personaService";

const router = useRouter();
const guardando = ref(false);

const formData = reactive({
  nombres: "",
  apellido_paterno: "",
  apellido_materno: "",
  fecha_nacimiento: "",
  telefono: "",
  genero: "",
  sede: "",
  peso: "",
  altura: "",
  grupo_sanguineo: "",
});

let personaId = 0;

onMounted(() => {
  cargarDatosUsuario();
});

function cargarDatosUsuario() {
  const usuarioActual = authService.getUsuarioActual();
  
  if (!usuarioActual || !usuarioActual.persona) {
    router.push({ name: "Ingresar" });
    return;
  }

  const persona = usuarioActual.persona;
  personaId = persona.id;

  formData.nombres = persona.nombres || "";
  formData.apellido_paterno = persona.apellido_paterno || "";
  formData.apellido_materno = persona.apellido_materno || "";
  formData.fecha_nacimiento = persona.fecha_nacimiento || "";
  formData.telefono = persona.telefono || "";
  formData.genero = persona.genero || "";
  formData.sede = persona.sede || "";
  formData.peso = persona.peso || "";
  formData.altura = persona.altura || "";
  formData.grupo_sanguineo = persona.grupo_sanguineo || "";
}

async function guardarCambios() {
  guardando.value = true;

  try {
    const { data, error } = await personaService.actualizarPersona(
      personaId,
      formData
    );

    if (error) {
      alert("Error al guardar: " + error);
      guardando.value = false;
      return;
    }

    const usuarioActual = authService.getUsuarioActual();
    if (usuarioActual) {
      usuarioActual.persona = { ...usuarioActual.persona, ...formData };
      localStorage.setItem("usuario", JSON.stringify(usuarioActual));
    }

    alert("¡Perfil actualizado exitosamente!");
    router.push({ name: "BienvenidaIngresar" });
  } catch (error) {
    console.error("Error:", error);
    alert("Error inesperado al guardar");
    guardando.value = false;
  }
}

function volver() {
  router.push({ name: "BienvenidaIngresar" });
}
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Caveat:wght@400;700&family=Patrick+Hand&display=swap");

.editar-perfil-page {
  min-height: 100vh;
  background-color: #b8bdc4;
  padding: 40px 20px;
}

.main-content {
  max-width: 900px;
  margin: 0 auto;
}

.btn-volver {
  background-color: #5bc9ab;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-family: "Patrick Hand", cursive;
  font-size: 16px;
  cursor: pointer;
  margin-bottom: 20px;
  transition: all 0.3s ease;
}

.btn-volver:hover {
  background-color: #4ab89a;
  transform: translateX(-3px);
}

.title {
  font-family: "Caveat", cursive;
  font-size: 48px;
  font-weight: 700;
  text-align: center;
  margin-bottom: 10px;
  color: #2c2c2c;
}

.subtitle {
  font-family: "Patrick Hand", cursive;
  font-size: 18px;
  text-align: center;
  margin-bottom: 40px;
  color: #2c2c2c;
}

.form-perfil {
  background-color: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.seccion {
  margin-bottom: 30px;
}

.seccion-titulo {
  font-family: "Caveat", cursive;
  font-size: 32px;
  color: #5bc9ab;
  margin-bottom: 20px;
  border-bottom: 2px solid #5bc9ab;
  padding-bottom: 10px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  font-family: "Patrick Hand", cursive;
  font-size: 16px;
  font-weight: 600;
  color: #2c2c2c;
  margin-bottom: 8px;
}

.form-group input,
.form-group select {
  padding: 12px 15px;
  border: 2px solid #5bc9ab;
  border-radius: 10px;
  font-family: "Patrick Hand", cursive;
  font-size: 15px;
  transition: all 0.3s ease;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(91, 201, 171, 0.2);
}

.botones {
  display: flex;
  gap: 15px;
  justify-content: center;
  margin-top: 30px;
}

.btn-cancelar,
.btn-guardar {
  padding: 14px 35px;
  border: none;
  border-radius: 12px;
  font-family: "Patrick Hand", cursive;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-cancelar {
  background-color: #7a8088;
  color: white;
}

.btn-cancelar:hover {
  background-color: #6a7078;
  transform: translateY(-2px);
}

.btn-guardar {
  background-color: #5bc9ab;
  color: #2c2c2c;
}

.btn-guardar:hover:not(:disabled) {
  background-color: #4ab89a;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(91, 201, 171, 0.3);
}

.btn-guardar:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }

  .botones {
    flex-direction: column;
  }

  .btn-cancelar,
  .btn-guardar {
    width: 100%;
  }
}
</style>