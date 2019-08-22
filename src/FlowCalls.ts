import {tenant, macro} from './JSONClasses';

export class callResult {
    result: boolean = false;
    message: string = "";
    data: any;

    static newInstance(result: boolean, message: string, data: any) {
        const obj: callResult = new callResult();
        obj.result = result;
        obj.message = message;
        obj.data = data;
        return obj;
    }
}

export class FlowCalls
{

    static flowBaseURL: string = "https://flow.manywho.com";
    static flowAuthEndpoint: string = "/api/draw/1/authentication";
    static flowGetTenantsEndpoint: string = "/api/admin/1/users/me";
    static flowSwitchTenantEndpoint: string = "/api/draw/1/authentication";
    static flowTypesEndpoint: string = "/api/draw/1/element/type";
    static flowValuesEndpoint: string = "/api/draw/1/element/value";
    static flowMacrosEndpoint: string = "/api/draw/1/element/macro";

    static async _connect(uid: string, pwd: string) : Promise<callResult> {

        let result: callResult = new callResult();
        
        let body = {
                "password": pwd,
                "username": uid
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
                const flowToken = await this._getBodyText(response);
                console.log(flowToken);
                result = callResult.newInstance(true,"connected", flowToken);
            }
            else {
                //error
                const errorText = await this._getBodyText(response);
                console.log("Logged In Error - " + errorText);
                result = callResult.newInstance(false,"not connected", errorText);
            }
        });
        return result;
    }

    static async _getTenants(flowToken: string) : Promise<callResult> {
        
        let result: callResult = new callResult();
        let json: string = "";
        const flowTenants: {[key: string]: tenant} = {};
 
        await fetch(this.flowBaseURL + this.flowGetTenantsEndpoint, 
            { 
                method: "GET", 
                headers: {
                    "Content-Type": "application/json", 
                    Authorization: flowToken
                }
        })
        .then(async (response: any) => {
            json = await this._getBodyText(response); 
        });
        const getTenantsResponse = JSON.parse(json);
        getTenantsResponse.tenants.forEach((tenant: tenant) => {
            flowTenants[tenant.id] = tenant;
        });

        result = callResult.newInstance(true,"",flowTenants);
        return result;
    }

    static async _selectTenant(flowToken: string, tenant: tenant) : Promise<callResult> {
        
        let result: callResult = new callResult();

        await fetch(this.flowBaseURL + this.flowSwitchTenantEndpoint + "/" + tenant.id, { 
            method: "GET",  
            headers: {
                "Content-Type": "application/json",
                Authorization: flowToken
            }
        })
        .then(async (response: any) => {
            if(response.status === 200) {
                console.log("Connected to tenant - " + tenant.developerName);
                result = callResult.newInstance(true,tenant.developerName,undefined);
            }
            else {
                //error
                const errorText = await this._getBodyText(response);result = callResult.newInstance(true,tenant.developerName,undefined);
                result = callResult.newInstance(false,errorText,undefined);
                console.log("Can't connect to tenant - " + errorText);
            }
        });
        return result;
    }

    static async _loadTenant(flowToken: string, tenantId: string) : Promise<callResult> {
        
        let result: callResult = new callResult();

        const types: callResult = await this._loadTypes(flowToken, tenantId);
        const values: callResult =await this._loadValues(flowToken, tenantId);
        const macros: callResult =await this._loadMacros(flowToken, tenantId);

        result = callResult.newInstance(true, "loaded", { types: types.data, values: values.data, macros: macros.data});
        return result;
    }

    static async _loadTypes(flowToken: string, tenantId: string) : Promise<callResult> {
        
        let result: callResult = new callResult();

        let success: boolean = false;
        const flowTypes : {[key: string]: any} = {};
        await fetch(this.flowBaseURL + this.flowTypesEndpoint, { 
            method: "GET",  
            headers: {
                "Content-Type": "application/json",
                Authorization: flowToken,
                "ManyWhoTenant": tenantId
            },
            credentials: "same-origin",
            
        })
        .then(async (response: any) => {
            if(response.status === 200) {
                const json = await this._getBodyText(response);
                
                JSON.parse(json).forEach((type : any) => {
                    flowTypes[type.id] = type;
                });;
                console.log("Loaded Types");
                result=callResult.newInstance(true, "types loaded", flowTypes);
            }
            else {
                //error
                const errorText = await this._getBodyText(response);
                console.log("Can't load types - " + errorText);
                result=callResult.newInstance(false, errorText, undefined);
            }
        });
        return result;
    }

    static async _loadValues(flowToken: string, tenantId: string) : Promise<callResult> {
        
        let result: callResult  = new callResult();

        const flowValues: {[key: string]: any} = {};
        
        await fetch(this.flowBaseURL + this.flowValuesEndpoint, { 
            method: "GET",  
            headers: {
                "Content-Type": "application/json",
                Authorization: flowToken,
                "ManyWhoTenant": tenantId
            },
            credentials: "same-origin",
            
        })
        .then(async (response: any) => {
            if(response.status === 200) {
                const json = await this._getBodyText(response);
                
                JSON.parse(json).forEach((value : any) => {
                    flowValues[value.id] = value;
                });;

                console.log("Loaded Values");
                result=callResult.newInstance(true, "values loaded", flowValues);
            }
            else {
                //error
                const errorText = await this._getBodyText(response);
                console.log("Can't load values - " + errorText);
                result=callResult.newInstance(false, errorText, undefined);
            }
        });
        return result;
    }

    static async _loadMacros(flowToken: string, tenantId: string) : Promise<callResult> {
        
        let result: callResult  = new callResult();

        const flowMacros: {[key: string]: any} = {};

        await fetch(this.flowBaseURL + this.flowMacrosEndpoint, { 
            method: "GET",  
            headers: {
                "Content-Type": "application/json",
                Authorization: flowToken,
                "ManyWhoTenant": tenantId
            },
            credentials: "same-origin",
            
        })
        .then(async (response: any) => {
            if(response.status === 200) {
                const json = await this._getBodyText(response);
                
                JSON.parse(json).forEach((macro : macro) => {
                    flowMacros[macro.id] = macro;
                });;

                console.log("Loaded Macros");
                result=callResult.newInstance(true, "macros loaded", flowMacros);
            }
            else {
                //error
                const errorText = await this._getBodyText(response);
                console.log("Can't load macros - " + errorText);
                result=callResult.newInstance(false, errorText, undefined);
            }
        });
        return result;
    }

    _saveMacro(macro: macro) {

    }

    static async _getBodyText(response: any) : Promise<string> {
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
}