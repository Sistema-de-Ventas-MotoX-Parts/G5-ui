import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,

  styles: [`
    header {
      background: #000;
      border-bottom: 2px solid #FACC15;
      padding: .9rem 1.75rem;
      display: flex;
      align-items: center;
      gap: .75rem;
    }

    .logo-icon {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      object-fit: cover;
      border: 1px solid #444;
      background: #111;
      flex-shrink: 0;
    }

    .logo-text {
      font-size: 1.25rem;
      font-weight: 800;
      color: #fff;
      letter-spacing: .5px;
      font-family: system-ui, sans-serif;
    }

    .logo-text span {
      color: #FACC15;
    }

    .tagline {
      margin-left: auto;
      font-size: .7rem;
      font-weight: 500;
      color: #555;
      letter-spacing: 1px;
      text-transform: uppercase;
    }
  `],

  template: `
    <header>
      <img src="assets/img/image.png" alt="MotoX parts logo" class="logo-icon">
      <span class="logo-text">Moto<span>X</span> Parts</span>
      <span class="tagline">Panel de administración</span>
    </header>
  `
})
export class HeaderComponent {}