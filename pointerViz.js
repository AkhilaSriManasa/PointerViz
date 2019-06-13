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
	//document.getElementsById("featured-project-carousel")childNodes[0].childNodes[0].childNodes[0].childNodes[1].childNodes[0].append(vizDiv);
	document.getElementById("featured-project-carousel").append(vizDiv);
	vizAreaList.push(uid);
	console.log(uid);
	return uid;
}

function getLine()
{
    //console.log("entered getLine");
    //console.log(editor);
    const t = editor;
    //console.log(t);
    let tc = t.childNodes[1].childNodes[0].querySelectorAll("div");
    //console.log(tc.length);
    return tc.length;
    
}

editor.onkeydown = function(e) {
	const lno = getLine();
	//console.log(lno);

	if (lno != currentLine) {
		currentLine = lno;
		processEditor(lno);
	}

	if (e.key == ";") {
		//currentLine = lno;
		processEditor(lno);
	}



	// if (e.keyCode === 9 && typeof editor.selectionStart !== 'undefined') {
	// let startPosition = editor.selectionStart;
	// let endPosition = editor.selectionEnd;

	// editor.value = (editor.value.substring(0, startPosition) + 
	//             '    ' + 
	//             editor.value.substring(endPosition, editor.value.length));

	// editor.selectionStart = editor.selectionEnd = startPosition + 4;


	// return false;
	// }
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
6. dt p[10] = "test"// assigned to a string value
7. dt p[10] = {1,2} // assigned to some other value
8. dt *p = malloc	// dynamic memory allocation

9. dt **p = &p;

*/

function ptr_type1(code) {
	// 1. dt *p;			// wild pointer
	const regex_1 = /[a-z]+\ \*\ ([a-zA-Z$_][a-zA-Z0-9$_]*)\;/gm;
						
	const m = regex_1.exec(code);
	console.log(m);
	if(m==null)
		return false;
	const identifier = m[1];

	const nodes = [
					{id:0, label: identifier, group: "0", title: code},
					//{id:1, shape: "text", label: identifier, group: "0"},
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
	
	// previous regex : /[a-z]+\ ([a-zA-Z$_][a-zA-Z0-9$_]*)\ \[\ ([0-9]+)\ \]\;/g;

	const m = regex_4.exec(code);
	console.log(m);
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
	console.log("dt val:");
	console.log(dt);
	if(m[0].startsWith('int')){
		l = '+4';
	}	

	if(m[0].startsWith('char')){
		l = '+1';
	}
	for (var i = 1; i < ar_size; i++) {
		edges.push({from: i, to: i+1,length:10, label:l});
		//edges.push({from: i, to: i+1,length:10, label:('loc('+identifier+'['+(i-1).toString()+'])'+l)});
		//edges.push({from: i, to: i+1,length:10, label:(identifier+'['+(i-1).toString()+']'+l)});
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
	console.log(m);
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
	console.log("dt val:");
	console.log(dt);
	if(m[0].startsWith('int')){
		l = '+4';
	}	

	if(m[0].startsWith('char')){
		l = '+1';
	}
	for (var i = 1; i < (ar_size1 * ar_size2); i++) {
		edges.push({from: i, to: i+1,length:10, label:l});
		//edges.push({from: i, to: i+1,length:10, label:('loc('+identifier+'['+(i-1).toString()+'])'+l)});
		//edges.push({from: i, to: i+1,length:10, label:(identifier+'['+(i-1).toString()+']'+l)});
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


// 	const identifier = m[1];

// 	const nodes = [
// 					{id:0, label: identifier},
// 					{id:1}
// 				];
// 	const edges = [
// 					{from: 0, to: 1, arrows: 'to'}
// 				];

// 	const options = {
// 		nodes: {
//             shape: 'circle',
//             size: 30,
//             font: {
//                 size: 20
//             },
//             borderWidth: 2,
//             shadow:true
//         },
// 		edges: {
			  
// 		}
// 	};

// 	const data = {
// 		nodes: nodes,
// 		edges: edges
// 	};
// 	return [data, options];
// }

// function ptr_type7(code) {
// 	// 4. dt p[10];		// array, implicitly pointer, definite memory locations
// 	const regex_7 = /[a-z]+\ ([a-zA-Z$_][a-zA-Z0-9$_]*)\ \[\ ([0-9]+)\ \]\ \=\ \{\ (([0-9]\ )+)};/g;

// 	const m = regex_7.exec(code);
// 	if(m==null)
// 		return false;
// 	const dt = m[0];
// 	const identifier = m[1];
// 	const ar_size = m[2];
// 	let val = m[3];
// 	console.log(m);
// 	console.log(val);

// 	const nodes = [
// 					{id: 0, label: identifier},
// 					{id: 1001, label: '*' + identifier + ' contains address of '+ identifier +'[0]', shape: 'text'}
// 				];
// 	let i = 2*(parseInt(ar_size))-1;			
// 	for (let j = parseInt(ar_size)-1; j >= 0; j--) {
		
// 		if(val[i]==' ')
// 		i=i-1;
// 		console.log(i);
// 		console.log(val[i]);
		
// 		nodes.push({id: j+1, label: val[i], shape: 'box', fixed : 'true'});
// 		i--;
// 	}

// 	const edges = [
// 					{from: 0, to: 1, arrows: 'to', length: 0.1},
// 					{from: 1001, to: 0, arrows: 'to', hidden: 'true', length: 0.1}
// 				];
// 	let l = 'test';
// 	console.log("dt val:");
// 	console.log(dt);
// 	if(m[0].startsWith('int')){
// 		l = '+2';
// 	}	

// 	if(m[0].startsWith('char')){
// 		l = '+1';
// 	}
// 	i=1;
// 	for (i=1; i < ar_size; i++) {
// 		edges.push({from: i, to: i+1,length:10, label:l});
// 		//edges.push({from: i, to: i+1,length:10, label:('loc('+identifier+'['+(i-1).toString()+'])'+l)});
// 		//edges.push({from: i, to: i+1,length:10, label:(identifier+'['+(i-1).toString()+']'+l)});
// 	}

// 	const options = {
// 		nodes: {
//             shape: 'circle',
//             size: 30,
//             font: {
//                 size: 20
//             },
//             borderWidth: 2,
//             shadow:true
//         },
// 		edges: {
			  
// 		},


// 	  	autoResize: true,
//   		height: '480px',
//   		width: '100%'
// 	};

// 	const data = {
// 		nodes: nodes,
// 		edges: edges
// 	};
// 	return [data, options];
// }



function processToken(token) {

	ptr_types = [ptr_type1, ptr_type2, ptr_type3, ptr_type4, ptr_type5];

	let viz;
	console.log("token:");
	console.log(token);
	//console.log("int *p;");
	console.log("pttr type match :");
	for(let i =0; i<ptr_types.length;i++){
		console.log("i value in for loop:");
		console.log(i);
		viz = ptr_types[i](token);
		if(viz !== false){
			i = ptr_types.length;
		}
	}
	//console.log("2nd ptr:");
	//console.log(ptr_types[0](token));

	// ptr_types.some((ptr_type_fn) => {

	// 	try {
	// 		viz = ptr_type_fn(token);
	// 		return true;
	// 	}

	// 	catch(err) {
	// 		return false;
	// 	}
	// });
	console.log("viz val:");
	console.log(viz);
	const data = viz[0];
	const options = viz[1];

	return [data, options];
}

function processEditor(line_no) {
	console.log(line_no);
	let full_code = editor.childNodes[2].childNodes[0].childNodes[2].querySelectorAll("div");
	let j = 1;
	console.log("full_code:");
	console.log(full_code[line_no-1]);
	let ch = full_code[line_no-1].querySelectorAll("span");
	let myTest = full_code[line_no-1].textContent;
	console.log(myTest);
	console.log(ch[0].innerHTML);
	let code_new = ch[0].innerHTML;

	//console.log(ch[0].innerHTML);
	console.log(ch[1]);
	console.log(ch[2]);

	//console.log(editor.childNodes[2].childNodes[0].childNodes[2].childNodes[0].getElementsByClassName(ace_));

	//console.log(editor.childNodes[2].childNodes[0].childNodes[2].childNodes[0].childNodes[0].innerHTML);
	while(j<ch.length){
		let c = ch[j].innerHTML;
		if(c==="&amp;")
			c='&';
		if(c===','){
			j=j+1;
			c= ch[j].innerHTML;
		}
				
		code_new = code_new+' '+c;
		console.log("j val is:");
		console.log(j);
		console.log(c);
		console.log(code_new);
		j= j+1;
		console.log("new j:");
		console.log(j);
	}
	console.log("exit while");
	console.log(code_new);
	console.log(myTest.includes("["));
	if (myTest.includes("[")){
		code_new = myTest;
	}
	let codes = code_new;
	
	let container;
	//console.log("viz area list :");
	//console.log(vizAreaList[0]);
	const token = codes + ';';
	console.log("token : ");
	console.log(token);

		if(vizAreaList[line_no-1]) {
			container = document.getElementById(vizAreaList[line_no-1]);
		}
		else {
			const uid = createVizArea();
			container = document.getElementById(uid);
		}
		console.log("container val :");
		console.log(container);
		const viz = processToken(token);
		const data = viz[0];
		const options = viz[1];

		new vis.Network(container, data, options);


	// for (let i = 0; i <= codes.length - 1; i++) {
	// 	const token = codes[i] + ';';

	// 	if(vizAreaList[i]) {
	// 		container = document.getElementById(vizAreaList[i]);
	// 	}
	// 	else {
	// 		const uid = createVizArea();
	// 		container = document.getElementById(uid);
	// 	}
	// 	console.log("container val :");
	// 	console.log(container);
	// 	const viz = processToken(token);
	// 	const data = viz[0];
	// 	const options = viz[1];

	// 	new vis.Network(container, data, options);
	// }
	
}