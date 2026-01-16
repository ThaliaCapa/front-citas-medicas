import { supabase } from "../lib/supabaseClient";

export interface Especialidad {
  id: number;
  nombre: string;
  descripcion?: string;
}

export const especialidadService = {
  // Obtener todas las especialidades activas
  async obtenerEspecialidades() {
    try {
      const { data, error } = await supabase
        .from("lista_opciones")
        .select("*")
        .eq("idlista", 1) // Asumiendo que idLista 1 es para especialidades
        .eq("estado", 1)
        .order("nombre", { ascending: true });

      if (error) {
        console.error("Error al obtener especialidades:", error);
        throw error;
      }

      console.log("Especialidades obtenidas:", data);
      return { data, error: null };
    } catch (error: any) {
      console.error("Error en obtenerEspecialidades:", error);
      return { data: null, error: error.message };
    }
  },
};