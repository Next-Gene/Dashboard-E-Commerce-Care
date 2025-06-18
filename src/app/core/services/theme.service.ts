import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private darkModeSubject = new BehaviorSubject<boolean>(false);
  darkMode$ = this.darkModeSubject.asObservable();

  constructor() {
    this.loadThemeFromStorage();
  }

  toggleDarkMode(): void {
    const newValue = !this.darkModeSubject.value;
    this.darkModeSubject.next(newValue);
    this.updateHtmlClass();        
    this.saveThemeToStorage();    
  }

  private updateHtmlClass(): void {
    const html = document.documentElement; // 🎯 Target <html>
    if (this.darkModeSubject.value) {
      html.classList.add('dark'); // 🌚 Add dark class
    } else {
      html.classList.remove('dark'); // 🌞 Remove dark class
    }
  }

  private saveThemeToStorage(): void {
    localStorage.setItem('theme', this.darkModeSubject.value ? 'dark' : 'light');
    // 💾 Save "dark" or "light" string
  }

  private loadThemeFromStorage(): void {
    const storedTheme = localStorage.getItem('theme');
    const isDark = storedTheme === 'dark';
    this.darkModeSubject.next(isDark);
    this.updateHtmlClass(); // 🎨 Make sure the correct class is applied on load
  }
}
