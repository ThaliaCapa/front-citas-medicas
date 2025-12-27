import { supabase, type Cita } from "../lib/supabaseClient";
import { authService } from "./authService";

export const citaService = {
  // Crear cita
  async crearCita(
    citaData: Omit<Cita, "id" | "fechaCreacion" | "fechaModificacion">
  ) {
    try {
      const usuario = authService.getUsuarioActual();
      if (!usuario) throw new Error("Usuario no autenticado");

      const { data, error } = await supabase
        .from("cita")
        .insert([
          {
            ...citaData,
            estado: 1,
            idUsuarioCreacion: usuario.id,
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  },

  // Obtener citas de un paciente
  async obtenerCitasPaciente(idPaciente: number) {
    try {
      const { data, error } = await supabase
        .from("cita")
        .select(
          `
          *,
          doctor:idDoctor(nombres, apellido_paterno, apellido_materno),
          horario:idHorario(*)
        `
        )
        .eq("idPaciente", idPaciente)
        .eq("estado", 1)
        .order("fecha", { ascending: true });

      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  },

  // Obtener citas programadas (futuras)
  async obtenerCitasProgramadas(idPaciente: number) {
    try {
      const hoy = new Date().toISOString().split("T")[0];

      const { data, error } = await supabase
        .from("cita")
        .select(
          `
          *,
          doctor:idDoctor(nombres, apellido_paterno, apellido_materno),
          horario:idHorario(*)
        `
        )
        .eq("idPaciente", idPaciente)
        .eq("estado", 1)
        .gte("fecha", hoy)
        .order("fecha", { ascending: true });

      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  },

  // Obtener historial de citas (pasadas)
  async obtenerHistorialCitas(idPaciente: number) {
    try {
      const hoy = new Date().toISOString().split("T")[0];

      const { data, error } = await supabase
        .from("cita")
        .select(
          `
          *,
          doctor:idDoctor(nombres, apellido_paterno, apellido_materno),
          horario:idHorario(*)
        `
        )
        .eq("idPaciente", idPaciente)
        .lt("fecha", hoy)
        .order("fecha", { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  },

  // Cancelar cita
  async cancelarCita(idCita: number) {
    try {
      const usuario = authService.getUsuarioActual();
      if (!usuario) throw new Error("Usuario no autenticado");

      const { data, error } = await supabase
        .from("cita")
        .update({
          estado: 0,
          idUsuarioModificacion: usuario.id,
          fechaModificacion: new Date().toISOString(),
        })
        .eq("id", idCita)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  },
};
