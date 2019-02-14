import { IProduct } from "./IProduct";
import * as React from "react";
import { Component } from "react";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import DataFactory from "../DataFactory";
import { PrimaryButton, DefaultButton } from "office-ui-fabric-react/lib/Button";
import { PeoplePickerTypesExample } from "./PeoplePicker";
import { Panel, PanelType } from "office-ui-fabric-react/lib/Panel";
import { TextField } from 'office-ui-fabric-react/lib/TextField';


export interface ShopinasProps {
  context: WebPartContext;
}

export interface ShopinasState {
  Products: IProduct[];
  showPanel: boolean;
  selectedProduct: IProduct;
  isEditDisabled: boolean;
  isDeleteDisabled: boolean;
}

class Shopinas extends React.Component<ShopinasProps, ShopinasState> {

  private datafactory: DataFactory = new DataFactory();
  private editSaveText: string = "Edit";

  constructor(props) {
    super(props);
    this.state = {
      Products: [],
      showPanel: false,
      selectedProduct: {ID: 0, ProductName: "", ProductDesc: "", Tax: 0, Price: 0},
      isEditDisabled: true,
      isDeleteDisabled: false
    };
  }

  componentDidMount() {
    this.GetProducts();
  }

  render(): JSX.Element {
    return (
      <div>
        <h3>Inuman na! Products Offered:</h3>
        <ul>
          {this.state.Products !== undefined && this.state.Products.length > 0 ? (
            this.state.Products.map((product, i) => {
              return [<li><a href="#" onClick={()=> this._onProductItemClicked(product)}> {product.ProductName}</a></li>];
            })) : (<li>No proucts available</li>)}
        </ul>
        {this._editPanel()}

        <PrimaryButton onClick={()=>{
          const url: string = this.props.context.pageContext.web.absoluteUrl + `/_api/web/lists/getbytitle('Members')/Items`;
          this.datafactory.Members_AddItem(this.props.context, url, "Members");
        }}>Add to Members
        </PrimaryButton>

          <PrimaryButton onClick={()=>{
          const url: string = this.props.context.pageContext.web.absoluteUrl + `/_api/web/lists/getbytitle('Followers')/Items`;
          this.datafactory.Followers_AddItem(this.props.context, url, "Followers");
        }}>Add to Follower
        r</PrimaryButton>
        
      </div>
    );
  }

  private async GetProducts() {
    const url: string = this.props.context.pageContext.web.absoluteUrl + `/_api/web/lists/getbytitle('Base%20Product')/Items`;
    var products = await this.datafactory.GetProductsAsync(this.props.context, url);
    this.setState({ Products: products });
    console.table(this.state.Products);
  }

  private _onProductItemClicked=(product: IProduct) =>{
    this.editSaveText= "Edit";
    this.setState({selectedProduct: product, isEditDisabled : true});
    this.setState({ showPanel: true });
    this.setState({isDeleteDisabled: false});
  }

  private _onClosePanel = (): void => {
    this.setState({ showPanel: false});
  };

  private _onEditProduct = () =>{
    if (this.editSaveText === "Save") {
      this.setState({isEditDisabled: true});
      this.datafactory.Products_UpdateItem(this.props.context, "Base%20Product", this.state.selectedProduct);
      this.editSaveText= "Edit";
    }
    else{
      this.setState({ showPanel: true, isEditDisabled : false });
      this.editSaveText= "Save";
      this.setState({isDeleteDisabled: true});
    }
  }

  private _onDeleteProduct = () =>{
    this.setState({ showPanel: true });
    this.datafactory.Products_DeleteItems(this.props.context, "Base%20Product", this.state.selectedProduct);
  }

  private _onRenderFooterContent = (): JSX.Element => {
    return (
      <div>
        <PrimaryButton onClick={this._onEditProduct} style={{ marginRight: '5px' }}>{this.editSaveText} </PrimaryButton>
        <PrimaryButton onClick={this._onDeleteProduct} disabled={this.state.isDeleteDisabled} style={{ marginRight: '5px' }}>Delete </PrimaryButton>
        <DefaultButton onClick={this._onClosePanel}>Close</DefaultButton>
      </div>
    );
  }

  private _editPanel = (): JSX.Element => {
    return(
      <div>
        <Panel
          isOpen={this.state.showPanel}
          type={PanelType.medium}
          onDismiss={this._onClosePanel}
          headerText="Product Management"
          closeButtonAriaLabel="Close"
          onRenderFooterContent={this._onRenderFooterContent}
        >
           <TextField label="Product Name" required={true} disabled={this.state.isEditDisabled } value={this.state.selectedProduct.ProductName} onChanged={(newValue)=>{this.setState({ selectedProduct: {
              ID: this.state.selectedProduct.ID,
              ProductName: newValue,
              ProductDesc: this.state.selectedProduct.ProductDesc,
              Price: this.state.selectedProduct.Price,
              Tax: this.state.selectedProduct.Tax
            }});}} />
           <TextField label="Description" required={true} disabled={this.state.isEditDisabled}  value={this.state.selectedProduct.ProductDesc} onChanged={(newValue)=>{this.setState({ selectedProduct: {
              ID: this.state.selectedProduct.ID,
              ProductName: this.state.selectedProduct.ProductDesc,
              ProductDesc: newValue,
              Price: this.state.selectedProduct.Price,
              Tax: this.state.selectedProduct.Tax
            }});}} />
           <TextField label="Price" required={true} disabled={this.state.isEditDisabled} value={this.state.selectedProduct.Price.toString()} onChanged={(newValue)=>{this.setState({ selectedProduct: {
              ID: this.state.selectedProduct.ID,
              ProductName: this.state.selectedProduct.ProductName,
              ProductDesc: this.state.selectedProduct.ProductDesc,
              Price: newValue,
              Tax: this.state.selectedProduct.Tax
            }});}} />
           <TextField label="Tax" required={true } disabled={this.state.isEditDisabled}  value={this.state.selectedProduct.Tax.toString()} onChanged={(newValue)=>{this.setState({ selectedProduct: {
              ID: this.state.selectedProduct.ID,
              ProductName: this.state.selectedProduct.ProductName,
              ProductDesc: this.state.selectedProduct.ProductDesc,
              Price: this.state.selectedProduct.Price,
              Tax: newValue
            }});}} />
        </Panel>
      </div>
    );
  }

}


export default Shopinas;
