export class parameter {
  name: string;
  description: string;
  type: string;

  constructor(name: string, description: string, type: string) {
    this.name = name;
    this.description = description;
    this.type = type;
  }
}

export class suggestion {
  caption: string;
  method: string = "";
  className: string = "";
  description: string = "";
  returnType: string = "";
  parameters: Array<parameter> = [];

  constructor(caption: string, method: string, className: string, description: string, returnType: string, parameters: [parameter]) {
    this.caption = caption;
    this.method = method;
    this.className = className;
    this.description = description;
    this.returnType = returnType;
    this.parameters = parameters;
  }  
}

export default class ExpressionSuggester {

  private static methods: {[key: string] : suggestion} = {
    'state.getArray': new suggestion("state.getArray(fieldName)","state.getArray()","state","Gets the value of a list field from flow","StateObjectData array",[new parameter("fieldName", "The developer name of the flow field", "string")]),
    'state.getBooleanValue': new suggestion("state.getBooleanValue(fieldName)","state.getBooleanValue();","state","Gets the value of a boolean field from flow","boolean",[new parameter("fieldName", "The developer name of the flow field", "string")]),
    'state.getContentValue': new suggestion("state.getContentValue(fieldName)","state.getContentValue()","state","Gets the value of a content field from flow","string",[new parameter("fieldName", "The developer name of the flow field", "string")]),
    'state.getDateTime': new suggestion("state.getDateTime(fieldName)","state.getDateTime()","state","Gets the value of a date field from flow","javascript Date",[new parameter("fieldName", "The developer name of the flow field", "string")]),
    'state.getNumberValue': new suggestion("state.getNumberValue(fieldName)","state.getNumberValue()","state","Gets the value of a numeric field from flow","number",[new parameter("fieldName", "The developer name of the flow field", "string")]),
    'state.getObject': new suggestion("state.getObject(fieldName)","state.getObject()","state","Gets the value of an object field from flow","StateObjectData",[new parameter("fieldName", "The developer name of the flow field", "string")]),
    'state.getPasswordValue': new suggestion("state.getPasswordValue(fieldName)","state.getPasswordValue()","state","Gets the value of an password field from flow","string",[new parameter("fieldName", "The developer name of the flow field", "string")]),
    'state.getStringValue': new suggestion("state.getStringValue(fieldName)","state.getStringValue()","state","Gets the value of an object field from flow","string",[new parameter("fieldName", "The developer name of the flow field", "string")]),
    'state.getValue': new suggestion("state.getValue(fieldName)","state.getValue()","state","Gets a string representation of a field from flow","string",[new parameter("fieldName", "The developer name of the flow field", "string")]),
  
    'state.setArray': new suggestion("state.setArray(fieldName, StateObjectData[])","state.setArray()","state","Sets the value of a list field in flow","void",[new parameter("fieldName", "The developer name of the flow field", "string")]),
    'state.setBooleanValue': new suggestion("state.setBooleanValue(fieldName, boolean)","state.setBooleanValue();","state","Sets the value of a boolean field in flow","void",[new parameter("fieldName", "The developer name of the flow field", "string")]),
    'state.setContentValue': new suggestion("state.setContentValue(fieldName, string)","state.setContentValue()","state","Sets the value of a content field in flow","void",[new parameter("fieldName", "The developer name of the flow field", "string")]),
    'state.setDateTime': new suggestion("state.setDateTime(fieldName, dateTime)","state.setDateTime()","state","Sets the value of a date field in flow","void",[new parameter("fieldName", "The developer name of the flow field", "string")]),
    'state.setNumberValue': new suggestion("state.setNumberValue(fieldName, number)","state.setNumberValue()","state","Sets the value of a numeric field in flow","void",[new parameter("fieldName", "The developer name of the flow field", "string")]),
    'state.setObject': new suggestion("state.setObject(fieldName, StateObjectData)","state.setObject()","state","Sets the value of an object field in flow","void",[new parameter("fieldName", "The developer name of the flow field", "string")]),
    'state.setPasswordValue': new suggestion("state.setPasswordValue(fieldName, string)","state.setPasswordValue()","state","Sets the value of an password field in flow","void",[new parameter("fieldName", "The developer name of the flow field", "string")]),
    'state.setStringValue': new suggestion("state.setStringValue(fieldName, string)","state.setStringValue()","state","Sets the value of an object field in flow","void",[new parameter("fieldName", "The developer name of the flow field", "string")]),
    'state.setValue': new suggestion("state.setValue(fieldName, string)","state.setValue()","state","Sets a string representation of a field in flow","void",[new parameter("fieldName", "The developer name of the flow field", "string")])
 
  
  
  
  };
 
  public static suggestionsFor(inputValue: string, caretPosition2d: any) : Array<suggestion> {
    const suggestions: Array<suggestion> = [];
    Object.values(this.methods).forEach((method: suggestion) => {
      if((method.className.toLowerCase() + "." + method.method.toLowerCase()).startsWith(inputValue.toLowerCase()))
      {
        suggestions.push(method);
      }
    });
    
    return suggestions;
  }
}