import { supabase, type Usuario } from "../lib/supabaseClient";

export const authService = {
  // Registrar usuario nuevo
  async registrar(correo: string, contrasena: string) {
    try {
      const { data, error } = await supabase
        .from("usuarios")
        .insert([
          {
            correo: correo,
            contrasena: contrasena, // ⚠️ En producción debes encriptar esto
            estado: 1,
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      console.error("Error al registrar:", error);
      return { data: null, error: error.message };
    }
  },

  // Iniciar sesión con NÚMERO DE DOCUMENTO
  async login(numeroDocumento: string, contrasena: string) {
    try {
      console.log("Buscando persona con documento:", numeroDocumento);

      // PASO 1: Buscar la persona por número de documento
      const { data: persona, error: errorPersona } = await supabase
        .from("persona")
        .select("*")
        .eq("numero_documento", parseInt(numeroDocumento))
        .single();

      if (errorPersona || !persona) {
        console.error("Persona no encontrada:", errorPersona);
        throw new Error("Número de documento no encontrado");
      }

      console.log("Persona encontrada:", persona);

      // PASO 2: Buscar el usuario asociado y validar contraseña
      const { data: usuario, error: errorUsuario } = await supabase
        .from("usuarios")
        .select("*")
        .eq("id", persona.idusuario)
        .eq("contrasena", contrasena)
        .eq("estado", 1)
        .single();

      if (errorUsuario || !usuario) {
        console.error(
          "Usuario no encontrado o contraseña incorrecta:",
          errorUsuario
        );
        throw new Error("Contraseña incorrecta");
      }

      console.log("Usuario encontrado:", usuario);

      // PASO 3: Guardar sesión con datos completos
      const usuarioCompleto = {
        ...usuario,
        persona: persona,
      };

      localStorage.setItem("usuario", JSON.stringify(usuarioCompleto));

      return { data: usuarioCompleto, error: null };
    } catch (error: any) {
      console.error("Error al iniciar sesión:", error);
      return { data: null, error: error.message || "Credenciales incorrectas" };
    }
  },

  // Obtener usuario actual
  getUsuarioActual(): any | null {
    const usuarioStr = localStorage.getItem("usuario");
    return usuarioStr ? JSON.parse(usuarioStr) : null;
  },

  // Verificar si está autenticado
  estaAutenticado(): boolean {
    return this.getUsuarioActual() !== null;
  },

  // Cerrar sesión
  logout() {
    localStorage.removeItem("usuario");
  },
};
