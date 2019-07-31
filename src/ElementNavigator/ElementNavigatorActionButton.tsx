import React from 'react';
import "../css/ElementNavigator.css";

export class ElementNavigatorActionButton extends React.Component<any, any> {
    context: any;

    constructor(props: any) {
        super(props);
        this.click = this.click.bind(this);
    }

    render() {

        let buttonClass: string = "enab glyphicon glyphicon-";
        let title: string = "";
        switch(this.props.action) {
            case "getter":
                buttonClass += "import";
                title = "Copy getter to clipboard";
                break;
            
            case "setter":
                buttonClass += "export";
                title = "Copy setter to clipboard";
                break;

            case "id": 
                buttonClass += "info-sign";
                title = "Copy ID to clipboard";
                break;

            case "name": 
                buttonClass += "sd-video";
                title = "Copy developerName to clipboard";
                break;
            
            case "new": 
                buttonClass += "star";
                title = "Create new instance of type";
                break;

            case "append": 
                buttonClass += "step-backward";
                title = "Coppy appender to clipboard";
                break;
                   
        }

        return (
            <span className={buttonClass} title={title}  onClick={(e: any) => { this.click(e)}} />
        );
    }

    click(e: any) {

        let direction: string = "";
        let args: string = "";
        let parent: string="";
        let field:string="";

        let type: string="";
        let clip: string="";


        if(this.props.field) {
            parent="[" + this.props.field.developerName + "]."; 
        }
        field="[" + this.props.element.developerName+ "]";

        switch(this.props.action) {
            case "getter": 
                direction="get";
                args="('{!" + parent + field + "}')";
                break;
        
            case "setter":
                direction="set";
                args="('{!" + parent + field + "}', newValue)";
                break;

            case "append":
                    direction="get";
                    args="('{!" + parent + field + "}', newValue)";
                    break;

        }

        switch(this.props.action) {
            case "getter": 
            case "setter":
                    switch(this.props.element.contentType) {
                        case "ContentList":
                                type = "Array";
                                break;
                        
                        case "ContentContent":
                                type = "ContentValue";
                                break;
            
                        case "ContentString":
                                type = "StringValue";
                                break;
            
                        case "ContentNumber":
                                type = "NumberValue";
                                break;
            
                        case "ContentBoolean":
                                type = "BooleanValue";
                                break;
            
                        case "ContentDateTime":
                                type = "DateTimeValue";
                                break;
            
                        case "ContentPassword":
                                type = "PasswordValue";
                                break;
            
                        case "ContentObject":
                                type = "Object";
                                break;
                    
                        default:
                                type="Value";
                                break;
            
            
                    }
            
                    clip = "state." + direction + type + args + ";";

                    break;
                
                case "id":
                    clip = this.props.element.id;
                    break;

                case "name":
                    clip = this.props.element.developerName;
                    break;

                case "new":
                    clip=this.props.root.newFlowTypeInstance(this.props.element.id);
                    break;

                case "append":
                        type = "Array";
                        clip = "state." + direction + type + args + ".push(newVal);";
                        break;

        }       
        console.log(clip);
        navigator.clipboard.writeText(clip);

    }
}