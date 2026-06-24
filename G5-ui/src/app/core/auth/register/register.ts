import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.html'
})
export class RegisterComponent {

  @Output() irALogin = new EventEmitter<void>();

  nombre = '';
  email = '';
  contrasenia = '';
  
  mensajeError = ''; 

  constructor(private authService: AuthService) {}

  registrar() {
    this.mensajeError = ''; 

    // 1. VALIDACIÓN: Campos vacíos
    if (!this.nombre.trim() || !this.email.trim() || !this.contrasenia.trim()) {
      this.mensajeError = 'Por favor, completa todos los campos.';
      return;
    }

    // 2. VALIDACIÓN: Formato de Email (Expresión regular estándar)
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(this.email)) {
      this.mensajeError = 'El correo electrónico no está bien escrito (ejemplo: usuario@correo.com).';
      return;
    }

    // 3. VALIDACIÓN: Mínimo de caracteres de la contraseña
    if (this.contrasenia.length < 6) {
      this.mensajeError = 'La contraseña debe tener un mínimo de 6 caracteres.';
      return;
    }

    // Si pasa todas las validaciones del frontend, recién ahí se envía al backend
    this.authService.register({
      nombre: this.nombre,
      email: this.email,
      contrasenia: this.contrasenia
    }).subscribe({
      next: () => {
        alert('¡Usuario registrado con éxito!');
        this.nombre = '';
        this.email = '';
        this.contrasenia = '';
      },
      error: (err) => {
        console.error("Error capturado:", err);

        // Si el backend llega a rechazar por otra cosa (ej: email ya duplicado en BD)
        if (err.error) {
          if (typeof err.error === 'object') {
            if (err.error.email) {
              this.mensajeError = err.error.email;
            } else if (err.error.contrasenia) {
              this.mensajeError = err.error.contrasenia;
            } else if (err.error.nombre) {
              this.mensajeError = err.error.nombre;
            } else {
              const primergError = Object.values(err.error)[0];
              this.mensajeError = String(primergError);
            }
          } else if (typeof err.error === 'string') {
            this.mensajeError = err.error;
          }
        } else {
          this.mensajeError = 'Ocurrió un error inesperado en el servidor.';
        }
      }
    });
  }
}