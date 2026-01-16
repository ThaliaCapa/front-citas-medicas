import { supabase } from "../lib/supabaseClient";

export const citaService = {
  // Obtener citas programadas de un paciente
  async obtenerCitasProgramadas(idPaciente: number) {
    try {
      const hoy = new Date().toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from("cita")
        .select(`
          *,
          doctor:persona!cita_idDoctor_fkey(nombres, apellido_paterno, apellido_materno)
        `)
        .eq("idPaciente", idPaciente)
        .eq("estado", 1)
        .gte("fecha", hoy)
        .order("fecha", { ascending: true })
        .order("hora", { ascending: true });

      if (error) {
        console.error("Error de Supabase al obtener citas:", error);
        throw error;
      }
      
      console.log("Citas programadas obtenidas:", data);
      return { data, error: null };
    } catch (error: any) {
      console.error("Error al obtener citas programadas:", error);
      return { data: null, error: error.message };
    }
  },

  // Obtener historial de citas de un paciente
  async obtenerHistorialCitas(idPaciente: number) {
    try {
      const hoy = new Date().toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from("cita")
        .select(`
          *,
          doctor:persona!cita_idDoctor_fkey(nombres, apellido_paterno, apellido_materno)
        `)
        .eq("idPaciente", idPaciente)
        .lt("fecha", hoy)
        .order("fecha", { ascending: false })
        .order("hora", { ascending: false })
        .limit(10);

      if (error) {
        console.error("Error de Supabase al obtener historial:", error);
        throw error;
      }
      
      console.log("Historial de citas obtenido:", data);
      return { data, error: null };
    } catch (error: any) {
      console.error("Error al obtener historial:", error);
      return { data: null, error: error.message };
    }
  },
};