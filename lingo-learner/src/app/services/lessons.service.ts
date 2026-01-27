import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Lesson } from "../model/lingo-learner";
import { AppSettingsService } from "./app-settings.service";

@Injectable({
  providedIn: 'root'
})
export class LessonService {

  private readonly http = inject(HttpClient);
  private readonly settings = inject(AppSettingsService).getAppSettings();

  private dataUrl = 'assets/lessons.json';

  getLessons(): Observable<Lesson[]> {
    return this.http.get<Lesson[]>(this.dataUrl);
  }
}
