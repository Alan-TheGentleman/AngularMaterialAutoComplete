import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable } from 'rxjs';
import { debounceTime, map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-chips',
  templateUrl: './chips.component.html',
  styles: ['.full-width { width: 100% }']
})
export class ChipsComponent implements OnInit {
  @ViewChild('chipsInput') chipsInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;
  @ViewChild('chipList') chipList;
  @Input() placeholder;
  @Input() selectable = true;
  @Input() removable = true;
  @Input() addOnBlur = true;
  @Input() onlyListItems = false;
  @Input() set required(value: boolean) {
    this._required = value;
    this.completePlaceholder = `${this.placeholder} ${this._required ? '*' : ''}`;
  }
  @Input() control = new FormControl();
  @Input() set allOptions(value: any[]) {
    this._allOptions = [...(value ? value : [])];
  }
  separatorKeysCodes: number[] = [ENTER, COMMA];
  _required = false;
  _allOptions = [];
  filteredOptions: Observable<string[]>;
  options = [];
  dummyControl = new FormControl('');
  completePlaceholder: string;

  constructor() {}

  ngOnInit() {
    this.options = this.control.value ? this.control.value : [];
    this.completePlaceholder = `${this.placeholder} ${this._required ? '*' : ''}`;
    this.filteredOptions = this.dummyControl.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      map(value => {
        return this._filter(value);
      })
    );
  }

  private validateChipsControl() {
    this.chipList.errorState = !this.control.valid;
    this.control.markAsTouched();
  }

  private _filter(value: any): string[] {
    const filterValue = value && !(value instanceof Array) ? value.toLowerCase() : '';
    return this._allOptions ? this._allOptions.filter(option => option.toLowerCase().includes(filterValue)) : [...this._allOptions];
  }

  add(event: MatChipInputEvent): void {
    if (!this.matAutocomplete || (this.matAutocomplete && !this.matAutocomplete.isOpen)) {
      const input = event.input;
      const value = (event.value || '').trim();
      const addValue = this.onlyListItems ? !!this._allOptions.find(o => o.toLowerCase() === value.toLowerCase()) : true;
      if (value && !this.options.find(v => v === value) && addValue) {
        this.options.push(value.trim());
      }

      if (input) {
        input.value = '';
      }
      this.control.setValue(this.options);
      this.dummyControl.setValue(null);
    }

    this.validateChipsControl();
  }

  remove(fruit: string): void {
    const index = this.options.indexOf(fruit);

    if (index >= 0) {
      this.options.splice(index, 1);
    }
    this.control.setValue(this.options);
    this.validateChipsControl();
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    if (!this.options.find(item => item === event.option.viewValue)) this.options.push(event.option.viewValue);
    this.chipsInput.nativeElement.value = '';
    this.control.setValue(this.options);
    this.dummyControl.setValue(null);
    this.validateChipsControl();
  }
}
