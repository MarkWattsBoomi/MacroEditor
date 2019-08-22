import React from 'react';

export enum eGlobalMenuItemType {
    icon,
    link,
    label,
    combo
}

export class GlobalMenuItem extends React.Component<any, any> {
    context: any;

    constructor(props: any) {
        super(props);

        this.click=this.click.bind(this);
        this.change=this.change.bind(this);
    }

    render() {

        let content: any;
        let itemClass: string = "";
        
        switch(this.props.type as eGlobalMenuItemType) {
            
            case eGlobalMenuItemType.icon: 
                itemClass="me-gmi-icon ";
                if(this.props.highlight && this.props.highlight===true) {
                    itemClass += "me-gmi-icon-highlight "
                }
                content=(
                    <span 
                        className={itemClass + "glyphicon glyphicon-" + this.props.icon}
                    />
                );
                break;

            case eGlobalMenuItemType.link:
            case eGlobalMenuItemType.label:
                itemClass="me-gmi-text ";
                if(this.props.highlight && this.props.highlight===true) {
                    itemClass += "me-gmi-text-highlight "
                }
                content=(
                    <span
                        className={itemClass}
                    >
                        {this.props.label}
                    </span>
                );
                break;

            case eGlobalMenuItemType.combo:
                //data will have a list of tenants
                const options = [];
                if(this.props.suppressBlank === false) {
                    options.push(
                        <option 
                            key={"#"}
                            data-key=""
                        >
                            {"Please select"}
                        </option>
                    );
                }
                if(this.props.data) {
                    Object.values(this.props.data).forEach((item : any) => {                    
                        options.push(
                            <option 
                                key={item.id}
                                data-key={item.id}
                            >
                                {item.developerName }
                            </option>
                        );
                    });
                }
                content=(
                    <select
                        className="me-gmi-combo"
                        onChange={(e: any) => { this.change(e)}}
                        onFocus={(e: any) => {e.target.selectedIndex = -1}}
                    >
                        {options}
                    </select>
                );                
        }
        

        return(
            <div
                className="me-gmi"
                onClick={(e: any) => { this.click(e)}}
                title={this.props.tooltip}
            >
                {content}
            </div>
        );
    }

    click(e: any) {
        if(this.props.onClick) {
            this.props.onClick(e);
        }
    }

    change(e: any) {
        if(this.props.onChange) {
            const key = e.target.options[e.target.selectedIndex].attributes["data-key"].value;
            this.props.onChange(key);
        }
    }
}