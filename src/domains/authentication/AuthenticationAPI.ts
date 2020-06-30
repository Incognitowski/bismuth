import AuthenticationREST from "./AuthenticationREST";
import AuthenticationPOTO from "./AuthenticationPOTO";
import { AxiosResponse } from 'axios';

export default class AthenticationAPI {
  private authenticationREST: AuthenticationREST;

  constructor() {
    this.authenticationREST = new AuthenticationREST();
  }
  public attemptLogin(username: string, password: string) {
    var authenticationPOTO: AuthenticationPOTO = new AuthenticationPOTO(
      username,
      password
    );
    return this.authenticationREST.attemptAuthentication(authenticationPOTO);
  }
}
