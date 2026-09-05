import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

@Component({
  selector: 'app-range-slider',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './template.html',
  styleUrls: ['./styles.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RangeSliderComponent),
      multi: true
    }
  ]
})
export class RangeSliderComponent implements ControlValueAccessor {
  @Input() label: string = 'Estrelas';
  @Input() description: string = 'Filtrar por avaliação';
  @Input() min: number = 1;
  @Input() max: number = 5;

  minValue: number = 1;
  maxValue: number = 5;

  onChange: any = () => {};
  onTouched: any = () => {};

  writeValue(value: {min: number, max: number}): void {
    if (value) {
      this.minValue = value.min !== undefined ? value.min : this.min;
      this.maxValue = value.max !== undefined ? value.max : this.max;
      this.updateValues();
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  onMinChange() {
    if (this.minValue > this.maxValue) {
      const temp = this.maxValue;
      this.maxValue = this.minValue;
      this.minValue = temp;
    }
    this.emitChange();
  }

  onMaxChange() {
    if (this.maxValue < this.minValue) {
      const temp = this.minValue;
      this.minValue = this.maxValue;
      this.maxValue = temp;
    }
    this.emitChange();
  }

  updateValues() {
    if (this.minValue > this.maxValue) {
      this.minValue = this.maxValue;
    }
  }

  emitChange() {
    this.onChange({ min: this.minValue, max: this.maxValue });
    this.onTouched();
  }
}
