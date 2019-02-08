import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';

import * as strings from 'HttpCallExampleWebPartStrings';
import HttpCallExample from './components/HttpCallExample';
import { IHttpCallExampleProps } from './components/IHttpCallExampleProps';
import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';
import { IODataUser } from '@microsoft/sp-odata-types';
import DataFactory from './DataFactory';

export interface IHttpCallExampleWebPartProps {
  description: string;
  userData: IODataUser;
}

export default class HttpCallExampleWebPart extends BaseClientSideWebPart<IHttpCallExampleWebPartProps> {

  public render(): void {

    const element: React.ReactElement<IHttpCallExampleProps > = React.createElement(
      HttpCallExample,
      {
        description: this.properties.description,
        userData: this.properties.userData,
        context: this.context
      }
      
    );

    ReactDom.render(element, this.domElement);
    
    this.getCurrentUserAsync();
  }

  private async getCurrentUserAsync() {

    // const url: string = this.context.pageContext.web.absoluteUrl + `/_api/web/currentuser`;
    // const response = await this.context.spHttpClient.get(url, SPHttpClient.configurations.v1);
    // const user: IODataUser = await response.json();
    // this.properties.userData = user;
    // console.log("user.LoginName ", user.LoginName);

    var api : DataFactory = new DataFactory();
    var user = await api.GetCurrentUserAsync(this.context, this.context.pageContext.web.absoluteUrl + `/_api/web/currentuser`);
    this.properties.userData = user;
    console.log("user.LoginName3 ", user);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
