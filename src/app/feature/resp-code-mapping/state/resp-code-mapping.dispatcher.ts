import {Injectable} from "@angular/core";
import {Dispatch} from "@ngxs-labs/dispatch-decorator";
import {RespCodeMappingGet} from "./resp-code-mapping.actions";

@Injectable({
  providedIn: 'root'
})
export class RespCodeMappingDispatcher {

  @Dispatch()
  public _RespCodeMappingGet() {
    return new RespCodeMappingGet()
  }
}
