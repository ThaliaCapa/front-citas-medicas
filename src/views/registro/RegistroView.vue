<template>
  <div class="registro-page">
    <!-- TARJETA DE REGISTRO -->
    <div class="registro-card">
      <!-- ENCABEZADO CON BOTÓN Y TÍTULO -->
      <div class="header-container">
        <button class="btn-volver-interno" @click="goBack">Volver atrás</button>
        <h1 class="title">Bienvenidos</h1>
      </div>

      <p class="subtitle">
        Regístrate y podrás visualizar la disponibilidad de los médicos, tus
        citas históricas y además reservar y pagar tu consulta en línea.
        Recuerda que tus datos estarán resguardados por nosotros.
      </p>

      <!-- FORMULARIO -->
      <form @submit.prevent="handleRegistro">
        <div class="form-row-2">
          <!-- TIPO DE DOCUMENTO -->
          <div class="form-group">
            <label class="label-handwritten">Tipo de Documento</label>
            <select
              v-model="formData.tipoDocumento"
              class="input-field"
              required
            >
              <option value="">Seleccionar</option>
              <option value="dni">DNI</option>
              <option value="carnet">Carnet de Extranjería</option>
              <option value="pasaporte">Pasaporte</option>
            </select>
          </div>

          <!-- NÚMERO DE DOCUMENTO -->
          <div class="form-group">
            <label class="label-handwritten">Número de Documento</label>
            <input
              type="text"
              v-model="formData.numeroDocumento"
              placeholder=""
              class="input-field"
              required
            />
          </div>
        </div>

        <div class="form-row-2">
          <!-- APELLIDO PATERNO -->
          <div class="form-group">
            <label class="label-handwritten">Apellido Paterno</label>
            <input
              type="text"
              v-model="formData.apellidoPaterno"
              placeholder=""
              class="input-field"
              required
            />
          </div>

          <!-- APELLIDO MATERNO -->
          <div class="form-group">
            <label class="label-handwritten">Apellido Materno</label>
            <input
              type="text"
              v-model="formData.apellidoMaterno"
              placeholder=""
              class="input-field"
              required
            />
          </div>
        </div>

        <div class="form-row-2">
          <!-- NOMBRES -->
          <div class="form-group">
            <label class="label-handwritten">Nombres</label>
            <input
              type="text"
              v-model="formData.nombres"
              placeholder=""
              class="input-field"
              required
            />
          </div>

          <!-- FECHA DE NACIMIENTO -->
          <div class="form-group">
            <label class="label-handwritten">Fecha Nacimiento</label>
            <input
              type="date"
              v-model="formData.fechaNacimiento"
              class="input-field"
              required
            />
          </div>
        </div>

        <div class="form-row-2">
          <!-- NÚMERO DE CELULAR -->
          <div class="form-group">
            <label class="label-handwritten">Número de Celular</label>
            <input
              type="tel"
              v-model="formData.celular"
              placeholder=""
              class="input-field"
              required
            />
          </div>

          <!-- GÉNERO -->
          <div class="form-group">
            <label class="label-handwritten">Género</label>
            <div class="radio-group-inline">
              <label class="radio-label">
                <input
                  type="radio"
                  v-model="formData.genero"
                  value="masculino"
                  required
                />
                Masculino
              </label>
              <label class="radio-label">
                <input
                  type="radio"
                  v-model="formData.genero"
                  value="femenino"
                  required
                />
                Femenino
              </label>
            </div>
          </div>
        </div>

        <!-- SEDE Y CORREO -->
        <div class="form-row-2">
          <div class="form-group">
            <label class="label-handwritten">Sede</label>
            <select v-model="formData.sede" class="input-field" required>
              <option value="">Seleccionar sede</option>
              <option value="los-angeles">Los Ángeles</option>
              <option value="centro">Centro</option>
              <option value="norte">Norte</option>
            </select>
          </div>

          <div class="form-group">
            <label class="label-handwritten">Correo Electrónico</label>
            <input
              type="email"
              v-model="formData.correo"
              placeholder=""
              class="input-field"
              required
            />
          </div>
        </div>

        <div class="form-row-2">
          <!-- CONTRASEÑA -->
          <div class="form-group">
            <label class="label-handwritten">Contraseña</label>
            <div class="password-container">
              <input
                :type="showPassword ? 'text' : 'password'"
                v-model="formData.password"
                placeholder=""
                class="input-field"
                required
              />
              <button
                type="button"
                class="toggle-password"
                @click="showPassword = !showPassword"
                :aria-label="showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'"
              >
                👁️
              </button>
            </div>
          </div>

          <!-- CONFIRMAR CONTRASEÑA -->
          <div class="form-group">
            <label class="label-handwritten">Confirmar Contraseña</label>
            <div class="password-container">
              <input
                :type="showConfirmPassword ? 'text' : 'password'"
                v-model="formData.confirmPassword"
                placeholder=""
                class="input-field"
                required
              />
              <button
                type="button"
                class="toggle-password"
                @click="showConfirmPassword = !showConfirmPassword"
                :aria-label="showConfirmPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'"
              >
                👁️
              </button>
            </div>
          </div>
        </div>

        <!-- POLÍTICAS DE PRIVACIDAD -->
        <div class="checkbox-group">
          <input
            type="checkbox"
            id="politicas"
            v-model="formData.aceptaPoliticas"
            required
          />
          <label for="politicas" class="checkbox-label">
            Acepto Políticas de privacidad
          </label>
        </div>

        <!-- BOTÓN REGISTRAR -->
        <button type="submit" class="btn-registrar" :disabled="loading">
          {{ loading ? "Registrando..." : "Registrar" }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { authService } from "../../services/authService";
import { personaService } from "../../services/personaService";
import { supabase } from "../../lib/supabaseClient";

const router = useRouter();

const showPassword = ref(false);
const showConfirmPassword = ref(false);
const loading = ref(false);

const formData = reactive({
  tipoDocumento: "",
  numeroDocumento: "",
  apellidoPaterno: "",
  apellidoMaterno: "",
  nombres: "",
  celular: "",
  fechaNacimiento: "",
  sede: "",
  genero: "",
  correo: "",
  password: "",
  confirmPassword: "",
  aceptaPoliticas: false,
});

function goBack() {
  router.push({ name: "Bienvenida" });
}

async function handleRegistro() {
  if (formData.password !== formData.confirmPassword) {
    alert("Las contraseñas no coinciden");
    return;
  }

  if (!formData.aceptaPoliticas) {
    alert("Debes aceptar las políticas de privacidad");
    return;
  }

  if (formData.password.length < 6) {
    alert("La contraseña debe tener al menos 6 caracteres");
    return;
  }

  loading.value = true;

  try {
    console.log("🔄 Registrando usuario...");
    const { data: usuario, error: errorUsuario } = await authService.registrar(
      formData.correo,
      formData.password
    );

    if (errorUsuario) {
      console.error("❌ Error al registrar usuario:", errorUsuario);
      if (errorUsuario.includes("duplicate") || errorUsuario.includes("unique")) {
        alert("Este correo ya está registrado");
      } else {
        alert("Error al registrar: " + errorUsuario);
      }
      loading.value = false;
      return;
    }

    console.log("✅ Usuario creado exitosamente:", usuario);

    console.log("🔄 Buscando tipo de documento:", formData.tipoDocumento);
    
    let nombreTipoDocumento = "";
    if (formData.tipoDocumento === "dni") nombreTipoDocumento = "DNI";
    if (formData.tipoDocumento === "carnet") nombreTipoDocumento = "Carnet de Extranjería";
    if (formData.tipoDocumento === "pasaporte") nombreTipoDocumento = "Pasaporte";

    const { data: listaDoc } = await supabase
      .from("lista")
      .select("id")
      .eq("nombre", "Tipo Documento")
      .maybeSingle();

    if (!listaDoc) {
      alert("Error: No se encontró la lista de Tipo Documento");
      loading.value = false;
      return;
    }

    const { data: tipoDoc } = await supabase
      .from("listaopciones")
      .select("id")
      .eq("idlista", listaDoc.id)
      .eq("nombre", nombreTipoDocumento)
      .maybeSingle();

    if (!tipoDoc) {
      alert("Error: No se encontró el tipo de documento");
      loading.value = false;
      return;
    }

    console.log("✅ Tipo de documento encontrado con ID:", tipoDoc.id);

    const generoMapeado = formData.genero === "masculino" ? "M" : "F";

    console.log("🔄 Creando perfil de persona...");
    
    const datosPersona = {
      numero_documento: parseInt(formData.numeroDocumento),
      apellido_paterno: formData.apellidoPaterno,
      apellido_materno: formData.apellidoMaterno,
      nombres: formData.nombres,
      fecha_nacimiento: formData.fechaNacimiento,
      telefono: formData.celular,
      genero: generoMapeado,
      sede: formData.sede,
      idusuario: usuario?.id,
      idtipodocumento: tipoDoc.id,
    };

    console.log("📤 Enviando datos de persona:", datosPersona);

    const { data: persona, error: errorPersona } = await personaService.crearPersona(datosPersona);

    if (errorPersona) {
      console.error("❌ Error al crear persona:", errorPersona);
      alert("Error al crear el perfil: " + errorPersona);
      loading.value = false;
      return;
    }

    console.log("✅ Persona creada exitosamente:", persona);

    loading.value = false;
    alert("¡Registro exitoso! Ahora puedes iniciar sesión.");
    router.push({ name: "Ingresar" });
    
  } catch (error: any) {
    console.error("❌ Error inesperado:", error);
    alert("Ocurrió un error: " + (error.message || "Error desconocido"));
    loading.value = false;
  }
}
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Caveat:wght@400;700&family=Patrick+Hand&display=swap");

* {
  box-sizing: border-box;
}

.registro-page {
  min-height: 100vh;
  height: 100vh;
  background-color: #e5e7eb;
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: stretch;
  position: relative;
  overflow: hidden;
}

.registro-page::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  width: 50%;
  height: 100%;
  background-image: url("https://img.freepik.com/foto-gratis/doctor-escribiendo-notas-mientras-ausculta_23-2148285769.jpg?semt=ais_hybrid&w=740&q=80");
  background-size: cover;
  background-position: center;
  z-index: 0;
}

.header-container {
  display: flex;
  align-items: center;
  gap: 50px;
  margin-bottom: 10px;
  justify-content: center;
}

.btn-volver-interno {
  background-color: #4dd0b8;
  border: none;
  color: white;
  font-family: "Patrick Hand", cursive;
  font-size: 14px;
  padding: 8px 20px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
  align-self: flex-start;
}

.btn-volver-interno:hover {
  background-color: #3dbfa7;
  transform: translateY(-1px);
}

.registro-card {
  background: rgba(220, 225, 230, 0.96);
  border-radius: 0;
  padding: 40px 50px;
  width: 100%;
  height: 100vh;
  box-shadow: none;
  overflow-y: auto;
  z-index: 1;
  grid-column: 2;
  margin: 0;
  display: flex;
  flex-direction: column;
}

.registro-card::-webkit-scrollbar {
  width: 6px;
}

.registro-card::-webkit-scrollbar-track {
  background: transparent;
}

.registro-card::-webkit-scrollbar-thumb {
  background: #4dd0b8;
  border-radius: 10px;
}

.title {
  font-family: "Caveat", cursive;
  font-size: 32px;
  font-weight: 700;
  text-align: left;
  margin: 0;
  color: #000;
}

.subtitle {
  font-family: "Patrick Hand", cursive;
  font-size: 12px;
  text-align: center;
  margin-bottom: 20px;
  color: #000;
  line-height: 1.4;
}

form {
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex: 1;
  justify-content: center;
  max-width: 700px;
  margin: 0 auto;
  width: 100%;
}

.form-row-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.label-handwritten {
  font-family: "Caveat", cursive;
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 4px;
  color: #000;
}

.input-field,
select {
  width: 100%;
  padding: 8px 12px;
  border: 2px solid #4dd0b8;
  border-radius: 8px;
  font-family: "Patrick Hand", cursive;
  font-size: 13px;
  background-color: #fff;
  transition: all 0.3s ease;
  color: #000;
}

.input-field:focus,
select:focus {
  outline: none;
  border-color: #3dbfa7;
  box-shadow: 0 0 0 3px rgba(77, 208, 184, 0.1);
}

select {
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 10 10'%3E%3Cpath fill='%23000' d='M5 8L0 3h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 10px center;
  padding-right: 32px;
}

.password-container {
  position: relative;
}

.password-container .input-field {
  padding-right: 40px;
}

.toggle-password {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
  padding: 4px;
  color: #4dd0b8;
}

.radio-group-inline {
  display: flex;
  gap: 20px;
  align-items: center;
  height: 36px;
}

.radio-label {
  font-family: "Patrick Hand", cursive;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
}

.radio-label input[type="radio"] {
  width: 16px;
  height: 16px;
  cursor: pointer;
  accent-color: #4dd0b8;
}

.checkbox-group {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
}

.checkbox-group input[type="checkbox"] {
  width: 16px;
  height: 16px;
  cursor: pointer;
  accent-color: #4dd0b8;
}

.checkbox-label {
  font-family: "Patrick Hand", cursive;
  font-size: 13px;
  cursor: pointer;
  color: #000;
}

.btn-registrar {
  width: auto;
  padding: 10px 24px;
  background-color: #6b7280;
  color: white;
  border: none;
  border-radius: 8px;
  font-family: "Patrick Hand", cursive;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
  margin-top: 8px;
  align-self: flex-start;
}

.btn-registrar:hover:not(:disabled) {
  background-color: #5a6169;
  transform: translateY(-1px);
}

.btn-registrar:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (max-width: 1024px) {
  .registro-page {
    grid-template-columns: 1fr;
    height: auto;
    min-height: 100vh;
  }

  .registro-page::before {
    display: none;
  }

  .registro-card {
    grid-column: 1;
    height: auto;
    min-height: 100vh;
    padding: 30px;
  }
}

@media (max-width: 768px) {
  .header-container {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .btn-volver-interno {
    padding: 7px 16px;
    font-size: 13px;
  }

  .registro-card {
    padding: 25px 20px;
  }

  .form-row-2 {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .registro-card {
    padding: 20px 15px;
  }

  .title {
    font-size: 28px;
  }

  .subtitle {
    font-size: 11px;
  }

  .input-field,
  select {
    padding: 7px 10px;
    font-size: 12px;
  }
}
</style>