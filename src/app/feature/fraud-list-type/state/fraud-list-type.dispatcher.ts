import {Injectable} from "@angular/core";
import {Dispatch} from "@ngxs-labs/dispatch-decorator";
import {FraudListTypeGet} from "./fraud-list-type.actions";

@Injectable({
  providedIn: 'root'
})
export class FraudListTypeDispatcher {
  @Dispatch()
  public _FraudListTypeGet() {
    return new FraudListTypeGet()
  }
}
