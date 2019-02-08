import { IODataUser } from "@microsoft/sp-odata-types";
import { SPHttpClient } from "@microsoft/sp-http";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import { IProduct } from "./components/IProduct";

export default class DataFactory{
  
    public async GetCurrentUserAsync(context: WebPartContext, url: string) : Promise<IODataUser> {
        const response = await context.spHttpClient.get(url, SPHttpClient.configurations.v1);
        const user: IODataUser = await response.json();
        return user;
      }

    public async GetProductsAsync(context: WebPartContext, url: string): Promise<IProduct[]> {
        const response = await context.spHttpClient.get(url, SPHttpClient.configurations.v1);
        var products: IProduct[]
        await response.json().then((responseJSON)=>{
            products = responseJSON.value
        });
        return products;
      }
}