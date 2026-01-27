import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Segment, Lesson } from './model/lingo-learner';
import { AppSettingsService } from './services/app-settings.service';
import { LessonService } from './services/lessons.service';
import { UI_DATA } from './model/translations';

// Interne Struktur für die Anzeige
interface ViewItem {
  type: 'text' | 'gap' | 'compound';
  segment?: Segment;
  index?: number;
  textSegment?: Segment;
  gapSegment?: Segment;
  gapIndex?: number;
}


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [LessonService],
  template: `
    <div class="min-h-screen bg-slate-100 font-sans text-slate-900 selection:bg-indigo-200 selection:text-indigo-900">

      <!-- Loading State -->
      @if (isLoading()) {
        <div class="flex items-center justify-center min-h-screen">
          <div class="flex flex-col items-center gap-4">
            <div class="w-12 h-12 border-4 border-indigo-200 border-t-indigo-700 rounded-full animate-spin"></div>
            <p class="text-slate-500 font-medium">{{ t().loading }}</p>
          </div>
        </div>
      }
      <!-- Error State -->
      @else if (hasError()) {
        <div class="flex items-center justify-center min-h-screen">
          <div class="bg-red-50 p-6 rounded-lg border border-red-200 text-center max-w-md">
            <h3 class="text-red-800 font-bold text-lg mb-2">{{ t().errorTitle }}</h3>
            <p class="text-red-600 mb-4">{{ t().errorMsg }}</p>
            <button (click)="retryLoad()" class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors">
              {{ t().retryLoad }}
            </button>
          </div>
        </div>
      }
      <!-- Main Content -->
      @else {
        <header class="bg-white border-b border-slate-300 shadow-sm sticky top-0 z-30">
          <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-4">

            <!-- Row 1: Logo & UI Language Switcher -->
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <!-- Logo -->
              <div class="flex items-center gap-2">
                <div class="bg-indigo-700 text-white p-1.5 rounded-lg shadow-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m5 8 6 6"/><path d="m4 14 6-6 2-3"/><path d="M2 5h12"/><path d="M7 2h1"/><path d="m22 22-5-10-5 10"/><path d="M14 18h6"/></svg>
                </div>
                <h1 class="text-xl font-bold tracking-tight text-slate-800">Lingo<span class="text-indigo-700">Learner</span></h1>
              </div>

              <!-- UI Language Switcher (Buttons) -->
              <div class="flex space-x-1 bg-slate-200 p-1 rounded-lg overflow-x-auto self-start sm:self-auto">
                @for (code of uiLangCodes; track code) {
                  <button
                    (click)="setUiLang(code)"
                    [class.bg-white]="uiLangCode() === code"
                    [class.shadow-sm]="uiLangCode() === code"
                    [class.text-indigo-700]="uiLangCode() === code"
                    [class.text-slate-600]="uiLangCode() !== code"
                    class="px-3 py-1.5 text-sm font-bold rounded-md transition-all duration-200 whitespace-nowrap hover:text-slate-900"
                  >
                    {{ uiData[code].name }}
                  </button>
                }
              </div>
            </div>

            <!-- Row 2: Learning Language & Lesson Selectors -->
            <div class="flex flex-wrap gap-4 bg-slate-50 p-3 rounded-lg border border-slate-200 items-center">

              <!-- 1. Learning Language Selector -->
              <div class="flex items-center gap-2 flex-grow sm:flex-grow-0">
                <label for="lang-select"
                       [ngClass]="uiLangCode() === 'ZH' ? 'text-sm font-medium' : 'text-xs font-bold uppercase tracking-wider'"
                       class="text-slate-500 whitespace-nowrap">
                  {{ t().selectLanguage }}:
                </label>
                <div class="relative w-full sm:w-48">
                  <select
                    id="lang-select"
                    [ngModel]="selectedLanguage()"
                    (ngModelChange)="selectLanguage($event)"
                    class="appearance-none w-full bg-white border border-slate-300 text-slate-800 py-2 pl-3 pr-10 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-bold text-sm cursor-pointer hover:border-indigo-300 transition-colors"
                  >
                    @for (lang of availableLanguages(); track lang) {
                      <option [value]="lang">{{ t().languageNames[lang] || lang }}</option>
                    }
                  </select>
                  <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
                  </div>
                </div>
              </div>

              <!-- 2. Lesson Selector -->
              @if (lessonsForLanguage().length > 0) {
                <div class="flex items-center gap-2 flex-grow sm:flex-grow-0">
                  <label for="lesson-select"
                         [ngClass]="uiLangCode() === 'ZH' ? 'text-sm font-medium' : 'text-xs font-bold uppercase tracking-wider'"
                         class="text-slate-500 whitespace-nowrap">
                    {{ t().selectLesson }}:
                  </label>
                  <div class="relative w-full sm:w-64">
                    <select
                      id="lesson-select"
                      [ngModel]="currentLesson()?.id"
                      (ngModelChange)="onLessonChange($event)"
                      class="appearance-none w-full bg-white border border-slate-300 text-slate-800 py-2 pl-3 pr-10 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-bold text-sm cursor-pointer hover:border-indigo-300 transition-colors"
                    >
                      @for (lesson of lessonsForLanguage(); track lesson.id) {
                        <option [value]="lesson.id">{{ lesson.title }}</option>
                      }
                    </select>
                    <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                      <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
                    </div>
                  </div>
                </div>
              }
            </div>

          </div>
        </header>

        <main class="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">

          @if (currentLesson(); as lesson) {
            <!-- Info Card -->
            <div class="bg-white rounded-xl shadow-md border border-slate-300 p-6 mb-6">
              <div class="flex justify-between items-start flex-wrap gap-4">
                <div>
                  <h2 class="text-2xl font-extrabold text-slate-800 mb-2">{{ lesson.title }}</h2>
                  <p class="text-slate-600 font-medium">{{ lesson.description[uiLangCode()] || lesson.description['EN'] }}</p>
                </div>

                @if (isChecked()) {
                  <div class="flex flex-col items-end bg-slate-50 px-4 py-2 rounded-lg border border-slate-200">
                    <span [ngClass]="uiLangCode() === 'ZH' ? 'text-sm font-medium' : 'text-xs font-bold uppercase tracking-wider'"
                          class="text-slate-500">
                      {{ t().result }}
                    </span>
                    <div class="text-3xl font-black" [ngClass]="getScoreColor()">
                      {{ score() }}%
                    </div>
                  </div>
                }
              </div>

              <div class="mt-6 w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                <div class="bg-indigo-600 h-3 rounded-full transition-all duration-500 ease-out"
                    [style.width.%]="progress()"></div>
              </div>
            </div>

            <!-- Exercise Area -->
            <div class="bg-white rounded-xl shadow-lg border border-slate-300 p-8 md:p-12 leading-loose text-lg">
              <div class="block">

                <ng-template #inputField let-segment="segment" let-i="index">
                    <div class="relative inline-flex group align-baseline transition-all duration-200"
                      [ngClass]="{
                        'mx-2': !segment.isEnding,
                        'ml-0 mr-1': segment.isEnding
                      }">

                    <input
                      type="text"
                      [(ngModel)]="userAnswers[i]"
                      (ngModelChange)="updateProgress()"
                      [disabled]="isChecked()"
                      [placeholder]="segment.placeholder || ''"
                      [style.width.ch]="getInputWidth(segment)"
                      class="
                        transition-all duration-150 ease-out
                        border-2 outline-none font-bold text-slate-900 shadow-sm
                        placeholder:text-slate-300 placeholder:font-normal
                        focus:border-indigo-600 focus:z-10
                        disabled:bg-slate-50 disabled:cursor-default
                      "
                      [ngClass]="{
                        'rounded-r-md rounded-l-none ml-[1px] px-1 text-center': segment.isEnding,
                        'rounded-md px-3 text-center': !segment.isEnding,
                        'bg-white border-slate-400 hover:border-slate-500': !isChecked(),
                        'border-green-600 bg-green-50 text-green-800': isChecked() && isCorrect(i),
                        'border-red-500 bg-red-50 text-red-800 line-through decoration-red-500 decoration-2': isChecked() && !isCorrect(i)
                      }"
                      autocomplete="off"
                    >

                    @if (isChecked() && !isCorrect(i)) {
                      <div class="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-slate-900 text-white text-sm font-bold py-1.5 px-3 rounded shadow-xl whitespace-nowrap z-20 animate-bounce-in border border-slate-700">
                        {{ segment.answer }}
                        <div class="absolute bottom-[-6px] left-1/2 transform -translate-x-1/2 w-3 h-3 bg-slate-900 rotate-45 border-r border-b border-slate-700"></div>
                      </div>
                    }

                    @if (isChecked()) {
                      <span class="absolute -top-3 bg-white rounded-full shadow-sm border border-slate-200 p-0.5 z-10"
                            [ngClass]="segment.isEnding ? '-right-2 scale-75' : '-right-3'">
                        @if (isCorrect(i)) {
                          <svg class="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        }
                        @if (!isCorrect(i)) {
                          <svg class="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        }
                      </span>
                    }
                  </div>
                </ng-template>

                <!-- Render Logic Loop -->
                @for (item of viewSegments(); track $index) {
                  @if (item.type === 'text') {
                    <span class="whitespace-pre-wrap text-slate-800 font-medium">{{ item.segment?.content }}</span>
                  }
                  @if (item.type === 'gap') {
                    <ng-container *ngTemplateOutlet="inputField; context: { segment: item.segment, index: item.index }"></ng-container>
                  }
                  @if (item.type === 'compound') {
                    <span class="whitespace-nowrap inline-flex items-baseline">
                      <span class="whitespace-pre-wrap text-slate-800 font-medium relative z-10">{{ item.textSegment?.content }}</span>
                      <ng-container *ngTemplateOutlet="inputField; context: { segment: item.gapSegment, index: item.gapIndex }"></ng-container>
                    </span>
                  }
                }
              </div>
            </div>

            <!-- Buttons -->
            <div class="mt-8 flex justify-end gap-4">
              <button
                (click)="reset()"
                class="px-6 py-3 rounded-lg font-bold text-slate-700 bg-white border-2 border-slate-300 hover:bg-slate-50 hover:border-slate-400 hover:text-slate-900 transition-colors focus:ring-4 focus:ring-slate-200"
              >
                {{ t().reset }}
              </button>

              @if (!isChecked()) {
                <button
                  (click)="checkAnswers()"
                  class="px-10 py-3 rounded-lg font-bold text-white shadow-lg bg-indigo-700 hover:bg-indigo-800 active:bg-indigo-900 transition-all transform hover:-translate-y-0.5 active:translate-y-0 focus:ring-4 focus:ring-indigo-300"
                >
                  {{ t().check }}
                </button>
              }

              @if (isChecked()) {
                <button
                  (click)="reset()"
                  class="px-10 py-3 rounded-lg font-bold text-white shadow-lg bg-indigo-700 hover:bg-indigo-800 transition-all focus:ring-4 focus:ring-indigo-300"
                >
                  {{ t().retry }}
                </button>
              }
            </div>
          }
        </main>
      }
    </div>
  `,
  styles: [`
    @keyframes bounce-in {
      0% { opacity: 0; transform: translate(-50%, 10px) scale(0.9); }
      50% { transform: translate(-50%, -5px) scale(1.02); }
      100% { opacity: 1; transform: translate(-50%, 0) scale(1); }
    }
    .animate-bounce-in {
      animation: bounce-in 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
    }
  `]
})
export class App implements OnInit {
  private lessonService = inject(LessonService);

  // Translation Config
  uiLangCodes = ['DE', 'EN', 'ES', 'FR', 'ZH'];
  uiData = UI_DATA;
  uiLangCode = signal('EN');

  // Translation Computed
  t = computed(() => this.uiData[this.uiLangCode()]);

  // State
  isLoading = signal<boolean>(true);
  hasError = signal<boolean>(false);
  allLessons = signal<Lesson[]>([]);

  selectedLanguage = signal<string>('EN'); // Default
  currentLesson = signal<Lesson | null>(null);
  userAnswers: { [key: number]: string } = {};
  isChecked = signal(false);

  // Computed Values
  availableLanguages = computed(() => {
    const lessons = this.allLessons();
    const languages = new Set(lessons.map(l => l.language));
    return Array.from(languages);
  });

  lessonsForLanguage = computed(() => {
    return this.allLessons().filter(l => l.language === this.selectedLanguage());
  });

  viewSegments = computed(() => {
    const lesson = this.currentLesson();
    if (!lesson) return [];

    const segments = lesson.segments;
    const items: ViewItem[] = [];

    for (let i = 0; i < segments.length; i++) {
      const current = segments[i];
      const next = segments[i + 1];

      // Logic to glue text + ending together
      if (current.type === 'text' && next?.type === 'gap' && next?.isEnding) {
        const content = current.content || '';
        const lastSpaceIndex = content.lastIndexOf(' ');

        if (lastSpaceIndex !== -1) {
          items.push({
            type: 'text',
            segment: { ...current, content: content.substring(0, lastSpaceIndex + 1) },
            index: i
          });

          items.push({
            type: 'compound',
            textSegment: { ...current, content: content.substring(lastSpaceIndex + 1) },
            gapSegment: next,
            gapIndex: i + 1
          });
        } else {
          items.push({
            type: 'compound',
            textSegment: current,
            gapSegment: next,
            gapIndex: i + 1
          });
        }
        i++;
      } else {
        items.push({
          type: current.type === 'gap' ? 'gap' : 'text',
          segment: current,
          index: i
        });
      }
    }
    return items;
  });

  progress = computed(() => {
    const lesson = this.currentLesson();
    if (!lesson) return 0;

    const gaps = lesson.segments.filter(s => s.type === 'gap');
    if (gaps.length === 0) return 0;

    let filledCount = 0;
    lesson.segments.forEach((seg, index) => {
        if (seg.type === 'gap' && this.userAnswers[index]?.trim().length > 0) {
            filledCount++;
        }
    });

    return Math.round((filledCount / gaps.length) * 100);
  });

  score = computed(() => {
    const lesson = this.currentLesson();
    if (!this.isChecked() || !lesson) return 0;

    const gaps = lesson.segments.filter(s => s.type === 'gap');
    let correctCount = 0;
    lesson.segments.forEach((seg, index) => {
      if (seg.type === 'gap' && this.isCorrect(index)) {
        correctCount++;
      }
    });
    return Math.round((correctCount / gaps.length) * 100);
  });

  ngOnInit() {
    const urlParams = new URLSearchParams(window.location.search);
    const langParam = urlParams.get('lang');
    if (langParam) {
      const upperLang = langParam.toUpperCase();
      if (this.uiLangCodes.includes(upperLang)) {
        this.setUiLang(upperLang);
      }
    }
    this.loadData();
  }

  loadData() {
    this.isLoading.set(true);
    this.hasError.set(false);
    this.lessonService.getLessons().subscribe({
      next: (data) => {
        this.allLessons.set(data);
        this.isLoading.set(false);
        this.selectLanguage('EN');
      },
      error: (err) => {
        console.error('Fehler beim Laden der Lektionen', err);
        this.isLoading.set(false);
        this.hasError.set(true);
      }
    });
  }

  retryLoad() {
    this.loadData();
  }

  setUiLang(code: string) {
    this.uiLangCode.set(code);
  }

  selectLanguage(lang: string) {
    this.selectedLanguage.set(lang);
    const lessons = this.lessonsForLanguage();
    if (lessons.length > 0) {
      this.currentLesson.set(lessons[0]);
    } else {
      this.currentLesson.set(null);
    }
    this.reset();
  }

  selectLesson(lesson: Lesson) {
    this.currentLesson.set(lesson);
    this.reset();
  }

  onLessonChange(lessonId: string) {
    const lesson = this.lessonsForLanguage().find(l => l.id === lessonId);
    if (lesson) {
      this.selectLesson(lesson);
    }
  }

  updateProgress() {
    // triggers signal
  }

  checkAnswers() {
    this.isChecked.set(true);
  }

  reset() {
    this.userAnswers = {};
    this.isChecked.set(false);
  }

  isCorrect(index: number): boolean {
    const lesson = this.currentLesson();
    if (!lesson) return false;

    const segment = lesson.segments[index];
    if (!segment || segment.type !== 'gap' || !segment.answer) return false;

    const userInput = this.userAnswers[index]?.trim().toLowerCase();
    if (!userInput) return false;

    const correctAnswer = segment.answer.trim().toLowerCase();
    return userInput === correctAnswer;
  }

  getScoreColor(): string {
    const s = this.score();
    if (s === 100) return 'text-green-700';
    if (s >= 50) return 'text-amber-600';
    return 'text-red-600';
  }

  getInputWidth(segment: Segment): number {
    const answerLen = segment.answer ? segment.answer.length : 0;
    const isEnding = segment.isEnding || false;

    if (isEnding) {
      return answerLen + 2;
    } else {
      return answerLen + 4;
    }
  }
}
