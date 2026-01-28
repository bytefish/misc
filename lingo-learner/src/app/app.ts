import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Segment, Lesson, SegmentType } from './model/lingo-learner';
import { AppSettingsService } from './services/app-settings.service';
import { LessonService } from './services/lessons.service';
import { UI_DATA } from './model/translations';

// Interne Struktur für die Anzeige
interface ViewItem {
  type: 'text' | 'gap' | 'br' | 'compound';
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

  @if (isLoading()) {
    <div class="flex items-center justify-center min-h-screen">
      <div class="flex flex-col items-center gap-4">
        <div class="w-12 h-12 border-4 border-indigo-200 border-t-indigo-700 rounded-full animate-spin"></div>
        <p class="text-slate-500 font-medium">{{ t().loading }}</p>
      </div>
    </div>
  }

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

  @else {
    <header class="bg-white border-b border-slate-300 shadow-sm sticky top-0 z-30">
      <div [class]="isAdminMode() ? 'max-w-[95vw]' : 'max-w-4xl'" class="mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-4 transition-all duration-500">

        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div class="flex items-center gap-4">
            <div class="flex items-center gap-2">
              <div class="bg-indigo-700 text-white p-1.5 rounded-lg shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m5 8 6 6"/><path d="m4 14 6-6 2-3"/><path d="M2 5h12"/><path d="M7 2h1"/><path d="m22 22-5-10-5 10"/><path d="M14 18h6"/></svg>
              </div>
              <h1 class="text-xl font-bold tracking-tight text-slate-800">Lingo<span class="text-indigo-700">Learner</span></h1>
            </div>

            <button (click)="toggleAdminMode()"
                    [class.bg-indigo-700]="isAdminMode()"
                    [class.text-white]="isAdminMode()"
                    [class.border-indigo-700]="isAdminMode()"
                    class="ml-2 px-3 py-1 text-xs font-black uppercase tracking-wider border-2 border-slate-300 text-slate-500 rounded-full hover:border-indigo-500 transition-all">
              {{ isAdminMode() ? t().adminExit : t().adminMode }}
            </button>
          </div>

          <div class="flex space-x-1 bg-slate-200 p-1 rounded-lg overflow-x-auto">
            @for (code of uiLangCodes; track code) {
              <button
                (click)="setUiLang(code)"
                [class.bg-white]="uiLangCode() === code"
                [class.text-indigo-700]="uiLangCode() === code"
                class="px-3 py-1.5 text-sm font-bold rounded-md transition-all hover:text-slate-900"
              >
                {{ uiData[code].name }}
              </button>
            }
          </div>
        </div>
      </div>
    </header>

    <main [class]="isAdminMode() ? 'max-w-[95vw]' : 'max-w-4xl'" class="mx-auto px-4 py-8 sm:px-6 lg:px-8 transition-all duration-500">

    @if (isAdminMode()) {
      <section class="animate-in fade-in duration-500">
        <div class="grid grid-cols-1 xl:grid-cols-[1fr_1.2fr] gap-12 items-start">

          <div class="bg-white rounded-2xl shadow-xl border border-indigo-200 p-8">
            <div class="flex justify-between items-center mb-8">
              <h2 class="text-2xl font-black text-slate-800 flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="text-indigo-600">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
                {{ t().designerTitle }}
              </h2>

              <button (click)="clearEditor()" class="text-xs font-bold text-red-500 hover:text-red-700 transition-colors flex items-center gap-2 px-3 py-1.5 hover:bg-red-50 rounded-xl">
                 <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                   <path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                 </svg>
                 {{ t().clearAll }}
              </button>
            </div>

            <div class="space-y-6 mb-10">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div class="space-y-1">
                  <label class="text-xs font-black text-slate-400 uppercase tracking-widest">{{ t().lessonTitleLabel }}</label>
                  <input [(ngModel)]="newLesson().title" [placeholder]="t().lessonTitleLabel + '...'"
                         class="w-full text-xl font-bold border-b-2 border-slate-100 focus:border-indigo-500 outline-none pb-2 transition-all">
                </div>
                <div class="space-y-1">
                  <label class="text-xs font-black text-slate-400 uppercase tracking-widest">{{ t().targetLangLabel }}</label>
                  <select [(ngModel)]="newLesson().language" class="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 font-bold text-sm outline-none focus:ring-2 focus:ring-indigo-500">
                    @for (lang of uiLangCodes; track lang) {
                      <option [value]="lang">{{ t().languageNames[lang] }}</option>
                    }
                  </select>
                </div>
              </div>

              <div class="bg-slate-50/50 rounded-2xl p-6 border border-slate-100">
                <label class="text-xs font-black text-slate-400 uppercase tracking-widest block mb-4">{{ t().descLabel }}</label>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  @for (langCode of uiLangCodes; track langCode) {
                    <div class="flex items-center gap-3 bg-white p-2 rounded-xl border border-slate-200 shadow-sm focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
                      <span class="text-xs font-black text-indigo-300 w-8 text-center border-r border-slate-100">{{ langCode }}</span>
                      <input [(ngModel)]="newLesson().description[langCode]"
                             [placeholder]="t().descLabel + ' (' + langCode + ')'"
                             class="flex-grow text-sm outline-none bg-transparent">
                    </div>
                  }
                </div>
              </div>
            </div>

            <div class="space-y-3 mb-10 max-h-[55vh] overflow-y-auto pr-4 custom-scrollbar">
              <label class="text-xs font-black text-slate-400 uppercase tracking-widest block mb-2">{{ t().segmentsLabel }}</label>

              @for (seg of newLesson().segments; track $index) {
                <div class="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 group hover:border-indigo-200 transition-all">
                  <div class="mt-1.5 bg-white w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black text-slate-400 shadow-sm border border-slate-100 flex-shrink-0">
                    {{ $index + 1 }}
                  </div>

                  <div class="flex-grow">
                    @if (seg.type === 'text') {
                      <textarea [(ngModel)]="seg.content"
                                (ngModelChange)="refreshPreview()"
                                rows="1"
                                class="w-full text-sm p-2 rounded-lg border bg-white shadow-sm outline-none focus:ring-2 focus:ring-indigo-500 resize-y min-h-[38px]"
                                [placeholder]="t().addText + '...'"></textarea>
                    }

                    @else if (seg.type === 'gap') {
                      <div class="grid grid-cols-1 lg:grid-cols-2 gap-3">
                        <input [(ngModel)]="seg.answer"
                              (ngModelChange)="refreshPreview()"
                              class="text-sm p-2 rounded-lg border border-indigo-100 font-bold bg-white shadow-sm outline-none focus:ring-2 focus:ring-indigo-500"
                              [placeholder]="t().gapAnswerPlaceholder">

                        <div class="flex gap-2">
                          <input [(ngModel)]="seg.placeholder"
                                (ngModelChange)="refreshPreview()"
                                class="flex-grow text-sm p-2 rounded-lg border bg-white shadow-sm outline-none focus:ring-2 focus:ring-indigo-500"
                                [placeholder]="t().gapHintPlaceholder">

                          <label class="flex items-center px-3 bg-white rounded-lg border text-[9px] font-black text-slate-500 cursor-pointer hover:bg-indigo-50 transition-colors uppercase">
                            <input type="checkbox" [(ngModel)]="seg.isEnding" (ngModelChange)="refreshPreview()" class="mr-2 accent-indigo-600">
                            {{ t().glueLabel }}
                          </label>
                        </div>
                      </div>
                    }

                    @else if (seg.type === 'br') {
                      <div class="h-9 flex items-center justify-center border border-dashed border-amber-200 bg-amber-50/20 rounded-lg">
                        <span class="text-[9px] font-black text-amber-500 uppercase tracking-widest italic">{{ t().addBr }}</span>
                      </div>
                    }
                  </div>

                  <button (click)="removeSegment($index)" class="mt-1 p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                    </svg>
                  </button>
                </div>
              }
            </div>

            <div class="grid grid-cols-3 gap-4">
              <button (click)="addSegment('text')" class="py-4 bg-white border-2 border-dashed border-slate-200 rounded-2xl font-black text-xs text-slate-500 hover:border-indigo-400 hover:text-indigo-600 transition-all uppercase shadow-sm">
                {{ t().addText }}
              </button>
              <button (click)="addSegment('gap')" class="py-4 bg-indigo-50 border-2 border-dashed border-indigo-100 rounded-2xl font-black text-xs text-indigo-600 hover:bg-indigo-100 hover:border-indigo-300 transition-all uppercase shadow-sm">
                {{ t().addGap }}
              </button>
              <button (click)="addSegment('br')" class="py-4 bg-amber-50 border-2 border-dashed border-amber-100 rounded-2xl font-black text-xs text-amber-600 hover:bg-amber-100 hover:border-amber-300 transition-all uppercase shadow-sm">
                {{ t().addBr }}
              </button>
            </div>
          </div>

          <div class="xl:sticky xl:top-28">
            <div class="bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
              <div class="bg-slate-900 px-8 py-4 flex justify-between items-center">
                 <h3 class="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">{{ t().previewLabel }}</h3>
                 <div class="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-[10px] font-black text-indigo-400">WYSIWYG</div>
              </div>

              <div class="p-12 md:p-20 leading-[2.5] text-xl max-h-[75vh] overflow-y-auto custom-scrollbar">
                <div class="mb-12 border-l-4 border-indigo-500 pl-8">
                   <h2 class="text-4xl font-black text-slate-800 mb-4">{{ newLesson().title || t().lessonTitleLabel }}</h2>
                   <p class="text-slate-500 font-medium text-lg leading-relaxed">
                     {{ newLesson().description[uiLangCode()] || '(' + t().descLabel + ')' }}
                   </p>
                </div>

                <div class="block">
                  @for (item of viewSegments(); track $index) {

                    @if (item.type === 'text') {
                      <span class="whitespace-pre-wrap text-slate-800 font-medium">{{ item.segment?.content }}</span>
                    }

                    @else if (item.type === 'gap') {
                      <div class="relative inline-flex align-baseline mx-2">
                        <input type="text" disabled
                          [value]="item.segment?.answer || ''"
                          [placeholder]="item.segment?.placeholder || ''"
                          [style.width.ch]="getInputWidth(item.segment!)"
                          class="transition-all border-2 outline-none font-bold text-slate-900 shadow-sm text-center border-slate-400 bg-slate-50 opacity-60 rounded-md px-3">
                      </div>
                    }

                    @else if (item.type === 'compound') {
                      <span class="whitespace-nowrap inline-flex items-baseline">
                        <span class="whitespace-pre-wrap text-slate-800 font-medium">{{ item.textSegment?.content }}</span>

                        <div class="relative inline-flex align-baseline ml-0 mr-1">
                          <input type="text" disabled
                            [value]="item.gapSegment?.answer || ''"
                            [placeholder]="item.gapSegment?.placeholder || '...'"
                            [style.width.ch]="getInputWidth(item.gapSegment!)"
                            class="transition-all border-2 outline-none font-bold text-slate-900 shadow-sm text-center border-slate-400 bg-slate-50 opacity-60"
                            [ngClass]="{
                              'rounded-md px-3': !item.gapSegment?.isEnding,
                              'rounded-r-md rounded-l-none ml-[1px] px-1 border-l-0': item.gapSegment?.isEnding
                            }">
                        </div>
                      </span>
                    }

                    @else if (item.type === 'br') {
                      <div class="h-10 w-full block"></div>
                    }
                  }
                </div>
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
              <button (click)="copyToClipboard()"
                      class="w-full py-5 bg-slate-800 text-white rounded-2xl font-black text-lg shadow-xl hover:bg-slate-900 active:scale-[0.97] transition-all flex items-center justify-center gap-3 group">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="group-hover:rotate-12 transition-transform">
                  <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
                </svg>
                <span class="truncate">{{ t().copyJson }}</span>
              </button>

              <button (click)="saveLessonAsFile()"
                      class="w-full py-5 bg-indigo-700 text-white rounded-2xl font-black text-lg shadow-2xl hover:bg-indigo-800 active:scale-[0.97] transition-all flex items-center justify-center gap-3 group">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="group-hover:translate-y-1 transition-transform">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/>
                  <line x1="12" x2="12" y1="3" y2="15"/>
                </svg>
                <span class="truncate">{{ t().saveJson }}</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    }  @else {
        <div class="flex flex-wrap gap-4 bg-slate-50 p-3 rounded-lg border border-slate-200 items-center mb-6">
          <div class="flex items-center gap-2">
            <label class="text-xs font-bold uppercase tracking-wider text-slate-500">{{ t().selectLanguage }}:</label>
            <select [ngModel]="selectedLanguage()" (ngModelChange)="selectLanguage($event)" class="bg-white border border-slate-300 py-2 px-3 rounded-md shadow-sm font-bold text-sm outline-none focus:ring-2 focus:ring-indigo-500">
              @for (lang of availableLanguages(); track lang) {
                <option [value]="lang">{{ t().languageNames[lang] || lang }}</option>
              }
            </select>
          </div>

          @if (lessonsForLanguage().length > 0) {
            <div class="flex items-center gap-2">
              <label class="text-xs font-bold uppercase tracking-wider text-slate-500">{{ t().selectLesson }}:</label>
              <select [ngModel]="currentLesson()?.id" (ngModelChange)="onLessonChange($event)" class="bg-white border border-slate-300 py-2 px-3 rounded-md shadow-sm font-bold text-sm outline-none focus:ring-2 focus:ring-indigo-500">
                @for (lesson of lessonsForLanguage(); track lesson.id) {
                  <option [value]="lesson.id">{{ lesson.title }}</option>
                }
              </select>
            </div>
          }
        </div>

        @if (currentLesson(); as lesson) {
          <div class="bg-white rounded-xl shadow-md border border-slate-300 p-6 mb-6">
            <div class="flex justify-between items-start">
              <div>
                <h2 class="text-2xl font-extrabold text-slate-800 mb-2">{{ lesson.title }}</h2>
                <p class="text-slate-600 font-medium">{{ lesson.description[uiLangCode()] || lesson.description['EN'] }}</p>
              </div>
              @if (isChecked()) {
                <div class="text-right bg-slate-50 px-4 py-2 rounded-lg border border-slate-200">
                  <span class="text-xs font-bold uppercase text-slate-500">{{ t().result }}</span>
                  <div class="text-3xl font-black" [ngClass]="getScoreColor()">{{ score() }}%</div>
                </div>
              }
            </div>
            <div class="mt-6 w-full bg-slate-200 rounded-full h-3 overflow-hidden">
              <div class="bg-indigo-600 h-3 rounded-full transition-all duration-500" [style.width.%]="progress()"></div>
            </div>
          </div>

          <div class="bg-white rounded-xl shadow-lg border border-slate-300 p-8 md:p-12 leading-loose text-lg">
            <div class="block">
              @for (item of viewSegments(); track $index) {
                @if (item.type === 'text') {
                  <span class="whitespace-pre-wrap text-slate-800 font-medium">{{ item.segment?.content }}</span>
                }
                @if (item.type === 'gap') {
                  <ng-container *ngTemplateOutlet="inputField; context: { segment: item.segment, index: item.index }"></ng-container>
                }
                @if (item.type === 'compound') {
                  <span class="whitespace-nowrap inline-flex items-baseline">
                    <span class="whitespace-pre-wrap text-slate-800 font-medium">{{ item.textSegment?.content }}</span>
                    <ng-container *ngTemplateOutlet="inputField; context: { segment: item.gapSegment, index: item.gapIndex }"></ng-container>
                  </span>
                }
              }
            </div>
          </div>

          <div class="mt-8 flex justify-end gap-4">
            <button (click)="reset()" class="px-6 py-3 rounded-lg font-bold text-slate-700 bg-white border-2 border-slate-300 hover:bg-slate-50 transition-colors">{{ t().reset }}</button>
            @if (!isChecked()) {
              <button (click)="checkAnswers()" class="px-10 py-3 rounded-lg font-bold text-white shadow-lg bg-indigo-700 hover:bg-indigo-800 transition-all">{{ t().check }}</button>
            } @else {
              <button (click)="reset()" class="px-10 py-3 rounded-lg font-bold text-white shadow-lg bg-indigo-700 hover:bg-indigo-800 transition-all">{{ t().retry }}</button>
            }
          </div>
        }
    }
    </main>
  }
</div>

<ng-template #inputField let-segment="segment" let-i="index">
  <div class="relative inline-flex group align-baseline" [ngClass]="{'mx-2': !segment.isEnding, 'ml-0 mr-1': segment.isEnding}">
    <input
      type="text"
      [(ngModel)]="userAnswers[i]"
      (ngModelChange)="updateProgress()"
      [disabled]="isChecked()"
      [placeholder]="segment.placeholder || ''"
      [style.width.ch]="getInputWidth(segment)"
      class="transition-all border-2 outline-none font-bold text-slate-900 shadow-sm text-center"
      [ngClass]="{
        'rounded-md px-3': !segment.isEnding,
        'rounded-r-md rounded-l-none ml-[1px] px-1': segment.isEnding,
        'bg-white border-slate-400 hover:border-slate-500': !isChecked(),
        'border-green-600 bg-green-50 text-green-800': isChecked() && isCorrect(i),
        'border-red-500 bg-red-50 text-red-800 line-through decoration-red-500 decoration-2': isChecked() && !isCorrect(i)
      }"
      autocomplete="off">

    @if (isChecked() && !isCorrect(i)) {
      <div class="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-slate-900 text-white text-sm font-bold py-1.5 px-3 rounded shadow-xl whitespace-nowrap z-20 animate-bounce-in border border-slate-700">
        {{ segment.answer }}
        <div class="absolute bottom-[-6px] left-1/2 transform -translate-x-1/2 w-3 h-3 bg-slate-900 rotate-45 border-r border-b border-slate-700"></div>
      </div>
    }

    @if (isChecked()) {
      <span class="absolute -top-3 bg-white rounded-full shadow-sm border border-slate-200 p-0.5 z-10" [ngClass]="segment.isEnding ? '-right-2 scale-75' : '-right-3'">
        @if (isCorrect(i)) {
          <svg class="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>
        } @else {
          <svg class="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
        }
      </span>
    }
  </div>
</ng-template>
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
  isAdminMode = signal(false);
  isLoading = signal<boolean>(true);
  hasError = signal<boolean>(false);
  allLessons = signal<Lesson[]>([]);

  selectedLanguage = signal<string>('EN'); // Default
  currentLesson = signal<Lesson | null>(null);
  userAnswers: { [key: number]: string } = {};
  isChecked = signal(false);

  newLesson = signal<Lesson>({
    id: crypto.randomUUID(),
    language: 'EN',
    title: '',
    description: { 'DE': '', 'EN': '', 'ES': '', 'FR': '', 'ZH': '' },
    segments: []
  });

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
    const source = this.isAdminMode() ? this.newLesson() : this.currentLesson();

    return this.transformToViewItems(source);
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

  refreshPreview() {
    this.newLesson.update(lesson => ({ ...lesson }));
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

  transformToViewItems(lesson: Lesson | null): ViewItem[] {
    if (!lesson) return [];
    const segments = lesson.segments;
    const items: ViewItem[] = [];

    for (let i = 0; i < segments.length; i++) {
      const current = segments[i];
      const next = segments[i + 1];

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
          type: current.type === 'gap' ? 'gap' : (current.type === 'br' ? 'br' : 'text'),
          segment: current,
          index: i
        });
      }
    }
    return items;
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

  toggleAdminMode() {
    this.isAdminMode.update(v => !v);
  }

  addSegment(type: SegmentType) {
    this.newLesson.update(lesson => {
      const newSegment: Segment = { type };

      if (type === 'text') {
        newSegment.content = '';
      }
      else if (type === 'gap') {
        newSegment.answer = '';
        newSegment.placeholder = '';
        newSegment.isEnding = false;
      }

      return {
        ...lesson,
        segments: [...lesson.segments, newSegment]
      };
    });
  }
  removeSegment(index: number) {
    this.newLesson.update(lesson => ({
      ...lesson,
      segments: lesson.segments.filter((_, i) => i !== index)
    }));
  }

  clearEditor() {
    const message = 'Möchtest du wirklich alle Eingaben löschen? Diese Aktion kann nicht rückgängig gemacht werden.';

    if (window.confirm(message)) {
      this.newLesson.set({
        id: crypto.randomUUID(),
        language: 'EN',
        title: '',
        description: { 'DE': '', 'EN': '', 'ES': '', 'FR': '', 'ZH': '' },
        segments: []
      });
    }
  }
  copyToClipboard() {
    const lessonData = this.newLesson();

    if (!lessonData.title.trim()) {
      lessonData.title = 'Untitled';
    }

    const jsonString = JSON.stringify(lessonData, null, 2);

    navigator.clipboard.writeText(jsonString);
  }

  saveLessonAsFile() {
    const lessonData = this.newLesson();
    const fileName = `${lessonData.title || 'lesson'}.json`;

    const blob = new Blob([JSON.stringify(lessonData, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement('a');

    link.href = url;
    link.download = fileName;
    link.click();

    window.URL.revokeObjectURL(url);
  }
}
