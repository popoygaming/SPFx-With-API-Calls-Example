import { IProduct } from "./IProduct";
import * as React from "react";
import { Component } from "react";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import DataFactory from '../DataFactory';
import { PrimaryButton, DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { ChoiceGroup, IChoiceGroupOption } from 'office-ui-fabric-react/lib/ChoiceGroup';
import { Panel, PanelType } from 'office-ui-fabric-react/lib/Panel';

export interface BeersProps {
  context: WebPartContext;
}

export interface BeersState {
  Products: IProduct[];
  showPanel: boolean;
  groupOptions: IChoiceGroupOption[];
  selectedOption: IChoiceGroupOption;
}

class Beers extends React.Component<BeersProps, BeersState> {
  constructor(props) {
    super(props);
    this.state = {
      Products: [],
      showPanel: false,
      groupOptions: [],
      selectedOption: undefined
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

    var options: IChoiceGroupOption[] = [];
    this.state.Products.map((product, i)=>{
      options.push({key: product.ProductName, text: `${product.ProductName} - ${product.ProductDesc}` });
    });
    this.setState({groupOptions: options});
    console.table(options);
  }

  render() : JSX.Element {
    return (
      <div>
        <PrimaryButton onClick={this._onShowPanel} text="Order Now" />
        <Panel
          isOpen={this.state.showPanel}
          type={PanelType.smallFixedFar}
          onDismiss={this._onClosePanel}
          // headerText="Beer for you"
          closeButtonAriaLabel="Close"
          onRenderFooterContent={this._onRenderFooterContent}
        >
         <ChoiceGroup
            // options={[
            //   {
            //     key: 'A',
            //     text: 'Red Horse'
            //   },
            //   {
            //     key: 'B',
            //     text: 'Emperador',
            //   },
            //   {
            //     key: 'C',
            //     text: 'San Mig Light',
            //   }
            // ]}
            options={this.state.groupOptions}
            label="Pick one!"
            required={true}
            onChange={this._onChoiceChange}
          />
        </Panel>
      </div>
    );
  }

private _onChoiceChange=(ev: React.FormEvent<HTMLInputElement>, option: IChoiceGroupOption) : void=>{
  this.setState({selectedOption: option});
  console.log("selected option: ", option.key);
  console.log("this.state.selectedOption: ", this.state.selectedOption);
}

  private _onClosePanel = (): void => {
    this.setState({ showPanel: false });
  };

  private _onBuyButtonClicked= (): void => {
    alert("You bought " + this.state.selectedOption.key);
    this.setState({ showPanel: false });
  };

  private _onRenderFooterContent = (): JSX.Element => {
    return (
      <div>
        <PrimaryButton onClick={this._onBuyButtonClicked} style={{ marginRight: '8px' }}>
          Buy
        </PrimaryButton>
        <DefaultButton onClick={this._onClosePanel}>Cancel</DefaultButton>
      </div>
    );
  };

  private _onShowPanel = (): void => {
    this.setState({ showPanel: true });
  };
}

export default Beers;
