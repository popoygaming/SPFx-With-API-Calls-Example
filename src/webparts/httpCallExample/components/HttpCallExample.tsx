import * as React from 'react';
import styles from './HttpCallExample.module.scss';
import { IHttpCallExampleProps } from './IHttpCallExampleProps';
import { escape } from '@microsoft/sp-lodash-subset';
import Shopinas from './Shopinas';
import Beers from './Beers';

export default class HttpCallExample extends React.Component<IHttpCallExampleProps> {
  public render(): React.ReactElement<IHttpCallExampleProps> {
    return (
      <div className={ styles.httpCallExample }>
        {/* <div className={ styles.container }>
          <div className={ styles.row }>
            <div className={ styles.column }>
              <span className={ styles.title }>Welcome to SharePoint!</span>
              <p className={ styles.subTitle }>Customize SharePoint experiences using Web Parts.</p>
              <p className={ styles.description }>{escape(this.props.description)}</p>
              <a href="https://aka.ms/spfx" className={ styles.button }>
                <span className={ styles.label }>Learn more</span>
              </a>
            </div>
          </div>
        </div> */}
        <span>Hello <b>{this.props.userData !== undefined ? this.props.userData.Title: ""}</b></span>
        <Shopinas context = {this.props.context}/>
        <Beers context = {this.props.context}/>
      
      </div>
    );
  }
}
