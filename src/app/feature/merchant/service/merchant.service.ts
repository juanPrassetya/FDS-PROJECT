import {Injectable} from '@angular/core';
import {environment} from "../../../../environments/environment";
import {HttpClient, HttpParams} from "@angular/common/http";
import {CustomHttpResponse} from "../../../shared/domain/customHttpResponse";
import {RoutePathEnum} from "../../../shared/enum/route-path.enum";
import {MerchantDomain} from "../domain/merchant.domain";
import { MerchantDispatcher } from '../state/merchant.dispatcher';
@Injectable({
  providedIn: 'root'
})
export class MerchantService {
  private apiUrl = environment.dev_env

  constructor(
    private http: HttpClient,
    private merchantDispatcher: MerchantDispatcher
  ) { }

  getMerchant() {
    return this.http.get<CustomHttpResponse<MerchantDomain[]>>(`${this.apiUrl}/${RoutePathEnum.MERCHANT_GET_PATH}`);
  }

  getMerchantQuery(data: any) {
    return this.http.post<CustomHttpResponse<MerchantDomain[]>>(`${this.apiUrl}/${RoutePathEnum.MERCHANT_GET_QUERY_PATH}`, data);
  }

  addMerchant(data: MerchantDomain) {
    return this.http.post<CustomHttpResponse<any>>(`${this.apiUrl}/${RoutePathEnum.MERCHANT_ADD_PATH}`, data);
  }

  updateMerchant(currentName: string, data: MerchantDomain) {
    const params = new HttpParams()
      .set('currentMerchantName', currentName)
      .append('merchantName', data.merchantName)
      .append('description', data.description)

    return this.http.post<CustomHttpResponse<any>>(`${this.apiUrl}/${RoutePathEnum.MERCHANT_UPDATE_PATH}`, '', {params});
  }

  deleteMerchant(id: number) {
    return this.http.delete<CustomHttpResponse<any>>(`${this.apiUrl}/${RoutePathEnum.MERCHANT_DELETE_PATH}/${id}`);
  }

  onFetchMerchant() {
    this.merchantDispatcher._MerchantGet()
  }

  onFetchMerchantQuery(data: any) {
    this.merchantDispatcher._MerchantGetQuery(data)
  }

  onAddMerchant(data: MerchantDomain) {
    this.merchantDispatcher._MerchantAdd(data)
  }

  onUpdateMerchant(currentName: string, data: MerchantDomain) {
    this.merchantDispatcher._MerchantUpdate(currentName, data)
  }

  onDeleteMerchant(id: number) {
    this.merchantDispatcher._MerchantDelete(id)
  }

}
