import React from 'react';
import "../css/ElementNavigator.css";
import { ElementNavigatorProperty } from './ElementNavigatorProperty';

export class ElementNavigatorProperties extends React.Component<any, any> {
    context: any;

    expanded: boolean = false;
    
    constructor(props: any) {
        super(props);
        this.toggleExpand = this.toggleExpand.bind(this);
    }

    toggleExpand(e: any) {
        this.expanded = !this.expanded;
        this.forceUpdate();
    }

    render() {

        let content: any;
        let expanderClass = "ent-expander-icon glyphicon glyphicon-";

        //use typeElementId to get a type
        const props = this.props.type.properties;

        const properties = [];
        if(props && props.length > 0) {
            for(const prop of props) {
                properties.push(
                    <ElementNavigatorProperty key={prop.id} field={this.props.field} property={prop} parent={this} root={this.props.root}/>
                );
            }
        }      

        if(this.expanded === true) {
            expanderClass += "minus";
            content = (
                <div className="enp-content">
                    {properties}
                </div>
            );
        }
        else
        {
            expanderClass += "plus"; 
            content = (
                <div className="ent-content">
                    
                </div>
            );
        }

        return(
            <div className="enp">
                <div className="enp-expander">
                    <span className={expanderClass} onClick={(e: any) => {this.toggleExpand(e)}}/>
                </div>
                <div className="enp-content">
                    <div className="enp-title">
                        <span>
                            {"Properties"}
                        </span>
                    </div>
                    <div>
                        {content}
                    </div>
                </div>
                
            </div>
        );
    }

}