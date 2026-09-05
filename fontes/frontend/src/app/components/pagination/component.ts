import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './template.html',
  styleUrls: ['./styles.css']
})
export class PaginationComponent {
  @Input() currentPage: number = 1;
  @Input() totalPages: number = 1;
  @Output() pageChange = new EventEmitter<number>();

  get pages(): (number | string)[] {
    const p = [];
    if (this.totalPages <= 7) {
      for (let i = 1; i <= this.totalPages; i++) { p.push(i); }
    } else {
      if (this.currentPage <= 3) {
         p.push(1, 2, 3, '...', this.totalPages - 1, this.totalPages);
      } else if (this.currentPage >= this.totalPages - 2) {
         p.push(1, 2, '...', this.totalPages - 2, this.totalPages - 1, this.totalPages);
      } else {
         p.push(1, '...', this.currentPage, '...', this.totalPages);
      }
    }
    return p;
  }

  goToPage(page: number | string) {
    if (typeof page === 'number') {
      this.pageChange.emit(page);
    }
  }

  prev() {
    if (this.currentPage > 1) {
      this.pageChange.emit(this.currentPage - 1);
    }
  }

  next() {
    if (this.currentPage < this.totalPages) {
      this.pageChange.emit(this.currentPage + 1);
    }
  }
}
