import {createSelector} from "@ngxs/store";
import {AuthState, AuthStateModel} from "./auth.state";

export class AuthSelector {
  static fullAuthState = createSelector([AuthState], (state: AuthStateModel) => state)

}
