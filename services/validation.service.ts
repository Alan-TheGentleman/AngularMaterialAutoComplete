import { Injectable } from "@angular/core";
import { AbstractControl } from "@angular/forms";
import { SelectOption } from "../interfaces";

@Injectable()
export class ValidationService {
  getValidatorErrorMessage(validatorName: string, validatorValue?: any) {
    const config = {
      required: "This field is required",
      requireMatch: "Please, enter a valid option"
    };

    return config[validatorName];
  }

  requireMatch(options: SelectOption[]) {
    return (control: AbstractControl) => {
      const selection: any =
        options && options.find(o => o.value === control.value)
          ? null
          : { requireMatch: true };
      return selection;
    };
  }

  requireMatchWithEmpty(options: SelectOption[]) {
    return (control: AbstractControl) => {
      const selection: any =
        (options && options.find(o => o.value === control.value)) ||
        !control.value
          ? null
          : { requireMatch: true };
      return selection;
    };
  }
}
