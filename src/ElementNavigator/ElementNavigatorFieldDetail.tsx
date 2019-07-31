import React from 'react';
import "../css/ElementNavigator.css";
import { ElementNavigatorType } from './ElementNaviagtorType';
import { ElementNavigatorFieldRow } from './ElementNavigatorFieldRow';
import MacroEditor from '../MacroEditor';

export class ElementNavigatorFieldDetail extends React.Component<any, any> {
    context: any;

    expanded: boolean = false;
    
    render() {

        const rows = [];
        rows.push(<ElementNavigatorFieldRow key={"name"} label={"name"} value={this.props.field.developerName} />);
        rows.push(<ElementNavigatorFieldRow key={"id"}label={"id"} value={this.props.field.id} />);
        rows.push(<ElementNavigatorFieldRow key={"content"} label={"contentType"} value={this.props.field.contentType} />);

        const typeElementId = this.props.field.typeElementId;
        const type = (this.props.root as MacroEditor).flowTypes[typeElementId];
        
        switch(this.props.field.contentType) {
            case "ContentObject":
                    rows.push(<ElementNavigatorType key={"contentObject"} field={this.props.field} type={type} root={this.props.root}/>);
                break;

            case "ContentList":
                    rows.push(<ElementNavigatorType key={"contentObject"} field={this.props.field} type={type} root={this.props.root}/>);
                break;

            default:
                    
                break;
        }

        return(
            <div className="enfd">
                {rows}
            </div>
        );
    }
}