import React from 'react';
import { GlobalMenuItem, eGlobalMenuItemType } from './GlobalMenuItem';
import { tenant, macro } from './JSONClasses';
import ModalDialog, { modalDialogButton } from './ModalDialog';
import ace,  { Editor } from 'brace';
import AceEditor from "react-ace";
import 'brace/mode/javascript';
import "brace/snippets/javascript";
import "brace/ext/language_tools";
import 'brace/theme/monokai';
import ExpressionSuggester, { suggestion } from './ExpressionSuggester';
import { ElementNavigator } from './ElementNavigator/ElementNavigator';



//declare const ace: any;

class MacroEditor extends React.Component<any, any> {
    context: any;

    connected: boolean = false;
    flowBaseURL: string = "https://flow.manywho.com";
    flowAuthEndpoint: string = "/api/draw/1/authentication";
    flowGetTenantsEndpoint: string = "/api/admin/1/users/me";
    flowSwitchTenantEndpoint: string = "/api/draw/1/authentication";
    flowTypesEndpoint: string = "/api/draw/1/element/type";
    flowValuesEndpoint: string = "/api/draw/1/element/value";
    flowMacrosEndpoint: string = "/api/draw/1/element/macro";

    flowUID: string = "";
    flowPWD: string = "";
    flowToken: string = "";
    flowTenants: {[key: string]: any} = {};
    flowTenant: tenant | undefined ;
    flowMacro: macro | undefined;

    flowTypes: {[key: string]: any} = {};
    flowValues: {[key: string]: any} = {};
    flowMacros: {[key: string]: macro} = {};

    flowError: string = "";
    errorText: string = "";

    showDialog: boolean = false;
    dialogTitle: string = "";
    dialogButtons: Array<modalDialogButton> = [];
    dialogContent: any;

    flowAutoComplete = {
        // eslint-disable-next-line
        identifierRegexps: [/[a-zA-Z_0-9\.\$\-\u00A2-\uFFFF]/],
        getCompletions: function (editor: any, session: any, caretPosition2d: any, prefix: any, callback: any) {
          const suggestions: Array<suggestion> = ExpressionSuggester.suggestionsFor(prefix, caretPosition2d);
          callback(null, suggestions.map((s : suggestion) => {
            //unfortunately Ace treats `#` as special case, we have to remove `#` from suggestions or it will be duplicated
            //maybe it depends on language mode?
    
            return {
                caption: s.caption,
                value: s.method, 
                score: 1, 
                meta: s.returnType, 
                description: s.description, 
                parameters: s.parameters, 
                returnType: s.returnType
            };
          }))
        }
        /*,
        getDocTooltip: (item: any) => {
            if (item.description || item.parameters.length > 0) {
                const paramsSignature = item.parameters.map((p : any) => {
                    ProcessUtils.humanReadableType(p.refClazz) + " " + p.name).join(", ")
                const javaStyleSignature = `${item.returnType} ${item.name}(${paramsSignature})`
                item.docHTML = ReactDOMServer.renderToStaticMarkup((
                <div className="function-docs">
                    <b>{javaStyleSignature}</b>
                    <hr/>
                    <p>{item.description}</p>
                </div>
                ));
            }
        }
        */
    }

    constructor(props: any) {
        super(props);
        this._connect = this._connect.bind(this);
        this._getTenants = this._getTenants.bind(this);
        this._getBodyText = this._getBodyText.bind(this);
        this._loadTenant = this._loadTenant.bind(this);
        this._loadTypes = this._loadTypes.bind(this);

        this.connect = this.connect.bind(this);
        this.tenantSelected = this.tenantSelected.bind(this);
        this.closeDialog = this.closeDialog.bind(this);

        this.newFlowTypeInstance = this.newFlowTypeInstance.bind(this);

        this.macroEditorLoaded = this.macroEditorLoaded.bind(this);
    }

    //this creates a new type JSON from a type ID
    newFlowTypeInstance(typeId: string) : string {
        let result: string = "type not found";
        if(this.flowTypes[typeId])
        {
            const type = JSON.parse(JSON.stringify(this.flowTypes[typeId]));

            const value: any = {};
            value.typeElementDeveloperName = type.developerName;
            value.typeElementId=type.id;
            value.properties = [];

            if(type.properties) {
                type.properties.forEach((prop: any) => {
                    const property : any = {};
                    property.contentFormat = prop.contentFormat;
                    property.contentType = prop.contentType;
                    property.developerName = prop.developerName;
                    value.properties.push(property);
                });
            }

            result=JSON.stringify(value,null,"\t");
        }
        

        return result;
    }

    async connect() {
        if (await this._connect() === true) {
            if(await this._getTenants()) {
                //in and list got
            }
        }

        this.forceUpdate();
    }

    async tenantSelected(tenantId: string) {
        this.flowTenant = undefined;
        this.flowMacro = undefined;
        await this.forceUpdate();


        if(tenantId && tenantId.length > 0)
        {
            if (await this._selectTenant(tenantId) === true)
            {
                await this._loadTenant();
            }
        }
        this.forceUpdate();
    }

    async macroSelected(macroId: string) {
        if(macroId && macroId.length > 0)
        {
            //draw macro
            this.flowMacro = this.flowMacros[macroId];
        }
        this.forceUpdate();
    }

    async macroContentChange(newValue: any) {
        //console.log(newValue);
    }

    macroEditorLoaded(e: Editor) {
  
        //const customMode = new FlowCustomRules();
        //e.getSession().setMode(customMode);
        //e.getSession().com

        

        
        const snippetManager : any  = ace.acequire('ace/snippets').snippetManager;
        let langTools : any = ace.acequire('ace/ext/language_tools');

        
        const customSnippetText = [
        "snippet log",
        // eslint-disable-next-line
        "	console.log('${1:}');",
        "",
        "snippet bool",
        // eslint-disable-next-line
        "	var bool = state.getBooleanValue('${1:}');",
        ""
        ].join('\n');

        const customSnippet = snippetManager.parseSnippetFile(customSnippetText, 'javascript');

        snippetManager.register(customSnippet, 'javascript');

        langTools.addCompleter(this.flowAutoComplete);
        
        //langTools.completers.push(this.flowAutoComplete);
        
        console.log("loaded");

        
    }

    async _connect() : Promise<boolean> {

        let body = {
                "password": this.flowPWD,
                "username": this.flowUID
        };
        
        let success: boolean = true;

        await fetch(this.flowBaseURL + this.flowAuthEndpoint, { 
            method: "POST", 
            body: JSON.stringify(body), 
            headers: {"Content-Type": "application/json"}, 
            credentials: "same-origin"
        })
        .then(async (response: any) => {
            if(response.status === 200) {
                this.flowToken = await this._getBodyText(response);
                console.log(this.flowToken)
                success = true;
                this.connected = true;
            }
            else {
                //error
                this.errorText = await this._getBodyText(response);
                console.log("Logged In - " + this.errorText);
                success = false;
                this.connected = false;
            }
        });
        return success;
    }

    disconnect() {
        this.connected = false;
        this.flowToken = "";
        this.flowTenants = [];
        this.flowTenant = undefined;
        this.flowTypes = [];
        this.flowMacro = undefined;

        console.log("Logged Out");
        this.forceUpdate();
    }

    async _getTenants() : Promise<boolean> {
        let json: string = "";
        this.flowTenants = {};
        await fetch(this.flowBaseURL + this.flowGetTenantsEndpoint, 
            { 
                method: "GET", 
                headers: {
                    "Content-Type": "application/json", 
                    Authorization: this.flowToken
                }
        })
        .then(async (response: any) => {
            json = await this._getBodyText(response); 
        });
        const getTenantsResponse = JSON.parse(json);
        getTenantsResponse.tenants.forEach((tenant: tenant) => {
            this.flowTenants[tenant.id] = tenant;
        });
        return true;
    }

    async _selectTenant( tenantId: string) : Promise<boolean> {

        let success: boolean = false;
        await fetch(this.flowBaseURL + this.flowSwitchTenantEndpoint + "/" + tenantId, { 
            method: "GET",  
            headers: {
                "Content-Type": "application/json",
                Authorization: this.flowToken
            }
        })
        .then(async (response: any) => {
            if(response.status === 200) {
                this.flowTenant = this.flowTenants[tenantId];
                console.log("Connected to tenant - " + (this.flowTenant as tenant).developerName);
                success = true;
            }
            else {
                //error
                this.errorText = await this._getBodyText(response);
                this.flowTenant = undefined;
                console.log("Can't connect to tenant - " + this.errorText);
                success = false;
            }
        });
        return success;
    }

    async _loadTenant() : Promise<boolean> {
        await this._loadTypes();
        await this._loadValues();
        await this._loadMacros();
        return true;
    }

    async _loadTypes() : Promise<boolean> {
        let success: boolean = false;
        this.flowTypes = {};
        await fetch(this.flowBaseURL + this.flowTypesEndpoint, { 
            method: "GET",  
            headers: {
                "Content-Type": "application/json",
                Authorization: this.flowToken,
                "ManyWhoTenant": (this.flowTenant as tenant).id
            },
            credentials: "same-origin",
            
        })
        .then(async (response: any) => {
            if(response.status === 200) {
                const json = await this._getBodyText(response);
                
                JSON.parse(json).forEach((type : any) => {
                    this.flowTypes[type.id] = type;
                });;

                console.log("Loaded Types");
                success = true;
            }
            else {
                //error
                this.errorText = await this._getBodyText(response);
                console.log("Can't load types - " + this.errorText);
                success = false;
            }
        });
        return success;
    }

    async _loadValues() : Promise<boolean> {
        let success: boolean = false;
        this.flowValues = {};
        await fetch(this.flowBaseURL + this.flowValuesEndpoint, { 
            method: "GET",  
            headers: {
                "Content-Type": "application/json",
                Authorization: this.flowToken,
                "ManyWhoTenant": (this.flowTenant as tenant).id
            },
            credentials: "same-origin",
            
        })
        .then(async (response: any) => {
            if(response.status === 200) {
                const json = await this._getBodyText(response);
                
                JSON.parse(json).forEach((value : any) => {
                    this.flowValues[value.id] = value;
                });;

                console.log("Loaded Values");
                success = true;
            }
            else {
                //error
                this.errorText = await this._getBodyText(response);
                console.log("Can't load values - " + this.errorText);
                success = false;
            }
        });
        return success;
    }

    async _loadMacros() : Promise<boolean> {
        let success: boolean = false;
        this.flowMacros = {};
        await fetch(this.flowBaseURL + this.flowMacrosEndpoint, { 
            method: "GET",  
            headers: {
                "Content-Type": "application/json",
                Authorization: this.flowToken,
                "ManyWhoTenant": (this.flowTenant as tenant).id
            },
            credentials: "same-origin",
            
        })
        .then(async (response: any) => {
            if(response.status === 200) {
                const json = await this._getBodyText(response);
                
                JSON.parse(json).forEach((macro : macro) => {
                    this.flowMacros[macro.id] = macro;
                });;

                console.log("Loaded Macros");
                success = true;
            }
            else {
                //error
                this.errorText = await this._getBodyText(response);
                console.log("Can't load macros - " + this.errorText);
                success = false;
            }
        });
        return success;
    }

    _saveMacro(macro: macro) {

    }

    async _getBodyText(response: any) : Promise<string> {
        return response.text()
        .then((text : string) => {
            if(text.startsWith("\"")) {
                text = text.substr(1);
            }
            if(text.endsWith("\"")) {
                text = text.substr(0, text.length-1);
            }
            return text;
        })
    }

    closeDialog() {
        this.dialogTitle = "";
        this.dialogButtons = [];
        this.dialogContent = null;
        this.showDialog = false;
        this.forceUpdate();
    }
    

    render() {

        const menuItems: Array<JSX.Element> = [];

        if(this.connected === false) {
            menuItems.push(
                <GlobalMenuItem 
                    key="Connect"
                    type={eGlobalMenuItemType.icon}
                    label="Connect"
                    tooltip="Connect to Flow"
                    onClick={(e: any) => {this.connect()}}
                    icon="log-in"
                />
            );
        }
        else {
            menuItems.push(
                <GlobalMenuItem 
                    key="Select Tenant"
                    type={eGlobalMenuItemType.combo}
                    suppressBlank={this.flowTenant}
                    label="Select Tenant"
                    tooltip="Select a Tenant"
                    data={this.flowTenants}
                    onChange={(tenantId: string) => {this.tenantSelected(tenantId)}}
                    icon="cloud"
                />
            );

            menuItems.push(
                <GlobalMenuItem 
                    key="Disconnect"
                    type={eGlobalMenuItemType.icon}
                    label="Disconnect"
                    tooltip="Disconnect from Flow"
                    onClick={(e: any) => {this.disconnect()}}
                    icon="log-out"
                />
            );
        }

        let dialog: any;
        if(this.showDialog === true) {
            dialog = (
                <ModalDialog 
                    title={this.dialogTitle} 
                    buttons={this.dialogButtons}
                    onClose={this.closeDialog}
                >
                    {this.dialogContent}
                </ModalDialog>
            );
        }

        //if there's a tenant loaded then show body 
        let bodyToolbar: any;
        let editor: any;
        /*
        if(this.flowTenant) {
            bodyToolbar = (
                <div 
                    className="me-body-toolbar"
                >
                    <GlobalMenuItem 
                        key="macros"
                        type={eGlobalMenuItemType.combo}
                        suppressBlank={(this.flowMacro !== undefined) && (this.flowMacro.id.length > 0)}
                        label="Select Macro"
                        tooltip="Select a Macro"
                        data={this.flowMacros}
                        onChange={(macroId: string) => {this.macroSelected(macroId)}}
                    />
                </div>
            );
        }
*/
        if(this.flowTenant) {

            bodyToolbar = (
                <div 
                    className="me-body-toolbar"
                >
                    <GlobalMenuItem 
                        key="macros"
                        type={eGlobalMenuItemType.combo}
                        suppressBlank={(this.flowMacro !== undefined) && (this.flowMacro.id.length > 0)}
                        label="Select Macro"
                        tooltip="Select a Macro"
                        data={this.flowMacros}
                        onChange={(macroId: string) => {this.macroSelected(macroId)}}
                    />
                </div>
            );

            editor = (
                <div className="me-macro-editor">
                    <div className="me-toolbox">
                        <ElementNavigator 
                            parent={this} 
                        />
                    </div>
                    <div
                        className="ace"
                    >
                        <div className="ace-header">
                            {bodyToolbar}
                        </div>
                        <div className="ace-body">
                            <AceEditor
                                width="100%"
                                height="100%"
                                className="ace"
                                mode="javascript"
                                theme="monokai"
                                onChange={(newValue: any) => (this.macroContentChange(newValue))}
                                onLoad={(e: any) => {this.macroEditorLoaded(e)}}
                                showPrintMargin={false}
                                name="UNIQUE_ID_OF_DIV"
                                editorProps={{ $blockScrolling: true }}
                                value = {this.flowMacro? (this.flowMacro as macro).code : ""}
                                setOptions={{
                                    enableBasicAutocompletion: true,
                                    enableLiveAutocompletion: true,
                                    enableSnippets: true,
                                    showLineNumbers: true,
                                    tabSize: 2,
                                    }}
                            />
                        </div>
                    </div>
                </div>
                
            );
        }
        


        return (
            <div 
                className="me"
            >
                {dialog}
                <div
                    className="me-toolbar"
                >
                    <div 
                        className="me-toolbar-banner"
                    >
                        <span
                            className="me-toolbar-banner-label"
                        >
                            Boomi Flow Macro Editor
                        </span>
                    </div>
                    <div 
                        className="me-toolbar-tools"
                    >
                        {menuItems}
                    </div>
                </div>
                <div
                    className="me-body"
                >  
                    {editor}
                </div>
                <div
                    className="me-footer"
                >
                    <span
                        className="me-footer-label"
                    >
                        © Boomi Flow 2019
                    </span>
                </div>
            </div>
        )
    }
}

export default MacroEditor;
