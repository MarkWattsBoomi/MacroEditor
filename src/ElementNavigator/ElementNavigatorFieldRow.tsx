import React from 'react';
import "../css/ElementNavigator.css";

export class ElementNavigatorFieldRow extends React.Component<any, any> {
    context: any;

    expanded: boolean = false;
   
    render() {

        return(
                <div
                    className="enfd-row"
                >
                    <div className={"enfd-label"}>
                        <span  >
                            {this.props.label + ":"}
                        </span>
                    </div>
                    <div className={"enfd-value"}>
                        <span  >
                            {this.props.value}
                        </span>
                    </div>
                    {this.props.children}
                </div>
   
        );
    }

    toggleExpand(e: any) {
        this.expanded = !this.expanded;
        this.forceUpdate();
    }
}