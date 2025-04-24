// Solution définitive pour les animations mono-appear (avec fix FOUC)
document.addEventListener("DOMContentLoaded", function() {
    setTimeout(() => {
      if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        console.error("[mono-appear] GSAP ou ScrollTrigger n'est pas disponible");
        return;
      }
  
      gsap.registerPlugin(ScrollTrigger);
  
      // Stocker le contenu original pour la réinitialisation
      const originalContent = new Map();
  
      // Initialiser les contenus originaux
      document.querySelectorAll('.mono-appear, .mono-appear-multi').forEach((element, index) => {
        if (!element.id) {
          element.id = `elem-${Date.now()}-${index}`;
        }
        originalContent.set(element.id, element.innerHTML);
      });
  
      // Fonction pour réinitialiser un élément à son état d'origine
      function resetElement(element) {
        if (element.id && originalContent.has(element.id)) {
          element.innerHTML = originalContent.get(element.id);
          element.removeAttribute('data-animated');
          // --- MODIFICATION 1 ---
          // Réappliquer le style caché initial après la réinitialisation
          gsap.set(element, { visibility: 'hidden' });
          // --- FIN MODIFICATION 1 ---
        }
      }
  
      // Fonction pour l'animation mono-appear simple
      function animateMonoAppear(element) {
        if (element.hasAttribute('data-animated') || element.querySelector('.mono-wrapper')) {
          return; // Éviter les animations multiples
        }
  
        try {
          // --- MODIFICATION 2 ---
          // Rendre le parent visible AVANT toute manipulation
          gsap.set(element, { autoAlpha: 1 });
          // --- FIN MODIFICATION 2 ---
  
          // Marquer comme en cours d'animation
          element.setAttribute('data-animated', 'true');
  
          // Obtenir la couleur du texte
          const textColor = window.getComputedStyle(element).color;
  
          // Sauvegarder le contenu original si pas déjà fait
          if (!element.id || !originalContent.has(element.id)) {
            element.id = `elem-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
            originalContent.set(element.id, element.innerHTML);
          }
  
          // Créer la structure d'animation
          const contentHTML = element.innerHTML;
          const wrapper = document.createElement('div');
          wrapper.className = 'mono-wrapper';
          wrapper.style.position = 'relative';
          wrapper.style.display = 'inline-block';
          wrapper.style.overflow = 'hidden';
  
          const textElement = document.createElement('div');
          textElement.className = 'mono-text';
          textElement.innerHTML = contentHTML;
          textElement.style.opacity = '0'; // Enfant caché initialement
          textElement.style.position = 'relative';
          textElement.style.zIndex = '1';
  
          const rectangle = document.createElement('div');
          rectangle.className = 'mono-rectangle';
          rectangle.style.position = 'absolute';
          rectangle.style.top = '0';
          rectangle.style.left = '0';
          rectangle.style.width = '0';
          rectangle.style.height = '100%';
          rectangle.style.backgroundColor = textColor;
          rectangle.style.zIndex = '2';
  
          wrapper.appendChild(textElement);
          wrapper.appendChild(rectangle);
  
          element.innerHTML = ''; // Effacer contenu original
          element.appendChild(wrapper);
  
          // Créer l'animation avec GSAP
          const tl = gsap.timeline({
            onComplete: () => {
              console.log(`Animation terminée pour ${element.id}`);
            }
          });
  
          // Étape 1: Rectangle qui s'étend de gauche à droite
          tl.to(rectangle, {
            width: '100%',
            duration: 0.4,
            ease: "power4.in"
          });
  
          // Étape 2: Afficher le texte (opacity suffit car parent est visible/opaque)
          tl.to(textElement, {
            opacity: 1,
            duration: 0.01
          }, 0.4);
  
          // Étape 3: Pause
          tl.to({}, { duration: 0.2 });
  
          // Étape 4: Repositionner le rectangle
          tl.set(rectangle, {
            left: 'auto',
            right: '0'
          });
  
          // Étape 5: Rectangle qui disparaît
          tl.to(rectangle, {
            width: '0%',
            duration: 0.4,
            ease: "power4.out"
          });
  
          // Jouer l'animation
          tl.play();
  
        } catch (error) {
          console.error("[mono-appear] Erreur:", error);
          // --- MODIFICATION 3 ---
          gsap.set(element, { autoAlpha: 1 }); // Fallback plus sûr
          // --- FIN MODIFICATION 3 ---
        }
      }
  
      // Fonction pour l'animation multi-ligne
      function animateMonoAppearMulti(element) {
        if (element.hasAttribute('data-animated') || element.querySelector('.mono-wrapper')) {
          return; // Éviter les animations multiples
        }
  
        try {
          // --- MODIFICATION 4 ---
          // Rendre le parent visible AVANT toute manipulation
          gsap.set(element, { autoAlpha: 1 });
          // --- FIN MODIFICATION 4 ---
  
          // Marquer comme en cours d'animation
          element.setAttribute('data-animated', 'true');
  
          // Sauvegarder le contenu original si pas déjà fait
          if (!element.id || !originalContent.has(element.id)) {
            element.id = `multi-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
            originalContent.set(element.id, element.innerHTML);
          }
  
          // Obtenir la couleur et le contenu
          const textColor = window.getComputedStyle(element).color;
          const originalHTML = element.innerHTML;
  
          // Détecter les lignes (logique existante)
          const tempContainer = document.createElement('div');
          tempContainer.style.position = 'absolute';
          tempContainer.style.visibility = 'hidden';
          tempContainer.style.width = window.getComputedStyle(element).width;
          tempContainer.style.fontSize = window.getComputedStyle(element).fontSize;
          tempContainer.style.fontFamily = window.getComputedStyle(element).fontFamily;
          tempContainer.style.whiteSpace = window.getComputedStyle(element).whiteSpace;
          tempContainer.style.letterSpacing = window.getComputedStyle(element).letterSpacing;
          tempContainer.style.lineHeight = window.getComputedStyle(element).lineHeight;
          tempContainer.innerHTML = originalHTML;
          document.body.appendChild(tempContainer);
  
          const range = document.createRange();
          const textNode = tempContainer.firstChild;
          const lines = [];
  
          if (textNode && textNode.nodeType === Node.TEXT_NODE) {
              const textContent = textNode.textContent;
              let lineStart = 0;
              let lineTop = null;
  
              for (let i = 0; i < textContent.length; i++) {
                  // Vérifier le caractère pour s'assurer qu'il n'est pas vide
                  if (/\S/.test(textContent[i])) {
                      range.setStart(textNode, i);
                      range.setEnd(textNode, i + 1);
                      const rect = range.getBoundingClientRect();
  
                      if (lineTop === null) {
                          lineTop = rect.top;
                      } else if (rect.top > lineTop + 2) { // +2 pour une petite marge d'erreur
                          lines.push(textContent.substring(lineStart, i).trim());
                          lineStart = i;
                          lineTop = rect.top;
                      }
                  }
              }
              // Ajouter la dernière ligne si elle n'est pas vide
              const lastLine = textContent.substring(lineStart).trim();
              if (lastLine) {
                  lines.push(lastLine);
              }
          } else if (tempContainer.textContent.trim()) {
              // Fallback si pas un simple nœud texte, mais a du contenu
              lines.push(tempContainer.textContent.trim());
          }
  
  
          document.body.removeChild(tempContainer);
  
          // Si aucune ligne détectée, ne rien faire (ou gérer comme mono-appear simple)
          if (lines.length === 0) {
            console.warn(`[mono-appear-multi] Aucune ligne détectée pour ${element.id}`);
            element.removeAttribute('data-animated'); // Permettre une autre tentative
            gsap.set(element, { visibility: 'visible' }); // Rendre visible au cas où
            return;
          }
  
  
          // Créer la structure
          element.innerHTML = ''; // Effacer contenu original
          const wrapper = document.createElement('div');
          wrapper.className = 'mono-wrapper';
          wrapper.style.position = 'relative';
          element.appendChild(wrapper);
  
          // Créer les lignes
          const lineElements = [];
          const lineRectangles = [];
  
          lines.forEach((lineText, lineIndex) => {
            const lineContainer = document.createElement('div');
            lineContainer.className = 'line-container';
            lineContainer.style.position = 'relative';
            lineContainer.style.display = 'block'; // Important pour que overflow hidden fonctionne par ligne
            lineContainer.style.overflow = 'hidden'; // Nécessaire ici
  
            const textElement = document.createElement('div');
            textElement.className = 'line-text';
            textElement.textContent = lineText;
            textElement.style.opacity = '0'; // Cacher enfant texte
            textElement.style.position = 'relative'; // Pour z-index
            textElement.style.zIndex = '1';
            textElement.style.display = 'inline-block'; // Pour mesurer la largeur
  
            lineContainer.appendChild(textElement);
            wrapper.appendChild(lineContainer);
  
            // Mesurer la largeur APRÈS l'ajout au DOM potentiel (plus fiable)
            const textWidth = textElement.getBoundingClientRect().width;
  
  
            const rectangle = document.createElement('div');
            rectangle.className = 'line-rectangle';
            rectangle.style.position = 'absolute';
            rectangle.style.top = '0';
            rectangle.style.left = '0';
            rectangle.style.width = '0'; // Commence à 0
            rectangle.style.height = '100%';
            rectangle.style.backgroundColor = textColor;
            rectangle.style.zIndex = '2'; // Au-dessus du texte initialement
  
            // Insérer le rectangle dans le lineContainer, avant le texte
            lineContainer.insertBefore(rectangle, textElement);
  
            lineElements.push(textElement);
            lineRectangles.push({
              element: rectangle,
              width: Math.max(1, textWidth) // Assurer une largeur minimale de 1px si texte vide/invisible
            });
          });
  
          // Créer la timeline principale
          const tl = gsap.timeline({
            onComplete: () => {
              console.log(`Animation multi-ligne terminée pour ${element.id}`);
            }
          });
  
          // Animer chaque ligne avec un décalage
          lineElements.forEach((textElement, i) => {
            const rectInfo = lineRectangles[i];
            const rect = rectInfo.element;
            const width = rectInfo.width;
  
            const lineTl = gsap.timeline();
  
            // 1. Le rectangle s'étend pour couvrir le texte
            lineTl.to(rect, {
              width: width, // Utiliser la largeur mesurée
              duration: 0.4,
              ease: "power4.in"
            })
            // 2. Le texte apparaît juste avant que le rectangle ne parte
            .to(textElement, {
              opacity: 1, // Le texte devient visible
              duration: 0.01
            }, 0.38) // Légèrement avant la fin de l'expansion du rectangle
            // 3. Petite pause (optionnel, ajuste le rythme)
            .to({}, {duration: 0.3}) // Temps pendant lequel le rectangle couvre le texte visible
            // 4. Préparer le rectangle à partir de la droite
            .set(rect, {
              left: 'auto',
              right: '0'
            })
            // 5. Le rectangle se rétracte vers la droite, révélant le texte
            .to(rect, {
              width: 0, // Le rectangle disparaît
              duration: 0.4,
              ease: "power4.out"
            });
  
            // Ajouter la timeline de cette ligne à la timeline principale avec un décalage
            tl.add(lineTl, i * 0.15); // Chaque ligne commence 0.15s après la précédente
          });
  
          // Jouer l'animation principale
          tl.play();
  
        } catch (error) {
          console.error("[mono-appear-multi] Erreur:", error);
           // --- MODIFICATION 5 ---
          gsap.set(element, { autoAlpha: 1 }); // Fallback plus sûr
           // --- FIN MODIFICATION 5 ---
        }
      }
  
      // Fonction pour vérifier et animer les éléments visibles
      function checkVisibleElements() {
        // Trouver tous les éléments non-animés
        const elements = document.querySelectorAll('.mono-appear:not([data-animated]), .mono-appear-multi:not([data-animated])');
  
        elements.forEach(element => {
          const rect = element.getBoundingClientRect();
          // Si l'élément est visible dans le viewport (top < vh ET bottom > 0)
          if (rect.top < window.innerHeight && rect.bottom > 0) {
            if (element.classList.contains('mono-appear')) {
              animateMonoAppear(element);
            } else if (element.classList.contains('mono-appear-multi')) {
              animateMonoAppearMulti(element);
            }
          }
        });
      }
  
      // Fonction pour réinitialiser les éléments sortis par le haut ou par le bas
      function resetElementsOutOfViewport() {
        document.querySelectorAll('[data-animated="true"]').forEach(element => {
          const rect = element.getBoundingClientRect();
          // Réinitialiser si l'élément est sorti par le haut (marge de 100px)
          // OU si l'élément est sorti par le bas (marge de 100px)
          if (rect.bottom < -100 || rect.top > window.innerHeight + 100) {
            resetElement(element);
          }
        });
      }
  
      // IMPORTANT: Déclencher les animations pour les éléments déjà visibles au chargement
      checkVisibleElements();
  
      // Vérifier au scroll
      window.addEventListener('scroll', function() {
        checkVisibleElements();
        resetElementsOutOfViewport(); // Appeler la fonction mise à jour
      });
  
      // Vérifier périodiquement (pour les nouvelles sections chargées dynamiquement)
      setInterval(checkVisibleElements, 2000);
  
      console.log("[mono-appear] Configuration terminée (avec fix FOUC)");
    }, 500); // Délai pour s'assurer que tout est chargé
  });