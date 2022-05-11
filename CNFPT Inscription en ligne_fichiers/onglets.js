/* Gaetan Langhade - V-Technologies - 2008 */


//lancer la gestion des evenements des onglets au chargement de la page
if (window.addEventListener) window.addEventListener("load",ongler,false);
else if (window.attachEvent) window.attachEvent("onload",ongler);


var onglets;
//gerer le clic sur les onglets
function ongler(){
	if (document.getElementById("onglets")){
		onglets = document.getElementById("onglets");
		//les onglets sont des titres de niveau 3
		var lesOnglets = onglets.getElementsByTagName("h3");
		for (i=0;i<lesOnglets.length;i++){
			//les onglets manipulables contiennent un lien
			if (lesOnglets[i].getElementsByTagName("a").length > 0){
				//lesOnglets[i].getElementsByTagName("a")[0].onclick = ongletManipuler;
}	}	}	}


//cliquer sur un onglet (souris et clavier)
function ongletManipuler(a){
	//remise a zero des onglets
	var lesItem = onglets.getElementsByTagName("li");
	for (i=0;i<lesItem.length;i++){
		if (lesItem[i].className == "actif"){
			lesItem[i].className = "";
			//retablir un lien sur l'onglet qui etait actif
			var texte = lesItem[i].getElementsByTagName("h3")[0].innerHTML;
			lesItem[i].getElementsByTagName("h3")[0].innerHTML = "<a href=\"javascript:void(0);\" onclick=\"ongletManipuler(this);\">" + texte + "</a>";
			break;
	}	}
	//activer l'onglet qui a ete clique
	var lobj = this.tagName && this.tagName.toLowerCase() == "a" ? this : a;
	lobj.parentNode.parentNode.className = "actif";
	var texte = lobj.innerHTML;
	lobj.parentNode.innerHTML = texte;
	//correler avec le popup interne (lucarne.js)
	document.body.className = "";
	return false;
}


