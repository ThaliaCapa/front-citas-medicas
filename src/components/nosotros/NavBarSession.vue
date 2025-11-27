<template>
  <header class="navbar">
    <div class="navbar-logo">
      <div class="logo-icon">🏥</div>
      <div class="logo-text">
        Tópico <br />
        <span class="logo-subtitle">Los Ángeles</span>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts"></script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Caveat:wght@400;700&family=Patrick+Hand&display=swap");

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 5%;
  background-color: #d4d5cc;
  min-height: 100px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

/* LOGO */
.navbar-logo {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-icon {
  font-size: 50px;
}

.logo-text {
  font-family: Arial, sans-serif;
  font-size: 20px;
  line-height: 1.1;
  color: #2c2c2c;
}

.logo-subtitle {
  font-size: 12px;
  color: #666;
}

/* LINKS DE NAVEGACIÓN */
.navbar-links {
  display: flex;
  align-items: center;
  gap: 20px;
}

.nav-item {
  font-family: "Patrick Hand", cursive;
  text-decoration: none;
  color: #2c2c2c;
  font-size: 20px;
  font-weight: 500;
  transition: all 0.3s ease;
  padding: 8px 16px;
  border-radius: 8px;
}

.nav-item:hover {
  color: #38a881;
  background-color: rgba(56, 168, 129, 0.1);
}

/* BOTÓN ESPECIAL PARA RESERVA */
.nav-item-button {
  background-color: #38a881;
  color: white;
  padding: 12px 28px;
  border-radius: 12px;
  font-weight: 600;
}

.nav-item-button:hover {
  background-color: #2d8a6a;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(56, 168, 129, 0.3);
}

/* RESPONSIVE */
@media (max-width: 768px) {
  .navbar {
    flex-direction: column;
    align-items: center;
    padding: 15px 5%;
    gap: 20px;
  }

  .navbar-links {
    width: 100%;
    justify-content: center;
    flex-wrap: wrap;
  }

  .nav-item {
    font-size: 18px;
  }

  .logo-icon {
    font-size: 40px;
  }

  .logo-text {
    font-size: 18px;
  }
}
</style>
