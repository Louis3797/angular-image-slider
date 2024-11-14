import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ImageSliderComponent } from './image-slider/image-slider.component';
import { ImageCardComponent } from './image-card/image-card.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ImageSliderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'Hello';
  images: { url: string }[] = [];

  ngOnInit(): void {
    this.loadImages();

    this.images[0].url = 'https://picsum.photos/500/300?random=${i + 1}';
  }

  loadImages(): void {
    // Load 10 random images from Picsum
    this.images = Array.from({ length: 5 }, (_, i) => ({
      url: `https://picsum.photos/500/300?random=${i + 1}`,
    }));
  }
}
