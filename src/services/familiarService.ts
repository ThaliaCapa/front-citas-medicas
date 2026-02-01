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
  idtitular: number;
}

export const familiarService = {
  async obtenerFamiliares(idTitular: number) {
    try {
      console.log("🔍 Buscando rol Familiar...");

      // Intentar con diferentes nombres de tabla
      let listaRoles = null;
      
      // Intento 1: minúsculas
      let result = await supabase.from("lista").select("id").eq("nombre", "Roles").maybeSingle();
      
      if (result.data) {
        listaRoles = result.data;
      } else {
        // Intento 2: con mayúsculas
        result = await supabase.from("Lista").select("id").eq("nombre", "Roles").maybeSingle();
        if (result.data) listaRoles = result.data;
      }

      if (!listaRoles) {
        console.error("❌ No se encontró la lista de Roles");
        throw new Error("No se encontró la lista de Roles. Por favor ejecuta el SQL de datos iniciales.");
      }

      console.log("✅ Lista de Roles encontrada:", listaRoles);

      // Buscar rol Familiar
      const { data: rolFamiliar, error: errorRol } = await supabase
        .from("listaopciones")
        .select("id")
        .eq("idlista", listaRoles.id)
        .eq("nombre", "Familiar")
        .maybeSingle();

      if (!rolFamiliar) {
        console.warn("⚠️ No se encontró el rol Familiar");
        return { data: [], error: null }; // Retornar array vacío en lugar de error
      }

      console.log("✅ Rol Familiar encontrado:", rolFamiliar);

      // Obtener familiares
      const { data, error } = await supabase
        .from("persona")
        .select("*")
        .eq("idtitular", idTitular)
        .eq("idrol", rolFamiliar.id)
        .order("nombres", { ascending: true });

      if (error) {
        console.error("❌ Error al obtener familiares:", error);
        throw error;
      }

      console.log("✅ Familiares obtenidos:", data);
      return { data: data || [], error: null };
    } catch (error: any) {
      console.error("❌ Error en obtenerFamiliares:", error);
      return { data: [], error: error.message };
    }
  },

  async registrarFamiliar(familiarData: any) {
    try {
      console.log("📤 Registrando familiar:", familiarData);

      // Buscar rol Familiar
      const { data: listaRoles } = await supabase
        .from("lista")
        .select("id")
        .eq("nombre", "Roles")
        .maybeSingle();

      if (!listaRoles) {
        throw new Error("No se encontró la lista de Roles");
      }

      const { data: rolFamiliar } = await supabase
        .from("listaopciones")
        .select("id")
        .eq("idlista", listaRoles.id)
        .eq("nombre", "Familiar")
        .maybeSingle();

      if (!rolFamiliar) {
        throw new Error("No se encontró el rol Familiar");
      }

      // Asignar el rol de familiar
      familiarData.idrol = rolFamiliar.id;

      // Convertir a minúsculas
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