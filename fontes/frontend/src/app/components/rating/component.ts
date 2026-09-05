import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-rating',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './template.html',
  styleUrls: ['./styles.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RatingComponent),
      multi: true
    }
  ]
})
export class RatingComponent implements ControlValueAccessor {
  @Input() maxStars: number = 5;
  @Input() readonly: boolean = false;
  
  rating: number = 0;
  hoverVal: number = 0;

  get starsArray() {
    return Array(this.maxStars).fill(0).map((x, i) => i + 1);
  }

  onChange: any = () => {};
  onTouched: any = () => {};

  writeValue(value: any): void {
    if (value !== undefined) {
      this.rating = value;
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.readonly = isDisabled;
  }

  setRating(val: number) {
    if (!this.readonly) {
      this.rating = val;
      this.onChange(this.rating);
      this.onTouched();
    }
  }

  setHover(val: number) {
    if (!this.readonly) {
      this.hoverVal = val;
    }
  }
}
