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
      // Primero, obtener el ID de la lista "Especialidades"
      const { data: listaData, error: listaError } = await supabase
        .from("lista")
        .select("id")
        .eq("nombre", "Especialidades")
        .single();

      if (listaError) {
        console.error("Error al obtener lista de especialidades:", listaError);
        throw listaError;
      }

      const idListaEspecialidades = listaData.id;
      console.log("ID Lista Especialidades:", idListaEspecialidades);

      // Intentar con diferentes nombres de tabla
      let data = null;
      let error = null;

      // Intento 1: listaopciones (todo minúsculas)
      const result1 = await supabase
        .from("listaopciones")
        .select("*")
        .eq("idlista", idListaEspecialidades)
        .eq("estado", 1)
        .order("nombre", { ascending: true });

      if (!result1.error) {
        data = result1.data;
      } else {
        console.log("Intento 1 falló, probando con listaOpciones...");
        
        // Intento 2: listaOpciones (camelCase)
        const result2 = await supabase
          .from("listaOpciones")
          .select("*")
          .eq("idLista", idListaEspecialidades)
          .eq("estado", 1)
          .order("nombre", { ascending: true });

        if (!result2.error) {
          data = result2.data;
        } else {
          console.log("Intento 2 falló, probando con lista_opciones...");
          
          // Intento 3: lista_opciones (snake_case)
          const result3 = await supabase
            .from("lista_opciones")
            .select("*")
            .eq("id_lista", idListaEspecialidades)
            .eq("estado", 1)
            .order("nombre", { ascending: true });

          data = result3.data;
          error = result3.error;
        }
      }

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