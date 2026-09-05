import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RatingComponent } from '../rating/component';
import { ArticleCardAction } from '../../shared/types/article';

@Component({
  selector: 'app-article-card',
  standalone: true,
  imports: [CommonModule, FormsModule, RatingComponent],
  templateUrl: './template.html',
  styleUrls: ['./styles.css']
})
export class ArticleCardComponent {
  @Input() imageUrl: string = '';
  @Input() title: string = '';
  @Input() timeText: string = '';
  @Input() author: string = '';
  @Input() category: string = '';
  @Input() categoryIcon: string = '';
  @Input() rating: number = 0;
  @Input() actions: ArticleCardAction[] = [];
  @Output() actionClick = new EventEmitter<ArticleCardAction>();
  @Output() cardClick = new EventEmitter<void>();
  @Output() authorClick = new EventEmitter<void>();

  onCardClick() {
    this.cardClick.emit();
  }

  onAuthorClick(event: Event) {
    event.stopPropagation();
    this.authorClick.emit();
  }

  isActionsMenuOpen = false;

  @HostListener('document:click')
  onDocumentClick() {
    this.isActionsMenuOpen = false;
  }

  toggleActionsMenu(event: Event) {
    event.stopPropagation();
    this.isActionsMenuOpen = !this.isActionsMenuOpen;
  }

  onActionsMenuClick(event: Event) {
    event.stopPropagation();
  }

  onActionSelect(action: ArticleCardAction, event: Event) {
    event.stopPropagation();
    if (action.disabled) {
      return;
    }
    this.actionClick.emit(action);
    this.isActionsMenuOpen = false;
  }
}
