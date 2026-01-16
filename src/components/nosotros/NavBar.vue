<template>
  <header class="navbar">
    <div class="navbar-content">
      <!-- Logo -->
      <div class="navbar-logo">
        <div class="logo-icon">
          <img src="/src/assets/logo.png" alt="" />
        </div>
      </div>

      <!-- Links de navegación -->
      <nav class="navbar-links">
        <router-link class="nav-item" :to="{ name: 'Inicio' }">
          Nosotros
        </router-link>
        <button class="btn-reserva" @click="irAReservar">
          Reserva de Cita
        </button>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();

function irAReservar() {
  // Ir siempre a la pantalla de Bienvenida al Portal
  router.push({ name: "Bienvenida" });
}
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Caveat:wght@400;700&display=swap");

.navbar {
  background-color: #d4d5cc;
  width: 100%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.navbar-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 5%;
  min-height: 90px;
  max-width: 1400px;
  margin: 0 auto;
}

.navar-logo {
  display: flex;
  align-items: center;
  padding-top: 10px;
}

.logo-icon {
  width: 70px;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-icon img {
  width: 200%;
  height: 200%;
  object-fit: contain;
  transform: translateY(20px);
}

.navbar-links {
  display: flex;
  align-items: center;
  gap: 35px;
}

.nav-item {
  font-family: "Caveat", cursive;
  text-decoration: none;
  color: #2c2c2c;
  font-size: 28px;
  font-weight: 600;
  transition: all 0.3s ease;
  position: relative;
  padding: 4px 0;
}

.nav-item:hover {
  color: #38a881;
}

.nav-item::after {
  content: "";
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 2px;
  background-color: #38a881;
  transition: width 0.3s ease;
}

.nav-item:hover::after {
  width: 100%;
}

.nav-item.router-link-active {
  color: #38a881;
}

.nav-item.router-link-active::after {
  width: 100%;
}

/* BOTÓN RESERVA DE CITA */
.btn-reserva {
  background-color: #5bc9ab;
  color: #2c2c2c;
  border: none;
  border-radius: 15px;
  padding: 14px 35px;
  font-family: "Caveat", cursive;
  font-size: 24px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.btn-reserva:hover {
  background-color: #4ab89a;
  transform: translateY(-2px);
  box-shadow: 0 6px 18px rgba(91, 201, 171, 0.4);
}

@media (max-width: 968px) {
  .navbar-content {
    flex-direction: column;
    gap: 20px;
    padding: 15px 3%;
  }

  .navbar-links {
    width: 100%;
    justify-content: center;
    gap: 25px;
  }

  .nav-item {
    font-size: 24px;
  }

  .btn-reserva {
    font-size: 20px;
    padding: 12px 30px;
  }
}

@media (max-width: 480px) {
  .logo-icon {
    width: 55px;
    height: 55px;
  }

  .logo-subtitle {
    font-size: 10px;
  }

  .logo-icon {
    font-size: 45px;
  }

  .navbar-links {
    flex-wrap: wrap;
    gap: 15px;
  }

  .nav-item {
    font-size: 22px;
  }

  .btn-reserva {
    width: 100%;
    font-size: 18px;
  }
}
</style>
