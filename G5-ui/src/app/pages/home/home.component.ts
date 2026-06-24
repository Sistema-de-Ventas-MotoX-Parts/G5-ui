import {
  Component, OnInit, ChangeDetectorRef, inject,
  EventEmitter, Output, signal, PLATFORM_ID
} from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/products';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;600;700&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    .home-wrapper {
      background: #000;
      min-height: 100vh;
      font-family: 'Oswald', sans-serif;
      color: #fff;
    }

    /* ── NAVEGACIÓN ── */
    .home-nav {
      background: #0a0a0a;
      padding: 1rem 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 2px solid #FACC15;
      position: sticky;
      top: 0;
      z-index: 100;
    }
    .nav-brand { font-size: 1.4rem; font-weight: 700; color: #fff; letter-spacing: 2px; text-transform: uppercase; }
    .nav-brand span { color: #FACC15; }
    .nav-auth-links { display: flex; align-items: center; gap: 1rem; }
    .btn-nav-login {
      border: 1px solid #FACC15;
      color: #FACC15;
      padding: .35rem .9rem;
      border-radius: 5px;
      cursor: pointer;
      font-family: 'Oswald', sans-serif;
      font-size: .8rem;
      font-weight: 600;
      letter-spacing: 1px;
      text-transform: uppercase;
      background: transparent;
      transition: all .2s;
    }
    .btn-nav-login:hover { background: #FACC15; color: #000; }
    .btn-nav-reg {
      background: none; border: none; color: #aaa; cursor: pointer;
      font-family: 'Oswald', sans-serif; font-size: .8rem; font-weight: 600;
      letter-spacing: 1px; text-transform: uppercase; transition: color .15s;
    }
    .btn-nav-reg:hover { color: #fff; }

    /* ── HERO ── */
    .hero-section {
      background: linear-gradient(rgba(0,0,0,0.5), #000),
        url('https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?q=80&w=1200')
        no-repeat center center/cover;
      height: 420px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;
      padding: 0 1.5rem;
    }
    .hero-title {
      font-size: 3.2rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 3px;
      text-shadow: 0 4px 16px rgba(0,0,0,0.8);
      line-height: 1.1;
    }
    .hero-title span { color: #FACC15; }
    .hero-subtitle { color: #aaa; margin-top: .75rem; font-family: system-ui, sans-serif; font-size: .95rem; letter-spacing: .5px; }

    /* ── CONTENEDOR CENTRAL ── */
    .home-container { max-width: 1100px; margin: 0 auto; padding: 4rem 1.5rem; }

    .section-title {
      font-size: 1.7rem; font-weight: 700; text-transform: uppercase;
      letter-spacing: .5px; border-bottom: 1px solid #1f1f1f;
      padding-bottom: .5rem; margin-bottom: 1rem;
    }
    .section-title span { color: #FACC15; }
    .section-subtitle { color: #555; font-size: .8rem; text-transform: uppercase; letter-spacing: 1px; font-family: system-ui, sans-serif; }
    .text-content { color: #888; font-size: .92rem; line-height: 1.7; font-family: system-ui, sans-serif; }

    /* ── QUIÉNES SOMOS ── */
    .quienes-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 3rem;
      align-items: start;
      margin-bottom: 5rem;
    }
    @media (max-width: 768px) { .quienes-grid { grid-template-columns: 1fr; gap: 2rem; } }

    .quienes-img {
      width: 100%; border-radius: 12px; height: 320px;
      object-fit: cover; border: 1px solid #1f1f1f;
    }

    .highlight-box {
      background: #111; border: 1px solid #1f1f1f;
      border-radius: 12px; padding: 1.5rem;
      display: grid; grid-template-columns: 1fr 1fr;
      gap: 1rem; margin-top: 1.25rem;
    }
    .stat-item {
      text-align: center; padding: .75rem;
      background: #0a0a0a; border-radius: 8px; border: 1px solid #1a1a1a;
    }
    .stat-num { display: block; font-size: 1.8rem; font-weight: 700; color: #FACC15; }
    .stat-lbl { font-size: .7rem; color: #555; text-transform: uppercase; letter-spacing: 1px; font-family: system-ui, sans-serif; }

    /* ── CARRUSEL ── */
    .carousel-section { margin-bottom: 5rem; }
    .carousel-wrapper { position: relative; overflow: hidden; border-radius: 12px; margin-top: 1.5rem; }
    .carousel-track {
      display: flex;
      transition: transform 0.45s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .carousel-slide { min-width: 33.333%; padding: 0 .5rem; flex-shrink: 0; }

    .prod-card {
      background: #111; border: 1px solid #1f1f1f;
      border-radius: 12px; overflow: hidden; transition: all .2s;
    }
    .prod-card:hover { border-color: #FACC15; transform: translateY(-3px); }
    .prod-img { width: 100%; height: 180px; object-fit: cover; background: #161616; display: block; }
    .prod-body { padding: 1rem; }
    .prod-name { font-size: 1rem; font-weight: 600; color: #fff; }
    .prod-cat { font-size: .7rem; color: #FACC15; text-transform: uppercase; letter-spacing: 1.5px; margin-top: .25rem; font-family: system-ui, sans-serif; }

    .carousel-controls { display: flex; justify-content: center; align-items: center; gap: .75rem; margin-top: 1.25rem; }
    .cbtn {
      background: #111; border: 1px solid #333; color: #fff;
      width: 38px; height: 38px; border-radius: 50%;
      font-size: 1.2rem; cursor: pointer; transition: all .2s;
      display: flex; align-items: center; justify-content: center;
      font-family: monospace;
    }
    .cbtn:hover { border-color: #FACC15; color: #FACC15; }
    .dots { display: flex; gap: .4rem; align-items: center; }
    .dot {
      width: 6px; height: 6px; border-radius: 50%;
      background: #333; cursor: pointer; transition: all .2s;
    }
    .dot.active { background: #FACC15; width: 20px; border-radius: 3px; }

    /* ── CONTACTO ── */
    .contact-section { }
    .contact-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1rem; margin-top: 1.5rem;
    }
    @media (max-width: 768px) { .contact-grid { grid-template-columns: 1fr; } }

    .contact-card {
      background: #111; border: 1px solid #1f1f1f;
      border-radius: 12px; padding: 1.5rem;
      display: flex; flex-direction: column;
      align-items: flex-start; gap: .5rem;
      transition: border-color .2s;
    }
    .contact-card:hover { border-color: #FACC15; }
    .contact-icon { font-size: 1.8rem; color: #FACC15; }
    .contact-label { font-size: .7rem; color: #555; text-transform: uppercase; letter-spacing: 1.5px; font-family: system-ui, sans-serif; }
    .contact-value { font-size: .9rem; color: #ddd; font-family: system-ui, sans-serif; line-height: 1.6; }

    .btn-maps {
      background: transparent; border: 1px solid #FACC15;
      color: #FACC15; padding: .5rem 1.1rem;
      border-radius: 6px; font-family: 'Oswald', sans-serif;
      font-size: .75rem; font-weight: 700; text-transform: uppercase;
      letter-spacing: .5px; cursor: pointer; margin-top: .5rem;
      transition: all .2s; display: flex; align-items: center; gap: .4rem;
    }
    .btn-maps:hover { background: #FACC15; color: #000; }

    /* ── FOOTER ── */
    .home-footer {
      background: #0a0a0a; border-top: 1px solid #1f1f1f;
      padding: 2rem; text-align: center;
      color: #333; font-size: .75rem;
      text-transform: uppercase; letter-spacing: 1px;
    }

    /* EMPTY STATE */
    .empty-carousel { border: 1px dashed #222; border-radius: 10px; padding: 3rem 1rem; text-align: center; }
    .empty-carousel p { color: #444; }
  `],
  template: `
    <div class="home-wrapper">

      <!-- NAV -->
      <nav class="home-nav">
        <h2 class="nav-brand">Moto<span>X</span> Center</h2>
        <div class="nav-auth-links">
          <button class="btn-nav-login" (click)="irA('login')">Iniciar sesión</button>
          <button class="btn-nav-reg" (click)="irA('register')">Registrarse</button>
        </div>
      </nav>

      <!-- HERO -->
      <header class="hero-section">
        <h1 class="hero-title">Taller &amp; Repuestos <span>MotoX</span></h1>
        <p class="hero-subtitle">Mantenimiento profesional de alta cilindrada · Catálogo de insumos premium</p>
      </header>

      <main class="home-container">

        <!-- 1. QUIÉNES SOMOS -->
        <section class="quienes-grid">
          <div>
            <h3 class="section-title">Quiénes <span>Somos</span></h3>
            <p class="text-content">
              En <strong style="color:#fff">MotoX Center</strong> nos apasiona el rendimiento sobre dos ruedas.
              Somos un taller especializado en la reparación, potenciación y mantenimiento integral de motocicletas,
              respaldado por un equipo de mecánicos profesionales certificados con más de 15 años en el rubro.
            </p>
            <p class="text-content" style="margin-top:.9rem">
              Combinamos diagnóstico computarizado avanzado con un stock permanente de repuestos originales
              de las mejores marcas del mercado para garantizar que tu moto vuelva a las pistas en su mejor estado técnico.
            </p>
            <div class="highlight-box">
              <div class="stat-item">
                <span class="stat-num">Clientes satisfecho</span>
              </div>
              <div class="stat-item">
                <span class="stat-num">15+</span>
                <span class="stat-lbl">Años de experiencia</span>
              </div>

              
             </div>
          </div>
          <div>
            <img
              class="quienes-img"
              src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=600"
              alt="Mecánicos del taller MotoX Center"
            >
          </div>
        </section>

        <!-- 2. CATÁLOGO - CARRUSEL -->
        <section class="carousel-section">
          <h3 class="section-title">Nuestro <span>Catálogo de Repuestos</span></h3>
          <p class="section-subtitle">Insumos mecánicos y accesorios premium disponibles para reserva</p>

          <ng-container *ngIf="destacados().length > 0; else emptyCarousel">
            <div class="carousel-wrapper"
              (mouseenter)="pauseAuto()"
              (mouseleave)="resumeAuto()">
              <div class="carousel-track" [style.transform]="'translateX(-' + (carouselIdx * (100 / visibles)) + '%)'">
                <div class="carousel-slide" *ngFor="let prod of destacados()">
                  <div class="prod-card">
                    <img
                      class="prod-img"
                      [src]="prod.imagenUrl || 'https://via.placeholder.com/400x180/111111/FACC15?text=MotoX'"
                      [alt]="prod.nombre"
                    >
                    <div class="prod-body">
                      <p class="prod-name">{{ prod.nombre }}</p>
                      <p class="prod-cat">{{ prod.categoria || 'Repuesto' }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="carousel-controls">
              <button class="cbtn" (click)="carouselPrev()">&#8249;</button>
              <div class="dots">
                <div
                  *ngFor="let d of carouselDots(); let i = index"
                  class="dot"
                  [class.active]="i === carouselIdx"
                  (click)="goTo(i)"
                ></div>
              </div>
              <button class="cbtn" (click)="carouselNext()">&#8250;</button>
            </div>
          </ng-container>
          <ng-template #emptyCarousel>
            <div class="empty-carousel">
              <p>Cargando repuestos de la base de datos...</p>
            </div>
          </ng-template>
        </section>

        <!-- 3. CONTACTO -->
        <section class="contact-section">
          <h3 class="section-title">Ubicación &amp; <span>Contacto</span></h3>
          <div class="contact-grid">

            <div class="contact-card">
              <span class="contact-icon">📍</span>
              <span class="contact-label">Dirección del taller</span>
              <span class="contact-value">Av. Néstor Kirchner 4250<br>Formosa, Argentina</span>
              <button class="btn-maps" (click)="abrirGoogleMaps()">
                🌐 Ver en Google Maps
              </button>
            </div>

            <div class="contact-card">
              <span class="contact-icon">📞</span>
              <span class="contact-label">Teléfono de atención</span>
              <span class="contact-value">+54 370 412-3456</span>
              <span class="contact-label" style="margin-top:.4rem">WhatsApp disponible</span>
            </div>

            <div class="contact-card">
              <span class="contact-icon">⏰</span>
              <span class="contact-label">Horarios de apertura</span>
              <span class="contact-value">Lun – Vie: 08:00 – 12:30 / 16:00 – 20:00</span>
              <span class="contact-value" style="margin-top:.35rem">Sábados: 08:30 – 13:00</span>
            </div>

          </div>
        </section>

      </main>

      <footer class="home-footer">
        © 2026 MotoX Center Taller Mecánico · Todos los derechos reservados
      </footer>

    </div>
  `
})
export class HomeComponent implements OnInit {
  destacados = signal<Product[]>([]);

  @Output() navegar = new EventEmitter<string>();

  private productService = inject(ProductService);
  private cdr = inject(ChangeDetectorRef);
  private platformId = inject(PLATFORM_ID);

  // ── Carrusel ──
  readonly visibles = 3;
  carouselIdx = 0;
  private autoTimer: any;

  ngOnInit() {
    this.cargarProductosDestacados();
  }

  cargarProductosDestacados() {
    this.productService.getProducts().subscribe({
      next: (data: Product[]) => {
        this.destacados.set(data.slice(0, 9));
        this.cdr.detectChanges();
        this.startAuto();
      },
      error: (err: any) => console.error('Error cargando catálogo público:', err)
    });
  }

  // Genera el array de dots según cuántos pasos hay
  carouselDots(): number[] {
    const max = Math.max(0, this.destacados().length - this.visibles);
    return Array.from({ length: max + 1 });
  }

  carouselNext() {
    const max = this.destacados().length - this.visibles;
    this.carouselIdx = this.carouselIdx >= max ? 0 : this.carouselIdx + 1;
  }

  carouselPrev() {
    const max = this.destacados().length - this.visibles;
    this.carouselIdx = this.carouselIdx <= 0 ? max : this.carouselIdx - 1;
  }

  goTo(idx: number) { this.carouselIdx = idx; }

  startAuto() {
    if (!isPlatformBrowser(this.platformId)) return;
    this.autoTimer = setInterval(() => this.carouselNext(), 3500);
  }
  pauseAuto()  { clearInterval(this.autoTimer); }
  resumeAuto() { this.startAuto(); }

  abrirGoogleMaps() {
    window.open('https://maps.google.com/?q=Av.+Néstor+Kirchner+4250,+Formosa,+Argentina', '_blank');
  }

  irA(ruta: string) {
    this.navegar.emit(ruta);
  }
}
