/* Gaetan Langhade - V-Technologies - 2008 */

//lancer la gestion des evenements d'affichage de popup interne au chargement de la page
if (window.addEventListener) window.addEventListener("load",prePlier,false);
else if (window.attachEvent) window.attachEvent("onload",prePlier);



/* IMPORTANT :
la valeur de la variable chemin a redefinir en fonction de l'arborescence
*/
var chemin = "/css/images/";


//gerer l'interface et les evenements de manipulation de la visibilite des info
function prePlier(){
	if (document.getElementById("origami")){
		var divisions = document.getElementById("origami").getElementsByTagName("div");
		var titres = document.getElementById("origami").getElementsByTagName("h6");
		var etat = 0;
		for (i=0;i<divisions.length;i++){
			if (divisions[i].className.toLowerCase().indexOf("epique") > -1){
				//le premier tableau sera finalement rouvert
				if (etat == 0) var lequel = i;
				//inserere le lien
				var lien = insererLien(titres[i].innerHTML,etat);
				etat = 1;
				divisions[i].appendChild(lien);
				lien.onclick = function(){
					plier(this);
				}
				//que le titre aussi soit cliquable
				titres[i].style.cursor = "pointer";
				titres[i].onclick = function(){
					plier(this);
				}
				//cacher tous les tableaux
				if (divisions[i].nextSibling.nodeType == 1) divisions[i].nextSibling.style.display = "none";
				else divisions[i].nextSibling.nextSibling.style.display = "none";
		}	}
		//montrer le premier tableau
		divisions[lequel].parentNode.getElementsByTagName("table")[0].style.display = vase;
}	}


//different entre IE et FF
var vase = navigator.userAgent.toLowerCase().indexOf("msie") > -1 ? "block" : "table";


//cliquer sur le picto et sur le titre
function plier(a){
	//different entre IE et FF
	var lobj = a.parentNode.nextSibling.nodeType == 1 ? a.parentNode.nextSibling : a.parentNode.nextSibling.nextSibling;
	//visiblite du tableau
	lobj.style.display = lobj.style.display == "none" ? vase : "none";
	var etat = lobj.style.display == "none" ? 1 : 0;
	//modification du picto (attention, aussi a partir du titre)
	a.parentNode.getElementsByTagName("img")[0].src = chemin + picto[etat];
	//attribut alt du picto (attention, aussi a partir du titre)
	var texte = a.parentNode.getElementsByTagName("img")[0].alt;
	a.parentNode.getElementsByTagName("img")[0].alt = commentaire[etat] + "la liste des agents de la " + texte.split("la liste des agents de la ")[1];
}


//inserer dans le DOM au chargement de la page les liens-picto
var picto = new Array("picto-replier.gif","picto-deplier.gif");
var commentaire = new Array("Cacher ","Montrer ");
//a : titre
//b : etat
function insererLien(a,b){
	var lien = creer("a");
	attribuer(lien,"href","javascript:void(0);");
//	attribuer(lien,"onclick","return plier(this);"); //par sur IE
	var limage = creer("img");
	attribuer(limage,"src",chemin + picto[b]);
	attribuer(limage,"alt",commentaire[b] + "la liste des agents de la " + a);
	attribuer(limage,"width","41");
	attribuer(limage,"height","9");
	lien.appendChild(limage);
	return lien;
}



/* manip DOM sommaire */
function creer(qui){
	return document.createElement(qui);
}
function attribuer(qui,quoi,que){
	var attrib = document.createAttribute(quoi);
	attrib.nodeValue = que;
	qui.setAttributeNode(attrib);
}
