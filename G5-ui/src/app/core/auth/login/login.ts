import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './login.html'
})
export class LoginComponent {

  email = '';
  contrasenia = '';
  
  // Variables de control de la UI
  error = '';
  mensajeExito = '';
  mostrarPassword = false; // <--- Soluciona el error de la contraseña
  cargando = false;         // <--- Soluciona el error del botón ingresar

  @Output() onLoginSuccess = new EventEmitter<void>();
  @Output() irARegistro = new EventEmitter<void>();

  constructor(private authService: AuthService) {}

  login() {
    // Validar campos vacíos antes de enviar (opcional pero recomendado)
    if (!this.email || !this.contrasenia) {
      this.error = 'Por favor, completa todos los campos.';
      return;
    }

    this.cargando = true; // Activa el spinner y deshabilita el botón
    this.error = '';
    this.mensajeExito = '';

    this.authService.login({
      email: this.email,
      contrasenia: this.contrasenia
    }).subscribe({
      next: (response: any) => {
        console.log("RESPUESTA LOGIN:", response);
        
        this.authService.guardarSesion(response);
        const usuario = this.authService.obtenerSesion();

        // Asignamos el mensaje en lugar del alert
        if (usuario.rol === 'ADMIN') {
          this.mensajeExito = '¡Bienvenido Administrador!';
        } else {
          this.mensajeExito = '¡Bienvenido Usuario!';
        }

        this.cargando = false; // Apaga el cargando

        // Espera 1.5 segundos para que vean el mensaje antes de redirigir
        setTimeout(() => {
          this.onLoginSuccess.emit();
        }, 1500); 
      },
      error: (err) => {
        console.log(err);
        this.cargando = false; // Apaga el cargando si hay error
        // Usamos el mensaje de error que viene del backend para ser más específicos.
        // Si no viene un mensaje, mostramos uno genérico.
        this.error =
          err.error?.message ||
          'Error de autenticación. Verificá tus datos.';
      }
    });
  }
}