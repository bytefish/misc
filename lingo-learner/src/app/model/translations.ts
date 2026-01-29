
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
  submitConfirm: string;
  issueTitlePrefix: string;
  issueBodyInstructions: string;
  untitled: string;
  submitGitHub: string;
  submitEmail: string;
  emailConfirm: string;
  emailSubject: string;
  emailBody: string;
  saveLocal: string;
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
    loadJson: 'Lektion laden', saveJson: 'JSON Speichern',
    submitConfirm: 'Die Lektion wird heruntergeladen. Es wird ein GitHub Issue vorbereitet. Bitte füge die Datei für deine Lektion hinzu.',
    issueTitlePrefix: 'Vorschlag',
    issueBodyInstructions: 'Hallo! Ich möchte eine neue Lektion einreichen.\n\n**Anleitung:**\n1. Die JSON-Datei wurde gerade heruntergeladen.\n2. Ziehe diese Datei einfach per Drag & Drop hier in dieses Textfeld.\n3. Klicke unten auf "Submit new issue".',
    untitled: 'Ohne Titel',
    submitGitHub: 'Vorschlag via GitHub einreichen',
    submitEmail: 'Vorschlag via E-Mail senden',
    emailConfirm: 'Die Lektion wird heruntergeladen. Dein E-Mail-Programm wird vorbereitet. Bitte hänge die heruntergeladene Datei an die E-Mail an.',
    emailSubject: 'LingoLearner: Neuer Lektionsvorschlag',
    emailBody: 'Hallo!\n\nAnbei sende ich euch eine neue Lektion für LingoLearner.\n\n(Bitte die heruntergeladene JSON-Datei hier anhängen)',
    saveLocal: 'In lokale Bibliothek speichern',
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
    loadJson: 'Load Lesson', saveJson: 'Save JSON',
    submitConfirm: 'The lesson will be downloaded. A GitHub issue is being prepared. Please attach the file for your lesson.',
    issueTitlePrefix: 'Proposal',
    issueBodyInstructions: 'Hello! I would like to submit a new lesson.\n\n**Instructions:**\n1. The JSON file has just been downloaded.\n2. Simply drag and drop this file into this text field.\n3. Click "Submit new issue" below.',
    untitled: 'Untitled',
    submitGitHub: 'Submit Proposal via GitHub',
    submitEmail: 'Submit Proposal via E-Mail',
    emailConfirm: 'The lesson will be downloaded. Your email client will be prepared. Please attach the downloaded file to the email.',
    emailSubject: 'LingoLearner: New Lesson Proposal',
    emailBody: 'Hello!\n\nAttached is a new lesson for LingoLearner.\n\n(Please attach the downloaded JSON file here)',
    saveLocal: 'Save to Local Library',
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
    loadJson: 'Cargar lección', saveJson: 'Guardar JSON',
    submitConfirm: 'La lección se descargará. Se está preparando un problema en GitHub. Por favor, adjunta el archivo de tu lección.',
    issueTitlePrefix: 'Propuesta',
    issueBodyInstructions: '¡Hola! Me gustaría enviar una nueva lección.\n\n**Instrucciones:**\n1. El archivo JSON se acaba de descargar.\n2. Simplemente arrastra y suelta este archivo en este campo de texto.\n3. Haz clic en "Submit new issue" abajo.',
    untitled: 'Sin título',
    submitGitHub: 'Enviar propuesta vía GitHub',
    submitEmail: 'Enviar propuesta vía E-Mail',
    emailConfirm: 'La lección se descargará. Se preparará tu cliente de correo. Por favor, adjunta el archivo descargado al correo.',
    emailSubject: 'LingoLearner: Propuesta de nueva lección',
    emailBody: '¡Hola!\n\nAdjunto una nueva lección para LingoLearner.\n\n(Por favor, adjunta el archivo JSON descargado aquí)',
    saveLocal: 'Guardar en la biblioteca local',
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
    loadJson: 'Charger la leçon', saveJson: 'Enregistrer le JSON',
    submitConfirm: 'La leçon va être téléchargée. Un ticket GitHub est en cours de préparation. Veuillez joindre le fichier de votre leçon.',
    issueTitlePrefix: 'Proposition',
    issueBodyInstructions: 'Bonjour ! Je souhaite soumettre une nouvelle leçon.\n\n**Instructions :**\n1. Le fichier JSON vient d\'être téléchargé.\n2. Glissez-déposez simplement ce fichier dans ce champ de texte.\n3. Cliquez sur "Submit new issue" ci-dessous.',
    submitGitHub: 'Soumettre via GitHub',
    submitEmail: 'Soumettre via E-Mail',
    emailConfirm: 'La leçon va être téléchargée. Votre logiciel de messagerie va s\'ouvrir. Veuillez joindre le fichier téléchargé à l\'e-mail.',
    emailSubject: 'LingoLearner : Nouvelle proposition de leçon',
    emailBody: 'Bonjour !\n\nVous trouverez ci-joint une nouvelle leçon pour LingoLearner.\n\n(Veuillez joindre le fichier JSON téléchargé ici)',
    untitled: 'Sans titre',
    saveLocal: 'Enregistrer dans la bibliothèque locale',
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
    loadJson: '加载课程', saveJson: '保存 JSON',
    submitConfirm: '课程即将下载。正在准备 GitHub Issue。请添加您的课程文件。',
    issueTitlePrefix: '提议',
    issueBodyInstructions: '你好！我想提交一门新课程。\n\n**说明：**\n1. JSON 文件刚刚已下载。\n2. 只需将此文件拖放到此文本框中即可。\n3. 点击下方的 "Submit new issue"。',
    untitled: '未命名',
    submitGitHub: '通过 GitHub 提交建议',
    submitEmail: '通过电子邮件发送建议',
    emailConfirm: '课程将下载。您的邮件客户端已准备就绪。请将下载的文件添加到邮件附件中。',
    emailSubject: 'LingoLearner: 新课程提议',
    emailBody: '你好！\n\n附件是 LingoLearner 的新课程。\n\n（请在此处添加下载的 JSON 文件）',
    saveLocal: '保存到本地库',
  }
};
