import { TRANSLATIONS, translate, SUPPORTED_LANGUAGES } from './i18n';

// Map of original English text to node
const origTextMap = new WeakMap<Node, string>();

/**
 * Common phrase dictionary for instant client-side translation across all DOM elements
 */
const COMMON_PHRASES: Record<string, Record<string, string>> = {
  // Navigation & General
  'Home': { hi: 'होम', es: 'Inicio', fr: 'Accueil', bn: 'হোম', ta: 'முகப்பு', te: 'హోమ్', mr: 'होम', gu: 'હોમ', kn: 'ಹೋಮ್', ml: 'హోమ్', pa: 'ਹੋਮ', ur: 'ہوم' },
  'Dashboard': { hi: 'डैशबोर्ड', es: 'Panel', fr: 'Tableau de bord', bn: 'ড্যাশবোর্ড', ta: 'டாஷ்போர்டு', te: 'డాష్‌బోర్డ్' },
  'Read & Listen': { hi: 'पढ़ें और सुनें', es: 'Leer y Escuchar', fr: 'Lire et Écouter', bn: 'পড়ুন এবং শুনুন' },
  'Scan a Book': { hi: 'किताब स्कैन करें', es: 'Escanear Libro', fr: 'Scanner un Livre', bn: 'বই স্ক্যান করুন' },
  'Support Tools': { hi: 'सहायक टूल्स', es: 'Herramientas de Apoyo', fr: 'Outils de Soutien' },
  'NeuroPlay': { hi: 'न्यूरोप्ले (खेल)', es: 'NeuroPlay Juegos', fr: 'Jeux NeuroPlay' },
  'Community': { hi: 'समुदाय', es: 'Comunidad', fr: 'Communauté' },
  'About': { hi: 'परिचय', es: 'Acerca de', fr: 'À propos' },
  'Progress': { hi: 'प्रगति', es: 'Progreso', fr: 'Progrès' },
  'Settings': { hi: 'सेटिंग्स', es: 'Ajustes', fr: 'Paramètres' },
  'Sign In': { hi: 'साइन इन', es: 'Iniciar Sesión', fr: 'Se connecter' },
  'Sign Out': { hi: 'साइन आउट', es: 'Cerrar Sesión', fr: 'Se déconnecter' },
  'Login': { hi: 'लॉगिन', es: 'Iniciar Sesión', fr: 'Connexion' },
  'Register': { hi: 'पंजीकरण', es: 'Registrarse', fr: 'S\'inscrire' },
  'Create Account': { hi: 'खाता बनाएं', es: 'Crear Cuenta', fr: 'Créer un Compte' },
  'Full Name': { hi: 'पूरा नाम', es: 'Nombre Completo', fr: 'Nom Complet' },
  'Email': { hi: 'ईमेल', es: 'Correo Electrónico', fr: 'E-mail' },
  'Password': { hi: 'पासवर्ड', es: 'Contraseña', fr: 'Mot de passe' },
  'Continue with Google': { hi: 'गूगल के साथ लॉगिन करें', es: 'Continuar con Google', fr: 'Continuer avec Google' },

  // Hero Section Verbatim Text (Image 2)
  'AI-Powered Language Support': { hi: 'एआई-संचालित भाषा सहायता', es: 'Soporte de Lenguaje con IA', fr: 'Support Linguistique IA' },
  'Understand. Express. Grow.': { hi: 'समझें। व्यक्त करें। बढ़ें।', es: 'Comprender. Expresar. Crecer.', fr: 'Comprendre. Exprimer. Grandir.' },
  'Lingua AI provides personalized tools for reading, listening, vocabulary, comprehension, and communication practice.': {
    hi: 'लिंगुआ एआई पढ़ने, सुनने, शब्दावली, समझ और संचार अभ्यास के लिए व्यक्तिगत उपकरण प्रदान करता है।',
    es: 'Lingua AI proporciona herramientas personalizadas para la práctica de lectura, escucha, vocabulario, comprensión y comunicación.',
    fr: 'Lingua AI fournit des outils personnalisés pour la lecture, l\'écoute, le vocabulaire, la compréhension et la communication.',
  },
  'Explore Lingua AI →': { hi: 'लिंगुआ एआई खोजें →', es: 'Explorar Lingua AI →', fr: 'Explorer Lingua AI →' },
  'Explore Lingua AI': { hi: 'लिंगुआ एआई खोजें', es: 'Explorar Lingua AI', fr: 'Explorer Lingua AI' },
  'See How It Works': { hi: 'देखें यह कैसे काम करता है', es: 'Ver Cómo Funciona', fr: 'Voir comment ça marche' },
  '✓ DLD & Speech Focused': { hi: '✓ DLD और वाणी पर केंद्रित', es: '✓ Enfocado en DLD y Habla', fr: '✓ Axé sur le TDL et la parole' },
  '📷 Camera & OCR Enabled': { hi: '📷 कैमरा और OCR सक्षम', es: '📷 Cámara y OCR Habilitados', fr: '📷 Caméra et OCR Activés' },
  '🌐 Multilingual Support': { hi: '🌐 बहुभाषी सहायता', es: '🌐 Soporte Multilingüe', fr: '🌐 Support Multilingue' },
  'Language Practice': { hi: 'भाषा अभ्यास', es: 'Práctica de Idiomas', fr: 'Pratique de la langue' },
  'Personalized Learning Hub': { hi: 'व्यक्तिगत शिक्षण केंद्र', es: 'Centro de Aprendizaje Personalizado', fr: 'Centre d\'apprentissage personnalisé' },
  'Active': { hi: 'सक्रिय', es: 'Activo', fr: 'Actif' },

  // Floating Cards near Hero
  'Books & Stories': { hi: 'किताबें और कहानियाँ', es: 'Libros e Historias', fr: 'Livres et histoires' },
  'Word Power': { hi: 'शब्द शक्ति', es: 'Poder de Palabras', fr: 'Pouvoir des mots' },
  'Speech AI': { hi: 'स्पीच एआई', es: 'IA de Habla', fr: 'IA vocale' },
  'Read - Books & Stories': { hi: 'पढ़ें - किताबें और कहानियाँ', es: 'Leer - Libros e Historias', fr: 'Lire - Livres et histoires' },
  'Vocabulary - Word Power': { hi: 'शब्दावली - शब्द शक्ति', es: 'Vocabulario - Poder de Palabras', fr: 'Vocabulaire - Pouvoir des mots' },
  'Communicate - Speech AI': { hi: 'संवाद - स्पीच एआई', es: 'Comunicar - IA de Habla', fr: 'Communiquer - IA vocale' },

  // Feature Grid (Spec 1)
  'Smart Scan': { hi: 'स्मार्ट स्कैन', es: 'Escaneo Inteligente', fr: 'Analyse Intelligente' },
  'Audio Listen': { hi: 'ऑडियो सुनें', es: 'Escuchar Audio', fr: 'Écoute Audio' },
  'Comprehension': { hi: 'समझें और सीखें', es: 'Comprensión', fr: 'Compréhension' },
  'Neuroplay Games': { hi: 'न्यूरोप्ले खेल', es: 'Juegos Neuroplay', fr: 'Jeux Neuroplay' },
  'My Progress': { hi: 'मेरी प्रगति', es: 'Mi Progreso', fr: 'Mes Progrès' },

  // How It Helps Steps (Spec 1)
  'Adaptive Feedback': { hi: 'अनुकूली प्रतिक्रिया', es: 'Retroalimentación Adaptativa', fr: 'Retour Adaptatif' },
  'Real-time speech cues and pronunciation scaffolds.': { hi: 'रीयल-टाइम आवाज़ संकेत और उच्चारण में सहायता।', es: 'Pistas de habla en tiempo real y andamios de pronunciación.', fr: 'Pistes vocales en temps réel et échafaudages de prononciation.' },
  'Confidence & Growth': { hi: 'आत्मविश्वास और विकास', es: 'Confianza y Crecimiento', fr: 'Confiance et Croissance' },
  'Track developmental fluency milestones.': { hi: 'विकासशील भाषा प्रवाह के मील के पत्थर ट्रैक करें।', es: 'Rastrea los hitos de fluidez del desarrollo.', fr: 'Suivez les étapes de fluidité du développement.' },

  // Dashboard Metrics (Spec 2)
  '14 Pages': { hi: '14 पृष्ठ', es: '14 Páginas', fr: '14 Pages' },
  'Scanned & Read': { hi: 'स्कैन और पढ़े गए', es: 'Escaneado y Leído', fr: 'Scanné et Lu' },
  '42 Mins': { hi: '42 मिनट', es: '42 Minutos', fr: '42 Min' },
  'Active Listening': { hi: 'सक्रिय श्रवण', es: 'Escucha Activa', fr: 'Écoute Active' },
  '28 Words': { hi: '28 शब्द', es: '28 Palabras', fr: '28 Mots' },
  'Vocabulary Mastered': { hi: 'कंठस्थ शब्दावली', es: 'Vocabulario Dominado', fr: 'Vocabulaire Maîtrisé' },
  '220 Pts': { hi: '220 अंक', es: '220 Pts', fr: '220 Pts' },
  'NeuroPlay Score': { hi: 'न्यूरोप्ले स्कोर', es: 'Puntuación NeuroPlay', fr: 'Score NeuroPlay' },
  'Speech Fluency & Comprehension': { hi: 'वाक् प्रवाह और समझ', es: 'Fluidez del Habla y Comprensión', fr: 'Fluidité Vocale et Compréhension' },
  'Overview of recent neural learning sessions': { hi: 'हालिया सत्रों का अवलोकन', es: 'Visión general de sesiones recientes', fr: 'Aperçu des sessions récentes' },
  'DAILY': { hi: 'दैनिक', es: 'DIARIO', fr: 'QUOTIDIEN' },
  'WEEKLY': { hi: 'साप्ताहिक', es: 'SEMANAL', fr: 'HEBDOMADAIRE' },
  'MONTHLY': { hi: 'मासिक', es: 'MENSUAL', fr: 'MENSUEL' },
  'YEARLY': { hi: 'वार्षिक', es: 'ANUAL', fr: 'ANNUEL' },
  'Comprehension Accuracy': { hi: 'समझ की सटीकता', es: 'Precisión de Comprensión', fr: 'Précision de Compréhension' },
  'Total Practices Completed': { hi: 'कुल अभ्यास पूर्ण', es: 'Prácticas Totales Completadas', fr: 'Pratiques Totales Terminées' },
  'Download Summary Report': { hi: 'सारांश रिपोर्ट डाउनलोड करें', es: 'Descargar Informe de Resumen', fr: 'Télécharger le Rapport Résumé' },
  'Listening': { hi: 'श्रवण', es: 'Escucha', fr: 'Écoute' },
  'Speaking': { hi: 'वाचन', es: 'Habla', fr: 'Parole' },
  'Learning Modality Distribution': { hi: 'सीखने के माध्यम का वितरण', es: 'Distribución de Modalidades', fr: 'Distribution des Modalités' },
  'Overall Fluency': { hi: 'समग्र प्रवाह', es: 'Fluidez General', fr: 'Fluidité Globale' },
  'Speech Therapy': { hi: 'स्पीच थेरेपी', es: 'Terapia del Habla', fr: 'Orthophonie' },
  'Guided Listening': { hi: 'निर्देशित श्रवण', es: 'Escucha Guiada', fr: 'Écoute Guidée' },
  'Phonics Reading': { hi: 'फ़ोनिक्स पठन', es: 'Lectura Fónica', fr: 'Lecture Phonique' },

  // Actions & Buttons
  'Save': { hi: 'सहेजें', es: 'Guardar', fr: 'Enregistrer' },
  'Cancel': { hi: 'रद्द करें', es: 'Cancelar', fr: 'Annuler' },
  'Delete': { hi: 'हटाएं', es: 'Eliminar', fr: 'Supprimer' },
  'Edit': { hi: 'संपादित करें', es: 'Editar', fr: 'Modifier' },
  'Listen': { hi: 'सुनें', es: 'Escuchar', fr: 'Écouter' },
  'Read': { hi: 'पढ़ें', es: 'Leer', fr: 'Lire' },
  'Back': { hi: 'पीछे', es: 'Atrás', fr: 'Retour' },
  'Next': { hi: 'आगे', es: 'Siguiente', fr: 'Suivant' },
  'Done': { hi: 'संपन्न', es: 'Hecho', fr: 'Terminé' },
  'Close': { hi: 'बंद करें', es: 'Cerrar', fr: 'Fermer' },
  'Search': { hi: 'खोजें', es: 'Buscar', fr: 'Rechercher' },
  'Filter': { hi: 'फ़िल्टर', es: 'Filtrar', fr: 'Filtrer' },
  'Learn More': { hi: 'और जानें', es: 'Aprender Más', fr: 'En savoir plus' },
};

/**
 * Looks up translation for any text phrase across translations dictionary & common phrases
 */
export function getPhraseTranslation(text: string, langCode: string): string {
  if (!text || langCode === 'en') return text;

  const trimmed = text.trim();
  if (!trimmed) return text;

  // 1. Check direct COMMON_PHRASES lookup
  if (COMMON_PHRASES[trimmed]?.[langCode]) {
    return text.replace(trimmed, COMMON_PHRASES[trimmed][langCode]);
  }

  // 2. Check if text matches any key in TRANSLATIONS[langCode]
  const targetDict = TRANSLATIONS[langCode] || {};
  const enDict = TRANSLATIONS['en'] || {};

  for (const key of Object.keys(enDict)) {
    if (enDict[key] === trimmed && targetDict[key]) {
      return text.replace(trimmed, targetDict[key]);
    }
  }

  return text;
}

/**
 * Sets Google Translate cookie so Google's native translation engine auto-translates all page text
 */
function setGoogleTranslateCookie(langCode: string) {
  if (typeof document === 'undefined') return;
  const domain = window.location.hostname;
  const cookieVal = langCode === 'en' ? '' : `/en/${langCode}`;
  document.cookie = `googtrans=${cookieVal}; path=/;`;
  if (domain && domain !== 'localhost') {
    document.cookie = `googtrans=${cookieVal}; domain=${domain}; path=/;`;
    document.cookie = `googtrans=${cookieVal}; domain=.${domain}; path=/;`;
  }
}

/**
 * Initializes hidden Google Translate widget script in background
 */
export function initGoogleTranslateWidget() {
  if (typeof window === 'undefined' || (window as any).__gtInitialized) return;
  (window as any).__gtInitialized = true;

  // Create hidden container if not present
  if (!document.getElementById('google_translate_element')) {
    const div = document.createElement('div');
    div.id = 'google_translate_element';
    div.style.display = 'none';
    document.body.appendChild(div);
  }

  (window as any).googleTranslateElementInit = () => {
    try {
      new (window as any).google.translate.TranslateElement(
        {
          pageLanguage: 'en',
          autoDisplay: false,
          layout: (window as any).google.translate.TranslateElement.InlineLayout.SIMPLE,
        },
        'google_translate_element'
      );
    } catch {}
  };

  const script = document.createElement('script');
  script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
  script.async = true;
  document.body.appendChild(script);
}

/**
 * Trigger function for Google Translate element and cookie persistence
 */
export function triggerGoogleTranslate(langCode: string) {
  if (typeof document === 'undefined') return;

  // Set the googtrans cookie to persist across clicks and page navigations
  const hostname = window.location.hostname;
  const cookieVal = langCode === 'en' ? '' : `/en/${langCode}`;

  document.cookie = `googtrans=${cookieVal}; path=/;`;
  if (hostname) {
    document.cookie = `googtrans=${cookieVal}; domain=${hostname}; path=/;`;
    document.cookie = `googtrans=${cookieVal}; domain=.${hostname}; path=/;`;
  }

  const applySelect = () => {
    const selectEl = document.querySelector<HTMLSelectElement>('.goog-te-combo');
    if (selectEl) {
      if (selectEl.value !== langCode) {
        selectEl.value = langCode;
        selectEl.dispatchEvent(new Event('change'));
      }
      return true;
    }
    return false;
  };

  if (!applySelect()) {
    let attempts = 0;
    const interval = setInterval(() => {
      attempts++;
      if (applySelect() || attempts > 10) {
        clearInterval(interval);
      }
    }, 200);
  }
}

/**
 * Universal DOM Text-Node Walker: Translates EVERY text node present in document.body
 */
export function translateEntireDOM(langCode: string) {
  if (typeof document === 'undefined') return;

  // Store in localStorage for persistence across reloads
  try {
    localStorage.setItem('lingua_lang', langCode);
    localStorage.setItem('selectedLanguage', langCode);
    localStorage.setItem('lingua_app_language', langCode);
  } catch {}

  // Set html lang
  document.documentElement.lang = langCode;

  // Set Google Translate cookie
  setGoogleTranslateCookie(langCode);

  // If returning to English, restore all original text nodes and reset Google translate
  if (langCode === 'en') {
    restoreAllOriginalText();
    triggerGoogleTranslate('en');
    return;
  }

  // Ensure Google Translate widget script is active and triggered
  initGoogleTranslateWidget();
  triggerGoogleTranslate(langCode);

  // Walk text nodes in document.body
  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode(node) {
        if (!node.textContent || !node.textContent.trim()) return NodeFilter.FILTER_REJECT;
        const parent = node.parentElement;
        if (!parent) return NodeFilter.FILTER_REJECT;
        const tag = parent.tagName.toLowerCase();
        if (['script', 'style', 'code', 'pre', 'noscript', 'svg', 'path'].includes(tag)) {
          return NodeFilter.FILTER_REJECT;
        }
        if (parent.closest('#google_translate_element') || parent.closest('.notranslate')) {
          return NodeFilter.FILTER_REJECT;
        }
        return NodeFilter.FILTER_ACCEPT;
      },
    }
  );

  const nodes: Text[] = [];
  let current = walker.nextNode();
  while (current) {
    nodes.push(current as Text);
    current = walker.nextNode();
  }

  nodes.forEach((node) => {
    if (!origTextMap.has(node)) {
      origTextMap.set(node, node.textContent || '');
    }

    const orig = origTextMap.get(node) || '';
    if (!orig.trim()) return;

    const translated = getPhraseTranslation(orig, langCode);
    if (translated && translated !== orig) {
      node.textContent = translated;
    }
  });

  // Also trigger Google Translate dropdown selection if iframe is present
  try {
    const selectEl = document.querySelector<HTMLSelectElement>('.goog-te-combo');
    if (selectEl) {
      selectEl.value = langCode;
      selectEl.dispatchEvent(new Event('change'));
    }
  } catch {}
}

/**
 * Restores original English text to all walked DOM text nodes
 */
export function restoreAllOriginalText() {
  if (typeof document === 'undefined') return;

  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    null
  );

  let current = walker.nextNode();
  while (current) {
    if (origTextMap.has(current)) {
      const orig = origTextMap.get(current);
      if (orig !== undefined) {
        current.textContent = orig;
      }
    }
    current = walker.nextNode();
  }
}

// Global MutationObserver to automatically translate newly added DOM nodes (modals, route changes)
let observerInstance: MutationObserver | null = null;

export function startDOMTranslationObserver(getLang: () => string) {
  if (typeof document === 'undefined' || observerInstance) return;

  observerInstance = new MutationObserver(() => {
    const currentLang = getLang();
    if (currentLang && currentLang !== 'en') {
      translateEntireDOM(currentLang);
    }
  });

  observerInstance.observe(document.body, {
    childList: true,
    subtree: true,
  });
}
