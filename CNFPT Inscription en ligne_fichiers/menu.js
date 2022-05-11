
function _cnfpt_showloader(bNotShow, sId) {
    var cxx = (screen.availWidth / 2) - 35;
    var cyy = (screen.availHeight / 2) - 35;
    var _sId = (sId) ? sId : 'div_loader'; 
    $(_sId).style.left = cxx; 
    $(_sId).style.top = cyy;
    if (!bNotShow) {
        $(_sId).style.display = 'block';
    }
}
function _cnfpt_hideloader(sId) {
    var _sId = (sId) ? sId : 'div_loader';
    $(_sId).style.display = 'none';
    voir_select();
}

/** util_getElementsByClassName
 * Effectue une recherche d'element par nom de classe
 * @param
 *  strClass class name (plusieurs possible séparé par des | ou des espaces
 *  strTag TagName
 *  objContElm conteneur
 * @author JLR
 * @return array d'objet
 * ===========================================================================*/
function util_getElementsByClassName(strClass, strTag, objContElm) {
    strTag = strTag || "*";
    objContElm = objContElm || document;
    var objColl = objContElm.getElementsByTagName(strTag);
    if (!objColl.length &&  strTag == "*" &&  objContElm.all) objColl = objContElm.all;
    var arr = new Array();
    var delim = strClass.indexOf('|') != -1  ? '|' : ' ';
    var arrClass = strClass.split(delim);
    for (var i = 0, j = objColl.length; i < j; i++) {
        var arrObjClass = objColl[i].className.split(' ');
        if (delim == ' ' && arrClass.length > arrObjClass.length) continue;
        var c = 0;
            comparisonLoop:
            for (var k = 0, l = arrObjClass.length; k < l; k++) {
                for (var m = 0, n = arrClass.length; m < n; m++) {
                    if (arrClass[m] == arrObjClass[k]) c++;
                    if (( delim == '|' && c == 1) || (delim == ' ' && c == arrClass.length)) {
                        //          alert(objColl[i].tagName+" - "+objColl[i].className);
                        arr.push(objColl[i]);
                        break comparisonLoop;
                    }
                }
            }
    }
    return arr;
}


/* Gaetan Langhade - V-Technologies - 2008 */

//appliquer les styles correspondant aux scripts - sans attendre le chargement complet de la page
var suivi;
function cacherMenu(){
    if (document.getElementById("navigation")){
        document.getElementById("navigation").getElementsByTagName("ol")[0].className = "script";
        suivi = false;
    } else suivi = setTimeout("cacherMenu()",100);
}
cacherMenu();
		

//lancer la gestion des evenements du menu au chargement de la page
Event.observe(document, "dom:loaded", function() {
    amener();
});


//gerer les evenements du menu
function amener(){
    if (suivi) clearTimeout(suivi);
    if (document.getElementById("navigation")){
        var navi = document.getElementById("navigation");
        /* styles correspondant aux scripts - deja appliques ou non */
        navi.getElementsByTagName("ol")[0].className = "script";
        /* manipulation du menu a la souris */
        var selects = document.getElementsByTagName("select"); 
        var lesItem = navi.getElementsByTagName("li");
        for (i=0;i<lesItem.length;i++){
            if (lesItem[i].getElementsByTagName("ol").length > 0){
                lesItem[i].onmouseover = function(){
                    this.className += " survol";
                    for (var n=0; n<selects.length; n++) {
                        /* Hides <select> tags, which appear above menu in IE */
                        selects[n].className+=" hide_select";
                    }
                }
                lesItem[i].onmouseout = function(){
                    this.className = this.className.replace(new RegExp(" survol\\b"), "");
                    for (var n=0; n<selects.length; n++) {
                        /* Makes <select> tags visible again */
                        selects[n].className = selects[n].className.replace(new RegExp(" hide_select\\b"), "");
                    }
                }
                /* ajustement largeur pour IE 6 */
                if (navigator.userAgent.toLowerCase().indexOf("msie 6") > -1){
                    var largeur = parseInt(lesItem[i].getElementsByTagName("ol")[0].offsetWidth) - 29;
                    var lesSousItem = lesItem[i].getElementsByTagName("a");
                    for (j=1;j<lesSousItem.length;j++) lesSousItem[j].style.width = largeur + "px";
                }
            }
        }
        /* manipulation du menu au clavier */
        var lesItem = navi.getElementsByTagName("a");
        for (i=0;i<lesItem.length;i++){
            /* liens de premier niveau */
            if (lesItem[i].parentNode.parentNode.parentNode == document.getElementById("navigation")){
                lesItem[i].onfocus = function(){
                    this.parentNode.className += " survol";
                    for (var n=0; n<selects.length; n++) {
                        /* Hides <select> tags, which appear above menu in IE */
                        selects[n].className+=" hide_select";
                    }
                }
                lesItem[i].onblur = function(){
                    this.parentNode.className = this.parentNode.className.replace(new RegExp(" survol\\b"), "");
                    for (var n=0; n<selects.length; n++) {
                        /* Makes <select> tags visible again */
                        selects[n].className = selects[n].className.replace(new RegExp(" hide_select\\b"), "");
                    }
                }
            }
            /* liens de second niveau */
            else {
                lesItem[i].onfocus = function(){
                    this.parentNode.parentNode.parentNode.className += " survol";
                    this.className += " survol";
                    for (var n=0; n<selects.length; n++) {
                        /* Hides <select> tags, which appear above menu in IE */
                        selects[n].className+=" hide_select";
                    }
                }
                lesItem[i].onblur = function(){
                    this.parentNode.parentNode.parentNode.className = this.parentNode.parentNode.parentNode.className.replace(new RegExp(" survol\\b"), "");
                    this.className = this.className.replace(new RegExp(" survol\\b"), "");
                    for (var n=0; n<selects.length; n++) {
                        /* Makes <select> tags visible again */
                        selects[n].className = selects[n].className.replace(new RegExp(" hide_select\\b"), "");
                    }
                }
            }
        }
    }
}


function cache_select(){
    var selects = document.getElementsByTagName("select");
    //alert(selects.length);
    for (var n=0; n<selects.length; n++) {
        //alert(selects[n].className);
        /* Hides <select> tags, which appear above message in IE */
        selects[n].className+=" hide_select";
    }
}
function voir_select(){
    var selects = document.getElementsByTagName("select");
    for (var n=0; n<selects.length; n++) {
        /* Makes <select> tags visible again */
        selects[n].className = selects[n].className.replace(new RegExp(" hide_select\\b"), "");
    }
}


//traitement pour l'impression sous Firefox
if(navigator.userAgent.search("Firefox") >-1){
	var beforePrint = function() {
		var fieldsets = document.getElementsByTagName("fieldset");
		for (var i = 0; i < fieldsets.length; i++) {
			if (fieldsets[i].className == "")
				fieldsets[i].outerHTML = '<div class="fieldset">'
						+ fieldsets[i].innerHTML + '</div>'
		}
	};
	var afterPrint = function() {
		var fieldsets = document.getElementsByTagName("div");
		for (var i = 0; i < fieldsets.length; i++) {
			if (fieldsets[i].className == "fieldset")
				fieldsets[i].outerHTML = '<fieldset class="">'
						+ fieldsets[i].innerHTML + '</fieldset>'
		}
	};

	if (window.matchMedia) {
		var mediaQueryList = window.matchMedia('print');
		mediaQueryList.addListener(function(mql) {
			if (mql.matches) {
				beforePrint();
			} else {
				afterPrint();
			}
		});
	}

	window.onbeforeprint = beforePrint;
	window.onafterprint = afterPrint;

	var _print = window.print;
	window.print = function() {
		beforePrint();
		_print();
		afterPrint();
	}
}









