import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "❌ Error: Faltan las credenciales de Supabase en el archivo .env"
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
