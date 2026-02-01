import { supabase } from "../lib/supabaseClient";

export interface Horario {
  id: number;
  diasemana?: string;
  fecha: string;
  hora: string;
  iddoctor: number;
  disponible?: boolean;
  doctor?: any;
}

export const horarioService = {
  async obtenerHorariosPorDoctor(idDoctor: number) {
    try {
      const hoy = new Date().toISOString().split("T")[0];

      const { data: horarios, error: errorHorarios } = await supabase
        .from("horario")
        .select("*")
        .eq("iddoctor", idDoctor)
        .gte("fecha", hoy)
        .order("fecha", { ascending: true })
        .order("hora", { ascending: true });

      if (errorHorarios) {
        console.error("Error al obtener horarios:", errorHorarios);
        throw errorHorarios;
      }

      const { data: doctor, error: errorDoctor } = await supabase
        .from("persona")
        .select("id, nombres, apellido_paterno, apellido_materno, foto_url, idespecialidad")
        .eq("id", idDoctor)
        .single();

      if (errorDoctor) {
        console.error("Error al obtener doctor:", errorDoctor);
      }

      const horariosConDisponibilidad = await Promise.all(
        (horarios || []).map(async (horario) => {
          const { data: citas } = await supabase
            .from("cita")
            .select("id")
            .eq("idhorario", horario.id)
            .eq("estado", 1);

          return {
            ...horario,
            doctor: doctor,
            disponible: !citas || citas.length === 0,
          };
        })
      );

      console.log("✅ Horarios obtenidos:", horariosConDisponibilidad);
      return { data: horariosConDisponibilidad, error: null };
    } catch (error: any) {
      console.error("❌ Error en obtenerHorariosPorDoctor:", error);
      return { data: null, error: error.message };
    }
  },

  async obtenerHorariosPorFecha(fecha: string, idEspecialidad?: number) {
    try {
      const { data: horarios, error: errorHorarios } = await supabase
        .from("horario")
        .select("*")
        .eq("fecha", fecha)
        .order("hora", { ascending: true });

      if (errorHorarios) {
        console.error("❌ Error al obtener horarios:", errorHorarios);
        throw errorHorarios;
      }

      console.log("📊 Horarios encontrados:", horarios);

      if (!horarios || horarios.length === 0) {
        console.log("⚠️ No hay horarios para esta fecha");
        return { data: [], error: null };
      }

      const doctorIds = [...new Set(horarios.map((h: any) => h.iddoctor))];
      console.log("👨‍⚕️ IDs de doctores:", doctorIds);

      const { data: doctores, error: errorDoctores } = await supabase
        .from("persona")
        .select("id, nombres, apellido_paterno, apellido_materno, foto_url, idespecialidad")
        .in("id", doctorIds);

      if (errorDoctores) {
        console.error("❌ Error al obtener doctores:", errorDoctores);
      }

      console.log("👨‍⚕️ Doctores encontrados:", doctores);

      let doctoresFiltrados = doctores;
      if (idEspecialidad && doctores) {
        doctoresFiltrados = doctores.filter(
          (d: any) => d.idespecialidad === idEspecialidad
        );
        console.log("🔍 Doctores filtrados por especialidad:", doctoresFiltrados);
      }

      const horariosConDoctor = horarios
        .map((horario: any) => {
          const doctor = doctoresFiltrados?.find((d: any) => d.id === horario.iddoctor);
          if (!doctor && idEspecialidad) return null;
          return {
            ...horario,
            doctor: doctor || null,
          };
        })
        .filter((h: any) => h !== null);

      console.log("🔗 Horarios combinados con doctores:", horariosConDoctor);

      const horariosConDisponibilidad = await Promise.all(
        horariosConDoctor.map(async (horario: any) => {
          const { data: citas } = await supabase
            .from("cita")
            .select("id")
            .eq("idhorario", horario.id)
            .eq("estado", 1);

          return {
            ...horario,
            disponible: !citas || citas.length === 0,
          };
        })
      );

      console.log("✅ RESULTADO FINAL:", horariosConDisponibilidad);
      return { data: horariosConDisponibilidad, error: null };
    } catch (error: any) {
      console.error("❌ Error en obtenerHorariosPorFecha:", error);
      return { data: null, error: error.message };
    }
  },
};