import {Injectable} from '@angular/core';
import {environment} from "../../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {CustomHttpResponse} from "../../../shared/domain/customHttpResponse";
import {RoutePathEnum} from "../../../shared/enum/route-path.enum";
import {RespCodeMappingDomain} from "../domain/resp-code-mapping.domain";
import {RespCodeMappingDispatcher} from "../state/resp-code-mapping.dispatcher";

@Injectable({
  providedIn: 'root'
})
export class RespCodeMappingService {
  private apiUrl = environment.dev_env

  constructor(
    private http: HttpClient,
    private respCodeMappingDispatcher: RespCodeMappingDispatcher
  ) { }

  getRespCodeMapping() {
    return this.http.get<CustomHttpResponse<RespCodeMappingDomain[]>>(`${this.apiUrl}/${RoutePathEnum.RESP_CODE_MAPPING_GET_PATH}`);
  }

  onGetRespCodeMapping() {
    this.respCodeMappingDispatcher._RespCodeMappingGet()
  }
}
