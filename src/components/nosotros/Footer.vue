<template>
  <footer class="footer">
    <div class="footer-content">
      <!-- COLUMNA IZQUIERDA -->
      <div class="footer-left">
        <h2 class="footer-title">¡Queremos verte bien!</h2>
        <p class="footer-phone">(044) 485 — 294 / 987 492 808</p>
        <p class="footer-address">
          Av. Húsares de Junín N° 690, Urb. La Merced
        </p>
      </div>

      <!-- COLUMNA CENTRO -->
      <div class="footer-center">
        <h2 class="footer-title">Contáctanos:</h2>
        <button class="btn-contactanos" @click="handleContact">
          Contáctanos
        </button>
      </div>

      <!-- COLUMNA DERECHA -->
      <div class="footer-right">
        <h2 class="footer-title">¡Síguenos!</h2>
        <div class="social-icons">
          <a href="#" class="social-link facebook" aria-label="Facebook">
            <FacebookIcon />
          </a>
          <a href="#" class="social-link instagram" aria-label="Instagram">
            <InstagramIcon />
          </a>
          <a href="#" class="social-link tiktok" aria-label="TikTok">
            <TiktokIcon />
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import InstagramIcon from "../../icons/InstagramIcon.vue";
import FacebookIcon from "../../icons/FacebookIcon.vue";
import TiktokIcon from "../../icons/TiktokIcon.vue";

function handleContact() {
  alert("Contactando...");
}
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Caveat:wght@400;700&family=Patrick+Hand&display=swap");

.footer {
  background-color: #38a881;
  padding: 40px 5%;
  color: white;
}

.footer-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 40px;
  max-width: 1400px;
  margin: 0 auto;
}

.footer-left,
.footer-center,
.footer-right {
  flex: 1;
}

/* TÍTULOS */
.footer-title {
  font-family: "Caveat", cursive;
  font-size: 36px;
  font-weight: 700;
  margin-bottom: 15px;
  color: white;
}

/* COLUMNA IZQUIERDA */
.footer-phone,
.footer-address {
  font-family: "Patrick Hand", cursive;
  font-size: 18px;
  margin-bottom: 10px;
  line-height: 1.5;
}

/* COLUMNA CENTRO */
.btn-contactanos {
  font-family: "Patrick Hand", cursive;
  background-color: transparent;
  border: 3px solid white;
  color: white;
  padding: 12px 35px;
  font-size: 20px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 10px;
}

.btn-contactanos:hover {
  background-color: white;
  color: #38a881;
  transform: translateY(-2px);
}

/* COLUMNA DERECHA - REDES SOCIALES */
.social-icons {
  display: flex;
  gap: 15px;
  margin-top: 15px;
}

.social-link {
  text-decoration: none;
  transition: transform 0.3s ease;
}

.social-link:hover {
  transform: scale(1.15);
}

.social-circle {
  width: 55px;
  height: 55px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: bold;
  color: white;
  transition: all 0.3s ease;
}

.facebook .social-circle {
  background-color: #3b5998;
}

.instagram .social-circle {
  background: linear-gradient(
    45deg,
    #f09433 0%,
    #e6683c 25%,
    #dc2743 50%,
    #cc2366 75%,
    #bc1888 100%
  );
}

.tiktok .social-circle {
  background-color: #000000;
}

.social-circle:hover {
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
}

/* RESPONSIVE */
@media (max-width: 1024px) {
  .footer-content {
    flex-direction: column;
    text-align: center;
  }

  .social-icons {
    justify-content: center;
  }
}

@media (max-width: 768px) {
  .footer-title {
    font-size: 28px;
  }

  .footer-phone,
  .footer-address {
    font-size: 16px;
  }

  .btn-contactanos {
    font-size: 18px;
    padding: 10px 25px;
  }
}
</style>
