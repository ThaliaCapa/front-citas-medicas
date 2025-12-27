import { createClient } from "@supabase/supabase-js";

// ⚠️ REEMPLAZA CON TUS CREDENCIALES
const supabaseUrl = "https://akhnxjzatjuinldknzn.supabase.co";
const supabaseAnonKey = "sb_publishable_ltaNA7nnVozoSCOcZIjg";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ============================================
// INTERFACES BASADAS EN TU BASE DE DATOS
// ============================================

export interface Usuario {
  id?: number;
  correo: string;
  contrasena: string;
  estado?: number;
  idUsuarioCreacion?: number;
  idUsuarioModificacion?: number;
  fechaCreacion?: string;
  fechaModificacion?: string;
}

export interface Lista {
  id?: number;
  nombre: string;
  descripcion?: string;
  estado?: number;
  idUsuarioCreacion?: number;
  idUsuarioModificacion?: number;
  fechaCreacion?: string;
  fechaModificacion?: string;
}

export interface ListaOpciones {
  id?: number;
  nombre: string;
  descripcion?: string;
  estado?: number;
  idLista: number;
  idUsuarioCreacion?: number;
  idUsuarioModificacion?: number;
  fechaCreacion?: string;
  fechaModificacion?: string;
}

export interface Persona {
  id?: number;
  numero_documento?: number;
  apellido_paterno?: string;
  apellido_materno?: string;
  nombres?: string;
  fecha_nacimiento?: string;
  telefono?: string;
  genero?: string;
  sede?: string;
  idEspecialidad?: number;
  idTipoDocumento?: number;
  idRol?: number;
  idUsuario?: number;
  idUsuarioCreacion?: number;
  idUsuarioModificacion?: number;
  fechaCreacion?: string;
  fechaModificacion?: string;
}

export interface Horario {
  id?: number;
  diaSemana?: string;
  fecha?: string;
  hora?: string;
  idDoctor?: number;
  idUsuarioCreacion?: number;
  idUsuarioModificacion?: number;
  fechaCreacion?: string;
  fechaModificacion?: string;
}

export interface Cita {
  id?: number;
  fecha: string;
  hora: string;
  descripcion?: string;
  estado?: number;
  idHorario?: number;
  idPaciente?: number;
  idDoctor?: number;
  idUsuarioCreacion?: number;
  idUsuarioModificacion?: number;
  fechaCreacion?: string;
  fechaModificacion?: string;
}
