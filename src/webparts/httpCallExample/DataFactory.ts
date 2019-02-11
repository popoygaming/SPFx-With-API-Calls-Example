import { IODataUser } from "@microsoft/sp-odata-types";
import { SPHttpClient, SPHttpClientResponse } from "@microsoft/sp-http";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import { IProduct } from "./components/IProduct";

export default class DataFactory {
  public async GetCurrentUserAsync(
    context: WebPartContext,
    url: string
  ): Promise<IODataUser> {
    const response = await context.spHttpClient.get(
      url,
      SPHttpClient.configurations.v1
    );
    const user: IODataUser = await response.json();
    return user;
  }

  public async GetProductsAsync(context: WebPartContext,url: string): Promise<IProduct[]> {
    const response = await context.spHttpClient.get(url, SPHttpClient.configurations.v1);
    var products: IProduct[];
    await response.json().then(responseJSON => {
      products = responseJSON.value;
    });
    return products;
  }

  public async AddItemToProducts(context: WebPartContext, url: string, listName: string, newProduct: IProduct) {
    const body: string = JSON.stringify({
      __metadata: {
        type: `${await this.GetListItemEntityTypeFullName(context, listName)}`
      },
      ProductName: `${newProduct.ProductName}`,
      ProductDesc: `${newProduct.ProductDesc}`,
      Price: `${newProduct.Price}`,
      Tax: `${newProduct.Tax}`
    });

    context.spHttpClient.post(url, SPHttpClient.configurations.v1, {
      headers: {
        Accept: "application/json;odata=nometadata",
        "Content-type": "application/json;odata=verbose",
        "odata-version": ""
      },
      body: body
    })
      .then((response: SPHttpClientResponse): any => {
        return response.json();
      })
      .then((item: any): void => {
        console.log("AddItemToProducts Successful!");
      }, (error: any): void => {
        console.log("AddItemToProducts Error!");
      });
  }

  public async GetListItemEntityTypeFullName(context: WebPartContext,listName: string): Promise<string> {
    const url =
      context.pageContext.web.absoluteUrl + `/_api/web/lists/GetByTitle('${listName}')/ListItemEntityTypeFullName`;
    const response = await context.spHttpClient.get(
      url,
      SPHttpClient.configurations.v1
    );
    var typeFullName = "";
    await response.json().then(responseJSON => {
      typeFullName = responseJSON.value;
    });
    return typeFullName;
  }
}
