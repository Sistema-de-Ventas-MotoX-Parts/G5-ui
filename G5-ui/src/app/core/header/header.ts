import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,

  template: `
    <header class="bg-black text-yellow-400 p-4 shadow-lg">

      <h1 class="text-3xl font-bold">
        MotoX Parts
      </h1>

    </header>
  `
})
export class HeaderComponent {}