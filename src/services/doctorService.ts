import { supabase } from "../lib/supabaseClient";

export interface Doctor {
  id: number;
  nombres: string;
  apellido_paterno: string;
  apellido_materno: string;
  numero_documento: number;
  telefono?: string;
  idespecialidad: number;
  especialidad?: string;
}

export const doctorService = {
  // Obtener doctores por especialidad
  async obtenerDoctoresPorEspecialidad(idEspecialidad: number) {
    try {
      // Primero obtener el ID del rol "Doctor"
      const { data: listaRoles } = await supabase
        .from("lista")
        .select("id")
        .eq("nombre", "Roles")
        .single();

      if (!listaRoles) {
        throw new Error("No se encontró la lista de Roles");
      }

      const { data: rolDoctor } = await supabase
        .from("listaopciones")
        .select("id")
        .eq("idlista", listaRoles.id)
        .eq("nombre", "Doctor")
        .single();

      if (!rolDoctor) {
        throw new Error("No se encontró el rol Doctor");
      }

      // Obtener doctores
      const { data, error } = await supabase
        .from("persona")
        .select("*")
        .eq("idrol", rolDoctor.id)
        .eq("idespecialidad", idEspecialidad)
        .order("apellido_paterno", { ascending: true });

      if (error) {
        console.error("Error al obtener doctores:", error);
        throw error;
      }

      console.log("Doctores obtenidos:", data);
      return { data, error: null };
    } catch (error: any) {
      console.error("Error en obtenerDoctoresPorEspecialidad:", error);
      return { data: null, error: error.message };
    }
  },

  // Obtener todos los doctores
  async obtenerTodosDoctores() {
    try {
      const { data: listaRoles } = await supabase
        .from("lista")
        .select("id")
        .eq("nombre", "Roles")
        .single();

      if (!listaRoles) {
        throw new Error("No se encontró la lista de Roles");
      }

      const { data: rolDoctor } = await supabase
        .from("listaopciones")
        .select("id")
        .eq("idlista", listaRoles.id)
        .eq("nombre", "Doctor")
        .single();

      if (!rolDoctor) {
        throw new Error("No se encontró el rol Doctor");
      }

      const { data, error } = await supabase
        .from("persona")
        .select("*")
        .eq("idrol", rolDoctor.id)
        .order("apellido_paterno", { ascending: true });

      if (error) {
        console.error("Error al obtener doctores:", error);
        throw error;
      }

      console.log("Todos los doctores obtenidos:", data);
      return { data, error: null };
    } catch (error: any) {
      console.error("Error en obtenerTodosDoctores:", error);
      return { data: null, error: error.message };
    }
  },
};