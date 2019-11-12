# Angular Material AutoComplete and ChipsAutoComplete

## This are custom angular material components, you still need to add angular material module to your application for this to work.

### How to use:

app.module or shared.module

```javascript
import { AngularMaterialsModule } from './angular-materials-module';

@NgModule({
  declarations: [
    AutoCompleteComponent,
    ChipsComponent
  ],
  imports: [CommonModule, AngularMaterialsModule],
  exports: [
    AngularMaterialsModule,
    AutoCompleteComponent,
    ChipsComponent
  ]
})
export class SharedModule {}
```

AutoCompleteComponent

#### attributes you can use :

* control: this is the control of your form.

* options: array of elements to use as options, they have to be in the following format :

```javascript
[
  {
    label: 'text you want to show to the user',
    value: 'the value you want when selecting the option'
  }
]
```

* placeholder: text that you want to show at your input.

* selectionChange: method you want to call when making changes to your control.

* disabled: can be true or false.

* required: can be true or false.

Example:

```html
<app-auto-complete
  [control]="form.get('yourControl')"
  [options]="options"
  placeholder="this is a placeholder"
  [required]="true"
>
</app-auto-complete>
```
ChipsComponent

attributes you can use :

* control: this is the control of your form.

* allOptions: array of elements to use as options, they have to be in the following format :

```javascript
[
  'the value you want when selecting the option',
  'the value you want when selecting the option 2',
  'the value you want when selecting the option 3'
]
```

* placeholder: text that you want to show at your input.

* selectable: whether or not this chip list is selectable. When a chip list is not selectable, the selected states for all the chips inside the chip list are always ignored.

* removable: determines whether or not the chip displays the remove styling and emits (removed) events.

* addOnBlur: whether or not the chipEnd event will be emitted when the input is blurred.

* onlyListItems: the user can only choose from the auto complete, this way you can manage what things can be added as chips.
required: can be true or false.

Example:

```html
<app-chips
  placeholder="this is a placeholder"
  [control]="form.get('yourControl')"
  [allOptions]="moviles"
></app-chips>
```

You can use the chips componente without options ! this way you can add what ever you want as chips :)
