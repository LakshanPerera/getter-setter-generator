// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "getter-setter-generator" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let generateGetterSetter = vscode.commands.registerCommand('extension.generateGetterSetter', function () {
		// get the currently open file
		const editor = vscode.window.activeTextEditor;


		// if no editor is open, do nothing
		if (!editor) {
			return;
		}

		let language = vscode.window.activeTextEditor.document.languageId;

		const hasSelection = !editor.selection.isEmpty;

		// check if the user selected something, otherwise display error message
		if (hasSelection) {

			let text = editor.document.getText(editor.selection);
			let generatedCode;

			if (language === 'java') {
				generatedCode = generateGetterSetterJava(text, "both");				
			} else if (language === 'php') {
				generatedCode = generateGetterSetterPhp(text, "both");								
			} else if (language === 'python') {
				generatedCode = generateGetterSetterPython(text, "both");
			} else if (language === 'cpp') {
				generatedCode = generateGetterSetterCPP(text, "both");
			} else if (language === 'javascript') {
				generatedCode = generateGetterSetterJavaScript(text, "both");
			} else if (language === 'typescript') {
				generatedCode = generateGetterSetterTypeScript(text, "both");
			} else {
				vscode.window.showInformationMessage('Language currently unknown, please submit an Issue for this package!')
			}

			// gets the current editor and appends the getters/setters 
			editor.edit(
				edit => editor.selections.forEach(
					selection => {
						edit.insert(selection.end, generatedCode); // C# -> replace selection
					}
				)
			);

			vscode.window.showInformationMessage('Getter/Setter were generated');
		} else {
			vscode.window.showErrorMessage('Nothing was selected!');
		}
	});

	let generateGetter = vscode.commands.registerCommand('extension.generateGetter', function () {
		// get the currently open file
		const editor = vscode.window.activeTextEditor;


		// if no editor is open, do nothing
		if (!editor) {
			return;
		}

		let language = vscode.window.activeTextEditor.document.languageId;

		const hasSelection = !editor.selection.isEmpty;

		// check if the user selected something, otherwise display error message
		if (hasSelection) {

			let text = editor.document.getText(editor.selection);
			let generatedCode;

			if (language === 'java') {
				generatedCode = generateGetterSetterJava(text, "getter");				
			} else if (language === 'php') {
				generatedCode = generateGetterSetterPhp(text, "getter");								
			} else if (language === 'python') {
				generatedCode = generateGetterSetterPython(text, "getter");
			} else if (language === 'cpp') {
				generatedCode = generateGetterSetterCPP(text, "getter");
			} else if (language === 'javascript') {
				generatedCode = generateGetterSetterJavaScript(text, "getter");
			} else if (language === 'typescript') {
				generatedCode = generateGetterSetterTypeScript(text, "getter");
			} else {
				vscode.window.showInformationMessage('Language currently unknown, please submit an Issue for this package!')
			}

			// gets the current editor and appends the getters/setters 
			editor.edit(
				edit => editor.selections.forEach(
					selection => {
						edit.insert(selection.end, generatedCode); // C# -> replace selection
					}
				)
			);

			vscode.window.showInformationMessage('Getter/Setter were generated');
		} else {
			vscode.window.showErrorMessage('Nothing was selected!');
		}
	});

	let generateSetter = vscode.commands.registerCommand('extension.generateSetter', function () {
		// get the currently open file
		const editor = vscode.window.activeTextEditor;


		// if no editor is open, do nothing
		if (!editor) {
			return;
		}

		let language = vscode.window.activeTextEditor.document.languageId;

		const hasSelection = !editor.selection.isEmpty;

		// check if the user selected something, otherwise display error message
		if (hasSelection) {

			let text = editor.document.getText(editor.selection);
			let generatedCode;

			if (language === 'java') {
				generatedCode = generateGetterSetterJava(text, "setter");				
			} else if (language === 'php') {
				generatedCode = generateGetterSetterPhp(text, "setter");								
			} else if (language === 'python') {
				generatedCode = generateGetterSetterPython(text, "setter");
			} else if (language === 'cpp') {
				generatedCode = generateGetterSetterCPP(text, "setter");
			} else if (language === 'javascript') {
				generatedCode = generateGetterSetterJavaScript(text, "setter");
			} else if (language === 'typescript') {
				generatedCode = generateGetterSetterTypeScript(text, "setter");
			} else {
				vscode.window.showInformationMessage('Language currently unknown, please submit an Issue for this package!')
			}

			// gets the current editor and appends the getters/setters 
			editor.edit(
				edit => editor.selections.forEach(
					selection => {
						edit.insert(selection.end, generatedCode); // C# -> replace selection
					}
				)
			);

			vscode.window.showInformationMessage('Getter/Setter were generated');
		} else {
			vscode.window.showErrorMessage('Nothing was selected!');
		}
	});


	context.subscriptions.push(generateGetterSetter);
	context.subscriptions.push(generateGetter);
	context.subscriptions.push(generateSetter);
}
exports.activate = activate;

/**
 * @typedef {"both" | "getter" | "setter"} returnableType 
 */

/**
 * 
 * @param {String} text the selected Java code which will be used to generate the getters/setters
 * @param {String} returnableType returns either a getter, setter or both
 * @returns {String} String that contains the generated getters/setters 
 */
function generateGetterSetterJava(text, returnableType) {
	let selectedTextArray = text.split('\r\n').filter(e => e); //removes empty array values (line breaks)
	let generatedCode = '';

	for (const text of selectedTextArray) {
		let selectedText, indentSize, variableType, variableName;

		selectedText = text.replace(';', '').trim(); //removes all semicolons 
		indentSize = text.split(selectedText.charAt(0))[0]; //get the indent size for proper formatting

		// java modifier: public, private, static, asset, final, ...
		// TODO use modifier
		let hasModifier = selectedText.split(' ').length == 3;

		if (hasModifier) {
			variableType = selectedText.split(' ')[1];
			variableName = selectedText.split(' ')[2];
		} else {
			variableType = selectedText.split(' ')[0];
			variableName = selectedText.split(' ')[1];
		}

		if (variableName === null || variableName === undefined) {
			vscode.window.showErrorMessage('Faulty Selection. Please make sure you select a Java variable.')
			return; 
		}

		let code = '';
		
		if (returnableType === "both") {
			let getter = generateGetterJava(indentSize, variableType, variableName);
			let setter = generateSetterJava(indentSize, variableType, variableName);				
		
			code = getter + setter;		
		} else if (returnableType === "getter"){
			let getter = generateGetterJava(indentSize, variableType, variableName);
		
			code = getter;			
		} else if (returnableType === "setter"){
			let setter = generateSetterJava(indentSize, variableType, variableName);

			code = setter;			
		}

		generatedCode += code; //append the code for each selected line

	}

	return generatedCode;
}

/**
 * 
 * @param {String} indentSize 
 * @param {String} variableType 
 * @param {String} variableName 
 * 
 * @returns Java Getter
 */
function generateGetterJava(indentSize, variableType, variableName) {
	let variableNameUp = variableName.charAt(0).toUpperCase() + variableName.slice(1);

	let code =
		`
\n${indentSize}public ${variableType} get${variableNameUp}() {
${indentSize}\treturn this.${variableName};
${indentSize}}`
	return code;
}

/**
 * 
 * @param {String} indentSize 
 * @param {String} variableType 
 * @param {String} variableName 
 * 
 * @returns Java Setter
 */
function generateSetterJava(indentSize, variableType, variableName) {
	let variableNameUp = variableName.charAt(0).toUpperCase() + variableName.slice(1);

	let code =
		`
${indentSize}public void set${variableNameUp}(${variableType} ${variableName}) {
${indentSize}\tthis.${variableName} = ${variableName};
${indentSize}}
`
	return code;
}

/**
 * 
 * @param {String} text the selected PHP code which will be used to generate the getters/setters
 * @param {String} returnableType returns either a getter, setter or both
 * @returns {String} String that contains the generated getters/setters 
 */
function generateGetterSetterPhp(text, returnableType) {
	let hasSemicolon = text.includes(';');
	let selectedTextArray = text.split('\r\n').filter(e => e); //removes empty array values (line breaks)
	let generatedCode = '';

	for (const text of selectedTextArray) {
		let selectedText, indentSize, variableName;

		if (hasSemicolon) {
			selectedText = text.replace(';', '').trim(); //removes all semicolons 
			indentSize = text.split(selectedText.charAt(0))[0]; //get the indent size for proper formatting
		} else {
			selectedText = text.trim();
			indentSize = text.split(selectedText.charAt(0))[0];
		}

		let isConstructorVariable = selectedText.includes('$this->');

		if (isConstructorVariable) {

			// $this->edible = $edible;
			variableName = selectedText.split('>')[1].split(' ')[0];
		} else {

			// TODO use modifier
			// let hasModifier = selectedText.split(' ').length == 3;
			variableName = selectedText.split('$')[1];
		}

		if (variableName === null || variableName === undefined) {
			vscode.window.showErrorMessage('Faulty Selection. Please make sure you select a PHP variable.')
			return; 
		}

		let code = '';
		
		if (returnableType === "both") {
			let getter = generateGetterPhp(indentSize, variableName);
			let setter = generateSetterPhp(indentSize, variableName);				
		
			code = getter + setter;		
		} else if (returnableType === "getter"){
			let getter = generateGetterPhp(indentSize, variableName);
		
			code = getter;			
		} else if (returnableType === "setter"){
			let setter = generateSetterPhp(indentSize, variableName);

			code = setter;			
		}

		generatedCode += code; //append the code for each selected line

	}

	return generatedCode;
}

/**
 * 
 * @param {String} indentSize 
 * @param {String} variableName 
 * @returns PHP Getter
 * */
function generateGetterPhp(indentSize, variableName) {
	let variableNameUp = variableName.charAt(0).toUpperCase() + variableName.slice(1);

	let code =
		`
\n${indentSize}public function get${variableNameUp}() {
${indentSize}\treturn $this->${variableName};
${indentSize}}`
	return code;
}

/**
 * 
 * @param {String} indentSize 
 * @param {String} variableName 
 * @returns PHP Setter
 * */
function generateSetterPhp(indentSize, variableName) {
	let variableNameUp = variableName.charAt(0).toUpperCase() + variableName.slice(1);

	let code =
		`
\n${indentSize}public function set${variableNameUp}($${variableName}) {
${indentSize}\t$this->${variableName} = $${variableName};
${indentSize}\treturn $this;
${indentSize}}
`
	return code;
}

/**
 * 
 * @param {String} text the selected Python code which will be used to generate the getters/setters
 * @param {String} returnableType returns either a getter, setter or both
 * @returns {String} String that contains the generated getters/setters 
 */
function generateGetterSetterPython(text, returnableType) {
	let selectedTextArray = text.split('\r\n').filter(e => e); //removes empty array values (line breaks)
	let generatedCode = '';

	for (const text of selectedTextArray) {
		let selectedText, indentSize, variableName;

		selectedText = text.trim(); //removes all semicolons 
		indentSize = text.split(selectedText.charAt(0))[0]; //get the indent size for proper formatting
	

		let isConstructorVariable = selectedText.includes('self.');

		if (isConstructorVariable) {

			// $this->edible = $edible;
			variableName = selectedText.split('.')[1].split(' ')[0];
		} else {

			variableName = selectedText.split('=')[0].trim();
		}

		if (variableName === null || variableName === undefined) {
			vscode.window.showErrorMessage('Faulty Selection. Please make sure you select a PHP variable.')
			return; 
		}

		let code = '';
		if (returnableType === "both") {
			let getter = generateGetterPython(indentSize, variableName);
			let setter = generateSetterPython(indentSize, variableName);				
		
			code = getter + setter;		
		} else if (returnableType === "getter"){
			let getter = generateGetterPython(indentSize, variableName);
		
			code = getter;			
		} else if (returnableType === "setter"){
			let setter = generateSetterPython(indentSize, variableName);

			code = setter;			
		}
		generatedCode += code; //append the code for each selected line

	}

	return generatedCode;
}

/**
 * 
 * @param {String} indentSize 
 * @param {String} variableName 
 * @returns Python Getter
 * */
function generateGetterPython(indentSize, variableName) {
	let code =
		`\n${indentSize}def get_${variableName}(self):
${indentSize}\treturn self.${variableName}
${indentSize}`
	return code;
}

/**
 * 
 * @param {String} indentSize 
 * @param {String} variableName 
 * @returns Python Setter
 * */
function generateSetterPython(indentSize, variableName) {
	let code =
		`\n${indentSize}def set_${variableName}(self, ${variableName}) :
${indentSize}\tself.${variableName} = ${variableName}
`
	return code;
}

/**
 * 
 * @param {String} text the selected C++ code which will be used to generate the getters/setters
 * @param {String} returnableType returns either a getter, setter or both
 * @returns {String} String that contains the generated getters/setters 
 */
function generateGetterSetterCPP(text, returnableType) {
	let hasSemicolon = text.includes(';');
	let selectedTextArray = text.split('\r\n').filter(e => e); //removes empty array values (line breaks)
	let generatedCode = '';

	for (const text of selectedTextArray) {
		let selectedText, indentSize, variableName, variableType;

		if (hasSemicolon) {
			selectedText = text.replace(';', '').trim(); //removes all semicolons 
			indentSize = text.split(selectedText.charAt(0))[0]; //get the indent size for proper formatting
		} else {
			selectedText = text.trim();
			indentSize = text.split(selectedText.charAt(0))[0];
		}

		variableType = selectedText.split(' ')[0];
		variableName = selectedText.split(' ')[1];	

		if (variableName === null || variableName === undefined || variableType === null || variableType === undefined) {
			vscode.window.showErrorMessage('Faulty Selection. Please make sure you select a PHP variable.')
			return; 
		}

		let code = '';

		if (returnableType === "both") {
			let getter = generateGetterCPP(indentSize, variableName, variableType);
			let setter = generateSetterCPP(indentSize, variableName, variableType);				
		
			code = getter + setter;		
		} else if (returnableType === "getter"){
			let getter = generateGetterCPP(indentSize, variableName, variableType);
		
			code = getter;			
		} else if (returnableType === "setter"){
			let setter = generateSetterCPP(indentSize, variableName, variableType);

			code = setter;			
		}

		generatedCode += code; //append the code for each selected line

	}

	return generatedCode;
}

/**
 * 
 * @param {String} indentSize 
 * @param {String} variableName 
 * @returns C++ Getter
 * */
function generateGetterCPP(indentSize, variableName, variableType) {
	let variableNameUp = variableName.charAt(0).toUpperCase() + variableName.slice(1);

	let code =
		`
\n${indentSize}${variableType} get${variableNameUp}() {
${indentSize}\treturn this->${variableName};
${indentSize}}`
	return code;
}

/**
 * 
 * @param {String} indentSize 
 * @param {String} variableName 
 * @returns C++ Setter
 * */
function generateSetterCPP(indentSize, variableName, variableType) {
	let variableNameUp = variableName.charAt(0).toUpperCase() + variableName.slice(1);

	let code =
		`
${indentSize}void set${variableNameUp}(${variableType} ${variableName}) {
${indentSize}\tthis->${variableName} = ${variableName};
${indentSize}}
`
	return code;
}

/**
 * 
 * @param {String} text the selected Java code which will be used to generate the getters/setters
 * @param {String} returnableType returns either a getter, setter or both
 * @returns {String} String that contains the generated getters/setters 
 */
function generateGetterSetterJavaScript(text, returnableType) {
	let selectedTextArray = text.split('\r\n').filter(e => e); //removes empty array values (line breaks)
	let generatedCode = '';

	for (const text of selectedTextArray) {
		let selectedText, indentSize, variableName;

		selectedText = text.replace(';', '').trim(); //removes all semicolons 
		indentSize = text.split(selectedText.charAt(0))[0]; //get the indent size for proper formatting

		// java modifier: public, private, static, asset, final, ...
		// TODO use modifier
		let isConstructorVariable = selectedText.includes('.');

		if (isConstructorVariable) {
			// this.height = height;
			variableName = selectedText.split('.')[1].split(' ')[0];
		} else {
			// firstName: "John",
			variableName = selectedText.split(':')[0];
		}

		if (variableName === null || variableName === undefined) {
			vscode.window.showErrorMessage('Faulty Selection. Please make sure you select a Java variable.')
			return; 
		}

		let code = '';

		if (returnableType === "both") {
			let getter = generateGetterJavaScript(indentSize, variableName, isConstructorVariable);
			let setter = generateSetterJavaScript(indentSize, variableName, isConstructorVariable);				
		
			code = getter + setter;		
		} else if (returnableType === "getter"){
			let getter = generateGetterJavaScript(indentSize, variableName, isConstructorVariable);
		
			code = getter;			
		} else if (returnableType === "setter"){
			let setter = generateSetterJavaScript(indentSize, variableName, isConstructorVariable);

			code = setter;			
		}

		generatedCode += code; //append the code for each selected line

	}

	return generatedCode;
}

/**
 * 
 * @param {String} indentSize 
 * @param {String} variableName 
 * 
 * @returns Java Getter
 */
function generateGetterJavaScript(indentSize, variableName, isConstructorVariable) {
	let variableNameUp = variableName.charAt(0).toUpperCase() + variableName.slice(1);
	let code;

	if(isConstructorVariable){
		code = 			
			`
\n${indentSize}get${variableNameUp}() {
${indentSize}\treturn this.${variableName};
${indentSize}}`
	} else {
		code = 
			`
\n${indentSize}get${variableNameUp}: function() {
${indentSize}\treturn this.${variableName};
${indentSize}},`
	}
	return code;
}

/**
 * 
 * @param {String} indentSize 
 * @param {String} variableName 
 * 
 * @returns Java Setter
 */
function generateSetterJavaScript(indentSize, variableName, isConstructorVariable) {
	let variableNameUp = variableName.charAt(0).toUpperCase() + variableName.slice(1);
	let code;

	if(isConstructorVariable){
		code = 			
			`
\n${indentSize}set${variableNameUp}(${variableName}) {
${indentSize}\tthis.${variableName} = ${variableName};
${indentSize}}`
	} else {
		code = 
			`
\n${indentSize}set${variableNameUp}: function(${variableName}) {
${indentSize}\tthis.${variableName} = ${variableName};
${indentSize}},`
	}
	return code;
}

/**
 * 
 * @param {String} text the selected Java code which will be used to generate the getters/setters
 * @param {String} returnableType returns either a getter, setter or both
 * @returns {String} String that contains the generated getters/setters 
 */
function generateGetterSetterTypeScript(text, returnableType) {
	let selectedTextArray = text.split('\r\n').filter(e => e); //removes empty array values (line breaks)
	let generatedCode = '';

	for (const text of selectedTextArray) {
		let selectedText, indentSize, variableName;

		selectedText = text.replace(';', '').trim(); //removes all semicolons 
		indentSize = text.split(selectedText.charAt(0))[0]; //get the indent size for proper formatting

		// java modifier: public, private, static, asset, final, ...
		// TODO use modifier
		let isConstructorVariable = selectedText.includes('.');

		if (isConstructorVariable) {
			// this.height = height;
			variableName = selectedText.split('.')[1].split(' ')[0];
		} else {
			// firstName: "John",
			variableName = selectedText.split(':')[0];
		}

		if (variableName === null || variableName === undefined) {
			vscode.window.showErrorMessage('Faulty Selection. Please make sure you select a Java variable.')
			return; 
		}

		let code = '';

		if (returnableType === "both") {
			let getter = generateGetterTypeScript(indentSize, variableName);
			let setter = generateSetterTypeScript(indentSize, variableName);				
		
			code = getter + setter;		
		} else if (returnableType === "getter"){
			let getter = generateGetterTypeScript(indentSize, variableName);
		
			code = getter;			
		} else if (returnableType === "setter"){
			let setter = generateSetterTypeScript(indentSize, variableName);

			code = setter;			
		}

		generatedCode += code; //append the code for each selected line

	}

	return generatedCode;
}

/**
 * 
 * @param {String} indentSize 
 * @param {String} variableName 
 * 
 * @returns Java Getter
 */
function generateGetterTypeScript(indentSize, variableName) {
	let variableNameUp = variableName.charAt(0).toUpperCase() + variableName.slice(1);
	let code = 			
			`
\n${indentSize}get${variableNameUp}() {
${indentSize}\treturn this.${variableName};
${indentSize}}`
	return code;
}

/**
 * 
 * @param {String} indentSize 
 * @param {String} variableName 
 * 
 * @returns Java Setter
 */
function generateSetterTypeScript(indentSize, variableName) {
	let variableNameUp = variableName.charAt(0).toUpperCase() + variableName.slice(1);
	let code = 			
			`
\n${indentSize}set${variableNameUp}(${variableName}) {
${indentSize}\tthis.${variableName} = ${variableName};
${indentSize}}`
	return code;
}

// this method is called when your extension is deactivated
function deactivate() { }

module.exports = {
	activate,
	deactivate
}
