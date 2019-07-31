import React from 'react';
import "../css/ElementNavigator.css";
import { ElementNavigatorFieldDetail } from './ElementNavigatorFieldDetail';
import { ElementNavigatorActionButton } from './ElementNavigatorActionButton';

export class ElementNavigatorField extends React.Component<any, any> {
    context: any;

    expanded: boolean = false;
    constructor(props: any) {
        super(props);

        this.toggleExpand = this.toggleExpand.bind(this);
    }

    render() {

        let content: any;

        let expanderClass = "enf-expander-icon glyphicon glyphicon-";

        if(this.expanded === true) {
            expanderClass += "minus";
            content = (
                <div className="enf-content">
                    <div className="enf-content-top">
                        <div className="enf-content-title">
                            {this.props.field.developerName}
                        </div>
                        <div className="en-button-bar">
                            <ElementNavigatorActionButton key="getter" action="getter" element={this.props.field} parent={this} root={this.props.root}/>
                            <ElementNavigatorActionButton key="setter" action="setter" element={this.props.field} parent={this} root={this.props.root}/>
                            <ElementNavigatorActionButton key="name" action="name" element={this.props.field} parent={this} root={this.props.root}/>
                            <ElementNavigatorActionButton key="id" action="id" element={this.props.field} parent={this} root={this.props.root}/>
                        </div>
                    </div>
                    <div className="enf-content-bottom">
                        <div className="enf-content-body">
                            <ElementNavigatorFieldDetail field={this.props.field} parent={this} root={this.props.root}/>
                        </div>
                    </div>
                </div>
            );
        }
        else
        {
            expanderClass += "plus"; 
            content = (
                <div className="enf-content">
                    <div className="enf-content-top">
                        <div className="enf-content-title">
                            {this.props.field.developerName}
                        </div>
                        <div className="en-button-bar">
                            <ElementNavigatorActionButton action="getter" element={this.props.field} parent={this} root={this.props.root}/>
                            <ElementNavigatorActionButton action="setter" element={this.props.field} parent={this} root={this.props.root}/>
                            <ElementNavigatorActionButton key="name" action="name" element={this.props.field} parent={this} root={this.props.root}/>
                            <ElementNavigatorActionButton action="id" element={this.props.field} parent={this} root={this.props.root}/>
                        </div>
                    </div>
                </div>
            );
        }
        
        return(
            <div
                className="enf"
            >
                <div className="enf-expander"style={{display: "inlineBlock"}}>
                    <span className={expanderClass} onClick={(e: any) => {this.toggleExpand(e)}}/>
                </div>
                {content}
            </div>
        );
    }

    toggleExpand(e: any) {
        this.expanded = !this.expanded;
        this.forceUpdate();
    }
}