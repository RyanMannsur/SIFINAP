import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';

@Component({
  selector: 'app-select',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './template.html',
  styleUrls: ['./styles.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true
    }
  ]
})
export class SelectComponent implements ControlValueAccessor {
  @Input() label: string = '';
  @Input() placeholder: string = 'Selecione...';
  @Input() disabled: boolean = false;
  
  @Input() options: any[] = [];
  @Input() labelKey: string = 'label';
  @Input() valueKey: string = 'value';

  value: any = '';

  onChange: any = () => {};
  onTouched: any = () => {};

  writeValue(value: any): void {
    if (value !== undefined) {
      this.value = value;
    }
  }

  onModelChanged(value: any): void {
    this.value = value;
    this.onChange(this.value);
    this.onTouched();
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  getOptionLabel(opt: any): string {
    if (typeof opt === 'object') {
      return opt[this.labelKey];
    }
    return String(opt);
  }

  getOptionValue(opt: any): any {
    if (typeof opt === 'object') {
      return opt[this.valueKey];
    }
    return opt;
  }
}
