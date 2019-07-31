import React from 'react';
import ace,  { Editor } from 'brace';
import AceEditor from "react-ace";
import 'brace/mode/javascript';
import "brace/snippets/javascript";
import "brace/ext/language_tools";
import 'brace/theme/monokai';
import ExpressionSuggester, { suggestion } from './ExpressionSuggester';
import { macro } from './JSONClasses';



//declare const ace: any;

export class ACEContainer extends React.Component<any, any> {
    context: any;

    constructor(props: any) {
        super(props);
    
        this.macroEditorLoaded = this.macroEditorLoaded.bind(this);
    }

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

    async macroContentChange(newValue: any) {
        //console.log(newValue);
    }

    macroEditorLoaded(e: Editor) {
          
        const snippetManager : any  = ace.acequire('ace/snippets').snippetManager;
        let langTools : any = ace.acequire('ace/ext/language_tools');

        
        const customSnippetText = [
        "snippet log",
        // eslint-disable-next-line
        "	console.log('${1:}');",
        "",
        "snippet bool",
        // eslint-disable-next-line
        "	var bool = state.getBooleanValue('{![${1:}]}');",
        "",
        "snippet while",
        // eslint-disable-next-line
        "	while(value1 === value2) {\n\t   doSomething();\n\t}",
        ""
        ].join('\n');

        const customSnippet = snippetManager.parseSnippetFile(customSnippetText, 'javascript');

        snippetManager.register(customSnippet, 'javascript');

        langTools.addCompleter(this.flowAutoComplete);
        
        //langTools.completers.push(this.flowAutoComplete);
        
        console.log("loaded");
        
    }

    render() {
        return (
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
                            value = {this.props.flowMacro? (this.props.flowMacro as macro).code : ""}
                            setOptions={{
                                enableBasicAutocompletion: true,
                                enableLiveAutocompletion: true,
                                enableSnippets: true,
                                showLineNumbers: true,
                                tabSize: 2,
                                }}
                        />
                    </div>
        );
    }

}