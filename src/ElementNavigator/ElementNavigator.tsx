import React from 'react';
import "../css/ElementNavigator.css";
import MacroEditor from '../MacroEditor';
import { ElementNavigatorField } from './ElementNavigatorField';

export class ElementNavigator extends React.Component<any, any> {
    context: any;

    constructor(props: any) {
        super(props);

        this.filter = this.filter.bind(this);
        this.clearSearch = this.clearSearch.bind(this);
    }

    searchbox: any;
    render() {

        
        const values = Object.values((this.props.parent as MacroEditor).flowValues).filter((value: any) => {
            if(this.searchbox && this.searchbox.value && this.searchbox.value.length > 0)
            {
                if(value.developerName.toLowerCase().includes(this.searchbox.value.toLowerCase())) {
                    return value;
                }
            }
            else
            {
                return value;
            }
        })

        //t values: Array<any> = [];
        //loop over fields
        const flowValues = values.map((value: any) => {
            return(
                <ElementNavigatorField 
                    key={value.id}
                    parent={this} 
                    root={this.props.parent}
                    field={value} 
                    />
                );
        });

        

        return(
            <div
                className="en"
            >
                <div className="en-tools">
                    <input 
                        className="en-searchbox" 
                        type="text" 
                        onChange={(e: any) => {this.filter(e)}} 
                        ref={(e: any) => {this.searchbox = e}}
                    />
                    <span
                        className="en-clearbutton glyphicon glyphicon-remove"
                        onClick={(e: any) => {this.clearSearch(e)}}
                    />
                </div>
                <div className="en-body">
                    {flowValues}
                </div>
                
            </div>
        );
    }

    filter(e: any) {
        this.forceUpdate();
    }

    clearSearch(e: any) {
        this.searchbox.value="";
        this.forceUpdate();
    }
}