gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

// Importation des scripts
import './cursor.js';
import './smooth-scroll.js'; // À vérifier si toujours utile
import './dark-mode.js';
import './audio.js';
import './time-switch.js';
import './scramble.js';
// import './transition.js'; // L'ancien fichier de transition, maintenant commenté

// Importation des nouveaux modules
import './mono-appear.js';
import './page-transitions.js';
import './scroll-blur.js';

// Initialisation globale si nécessaire (ex: enregistrement global de plugins GSAP)
// gsap.registerPlugin(ScrollTrigger, SplitText, /* ... autres plugins ... */);

// Note : Il est souvent préférable d'enregistrer les plugins dans les modules
// qui les utilisent directement (ce qui est déjà fait dans les scripts copiés).

document.addEventListener('DOMContentLoaded', () => {
  // Code d'initialisation global qui doit attendre le DOM
  console.log("Tous les modules chargés et le DOM est prêt.");
  
  // Les modules importés exécutent déjà leur propre code après chargement
  // grâce à leur propre 'DOMContentLoaded' ou 'setTimeout'.
});