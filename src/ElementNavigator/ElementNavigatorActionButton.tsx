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

        }

        switch(this.props.action) {
            case "getter": 
            case "setter":

                    switch(this.props.element.contentType) {
                        case "ContentList":
                            clip = "Array";
                            break;
                        
                        case "ContentContent":
                                clip = "ContentValue";
                                break;
            
                        case "ContentString":
                            clip = "StringValue";
                            break;
            
                        case "ContentNumber":
                            clip = "NumberValue";
                            break;
            
                        case "ContentBoolean":
                                clip = "BooleanValue";
                                break;
            
                        case "ContentDateTime":
                                clip = "DateTimeValue";
                                break;
            
                        case "ContentPassword":
                                clip = "PasswordValue";
                                break;
            
                        case "ContentObject":
                                clip = "Object";
                                break;
                    
                        default:
                                clip="Value";
                                break;
            
            
                    }
            
                    clip = "state." + direction + clip + args + ";";

                    break;
                
                case "id":
                    clip = this.props.element.id;
                    break;

                case "name":

                    clip = this.props.element.developerName;
                    break;

        }       

        navigator.clipboard.writeText(clip);

    }
}