// Solution complète pour l'animation text-blur avec SplitText
// Basée sur les meilleures pratiques des forums GSAP et Webflow

document.addEventListener("DOMContentLoaded", function() {
  // Attendre que tout soit vraiment chargé avant d'initialiser
  setTimeout(() => {
    // Vérifier si GSAP est disponible
    if (typeof gsap === 'undefined') {
      console.error("[text-blur] GSAP n'est pas disponible");
      return;
    }
    
    // S'assurer que les plugins sont enregistrés
    if (typeof ScrollTrigger === 'undefined') {
      console.error("[text-blur] ScrollTrigger n'est pas disponible");
      return;
    }
    
    if (typeof SplitText === 'undefined') {
      console.error("[text-blur] SplitText n'est pas disponible");
      return;
    }
    
    gsap.registerPlugin(ScrollTrigger, SplitText);
    
    // Problème clé: Webflow peut ajouter des éléments span à l'intérieur du texte
    // qui interfèrent avec SplitText. On nettoie d'abord le texte.
    
    const textBlurElements = document.querySelectorAll('.text-blur:not([data-animated="true"])');
    
    textBlurElements.forEach((element, index) => {
      try {
        // Marquer l'élément pour éviter les doubles animations
        element.setAttribute('data-animated', 'true');
        element.setAttribute('data-index', index);
        
        // 1. Sauvegarder le texte original et nettoyer l'élément
        const originalText = element.textContent.trim();
        
        // 2. Remplacer le contenu pour éviter les problèmes avec les spans internes
        element.innerHTML = originalText;
        
        // 3. Créer un identifiant unique pour cet élément
        const uniqueId = `text-blur-${index}-${Date.now()}`;
        element.id = uniqueId;
        
        // 4. Utiliser SplitText pour diviser en mots
        const splitText = new SplitText(`#${uniqueId}`, {
          type: "words",
          wordsClass: "sb-word"
        });
        
        // Vérifier que la division a fonctionné
        if (!splitText.words || splitText.words.length === 0) {
          console.error(`[text-blur] Échec de SplitText pour l'élément ${index}`);
          element.style.opacity = 1; // Rendre visible en cas d'échec
          return;
        }
        
        console.log(`[text-blur] Élément ${index} divisé en ${splitText.words.length} mots`);
        
        // 5. Appliquer les styles initiaux
        gsap.set(splitText.words, {
          opacity: 0,
          x: 10,
          filter: 'blur(10px)'
        });
        
        // 6. Vérifier si l'élément est déjà visible
        const elementRect = element.getBoundingClientRect();
        const isAlreadyVisible = elementRect.top < window.innerHeight && elementRect.bottom > 0;
        
        if (isAlreadyVisible) {
          gsap.to(splitText.words, {
            opacity: 1,
            x: 0,
            filter: 'blur(0px)',
            stagger: 0.05,
            duration: 0.5
          });
        } else {
          // 7. Créer une timeline pour l'animation
          const tl = gsap.timeline({paused: true});
          
          // Calculer le stagger avec chevauchement
          const duration = 1;
          const overlap = 0.8;
          const stagger = duration * (1 - overlap);
          
          // Ajouter chaque mot à la timeline
          splitText.words.forEach((word, i) => {
            tl.to(word, {
              opacity: 1,
              x: 0,
              filter: 'blur(0px)',
              duration: duration,
              ease: "power1.inOut"
            }, i * stagger);
          });
          
          // 8. Créer le ScrollTrigger
          ScrollTrigger.create({
            trigger: element,
            start: "top 90%",
            end: "bottom 60%",
            scrub: 0.5,
            onUpdate: (self) => {
              tl.progress(self.progress);
            },
            onRefresh: (self) => {
              // En cas de rafraîchissement de la page
              if (self.progress >= 1) {
                tl.progress(1);
              }
            }
          });
        }
      } catch (error) {
        console.error(`[text-blur] Erreur pour l'élément ${index}:`, error);
        // Rendre visible en cas d'erreur
        element.style.opacity = 1;
      }
    });
    
    // 9. S'assurer que ScrollTrigger se rafraîchit correctement
    ScrollTrigger.refresh();
  }, 250); // Délai important pour s'assurer que tout est chargé
  
  // 10. Rafraîchir lors du redimensionnement
  window.addEventListener('resize', () => {
    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.refresh();
    }
  });
});








// Animation title-blur avec préservation complète de la mise en page
document.addEventListener("DOMContentLoaded", function() {
  // Attendre que tout soit vraiment chargé avant d'initialiser
  setTimeout(() => {
    // Vérifications de base
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || typeof SplitText === 'undefined') {
      console.error("[title-blur] Une dépendance GSAP est manquante");
      return;
    }
    
    gsap.registerPlugin(ScrollTrigger, SplitText);
    
    // Sélectionner les éléments non encore animés
    const titleBlurElements = document.querySelectorAll('.title-blur:not([data-animated="true"])');
    
    titleBlurElements.forEach((element, index) => {
      try {
        // Marquer l'élément comme traité
        element.setAttribute('data-animated', 'true');
        
        // APPROCHE ALTERNATIVE: Préserver la structure DOM originale
        // Au lieu de modifier innerHTML, nous allons stocker la structure originale
        const originalHTML = element.innerHTML;
        const originalStructure = element.cloneNode(true);
        
        // Créer un ID unique
        const uniqueId = `title-blur-${index}-${Date.now()}`;
        element.id = uniqueId;
        
        // Utiliser SplitText en mode plus conservateur
        const splitText = new SplitText(`#${uniqueId}`, {
          type: "chars",
          charsClass: "sb-char",
          reduceWhiteSpace: false, // Important: préserve les espaces
          position: "relative" // Aide à maintenir le positionnement
        });
        
        if (!splitText.chars || splitText.chars.length === 0) {
          console.error(`[title-blur] Échec de SplitText pour l'élément ${index}`);
          element.style.opacity = 1;
          return;
        }
                
        // Appliquer les styles initiaux
        gsap.set(splitText.chars, {
          opacity: 0,
          x: 10,
          filter: 'blur(10px)'
        });
        
        // Ajouter style pour préserver la mise en page
        // Cela aide à maintenir la structure pour les textes pixelisés
        const styleElement = document.createElement('style');
        styleElement.innerHTML = `
          #${uniqueId} .sb-char {
            display: inline-block;
            white-space: pre;
          }
        `;
        document.head.appendChild(styleElement);
        
        // Vérifier si l'élément est déjà visible
        const elementRect = element.getBoundingClientRect();
        const isAlreadyVisible = elementRect.top < window.innerHeight && elementRect.bottom > 0;
        
        if (isAlreadyVisible) {
          gsap.to(splitText.chars, {
            opacity: 1,
            x: 0,
            filter: 'blur(0px)',
            stagger: 0.02,
            duration: 0.3,
            onComplete: () => {
              // Optionnel: restaurer la structure originale après l'animation
              if (originalHTML.includes('<br') || originalHTML.includes('\n')) {
                // On pourrait restaurer ici si nécessaire
              }
            }
          });
        } else {
          // Créer une timeline pour l'animation
          const tl = gsap.timeline({paused: true});
          
          // Paramètres
          const duration = 0.7;
          const overlap = 0.8;
          const stagger = duration * (1 - overlap);
          
          // Ajouter chaque caractère à la timeline
          splitText.chars.forEach((char, i) => {
            tl.to(char, {
              opacity: 1,
              x: 0,
              filter: 'blur(0px)',
              duration: duration,
              ease: "power1.inOut"
            }, i * stagger);
          });
          
          // Créer le ScrollTrigger
          ScrollTrigger.create({
            trigger: element,
            start: "top 90%",
            end: "bottom 60%",
            scrub: 0.5,
            onUpdate: (self) => {
              tl.progress(self.progress);
            },
            onRefresh: (self) => {
              if (self.progress >= 1) {
                tl.progress(1);
              }
            }
          });
        }
      } catch (error) {
        console.error(`[title-blur] Erreur pour l'élément ${index}:`, error);
        element.style.opacity = 1;
      }
    });
    
    ScrollTrigger.refresh();
    console.log("[title-blur] Animation setup terminé");
  }, 250);
}); 