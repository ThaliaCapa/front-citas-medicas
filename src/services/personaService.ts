import { supabase, type Persona } from "../lib/supabaseClient";
import { authService } from "./authService";

export const personaService = {
  // Crear perfil de persona/paciente
  async crearPersona(
    personaData: Omit<Persona, "id" | "fechaCreacion" | "fechaModificacion">
  ) {
    try {
      const usuario = authService.getUsuarioActual();
      if (!usuario) throw new Error("Usuario no autenticado");

      const { data, error } = await supabase
        .from("persona")
        .insert([
          {
            ...personaData,
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

  // Obtener persona por ID de usuario
  async obtenerPersonaPorUsuario(idUsuario: number) {
    try {
      const { data, error } = await supabase
        .from("persona")
        .select("*")
        .eq("idUsuario", idUsuario)
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  },

  // Actualizar persona
  async actualizarPersona(id: number, personaData: Partial<Persona>) {
    try {
      const usuario = authService.getUsuarioActual();
      if (!usuario) throw new Error("Usuario no autenticado");

      const { data, error } = await supabase
        .from("persona")
        .update({
          ...personaData,
          idUsuarioModificacion: usuario.id,
          fechaModificacion: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  },
};
