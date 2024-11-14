import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import {
  Component,
  Input,
  HostListener,
  OnInit,
  NgModule,
  ElementRef,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { ImageCardComponent } from '../image-card/image-card.component';

interface Slide {
  image: string;
  alt: string;
}

interface BreakpointConfig {
  slidesPerView: number;
  spaceBetween: number;
}

@Component({
  selector: 'app-image-slider',
  templateUrl: './image-slider.component.html',
  styleUrls: ['./image-slider.component.scss'],
  standalone: true,
  imports: [CommonModule, MatIconModule, ImageCardComponent],
})
export class ImageSliderComponent implements OnInit {
  @Input() items: { url: string }[] = [];
  @Input() animationSpeed: number = 300;
  @Input() showNavigation: boolean = true;
  @Input() showPagination: boolean = true;
  @Input() breakpoints: { [width: number]: BreakpointConfig } = {};

  @ViewChild('slider') slider!: ElementRef<HTMLDivElement>;
  @ViewChild('slide') slide!: ElementRef<HTMLDivElement>;

  currentIndex: number = 0;
  visibleSlides: number = 1;
  spaceBetween: number = 0;
  totalPages: number = 0;
  slideWidth: number = 100;

  ngOnInit() {
    this.updateVisibleSlides();
  }

  @HostListener('window:resize')
  onResize() {
    this.updateVisibleSlides();
  }

  updateVisibleSlides() {
    const width = window.innerWidth;
    for (const [breakpoint, config] of Object.entries(this.breakpoints)) {
      if (width >= Math.abs(Number(breakpoint))) {
        this.visibleSlides = config.slidesPerView;
        this.spaceBetween = config.spaceBetween;
      }
    }

    this.visibleSlides = Math.min(this.visibleSlides, this.items.length);

    if (this.visibleSlides === 1) {
      this.totalPages = this.items.length;
    } else if (this.visibleSlides < this.items.length) {
      this.totalPages =
        Math.ceil(this.items.length / Math.floor(this.visibleSlides)) + 1;
    } else {
      this.totalPages = 1;
      this.showNavigation = false;
    }

    this.slideWidth = Math.ceil(
      100 / this.visibleSlides - this.spaceBetween / 10
    );

    this.updateSliderPosition();
  }

  nextSlide() {
    if (this.currentIndex < this.totalPages - 1) {
      this.currentIndex++;
    }
    this.updateSliderPosition();
  }

  prevSlide() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    }
    this.updateSliderPosition();
  }

  updateSliderPosition() {
    const slideWidth = Number(
      this.slide.nativeElement.getBoundingClientRect().width
    );

    const offset = -this.currentIndex * (slideWidth + this.spaceBetween);

    this.slider.nativeElement.style.transform = `translateX(${offset}px)`;
  }

  getPaginationDotsCount(): number {
    return Math.ceil(this.items.length / this.visibleSlides);
  }

  isActiveDot(index: number): boolean {
    return index === Math.floor(this.currentIndex / this.visibleSlides);
  }

  goToSlide(index: number) {
    this.currentIndex = index * this.visibleSlides;
  }
}
