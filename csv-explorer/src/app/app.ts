import { Component, signal, OnInit, ChangeDetectionStrategy, computed } from '@angular/core';
import { DecimalPipe, CommonModule } from '@angular/common';
import * as Papa from 'papaparse';
import initSqlJs from 'sql.js';

interface PivotRow {
  rowLabel: string;
  values: { [key: string]: number | null };
  total: number | null;
}

interface Dimension {
  label: string;
  field: string;
  type: 'text' | 'date-year' | 'date-month' | 'date-quarter' | 'date-ym' | 'date-day';
}

type LangCode = 'de' | 'en' | 'zh';

const TRANSLATIONS: Record<LangCode, any> = {
  de: {
    title: 'CSV Explorer',
    subtitle: 'Daten mit Pivot Tabellen Analysieren',
    loadCsv: 'Neue CSV laden',
    activeFile: 'Aktive Datei',
    rows: 'Zeilen (Y-Achse)',
    cols: 'Spalten (X-Achse)',
    aggregate: 'Aggregat',
    measure: 'Wert-Feld',
    refresh: 'Aktualisieren',
    records: 'Datensätze analysiert',
    processing: 'Verarbeitung läuft',
    engineMsg: 'SQLite Engine Aggregation...',
    emptyTitle: 'Pivot-Analyse starten',
    emptyDesc: 'Wähle eine CSV-Datei aus. Die Spalten werden automatisch erkannt und die Datumsformate normalisiert.',
    selectFile: 'Datei auswählen',
    total: 'Gesamt',
    grandTotal: 'Gesamtsumme',
    traceTitle: 'Query Performance Trace',
    dimYear: 'Jahr',
    dimMonth: 'Monat',
    dimQuarter: 'Quartal',
    dimYM: 'Jahr-Monat',
    dimDay: 'Wochentag',
    days: ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag']
  },
  en: {
    title: 'CSV Explorer',
    subtitle: 'Explore Data using Pivot Tables',
    loadCsv: 'Load New CSV',
    activeFile: 'Active File',
    rows: 'Rows (Y-Axis)',
    cols: 'Columns (X-Axis)',
    aggregate: 'Aggregate',
    measure: 'Measure Field',
    refresh: 'Refresh',
    records: 'Records Analyzed',
    processing: 'Processing...',
    engineMsg: 'SQLite Engine Aggregation...',
    emptyTitle: 'Start Pivot Analysis',
    emptyDesc: 'Choose a CSV file. Columns will be auto-detected and date formats normalized.',
    selectFile: 'Select File',
    total: 'Total',
    grandTotal: 'Grand Total',
    traceTitle: 'Query Performance Trace',
    dimYear: 'Year',
    dimMonth: 'Month',
    dimQuarter: 'Quarter',
    dimYM: 'Year-Month',
    dimDay: 'Weekday',
    days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  },
  zh: {
    title: 'CSV 资源管理器',
    subtitle: '使用透视表探索数据',
    loadCsv: '加载新 CSV',
    activeFile: '当前文件',
    rows: '行 (Y轴)',
    cols: '列 (X轴)',
    aggregate: '聚合方式',
    measure: '数值字段',
    refresh: '刷新',
    records: '已分析记录',
    processing: '处理中...',
    engineMsg: 'SQLite 引擎聚合中...',
    emptyTitle: '开始透视分析',
    emptyDesc: '请选择一个 CSV 文件。系统将自动检测列并标准化日期格式。',
    selectFile: '选择文件',
    total: '合计',
    grandTotal: '总计',
    traceTitle: '查询性能追踪',
    dimYear: '年份',
    dimMonth: '月份',
    dimQuarter: '季度',
    dimYM: '年月',
    dimDay: '星期',
    days: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
  }
};

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [DecimalPipe, CommonModule],
  template: `
    <div class="min-h-screen bg-slate-100 font-sans text-slate-900 flex flex-col overflow-hidden">

      <!-- Top Management Toolbar -->
      <header class="bg-slate-800 text-white p-3 shadow-md z-40">
        <div class="max-w-[1800px] mx-auto flex flex-wrap items-center justify-between gap-4">
          <div class="flex items-center gap-3">
            <div class="bg-blue-600 p-1.5 rounded-lg shadow-lg shadow-blue-900/20">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h1 class="text-sm font-bold leading-tight">{{ t().title }}</h1>
              <p class="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">{{ t().subtitle }}</p>
            </div>
          </div>

          <div class="flex items-center gap-3">
            <!-- Language Switcher -->
            <div class="flex bg-slate-700 p-1 rounded-lg border border-slate-600">
              @for (lang of ['de', 'en', 'zh']; track lang) {
                <button (click)="setLang(lang)"
                  [class]="'px-2 py-1 text-[10px] font-bold rounded transition-colors ' + (currentLang() === lang ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white')">
                  {{ lang.toUpperCase() }}
                </button>
              }
            </div>

            @if (rowCount() > 0) {
              <div class="hidden lg:flex flex-col items-end mr-4 border-r border-slate-600 pr-4">
                <span class="text-[10px] uppercase text-slate-400 font-bold">{{ t().activeFile }}</span>
                <span class="text-xs font-medium truncate max-w-[150px]">{{ fileName() }}</span>
              </div>
            }
            <label class="cursor-pointer bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded text-xs font-bold transition-all shadow-md active:scale-95 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor font-bold">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              {{ t().loadCsv }}
              <input type="file" (change)="onFileSelected($event)" accept=".csv" class="hidden">
            </label>
          </div>
        </div>
      </header>

      <!-- Sub-Toolbar (Controls) -->
      @if (rowCount() > 0) {
        <nav class="bg-white border-b border-slate-300 p-2 shadow-sm z-30 relative">
          <div class="max-w-[1800px] mx-auto flex flex-wrap gap-4 items-end text-[11px]">
            <div class="flex flex-col gap-1">
              <label class="font-bold text-slate-500 uppercase text-[9px]">{{ t().rows }}</label>
              <select [value]="rowDimIdx()" (change)="updateSetting('rowDimIdx', $event)"
                class="bg-slate-50 border border-slate-300 rounded px-2 py-1.5 focus:ring-2 focus:ring-blue-500/20 outline-none hover:border-slate-400 transition-colors">
                @for (dim of availableDimensions(); track $index) {
                  <option [value]="$index">{{ dim.label }}</option>
                }
              </select>
            </div>

            <div class="flex flex-col gap-1">
              <label class="font-bold text-slate-500 uppercase text-[9px]">{{ t().cols }}</label>
              <select [value]="colDimIdx()" (change)="updateSetting('colDimIdx', $event)"
                class="bg-slate-50 border border-slate-300 rounded px-2 py-1.5 focus:ring-2 focus:ring-blue-500/20 outline-none hover:border-slate-400 transition-colors">
                @for (dim of availableDimensions(); track $index) {
                  <option [value]="$index">{{ dim.label }}</option>
                }
              </select>
            </div>

            <div class="flex flex-col gap-1">
              <label class="font-bold text-slate-500 uppercase text-[9px]">{{ t().aggregate }}</label>
              <select [value]="aggOperator()" (change)="updateSetting('aggOperator', $event)"
                class="bg-slate-50 border border-slate-300 rounded px-2 py-1.5 focus:ring-2 focus:ring-blue-500/20 outline-none hover:border-slate-400 transition-colors font-bold text-blue-700">
                <option value="SUM">SUM</option>
                <option value="AVG">AVG</option>
                <option value="COUNT">COUNT</option>
                <option value="MAX">MAX</option>
                <option value="MIN">MIN</option>
              </select>
            </div>

            <div class="flex flex-col gap-1">
              <label class="font-bold text-slate-500 uppercase text-[9px]">{{ t().measure }}</label>
              <select [value]="measure()" (change)="updateSetting('measure', $event)"
                class="bg-slate-50 border border-slate-300 rounded px-2 py-1.5 focus:ring-2 focus:ring-blue-500/20 outline-none hover:border-slate-400 transition-colors min-w-[120px]">
                @for (col of numericColumns(); track col) {
                  <option [value]="col">{{ col }}</option>
                }
              </select>
            </div>

            <div class="flex-grow"></div>

            <div class="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded text-slate-600 font-medium">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{{ rowCount() | number }} {{ t().records }}</span>
            </div>
          </div>
        </nav>
      }

      <!-- Main Content Area -->
      <main class="flex-grow overflow-hidden relative bg-slate-100 flex flex-col">

        <!-- Processing Overlay -->
        @if (isProcessing()) {
          <div class="absolute inset-0 bg-slate-100/60 backdrop-blur-[2px] z-50 flex flex-col items-center justify-center transition-all duration-300">
            <div class="bg-white p-8 rounded-2xl shadow-2xl border border-slate-200 flex flex-col items-center gap-4">
              <div class="w-12 h-12 rounded-full border-4 border-slate-100 border-t-blue-600 animate-spin"></div>
              <div class="text-center">
                <h3 class="text-sm font-bold text-slate-800 uppercase tracking-widest">{{ t().processing }}</h3>
                <p class="text-[10px] text-slate-500 mt-1 font-mono uppercase">{{ t().engineMsg }}</p>
              </div>
            </div>
          </div>
        }

        <!-- Empty State / Dropzone -->
        @if (rowCount() === 0 && !isProcessing()) {
          <div class="flex-grow flex items-center justify-center p-12 overflow-y-auto">
            <label class="group relative w-full max-w-2xl aspect-video flex flex-col items-center justify-center bg-white border-4 border-dashed border-slate-300 rounded-3xl hover:border-blue-400 hover:bg-blue-50 transition-all cursor-pointer p-12">
              <div class="p-6 rounded-full bg-slate-100 group-hover:bg-blue-100 transition-colors mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-slate-400 group-hover:text-blue-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <h2 class="text-2xl font-bold text-slate-700 mb-2">{{ t().emptyTitle }}</h2>
              <p class="text-slate-500 text-center max-w-sm mb-6">{{ t().emptyDesc }}</p>
              <div class="px-6 py-2 bg-slate-800 text-white rounded-full font-bold text-sm group-hover:bg-blue-600 transition-colors shadow-lg">{{ t().selectFile }}</div>
              <input type="file" (change)="onFileSelected($event)" accept=".csv" class="hidden">
            </label>
          </div>
        } @else if (rowCount() > 0) {
          <!-- Data Table Container -->
          <div class="flex-grow overflow-auto p-4 custom-scrollbar">
            <div class="bg-white rounded-lg shadow-xl border border-slate-300 inline-block min-w-full overflow-hidden">
              <table class="w-full text-left border-collapse select-text">
                <thead class="sticky top-0 z-20">
                  <tr class="bg-slate-200 text-[10px] font-bold text-slate-600 uppercase">
                    <th class="p-3 border border-slate-300 min-w-[180px] sticky left-0 z-30 bg-slate-200 border-r-2 shadow-[2px_0_0_0_rgba(0,0,0,0.05)]">
                      {{ getDimLabel(rowDimIdx()) }}
                    </th>
                    @for (col of pivotCols(); track col) {
                      <th class="p-3 border border-slate-300 text-right min-w-[110px] whitespace-nowrap">
                        {{ col }}
                      </th>
                    }
                    <th class="p-3 border border-slate-300 text-right min-w-[130px] bg-blue-100/80 text-blue-900 border-l-2">
                      {{ t().total }}
                    </th>
                  </tr>
                </thead>
                <tbody class="text-[11px]">
                  @for (row of pivotData(); track row.rowLabel) {
                    <tr class="hover:bg-blue-50 transition-colors group">
                      <td class="p-2 border border-slate-200 font-bold text-slate-700 sticky left-0 z-10 bg-white group-hover:bg-blue-50 border-r-2 shadow-[2px_0_5px_rgba(0,0,0,0.02)] whitespace-nowrap">
                        {{ row.rowLabel }}
                      </td>
                      @for (col of pivotCols(); track col) {
                        <td class="p-2 border border-slate-200 text-right font-mono text-slate-600 whitespace-nowrap">
                          {{ (row.values[col] !== null) ? (row.values[col] | number:'1.0-2') : '-' }}
                        </td>
                      }
                      <td class="p-2 border border-slate-200 text-right font-bold text-blue-700 bg-blue-50/30 font-mono border-l-2">
                        {{ row.total | number:'1.0-2' }}
                      </td>
                    </tr>
                  }
                </tbody>
                <tfoot class="sticky bottom-0 z-20 bg-slate-100 font-bold text-[11px] shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
                  <tr class="border-t-2 border-slate-400">
                    <td class="p-3 border border-slate-300 sticky left-0 bg-slate-100 border-r-2">{{ t().grandTotal }}</td>
                    @for (col of pivotCols(); track col) {
                      <td class="p-3 border border-slate-300 text-right font-mono text-slate-800">
                        {{ getGrandTotal(col) | number:'1.0-2' }}
                      </td>
                    }
                    <td class="p-3 border border-slate-300 text-right text-blue-800 bg-blue-100 font-mono border-l-2">
                      {{ getTotalOverall() | number:'1.0-2' }}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <!-- Trace -->
            <div class="mt-8 mb-4 max-w-full">
               <details class="group bg-slate-800 rounded-xl overflow-hidden border border-slate-700 shadow-lg">
                  <summary class="p-4 cursor-pointer flex justify-between items-center list-none select-none">
                    <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{{ t().traceTitle }}</span>
                    <span class="text-slate-500 group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <div class="p-4 bg-slate-900 border-t border-slate-700 overflow-x-auto">
                    <pre class="text-[10px] text-blue-300 font-mono leading-relaxed">{{ lastQuery() }}</pre>
                  </div>
               </details>
            </div>
          </div>
        }
      </main>
    </div>
  `,
  styles: [`
    :host { display: block; height: 100vh; }
    .custom-scrollbar::-webkit-scrollbar { width: 10px; height: 10px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: #f1f5f9; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 5px; border: 2px solid #f1f5f9; }
    table { border-spacing: 0; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class App implements OnInit {
  private db: any;

  dbInitialized = signal(false);
  isProcessing = signal(false);
  rowCount = signal(0);
  fileName = signal('');
  currentLang = signal<LangCode>('en');

  t = computed(() => TRANSLATIONS[this.currentLang()]);

  numericColumns = signal<string[]>([]);
  availableDimensions = signal<Dimension[]>([]);
  originalFields = signal<string[]>([]);
  dateFields = signal<Set<string>>(new Set());

  rowDimIdx = signal(0);
  colDimIdx = signal(1);
  measure = signal('');
  aggOperator = signal('SUM');

  pivotCols = signal<string[]>([]);
  pivotData = signal<PivotRow[]>([]);
  lastQuery = signal<string>('-- Engine Ready');

  ngOnInit() {
    this.initLibraries();
  }

  setLang(lang: string) {
    this.currentLang.set(lang as LangCode);
    if (this.rowCount() > 0) {
      this.rebuildDimensions();
    }
  }

  private async initLibraries() {
    try {
      const SQL = await initSqlJs({
        locateFile: (file: string) => `assets/${file}`
      });
      this.db = new SQL.Database();
      this.dbInitialized.set(true);
    } catch (err) {
      console.error('SQL.js initialization failed', err);
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;
    this.isProcessing.set(true);
    this.fileName.set(file.name);
    setTimeout(() => {
      Papa.parse(file, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: (results: any) => this.processData(results.data, results.meta.fields)
      });
    }, 100);
  }

  private processData(data: any[], fields: string[]) {
    if (!data || data.length === 0) {
      this.isProcessing.set(false);
      return;
    }

    const dateFields = new Set<string>();
    const numericFields = new Set<string>();

    fields.forEach(f => {
      const val = data.find(d => d[f] !== null)?.[f];
      if (this.detectDate(val)) dateFields.add(f);
      if (typeof val === 'number') numericFields.add(f);
    });

    this.db.run("DROP TABLE IF EXISTS Data");
    const schema = fields.map(f => `[${f}] ${dateFields.has(f) ? 'TEXT' : 'NUMERIC'}`).join(', ');
    this.db.run(`CREATE TABLE Data (${schema})`);

    const placeholders = fields.map(() => '?').join(',');
    const stmt = this.db.prepare(`INSERT INTO Data VALUES (${placeholders})`);
    data.forEach(row => {
      const values = fields.map(f => dateFields.has(f) ? this.toIso(row[f]) : row[f]);
      stmt.run(values);
    });
    stmt.free();

    this.rowCount.set(data.length);
    this.numericColumns.set(Array.from(numericFields));
    this.originalFields.set(fields);
    this.dateFields.set(dateFields);

    this.rebuildDimensions();

    this.measure.set(Array.from(numericFields)[0] || fields[0]);
    this.rowDimIdx.set(0);
    this.colDimIdx.set(Math.min(fields.length - 1, 1));
    this.generatePivot();
  }

  private rebuildDimensions() {
    const dims: Dimension[] = [];
    const fields = this.originalFields();
    const dateFields = this.dateFields();
    const t = this.t();

    fields.forEach(f => {
      if (dateFields.has(f)) {
        dims.push({ label: `${f} (${t.dimYear})`, field: f, type: 'date-year' });
        dims.push({ label: `${f} (${t.dimMonth})`, field: f, type: 'date-month' });
        dims.push({ label: `${f} (${t.dimQuarter})`, field: f, type: 'date-quarter' });
        dims.push({ label: `${f} (${t.dimYM})`, field: f, type: 'date-ym' });
        dims.push({ label: `${f} (${t.dimDay})`, field: f, type: 'date-day' });
      } else {
        dims.push({ label: f, field: f, type: 'text' });
      }
    });
    this.availableDimensions.set(dims);
    this.generatePivot(); // UI Refresh
  }

  private detectDate(v: any): boolean {
    if (typeof v !== 'string') return false;
    return /^\d{1,2}[\.\/-]\d{1,2}[\.\/-]\d{4}$/.test(v) || /^\d{4}-\d{2}-\d{2}$/.test(v);
  }

  private toIso(v: any): string {
    if (!v) return '';
    const s = v.toString();
    const m = s.match(/^(\d{1,2})[\.\/-](\d{1,2})[\.\/-](\d{4})$/);
    if (m) {
      if (parseInt(m[1]) > 12) return `${m[3]}-${m[2].padStart(2,'0')}-${m[1].padStart(2,'0')}`;
      return `${m[3]}-${m[1].padStart(2,'0')}-${m[2].padStart(2,'0')}`;
    }
    return v;
  }

  updateSetting(key: string, event: Event) {
    const val = (event.target as HTMLSelectElement).value;
    if (key === 'rowDimIdx') this.rowDimIdx.set(parseInt(val));
    if (key === 'colDimIdx') this.colDimIdx.set(parseInt(val));
    if (key === 'measure') this.measure.set(val);
    if (key === 'aggOperator') this.aggOperator.set(val);
    this.isProcessing.set(true);
    setTimeout(() => this.generatePivot(), 50);
  }

  private getDimSql(dim: Dimension): string {
    const f = `[${dim.field}]`;
    const t = this.t();
    switch (dim.type) {
      case 'date-year': return `strftime('%Y', ${f})`;
      case 'date-month': return `strftime('%m', ${f})`;
      case 'date-quarter': return `('Q' || ((strftime('%m', ${f})-1)/3+1))`;
      case 'date-ym': return `strftime('%Y-%m', ${f})`;
      case 'date-day': return `CASE strftime('%w', ${f})
                                WHEN '0' THEN '${t.days[0]}' WHEN '1' THEN '${t.days[1]}'
                                WHEN '2' THEN '${t.days[2]}' WHEN '3' THEN '${t.days[3]}'
                                WHEN '4' THEN '${t.days[4]}' WHEN '5' THEN '${t.days[5]}'
                                ELSE '${t.days[6]}' END`;
      default: return f;
    }
  }

  getDimLabel(idx: number): string {
    return this.availableDimensions()[idx]?.label || 'Label';
  }

  generatePivot() {
    const rDim = this.availableDimensions()[this.rowDimIdx()];
    const cDim = this.availableDimensions()[this.colDimIdx()];
    const m = this.measure();
    const op = this.aggOperator();

    if (!rDim || !cDim || !m) { this.isProcessing.set(false); return; }

    const rSql = this.getDimSql(rDim);
    const cSql = this.getDimSql(cDim);

    try {
      const colRes = this.db.exec(`SELECT DISTINCT ${cSql} FROM Data WHERE ${cSql} IS NOT NULL ORDER BY 1 ASC`);
      const distinctCols = colRes[0]?.values.map((v: any) => v[0].toString()) || [];
      this.pivotCols.set(distinctCols);

      const dynamic = distinctCols.map((v: string) => {
        const e = v.replace(/'/g, "''");
        return `${op}(CASE WHEN ${cSql} = '${e}' THEN CAST([${m}] AS REAL) ELSE NULL END) AS [${v}]`;
      }).join(',\n    ');

      const sql = `SELECT ${rSql} AS rowLabel, ${dynamic ? dynamic + ',' : ''} ${op}(CAST([${m}] AS REAL)) AS total FROM Data GROUP BY rowLabel ORDER BY rowLabel ASC;`;
      this.lastQuery.set(sql);
      const res = this.db.exec(sql);

      if (res.length > 0) {
        const cols = res[0].columns;
        this.pivotData.set(res[0].values.map((r: any[]) => {
          const rowObj: PivotRow = { rowLabel: r[0]?.toString() || 'N/A', values: {}, total: r[r.length-1] };
          for(let i=1; i<r.length-1; i++) rowObj.values[cols[i]] = r[i];
          return rowObj;
        }));
      } else {
        this.pivotData.set([]);
      }
    } catch (e: any) { this.lastQuery.set("-- ERROR: " + e.message); } finally { this.isProcessing.set(false); }
  }

  getGrandTotal(col: string): number {
    return this.pivotData().reduce((s, r) => s + (Number(r.values[col]) || 0), 0);
  }

  getTotalOverall(): number {
    return this.pivotData().reduce((s, r) => s + (Number(r.total) || 0), 0);
  }
}
