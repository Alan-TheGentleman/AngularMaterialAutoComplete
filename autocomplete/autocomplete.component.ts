import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { debounceTime, map, startWith } from 'rxjs/operators';
import { SelectOption } from '../../interfaces';
import { ValidationService } from '../../services';

@Component({
  selector: 'app-auto-complete',
  templateUrl: './autocomplete.component.html',
  styles: ['.full-width { width: 100% }']
})
export class AutoCompleteComponent implements OnInit {
  @Input() control = new FormControl();
  @Input() set options(value: any[]) {
    this._options = [...(value ? value : [])];
    this.disableControl(this._options.length === 0);
    this.checkValidations();
  }
  @Input() placeholder: string;
  @Input() selectionChange: Function;
  @Input() set disabled(value: boolean) {
    this.disableControl(value);
  }
  @Input() set required(value: boolean) {
    this._required = value;
    this.checkValidations();
    this.completePlaceholder = `${this.placeholder} ${this._required ? '*' : ''}`;
  }

  private lastValue: string;
  dummyControl = new FormControl('');
  completePlaceholder = 'Elija una opción';
  _options: SelectOption[];
  _required: boolean;
  filteredOptions: Observable<SelectOption[]>;

  constructor(private validationService: ValidationService) {
    this.dummyControl.disable();
  }

  ngOnInit() {
    this.filteredOptions = this.control.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      map(value => this._filter(value))
    );
    this.completePlaceholder = `${this.placeholder} ${this._required ? '*' : ''}`;
  }

  private checkControlValue() {
    return this.control && this.control.value ? this.control.value : '';
  }

  private checkValidations() {
    const validators = !!this._required
      ? [this.validationService.requireMatch(this._options)]
      : [this.validationService.requireMatchWithEmpty(this._options)];
    this.control.setValidators(validators);
    this.control.updateValueAndValidity();
  }

  private _filter(value: string): SelectOption[] {
    const filterValue = value ? value.toString().toLowerCase() : '';
    if (this.lastValue && filterValue !== this.lastValue && filterValue === '' && this.selectionChange)
      this.selectionChange({ option: { value: this.checkControlValue() } });
    this.lastValue = filterValue;
    return this._options ? this._options.filter(option => option.label.toLowerCase().includes(filterValue)) : this._options;
  }

  private disableControl(value: boolean) {
    if (value) {
      this.control.disable({ emitEvent: false });
    } else {
      this.control.enable({ emitEvent: false });
    }
  }

  getLabelName(value: string) {
    const result = this._options ? this._options.find(option => option.value === value) : null;
    return result ? result.label : undefined;
  }
}
