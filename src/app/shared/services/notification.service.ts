import {Injectable} from "@angular/core";
import {MessageService} from "primeng/api";
import {NotificationTypeEnum} from "../enum/notification-type.enum";
import {HttpErrorResponse} from "@angular/common/http";
import {CustomHttpResponse} from "../domain/customHttpResponse";

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(private messageService: MessageService) {}

  public notify(
    type: NotificationTypeEnum,
    responseReason: string,
    responseMessage: string,
  ) {
    if (type == 'success') {
      this.messageService.add({
        severity: type,
        summary: responseReason,
        detail: responseMessage,
        life: 5000,
      });
    } else {
      this.messageService.add({
        severity: type,
        summary: responseReason,
        detail: responseMessage,
        life: 5000,
      });
    }
  }

  upperCaseFirstLetter(char: string): string {
    return char.charAt(0).toUpperCase() + char.slice(1);
  }

  successNotification(reason: string, message: string) {
    this.notify(NotificationTypeEnum.SUCCESS, reason, message);
  }

  errorNotification(reason: string, message: string) {
    this.notify(NotificationTypeEnum.ERROR, reason, message);
  }

  errorHttpNotification(httpErrorResponse: HttpErrorResponse | CustomHttpResponse<any>) {
    if (httpErrorResponse instanceof HttpErrorResponse) {
      if (httpErrorResponse.status == 0){
        this.errorNotification(httpErrorResponse.statusText, httpErrorResponse.message)
      } else {
        if (httpErrorResponse.error.responseMessage != undefined){
          this.errorNotification(httpErrorResponse.error.responseReason, httpErrorResponse.error.responseMessage)
        } else {
          this.errorNotification(httpErrorResponse.error.error, httpErrorResponse.error.message)
        }
      }
    } else {
      this.errorNotification(httpErrorResponse.responseReason, httpErrorResponse.responseMessage)
    }
  }
}
