import { IProduct } from "./IProduct";
import * as React from "react";
import { Component } from "react";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import DataFactory from '../DataFactory';

export interface ShopinasProps {
  context: WebPartContext;
}

export interface ShopinasState {
  Products: IProduct[];
}

class Shopinas extends React.Component<ShopinasProps, ShopinasState> {
  constructor(props) {
    super(props);
    this.state = {
      Products: []
    };
  }

  componentDidMount() {
    this.GetProducts();
  }

  private async GetProducts(){
    var api: DataFactory = new DataFactory();
    const url: string = this.props.context.pageContext.web.absoluteUrl + `/_api/web/lists//getbytitle('Base%20Product')/Items`;
    var products = await api.GetProductsAsync(this.props.context, url);
    this.setState({Products: products});
    console.table(this.state.Products);
  }

  render() : JSX.Element {
    return (
      <div>
        <h3>Inuman na! Products Offered:</h3>
        <ul>
          {
            (this.state.Products !== undefined && this.state.Products.length > 0) ? 
              this.state.Products.map((product, i) => {
                return [<li>{product.ProductName}</li>];})
              : <li>No proucts available</li>}
      </ul>
      </div>
    );
  }
}

export default Shopinas;
