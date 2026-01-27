
export interface UiTranslation {
  name: string;
  lesson: string;
  result: string;
  reset: string;
  check: string;
  retry: string;
  loading: string;
  errorTitle: string;
  errorMsg: string;
  retryLoad: string;
  selectLanguage: string;
  selectLesson: string;
  languageNames: Record<string, string>; // Neue Property für Sprachnamen
}

export const UI_DATA: Record<string, UiTranslation> = {
  'DE': {
    name: 'DE',
    lesson: 'Lektion', result: 'Ergebnis', reset: 'Zurücksetzen', check: 'Überprüfen', retry: 'Nochmal versuchen',
    loading: 'Lade Lektionen...', errorTitle: 'Fehler beim Laden', errorMsg: 'Daten konnten nicht geladen werden.', retryLoad: 'Erneut versuchen',
    selectLanguage: 'Lernsprache', selectLesson: 'Lektion',
    languageNames: { 'DE': 'Deutsch', 'EN': 'Englisch', 'ES': 'Spanisch', 'FR': 'Französisch', 'ZH': 'Chinesisch' }
  },
  'EN': {
    name: 'EN',
    lesson: 'Lesson', result: 'Result', reset: 'Reset', check: 'Check', retry: 'Try again',
    loading: 'Loading lessons...', errorTitle: 'Load Error', errorMsg: 'Could not load lesson data.', retryLoad: 'Retry',
    selectLanguage: 'Learning Language', selectLesson: 'Lesson',
    languageNames: { 'DE': 'German', 'EN': 'English', 'ES': 'Spanish', 'FR': 'French', 'ZH': 'Chinese' }
  },
  'ES': {
    name: 'ES',
    lesson: 'Lección', result: 'Resultado', reset: 'Reiniciar', check: 'Comprobar', retry: 'Intentar de nuevo',
    loading: 'Cargando lecciones...', errorTitle: 'Error de carga', errorMsg: 'No se pudieron cargar los datos.', retryLoad: 'Reintentar',
    selectLanguage: 'Idioma', selectLesson: 'Lección',
    languageNames: { 'DE': 'Alemán', 'EN': 'Inglés', 'ES': 'Español', 'FR': 'Francés', 'ZH': 'Chino' }
  },
  'FR': {
    name: 'FR',
    lesson: 'Leçon', result: 'Résultat', reset: 'Réinitialiser', check: 'Vérifier', retry: 'Réessayer',
    loading: 'Chargement...', errorTitle: 'Erreur de chargement', errorMsg: 'Impossible de charger les données.', retryLoad: 'Réessayer',
    selectLanguage: 'Langue', selectLesson: 'Leçon',
    languageNames: { 'DE': 'Allemand', 'EN': 'Anglais', 'ES': 'Espagnol', 'FR': 'Français', 'ZH': 'Chinois' }
  },
  'ZH': {
    name: 'ZH',
    lesson: '课程', result: '结果', reset: '重置', check: '检查', retry: '重试',
    loading: '加载中...', errorTitle: '加载错误', errorMsg: '无法加载课程数据。', retryLoad: '重试',
    selectLanguage: '学习语言', selectLesson: '课程',
    languageNames: { 'DE': '德语', 'EN': '英语', 'ES': '西班牙语', 'FR': '法语', 'ZH': '中文' }
  }
};
