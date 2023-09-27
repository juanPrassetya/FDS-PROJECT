import { Injectable } from '@angular/core';
import {ConfirmationService} from "primeng/api";

@Injectable({
  providedIn: 'root'
})
export class ConfirmService {

  constructor(private confirmationService: ConfirmationService) { }

  showPopupConfirm(event: Event, callBack: Function) {
    let target = event.target != null ? event.target : undefined
    this.confirmationService.confirm({
      target: target,
      message: 'Are you sure that you want to proceed?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        callBack()
      },
      reject: () => {

      }
    });
  }

  showDialogConfirm(callBack: Function) {
    this.confirmationService.confirm({
      header: 'Confirmation',
      message: 'Are you sure that you want to proceed?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        callBack()
      },
      reject: () => {

      }
    });
  }
}
