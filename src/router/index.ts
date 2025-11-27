import { createRouter, createWebHistory } from "vue-router";
import NosotrosView from "../views/nosotros/NosotrosView.vue";
import ReservarCitaView from "../views/reservarcita/ReservarCitaView.vue";
import LoginIngresarView from "../views/ingresar/LoginIngresarView.vue";
import RegistroView from "../views/registro/RegistroView.vue";
import MainLayaout from "../layouts/MainLayaout.vue";
import SessionLayaout from "../layouts/SessionLayaout.vue";
import RecuperarPasswordView from "../views/ingresar/RecuperarPasswordView.vue";
import BienvenidaIngresar from "../views/ingresar/BienvenidaIngresar.vue";
import { isJsxChild } from "typescript";

// const routes = [
//   {
//     path: "/",
//     name: "Inicio",
//     component: NosotrosView,
//   },
//   {
//     path: "/reservar-cita",
//     name: "ReservarCita",
//     component: ReservarCitaView,
//   },
//   {
//     path: "/ingresar",
//     name: "Ingresar",
//     component: LoginIngresarView,
//   },
// ];

const routes = [
  {
    path: "/",
    name: "Main",
    component: MainLayaout,
    children: [
      {
        path: "",
        name: "Inicio",
        component: NosotrosView,
      },
    ],
  },
  {
    path: "/reservar-cita",
    name: "SessionLayout",
    component: SessionLayaout,
    children: [
      {
        path: "",
        name: "ReservarCita",
        component: ReservarCitaView,
      },
      {
        path: "ingresar",
        name: "Ingresar",
        component: LoginIngresarView,
      },
      {
        path: "recuperar-password",
        name: "recuperar-password",
        component: RecuperarPasswordView,
      },
       {
        path: "bienvenida",
        name: "Bienvenida",
        component: BienvenidaIngresar,
      },
      {
        path: "/registro",
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
