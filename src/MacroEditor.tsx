import React from 'react';
import { GlobalMenuItem, eGlobalMenuItemType } from './GlobalMenuItem';
import { tenant, macro } from './JSONClasses';
import ModalDialog, { modalDialogButton } from './ModalDialog';
import { ElementNavigator } from './ElementNavigator/ElementNavigator';
import { ACEContainer } from './ACEContainer';
import { FlowCalls, callResult } from './FlowCalls';


class MacroEditor extends React.Component<any, any> {
    context: any;

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

    macroText: string = "";
    macroModified: boolean = false;

    constructor(props: any) {
        super(props);
        
        this.login = this.login.bind(this);
        this.connect = this.connect.bind(this);
        this.tenantSelected = this.tenantSelected.bind(this);
        this.closeDialog = this.closeDialog.bind(this);
        this.macroTextChanged = this.macroTextChanged.bind(this);
        this.saveMacro = this.saveMacro.bind(this);
        this.saveMacroAs = this.saveMacroAs.bind(this);
        this.newFlowTypeInstance = this.newFlowTypeInstance.bind(this);

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
                    switch(property.contentType) {
                        case "ContentList": 
                            property.contentValue = null;
                            property.objectData = [];
                            break;
                        case "ContentObject":
                            property.contentValue = null;
                            property.objectData = null;
                            break;
                        default:
                            property.contentValue = null;
                            property.objectData = null;
                    }
                    
                    value.properties.push(property);
                });
            }

            result=JSON.stringify(value,null,"\t");
        }
        

        return result;
    }

    async connect() {
        this.showDialog = true;
        this.dialogTitle = "Login to Flow";
        this.dialogButtons = [new modalDialogButton("login","Login","Connect to Flow", this.login),new modalDialogButton("cancel","Cancel","Cancel login",this.closeDialog)];
        this.dialogContent = (
            <div>
                <div className="modal-dialog-input-row">
                    <span className="modal-dialog-input-label">Username</span>
                    <input
                        id="userid"
                        className="modal-dialog-input"
                        type="text"
                        defaultValue={this.flowUID}
                        onChange={(e) => {this.flowUID = e.target.value}}
                    />
                </div> 
                <div className="modal-dialog-input-row">
                    <span className="modal-dialog-input-label">Password</span>
                    <input
                        id="password"
                        className="modal-dialog-input"
                        type="password"
                        defaultValue={this.flowPWD}
                        onChange={(e) => {this.flowPWD = e.target.value}}
                    />
                </div>  
            </div>
        );
        this.forceUpdate()
    }

    async login() {
        const result = await FlowCalls._connect(this.flowUID, this.flowPWD);
        if(result && result.result === true) {
            this.flowToken = result.data;
            this.closeDialog();
            await this.forceUpdate();
            const tenants : any = await FlowCalls._getTenants(this.flowToken);
            if(tenants.result === true) {
                this.flowTenants = tenants.data;
            }
        }
        else
        {
            this.closeDialog();
        }

        this.forceUpdate();
    }

    async tenantSelected(tenantId: string) {
        this.flowTenant = undefined;
        this.flowMacro = undefined;
        await this.forceUpdate();

        if(tenantId && tenantId.length > 0)
        {
            const result = await FlowCalls._selectTenant(this.flowToken, this.flowTenants[tenantId]);
            if(result.result === true) {
                const loadResult = await FlowCalls._loadTenant(this.flowToken,tenantId);
                if(loadResult.result === true) {
                    this.flowTypes = loadResult.data.types;
                    this.flowValues = loadResult.data.values;
                    this.flowMacros = loadResult.data.macros;
                    this.flowTenant = this.flowTenants[tenantId];
                }
            }
        }
        this.forceUpdate();
    }

    async macroSelected(macroId: string) {
        if(macroId && macroId.length > 0)
        {
            //draw macro
            this.flowMacro = this.flowMacros[macroId];
            this.macroText = this.flowMacro.code;
            this.macroModified = false;
        }
        this.forceUpdate();
    }

    macroTextChanged(newText: string) {
        if(this.macroText !== newText) {
            this.macroText = newText;
            this.macroModified = true;
            this.forceUpdate();
        }
    }

    saveMacro() {


        this.macroModified = false;
        this.forceUpdate();
    }

    saveMacroAs() {


        this.macroModified = false;
        this.forceUpdate();
    }
    

    

    disconnect() {
        this.flowToken = "";
        this.flowTenants = {};
        this.flowTenant = undefined;
        this.flowTypes = {};
        this.flowValues = {};
        this.flowMacros = {};
        this.flowMacro = undefined;

        console.log("Logged Out");
        this.forceUpdate();
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

        if(this.flowToken.length===0) {
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
                    suppressBlank={(this.flowTenant !== undefined) && (this.flowTenant.id.length > 0)}
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
        
        if(this.flowTenant) {

            let saveButton: any;
            if(this.flowMacro) {
                saveButton=(
                    <GlobalMenuItem 
                        key="save"
                        type={eGlobalMenuItemType.icon}
                        label="Save Macro"
                        tooltip="Save Macro"
                        highlight={this.macroModified}
                        onClick={(e: any) => {this.saveMacro()}}
                        icon="save"
                    />
                );
            }
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
                    {saveButton}
                    <GlobalMenuItem 
                        key="saveas"
                        type={eGlobalMenuItemType.icon}
                        label="Save Macro As"
                        tooltip="Save Macro As"
                        highlight={this.macroModified}
                        onClick={(e: any) => {this.saveMacroAs()}}
                        icon="star"
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
                        <ACEContainer macroText={this.macroText} parent={this} />
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
