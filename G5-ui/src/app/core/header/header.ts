import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true, 

  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&display=swap');

    header {
      background: #0a0a0a;
      border-bottom: 2px solid #FACC15;
      padding: .9rem 1.75rem;
      display: flex;
      align-items: center;
      gap: .85rem;
      font-family: 'Oswald', system-ui, sans-serif;
    }

    .logo-icon {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      object-fit: cover;
      border: 2px solid #FACC15;
      background: #1a1a1a;
      flex-shrink: 0;
    }

    .logo-info {
      display: flex;
      flex-direction: column;
      line-height: 1.1;
    }

    .logo-text {
      font-size: 1.35rem;
      font-weight: 700;
      color: #fff;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      font-family: 'Oswald', sans-serif;
    }

    .logo-text span {
      color: #FACC15;
    }

    .tagline {
      font-size: .62rem;
      font-weight: 400;
      color: #6B7280;
      letter-spacing: 2px;
      text-transform: uppercase;
    }

    .spacer {
      margin-left: auto;
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .user-badge {
      display: flex;
      align-items: center;
      gap: .5rem;
      padding: .4rem .85rem;
      border-radius: 6px;
      background: #1a1a1a;
      border: 1px solid #333;
    }

    .status-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #22c55e;
    }

    .user-label {
      font-size: .72rem;
      font-weight: 500;
      color: #9CA3AF;
      letter-spacing: 1px;
      text-transform: uppercase;
      font-family: 'Oswald', sans-serif;
    }

    .btn-logout {
      display: flex;
      align-items: center;
      gap: .45rem;
      padding: .45rem 1rem;
      border-radius: 6px;
      background: transparent;
      border: 1.5px solid #FACC15;
      color: #FACC15;
      font-family: 'Oswald', sans-serif;
      font-size: .8rem;
      font-weight: 600;
      letter-spacing: 1px;
      text-transform: uppercase;
      cursor: pointer;
      transition: background .15s;
    }

    .btn-logout:hover {
      background: rgba(250, 204, 21, 0.08);
    }

    .btn-logout svg {
      width: 16px;
      height: 16px;
      stroke: #FACC15;
    }
  `],

  template: `
    <header>
      <img src="assets/img/image.png" alt="MotoX parts logo" class="logo-icon">

      <div class="logo-info">
        <span class="logo-text">MOTO<span>X</span> PARTS</span>
        <span class="tagline">Panel de administración</span>
      </div>

      <div class="spacer">
        <div class="user-badge">
          <span class="status-dot"></span>
          <span class="user-label">Admin</span>
        </div>

        <button class="btn-logout" (click)="logout()">
          <svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          Cerrar sesión
        </button>
      </div>
    </header>
  `
})
//VERRRRRRRRRRRRRRRRRRRRRRRRR NO FUNCIONA LA RUTA DE LOGIN
export class HeaderComponent {

  constructor(private authService: AuthService) {}

  logout() {
    this.authService.logout();
    window.location.reload();
  }
}