import React from 'react';
import "../css/ElementNavigator.css";
import MacroEditor from '../MacroEditor';
import { ElementNavigatorTypeDetail } from './ElementNavigatorTypeDetail';
import { ElementNavigatorActionButton } from './ElementNavigatorActionButton';

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
        //const typeElementId = this.props.field.typeElementId;
        //const type = (this.props.root as MacroEditor).flowTypes[typeElementId];
      

        if(this.expanded === true) {
            expanderClass += "minus";
            content = (
                <ElementNavigatorTypeDetail key={this.props.type.id} field={this.props.field} type={this.props.type} parent={this} root={this.props.root} />
             );
        }
        else
        {
            expanderClass += "plus"; 

        }

        const buttons = [];
        if(!this.props.field) {
            buttons.push(<ElementNavigatorActionButton key="new" action="new" field={this.props.field} element={this.props.type} parent={this} root={this.props.root}/>);
        }

        return(
            <div className="ent">
                <div className="ent-expander" style={{display: "inlineBlock"}}>
                    <span className={expanderClass} onClick={(e: any) => {this.toggleExpand(e)}}/>
                </div>
                <div className="ent-content" style={{display: "inlineBlock"}}>
                    <div className="ent-content-top">
                        <div className="ent-content-title">
                            {this.props.type.developerName}
                        </div>
                        <div className="en-button-bar">
                            {buttons}
                        </div>
                    </div>
                    <div className="ent-content-bottom">
                        <div className="enf-content-body">
                            {content}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}