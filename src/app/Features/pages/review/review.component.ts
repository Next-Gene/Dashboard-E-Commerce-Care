import { Component } from '@angular/core';
import { Review } from '../../../core/interfaces/review';
import { CommonModule } from '@angular/common';
import { ReviewService } from '../../../core/services/review.service';

@Component({
  selector: 'app-review',
  imports: [CommonModule],
  templateUrl: './review.component.html',
  styleUrl: './review.component.scss'
})
export class ReviewComponent {
reviews: Review[] = [];
constructor(private reviewService: ReviewService) {}

  ngOnInit(): void {
    this.reviewService.getReviews().subscribe(data => {
      this.reviews = data;
    });
  }
}
