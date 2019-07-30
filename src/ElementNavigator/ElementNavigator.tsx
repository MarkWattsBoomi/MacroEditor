import React from 'react';
import "../css/ElementNavigator.css";
import MacroEditor from '../MacroEditor';
import { ElementNavigatorField } from './ElementNavigatorField';
import { ElementNavigatorType } from './ElementNaviagtorType';

export class ElementNavigator extends React.Component<any, any> {
    context: any;

    constructor(props: any) {
        super(props);

        this.selectTab = this.selectTab.bind(this);
        this.filter = this.filter.bind(this);
        this.clearSearch = this.clearSearch.bind(this);
    }

    searchbox: any;
    selectedTab: string = "values";

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

        const types = Object.values((this.props.parent as MacroEditor).flowTypes).filter((value: any) => {
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


        //loop over fields
        const flowTypes = types.map((type: any) => {
            return(
                <ElementNavigatorType
                    key={type.id}
                    parent={this} 
                    root={this.props.parent}
                    type={type} 
                    />
                );
        });

        let treeContent : any;
        if(this.selectedTab === "values") {
            treeContent=flowValues;
        }
        else
        {
            treeContent=flowTypes;
        }

        

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
                <div 
                    className="en-tabs"
                >
                    <div 
                        className={this.selectedTab==="values"? "en-tab en-tab-selected" : "en-tab"}
                        onClick={(e: any) => {this.selectTab("values")}}
                    >
                        values
                    </div>
                    <div 
                        className={this.selectedTab==="types"? "en-tab en-tab-selected" : "en-tab"}
                        onClick={(e: any) => {this.selectTab("types")}}
                    >
                        types
                    </div>
                </div>
                <div className="en-body">
                    {treeContent}
                </div>
                
            </div>
        );
    }

    selectTab(tab: string) {
        if(this.selectedTab !== tab) {
            this.selectedTab = tab;
            this.forceUpdate();
        }
    }

    filter(e: any) {
        this.forceUpdate();
    }

    clearSearch(e: any) {
        this.searchbox.value="";
        this.forceUpdate();
    }
}