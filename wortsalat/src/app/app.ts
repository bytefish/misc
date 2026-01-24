import { Component, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl, Validators } from '@angular/forms';


interface I18nConfig {
  title: string;
  solutionLabel: string;
  solutionOn: string;
  solutionOff: string;
  printBtn: string;
  step1: string;
  step2: string;
  step3: string;
  wordPlaceholder: string;
  addBtn: string;
  quickSelect: string;
  manualSize: string;
  difficultyLabel: string;
  diffLevels: { [key: string]: string };
  shuffleBtn: string;
  puzzleHeader: string;
  listHeader: string;
  footer: string;
  errorTooLong: string;
  starterWords: string[];
}

const LANGUAGES: { [key: string]: I18nConfig } = {
  de: {
    title: 'Wortsalat',
    solutionLabel: 'Lösung',
    solutionOn: 'An',
    solutionOff: 'Aus',
    printBtn: 'Drucken',
    step1: '1. Wörter-Pool',
    step2: '2. Gitter-Größe',
    step3: '3. Regeln',
    wordPlaceholder: 'Wort eingeben...',
    addBtn: 'Ok',
    quickSelect: 'Schnellwahl',
    manualSize: 'Manuelle Größe',
    difficultyLabel: 'Schwierigkeit',
    diffLevels: {
      easy: 'Leicht (nur →)',
      medium: 'Mittel (→ ↓)',
      hard: 'Schwer (Alle)'
    },
    shuffleBtn: 'Misch-Masch!',
    puzzleHeader: 'Wortsuche',
    listHeader: 'Finde diese Wörter:',
    footer: 'Viel Spaß beim Wort-Crunching!',
    errorTooLong: 'Wort ist zu lang.',
    starterWords: ['HUND', 'KATZE', 'MAUS', 'ELEFANT', 'SONNE', 'BLUME', 'HAUS', 'AUTO', 'VOGEL', 'FERIEN', 'SOMMER', 'REGEN', 'APFEL', 'WALD']
  },
  en: {
    title: 'Wortsalat',
    solutionLabel: 'Solution',
    solutionOn: 'On',
    solutionOff: 'Off',
    printBtn: 'Print',
    step1: '1. Word Pool',
    step2: '2. Grid Size',
    step3: '3. Rules',
    wordPlaceholder: 'Type word...',
    addBtn: 'Add',
    quickSelect: 'Presets',
    manualSize: 'Manual Size',
    difficultyLabel: 'Difficulty',
    diffLevels: {
      easy: 'Easy (only →)',
      medium: 'Medium (→ ↓)',
      hard: 'Hard (All)'
    },
    shuffleBtn: 'Scramble!',
    puzzleHeader: 'Word Search',
    listHeader: 'Words to find:',
    footer: 'Have fun searching!',
    errorTooLong: 'Word is too long.',
    starterWords: ['DOG', 'CAT', 'MOUSE', 'ELEPHANT', 'SUN', 'FLOWER', 'HOUSE', 'CAR', 'BIRD', 'VACATION', 'SUMMER', 'RAIN', 'APPLE', 'FOREST']
  },
  fr: {
    title: 'Wortsalat',
    solutionLabel: 'Solution',
    solutionOn: 'On',
    solutionOff: 'Off',
    printBtn: 'Imprimer',
    step1: '1. Liste de mots',
    step2: '2. Taille du grille',
    step3: '3. Règles',
    wordPlaceholder: 'Entrez un mot...',
    addBtn: 'Ok',
    quickSelect: 'Sélection rapide',
    manualSize: 'Taille manuelle',
    difficultyLabel: 'Difficulté',
    diffLevels: {
      easy: 'Facile (seul →)',
      medium: 'Moyen (→ ↓)',
      hard: 'Difficile (Tous)'
    },
    shuffleBtn: 'Mélanger !',
    puzzleHeader: 'Mots Mêlés',
    listHeader: 'Trouvez ces mots :',
    footer: 'Amusez-vous bien !',
    errorTooLong: 'Le mot est trop long.',
    starterWords: ['CHAT', 'CHIEN', 'SOURIS', 'ELEPHANT', 'SOLEIL', 'FLEUR', 'MAISON', 'VOITURE', 'OISEAU', 'VACANCES', 'ETE', 'PLUIE', 'POMME', 'FORET']
  },
  es: {
    title: 'Wortsalat',
    solutionLabel: 'Solución',
    solutionOn: 'Sí',
    solutionOff: 'No',
    printBtn: 'Imprimir',
    step1: '1. Lista de palabras',
    step2: '2. Tamaño de la cuadrícula',
    step3: '3. Reglas',
    wordPlaceholder: 'Introduce una palabra...',
    addBtn: 'Ok',
    quickSelect: 'Selección rápida',
    manualSize: 'Tamaño manual',
    difficultyLabel: 'Dificultad',
    diffLevels: {
      easy: 'Fácil (solo →)',
      medium: 'Medio (→ ↓)',
      hard: 'Difícil (Todos)'
    },
    shuffleBtn: '¡Mezclar!',
    puzzleHeader: 'Sopa de letras',
    listHeader: 'Busca estas palabras:',
    footer: '¡Diviértete buscando!',
    errorTooLong: 'La palabra es demasiado larga.',
    starterWords: ['GATO', 'PERRO', 'RATON', 'ELEFANTE', 'SOL', 'FLOR', 'CASA', 'COCHE', 'PAJARO', 'VACACIONES', 'VERANO', 'LLUVIA', 'MANZANA', 'BOSQUE']
  }
};

interface PlacedWord {
  word: string;
  x: number;
  y: number;
  dx: number;
  dy: number;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="min-h-screen bg-slate-50 p-4 md:p-8 font-sans print:p-0 print:bg-white overflow-x-hidden">

      <!-- Dashboard - Nicht im Druck sichtbar -->
      <div class="max-w-6xl mx-auto mb-10 print:hidden">
        <div class="bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">

          <!-- Header -->
          <div class="bg-indigo-600 p-6 text-white flex flex-col md:flex-row items-center justify-between gap-4">
            <div class="flex items-center gap-4">
              <div class="bg-white p-2 rounded-xl shadow-inner">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <div>
                <h1 class="text-3xl font-black uppercase tracking-tighter">{{ t().title }}</h1>
                <div class="flex flex-wrap gap-x-2 gap-y-1 mt-1">
                  @for (l of availableLangs; track l.id) {
                    <button (click)="changeLanguage(l.id)"
                            [class.opacity-100]="lang() === l.id"
                            class="text-[10px] font-bold opacity-50 hover:opacity-100 uppercase tracking-widest transition-all">
                      {{ l.label }}
                    </button>
                    @if (!$last) { <span class="text-[10px] opacity-30">|</span> }
                  }
                </div>
              </div>
            </div>

            <div class="flex gap-3 shrink-0">
              <button (click)="toggleSolution()"
                      [class]="showSolution() ? 'bg-orange-500 shadow-orange-200' : 'bg-indigo-800 shadow-indigo-900'"
                      class="px-6 py-2 rounded-xl font-bold text-sm uppercase transition-all hover:scale-105 shadow-lg">
                {{ t().solutionLabel }}: {{ showSolution() ? t().solutionOn : t().solutionOff }}
              </button>
              <button (click)="printPuzzle()" class="bg-emerald-500 px-6 py-2 rounded-xl font-bold text-sm uppercase hover:scale-105 transition-all shadow-lg shadow-emerald-200">
                {{ t().printBtn }}
              </button>
            </div>
          </div>

          <div class="p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div class="space-y-4 min-w-0">
              <h3 class="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <span class="w-2 h-2 bg-indigo-500 rounded-full"></span> {{ t().step1 }}
              </h3>
              <div class="flex gap-2">
                <input [formControl]="newWordControl" (keyup.enter)="addWord()" type="text"
                       [placeholder]="t().wordPlaceholder"
                       class="flex-1 min-w-0 px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-indigo-400 uppercase font-bold text-sm transition-all">
                <button (click)="addWord()" class="bg-indigo-600 text-white px-5 py-3 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-md">{{ t().addBtn }}</button>
              </div>
              <div class="flex flex-wrap gap-2 max-h-56 overflow-y-auto p-3 bg-slate-50/50 rounded-2xl border border-slate-100 border-dashed">
                @for (word of words(); track word) {
                  <span class="bg-white border border-slate-200 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 group shadow-sm shrink-0">
                    {{ word }}
                    <button (click)="removeWord(word)" class="text-slate-300 hover:text-red-500 transition-colors">✕</button>
                  </span>
                }
              </div>
            </div>

            <div class="space-y-4 border-l border-slate-100 lg:pl-8 min-w-0">
              <h3 class="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <span class="w-2 h-2 bg-indigo-500 rounded-full"></span> {{ t().step2 }}
              </h3>

              <div class="space-y-6">
                <!-- Schnellwahl Buttons -->
                <div class="space-y-2">
                  <label class="text-[10px] font-bold text-slate-400 uppercase block">{{ t().quickSelect }}</label>
                  <div class="flex gap-2">
                    @for (s of [10, 12, 15]; track s) {
                      <button (click)="applyPreset(s)"
                              [class]="rows() === s && cols() === s ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'"
                              class="flex-1 py-2 rounded-xl font-bold text-sm border-2 border-transparent transition-all">
                        {{ s }}x{{ s }}
                      </button>
                    }
                  </div>
                </div>

                <div class="space-y-2">
                  <label class="text-[10px] font-bold text-slate-400 uppercase block">{{ t().manualSize }}</label>
                  <div class="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-2xl border-2 border-slate-100">
                    <div class="flex items-center gap-2">
                      <span class="text-[10px] font-bold text-slate-400">X:</span>
                      <input type="number" [formControl]="customCols" min="5" max="30" class="w-full p-2 rounded-lg border-2 border-white font-bold outline-none focus:border-indigo-400 shadow-sm text-sm">
                    </div>
                    <div class="flex items-center gap-2">
                      <span class="text-[10px] font-bold text-slate-400">Y:</span>
                      <input type="number" [formControl]="customRows" min="5" max="30" class="w-full p-2 rounded-lg border-2 border-white font-bold outline-none focus:border-indigo-400 shadow-sm text-sm">
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="space-y-4 border-l border-slate-100 lg:pl-8 min-w-0">
              <h3 class="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <span class="w-2 h-2 bg-indigo-500 rounded-full"></span> {{ t().step3 }}
              </h3>
              <div class="space-y-2">
                <label class="text-[10px] font-bold text-slate-400 uppercase block">{{ t().difficultyLabel }}</label>
                @for (d of ['easy', 'medium', 'hard']; track d) {
                  <button (click)="setDifficulty(d)"
                          [class]="difficulty() === d ? 'bg-slate-900 text-white shadow-xl scale-[1.02]' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'"
                          class="w-full py-3 rounded-2xl font-black text-xs uppercase transition-all px-5 flex justify-between items-center group">
                    <span>{{ t().diffLevels[d] }}</span>
                    <div [class]="difficulty() === d ? 'bg-emerald-400' : 'bg-slate-200 group-hover:bg-slate-300'" class="w-3 h-3 rounded-full transition-colors"></div>
                  </button>
                }
              </div>
              <button (click)="generatePuzzle()" class="w-full py-3 border-2 border-indigo-100 text-indigo-600 rounded-2xl font-black text-xs uppercase hover:bg-indigo-50 transition-colors mt-4">
                {{ t().shuffleBtn }}
              </button>
            </div>
          </div>

          @if (errorMessage()) {
            <div class="px-8 pb-4 text-red-500 text-xs font-bold animate-pulse">
              {{ errorMessage() }}
            </div>
          }
        </div>
      </div>

      <div id="puzzle-sheet" class="max-w-[210mm] mx-auto bg-white p-6 md:p-8 print:p-0 print:shadow-none shadow-2xl rounded-sm print:m-0 relative overflow-visible">

        <header class="mb-4">
          <div class="flex justify-between items-center border-b-2 border-black pb-2 px-4 font-black text-[12px] uppercase tracking-widest text-slate-400 print:text-black">
             <span>{{ t().puzzleHeader }}: {{ t().diffLevels[difficulty()] }}</span>
             @if (showSolution()) {
                <span class="bg-black text-white px-4 py-1 rounded-full text-[10px]">— {{ t().solutionLabel.toUpperCase() }} —</span>
             }
             <span>{{ cols() }} x {{ rows() }}</span>
          </div>
        </header>

        <!-- Das Gitter-System -->
        <div class="relative mx-auto bg-white border-[4px] border-black z-0 overflow-hidden"
             [style.max-width]="'600px'"
             [style.aspect-ratio]="cols() + '/' + rows()">

          @if (showSolution()) {
            <svg class="absolute top-0 left-0 w-full h-full pointer-events-none overflow-visible z-10"
                 [attr.viewBox]="'0 0 ' + (cols() * 10) + ' ' + (rows() * 10)"
                 preserveAspectRatio="none"
                 style="display: block;">
              @for (pw of placedWords(); track $index) {
                <g>
                  <!-- Kräftiger Rahmen um das Wort -->
                  <line
                    [attr.x1]="pw.x * 10 + 5"
                    [attr.y1]="pw.y * 10 + 5"
                    [attr.x2]="(pw.x + pw.dx * (pw.word.length - 1)) * 10 + 5"
                    [attr.y2]="(pw.y + pw.dy * (pw.word.length - 1)) * 10 + 5"
                    stroke-linecap="round" stroke="black" stroke-width="12.5"
                  />
                  <line
                    [attr.x1]="pw.x * 10 + 5"
                    [attr.y1]="pw.y * 10 + 5"
                    [attr.x2]="(pw.x + pw.dx * (pw.word.length - 1)) * 10 + 5"
                    [attr.y2]="(pw.y + pw.dy * (pw.word.length - 1)) * 10 + 5"
                    stroke-linecap="round" stroke="white" stroke-width="9.5"
                  />
                </g>
              }
            </svg>
          }

          <!-- Ebene 2: Buchstaben & Gitterlinien -->
          <div class="grid gap-0 relative z-20 bg-transparent h-full w-full isolation-auto"
               [style.grid-template-columns]="'repeat(' + cols() + ', minmax(0, 1fr))'"
               [style.grid-template-rows]="'repeat(' + rows() + ', minmax(0, 1fr))'">
            @for (row of grid(); track rowIndex; let rowIndex = $index) {
              @for (cell of row; track cellIndex; let cellIndex = $index) {
                <div class="flex items-center justify-center font-bold uppercase select-none border-[0.5px] border-slate-200 bg-transparent overflow-visible">
                  <span class="relative z-30 text-black leading-none pointer-events-none"
                        [style.font-size]="fontSize()">{{ cell }}</span>
                </div>
              }
            }
          </div>
        </div>

        <!-- Wortliste zum Suchen - Kleiner gestaltet -->
        <div class="mt-6 border-t-2 border-black pt-4">
          <h3 class="text-lg font-black uppercase mb-4 italic tracking-tight">{{ t().listHeader }}</h3>
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-2 gap-x-6">
            @for (word of words(); track word) {
              <div class="flex items-center gap-2">
                <div class="w-5 h-5 border-2 border-black shrink-0 rounded-sm"></div>
                <span class="text-base uppercase tracking-wider font-bold truncate">{{ word }}</span>
              </div>
            }
          </div>
        </div>

        <footer class="hidden print:block mt-8 text-center border-t border-slate-100 pt-4">
          <div class="text-[9px] font-black text-slate-300 uppercase tracking-[0.4em]">{{ t().footer }}</div>
        </footer>
      </div>
    </div>
  `,
  styles: [`
    @media print {
      @page { size: A4; margin: 10mm; }
      body { background-color: white !important; }
      svg line { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    }

    .relative { isolation: isolate; }
  `]
})
export class App implements OnInit {
  lang = signal<string>('de');
  t = computed(() => LANGUAGES[this.lang()] || LANGUAGES['de']);

  availableLangs = [
    { id: 'de', label: 'Deutsch' },
    { id: 'en', label: 'English' },
    { id: 'fr', label: 'Français' },
    { id: 'es', label: 'Español' }
  ];

  difficulty = signal<string>('medium');
  words = signal<string[]>([]);
  rows = signal<number>(12);
  cols = signal<number>(12);

  grid = signal<string[][]>([]);
  placedWords = signal<PlacedWord[]>([]);
  showSolution = signal<boolean>(false);
  errorMessage = signal<string>('');

  newWordControl = new FormControl('', [Validators.pattern(/^[a-zA-ZäöüÄÖÜß]+$/)]);
  customRows = new FormControl(12, [Validators.min(5), Validators.max(30)]);
  customCols = new FormControl(12, [Validators.min(5), Validators.max(30)]);

  constructor() {}

  ngOnInit() {
    const urlParams = new URLSearchParams(window.location.search);
    const urlLang = urlParams.get('lang');
    if (urlLang && LANGUAGES[urlLang]) {
      this.lang.set(urlLang);
    }

    this.resetWords();
    this.setupListeners();
    this.generatePuzzle();
  }

  changeLanguage(newLang: string) {
    if (LANGUAGES[newLang]) {
      this.lang.set(newLang);
      this.resetWords();
      this.generatePuzzle();
    }
  }

  resetWords() {
    this.words.set([...this.t().starterWords]);
  }

  applyPreset(size: number) {
    this.customRows.setValue(size);
    this.customCols.setValue(size);
  }

  setupListeners() {
    this.customRows.valueChanges.subscribe(val => {
      if (val && val >= 5 && val <= 30) {
        this.rows.set(val);
        this.generatePuzzle();
      }
    });

    this.customCols.valueChanges.subscribe(val => {
      if (val && val >= 5 && val <= 30) {
        this.cols.set(val);
        this.generatePuzzle();
      }
    });
  }

  setDifficulty(val: string) {
    this.difficulty.set(val);
    this.generatePuzzle();
  }

  toggleSolution() {
    this.showSolution.update(v => !v);
  }

  addWord() {
    let value = this.newWordControl.value?.trim().toUpperCase();
    if (!value) return;
    value = value.replace(/Ä/g, 'AE').replace(/Ö/g, 'OE').replace(/Ü/g, 'UE').replace(/ß/g, 'SS');

    if (value.length > Math.max(this.rows(), this.cols())) {
      this.errorMessage.set(this.t().errorTooLong);
      return;
    }
    if (this.words().includes(value)) {
      return;
    }

    this.words.update(w => [...w, value]);
    this.newWordControl.setValue('');
    this.errorMessage.set('');
    this.generatePuzzle();
  }

  removeWord(word: string) {
    this.words.update(w => w.filter(item => item !== word));
    this.generatePuzzle();
  }

  fontSize = computed(() => {
    const maxDim = Math.max(this.rows(), this.cols());
    if (maxDim <= 10) return '2.2rem';
    if (maxDim <= 12) return '1.9rem';
    if (maxDim <= 15) return '1.4rem';
    if (maxDim <= 20) return '1.1rem';
    return '0.8rem';
  });

  generatePuzzle() {
    const r = this.rows();
    const c = this.cols();
    const newGrid: string[][] = Array(r).fill(null).map(() => Array(c).fill(''));
    const newlyPlaced: PlacedWord[] = [];
    const sortedWords = [...this.words()].sort((a, b) => b.length - a.length);

    const directions: number[][] = [[1, 0]];
    if (this.difficulty() !== 'easy') directions.push([0, 1]);
    if (this.difficulty() === 'hard') {
      directions.push([1, 1]);
      directions.push([-1, 1]);
    }

    for (const word of sortedWords) {
      let placed = false;
      let attempts = 0;
      while (!placed && attempts < 800) {
        attempts++;
        const [dx, dy] = directions[Math.floor(Math.random() * directions.length)];
        const startX = Math.floor(Math.random() * c);
        const startY = Math.floor(Math.random() * r);
        if (this.canPlace(newGrid, word, startX, startY, dx, dy)) {
          this.place(newGrid, word, startX, startY, dx, dy);
          newlyPlaced.push({ word, x: startX, y: startY, dx, dy });
          placed = true;
        }
      }
    }

    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (let y = 0; y < r; y++) {
      for (let x = 0; x < c; x++) {
        if (newGrid[y][x] === '') {
          newGrid[y][x] = alphabet.charAt(Math.floor(Math.random() * alphabet.length));
        }
      }
    }
    this.grid.set(newGrid);
    this.placedWords.set(newlyPlaced);
  }

  private canPlace(grid: string[][], word: string, startX: number, startY: number, dx: number, dy: number): boolean {
    const r = this.rows();
    const c = this.cols();
    for (let i = 0; i < word.length; i++) {
      const x = startX + i * dx;
      const y = startY + i * dy;
      if (x < 0 || x >= c || y < 0 || y >= r) return false;
      const currentCell = grid[y][x];
      if (currentCell !== '' && currentCell !== word[i]) return false;
    }
    return true;
  }

  private place(grid: string[][], word: string, startX: number, startY: number, dx: number, dy: number) {
    for (let i = 0; i < word.length; i++) {
      const x = startX + i * dx;
      const y = startY + i * dy;
      grid[y][x] = word[i];
    }
  }

  printPuzzle() {
    window.print();
  }
}
