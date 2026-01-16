import { supabase } from "../lib/supabaseClient";

export const personaService = {
  async crearPersona(personaData: any) {
    try {
      console.log("📤 Datos originales recibidos:", personaData);
      
      // Convertir TODOS los nombres de columnas a minúsculas
      const datosLimpios: any = {};
      
      for (const [key, value] of Object.entries(personaData)) {
        const keyMinuscula = key.toLowerCase();
        datosLimpios[keyMinuscula] = value;
      }
      
      console.log("✅ Datos convertidos a minúsculas:", datosLimpios);
      
      const { data, error } = await supabase
        .from("persona")
        .insert([datosLimpios])
        .select()
        .single();

      if (error) {
        console.error("❌ Error de Supabase:", error);
        throw error;
      }
      
      console.log("✅ Persona creada exitosamente:", data);
      return { data, error: null };
    } catch (error: any) {
      console.error("❌ Error en crearPersona:", error);
      return { data: null, error: error.message };
    }
  },

  async obtenerPersonaPorUsuario(idUsuario: number) {
    try {
      const { data, error } = await supabase
        .from("persona")
        .select("*")
        .eq("idusuario", idUsuario)
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  },

  async actualizarPersona(id: number, personaData: any) {
    try {
      const { data, error } = await supabase
        .from("persona")
        .update(personaData)
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