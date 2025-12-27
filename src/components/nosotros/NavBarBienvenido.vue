<template>
  <header class="navbar">
    <div class="navbar-content">
      <!-- Logo -->
      <div class="navbar-logo">
        <div class="logo-icon">🏥</div>
        <div class="logo-text">
          <span class="logo-main">Tópico</span>
          <span class="logo-subtitle">Los Ángeles</span>
        </div>
      </div>

      <!-- Links de navegación -->
      <nav class="navbar-links">
        <router-link class="nav-item" :to="{ name: 'Inicio' }"
          >Inicio</router-link
        >
        <router-link class="nav-item" :to="{ name: 'Contacto' }"
          >Contactanos</router-link
        >
        <router-link class="nav-item" :to="{ name: 'MiPerfil' }"
          >Mi perfil</router-link
        >
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts"></script>

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

.navbar-logo {
  display: flex;
  align-items: center;
  gap: 15px;
}

.logo-icon {
  font-size: 55px;
  width: 55px;
  height: 55px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-text {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
}

.logo-main {
  font-family: Arial, sans-serif;
  font-size: 22px;
  font-weight: 600;
  color: #2c2c2c;
}

.logo-subtitle {
  font-family: Arial, sans-serif;
  font-size: 11px;
  color: #666;
  font-weight: 400;
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
}

@media (max-width: 480px) {
  .logo-main {
    font-size: 18px;
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
}
</style>
