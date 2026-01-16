import { supabase } from "../lib/supabaseClient";

export interface Familiar {
  id: number;
  numero_documento: number;
  apellido_paterno: string;
  apellido_materno: string;
  nombres: string;
  fecha_nacimiento: string;
  telefono?: string;
  genero: string;
  idtipodocumento: number;
  idtitular: number; // ID de la persona titular
}

export const familiarService = {
  // Obtener familiares del usuario logeado
  async obtenerFamiliares(idTitular: number) {
    try {
      const { data, error } = await supabase
        .from("persona")
        .select("*")
        .eq("idtitular", idTitular)
        .eq("idrol", 3) // Asumiendo que rol 3 es "Familiar"
        .order("nombres", { ascending: true });

      if (error) {
        console.error("Error al obtener familiares:", error);
        throw error;
      }

      console.log("Familiares obtenidos:", data);
      return { data, error: null };
    } catch (error: any) {
      console.error("Error en obtenerFamiliares:", error);
      return { data: null, error: error.message };
    }
  },

  // Registrar un nuevo familiar
  async registrarFamiliar(familiarData: any) {
    try {
      console.log("📤 Registrando familiar:", familiarData);

      // Convertir nombres de columnas a minúsculas
      const datosLimpios: any = {};
      for (const [key, value] of Object.entries(familiarData)) {
        datosLimpios[key.toLowerCase()] = value;
      }

      const { data, error } = await supabase
        .from("persona")
        .insert([datosLimpios])
        .select()
        .single();

      if (error) {
        console.error("❌ Error al registrar familiar:", error);
        throw error;
      }

      console.log("✅ Familiar registrado exitosamente:", data);
      return { data, error: null };
    } catch (error: any) {
      console.error("❌ Error en registrarFamiliar:", error);
      return { data: null, error: error.message };
    }
  },
};