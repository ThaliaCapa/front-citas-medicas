import { supabase } from "../lib/supabaseClient";

export const personaService = {
  async crearPersona(personaData: any) {
    try {
      console.log("📤 Datos originales recibidos:", personaData);
      
      // Obtener el ID del rol Paciente dinámicamente
      const { data: listaRoles } = await supabase
        .from("lista")
        .select("id")
        .eq("nombre", "Roles")
        .maybeSingle();

      if (!listaRoles) {
        throw new Error("No se encontró la lista de Roles. Por favor contacta a soporte.");
      }

      const { data: rolPaciente } = await supabase
        .from("listaopciones")
        .select("id")
        .eq("idlista", listaRoles.id)
        .eq("nombre", "Paciente")
        .maybeSingle();

      if (!rolPaciente) {
        throw new Error("No se encontró el rol Paciente. Por favor contacta a soporte.");
      }

      console.log("✅ Rol Paciente encontrado con ID:", rolPaciente.id);

      // Asignar el rol de paciente automáticamente
      personaData.idrol = rolPaciente.id;
      
      // Convertir TODOS los nombres de columnas a minúsculas
      const datosLimpios: any = {};
      
      for (const [key, value] of Object.entries(personaData)) {
        const keyMinuscula = key.toLowerCase();
        datosLimpios[keyMinuscula] = value;
      }
      
      console.log("✅ Datos convertidos a minúsculas:", datosLimpios);
      
      // Validar campos requeridos
      if (!datosLimpios.idusuario) {
        throw new Error("Falta el ID del usuario");
      }
      if (!datosLimpios.numero_documento) {
        throw new Error("Falta el número de documento");
      }
      if (!datosLimpios.nombres) {
        throw new Error("Falta el nombre");
      }
      if (!datosLimpios.idrol) {
        throw new Error("Falta el rol");
      }
      
      const { data, error } = await supabase
        .from("persona")
        .insert([datosLimpios])
        .select()
        .single();

      if (error) {
        console.error("❌ Error de Supabase:", error);
        throw new Error(error.message || "Error al insertar en la base de datos");
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