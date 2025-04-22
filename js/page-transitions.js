document.addEventListener("DOMContentLoaded", () => {    
  //setupGrid(); // Génère dynamiquement la grille au chargement
});

function setupGrid() {
  const transitionComponent = document.querySelector(".transition_component");
  if (!transitionComponent) {
    return;
  }

  const columns = parseInt(transitionComponent.getAttribute("data-col"), 10);
  if (isNaN(columns)) {
    return;
  }

  const rows = Math.ceil(columns / 2); // Nombre de lignes

  // Suppression des anciens éléments au cas où
  transitionComponent.innerHTML = "";

  transitionComponent.style.display = "grid";
  transitionComponent.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;

  for (let col = 0; col < columns; col++) {
    const column = document.createElement("div");
    column.classList.add("transition_col");
    column.style.display = "grid";
    column.style.gridTemplateRows = `repeat(${rows}, 1fr)`;

    for (let row = 0; row < rows; row++) {
      const block = document.createElement("div");
      block.classList.add("transition_block");

      const innerBlock = document.createElement("div");
      innerBlock.classList.add("transition_inner");
      block.appendChild(innerBlock); // Ajoute le bloc intérieur

      column.appendChild(block);
    }

    transitionComponent.appendChild(column);
  }

}

// Configuration de Barba.js avec l'animation
/*barba.init({
  transitions: [
    {
      name: "custom-transition",
      async leave(data) {
        console.log("🔥 [leave] Début de leave()");

        const sectionTransition = document.querySelector(".section_transition");
        if (!sectionTransition) {
          console.error("❌ [leave] .section_transition introuvable !");
          return;
        }

        console.log("✅ [leave] section_transition trouvée, affichage...");
        sectionTransition.style.display = "block"; // Assurer que la transition est visible

        const pageContent = data.current.container;
        if (!pageContent) {
          console.error("❌ [leave] data.current.container introuvable !");
          return;
        }

        // 🔥 Appliquer manuellement des styles pour empêcher la disparition instantanée
        pageContent.style.opacity = "1";
        pageContent.style.transform = "translate(0px, 0px)";

        console.log("📌 [leave] Styles INITIAUX appliqués sur data.current.container :", pageContent);

        // 🔥 Lancer `transitionIn()` avec `fromTo()`
        await transitionIn(pageContent);

        console.log("🗑️ [leave] Suppression de data.current.container");
        data.current.container.remove(); // Suppression après l'animation

        console.log("🔝 [leave] Scroll vers le haut...");
        window.scrollTo(0, 0);
      },
      async beforeEnter(data) {
        console.log("🔥 [beforeEnter] Masquage temporaire de la nouvelle page...");
        data.next.container.classList.add("hide-container");
      },
      async enter(data) {
        console.log("🔥 [enter] Début de transitionOut()...");
        await transitionOut();
        console.log("✅ [enter] Fin de transitionOut()");

        console.log("✅ [enter] Affichage de la nouvelle page");
        data.next.container.classList.remove("hide-container");
      }
    }
  ]
});*/

function transitionIn(pageContent) {
  return new Promise((resolve) => {
    console.log("🔥 [transitionIn] Début de transitionIn()");

    const transitionComponent = document.querySelector(".transition_component");

    if (!transitionComponent || !pageContent) {
      console.error("❌ [transitionIn] .transition_component ou pageContent introuvable !");
      resolve();
      return;
    }

    console.log("✅ [transitionIn] Animation de section_transition...");

    const columns = parseInt(transitionComponent.getAttribute("data-col"), 10);
    const rows = Math.ceil(columns / 2);

    let timeline = gsap.timeline({
      onComplete: () => {
        console.log("✅ [transitionIn] Fin de transitionIn()");
        resolve();
      }
    });

    // 🔥 Utilisation de `fromTo()` pour éviter la disparition instantanée
    timeline.fromTo(pageContent,
      { x: "0px", opacity: 1 },  // Départ forcé (corrige le bug du premier clic)
      { x: "-170px", opacity: 0.3, duration: 0.7, ease: "power2.in" }
    );

    for (let col = columns - 1; col >= 0; col--) {
      const blocks = Array.from(document.querySelectorAll(`.transition_col:nth-child(${col + 1}) .transition_inner`))
        .reverse();

      blocks.forEach((block, rowIndex) => {
        gsap.set(block, {
          width: "0%",
          right: "0",
          left: "auto"
        });

        timeline.to(block, {
          width: "100%",
          duration: 0.1,
          ease: "power1.in"
        }, (columns - col - 1) * 0.05 + rowIndex * 0.02);
      });
    }
  });
}

function transitionOut() {
  return new Promise((resolve) => {
    console.log("🔥 [transitionOut] Début de transitionOut()");

    const transitionComponent = document.querySelector(".transition_component");
    const pageContent = document.querySelector("[data-barba='container']"); // Contenu de la nouvelle page

    if (!transitionComponent || !pageContent) {
      console.error("❌ [transitionOut] .transition_component ou pageContent introuvable !");
      resolve();
      return;
    }

    console.log("✅ [transitionOut] Animation de section_transition...");
    console.log("📌 [transitionOut] data-barba='container' NOUVEAU :", pageContent);

    const columns = parseInt(transitionComponent.getAttribute("data-col"), 10);
    const rows = Math.ceil(columns / 2);

    let timeline = gsap.timeline({ onComplete: () => {
      console.log("✅ [transitionOut] Fin de transitionOut()");
      document.querySelector(".section_transition").style.display = "none";
      window.scrollTo(0, 0);
      resolve();
    }});

    // Ajoute le mouvement du contenu de la nouvelle page vers la droite
    timeline.fromTo(pageContent, {
      x: "170px",
      opacity: 0
    }, {
      x: "0px",
      opacity: 1,
      duration: 0.6,
      delay: 0.2,
      ease: "power2.out",
      onComplete: () => console.log("✅ [transitionOut] Animation GSAP du contenu terminée"),
    }, 0);

    for (let col = columns - 1; col >= 0; col--) {
      const blocks = Array.from(document.querySelectorAll(`.transition_col:nth-child(${col + 1}) .transition_inner`))
        .reverse();

      blocks.forEach((block, rowIndex) => {
        timeline.to(block, {
          width: "0%",
          right: "0",
          left: "auto",
          duration: 0.1,
          ease: "power1.out"
        }, (columns - col - 1) * 0.05 + rowIndex * 0.02);
      });
    }
  });
}

/*barba.hooks.afterEnter(() => {
  const navbar = document.querySelector(".nav-top");
  if (navbar) {
    console.log("✅ [Barba] Réactivation de la navbar fixe");
    navbar.style.position = "fixed";
    navbar.style.top = "var(--_responsive---container--padding)";
    navbar.style.left = "0%";
    navbar.style.right = "0%";
    navbar.style.bottom = "auto";
    navbar.style.zIndex = "10000"; // S'assurer qu'elle reste au-dessus du contenu
  }

  ScrollTrigger.refresh();
  console.log("ScrollTrigger refresh()");
});*/ 