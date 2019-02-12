import * as React from 'react';
import { BaseComponent } from 'office-ui-fabric-react/lib/Utilities';
import { IPersonaProps } from 'office-ui-fabric-react/lib/Persona';
import {
  IBasePickerSuggestionsProps,
  NormalPeoplePicker,
  ValidationState
} from 'office-ui-fabric-react/lib/Pickers';
import { Promise } from 'es6-promise';

export interface IPeoplePickerExampleState {
  currentPicker?: number | string;
  delayResults?: boolean;
  peopleList: IPersonaProps[];
  mostRecentlyUsed: IPersonaProps[];
  currentSelectedItems?: IPersonaProps[];
  isPickerDisabled?: boolean;
}

const suggestionProps: IBasePickerSuggestionsProps = {
  suggestionsHeaderText: 'Suggested People',
  mostRecentlyUsedHeaderText: 'Suggested Contacts',
  noResultsFoundText: 'No results found',
  loadingText: 'Loading',
  showRemoveButtons: true,
  suggestionsAvailableAlertText: 'People Picker Suggestions available',
  suggestionsContainerAriaLabel: 'Suggested contacts'
};


export class PeoplePickerTypesExample extends BaseComponent<any, IPeoplePickerExampleState> {
 constructor(props: {}) {
    super(props);

    this.state = {
      currentPicker: 1,
      delayResults: false,
      peopleList: this.searchPeopleFromMock(),
      mostRecentlyUsed: this.searchPeopleFromMock(),
      currentSelectedItems: [],
      isPickerDisabled: false
    };
  }

  public render() {
    let currentPicker = this._renderNormalPicker();
    return (
      <div>
        {currentPicker}
      </div>
    );
  }

  private _getTextFromItem(persona: IPersonaProps): string {
    return persona.primaryText as string;
  }

  private searchPeopleFromMock(): IPersonaProps[] {
    return  [
      {
        imageUrl: './images/persona-female.png',
        imageInitials: 'PV',
        primaryText: 'Annie Lindqvist',
        secondaryText: 'Designer',
        tertiaryText: 'In a meeting',
        optionalText: 'Available at 4:00pm'
      },
      {
        imageUrl: './images/persona-male.png',
        imageInitials: 'AR',
        primaryText: 'Aaron Reid',
        secondaryText: 'Designer',
        tertiaryText: 'In a meeting',
        optionalText: 'Available at 4:00pm'
      },
      {
        imageUrl: './images/persona-male.png',
        imageInitials: 'AL',
        primaryText: 'Alex Lundberg',
        secondaryText: 'Software Developer',
        tertiaryText: 'In a meeting',
        optionalText: 'Available at 4:00pm'
      },
      {
        imageUrl: './images/persona-male.png',
        imageInitials: 'RK',
        primaryText: 'Roko Kolar',
        secondaryText: 'Financial Analyst',
        tertiaryText: 'In a meeting',
        optionalText: 'Available at 4:00pm'
      },
    ];
  }

  private _renderNormalPicker() {
    return (
      <NormalPeoplePicker
        onResolveSuggestions={this._onFilterChanged}
        onEmptyInputFocus={this._returnMostRecentlyUsed}
        getTextFromItem={this._getTextFromItem}
        pickerSuggestionsProps={suggestionProps}
        className={'ms-PeoplePicker'}
        key={'normal'}
        onRemoveSuggestion={this._onRemoveSuggestion}
        onValidateInput={this._validateInput}
        removeButtonAriaLabel={'Remove'}
        inputProps={{
          onBlur: (ev: React.FocusEvent<HTMLInputElement>) => console.log('onBlur called'),
          onFocus: (ev: React.FocusEvent<HTMLInputElement>) => console.log('onFocus called'),
          'aria-label': 'People Picker'
        }}
        onInputChange={this._onInputChange}
        resolveDelay={300}
        disabled={this.state.isPickerDisabled}
      />
    );
  }

  private _onRemoveSuggestion = (item: IPersonaProps): void => {
    console.log("_onRemoveSuggestion");
    const { peopleList, mostRecentlyUsed: mruState } = this.state;
    const indexPeopleList: number = peopleList.indexOf(item);
    const indexMostRecentlyUsed: number = mruState.indexOf(item);

    if (indexPeopleList >= 0) {
      const newPeople: IPersonaProps[] = peopleList.slice(0, indexPeopleList).concat(peopleList.slice(indexPeopleList + 1));
      this.setState({ peopleList: newPeople });
    }

    if (indexMostRecentlyUsed >= 0) {
      const newSuggestedPeople: IPersonaProps[] = mruState
        .slice(0, indexMostRecentlyUsed)
        .concat(mruState.slice(indexMostRecentlyUsed + 1));
      this.setState({ mostRecentlyUsed: newSuggestedPeople });
    }
  };

  private _onFilterChanged = (filterText: string, currentPersonas: IPersonaProps[], limitResults?: number): IPersonaProps[] | Promise<IPersonaProps[]> => {
    console.log("_onFilterChanged: ", currentPersonas);
    if (filterText) {
      let filteredPersonas: IPersonaProps[] = this._filterPersonasByText(filterText);

      filteredPersonas = this._removeDuplicates(filteredPersonas, currentPersonas);
      filteredPersonas = limitResults ? filteredPersonas.splice(0, limitResults) : filteredPersonas;
      return this._filterPromise(filteredPersonas);
    } else {
      return [];
    }
  };

  private _returnMostRecentlyUsed = (currentPersonas: IPersonaProps[]): IPersonaProps[] | Promise<IPersonaProps[]> => {
    console.log("_returnMostRecentlyUsed");
    let { mostRecentlyUsed } = this.state;
    mostRecentlyUsed = this._removeDuplicates(mostRecentlyUsed, currentPersonas);
    return this._filterPromise(mostRecentlyUsed);
  };

  private _filterPromise(personasToReturn: IPersonaProps[]): IPersonaProps[] | Promise<IPersonaProps[]> {
    console.log("_filterPromise");
    if (this.state.delayResults) {
      return this._convertResultsToPromise(personasToReturn);
    } else {
      return personasToReturn;
    }
  }

  private _listContainsPersona(persona: IPersonaProps, personas: IPersonaProps[]) {
    console.log("_listContainsPersona");
    if (!personas || !personas.length || personas.length === 0) {
      return false;
    }
    return personas.filter(item => item.primaryText === persona.primaryText).length > 0;
  }

  private _filterPersonasByText(filterText: string): IPersonaProps[] {
    console.log("_filterPersonasByText");
    return this.state.peopleList.filter(item => this._doesTextStartWith(item.primaryText as string, filterText));
  }

  private _doesTextStartWith(text: string, filterText: string): boolean {
    console.log("_doesTextStartWith");
    return text.toLowerCase().indexOf(filterText.toLowerCase()) === 0;
  }

  private _convertResultsToPromise(results: IPersonaProps[]): Promise<IPersonaProps[]> {
    console.log("_convertResultsToPromise");
    return new Promise<IPersonaProps[]>((resolve, reject) => setTimeout(() => resolve(results), 2000));
  }

  private _removeDuplicates(personas: IPersonaProps[], possibleDupes: IPersonaProps[]) {
    console.log("_removeDuplicates");
    return personas.filter(persona => !this._listContainsPersona(persona, possibleDupes));
  }

  private _validateInput = (input: string): ValidationState => {
    console.log("_validateInput");
    if (input.indexOf('@') !== -1) {
      return ValidationState.valid;
    } else if (input.length > 1) {
      return ValidationState.warning;
    } else {
      return ValidationState.invalid;
    }
  };

  private _onInputChange(input: string): string {
    const outlookRegEx = /<.*>/g;
    const emailAddress = outlookRegEx.exec(input);

    if (emailAddress && emailAddress[0]) {
      return emailAddress[0].substring(1, emailAddress[0].length - 1);
    }
    console.log("_onInputChange");
    return input;
  }
}