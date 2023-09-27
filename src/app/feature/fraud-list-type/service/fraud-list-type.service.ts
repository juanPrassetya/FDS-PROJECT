import {Injectable} from '@angular/core';
import {environment} from "../../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {FraudListTypeDispatcher} from "../state/fraud-list-type.dispatcher";
import {CustomHttpResponse} from "../../../shared/domain/customHttpResponse";
import {RoutePathEnum} from "../../../shared/enum/route-path.enum";
import {FraudListTypeDomain} from "../domain/fraud-list-type.domain";

@Injectable({
  providedIn: 'root'
})
export class FraudListTypeService {
  private apiUrl = environment.dev_env

  constructor(
    private http: HttpClient,
    private fraudListDispatcher: FraudListTypeDispatcher
  ) { }

  getFraudListType() {
    return this.http.get<CustomHttpResponse<FraudListTypeDomain[]>>(`${this.apiUrl}/${RoutePathEnum.FRAUD_LIST_TYPE_GET_PATH}`)
  }

  onGetFraudListType() {
    this.fraudListDispatcher._FraudListTypeGet()
  }
}
