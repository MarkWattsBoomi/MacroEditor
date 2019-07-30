import React from 'react';
import "../css/ElementNavigator.css";
import { ElementNavigatorFieldRow } from './ElementNavigatorFieldRow';
import { ElementNavigatorActionButton } from './ElementNavigatorActionButton';

export class ElementNavigatorProperty extends React.Component<any, any> {
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
        
        const prop = this.props.property;
        
        if(this.expanded === true) {
            expanderClass += "minus";
            const rows: Array<any> = [];
            
            rows.push(<ElementNavigatorFieldRow key={"name"} label={"name"} value={prop.developerName} />);
            rows.push(<ElementNavigatorFieldRow key={"id"}label={"id"} value={prop.id} />);
            rows.push(<ElementNavigatorFieldRow key={"content"} label={"contentType"} value={prop.contentType} />);
            content = (
                <div className="enp-content">
                    {rows}
                </div>
            );
        }
        else
        {
            expanderClass += "plus"; 
            
        }

        const buttons = [];
        if(this.props.field) {
            buttons.push(<ElementNavigatorActionButton action="getter" field={this.props.field} element={prop} parent={this} root={this.props.root}/>);
            buttons.push(<ElementNavigatorActionButton action="setter" field={this.props.field} element={prop} parent={this} root={this.props.root}/>);
        }
        return(
            <div className="enp">
                <div className="enp-expander">
                    <span className={expanderClass} onClick={(e: any) => {this.toggleExpand(e)}}/>
                </div>
                
                <div className="enp-content">
                    <div className="enf-content-top">
                        <div className="enf-content-title">
                            {prop.developerName}
                        </div>
                        <div className="en-button-bar">
                            {buttons}
                        </div>
                    </div>
                    <div className="enf-content-bottom">
                        <div className="enf-content-body">
                            {content}
                        </div>
                    </div>
                </div>
                
            </div>
        );
    }

}