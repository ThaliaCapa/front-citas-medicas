import { createRouter, createWebHistory } from "vue-router";
import NosotrosView from "../views/nosotros/NosotrosView.vue";
import ReservarCitaView from "../views/reservarcita/ReservarCitaView.vue";
import LoginIngresarView from "../views/ingresar/LoginIngresarView.vue";
import RegistroView from "../views/registro/RegistroView.vue";
import MainLayaout from "../layouts/MainLayaout.vue";
import SessionLayaout from "../layouts/SessionLayaout.vue";
import RecuperarPasswordView from "../views/ingresar/RecuperarPasswordView.vue";
import BienvenidaIngresar from "../views/ingresar/BienvenidaIngresar.vue";
import MiPerfilView from "../views/perfil/MiPerfilView.vue";
import ContactoView from "../views/contacto/ContactoView.vue";
import ReservarCitaPaso2View from "../views/reservarcita/ReservarCitaPaso2View.vue";
import ReservarCitaPaso3View from "../views/reservarcita/ReservarCitaPaso3View.vue";
import ReservarCitaPaso4View from "../views/reservarcita/ReservarCitaPaso4View.vue";
import ReservarCitaPaso5View from "../views/reservarcita/ReservarCitaPaso5View.vue";
import BienvenidaPortalView from "../views/ingresar/BienvenidaPortalView.vue";

const routes = [
  // RUTAS PRINCIPALES CON NAVBAR (Inicio, Contacto, Mi Perfil)
  {
    path: "/",
    component: MainLayaout,
    children: [
      {
        path: "",
        name: "Inicio",
        component: NosotrosView,
      },
      {
        path: "contacto",
        name: "Contacto",
        component: ContactoView,
      },
      {
        path: "mi-perfil",
        name: "MiPerfil",
        component: MiPerfilView,
      },
    ],
  },
  // RUTAS DE SESIÓN (Login, Registro, Reservar Cita)
  {
    path: "/reservar-cita",
    component: SessionLayaout,
    children: [
      {
        path: "",
        name: "ReservarCita",
        component: ReservarCitaView,
      },
      {
        path: "paso-2",
        name: "ReservarCitaPaso2",
        component: ReservarCitaPaso2View,
      },
      {
        path: "paso-3",
        name: "ReservarCitaPaso3",
        component: ReservarCitaPaso3View,
      },
      {
        path: "paso-4",
        name: "ReservarCitaPaso4",
        component: ReservarCitaPaso4View,
      },
      {
        path: "confirmacion",
        name: "ReservarCitaPaso5",
        component: ReservarCitaPaso5View,
      },
      {
        path: "ingresar",
        name: "Ingresar",
        component: LoginIngresarView,
      },
      {
        path: "recuperar-password",
        name: "RecuperarPassword",
        component: RecuperarPasswordView,
      },
      {
        path: "bienvenida",
        name: "Bienvenida",
        component: BienvenidaPortalView,
      },
      {
        path: "bienvenida-ingresar",
        name: "BienvenidaIngresar",
        component: BienvenidaIngresar,
      },
      {
        path: "registro",
        name: "Registro",
        component: RegistroView,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
