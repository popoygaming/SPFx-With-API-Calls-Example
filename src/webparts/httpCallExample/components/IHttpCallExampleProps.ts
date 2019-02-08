import { IODataUser } from "@microsoft/sp-odata-types";
import { WebPartContext } from "@microsoft/sp-webpart-base";

export declare interface IHttpCallExampleProps {
  description: string;
  userData: IODataUser;
  context: WebPartContext;
}

export interface IHttpCallExampleState {

}