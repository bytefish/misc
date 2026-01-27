// --- TRANSLATION INTERFACE & DATA ---

export interface UiTranslation {
  name: string; // Name der Sprache für den Button (z.B. "Deutsch")
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
}

export const UI_DATA: Record<string, UiTranslation> = {
  'DE': {
    name: 'DE',
    lesson: 'Lektion', result: 'Ergebnis', reset: 'Zurücksetzen', check: 'Überprüfen', retry: 'Nochmal versuchen',
    loading: 'Lade Lektionen...', errorTitle: 'Fehler beim Laden', errorMsg: 'Daten konnten nicht geladen werden.', retryLoad: 'Erneut versuchen',
    selectLanguage: 'Lernsprache', selectLesson: 'Lektion'
  },
  'EN': {
    name: 'EN',
    lesson: 'Lesson', result: 'Result', reset: 'Reset', check: 'Check', retry: 'Try again',
    loading: 'Loading lessons...', errorTitle: 'Load Error', errorMsg: 'Could not load lesson data.', retryLoad: 'Retry',
    selectLanguage: 'Learning Language', selectLesson: 'Lesson'
  },
  'ES': {
    name: 'ES',
    lesson: 'Lección', result: 'Resultado', reset: 'Reiniciar', check: 'Comprobar', retry: 'Intentar de nuevo',
    loading: 'Cargando lecciones...', errorTitle: 'Error de carga', errorMsg: 'No se pudieron cargar los datos.', retryLoad: 'Reintentar',
    selectLanguage: 'Idioma', selectLesson: 'Lección'
  },
  'FR': {
    name: 'FR',
    lesson: 'Leçon', result: 'Résultat', reset: 'Réinitialiser', check: 'Vérifier', retry: 'Réessayer',
    loading: 'Chargement...', errorTitle: 'Erreur de chargement', errorMsg: 'Impossible de charger les données.', retryLoad: 'Réessayer',
    selectLanguage: 'Langue', selectLesson: 'Leçon'
  },
  'CN': {
    name: 'CN',
    lesson: '课程', result: '结果', reset: '重置', check: '检查', retry: '重试',
    loading: '加载中...', errorTitle: '加载错误', errorMsg: '无法加载课程数据。', retryLoad: '重试',
    selectLanguage: '学习语言', selectLesson: '课程'
  }
};
