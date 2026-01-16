<template>
  <div class="nosotros-page">
    <!-- SECCIÓN PRINCIPAL -->
    <section class="main-section">
      <!-- CONTENIDO IZQUIERDO -->
      <div class="content-left">
        <h1 class="title-handwritten">Nuestra clínica</h1>
        <p class="description">
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Magni
          saepenesque accusantium inventore eius cum reiciendis explicabo
          magnam. Magni saepenesque accusantium inventore.
        </p>

        <h2 class="subtitle-handwritten">Nuestra Misión</h2>
        <p class="description">Lorem ipsum dolor sit amet consectetur.</p>

        <h2 class="subtitle-handwritten">Nuestra Visión</h2>
        <p class="description">
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Magni
          saepenesque accusantium.
        </p>

        <h2 class="subtitle-handwritten">Nuestros Valores</h2>
        <ul class="valores-list">
          <li>Honestidad y Lealtad.</li>
          <li>Trabajo en equipo.</li>
          <li>Comunicación.</li>
          <li>Liderazgo.</li>
          <li>Excelencia enfocada en el paciente.</li>
        </ul>
      </div>

      <!-- IMAGEN DERECHA -->
      <div class="content-right">
        <img
          src="https://images.pexels.com/photos/7089401/pexels-photo-7089401.jpeg"
          alt="Clínica"
          class="clinic-image"
        />
        <p class="image-credit">shutterstock - 2557673895</p>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
/* FUENTE HANDWRITTEN STYLE */
@import url("https://fonts.googleapis.com/css2?family=Caveat:wght@400;700&family=Patrick+Hand&display=swap");

.nosotros-page {
  background-color: #d4d5cc;
  min-height: calc(100vh - 100px);
  padding: 40px 5%;
}

.main-section {
  display: flex;
  gap: 50px;
  align-items: flex-start;
  max-width: 1400px;
  margin: 0 auto;
}

/* CONTENIDO IZQUIERDO */
.content-left {
  flex: 1;
  padding: 20px 0;
}

.title-handwritten {
  font-family: "Caveat", cursive;
  font-size: 62px;
  font-weight: 700;
  margin-bottom: 20px;
  color: #2c2c2c;
  line-height: 1.2;
}

.subtitle-handwritten {
  font-family: "Caveat", cursive;
  font-size: 42px;
  font-weight: 700;
  margin-top: 30px;
  margin-bottom: 10px;
  color: #2c2c2c;
}

.description {
  font-family: "Patrick Hand", cursive;
  font-size: 18px;
  line-height: 1.6;
  color: #333;
  margin-bottom: 15px;
}

.valores-list {
  font-family: "Patrick Hand", cursive;
  font-size: 18px;
  line-height: 1.8;
  color: #333;
  margin-left: 20px;
  list-style: none;
}

.valores-list li {
  position: relative;
  padding-left: 15px;
}

.valores-list li:before {
  content: "•";
  position: absolute;
  left: 0;
  color: #38a881;
  font-weight: bold;
}

/* CONTENIDO DERECHO */
.content-right {
  flex: 1;
  max-width: 550px;
  position: relative;
}

.clinic-image {
  width: 100%;
  height: auto;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.image-credit {
  position: absolute;
  bottom: 10px;
  right: 10px;
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 12px;
  font-family: Arial, sans-serif;
}

/* RESPONSIVE */
@media (max-width: 1024px) {
  .main-section {
    flex-direction: column;
  }

  .content-right {
    max-width: 100%;
  }
}

@media (max-width: 768px) {
  .title-handwritten {
    font-size: 48px;
  }

  .subtitle-handwritten {
    font-size: 32px;
  }

  .description,
  .valores-list {
    font-size: 16px;
  }
}
</style>
