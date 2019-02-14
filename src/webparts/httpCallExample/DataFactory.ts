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

  public async Products_AddItem(context: WebPartContext, url: string, listName: string, newProduct: IProduct) {
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
        console.log("Products_AddItem Successful!");
      }, (error: any): void => {
        console.log("Products_AddItem Error!");
      });
  }

  public async Products_UpdateItem(context: WebPartContext, listName: string, updatedProduct: IProduct) {
    const reqJSON : string = JSON.parse(
        `{
            "@data.type": "${await this.GetListItemEntityTypeFullName(context, listName)}",
            "ProductName": "${updatedProduct.ProductName}",
            "ProductDesc": "${updatedProduct.ProductDesc}",
            "Price": "${updatedProduct.Price}",
            "Tax": "${updatedProduct.Tax}"
        }`);

    context.spHttpClient.post(
    context.pageContext.web.absoluteUrl + `/_api/web/lists/GetByTitle('${listName}')/items(${updatedProduct.ID})`,
    SPHttpClient.configurations.v1,{
        body:  JSON.stringify(reqJSON),
        headers:{
            "IF-MATCH" : "*",
            "X-HTTP-Method" : "MERGE",
            "accept": "application/json",
            "content-type": "application/json"
        }
    })
    .then((response: SPHttpClientResponse): void =>{
        console.log("Products_UpdateItem Success")
    }, (error: any): void=>{
        console.log("Products_UpdateItem Error")
    });
  }

  public async Products_DeleteItems(context: WebPartContext, listName: string, updatedProduct: IProduct) {
      context.spHttpClient.post(
        context.pageContext.web.absoluteUrl + `/_api/web/lists/GetByTitle('${listName}')/items(${updatedProduct.ID})`,
        SPHttpClient.configurations.v1,{
            headers:{
                "IF-MATCH" : "*",
                "X-HTTP-Method" : "DELETE",
                "accept": "application/json",
                "content-type": "application/json"
            }
        })
        .then((response: SPHttpClientResponse): void =>{
            console.log("Products_DeleteItems Success")
        }, (error: any): void=>{
            console.log("Products_DeleteItems Error")
        });
  }

  public async GetListItemEntityTypeFullName(context: WebPartContext,listName: string): Promise<string> {
    const url = context.pageContext.web.absoluteUrl + `/_api/web/lists/GetByTitle('${listName}')/ListItemEntityTypeFullName`;
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

  public async Members_AddItem(context: WebPartContext, url: string, listName: string) {
    const body: string = JSON.stringify({
        __metadata: {
            type: `${await this.GetListItemEntityTypeFullName(context, listName)}`
        },
        AccountId: 6,
        First_x0020_Name: `Popoy`,
        Middle_x0020_Name: `Namu`,
        Last_x0020_Name: `Bibo`,
        Position: `Walker Taker`,
        });


    context.spHttpClient.post(url, SPHttpClient.configurations.v1, {
        headers: {
        Accept: "application/json;odata=nometadata",
        "Content-type": "application/json;odata=verbose",
        "odata-version": ""
        },
        body:body,
    })
        .then((response: SPHttpClientResponse): any => {
        return response.json();
        })
        .then((item: any): void => {
        console.log("Products_AddItem Successful!");
        }, (error: any): void => {
        console.log("Products_AddItem Error!");
        });
  }

  public async Followers_AddItem(context: WebPartContext, url: string, listName: string) {
    const body: string = JSON.stringify({
        __metadata: {
            type: `${await this.GetListItemEntityTypeFullName(context, listName)}`
        },
        Person_x0020_IDId: 6,
        Follower_x0020_IdId: 6
        });


    context.spHttpClient.post(url, SPHttpClient.configurations.v1, {
        headers: {
        Accept: "application/json;odata=nometadata",
        "Content-type": "application/json;odata=verbose",
        "odata-version": ""
        },
        body:body,
    })
        .then((response: SPHttpClientResponse): any => {
        return response.json();
        })
        .then((item: any): void => {
        console.log("Products_AddItem Successful!");
        }, (error: any): void => {
        console.log("Products_AddItem Error!");
        });
  }
}
