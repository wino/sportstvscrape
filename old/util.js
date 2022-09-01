function getXY(obj) {  //thediv
	//var obj = document.getElementById(thediv);
	var y = obj.offsetTop;
	var x = obj.offsetLeft;
	while(obj = obj.offsetParent) {
		y += obj.offsetTop;
		x += obj.offsetLeft;
	}
	var ret = new Array(x,y);
	return ret;
}
function findit(obj) {
	var proto = obj.name;
	found=0;
	var str = proto.substring(0,5);
	wot = document.getElementById(str);
	val = obj.value;
	for(i=0;i<cn.length;i++) {
		if (val == cn[i]) {
			found=i;
			wot.value=cg[i];
			if(str.substring(4)=='1') league1=cgi[i]; 
			else league2=cgi[i];
			if(league1==league2) {
				document.getElementById('league').value=league1;
				var s=document.getElementById('station');
				var v = league1;
				if(v==6||v==13||v==14||v==15||v==16||v==23||v==12||v==25||v==26) s.value=1;
				else if(v==3||v==4) { s.value=4; document.getElementById('status').value=0; }
				else if(v==1||v==2||(v>=5&&v<=10)||v==17||v==19) s.value=6; 
				//if(v==1||(v>=4&&v<=10&&v!=8)||v==17||v==19) { s.value=6; document.getElementById('status').value=7; }
				//else if(v==25) { s.value=4; document.getElementById('status').value=0; }
			}
			break;
    }
  }
}
function dodiv(thing,game_id,team1,team2,time3,impt) {
  var d=document.getElementById('divgame');
  var coord=getXY(thing);
  d.style.top=coord[1];
  d.style.left=(coord[0]+10)+'px';
  //var acts = new Array(['R','recorded'],['S','started'],['W','watched'],['M','missed'],['D','scheduled'],['2','scheduled2'],['U','unscheduled'],['T','changetime'],['X','deleted']);
  if(impt) {
  	var acts = new Array('Recorded','Started','Watched','Unstarred','Unscheduled','Scheduled','Scheduled2','ChangeTime','ChangeStation','Deleted','Missed');
	} else {
  	var acts = new Array('Recorded','Started','Watched','Starred','Unscheduled','Scheduled','Scheduled2','ChangeTime','ChangeStation','Deleted','Missed');
	}
  var c = acts.length;
  var str = team1+'-'+team2+'  '+time3+'<br>';
  for(i=0; i<c; i++) str=str+'&nbsp;&nbsp;<a href="javascript:go('+game_id+",'"+acts[i]+"');"+'"">'+acts[i]+'</a><br>';
  str = str+game_id;
  d.innerHTML = str;
  d.style.visibility='visible';
}
var actb_fSize = 11;
var actb_bgColor = "#B5BFCF";
var actb_bgColor2 = "#E3E3E3";
var su_id = 1;
function addEvent(obj,event_name,func_name){
	if (obj.attachEvent){
		obj.attachEvent("on"+event_name, func_name);
	}else if(obj.addEventListener){
		obj.addEventListener(event_name,func_name,true);
	}else{
		obj["on"+event_name] = func_name;
	}
}
function removeEvent(obj,event_name,func_name){
	if (obj.detachEvent){
		obj.detachEvent("on"+event_name,func_name);
	}else if(obj.removeEventListener){
		obj.removeEventListener(event_name,func_name,true);
	}else{
		obj["on"+event_name] = null;
	}
}
function stopEvent(evt){
	evt || window.event;
	if (evt.stopPropagation){
		evt.stopPropagation();
		evt.preventDefault();
	}else if(typeof evt.cancelBubble != "undefined"){
		evt.cancelBubble = true;
		evt.returnValue = false;
	}
	return false;
}
function getCaretEnd(obj){
	if(typeof obj.selectionEnd != "undefined"){
		return obj.selectionEnd;
	}else if(document.selection&&document.selection.createRange){
		var M=document.selection.createRange();
		try{
			var Lp = M.duplicate();
			Lp.moveToElementText(obj);
		}catch(e){
			var Lp=obj.createTextRange();
		}
		Lp.setEndPoint("EndToEnd",M);
		var rb=Lp.text.length;
		if(rb>obj.value.length){
			return -1;
		}
		return rb;
	}
}
function getCaretStart(obj){
	if(typeof obj.selectionStart != "undefined"){
		return obj.selectionStart;
	}else if(document.selection&&document.selection.createRange){
		var M=document.selection.createRange();
		try{
			var Lp = M.duplicate();
			Lp.moveToElementText(obj);
		}catch(e){
			var Lp=obj.createTextRange();
		}
		Lp.setEndPoint("EndToStart",M);
		var rb=Lp.text.length;
		if(rb>obj.value.length){
			return -1;
		}
		return rb;
	}
}
function setCaret(obj,l){
	obj.focus();
	if (obj.setSelectionRange){
		obj.setSelectionRange(l,l);
	}else if(obj.createTextRange){
		m = obj.createTextRange();		
		m.moveStart('character',l);
		m.collapse();
		m.select();
	}
}
function setSelection(obj,s,e){
	obj.focus();
	if (obj.setSelectionRange){
		obj.setSelectionRange(s,e);
	}else if(obj.createTextRange){
		m = obj.createTextRange();		
		m.moveStart('character',s);
		m.moveEnd('character',e);
		m.select();
	}
}
String.prototype.addslashes = function(){
	return this.replace(/(["\\\.\|\[\]\^\*\+\?\$\(\)])/g, '\\$1');
}
String.prototype.trim = function () {
    return this.replace(/^\s*(\S*(\s+\S+)*)\s*$/, "$1");
};
function curTop(obj){
	toreturn = 0;
	while(obj){
		toreturn += obj.offsetTop;
		obj = obj.offsetParent;
	}
	return toreturn;
}
function curLeft(obj){
	toreturn = 0;
	while(obj){
		toreturn += obj.offsetLeft;
		obj = obj.offsetParent;
	}
	return toreturn;
}
function replaceHTML(obj,text){
	while(el = obj.childNodes[0]){
		obj.removeChild(el);
	};
	obj.appendChild(document.createTextNode(text));
}



function actb(obj,ca,cg,dofind){
	// ---- Public Variables ---- * /
	this.actb_timeOut = -1; // Autocomplete Timeout in ms (-1: autocomplete never time out)
	this.actb_lim = 25;    // Number of elements autocomplete can show (-1: no limit)
	this.actb_firstText = false; // should the auto complete be limited to the beginning of keyword?
	this.actb_mouse = true; // Enable Mouse Support
	this.actb_delimiter = new Array(';',',');  // Delimiter for multiple autocomplete. Set it to empty array for single autocomplete
	this.actb_startcheck = 1; // Show widget only after this number of characters is typed in.
	// ---- Public Variables ---- * /

	// --- Styles --- * /
	this.actb_bgColor = actb_bgColor;
	this.actb_textColor = '#000';
	this.actb_textHColor = '#fff';
	this.actb_hColor = '#35689B'; //'F3DC5B';
	this.actb_fFamily = 'Verdana';
	this.actb_fSize = actb_fSize;
	this.actb_hStyle = 'text-decoration:underline;font-weight:bold';
	// --- Styles --- * /

	// ---- Private Variables ---- * /
	var actb_delimwords = new Array();
	var actb_cdelimword = 0;
	var actb_delimchar = new Array();
	var actb_display = false;
	var actb_pos = 0;
	var actb_total = 0;
	var actb_curr = null;
	var actb_rangeu = 0;
	var actb_ranged = 0;
	var actb_bool = new Array();
	var actb_pre = 0;
	var actb_toid;
	var actb_tomake = false;
	var actb_getpre = "";
	var actb_mouse_on_list = 1;
	var actb_kwcount = 0;
	var actb_caretmove = false;
	var actb_indelete = false;
        var actb_bingo = 0;
        var actb_restore = "";
	this.actb_keywords = new Array();
	this.actb_keywords2 = new Array();
	// ---- Private Variables---- * /
	
	this.actb_keywords = ca;
	this.actb_keywords2 = cg;
	var actb_self = this;
    if(typeof myactb != "undefined") myactb=actb_self;
	myactb = function(){actb_mouse_on_list=0;actb_removedisp();}

	actb_curr = obj;
	addEvent(actb_curr,"focus",actb_setup);
	function actb_setup(){
		addEvent(document,"keydown",actb_checkkey);
		addEvent(document,"keyup",actb_checkmatch);
		addEvent(actb_curr,"blur",actb_clear);
		addEvent(document,"keypress",actb_keypress);
	}

	function actb_clear(evt){
		if (!evt) evt = event;
		removeEvent(document,"keydown",actb_checkkey);
		removeEvent(actb_curr,"blur",actb_clear);
		removeEvent(document,"keypress",actb_keypress);
		actb_removedisp();
		if(dofind) findit(actb_curr);
	}
	function actb_parse(n,actbbool){
		var tobuild = '';
		if (actb_self.actb_delimiter.length > 0){
			var t = actb_delimwords[actb_cdelimword].trim().addslashes();
			var plen = actb_delimwords[actb_cdelimword].trim().length;
		}else{
			var t = actb_curr.value.addslashes();
			var plen = actb_curr.value.length;
		}
		var i;

		if (actb_self.actb_firstText){
			var re = new RegExp("^" + t, "i");
		}else{
			var re = new RegExp(t, "i");
		}

	var p = n.search(re);

	if(p>0 || actbbool==1) {
		tobuild += n.substr(0,p) + "<font style='"+(actb_self.actb_hStyle)+"'>" + n.substr(p,plen) + "</font>" + n.substr(plen+p,n.length);
	}
	else tobuild=n;
	//if (tobuild != '') hide_combos();
	return tobuild;
	}
	function actb_generate(){
		if (document.getElementById('tat_table')){ actb_display = false;document.body.removeChild(document.getElementById('tat_table')); } 
		a = document.createElement('table');
		a.cellSpacing='1px';
		a.cellPadding='2px';
		a.style.position='absolute';
		a.style.top = eval(curTop(actb_curr) + actb_curr.offsetHeight) + "px";
		a.style.left = curLeft(actb_curr) + "px";
		a.style.backgroundColor=actb_self.actb_bgColor;
		a.style.color=actb_self.actb_textColor;
		a.id = 'tat_table';
		document.body.appendChild(a);
		if (actb_kwcount == 0){
			r = a.insertRow(-1);
			r.style.backgroundColor = actb_self.actb_bgColor;
			r.style.color = actb_self.actb_textColor;
			c = r.insertCell(-1);
			c.style.fontFamily = 'arial narrow';
			c.style.fontSize = actb_self.actb_fSize;
			c.align='center';
			c.innerHTML = actb_parse("--- no matches ---",0);
//			actb_display = false;
			return;
		}
		var i;
		var first = true;
		var j = 1;
		if (actb_self.actb_mouse){
			a.onmouseout = actb_table_unfocus;
			a.onmouseover = actb_table_focus;
		}
		var counter = 0;
		var good=goodi=0;
		for (i=0;i<actb_self.actb_keywords.length;i++){
			if (actb_bool[i] && j <= actb_self.actb_lim){
				counter++;
				r = a.insertRow(-1);
				if (first && !actb_tomake){
					r.style.backgroundColor = actb_self.actb_hColor;
					r.style.color = actb_self.actb_textHColor;
					first = false;
					actb_pos = counter;
				}else if(actb_pre == i){
					r.style.backgroundColor = actb_self.actb_hColor;
					r.style.color = actb_self.actb_textHColor;
					first = false;
					actb_pos = counter;
				}else{
					if (counter % 2) r.style.backgroundColor = actb_self.actb_bgColor; //actb_hColor;
					else r.style.backgroundColor = actb_self.actb_bgColor2;
					r.style.color = actb_self.actb_textColor;
				}
				r.id = 'tat_tr'+(j);
				c = r.insertCell(-1);
				c.style.fontFamily = actb_self.actb_fFamily;
				c.style.fontSize = actb_self.actb_fSize;
				c.innerHTML = actb_parse(actb_self.actb_keywords[i],actb_bool[i]);
				if (actb_self.actb_keywords[i].substr(0,2) != '--') { good++; goodi=i; }
				c.id = 'tat_td'+(j);
				c.setAttribute('pos',j);
				if (actb_self.actb_mouse){
					c.style.cursor = 'pointer';
					c.onclick=actb_mouseclick;
					c.onmouseover = actb_table_highlight;
				}
				j++;
			}
			if (j - 1 == actb_self.actb_lim && j < actb_total){
				r = a.insertRow(-1);
				r.style.backgroundColor = actb_self.actb_bgColor;
				r.style.color = actb_self.actb_textColor;
				c = r.insertCell(-1);
				c.style.fontFamily = 'arial narrow';
				c.style.fontSize = actb_self.actb_fSize;
				c.align='center';
				replaceHTML(c,'\\/');
				if (actb_self.actb_mouse){
					c.style.cursor = 'pointer';
					c.onclick = actb_mouse_down;
				}
				break;
			}
		}
		actb_rangeu = 1;
		actb_ranged = j-1;
		actb_display = true;
		if (actb_pos <= 0) actb_pos = 1;
		if (actb_indelete && counter == 2) actb_godown();
		if (su_id && good == 1 && (counter == 2 || counter == 1) && !actb_indelete) {
			actb_insertword(actb_self.actb_keywords[goodi]);
			actb_mouse_on_list = 0;
			actb_removedisp();
			actb_pos=0;
			var tDate = new Date();
			actb_bingo=tDate.getTime();
			actb_restore = actb_self.actb_keywords[goodi];
		}
		if (!counter && !good) {
			r = a.insertRow(-1);
			r.style.backgroundColor = actb_self.actb_bgColor;
			r.style.color = actb_self.actb_textColor;
			c = r.insertCell(-1);
			c.style.fontFamily = 'arial narrow';
			c.style.fontSize = actb_self.actb_fSize;
			c.align='center';
			c.innerHTML = actb_parse("--- no matches ---",0);
		}
	}
	function actb_remake(){
		document.body.removeChild(document.getElementById('tat_table'));
		a = document.createElement('table');
		a.cellSpacing='1px';
		a.cellPadding='2px';
		a.style.position='absolute';
		a.style.top = eval(curTop(actb_curr) + actb_curr.offsetHeight) + "px";
		a.style.left = curLeft(actb_curr) + "px";
		a.style.backgroundColor= actb_self.actb_bgColor;
		a.style.color= actb_self.actb_textColor;
		a.id = 'tat_table';
		if (actb_self.actb_mouse){
			a.onmouseout= actb_table_unfocus;
			a.onmouseover=actb_table_focus;
		}
		document.body.appendChild(a);
		var i;
		var first = true;
		var j = 1;
		if (actb_rangeu > 1){
			r = a.insertRow(-1);
			r.style.backgroundColor = actb_self.actb_bgColor;
			r.style.color = actb_self.actb_textColor;
			c = r.insertCell(-1);
			c.style.fontFamily = 'arial narrow';
			c.style.fontSize = actb_self.actb_fSize;
			c.align='center';
			replaceHTML(c,'/\\');
			if (actb_self.actb_mouse){
				c.style.cursor = 'pointer';
				c.onclick = actb_mouse_up;
			}
		}
		for (i=0;i<actb_self.actb_keywords.length;i++){
			if (actb_bool[i]){
				if (j >= actb_rangeu && j <= actb_ranged){
					r = a.insertRow(-1);
					if (j % 2) r.style.backgroundColor = actb_self.actb_bgColor; //actb_hColor;
					else r.style.backgroundColor = actb_self.actb_bgColor2;
					r.style.color = actb_self.actb_textColor;
					r.id = 'tat_tr'+(j);
					c = r.insertCell(-1);
					c.style.fontFamily = actb_self.actb_fFamily;
					c.style.fontSize = actb_self.actb_fSize;
					c.innerHTML = actb_parse(actb_self.actb_keywords[i],actb_bool[i]);
					c.id = 'tat_td'+(j);
					c.setAttribute('pos',j);
					if (actb_self.actb_mouse){
						c.style.cursor = 'pointer';
						c.onclick=actb_mouseclick;
						c.onmouseover = actb_table_highlight;
					}
					j++;
				}else{
					j++;
				}
			}
			if (j > actb_ranged) break;
		}
		if (j-1 < actb_total){
			r = a.insertRow(-1);
			r.style.backgroundColor = actb_self.actb_bgColor;
			r.style.color = actb_self.actb_textColor;
			c = r.insertCell(-1);
			c.style.fontFamily = 'arial narrow';
			c.style.fontSize = actb_self.actb_fSize;
			c.align='center';
			replaceHTML(c,'\\/');
			if (actb_self.actb_mouse){
				c.style.cursor = 'pointer';
				c.onclick = actb_mouse_down;
			}
		}
	}
	function actb_goup(){
		if (!actb_display) return;
		if (actb_pos == 1) return;
		if (actb_pos % 2) document.getElementById('tat_tr'+actb_pos).style.backgroundColor = actb_self.actb_bgColor;
		else document.getElementById('tat_tr'+actb_pos).style.backgroundColor = actb_self.actb_bgColor2; //actb_self.actb_bgColor;
		document.getElementById('tat_tr'+actb_pos).style.color = actb_self.actb_textColor;
		actb_pos--;
		if (actb_pos < actb_rangeu) actb_moveup();
		document.getElementById('tat_tr'+actb_pos).style.backgroundColor = actb_self.actb_hColor;
		document.getElementById('tat_tr'+actb_pos).style.color = actb_self.actb_textHColor;
		if (actb_toid) clearTimeout(actb_toid);
		if (actb_self.actb_timeOut > 0) actb_toid = setTimeout(function(){actb_mouse_on_list=0;actb_removedisp();},actb_self.actb_timeOut);
	}
	function actb_godown(){
		if (!actb_display) return;
		if (actb_pos == actb_total) return;
		if (actb_pos % 2) document.getElementById('tat_tr'+actb_pos).style.backgroundColor = actb_self.actb_bgColor;
		else document.getElementById('tat_tr'+actb_pos).style.backgroundColor = actb_self.actb_bgColor2; //actb_self.actb_bgColor;
		document.getElementById('tat_tr'+actb_pos).style.color = actb_self.actb_textColor;
		actb_pos++;
		if (actb_pos > actb_ranged) actb_movedown();
		document.getElementById('tat_tr'+actb_pos).style.backgroundColor = actb_self.actb_hColor;
		document.getElementById('tat_tr'+actb_pos).style.color = actb_self.actb_textHColor;
		if (actb_toid) clearTimeout(actb_toid);
		if (actb_self.actb_timeOut > 0) actb_toid = setTimeout(function(){actb_mouse_on_list=0;actb_removedisp();},actb_self.actb_timeOut);
	}
	function actb_movedown(){
		actb_rangeu++;
		actb_ranged++;
		actb_remake();
	}
	function actb_moveup(){
		actb_rangeu--;
		actb_ranged--;
		actb_remake();
	}

	// Mouse * /
	function actb_mouse_down(){
		if (actb_pos % 2) document.getElementById('tat_tr'+actb_pos).style.backgroundColor = actb_self.actb_bgColor;
		else document.getElementById('tat_tr'+actb_pos).style.backgroundColor = actb_self.actb_bgColor2;
		document.getElementById('tat_tr'+actb_pos).style.color = actb_self.actb_textColor;
		actb_pos++;
		actb_movedown();
		document.getElementById('tat_tr'+actb_pos).style.backgroundColor = actb_self.actb_hColor;
		document.getElementById('tat_tr'+actb_pos).style.color = actb_self.actb_textHColor;
		actb_curr.focus();
		actb_mouse_on_list = 0;
		if (actb_toid) clearTimeout(actb_toid);
		if (actb_self.actb_timeOut > 0) actb_toid = setTimeout(function(){actb_mouse_on_list=0;actb_removedisp();},actb_self.actb_timeOut);
	}
	function actb_mouse_up(evt){
		if (!evt) evt = event;
		if (evt.stopPropagation){
			evt.stopPropagation();
		}else{
			evt.cancelBubble = true;
		}
		if (actb_pos % 2) document.getElementById('tat_tr'+actb_pos).style.backgroundColor = actb_self.actb_bgColor;
		else document.getElementById('tat_tr'+actb_pos).style.backgroundColor = actb_self.actb_bgColor2; 
		document.getElementById('tat_tr'+actb_pos).style.color = actb_self.actb_textColor;
		actb_pos--;
		actb_moveup();
		document.getElementById('tat_tr'+actb_pos).style.backgroundColor = actb_self.actb_hColor;
		document.getElementById('tat_tr'+actb_pos).style.color = actb_self.actb_textHColor;
		actb_curr.focus();
		actb_mouse_on_list = 0;
		if (actb_toid) clearTimeout(actb_toid);
		if (actb_self.actb_timeOut > 0) actb_toid = setTimeout(function(){actb_mouse_on_list=0;actb_removedisp();},actb_self.actb_timeOut);
	}
	function actb_mouseclick(evt){
		if (!evt) evt = event;
		if (!actb_display) return;
		actb_mouse_on_list = 0;
		actb_pos = this.getAttribute('pos');
		actb_penter();
	}
	function actb_table_focus(){
		actb_mouse_on_list = 1;
	}
	function actb_table_unfocus(){
		actb_mouse_on_list = 0;
		if (actb_toid) clearTimeout(actb_toid);
		if (actb_self.actb_timeOut > 0) actb_toid = setTimeout(function(){actb_mouse_on_list = 0;actb_removedisp();},actb_self.actb_timeOut);
	}
	function actb_table_highlight(){
		actb_mouse_on_list = 1;
		if (actb_pos % 2) document.getElementById('tat_tr'+actb_pos).style.backgroundColor = actb_self.actb_bgColor;
		else document.getElementById('tat_tr'+actb_pos).style.backgroundColor = actb_self.actb_bgColor2;
		document.getElementById('tat_tr'+actb_pos).style.color = actb_self.actb_textColor;
		actb_pos = this.getAttribute('pos');
		while (actb_pos < actb_rangeu) actb_moveup();
		while (actb_pos > actb_ranged) actb_movedown();
		document.getElementById('tat_tr'+actb_pos).style.backgroundColor = actb_self.actb_hColor;
		document.getElementById('tat_tr'+actb_pos).style.color = actb_self.actb_textHColor;
		if (actb_toid) clearTimeout(actb_toid);
		if (actb_self.actb_timeOut > 0) actb_toid = setTimeout(function(){actb_mouse_on_list = 0;actb_removedisp();},actb_self.actb_timeOut);
	}
	// ---- * /

	function actb_insertword(a){
		if (actb_self.actb_delimiter.length > 0){
			str = '';
			l=0;
			for (i=0;i<actb_delimwords.length;i++){
				if (actb_cdelimword == i){
					prespace = postspace = '';
					gotbreak = false;
					for (j=0;j<actb_delimwords[i].length;++j){
						if (actb_delimwords[i].charAt(j) != ' '){
							gotbreak = true;
							break;
						}
						prespace += ' ';
					}
					for (j=actb_delimwords[i].length-1;j>=0;--j){
						if (actb_delimwords[i].charAt(j) != ' ') break;
						postspace += ' ';
					}
					str += prespace;
					str += a;
					l = str.length;
					if (gotbreak) str += postspace;
				}else{
					str += actb_delimwords[i];
				}
				if (i != actb_delimwords.length - 1){
					str += actb_delimchar[i];
				}
			}
			actb_curr.value = str;
			setCaret(actb_curr,l);
		}else{
			actb_curr.value = a;
		}
		if(dofind) findit(actb_curr);
		actb_mouse_on_list = 0;
		actb_removedisp();
	}
	function actb_penter(){
		if (!actb_display) return;
		actb_display = false;
		var word = '';
		var c = 0;
		for (var i=0;i<=actb_self.actb_keywords.length;i++){
			if (actb_bool[i]) c++;
			if (c == actb_pos){
				word = actb_self.actb_keywords[i];
				break;
			}
		}
		actb_insertword(word);
		l = getCaretStart(actb_curr);
	}
	function actb_removedisp(){
		if (actb_mouse_on_list==0){
			actb_display = 0;
			if (document.getElementById('tat_table')){ document.body.removeChild(document.getElementById('tat_table')); }
			if (actb_toid) clearTimeout(actb_toid);
		}
	}
	function actb_keypress(e){
		if (actb_caretmove) stopEvent(e);
		return !actb_caretmove;
	}
	function actb_checkmatch(evt){
		var   tDate = new Date();
		if ((tDate.getTime() - actb_bingo) < 3000) {
			actb_curr.value=actb_restore;
			}
		}
	function actb_checkkey(evt){
		if (!evt) evt = event;
		a = evt.keyCode;
		if (su_id) {
			var   tDate = new Date();
			if ((tDate.getTime() - actb_bingo) < 1500) { return false; }
		}
		caret_pos_start = getCaretStart(actb_curr);
		actb_caretmove = 0;
		switch (a){
			case 38:
				actb_goup();
				actb_caretmove = 1;
				return false;
				break;
			case 40:
				actb_godown();
				actb_caretmove = 1;
				return false;
				break;
			case 13: case 9:
				if (actb_display){
					actb_caretmove = 1;
					actb_penter();
					return false;
				}else{
					return true;
				}
				break;
			default:
				setTimeout(function(){actb_tocomplete(a)},50);
				break;
		}
	}

	function actb_tocomplete(kc){
		if (kc == 38 || kc == 40 || kc == 13) return;
		var i;
		if (actb_display){ 
			var word = 0;
			var c = 0;
			for (var i=0;i<=actb_self.actb_keywords.length;i++){
				if (actb_bool[i]) c++;
				if (c == actb_pos){
					word = i;
					break;
				}
			}
			actb_pre = word;
		}else{ actb_pre = -1};		
		if (actb_curr.value == ' '){
			actb_curr.value = '';
			return;
		}
		if (actb_curr.value == ''){
			actb_mouse_on_list = 0;
			actb_removedisp();
			return;
		}
		if (actb_self.actb_delimiter.length > 0){
			caret_pos_start = getCaretStart(actb_curr);
			caret_pos_end = getCaretEnd(actb_curr);
			
			delim_split = '';
			for (i=0;i<actb_self.actb_delimiter.length;i++){
				delim_split += actb_self.actb_delimiter[i];
			}
			delim_split = delim_split.addslashes();
			delim_split_rx = new RegExp("(["+delim_split+"])");
			c = 0;
			actb_delimwords = new Array();
			actb_delimwords[0] = '';
			for (i=0,j=actb_curr.value.length;i<actb_curr.value.length;i++,j--){
				if (actb_curr.value.substr(i,j).search(delim_split_rx) == 0){
					ma = actb_curr.value.substr(i,j).match(delim_split_rx);
					actb_delimchar[c] = ma[1];
					c++;
					actb_delimwords[c] = '';
				}else{
					actb_delimwords[c] += actb_curr.value.charAt(i);
				}
			}

			var l = 0;
			actb_cdelimword = -1;
			for (i=0;i<actb_delimwords.length;i++){
				if (caret_pos_end >= l && caret_pos_end <= l + actb_delimwords[i].length){
					actb_cdelimword = i;
				}
				l+=actb_delimwords[i].length + 1;
			}
			var ot = actb_delimwords[actb_cdelimword].trim(); 
			var t = actb_delimwords[actb_cdelimword].addslashes().trim();
		}else{
			var ot = actb_curr.value;
			var t = actb_curr.value.addslashes();
		}
		if (ot.length == 0){
			actb_mouse_on_list = 0;
			actb_removedisp();
		}
		if (ot.length < actb_self.actb_startcheck) return this;
		if (actb_self.actb_firstText){
			var re = new RegExp("^" + t, "i");
		}else{
			var re = new RegExp(t, "i");
		}

		actb_total = 0;
		actb_tomake = false;
		actb_kwcount = 0;
		last_sep= -1;
		for (i=0;i<actb_self.actb_keywords.length;i++){
			actb_bool[i] = 0;
			k1 = re.test(actb_self.actb_keywords[i]);
			k2 = re.test(actb_self.actb_keywords2[i]);
			k3 = (actb_self.actb_keywords[i].substr(0,4) == "----");  //match sep
			if (k1||k2||k3){
				if ((k1||k2) && !k3) last_sep= -1;
				actb_total++;
				if(k1) actb_bool[i] = 1;
				else if (k2) actb_bool[i] = 2;
				if (k3) {
					if (last_sep >= 0){
						actb_bool[last_sep]=0;
						actb_total--;
					}
					actb_bool[i] = 3;
					last_sep=i;
				}
				actb_kwcount++;
				if (actb_pre == i) actb_tomake = true;
			}
		}
		if (last_sep >=0) {
			actb_total--;  // so we don't draw the down arrow
			actb_bool[last_sep]=0;
		}
		if (actb_toid) clearTimeout(actb_toid);
		if (actb_self.actb_timeOut > 0) actb_toid = setTimeout(function(){actb_mouse_on_list = 0;actb_removedisp();},actb_self.actb_timeOut);
		if (kc == 8)  actb_indelete = true;
		actb_generate();
		if (kc == 8)  actb_indelete = false;
	}
	return this;
}

