import { Component } from '@angular/core';
import AOS from 'aos';
import 'aos/dist/aos.css';
AOS.init();


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
