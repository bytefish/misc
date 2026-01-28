
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
  languageNames: Record<string, string>;
  // Admin Mode
  adminMode: string;
  adminExit: string;
  designerTitle: string;
  lessonTitleLabel: string;
  targetLangLabel: string;
  descLabel: string;
  segmentsLabel: string;
  addText: string;
  addGap: string;
  addBr: string;
  previewLabel: string;
  copyJson: string;
  clearAll: string;
  confirmClear: string;
  glueLabel: string;
  gapAnswerPlaceholder: string;
  gapHintPlaceholder: string;
  loadJson: string;
  saveJson: string;
}

export const UI_DATA: Record<string, UiTranslation> = {
  'DE': {
    name: 'DE',
    lesson: 'Lektion', result: 'Ergebnis', reset: 'Zurücksetzen', check: 'Überprüfen', retry: 'Nochmal versuchen',
    loading: 'Lade Lektionen...', errorTitle: 'Fehler beim Laden', errorMsg: 'Daten konnten nicht geladen werden.', retryLoad: 'Erneut versuchen',
    selectLanguage: 'Lernsprache', selectLesson: 'Lektion',
    languageNames: { 'DE': 'Deutsch', 'EN': 'Englisch', 'ES': 'Spanisch', 'FR': 'Französisch', 'ZH': 'Chinesisch' },
    adminMode: 'Admin Modus', adminExit: 'Editor Beenden', designerTitle: 'Lektions-Designer',
    lessonTitleLabel: 'Titel der Lektion', targetLangLabel: 'Zielsprache', descLabel: 'Kurzbeschreibungen',
    segmentsLabel: 'Inhalts-Elemente', addText: '+ Text', addGap: '+ Lücke', addBr: '+ Absatz',
    previewLabel: 'Live-Vorschau', copyJson: 'JSON Kopieren', clearAll: 'Alles Löschen',
    confirmClear: 'Möchtest du wirklich alle Eingaben löschen?', glueLabel: 'Glue',
    gapAnswerPlaceholder: 'Antwort...', gapHintPlaceholder: 'Hinweis (optional)',
    loadJson: 'Lektion laden', saveJson: 'JSON Speichern'
  },
  'EN': {
    name: 'EN',
    lesson: 'Lesson', result: 'Result', reset: 'Reset', check: 'Check', retry: 'Try again',
    loading: 'Loading lessons...', errorTitle: 'Load Error', errorMsg: 'Could not load lesson data.', retryLoad: 'Retry',
    selectLanguage: 'Learning Language', selectLesson: 'Lesson',
    languageNames: { 'DE': 'German', 'EN': 'English', 'ES': 'Spanish', 'FR': 'French', 'ZH': 'Chinese' },
    adminMode: 'Admin Mode', adminExit: 'Exit Editor', designerTitle: 'Lesson Designer',
    lessonTitleLabel: 'Lesson Title', targetLangLabel: 'Target Language', descLabel: 'Descriptions',
    segmentsLabel: 'Content Elements', addText: '+ Text', addGap: '+ Gap', addBr: '+ Paragraph',
    previewLabel: 'Live Preview', copyJson: 'Copy JSON', clearAll: 'Clear All',
    confirmClear: 'Do you really want to clear all inputs?', glueLabel: 'Glue',
    gapAnswerPlaceholder: 'Answer...', gapHintPlaceholder: 'Hint (optional)',
    loadJson: 'Load Lesson', saveJson: 'Save JSON'
  },
  'ES': {
    name: 'ES',
    lesson: 'Lección', result: 'Resultado', reset: 'Reiniciar', check: 'Comprobar', retry: 'Intentar de nuevo',
    loading: 'Cargando lecciones...', errorTitle: 'Error de carga', errorMsg: 'No se pudieron cargar los datos.', retryLoad: 'Reintentar',
    selectLanguage: 'Idioma', selectLesson: 'Lección',
    languageNames: { 'DE': 'Alemán', 'EN': 'Inglés', 'ES': 'Español', 'FR': 'Francés', 'ZH': 'Chino' },
    adminMode: 'Modo Admin', adminExit: 'Salir', designerTitle: 'Diseñador de Lecciones',
    lessonTitleLabel: 'Título de la Lección', targetLangLabel: 'Idioma de Aprendizaje', descLabel: 'Descripciones',
    segmentsLabel: 'Elementos de Contenido', addText: '+ Texto', addGap: '+ Hueco', addBr: '+ Párrafo',
    previewLabel: 'Vista Previa', copyJson: 'Copiar JSON', clearAll: 'Borrar Todo',
    confirmClear: '¿Realmente quieres borrar todas las entradas?', glueLabel: 'Pegar',
    gapAnswerPlaceholder: 'Respuesta...', gapHintPlaceholder: 'Sugerencia (opcional)',
    loadJson: 'Cargar lección', saveJson: 'Guardar JSON'
  },
  'FR': {
    name: 'FR',
    lesson: 'Leçon', result: 'Résultat', reset: 'Réinitialiser', check: 'Vérifier', retry: 'Réessayer',
    loading: 'Chargement...', errorTitle: 'Erreur de chargement', errorMsg: 'Impossible de charger les données.', retryLoad: 'Réessayer',
    selectLanguage: 'Langue', selectLesson: 'Leçon',
    languageNames: { 'DE': 'Allemand', 'EN': 'Anglais', 'ES': 'Espagnol', 'FR': 'Français', 'ZH': 'Chinois' },
    adminMode: 'Mode Admin', adminExit: 'Quitter', designerTitle: 'Concepteur de Leçons',
    lessonTitleLabel: 'Titre de la Leçon', targetLangLabel: 'Langue d\'Apprentissage', descLabel: 'Descriptions',
    segmentsLabel: 'Éléments de Contenu', addText: '+ Texte', addGap: '+ Trou', addBr: '+ Paragraphe',
    previewLabel: 'Aperçu Direct', copyJson: 'Copier le JSON', clearAll: 'Tout Effacer',
    confirmClear: 'Voulez-vous vraiment effacer toutes les entrées ?', glueLabel: 'Coller',
    gapAnswerPlaceholder: 'Réponse...', gapHintPlaceholder: 'Indice (optionnel)',
    loadJson: 'Charger la leçon', saveJson: 'Enregistrer le JSON'
  },
  'ZH': {
    name: 'ZH',
    lesson: '课程', result: '结果', reset: '重置', check: '检查', retry: '重试',
    loading: '加载中...', errorTitle: '加载错误', errorMsg: '无法加载课程数据。', retryLoad: '重试',
    selectLanguage: '学习语言', selectLesson: '课程',
    languageNames: { 'DE': '德语', 'EN': '英语', 'ES': '西班牙语', 'FR': '法语', 'ZH': '中文' },
    adminMode: '管理员模式', adminExit: '退出编辑器', designerTitle: '课程设计师',
    lessonTitleLabel: '课程标题', targetLangLabel: '目标语言', descLabel: '课程描述',
    segmentsLabel: '内容元素', addText: '+ 文本', addGap: '+ 填空', addBr: '+ 段落',
    previewLabel: '实时预览', copyJson: '复制 JSON', clearAll: '全部清除',
    confirmClear: '你确定要清除所有输入吗？', glueLabel: '粘贴',
    gapAnswerPlaceholder: '答案...', gapHintPlaceholder: '提示 (可选)',
    loadJson: '加载课程', saveJson: '保存 JSON'
  }
};
