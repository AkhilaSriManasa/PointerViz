let editor = document.getElementById("file_div");
let currentVizArea;
let vizAreaList = [];

let currentLine = 1;

function createVizArea() {

	let uid = "myViz" + Math.floor((Math.random() * 1000) + 1);
	const test_clash = document.getElementById(uid);
	while (test_clash != null) {
		uid = "myViz" + Math.random();
	}

	const vizDiv = document.createElement("div");
	vizDiv.setAttribute("id", uid);
	vizDiv.setAttribute("align", "center");

	editor.appendChild(vizDiv);
	document.getElementById("featured-project-carousel").append(vizDiv);
	vizAreaList.push(uid);
	return uid;
}

function getLine()
{
    const t = editor;
    let tc = t.childNodes[1].childNodes[0].querySelectorAll("div");
    return tc.length;
    
}

editor.onkeydown = function(e) {
	const lno = getLine();
	
	if (lno != currentLine) {
		currentLine = lno;
		processEditor(lno);
	}

	if (e.key == ";") {
	
		processEditor(lno);
	}


};

editor.onclick = function() {
	const lno = getLine();
	
	if (lno != currentLine) {
		currentLine = lno;
		processEditor(lno);
	}

	processEditor(lno);
};

/*
Testing ground = https://regex101.com/r/3DNxmy/1/

List of different types of pointer declarations. dt = data-type

1. dt *p;			// wild pointer
2. dt *p = NULL;	// null pointer
3. dt *p = &a;		// pointing to a variable, contains mem address of a
4. dt p[10];		// array, implicitly pointer, definite memory locations
5. dt p[10][10];	// multidimensional array
6. dt *p = "test"// assigned to a string value
7. dt p[10] = {1,2} // assigned to some other value
8. dt *p = malloc	// dynamic memory allocation

9. dt **p = &p;

*/

function ptr_type1(code) {
	// 1. dt *p;			// wild pointer
	const regex_1 = /[a-z]+\ \*\ ([a-zA-Z$_][a-zA-Z0-9$_]*)\;/gm;
						
	const m = regex_1.exec(code);
	
	if(m==null)
		return false;
	const identifier = m[1];

	const nodes = [
					{id:0, label: identifier, group: "0", title: code},
					{id:2, shape: 'dot', label: "Garbage"}
				];
	const edges = [
					{from: 0, to: 2, arrows: 'to'}
				];

	const options = {
		nodes: {
            shape: 'circle',
            size: 30,
            font: {
                size: 30,
                multi: true
            },
            borderWidth: 2,
            shadow:true
        },
		edges: {
			width: 3,			
		}
	};

	const data = {
		nodes: nodes,
		edges: edges
	};
	return [data, options];
}

function ptr_type2(code) {
	// 2. dt *p = NULL;	// null pointer
	const regex_2 = /[a-z]+\ \*\ ([a-zA-Z$_][a-zA-Z0-9$_]*)\ *=\ *null\;/gmi;

	const m = regex_2.exec(code);
	if(m==null)
		return false;
	const identifier = m[1];

	const nodes = [
					{id:0, label: identifier},
					{id:1, label: "NULL"}
				];
	const edges = [
					{from: 0, to: 1, arrows: 'to'}
				];

	const options = {
		nodes: {
            shape: 'circle',
            size: 30,
            font: {
                size: 20
            },
            borderWidth: 2,
            shadow:true
        },
		edges: {
			  
		}
	};

	const data = {
		nodes: nodes,
		edges: edges
	};
	return [data, options];
}

function ptr_type3(code) {
	// 3. dt *p = &a;		// pointing to a variable, contains mem address of a
	const regex_3 = /[a-z]+\ \*\ ([a-zA-Z$_][a-zA-Z0-9$_]*)\ *=\ *\&\ ([a-zA-Z$_][a-zA-Z0-9$_]*)\;/gm;

	const m = regex_3.exec(code);
	if(m==null)
		return false;
	const identifier = m[1];
	const assigned_var = m[2];

	const nodes = [
					{id:0, label: identifier},
					{id:1, label: assigned_var}
				];
	const edges = [
					{from: 0, to: 1, arrows: 'to'}
				];

	const options = {
		nodes: {
            shape: 'circle',
            size: 30,
            font: {
                size: 20
            },
            borderWidth: 2,
            shadow:true
        },
		edges: {
			  
		}
	};

	const data = {
		nodes: nodes,
		edges: edges
	};
	return [data, options];
}

function ptr_type4(code) {
	// 4. dt p[10];		// array, implicitly pointer, definite memory locations
	const regex_4 = /[a-z]+\ ([a-zA-Z$_][a-zA-Z0-9$_]*)\ *\[\ *([0-9]+)\ *\]\;/g;

	const m = regex_4.exec(code);
		if(m==null)
		return false;
	const dt = m[0];
	const identifier = m[1];
	const ar_size = m[2];

	const nodes = [
					{id: 0, label: identifier},
					{id: 1001, label: '*' + identifier + ' contains address of '+ identifier +'[0]', shape: 'text'}
				];

	for (let i = parseInt(ar_size)-1; i >= 0; i--) {
		nodes.push({id: i+1, label: identifier + '[' + i.toString() + ']', shape: 'box', fixed : 'true'});
	}

	const edges = [
					{from: 0, to: 1, arrows: 'to', length: 0.1},
					{from: 1001, to: 0, arrows: 'to', hidden: 'true', length: 0.1}
				];
	let l = 'test';
	if(m[0].startsWith('int')){
		l = '+4';
	}	

	if(m[0].startsWith('char')){
		l = '+1';
	}
	for (var i = 1; i < ar_size; i++) {
		edges.push({from: i, to: i+1,length:10, label:l});
	}

	const options = {
		nodes: {
            shape: 'circle',
            size: 30,
            font: {
                size: 20
            },
            borderWidth: 2,
            shadow:true
        },
		edges: {
			  
		},


	  	autoResize: true,
  		height: '480px',
  		width: '100%'
	};

	const data = {
		nodes: nodes,
		edges: edges
	};
	return [data, options];
}


function ptr_type5(code) {
	// 5. dt p[10][10];	// multidimensional array

	const regex_5 = /[a-z]+\ ([a-zA-Z$_][a-zA-Z0-9$_]*)\ *\[\ *([0-9]+)\ *\]\ *\[\ *([0-9]+)\ *\];/g;



	const m = regex_5.exec(code);
	if(m==null)
		return false;
	const dt = m[0];
	const identifier = m[1];
	const ar_size1 = m[2];
	const ar_size2 = m[3];

	const nodes = [
					{id: 0, label: identifier},
					{id: 1001, label: '*' + identifier + ' contains address of '+ identifier +'[0][0]', shape: 'text'}
				];
	
	let index = (parseInt(ar_size1)*parseInt(ar_size2))-1;
	for(let row=parseInt(ar_size1)-1;row>=0;row--){
		for(let col=parseInt(ar_size2)-1;col>=0;col--){
			nodes.push({id: index+1, label: identifier + '[' + row.toString() + ']' + '[' + col.toString() + ']', shape: 'box', fixed : 'true'});
			index--;	
		}
	}
	
	const edges = [
					{from: 0, to: 1, arrows: 'to', length: 0.1},
					{from: 1001, to: 0, arrows: 'to', hidden: 'true', length: 0.1}
				];
	let l = 'test';
	if(m[0].startsWith('int')){
		l = '+4';
	}	

	if(m[0].startsWith('char')){
		l = '+1';
	}
	for (var i = 1; i < (ar_size1 * ar_size2); i++) {
		edges.push({from: i, to: i+1,length:10, label:l});
	}

	const options = {
		nodes: {
            shape: 'circle',
            size: 30,
            font: {
                size: 20
            },
            borderWidth: 2,
            shadow:true
        },
		edges: {
			  
		},


	  	autoResize: true,
  		height: '480px',
  		width: '100%'
	};

	const data = {
		nodes: nodes,
		edges: edges
	};
	return [data, options];
}



function ptr_type6(code) {
	// 6. dt *p = "test";		// pointer to string 
	const regex_6 = /[a-z]+\ *\*\ *([a-zA-Z$_][a-zA-Z0-9$_]*)\ *=\ *\"([a-zA-Z0-9$_]+)\"\ *;/gm;
	

	const m = regex_6.exec(code);
	


	if(m==null)
		return false;
	const dt = m[0];
	const identifier = m[1];
	const string_value = m[2];
	const string_size = m[2].length;
	const zero = "0";
	const slash = "\\";


	const nodes = [
					{id: 0, label: identifier},
					{id: 1001, label: '*' + identifier + ' contains address of '+ string_value[0].toString(), shape: 'text'}
				];

	for (let i = parseInt(string_size)-1; i >= 0; i--) {
		nodes.push({id: i+1, label: string_value[i].toString() , shape: 'box', fixed : 'true'});
	}
	nodes.push({id: string_size+1, label: slash.toString() + zero.toString() , shape: 'box', fixed : 'true'});

	const edges = [
					{from: 0, to: 1, arrows: 'to', length: 0.1},
					{from: 1001, to: 0, arrows: 'to', hidden: 'true', length: 0.1}
				];
	let l = 'test';
	if(m[0].startsWith('int')){
		l = '+4';
	}	

	if(m[0].startsWith('char')){
		l = '+1';
	}
	for (var i = 1; i < string_size+1; i++) {
		edges.push({from: i, to: i+1,length:10, label:l});
	}

	const options = {
		nodes: {
            shape: 'circle',
            size: 30,
            font: {
                size: 20
            },
            borderWidth: 2,
            shadow:true
        },
		edges: {
			  
		},


	  	autoResize: true,
  		height: '480px',
  		width: '100%'
	};

	const data = {
		nodes: nodes,
		edges: edges
	};
	return [data, options];
}


function ptr_type7(code) {
	// 7. dt p[10]={1,2};		// array defined
	const regex_7 = /[a-z]+\ *([a-zA-Z$_][a-zA-Z0-9$_]*)\ *\[\ *([0-9]+)\ *\]\ *\=\ *((\{('([[a-z]|[A-Z]|[0-9]+|[$_]])' *\,*)*\})|(\{(([0-9]+)\ *\,*)*\}));/gm;
	

	const m = regex_7.exec(code);
	if(m==null)
		return false;
	const dt = m[0];
	const identifier = m[1];
	const ar_size = m[2];
	const ar_elements_test1 = m[3];
	const ar_elements_test2 = ar_elements_test1.replace(/{/g, '');
	
	const ar_elements_test3 = ar_elements_test2.replace(/}/g, '');
	const ar_elements_test4 = ar_elements_test3.replace(/'/g, '');
	const ar_elements = ar_elements_test4.replace(/,/g, '');

	const nodes = [
					{id: 0, label: identifier},
					{id: 1001, label: '*' + identifier + ' contains address of '+ identifier +'[0]', shape: 'text'}
				];

	for (let i = parseInt(ar_size)-1; i >= 0; i--) {
		nodes.push({id: i+1, label: ar_elements[i].toString() , shape: 'box', fixed : 'true'});
	}

	const edges = [
					{from: 0, to: 1, arrows: 'to', length: 0.1},
					{from: 1001, to: 0, arrows: 'to', hidden: 'true', length: 0.1}
				];
	let l = 'test';
	if(m[0].startsWith('int')){
		l = '+4';
	}	

	if(m[0].startsWith('char')){
		l = '+1';
	}
	for (var i = 1; i < ar_size; i++) {
		edges.push({from: i, to: i+1,length:10, label:l});
	}

	const options = {
		nodes: {
            shape: 'circle',
            size: 30,
            font: {
                size: 20
            },
            borderWidth: 2,
            shadow:true
        },
		edges: {
			  
		},


	  	autoResize: true,
  		height: '480px',
  		width: '100%'
	};

	const data = {
		nodes: nodes,
		edges: edges
	};
	return [data, options];
}




function ptr_type8(code) {
	// 8. dt p[10][10]={1,2};		// array defined
	const regex_8 = /[a-z]+\ *([a-zA-Z$_][a-zA-Z0-9$_]*)\ *\[\ *([0-9]+)\ *\]\ *\[\ *([0-9]+)\ *\]=\ *((\{('([[a-z]|[A-Z]|[0-9]+|[$_]])' *\,*)*\})|(\{(([0-9]+)\ *\,*)*\}));/gm;
	

	const m = regex_8.exec(code);
	if(m==null)
		return false;
	const dt = m[0];
	const identifier = m[1];
	const ar_size1 = m[2];
	const ar_size2 = m[3];
	const ar_elements_test1 = m[4];
	const ar_elements_test2 = ar_elements_test1.replace(/{/g, '');
	const ar_elements_test3 = ar_elements_test2.replace(/}/g, '');
	const ar_elements_test4 = ar_elements_test3.replace(/'/g, '');
	const ar_elements = ar_elements_test4.replace(/,/g, '');

	const arr8_elements = m[4];
	const nodes = [
					{id: 0, label: identifier},
					{id: 1001, label: '*' + identifier + ' contains address of '+ identifier +'[0][0]', shape: 'text'}
				];
	
	let index = (parseInt(ar_size1)*parseInt(ar_size2))-1;
	for(let row=parseInt(ar_size1)-1;row>=0;row--){
		for(let col=parseInt(ar_size2)-1;col>=0;col--){
			nodes.push({id: index+1, label: ar_elements[index].toString(), shape: 'box', fixed : 'true'});
			index--;	
		}
	}
	
	const edges = [
					{from: 0, to: 1, arrows: 'to', length: 0.1},
					{from: 1001, to: 0, arrows: 'to', hidden: 'true', length: 0.1}
				];
	let l = 'test';
	if(m[0].startsWith('int')){
		l = '+4';
	}	

	if(m[0].startsWith('char')){
		l = '+1';
	}
	for (var i = 1; i < (ar_size1 * ar_size2); i++) {
		edges.push({from: i, to: i+1,length:10, label:l});
	}

	const options = {
		nodes: {
            shape: 'circle',
            size: 30,
            font: {
                size: 20
            },
            borderWidth: 2,
            shadow:true
        },
		edges: {
			  
		},


	  	autoResize: true,
  		height: '480px',
  		width: '100%'
	};

	const data = {
		nodes: nodes,
		edges: edges
	};
	return [data, options];
}



function processToken(token) {

	ptr_types = [ptr_type1, ptr_type2, ptr_type3, ptr_type4, ptr_type5, ptr_type6, ptr_type7, ptr_type8];
	let viz;
	for(let i =0; i<ptr_types.length;i++){
		viz = ptr_types[i](token);
		if(viz !== false){
			i = ptr_types.length;
		}
	}
	const data = viz[0];
	const options = viz[1];

	return [data, options];
}

function processEditor(line_no) {
	let full_code = editor.childNodes[2].childNodes[0].childNodes[2].querySelectorAll("div");
	let j = 1;
	let ch = full_code[line_no-1].querySelectorAll("span");
	let myTest = full_code[line_no-1].textContent;
	let code_new = ch[0].innerHTML;

	while(j<ch.length){
		let c = ch[j].innerHTML;
		if(c==="&amp;")
			c='&';
		if(c===','){
			j=j+1;
			c= ch[j].innerHTML;
		}
				
		code_new = code_new+' '+c;
		j= j+1;
	}
	if (myTest.includes("[")|| myTest.includes('"')){
		code_new = myTest;
	}
	let codes = code_new;
	
	let container;
	const token = codes + ';';

		if(vizAreaList[line_no-1]) {
			container = document.getElementById(vizAreaList[line_no-1]);
		}
		else {
			const uid = createVizArea();
			container = document.getElementById(uid);
		}
		const viz = processToken(token);
		const data = viz[0];
		const options = viz[1];

		new vis.Network(container, data, options);
	
}