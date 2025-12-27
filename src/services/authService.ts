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

  // Iniciar sesión
  async login(correo: string, contrasena: string) {
    try {
      const { data, error } = await supabase
        .from("usuarios")
        .select("*")
        .eq("correo", correo)
        .eq("contrasena", contrasena)
        .eq("estado", 1)
        .single();

      if (error) throw error;
      if (!data) throw new Error("Credenciales incorrectas");

      // Guardar sesión
      localStorage.setItem("usuario", JSON.stringify(data));

      return { data, error: null };
    } catch (error: any) {
      console.error("Error al iniciar sesión:", error);
      return { data: null, error: error.message || "Credenciales incorrectas" };
    }
  },

  // Obtener usuario actual
  getUsuarioActual(): Usuario | null {
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
