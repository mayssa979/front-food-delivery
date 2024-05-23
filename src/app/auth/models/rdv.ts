//import { DateTimePickerComponent } from "app/main/forms/form-elements/date-time-picker/date-time-picker.component";

import { Patient } from "./patient";
import { User } from "./user";


export class rdv {
    id: number;
    date: string;
    extendedProps: any = {
      user:User,
      patient: Patient
    };
    
  }