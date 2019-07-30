import React from 'react';
import "../css/ElementNavigator.css";
import { ElementNavigatorFieldRow } from './ElementNavigatorFieldRow';
import { ElementNavigatorProperties } from './ElementNavigatorProperties';

export class ElementNavigatorTypeDetail extends React.Component<any, any> {
    context: any;

    expanded: boolean = false;
    
    render() {

        const rows = [];
        rows.push(<ElementNavigatorFieldRow key={"name"} label={"name"} value={this.props.type.developerName} />);
        rows.push(<ElementNavigatorFieldRow key={"id"} label={"id"} value={this.props.type.id} />);
        rows.push(<ElementNavigatorProperties key={"props"} field={this.props.field} type={this.props.type} parent={this} root={this.props.root} />);
        
        return(
            <div className="entd">
                {rows}
            </div>
        );
    }
}