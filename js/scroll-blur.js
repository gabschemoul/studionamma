

// Ajouter cette fonction en tout premier
(function() {
    // Force la visibilité des éléments si l'animation ne fonctionne pas après 3 secondes
    setTimeout(() => {
      document.querySelectorAll('.text-blur, .title-blur').forEach(el => {
        if (getComputedStyle(el).visibility === 'hidden' || getComputedStyle(el).opacity === '0') {
          console.warn("Force la visibilité d'un élément qui devrait être animé:", el.id || el.className);
          gsap.set(el, {autoAlpha: 1, overwrite: true});
        }
      });
    }, 3000);
  })();
  
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
        
        // MODIFICATION 1: Initialiser les éléments avec autoAlpha: 0 avec overwrite: true
        gsap.set(".text-blur, .title-blur", {autoAlpha: 0, overwrite: true});
        
        // Problème clé: Webflow peut ajouter des éléments span à l'intérieur du texte
        // qui interfèrent avec SplitText. On nettoie d'abord le texte.
        
        const textBlurElements = document.querySelectorAll('.text-blur:not([data-animated="true"])');
        
        textBlurElements.forEach((element, index) => {
          try {
            // MODIFICATION 2: Assurer que l'élément n'a pas d'attributs de style qui peuvent interférer
            element.style.removeProperty('opacity');
            element.style.removeProperty('visibility');
            
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
              // Étape 3: Utiliser autoAlpha au lieu de opacity avec overwrite: true
              gsap.set(element, {autoAlpha: 1, overwrite: true});
              return;
            }
                    
            // 5. Appliquer les styles initiaux avec overwrite: true
            gsap.set(splitText.words, {
              autoAlpha: 0,
              x: 10,
              filter: 'blur(10px)',
              overwrite: true
            });
            
            // 6. Vérifier si l'élément est déjà visible
            const elementRect = element.getBoundingClientRect();
            const isAlreadyVisible = elementRect.top < window.innerHeight && elementRect.bottom > 0;
            
            if (isAlreadyVisible) {
              gsap.to(splitText.words, {
                autoAlpha: 1,
                x: 0,
                filter: 'blur(0px)',
                stagger: 0.05,
                duration: 0.5,
                overwrite: true, // MODIFICATION 3: Ajouter overwrite
                onComplete: () => {
                  // MODIFICATION 4: S'assurer que l'élément parent est visible
                  gsap.set(element, {autoAlpha: 1, overwrite: true});
                }
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
                  autoAlpha: 1,
                  x: 0,
                  filter: 'blur(0px)',
                  duration: duration,
                  ease: "power1.inOut",
                  overwrite: true // MODIFICATION 5: Ajouter overwrite
                }, i * stagger);
              });
              
              // MODIFICATION 6: Assurer la visibilité du parent à la fin
              tl.set(element, {autoAlpha: 1, overwrite: true}, duration + (splitText.words.length * stagger));
              
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
                },
                // MODIFICATION 7: Ajouter des callbacks supplémentaires
                onEnter: () => {
                  console.log(`Élément ${element.id} entré dans la vue`);
                },
                onLeave: () => {
                  console.log(`Élément ${element.id} sorti de la vue`);
                }
              });
            }
          } catch (error) {
            console.error(`[text-blur] Erreur pour l'élément ${index}:`, error);
            // MODIFICATION 8: Force la visibilité en cas d'erreur
            gsap.set(element, {autoAlpha: 1, overwrite: true});
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
        
        // Étape 2: Initialiser les éléments avec autoAlpha pour éviter le FOUC
        // (On ne le répète pas ici car c'est déjà fait dans la section text-blur)
        
        // Sélectionner les éléments non encore animés
        const titleBlurElements = document.querySelectorAll('.title-blur:not([data-animated="true"])');
        
        titleBlurElements.forEach((element, index) => {
          try {
            // MODIFICATION 9: Assurer que l'élément n'a pas d'attributs de style qui peuvent interférer
            element.style.removeProperty('opacity');
            element.style.removeProperty('visibility');
            
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
              // MODIFICATION 10: Force la visibilité en cas d'échec avec overwrite
              gsap.set(element, {autoAlpha: 1, overwrite: true});
              return;
            }
                    
            // Appliquer les styles initiaux avec overwrite: true
            gsap.set(splitText.chars, {
              autoAlpha: 0,
              x: 10,
              filter: 'blur(10px)',
              overwrite: true
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
                // Option 1: Animation plus lente pour les éléments déjà visibles
                gsap.to(splitText.chars, {
                  autoAlpha: 1,
                  x: 0,
                  filter: 'blur(0px)',
                  stagger: 0.05,  // Augmenter le stagger
                  duration: 0.8,  // Augmenter la durée
                  overwrite: true
                });
                
                // Option 2: Ou, pour un effet plus progressif, vous pourriez utiliser
                // une timeline avec un délai
                /*
                const tl = gsap.timeline();
                tl.to(splitText.chars, {
                  autoAlpha: 1,
                  x: 0,
                  filter: 'blur(0px)',
                  stagger: 0.05,
                  duration: 0.8,
                  overwrite: true
                }, 0.5); // Délai de 0.5s avant de commencer
                */
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
                  autoAlpha: 1,
                  x: 0,
                  filter: 'blur(0px)',
                  duration: duration,
                  ease: "power1.inOut",
                  overwrite: true // MODIFICATION 13: Ajouter overwrite
                }, i * stagger);
              });
              
              // MODIFICATION 14: Assurer la visibilité du parent à la fin
              tl.set(element, {autoAlpha: 1, overwrite: true}, duration + (splitText.chars.length * stagger));
              
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
                },
                // MODIFICATION 15: Ajouter des callbacks supplémentaires
                onEnter: () => {
                  console.log(`Élément ${element.id} entré dans la vue`);
                },
                onLeave: () => {
                  console.log(`Élément ${element.id} sorti de la vue`);
                }
              });
            }
          } catch (error) {
            console.error(`[title-blur] Erreur pour l'élément ${index}:`, error);
            // MODIFICATION 16: Force la visibilité en cas d'erreur avec overwrite
            gsap.set(element, {autoAlpha: 1, overwrite: true});
          }
        });
        
        ScrollTrigger.refresh();
        console.log("[title-blur] Animation setup terminé");
      }, 250);
    });