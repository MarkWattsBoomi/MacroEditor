import React from 'react';
import "../css/ElementNavigator.css";
import MacroEditor from '../MacroEditor';
import { ElementNavigatorTypeDetail } from './ElementNavigatorTypeDetail';

export class ElementNavigatorType extends React.Component<any, any> {
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
        const typeElementId = this.props.field.typeElementId;
        const type = (this.props.root as MacroEditor).flowTypes[typeElementId];
      

        if(this.expanded === true) {
            expanderClass += "minus";
            content = (
                <div className="ent-content">
                    <div className="ent-content-title">
                        {type.developerName}
                    </div>
                    <div className="ent-content-body">
                        <ElementNavigatorTypeDetail field={this.props.field} type={type} parent={this} root={this.props.root} />
                    </div>
                </div>
            );
        }
        else
        {
            expanderClass += "plus"; 
            content = (
                <div className="ent-content">
                    <div className="ent-content-title">
                        {type.developerName}
                    </div>
                </div>
            );
        }

        return(
            <div className="ent">
                <div className="ent-expander"style={{display: "inlineBlock"}}>
                    <span className={expanderClass} onClick={(e: any) => {this.toggleExpand(e)}}/>
                </div>
                {content}
            </div>
        );
    }

}