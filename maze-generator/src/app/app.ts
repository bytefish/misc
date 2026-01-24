import { Component, ElementRef, ViewChild, OnInit, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface MazeLabels {
  title: string;
  difficulty: {
    Easy: string;
    Medium: string;
    Hard: string;
    Extreme: string;
    Custom: string;
  };
  settings: {
    cols: string;
    rows: string;
    cellSize: string;
    trickiness: string;
    traps: string;
  };
  buttons: {
    generate: string;
    showSolution: string;
    hideSolution: string;
    print: string;
  };
  tips: {
    printError: string;
  };
}

type LanguageKey = 'en' | 'de' | 'fr' | 'es' | 'zh';

const TRANSLATIONS: Record<LanguageKey, MazeLabels> = {
  en: {
    title: 'Maze Generator',
    difficulty: { Easy: 'Easy', Medium: 'Medium', Hard: 'Hard', Extreme: 'Extreme', Custom: 'Custom' },
    settings: { cols: 'Cols', rows: 'Rows', cellSize: 'Cell Size', trickiness: 'Trickiness', traps: 'Traps' },
    buttons: { generate: 'New Maze', showSolution: 'Show Solution', hideSolution: 'Hide Solution', print: 'Print Worksheet' },
    tips: { printError: 'If the print dialog didn\'t open, please press Ctrl + P (or Cmd + P) on your keyboard.' }
  },
  de: {
    title: 'Labyrinth-Generator',
    difficulty: { Easy: 'Einfach', Medium: 'Mittel', Hard: 'Schwer', Extreme: 'Extrem', Custom: 'Eigener' },
    settings: { cols: 'Spalten', rows: 'Zeilen', cellSize: 'Zellgröße', trickiness: 'Schwierigkeit', traps: 'Fallen' },
    buttons: { generate: 'Neues Labyrinth', showSolution: 'Lösung zeigen', hideSolution: 'Lösung ausblenden', print: 'Arbeitsblatt drucken' },
    tips: { printError: 'Falls sich das Druckfenster nicht öffnet, drücken Sie bitte Strg + P (oder Cmd + P) auf Ihrer Tastatur.' }
  },
  fr: {
    title: 'Générateur de Labyrinthes',
    difficulty: { Easy: 'Facile', Medium: 'Moyen', Hard: 'Difficile', Extreme: 'Extrême', Custom: 'Personnalisé' },
    settings: { cols: 'Colonnes', rows: 'Lignes', cellSize: 'Taille', trickiness: 'Complexité', traps: 'Pièges' },
    buttons: { generate: 'Nouveau Labyrinthe', showSolution: 'Afficher la solution', hideSolution: 'Masquer la solution', print: 'Imprimer la fiche' },
    tips: { printError: 'Si la fenêtre d\'impression ne s\'ouvre pas, appuyez sur Ctrl + P (ou Cmd + P) sur votre clavier.' }
  },
  es: {
    title: 'Generador de Laberintos',
    difficulty: { Easy: 'Fácil', Medium: 'Medio', Hard: 'Difícil', Extreme: 'Extremo', Custom: 'Personalizado' },
    settings: { cols: 'Columnas', rows: 'Filas', cellSize: 'Tamaño', trickiness: 'Complejidad', traps: 'Trampas' },
    buttons: { generate: 'Nuevo Laberinto', showSolution: 'Mostrar solución', hideSolution: 'Ocultar solución', print: 'Imprimir ficha' },
    tips: { printError: 'Si el cuadro de diálogo de impresión no se abre, presione Ctrl + P (o Cmd + P) en su teclado.' }
  },
  zh: {
    title: '专业迷宫生成器',
    difficulty: { Easy: '简单', Medium: '中等', Hard: '困难', Extreme: '极限', Custom: '自定义' },
    settings: { cols: '列数', rows: '行数', cellSize: '格子大小', trickiness: '迷惑度', traps: '陷阱' },
    buttons: { generate: '生成迷宫', showSolution: '显示答案', hideSolution: '隐藏答案', print: '打印练习单' },
    tips: { printError: '如果打印窗口未弹出，请按键盘上的 Ctrl + P (或 Cmd + P)。' }
  }
};

interface Cell {
  x: number;
  y: number;
  visited: boolean;
  walls: { top: boolean; right: boolean; bottom: boolean; left: boolean };
}

type Difficulty = 'Easy' | 'Medium' | 'Hard' | 'Extreme';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="app-container">
      <div class="controls no-print">

        <div class="lang-selector">
          <button *ngFor="let l of availableLangs"
                  [class.active]="currentLang() === l"
                  (click)="currentLang.set(l)">
            {{ l.toUpperCase() }}
          </button>
        </div>

        <div class="header-row">
          <h1>{{ t().title }}</h1>
          <span class="badge" [class]="currentDifficulty.toLowerCase()">
            {{ getDifficultyLabel() }}
          </span>
        </div>

        <div class="difficulty-selector">
          <button
            *ngFor="let diff of difficulties"
            class="btn-diff"
            [class.active]="currentDifficulty === diff"
            (click)="setDifficulty(diff)">
            {{ t().difficulty[diff] }}
          </button>
        </div>

        <div class="settings-grid">
          <div class="input-group">
            <label>{{ t().settings.cols }}</label>
            <input type="number" [(ngModel)]="cols" (change)="manualSettings()" min="5" max="150">
          </div>
          <div class="input-group">
            <label>{{ t().settings.rows }}</label>
            <input type="number" [(ngModel)]="rows" (change)="manualSettings()" min="5" max="150">
          </div>
          <div class="input-group">
            <label>{{ t().settings.cellSize }}</label>
            <input type="number" [(ngModel)]="cellSize" (change)="manualSettings()" min="4" max="60">
          </div>
          <div class="input-group full-width">
            <label>{{ t().settings.trickiness }} ({{ t().settings.traps }}): {{ (braidingFactor * 100).toFixed(0) }}%</label>
            <input type="range" [(ngModel)]="braidingFactor" (change)="manualSettings()" min="0" max="0.5" step="0.05">
          </div>
        </div>

        <div class="action-buttons">
          <button class="btn primary" (click)="generate()">🔄 {{ t().buttons.generate }}</button>
          <button class="btn secondary" (click)="toggleSolution()">
            {{ showSolution ? t().buttons.hideSolution : '👁️ ' + t().buttons.showSolution }}
          </button>
          <button class="btn print" (click)="handlePrint()">🖨️ {{ t().buttons.print }}</button>
        </div>

        <div *ngIf="printTip" class="print-tip">
          {{ t().tips.printError }}
        </div>
      </div>

      <div class="canvas-wrapper">
        <canvas #mazeCanvas></canvas>
      </div>
    </div>
  `,
  styles: [`
    :host {
      font-family: 'Inter', -apple-system, system-ui, sans-serif;
      display: block;
      background-color: #f8fafc;
      min-height: 100vh;
      color: #1e293b;
    }

    .app-container {
      max-width: 1300px;
      margin: 0 auto;
      padding: 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 20px;
    }

    .lang-selector {
      display: flex;
      justify-content: flex-end;
      gap: 5px;
      margin-bottom: 15px;
    }

    .lang-selector button {
      background: #f1f5f9;
      border: 1px solid #e2e8f0;
      padding: 4px 8px;
      font-size: 0.7rem;
      font-weight: 800;
      border-radius: 4px;
      cursor: pointer;
      color: #64748b;
    }

    .lang-selector button.active {
      background: #0f172a;
      color: white;
      border-color: #0f172a;
    }

    .controls {
      background: white;
      padding: 30px;
      border-radius: 24px;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05);
      width: 100%;
      max-width: 550px;
      text-align: center;
      border: 1px solid #e2e8f0;
    }

    .header-row {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 12px;
      margin-bottom: 24px;
    }

    h1 { margin: 0; font-size: 1.5rem; font-weight: 800; letter-spacing: -0.025em; }

    .badge {
      font-size: 0.75rem;
      padding: 4px 12px;
      border-radius: 100px;
      font-weight: 700;
      text-transform: uppercase;
      background: #f1f5f9;
    }

    .difficulty-selector {
      display: flex;
      background: #f1f5f9;
      padding: 6px;
      border-radius: 14px;
      margin-bottom: 24px;
    }

    .btn-diff {
      flex: 1;
      padding: 10px;
      border: none;
      background: transparent;
      border-radius: 10px;
      font-size: 0.875rem;
      font-weight: 600;
      cursor: pointer;
      color: #64748b;
      transition: all 0.2s;
    }

    .btn-diff.active {
      background: white;
      color: #0f172a;
      box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
    }

    .settings-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
      margin-bottom: 24px;
    }

    .full-width { grid-column: 1 / -1; }

    .input-group {
      display: flex;
      flex-direction: column;
      gap: 6px;
      text-align: left;
    }

    label { font-size: 0.7rem; font-weight: 800; color: #64748b; text-transform: uppercase; }

    input {
      padding: 10px;
      border: 1px solid #cbd5e1;
      border-radius: 10px;
      font-size: 1rem;
    }

    .action-buttons { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }

    .btn {
      padding: 12px 20px;
      border: none;
      border-radius: 12px;
      font-weight: 700;
      cursor: pointer;
      font-size: 0.9rem;
    }

    .btn.primary { background: #0f172a; color: white; }
    .btn.secondary { background: #f8fafc; color: #475569; border: 1px solid #e2e8f0; }
    .btn.print { background: #ffffff; color: #0f172a; border: 2px solid #0f172a; }

    .print-tip {
      margin-top: 15px;
      padding: 10px;
      background: #fffbeb;
      border: 1px solid #fef3c7;
      color: #92400e;
      border-radius: 8px;
      font-size: 0.8rem;
    }

    .canvas-wrapper {
      background: white;
      padding: 80px;
      border-radius: 8px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.1);
      display: flex;
      justify-content: center;
      max-width: 100%;
      overflow: auto;
    }

    @media print {
      .no-print { display: none !important; }
      body, :host { background: white; margin: 0; padding: 0 !important; }
      .app-container { margin: 0; padding: 0; width: 100%; max-width: none; }
      .canvas-wrapper {
        box-shadow: none; padding: 1cm 0; width: 100%; height: 100vh;
        display: flex; align-items: center; justify-content: center;
      }
      canvas { max-width: 95vw; max-height: 95vh; }
    }
  `]
})
export class App implements OnInit {
  @ViewChild('mazeCanvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;
  private ctx!: CanvasRenderingContext2D;

  availableLangs: LanguageKey[] = ['en', 'de', 'fr', 'es', 'zh'];
  currentLang = signal<LanguageKey>('en');
  t = computed(() => TRANSLATIONS[this.currentLang()]);

  difficulties: Difficulty[] = ['Easy', 'Medium', 'Hard', 'Extreme'];
  currentDifficulty: Difficulty | 'Custom' = 'Medium';

  cols = 25;
  rows = 35;
  cellSize = 22;
  showSolution = false;
  braidingFactor = 0.15;
  printTip = false;

  grid: Cell[] = [];
  solutionPath: Cell[] = [];

  ngOnInit() {
    this.detectLanguageFromUrl();

    const context = this.canvas.nativeElement.getContext('2d');
    if (context) {
      this.ctx = context;
      this.setDifficulty('Medium');
    }
  }

  private detectLanguageFromUrl() {
    try {
      const params = new URLSearchParams(window.location.search);
      const langParam = params.get('lang')?.toLowerCase() as LanguageKey;

      if (langParam && this.availableLangs.includes(langParam)) {
        this.currentLang.set(langParam);
      }
    } catch (e) { }
  }

  getDifficultyLabel() {
    if (this.currentDifficulty === 'Custom') return this.t().difficulty.Custom;
    return this.t().difficulty[this.currentDifficulty];
  }

  setDifficulty(level: Difficulty) {
    this.currentDifficulty = level;
    switch(level) {
      case 'Easy': this.cols = 12; this.rows = 16; this.cellSize = 45; this.braidingFactor = 0; break;
      case 'Medium': this.cols = 25; this.rows = 35; this.cellSize = 22; this.braidingFactor = 0.15; break;
      case 'Hard': this.cols = 50; this.rows = 70; this.cellSize = 12; this.braidingFactor = 0.25; break;
      case 'Extreme': this.cols = 85; this.rows = 110; this.cellSize = 8; this.braidingFactor = 0.4; break;
    }
    this.generate();
  }

  manualSettings() { this.currentDifficulty = 'Custom'; this.generate(); }
  toggleSolution() { this.showSolution = !this.showSolution; this.draw(); }

  handlePrint() {
    this.printTip = true;
    window.focus();
    setTimeout(() => { window.print(); }, 150);
  }

  generate() {
    this.grid = [];
    this.solutionPath = [];
    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.cols; x++) {
        this.grid.push({ x, y, visited: false, walls: { top: true, right: true, bottom: true, left: true } });
      }
    }

    const stack: Cell[] = [];
    let current = this.grid[0];
    current.visited = true;

    do {
      const next = this.checkNeighbors(current);
      if (next) {
        next.visited = true;
        this.removeWalls(current, next);
        stack.push(current);
        current = next;
      } else if (stack.length > 0) {
        current = stack.pop()!;
      }
    } while (stack.length > 0);

    this.grid[0].walls.top = false;
    this.grid[this.grid.length - 1].walls.bottom = false;

    if (this.braidingFactor > 0) this.addLoops();
    this.solveMaze();
    this.draw();
  }

  addLoops() {
    const deadEnds = this.grid.filter(c => {
      let walls = (c.walls.top ? 1 : 0) + (c.walls.right ? 1 : 0) + (c.walls.bottom ? 1 : 0) + (c.walls.left ? 1 : 0);
      return walls === 3 && !(c.x === 0 && c.y === 0) && !(c.x === this.cols - 1 && c.y === this.rows - 1);
    });
    for (let i = deadEnds.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deadEnds[i], deadEnds[j]] = [deadEnds[j], deadEnds[i]];
    }
    const count = Math.floor(deadEnds.length * this.braidingFactor);
    for (let i = 0; i < count; i++) {
      const cell = deadEnds[i];
      const validNeighbors: Cell[] = [];
      const t = this.getIndex(cell.x, cell.y - 1); if (t && cell.walls.top) validNeighbors.push(t);
      const r = this.getIndex(cell.x + 1, cell.y); if (r && cell.walls.right) validNeighbors.push(r);
      const b = this.getIndex(cell.x, cell.y + 1); if (b && cell.walls.bottom) validNeighbors.push(b);
      const l = this.getIndex(cell.x - 1, cell.y); if (l && cell.walls.left) validNeighbors.push(l);
      if (validNeighbors.length > 0) this.removeWalls(cell, validNeighbors[Math.floor(Math.random() * validNeighbors.length)]);
    }
  }

  checkNeighbors(cell: Cell): Cell | undefined {
    const neighbors: Cell[] = [];
    const t = this.getIndex(cell.x, cell.y - 1); if (t && !t.visited) neighbors.push(t);
    const r = this.getIndex(cell.x + 1, cell.y); if (r && !r.visited) neighbors.push(r);
    const b = this.getIndex(cell.x, cell.y + 1); if (b && !b.visited) neighbors.push(b);
    const l = this.getIndex(cell.x - 1, cell.y); if (l && !l.visited) neighbors.push(l);
    return neighbors.length > 0 ? neighbors[Math.floor(Math.random() * neighbors.length)] : undefined;
  }

  getIndex(x: number, y: number) {
    if (x < 0 || y < 0 || x >= this.cols || y >= this.rows) return undefined;
    return this.grid[x + y * this.cols];
  }

  removeWalls(a: Cell, b: Cell) {
    const x = a.x - b.x;
    if (x === 1) { a.walls.left = false; b.walls.right = false; }
    else if (x === -1) { a.walls.right = false; b.walls.left = false; }
    const y = a.y - b.y;
    if (y === 1) { a.walls.top = false; b.walls.bottom = false; }
    else if (y === -1) { a.walls.bottom = false; b.walls.top = false; }
  }

  solveMaze() {
    const queue: Cell[] = [];
    const visited = new Set<number>();
    const cameFrom = new Map<Cell, Cell>();
    const start = this.grid[0];
    const end = this.grid[this.grid.length - 1];
    queue.push(start);
    visited.add(0);
    while (queue.length > 0) {
      const current = queue.shift()!;
      if (current === end) {
        this.solutionPath = [end];
        let curr = end;
        while (cameFrom.has(curr)) { curr = cameFrom.get(curr)!; this.solutionPath.unshift(curr); }
        return;
      }
      const neighbors = [];
      if (!current.walls.top) neighbors.push(this.getIndex(current.x, current.y - 1));
      if (!current.walls.right) neighbors.push(this.getIndex(current.x + 1, current.y));
      if (!current.walls.bottom) neighbors.push(this.getIndex(current.x, current.y + 1));
      if (!current.walls.left) neighbors.push(this.getIndex(current.x - 1, current.y));
      for (const n of neighbors) {
        if (n && !visited.has(n.x + n.y * this.cols)) {
          visited.add(n.x + n.y * this.cols);
          cameFrom.set(n, current);
          queue.push(n);
        }
      }
    }
  }

  draw() {
    if (!this.ctx) return;
    const w = this.cols * this.cellSize;
    const h = this.rows * this.cellSize;
    const px = 80;
    const py = 100;

    this.canvas.nativeElement.width = w + (px * 2);
    this.canvas.nativeElement.height = h + (py * 2);

    this.ctx.translate(px, py);
    this.ctx.fillStyle = '#ffffff';
    this.ctx.fillRect(-px, -py, w + px * 2, h + py * 2);

    if (this.showSolution && this.solutionPath.length > 0) {
      this.ctx.save();
      this.ctx.strokeStyle = '#000000';
      const lineWidth = Math.max(2, this.cellSize / 4);
      const dashSize = Math.max(4, this.cellSize / 3);
      this.ctx.lineWidth = lineWidth;
      this.ctx.setLineDash([dashSize, dashSize]);
      this.ctx.lineCap = 'round';
      this.ctx.lineJoin = 'round';

      this.ctx.beginPath();
      const mid = this.cellSize / 2;
      this.ctx.moveTo(0.5 * this.cellSize, -20);
      for (const c of this.solutionPath) {
        this.ctx.lineTo(c.x * this.cellSize + mid, c.y * this.cellSize + mid);
      }
      this.ctx.lineTo((this.cols - 0.5) * this.cellSize, h + 20);
      this.ctx.stroke();
      this.ctx.restore();
    }

    this.ctx.strokeStyle = '#000000';
    this.ctx.lineWidth = this.cellSize < 10 ? 1.5 : 2;
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';

    this.ctx.beginPath();
    for (const c of this.grid) {
      const x = c.x * this.cellSize;
      const y = c.y * this.cellSize;
      if (c.walls.top) { this.ctx.moveTo(x, y); this.ctx.lineTo(x + this.cellSize, y); }
      if (c.walls.right) { this.ctx.moveTo(x + this.cellSize, y); this.ctx.lineTo(x + this.cellSize, y + this.cellSize); }
      if (c.walls.bottom) { this.ctx.moveTo(x + this.cellSize, y + this.cellSize); this.ctx.lineTo(x, y + this.cellSize); }
      if (c.walls.left) { this.ctx.moveTo(x, y + this.cellSize); this.ctx.lineTo(x, y); }
    }
    this.ctx.stroke();

    const arrowScale = Math.max(16, this.cellSize * 1.5);
    this.drawModernArrow((0.5) * this.cellSize, -arrowScale - 10, (0.5) * this.cellSize, -10, arrowScale);
    this.drawModernArrow((this.cols - 0.5) * this.cellSize, h + 10, (this.cols - 0.5) * this.cellSize, h + arrowScale + 10, arrowScale);
  }

  private drawModernArrow(fx: number, fy: number, tx: number, ty: number, size: number) {
    const ctx = this.ctx;
    const angle = Math.atan2(ty - fy, tx - fx);
    const headLen = size * 0.4;
    const headWidth = size * 0.35;
    const shaftWidth = Math.max(2.5, size * 0.1);

    ctx.save();
    ctx.translate(tx, ty);
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.lineWidth = shaftWidth;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#000000';
    ctx.moveTo(-size, 0);
    ctx.lineTo(-headLen + 2, 0);
    ctx.stroke();
    ctx.beginPath();
    ctx.fillStyle = '#000000';
    ctx.moveTo(0, 0);
    ctx.lineTo(-headLen, -headWidth);
    ctx.quadraticCurveTo(-headLen * 0.7, 0, -headLen, headWidth);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
}
