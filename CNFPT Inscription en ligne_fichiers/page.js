var _aagent_detail = [];
var _aAgentDetail = [];
// Evolution SYLVIA - Rapprochement Agent GDA ref #29543
var _checkAgentStrNom = function(param0, param1) {
	var civ = collectivite = false;
    var retour = '';
	if ($('AgentECiviliteM').checked) {
		civ = $('AgentECiviliteM').value;
	}
	if ($('AgentECiviliteMME').checked) {
		civ = $('AgentECiviliteMME').value;
	}
	if (civ !== false) {
		retour += '&data%5BAgent%5D%5Be_civilite%5D='+civ;
	}
    if ($('AgentCollectiviteId') && $('AgentCollectiviteId').value != '') {
        retour += '&data%5BAgent%5D%5Bcollectivite_id%5D='+$('AgentCollectiviteId').value;
    }

    return param1+retour;
};


var _checkcorrespopecomp = function(param0, param1) {
	var col_id = false;
	if ($('OperateurCollectiviteId')) {
		col_id = $('OperateurCollectiviteId').value;
	}
	if (col_id == false) {
		return false;
	} else {
		return param1+'&data%5BOperateur%5D%5Bcollectivite_id%5D='+col_id;
	}
}
document.observe('dom:loaded',
		
	
        function(e) {
			if($('btnValiderForm') !== null){
			$('btnValiderForm').on('click', function(event) {
					
					var quotaPlaces = document.getElementById("quotaPlaces");
					
					if(!quotaPlaces.checked) {
						return true;
					}
					
					var sessionId = document.getElementById("sessionId").value;
					new Ajax.Request('/groupes/verifierNbPlaces'+ '/' + sessionId,
			                {
								asynchronous: false,
			                    onSuccess: function(transport) {                    	
			                    	result = transport.responseText;
			                    	if(result == 'warning') {
			                    		alert('Le quota de places réservées est atteint par une collectivité');
			                    	}
			                        return true;
			                    },
			                    onFailure: function(response) {
			                        alert(response)
			                    }
			         });
					
				
			});
			}

			var simulerclickCheckBox = function() {
				$$('input').each(
					function(elt) {
						if (elt.type === 'checkbox') {
							var regExp = new RegExp("^GAListagentSEL_(\\d+)");
			                if(elt.id && elt.id.match(regExp) && elt.checked){
			                	ajouterCheckBoxCocheeASession(null,elt,regExp);
			                }
						}
					}
				)
			};
					
			var bIterate = true;
			var ajouterCheckBoxCocheeASession = function(event,elt, regExp){
				var _idsel = 'ALL';
			    var bsel = 0;
			    var eerAgent = new RegExp("^GAList(agent)SEL_(\\d+)");
			    if(elt.id.match(eerAgent)){
			        $$('.checkedCheckbox').each(function(eltc) {
		            	if(eltc.checked) {
		            		_idsel += "," + eltc.value;
		            	}
		            });
			        
		        	if(bIterate) {
		        		var _re = elt.id.match(regExp);
				        new Ajax.Request('/groupes/selectagents'+ '/1/id:' + _idsel + '.json',
				                {
				                    method: 'get',
				                    onSuccess: function(transport) {
				                        return true;
				                    },
				                    onFailure: function() {
				                        alert(_errorAjax)
				                    }
				                });
				        bIterate = false;
			        }
		        	return true;
			    } else {
			    	if (elt.value === 'ALL') {
			            bsel = 1;
			            $$('input').each(function(eltc) {
			                if ((eltc.type === 'checkbox' || eltc.type === 'radio')) {
			                    if (eltc.id && eltc.id.match(regExp)) {
			                        if (eltc.value !== 'ALL') {
			                            if (elt.checked) {
			                                _idsel += "," + eltc.value;
			                            }
			                            eltc.checked = elt.checked;
			                        }
			                    }
			                }
			            });
			        } else {
			            _idsel = elt.value;
			        }
			        var _re = elt.id.match(regExp);			        
			        new Ajax.Request('/groupes/select' + _re[1] + '/' + bsel + '/id:' + _idsel + '.json',
			                {
			                    method: 'get',
			                    onSuccess: function(transport) {
			                        return true;
			                    },
			                    onFailure: function() {
			                        alert(_errorAjax)
			                    }
			                }); 
			        return true;
			    }
			};

			simulerclickCheckBox();
			
            var _errorAjax = 'Une erreur est survenue dans la mise à jour des listes !';
            var _dowsem = {
                'etat_DisFiDos_pdf_lnk': false
            };

            // si on a un message flash et qu'il n'est pas vide, on le positionne au milieu de la zone visible du browser
            if ($('flashMessage') && $('flashMessage').innerHTML != '' && $$('.header')) {
                var newtop = (document.viewport.getHeight() / 2) - $$('.header')[0].getHeight();
                if (newtop < 0) {
                    newtop = 5; // pour ne pas être collé au header
                }
                $('flashMessage').setStyle({
                    'marginTop': 0,
                    top: newtop + 'px'
                });

            }

            // pour le traitement des préinscriptions, on facilite l'usage du critère de recherche identifiants session
            if ($("RechercheDemandeCodeStructure") && $('RechercheDemandeCodeStage') && $('RechercheDemandeCodeSession')) {
            	var c_struct = $("RechercheDemandeCodeStructure");
            	var c_stage = $("RechercheDemandeCodeStage");
            	var c_sess = $("RechercheDemandeCodeSession");
            	// une fois les champs remplis on passe automatiquement au suivant
            	c_struct.observe('keyup', function(evt) {
            		if (c_struct.value.length == c_struct.attributes.maxlength.value) {
            			c_stage.focus();
            		}
            	});
            	c_stage.observe('keyup', function(evt) {
            		// le code session n'est accessible que si le code stage est rempli
            		if (c_stage.value.length == c_stage.attributes.maxlength.value) {
            			c_sess.enable();
            			c_sess.focus();
            		} else {
            			c_sess.value = '';
            			c_sess.disable();
            		}
            	});
            	
            }
            
            $$('input').each(
                    function(elt) {
                        if ((elt.type === 'text')) {
                            if (elt.readAttribute('autocomplete') == 'off') {
																//sessionInterSeance0Formateur1
                                var re = new RegExp("^(session)?(InterSeance|FipSessionObjectif)(\\d+)Formateur(\\d+)$");
                                var _inum = elt.id.match(re);
                                if (_inum && $(_inum[2] + _inum[3] + "_autoCompcomm_" + _inum[4])) {
                                    var div_autocomplete = elt.readAttribute('rel');
                                    if (div_autocomplete == 'undefined' || div_autocomplete == '') {
                                        div_autocomplete = _inum[2] + _inum[3] + "_autoCompcomm_" + _inum[4];
                                    }
                                    new Ajax.Autocompleter(elt.id, div_autocomplete, '/webroot/formcomp.php',
                                            {
                                                minChars: 3,
                                    			frequency : 1,
                                                afterUpdateElement: function(input, select) {
                                                    if (select && select.id) {
														// sessionInterSeance0FormateurId1
                                                        if ($(_inum[1] + _inum[2] + _inum[3] + "FormateurId" + _inum[4])) {
                                                            $(_inum[1] + _inum[2] + _inum[3] + "FormateurId" + _inum[4]).value = select.id;
                                                        }
                                                    }
                                                }
                                            }
                                    );
                                }
								if (elt.id == 'OperateurNom') {
									var div_autocomplete = elt.readAttribute('rel');
                                    new Ajax.Autocompleter(elt.id, div_autocomplete, '/webroot/correspopecomp.php',
                                            {
                                                callback: _checkcorrespopecomp,
                                                minChars: 3,
                                    			frequency : 1,
                                                afterUpdateElement: function(input, select) {
                                                    if (select && select.id) {
                                                        if ($('OperateurCorrespondantId')) {
                                                            $('OperateurCorrespondantId').value = select.id;
                                                            $('operateurformid').submit();
                                                        }
                                                    }
                                                }
                                            }
                                    );
								}
                                if (elt.id == 'AgentStrNom') {
                                    new Ajax.Autocompleter(elt.id, 'AgentStrNom_autoComplete', '/webroot/gdaagentcomp.php',
                                            {
                                                callback: _checkAgentStrNom, // Evolution SYLVIA - Rapprochement Agent GDA ref #29543
                                                minChars: 3,
                                    			frequency : 1,
                                                afterUpdateElement: function(input, select) {
                                                    if($('AgentBGda')){
                                                        $('AgentBGda').value = '';
                                                    }
                                                    if (select && select.id) {
                                                        if ($('gda_agent_id')) {
                                                            $('gda_agent_id').value = select.id;
                                                            $('agent_form').submit();
                                                        }
                                                    }
                                                }
                                            }
                                    );
                                }
                                
                            } else {
                                
                                var reb = new RegExp("^liste_agentsReferenceformation(.*)$");
                                if (elt.id && elt.id.match(reb)) {
                                    elt.observe('change', function(event) {
                                        if ($('liste_agentsModif'))
                                            $('liste_agentsModif').value = '1';
                                    });
                                }
                                
                                var re = new RegExp("^FSPC_PC_(\\d+)"); // PC_COL_7955
                                if (elt.id && elt.id.match(re)) {
                                    elt.observe('blur', function(event) {
                                        var _id = elt.id.match(re);
                                        new Ajax.Request('/sessions/selectcol/pc:' + elt.value + '/id:' + _id[1] + '.json',
                                                {
                                                    method: 'get',
                                                    onSuccess: function(transport) {
                                                        if ($('FSPC_SC_' + _id[1])) {
                                                            var _response = transport.responseText.evalJSON();
                                                            $('FSPC_SC_' + _id[1]).checked = (_response.OK === 'OK') ? true : false;
                                                        }
                                                        if ($('FSPC_VALID')) {
                                                            var _response = transport.responseText.evalJSON();
                                                            if (_response.REP !== 'NOID') {
                                                                if (_response.REP === 'NONE') {
                                                                    $('FSPC_SELECT').style.display = 'none';
                                                                    $('FSPC_VALID').value = 'Valider sans sélection';
                                                                } else {
                                                                    $('FSPC_SELECT').style.display = 'block';
                                                                    $('FSPC_VALID').value = (parseInt(_response.REP, 10) > 1) ? 'Ajouter les ' + _response.REP + ' collectivités sélectionnées' : "Ajouter la collectivité sélectionnée";
                                                                }
                                                            }
                                                        }
                                                        return true;
                                                    },
                                                    onFailure: function() {
                                                        alert(_errorAjax)
                                                    }
                                                });
                                        return true;
                                    });
                                }
                                var re2 = new RegExp("^ICOL_PC_(\\d+)"); // PC_COL_7955
                                if (elt.id && elt.id.match(re2)) {
                                    elt.observe('blur', function(event) {
                                        var _id = elt.id.match(re2);
                                        new Ajax.Request('/sessions/setPlaceCT/pc:' + elt.value + '/id:' + _id[1] + '.json',
                                                {
                                                    method: 'get',
                                                    onSuccess: function(transport) {
                                                        return true;
                                                    },
                                                    onFailure: function() {
                                                        alert(_errorAjax)
                                                    }
                                                });
                                        return true;
                                    });
                                }
                                
                            }
                            var rea = new RegExp("^liste_agent_lieu(.*)$");
                            var reb = new RegExp("^GAListagentLieu(.*)$");
                            if (elt.id && (
                            		elt.id.match(rea) || elt.id.match(reb))) {
                            	elt.observe('click', function(event) {
                            		if ($('liste_agentsModif'))
                            			$('liste_agentsModif').value = '1';
                            	});
                            	elt.observe('focus', function(event) {
                            		if ($('liste_agentsModif'))
                            			$('liste_agentsModif').value = '1';
                            	});
                            }
                        } else
                        if ((elt.type === 'checkbox' || elt.type === 'radio')) {
                            var re = new RegExp("^FSPC_SC_(\\d+)");
                            if (elt.id && elt.id.match(re)) {
                                elt.observe('click', function(event) {
                                    new Ajax.Request('/sessions/selectcol/id:' + elt.value + '.json',
                                            {
                                                method: 'get',
                                                onSuccess: function(transport) { // FSPC_VALID
                                                    if ($('FSPC_PC_' + elt.value) && $('FSPC_SC_' + elt.value).checked === false) {
                                                        $('FSPC_PC_' + elt.value).value = '';
                                                    }
                                                    if ($('FSPC_VALID')) {
                                                        var _response = transport.responseText.evalJSON();
                                                        if (_response.REP !== 'NOID') {
                                                            if (_response.REP === 'NONE') {
                                                                $('FSPC_SELECT').style.display = 'none';
                                                                $('FSPC_VALID').value = 'Valider sans sélection';
                                                            } else {
                                                                $('FSPC_SELECT').style.display = 'block';
                                                                $('FSPC_VALID').value = (parseInt(_response.REP, 10) > 1) ? 'Ajouter les ' + _response.REP + ' collectivités sélectionnées' : "Ajouter la collectivité sélectionnée";
                                                            }
                                                        }
                                                    }
                                                    return true;
                                                },
                                                onFailure: function() {
                                                    alert(_errorAjax)
                                                }
                                            });
                                    return true;
                                });
                            }
                            re = new RegExp("^BOSEL_SES_(\\d+)");
                            if (elt.id && elt.id.match(re)) {
                                elt.observe('click', function(event) {
                                    new Ajax.Request('/fip_sessions/selectsession/id:' + elt.value + '.json',
                                            {
                                                method: 'get',
                                                onSuccess: function(transport) {
                                                    if ($('FiSessParam')) {
                                                        var _response = transport.responseText.evalJSON();
                                                        if (_response.REP !== 'NOID') {
                                                            $('FiSessParam').style.display = (_response.REP === 'NONE') ? 'none' : 'block';
                                                            $('FiSessParam').innerHTML = (parseInt(_response.REP, 10) > 1) ? 'Paramétrer les ' + _response.REP + ' sessions sélectionnées' : "Paramétrer la session sélectionnée";
                                                        }
                                                    }
                                                    return true;
                                                },
                                                onFailure: function() {
                                                    alert(_errorAjax)
                                                }
                                            });
                                    return true;
                                });
                            }
                            
                            var regExp = new RegExp("^GAList(agent|session)SEL_(\\d+)");
                            if(elt.id && elt.id.match(regExp)){
                            	elt.observe('click', function(event) {
                                    var _idsel = 'ALL';
                                    var bsel = 0;
                                    var eerAgent = new RegExp("^GAList(agent)SEL_(\\d+)");
                                    if(elt.id.match(eerAgent)){
	                                    var checkBoxGeneral = 'GAListagentSEL_0';
	                                    if (elt.id.match(checkBoxGeneral)) {
	                                    	if(elt.checked)
	                                    		bsel = 1;
	                                    	else
	                                    		bsel = 0;
	                                        $_count = $$('.checkedCheckbox:checked').length;
	                                        $$('.checkedCheckbox').each(function(eltc) {
	                                        	if(!eltc.getAttribute('disabled')) {
	                                        		_idsel += "," + eltc.value;
	                                        		eltc.checked = elt.checked;
	                                        	}
	                                        });
	                                    }else {
	                                    	if(elt.checked)
	                                    		bsel = 1;
	                                    	else
	                                    		bsel = 0;
	                                        _idsel = elt.value;
	                                    }
	                                    var _re = elt.id.match(regExp);
	                                    new Ajax.Request('/groupes/selectagents'+ '/' + bsel + '/id:' + _idsel + '.json',
	                                            {
	                                                method: 'get',
	                                                onSuccess: function(transport) {
	                                                    return true;
	                                                },
	                                                onFailure: function() {
	                                                    alert(_errorAjax)
	                                                }
	                                            });
	                                    return true;
                                    }
                                    else{
                                    	if (elt.value === 'ALL') {
                                            bsel = 1;
                                            $$('input').each(function(eltc) {
                                                if ((eltc.type === 'checkbox' || eltc.type === 'radio')) {
                                                    if (eltc.id && eltc.id.match(regExp)) {
                                                        if (eltc.value !== 'ALL') {
                                                            if (elt.checked) {
                                                                _idsel += "," + eltc.value;
                                                            }
                                                            eltc.checked = elt.checked;
                                                        }
                                                    }
                                                }
                                            });
                                        } else {
                                            _idsel = elt.value;
                                        }
                                        var _re = elt.id.match(regExp);
                                        new Ajax.Request('/groupes/select' + _re[1] + '/' + bsel + '/id:' + _idsel + '.json',
                                                {
                                                    method: 'get',
                                                    onSuccess: function(transport) {
                                                        return true;
                                                    },
                                                    onFailure: function() {
                                                        alert(_errorAjax)
                                                    }
                                                });
                                        return true;
                                    }
                                });
                            }

                            var reb = new RegExp("^GAListagentArme(.*)$");
                            if (elt.id && elt.id.match(reb)) {
                            	elt.observe('click', function(event) {
                            		if ($('liste_agentsModif'))
                            			$('liste_agentsModif').value = '1';
                            	});
                            }
                        } else
                        if ((elt.type === 'submit' || elt.type === 'button')) {
                            var repGAListagent = new RegExp("^GAListagent(convocation|courrierrefus|inscrire|reporter|supprimer|fermer)$");
                            if (elt.id && elt.id == 'SESS_CONVOC') {
                                elt.observe('click', function(event) {
                                    if (!confirm('Etes-vous sûr(e) ?')) {
                                        Event.stop(event);
                                        return false;
                                    }
                                    if ($('SESS_CONVOC_SEL')) {
                                        $('SESS_CONVOC_SEL').value = "";
                                        var re = new RegExp("^SEL_AG_(\\d+)");
                                        var rea = new RegExp("^SEL_AC_(CT|FOR|ACF)_(\\d+)");
                                        $$('input').each(function(elt) {
                                            if (elt.id && elt.id.match(re) && elt.checked) {
                                                var _re = elt.id.match(re);
                                                if (_re[1]) {
                                                    $('SESS_CONVOC_SEL').value += ($('SESS_CONVOC_SEL').value == '') ? _re[1] : "," + _re[1];
                                                }
                                            } else
                                            if (elt.id && elt.id.match(rea) && elt.checked) {
                                                var _re = elt.id.match(rea);
                                                if (_re[1]) {
                                                    $('SESS_CONVOC_SEL').value += ($('SESS_CONVOC_SEL').value == '') ? _re[1] + '_' + _re[2] : "," + _re[1] + '_' + _re[2];
                                                }
                                            }
                                        });
                                    }
                                    //							console.debug($('SESS_CONVOC_SEL').value);
                                    return true;
                                });
                            } else
                            if (elt.id && elt.id == 'GAListagentenregistrer') {
                                elt.observe('click', function(event) {
                                    if ($('liste_agentsModif') && $('liste_agentsModif').value == '1') {
                                        if (!confirm('Confirmez votre enregistrement')) {
                                            Event.stop(event);
                                            return false;
                                        }
                                    } else {
                                        alert("Il n'y a pas de modification effectuée");
                                        Event.stop(event);
                                        return false;
                                    }
                                    return true;
                                });
                            } else
                            if (elt.id && elt.id == 'GAListagentreset') {
                                elt.observe('click', function(event) {
                                    if ($('liste_agentsModif'))
                                        $('liste_agentsModif').value = '';
                                });
                            } else
                            // Constituer les groupes : Bouton Déployer/Fermer
                            if (elt.id && elt.id == 'btn_toggle_deploy') {
                                elt.observe('click', function(event) {
                                	if ( $('btn_toggle_deploy_value') ) {
                                		// on inverse l'état
                                		var nextState = $('btn_toggle_deploy_value').value == '1' ? '0' : '1';
                                		var nextLibelle = nextState == '1' ? 'Fermer' : 'Déployer';
                                		$('btn_toggle_deploy_value').value = nextState;
                                		$('btn_toggle_deploy').value = nextLibelle;
                                		
                         	  			// création de la règle CSS à appliquer
                        	  			var cssRule = (nextState == '1') ? 'table-row' : 'none';
                        	  			
                                		// on met à jour l'IHM avant la requete AJAX pour avoir une page responsive
                        	  			$$('tr.agent-motivation-avis').each(function(item) {
                        	  				item.style.display = cssRule;
                        	  			});;
                                		
                                		// lancement de la requête Ajax permettant d'enregistrer en session l'état
                                	 	new Ajax.Request('/groupes/deployMotivationAvis.json?state=' + nextState, {
                                	 		method:'get',
                                	  		onSuccess: function(transport) { },
                                	  		onFailure: function() { alert(_errorAjax) }
                                	 	});
                                	 	
                                	}
                                });
                            } else
                            // FO Inscription sessions intra/union Bouton Déployer/Fermer
                        	if (elt.id && elt.id == 'btn_toggle_deploy_fo') {
                                elt.observe('click', function(event) {
                                	if ( $('btn_toggle_deploy_value_fo') ) {
                                		// on inverse l'état
                                		var nextState = $('btn_toggle_deploy_value_fo').value == '1' ? '0' : '1';
                                		var nextLibelle = nextState == '1' ? 'Fermer' : 'Déployer';
                                		$('btn_toggle_deploy_value_fo').value = nextState;
                                		$('btn_toggle_deploy_fo').value = nextLibelle;
                                		
                         	  			// création de la règle CSS à appliquer
                        	  			var cssRule = (nextState == '1') ? 'table-row' : 'none';
                        	  			
                                		// on met à jour l'IHM avant la requete AJAX pour avoir une page responsive
                        	  			$$('tr.agent-motivation-avis').each(function(item) {
                        	  				item.style.display = cssRule;
                        	  			});;
                                	}
                                });
                            }else
                            if (elt.id && elt.id.match(repGAListagent)) {
                                elt.observe('click', function(event) {
                                    if ($('liste_agentsModif') && $('liste_agentsModif').value == '1') {
                                        if (!confirm('Vous allez perdre vos modifications en cours, confirmez')) {
                                            Event.stop(event);
                                            return false;
                                        }
                                    } else if (elt.id === 'GAListagentsupprimer') {
                                        if (!confirm('Etes vous sur(e) ?')) {
                                            Event.stop(event);
                                            return false;
                                        }
                                    }
                                    return true;
                                });
                            }
                        }
                    }
            );

            $$('textarea').each(
                    function(elt) {
                        var reb = new RegExp("^liste_agentsStrMotivation(.*)$");
                        if (elt.id && elt.id.match(reb)) {
                            elt.observe('change', function(event) {
                                if ($('liste_agentsModif'))
                                    $('liste_agentsModif').value = '1';
                            });
                        }
                        var reb = new RegExp("^liste_agentsStrAvis(.*)$");
                        if (elt.id && elt.id.match(reb)) {
                            elt.observe('change', function(event) {
                                if ($('liste_agentsModif'))
                                    $('liste_agentsModif').value = '1';
                            });
                        }
                    }
            );

            //  console.debug(_dowsem);
            $$('select').each(
                    function(elt) {
                        var resf = new RegExp("^(session)?(InterSeance|FipSessionObjectif)(\\d+)FormateurPlus$");
						if (elt.id && elt.id.match(resf)) {
                            elt.observe('change', function(event) {
                                elt.form.submit();
                            });
						}
                        if (elt.id && elt.id == 'recherche_agentsSeanceId') {
                            elt.observe('change', function(event) {
                                elt.form.submit();
                            });
                        }
                        if (elt.id && elt.id == 'MaildocInteg_idtype') {
                            elt.observe('change', function(event) {
                                elt.form.submit();
                            });
                        } else
                        if (elt.id && elt.id == 'MailFusion_idtype') {
                            elt.observe('change', function(event) {
                                elt.form.submit();
                            });
                        } else
                        if (elt.id && elt.id == 'MaildocInter_idtype') {
                            elt.observe('change', function(event) {
                                elt.form.submit();
                            });
                        } else
                            if (elt.id && elt.id == 'MaildocIntra_idtype') {
                                elt.observe('change', function(event) {
                                    elt.form.submit();
                                });
                        } else
                            if (elt.id && elt.id == 'MaildocPrepa_idtype') {
                                elt.observe('change', function(event) {
                                    elt.form.submit();
                                });
                        }else
                        	if (elt.id && elt.id == 'MaildocPolice_idtype') {
                        		elt.observe('change', function(event) {
                        			elt.form.submit();
                        		});
                    	}else
                            if (elt.id && elt.id == 'input_data_inter_session_classement_id') {
                            	checkNomenclature(elt);
                                elt.observe('change', function(event) {
                                	checkNomenclature(elt);
                                });
                        }
                         else
                        	 if (elt.id && (elt.id == 'input_data_inter_session_capl_id')) {
                        		 elt.observe('change',function (event){
                        			 changementCAPL(elt);
                        		 });
	                           }else
                             	 if (elt.id && (elt.id == 'input_data_inter_session_specialite_id')) {
                             		 elt.observe('change',function (event){
                             			liste_sous_specialites = $('input_data_inter_session_sous_specialite_id');
                             			 if (elt.value !== '') {
                             				 var url_ajax = '/inscriptions/getSousSpecialite/' + elt.value;
                             		         new Ajax.Request(url_ajax+'.json',
                             		              {
                             		                  method: 'get',
                             		                  onSuccess: function(transport) {
                             		                      var _response = transport.responseText.evalJSON();
                             		                      liste_sous_specialites.options.length = 0;
                             		                      liste_sous_specialites.options.add(new Option('Choisissez une Sous-Spécialité', ''));
                             		                      for (var i = 0; i < _response.length; i++) {
                             		                          var _d = _response[i];
                             		                          liste_sous_specialites.options.add(new Option(_d.text, _d.value));
                             		                      }
                             		                      return true;
                             		                  },
                             		                  onFailure: function() {
                             		                      alert(_errorAjax)
                             		                  }
                             		              });
                             			 }else{
                             				 liste_sous_specialites.options.length = 0;
                             				 liste_sous_specialites.options.add(new Option('Choisissez une Sous-Spécialité', ''));
                             			 }
                             		 }); 
	                   }else
                        if (elt.id && (elt.id == 'input_data_inter_session_inter_domaine_id' || elt.id == 'recherche_sessionsInterDomaineId')) {
                            elt.observe('change', function(event) {
                            	changementDomaine(elt);
                            });
                        } else {
                            var ree = new RegExp("^liste_agents(Etatpresence|Nbheure|ObjectifAtteint|Arme)(.*)$");
                            if (elt.id && elt.id.match(ree)) {
                                elt.observe('change', function(event) {
                                    presence_set_agent(elt);
                                });
                            } else {
                                ree = new RegExp("^liste_agentsEtat(.*)$");
                                if (elt.id && elt.id.match(ree)) {
                                    elt.observe('change', function(event) {
                                        var _id = elt.id.match(ree);
                                        // Gestion des états refusés
                                        if (elt.value == 'refuse') {
                                        	// on est sur la liste de modification globale
                                            if (parseInt(_id[1], 10) === 0) {
                                                var _idmotif = $('liste_agentsEtatmotifrefus' + _id[1]).value;
                                                var _sEtat = "";
                                                $$('select').each(
                                                    function(elts) {
                                                        if (elts.id && elts.id.match(ree)) {
                                                            if (elts.value == 'attente') {
                                                                var _idetat = elts.id.match(ree);
                                                                _sEtat += (_sEtat !== '') ? ";" : "";
                                                                _sEtat += _idetat[1] + "-" + elts.value + "-" + $('liste_agentsEtatmotifrefus' + _idetat[1]).value;
                                                            }
                                                        }
                                                    });

                                                Modalbox.show("/groupes/motifrefus/" + $("liste_agentsAggsessid").value + "/" + _id[1] + "/" + _sEtat, {title: "renseigner le motif", width: 600});
                                            
                                            // on est sur une liste refusé spécifique d'un agent
                                            } else {
                                                $('liste_agentsEtatmotifrefus' + _id[1]).style.display = 'block';
                                                if ($('liste_agentsModif'))
                                                    $('liste_agentsModif').value = '1';
                                            }
                                        // Gestion des états autres que refusés
                                        } else {
                                        	// on est sur la liste de modification globale
                                            if (parseInt(_id[1], 10) === 0) {
                                                $$('select').each(function(elts) {
                                                    if (elts.id && elts.id.match(ree)) {
                                                        if (elts.value == 'attente') {
                                                        	elts.value = elt.value;
                                                        	
                                                        	// on change l'état de modification
                                                        	monitoring_constitution_groupe_change(elts.id);
                                                        }
                                                    }
                                                });
                                            }
                                            
                                            // cas pour les autres listes
                                            if ($('liste_agentsEtatmotifrefus' + _id[1]))
                                                $('liste_agentsEtatmotifrefus' + _id[1]).style.display = 'none';
                                            if ($('liste_agentsEtatMotif_' + _id[1]))
                                                $('liste_agentsEtatMotif_' + _id[1]).style.display = 'none';
                                            if ($('liste_agentsModif'))
                                                $('liste_agentsModif').value = '1';
                                        }
                                    });
                                }

                                var reeo = new RegExp("^liste_agentsObjectif(.*)$"); // liste_agentsObjectif15346
                                if (elt.id && elt.id.match(reeo)) {
                                    elt.observe('change', function(event) {
                                        var _id = elt.id.match(reeo);
                                        var val = parseInt(elt.value, 10);
                                        if (val == 4 || val == 5) {
                                            $('liste_agentsBdiff' + _id[1]).style.display = 'block';
                                        } else {
                                            $('liste_agentsBdiff' + _id[1]).value = 0;
                                            $('liste_agentsBdiff' + _id[1]).style.display = 'none';
                                        }
                                        if ($('liste_agentsModif'))
                                            $('liste_agentsModif').value = '1';
                                    });
                                }

                                var reeb = new RegExp("^liste_agentsBdiff(.*)$"); // liste_agentsObjectif15346
                                if (elt.id && elt.id.match(reeb)) {
                                    elt.observe('change', function(event) {
                                        if ($('liste_agentsModif'))
                                            $('liste_agentsModif').value = '1';
                                    });
                                }

                                var reem = new RegExp("^liste_agentsMotifabsence(.*)$");
                                if (elt.id && elt.id.match(reem)) {
                                    elt.observe('change', function(event) {
                                        var _id = elt.id.match(reem);
                                        if (parseInt(_id[1], 10) === 0) {
                                            $$('select').each(function(elts) {
                                                if (elts.id && elts.id.match(reem)) {
                                                    elts.value = elt.value;
                                                }
                                            });
                                        }
                                    });
                                }

                            }
                            var reb = new RegExp("^liste_agentsBdc(.*)$");
                            if (elt.id && elt.id.match(reb)) {
                                elt.observe('change', function(event) {
                                    if ($('liste_agentsModif'))
                                        $('liste_agentsModif').value = '1';
                                });
                            }
                            var reb = new RegExp("^liste_agentsDocAsso(.*)$");
                            if (elt.id && elt.id.match(reb)) {
                                elt.observe('change', function(event) {
                                    if ($('liste_agentsModif'))
                                        $('liste_agentsModif').value = '1';
                                });
                            }
                            var reb = new RegExp("^liste_agentsAmenagement(.*)$");
                            if (elt.id && elt.id.match(reb)) {
                                elt.observe('change', function(event) {
                                    if ($('liste_agentsModif'))
                                        $('liste_agentsModif').value = '1';
                                });
                            }
                            var reb = new RegExp("^liste_agentsPpr(.*)$");
                            if (elt.id && elt.id.match(reb)) {
                                elt.observe('change', function(event) {
                                    if ($('liste_agentsModif'))
                                        $('liste_agentsModif').value = '1';
                                });
                            }
                            var reb = new RegExp("^liste_agentsHebergement(.*)$");
                            if (elt.id && elt.id.match(reb)) {
                                elt.observe('change', function(event) {
                                    if ($('liste_agentsModif'))
                                        $('liste_agentsModif').value = '1';
                                });
                            }
                        }

                    }
            );
            $$('span').each(
            		function(elt) {
            			// affichage de l'infobulle si la session payante a pour aire de financement RC
                        var rc_payant_inter = new RegExp("^interSessionPictogramme_(\\d+)_(.*)$");
                        if (elt.id && elt.id.match(rc_payant_inter)) {
                        	elt.observe('mouseover', function(event) {
                        		agent_detail.bInLayer = true;
                        		var _res = elt.id.match(rc_payant_inter);
                        		if (!event.layerX) {
                        			event.layerX = event.offsetX;
                        			event.layerY = event.offsetY;
                        		}
                        		var _sKey = _res[1] + _res[2];
                        		var layer = elt;
                        		var x = 0;
                        		var y = 0;
                        		while (layer.offsetParent != null) {
                        			x += layer.offsetLeft;
                        			y += layer.offsetTop;
                        			if (layer.offsetParent.id == 'fip_page') {
                        				break;
                        			}
                        			layer = layer.offsetParent;
                        		}
                        		_adCury = y - 50;
                        		_adCurx = x - 0;
                        		_adCurid = _sKey;
                        		if (_aagent_detail[_sKey]) {
                        			$('lucarne').update(_aagent_detail[_sKey]);
                        			$('lucarne').style.top = _adCury + 'px';
                        			$('lucarne').style.left = _adCurx + 'px';
                        		} else {
                        			var sessid = _res[1];
                        			new Ajax.Request(
                        					'/inscriptions/getInfobullePayantInter/?id=' + sessid + '&sKey=' + _sKey,
                        					{
                        						method: 'get',
                        						onSuccess: function(transport) {
                        							var _aKey = transport.responseText.match(/__(\d+.*)__/);
                        							if (_aKey && _aKey[1]) {
                        								_aagent_detail[_aKey[1]] = transport.responseText;
                        								if (_adCurid == _aKey[1]) {
                        									var notice = $('lucarne');
                        									notice.update(transport.responseText);
                        									notice.style.top = _adCury + 'px';
                        									notice.style.left = _adCurx + 'px';
                        								}
                        							}
                        						}
                        					});
                        		}
                        	});
                        	elt.observe('mouseout', function(event) {
                        		if (agent_detail.bInLayer == true) {
                        			agent_detail.bInLayer = false;
                        			setTimeout("agent_detail_close();", 50);
                        			return false;
                        		}
                        	});
                        }
                        
                        // affichage de l'infobulle version BO (aire de financement = RC, mais la session elle-même n'est pas payante)
                        var rc_payant = new RegExp("^SessionPictogramme_(\\d+)_(.*)$");
                        if (elt.id && elt.id.match(rc_payant)) {
                        	elt.observe('mouseover', function(event) {
                        		agent_detail.bInLayer = true;
                        		var _res = elt.id.match(rc_payant);
                        		if (!event.layerX) {
                        			event.layerX = event.offsetX;
                        			event.layerY = event.offsetY;
                        		}
                        		var _sKey = _res[1] + _res[2];
                        		var layer = elt;
                        		var x = 0;
                        		var y = 0;
                        		while (layer.offsetParent != null) {
                        			x += layer.offsetLeft;
                        			y += layer.offsetTop;
                        			if (layer.offsetParent.id == 'fip_page') {
                        				break;
                        			}
                        			layer = layer.offsetParent;
                        		}
                        		_adCury = y - 50;
                        		_adCurx = x - 0;
                        		_adCurid = _sKey;
                        		if (_aagent_detail[_sKey]) {
                        			$('lucarne').update(_aagent_detail[_sKey]);
                        			$('lucarne').style.top = _adCury + 'px';
                        			$('lucarne').style.left = _adCurx + 'px';
                        		} else {
                        			var sessid = _res[1];
                        			new Ajax.Request(
                        					'/groupes/getInfobullePayant/?id=' + sessid + '&sKey=' + _sKey,
                        					{
                        						method: 'get',
                        						onSuccess: function(transport) {
                        							var _aKey = transport.responseText.match(/__(\d+[^_]*)__/);
                        							if (_aKey && _aKey[1]) {
                        								_aagent_detail[_aKey[1]] = transport.responseText;
                        								if (_adCurid == _aKey[1]) {
                        									var notice = $('lucarne');
                        									notice.update(transport.responseText);
                        									notice.style.top = _adCury + 'px';
                        									notice.style.left = _adCurx + 'px';
                        								}
                        							}
                        						}
                        					});
                        		}
                        	});
                        	elt.observe('mouseout', function(event) {
                        		if (agent_detail.bInLayer == true) {
                        			agent_detail.bInLayer = false;
                        			setTimeout("agent_detail_close();", 50);
                        			return false;
                        		}
                        	});
                        }
            		}
            );
            $$('a').each(
                    function(elt) {
                        var refsvd = new RegExp("^FSVD_SEL_(.*)$");
                        if (elt.id && elt.id.match(refsvd)) {
                            elt.observe('click', function(event) {
                                var _res = elt.id.match(refsvd);
                                if ($(_res[1])) {
                                    var red = new RegExp("^modele:(.*)$");
                                    var _doc = $(_res[1]).value.match(red);
                                    if ($('uri:' + _doc[1])) {
                                        elt.href = $('uri:' + _doc[1]).value;
                                        return true;
                                    }
                                    return false;
                                }
                            });
                            return false;
                        }
                        //Renommage des regroupements
                        regExpre = new RegExp("^RgptRenommer_(.*)$");
                        if (elt.id && elt.id.match(regExpre)) {
                            elt.observe('click', function(event) {
                            	regExpre = new RegExp("^RgptRenommer_(.*)$");
                                var _id = elt.id.match(regExpre);
                                      Modalbox.show("/regroupements/renommer/afficher/" + _id[1] + "/", {title: "", width: 650});
                            });
                        }
                        //Transfert des inscriptions
                        //ILIA
                        rep = new RegExp("^GCReporter_(.*)_(.*)$");
                        if (elt.id && elt.id.match(rep)) {
                            elt.observe('click', function(event) {
                            	event.preventDefault();
                            	rep = new RegExp("^GCReporter_(.*)_(.*)$");
                                var _id = elt.id.match(rep);
                                // On ne peut pas faire de transfert si c'est une session Intra / Union à laquelle la CT d'un des agents sélectionnés n'a pas accès
                                new Ajax.Request('/groupes/checkSessionAcces/'+ _id[1],{
                        			onSuccess: function(response) {
                        				message = response.responseText;
                        				switch (message) {
                        					// tout va bien, on continue (ie. on affiche la boîte de confirmation du transfert)
                        					case 'OK':
                        						
                        						
                        						new Ajax.Request('/sessions/ajax_control_session_presentiel/'+_id[1], {
                        							method: 'post',
                        							asynchronous: false,
                        							onSuccess: function(response) {
                        								
                        								var obj = eval('(' + response.responseText + ')');
                        								 
                        								if(obj.AggSession.modalite_id == 1){
                                							Modalbox.show("/groupes/reportconfirm/" + _id[1] + "/" + _id[2] + "/", {title: "", width: 600});
                                						}else{
                                							control_multiple_popup_control_email_agent_unique();
                                    						document.getElementById("id1").value = _id[1];
                                    						document.getElementById("id2").value = _id[2];
                                    						document.getElementById("typeCntGroupe").value = '1';
                                    							
                                						}
                        							}
                        						});
                        						
                        					
                        						break;
                        					default:
                        						alert(message);
                        				}
                        			}
                        		});
                            });
                        }
                      //Dupliquer des inscriptions
                      //ILIA
                        dup = new RegExp("^GCDupliquer_(.*)_(.*)$");
                        if (elt.id && elt.id.match(dup)) {
                            elt.observe('click', function(event) {
                            	event.preventDefault();
                            	dup = new RegExp("^GCDupliquer_(.*)_(.*)$");
                                var _id = elt.id.match(dup);
                                // On ne peut pas faire de duplication si c'est une session Intra / Union à laquelle la CT d'un des agents sélectionnés n'a pas accès
                                new Ajax.Request('/groupes/checkSessionAcces/'+ _id[1],{
                        			onSuccess: function(response) {
                        				message = response.responseText;
                        				switch (message) {
                        					// tout va bien, on continue (ie. on affiche la boîte de confirmation de la duplication)
                        					case 'OK':
                        						
                        						new Ajax.Request('/sessions/ajax_control_session_presentiel/'+_id[1], {
                        							method: 'post',
                        							asynchronous: false,
                        							onSuccess: function(response) {
                        								
                        								var obj = eval('(' + response.responseText + ')');
                        								 
                        								if(obj.AggSession.modalite_id == 1){
                                    						Modalbox.show("/groupes/dupliquerconfirm/" + _id[1] + "/" + _id[2] + "/", {title: "", width: 600});
                                						}else{
                                							control_multiple_popup_control_email_agent_unique();
                                    						document.getElementById("id1").value = _id[1];
                                    						document.getElementById("id2").value = _id[2];
                                    						document.getElementById("typeCntGroupe").value = '2';
                                    							
                                						}
                        							}
                        						});
                        						
                        						break;
                        					default:
                        						alert(message);
                        				}
                        			}
                        		});
                            });
                        }
                        var refsvc = new RegExp("^FSVC_(SEL|MOD)_(.*)$");
                        if (elt.id && elt.id.match(refsvc)) {
                            elt.observe('click', function(event) {
                                if ($('convoquer_courrielsTypecourriel')) {
                                    var _res = elt.id.match(refsvc);
                                    if ($('Courriel' + _res[2])) {
                                        var red = new RegExp("^modele:(.*)$");
                                        var _doc = $('Courriel' + _res[2]).value.match(red);
                                        if (_doc) {
                                            if (_res[1] === 'SEL') {
                                            	var _href = '';
                                            	if ($('convoquer_courrielsModel') !== null && $('convoquer_courrielsModel').value == 'InterSession') {
                                        			if ($('convoquer_courrielsPolice')) {
                                        				_href = "/MaildocPolice";
                                        			}
                                        			else if ($('convoquer_courrielsIntra')) {
                                            			_href = "/MaildocIntra";
                                            		} else {
                                            			_href = "/MaildocInter";
                                            			if (typeof $('convoquer_courrielsNature') !== 'undefined') {
                                            				var nature = $('convoquer_courrielsNature').value;
                                            				var natureList = ['prepa', 'test', 'tremplin'];
                                            				if (natureList.indexOf(nature) > -1) {
                                            					_href = "/MaildocPrepa";
                                            				}
                                            			}
                                            		}
                                            	} else {
                                            		_href = "/MaildocInteg";
                                            	}
                                                _href += "/showemail/" + $('convoquer_courrielsTypecourriel').value + "/" + _res[2];
                                                if (_doc[1] !== 'referent') {
                                                    _href += "/add:" + _doc[1];
                                                }
                                                elt.href = _href;
                                                return true;
                                            } else {
                                                var _href = document.location.pathname;
                                                var rep = new RegExp("/(mod|add):.*(/|$)");
                                                _href = _href.replace(rep, "");
                                                _href += "/mod:" + _res[2];
                                                if (_doc[1] !== 'referent') {
                                                    _href += "/add:" + _doc[1];
                                                }
                                                elt.href = _href;
                                                return true;
                                            }
                                        }
                                    }
                                }
                                if ($('FipSessionTypecourriel')) {
                                    var _res = elt.id.match(refsvc);
                                    if ($('Courriel' + _res[2])) {
                                        var red = new RegExp("^modele:(.*)$");
                                        var _doc = $('Courriel' + _res[2]).value.match(red);
                                        if (_doc) {
                                            if (_res[1] === 'SEL') {
                                                var _href = ($('form_MaildocInter')) ? "/MaildocInter" : "/MaildocInteg";
                                                _href += "/showemail/" + $('FipSessionTypecourriel').value + "/" + _res[2];
                                                if (_doc[1] !== 'referent') {
                                                    _href += "/add:" + _doc[1];
                                                }
                                                elt.href = _href;
                                                return true;
                                            } else {
                                                var _href = document.location.pathname;
                                                var rep = new RegExp("/(mod|add):.*(/|$)");
                                                _href = _href.replace(rep, "");
                                                _href += "/mod:" + _res[2];
                                                if (_doc[1] !== 'referent') {
                                                    _href += "/add:" + _doc[1];
                                                }
                                                elt.href = _href;
                                                return true;
                                            }
                                        }
                                    }
                                }
                                return false;
                            });
                        } else
                        if (elt.id && elt.id == 'DisFiDos_pdf_lnk') {
                            // console.debug(_dowsem);
                            elt.observe('click', function(event) {
                                // console.debug(elt.rel);
                                // console.debug(_dowsem);
                                if (_dowsem.etat_DisFiDos_pdf_lnk) {
                                    return true;
                                }
                                _dowsem.etat_DisFiDos_pdf_lnk = true;
                                _cnfpt_showloader();
                                new Ajax.Request('/dispense/download.json?id=' + elt.rel,
                                        {
                                            method: 'get',
                                            onSuccess: function(transport) {
                                                _cnfpt_hideloader();
                                                // console.debug('OK ON REVIENT');
                                                // console.debug(transport);
                                                var _response = transport.responseText.evalJSON();
                                                // console.debug('OK json '+_response.FILE);
                                                $('DisFiDos_pdf_lnk').href = _response.FILE;
                                                $('DisFiDos_pdf_lnk').target = "_blank";
                                                // console.debug($('DisFiDos_pdf_lnk').innerHTML);
                                                $('DisFiDos_pdf_lnk').innerHTML = $('DisFiDos_pdf_lnk').innerHTML.replace(/Produire/ig, 'VOIR');
                                                alert('Génération bien effectuée, cliquez sur le lien');
                                                // console.debug('OK ON CLICK');
                                                return true;
                                            },
                                            onFailure: function() {
                                                alert(_errorAjax)
                                            }
                                        });
                                Event.stop(event);
                                return false;
                            });
                        }

                        var reap = new RegExp("^agent_pict_(\\d+)$"); //agent_pict_2781
                        if (elt.id && elt.id.match(reap)) {
                            elt.observe('mouseover', function(event) {
                                agent_detail.bInLayer = true;
                                var _res = elt.id.match(reap);
                                if (!event.layerX) {
                                    event.layerX = event.offsetX;
                                    event.layerY = event.offsetY;
                                }
                                var layer = elt;
                                var x = 0;
                                var y = 0;
                                while (layer.offsetParent != null) {
                                    x += layer.offsetLeft;
                                    y += layer.offsetTop;
                                    if (layer.offsetParent.id == 'fip_page') {
                                        break;
                                    }
                                    layer = layer.offsetParent;
                                }
                                _adCury = y - 100;
                                _adCurx = x + 30;
                                _adCurid = _res[1];
                                if (_aAgentDetail[_res[1]]) {
                                    $('lucarne').innerHTML = _aAgentDetail[_res[1]];
                                    $('lucarne').style.top = _adCury + 'px';
                                    $('lucarne').style.left = _adCurx + 'px';
                                } else {
                                    new Ajax.Request(
                                            '/agents/getdetail/?id=' + _res[1],
                                            {
                                                method: 'get',
                                                onSuccess: function(transport) {
                                                    var _aKey = transport.responseText.match(/__(\d+)__/);
                                                    if (_aKey && _aKey[1]) {
                                                        _aAgentDetail[_aKey[1]] = transport.responseText;
                                                        if (_adCurid == _aKey[1]) {
                                                            var notice = $('lucarne');
                                                            notice.update(transport.responseText);
                                                            notice.style.top = _adCury + 'px';
                                                            notice.style.left = _adCurx + 'px';
                                                        }
                                                    }
                                                }
                                            });
                                }
                            });
                            elt.observe('mouseout', function(event) {
                                if (agent_detail.bInLayer == true) {
                                    agent_detail.bInLayer = false;
                                    setTimeout("agent_detail_close();", 50);
                                    return false;
                                }

                            });
                        }
                        
                        
                        var reape = new RegExp("^interagent_pict_(\\d+)$"); //interagent_pict_2781
                        if (elt.id && elt.id.match(reape)) {
                            elt.observe('mouseover', function(event) {
                                agent_detail.bInLayer = true;
                                var _res = elt.id.match(reape);
                                if (!event.layerX) {
                                    event.layerX = event.offsetX;
                                    event.layerY = event.offsetY;
                                }
                                var layer = elt;
                                var x = 0;
                                var y = 0;
                                while (layer.offsetParent != null) {
                                    x += layer.offsetLeft;
                                    y += layer.offsetTop;
                                    if (layer.offsetParent.id == 'fip_page') {
                                        break;
                                    }
                                    layer = layer.offsetParent;
                                }
                                _adCury = y - 100;
                                _adCurx = x + 30;
                                _adCurid = _res[1];
                                if (_aAgentDetail[_res[1]]) {
                                    $('lucarne').innerHTML = _aAgentDetail[_res[1]];
                                    $('lucarne').style.top = _adCury + 'px';
                                    $('lucarne').style.left = _adCurx + 'px';
                                } else {
                                    new Ajax.Request(
                                            '/agents/getdetailinteragent/?id=' + _res[1],
                                            {
                                                method: 'get',
                                                onSuccess: function(transport) {
                                                    var _aKey = transport.responseText.match(/__(\d+)__/);
                                                    if (_aKey && _aKey[1]) {
                                                        _aAgentDetail[_aKey[1]] = transport.responseText;
                                                        if (_adCurid == _aKey[1]) {
                                                            var notice = $('lucarne');
                                                            notice.update(transport.responseText);
                                                            notice.style.top = _adCury + 'px';
                                                            notice.style.left = _adCurx + 'px';
                                                        }
                                                    }
                                                }
                                            });
                                }
                            });
                            elt.observe('mouseout', function(event) {
                                if (agent_detail.bInLayer == true) {
                                    agent_detail.bInLayer = false;
                                    setTimeout("agent_detail_close();", 50);
                                    return false;
                                }

                            });
                        }
                        
                        
                        
                        
                        
                        
                        
                        
                        
                        
                        

                        var rede = new RegExp("^detEmail_(\\d+)_(.*)$"); //detEmail_2781_Correspondant
                        if (elt.id && elt.id.match(rede)) {
                            elt.observe('mouseover', function(event) {
                                agent_detail.bInLayer = true;
                                var _res = elt.id.match(rede);
                                if (!event.layerX) {
                                    event.layerX = event.offsetX;
                                    event.layerY = event.offsetY;
                                }
                                var _sKey = _res[1] + _res[2];
                                var layer = elt;
                                var x = 0;
                                var y = 0;
                                while (layer.offsetParent != null) {
                                    x += layer.offsetLeft;
                                    y += layer.offsetTop;
                                    if (layer.offsetParent.id == 'fip_page') {
                                        break;
                                    }
                                    layer = layer.offsetParent;
                                }
                                _adCury = y - 50;
                                _adCurx = x + 50;
                                _adCurid = _sKey;
                                if (_aagent_detail[_sKey]) {
                                    $('lucarne').update(_aagent_detail[_sKey]);
                                    $('lucarne').style.top = _adCury + 'px';
                                    $('lucarne').style.left = _adCurx + 'px';
                                } else {
                                    var _sDesti = "&desti=" + _res[2];
                                    var sessid = (_res[2] == 'CT' || _res[2] == 'Formateur') ? $('liste_acteursAggsessid').value : $('liste_agentsAggsessid').value;
                                    if (elt.hasAttribute('itemtype') && elt.readAttribute('itemtype') === 'refus') {
                                        _sDesti += "&refus=1";
                                    }
                                    if (elt.hasAttribute('itemtype') && elt.readAttribute('itemtype') === 'attestation') {
                                        _sDesti += "&attestation=1";
                                    }
                                    new Ajax.Request(
                                            '/groupes/getconvocationdetail/?id=' + sessid + '&sKey=' + _sKey + '&agid=' + _res[1] + _sDesti,
                                            {
                                            	asynchronous: false,
                                                method: 'get',
                                                onSuccess: function(transport) {
                                                    var _aKey = transport.responseText.match(/__(\d+[^_]*)__/);
                                                    if (_aKey && _aKey[1]) {
                                                        _aagent_detail[_aKey[1]] = transport.responseText;
                                                        if (_adCurid == _aKey[1]) {
                                                            var notice = $('lucarne');
                                                            notice.update(transport.responseText);
                                                            notice.style.top = _adCury + 'px';
                                                            notice.style.left = _adCurx + 'px';
                                                        }
                                                    }
                                                }
                                            });
                                }
                            });
                            elt.observe('mouseout', function(event) {
                                if (agent_detail.bInLayer == true) {
                                    agent_detail.bInLayer = false;
                                    setTimeout("agent_detail_close();", 50);
                                    return false;
                                }
                            });

                        }
                        
                        
                        var rede2 = new RegExp("^detPrepa_(\\d+)_(.*)_(.*)$");
                        if (elt.id && elt.id.match(rede2)) {
                            elt.observe('mouseover', function(event) {
                            	agent_detail.bInLayer = true;
                                var _res = elt.id.match(rede2);
                                if (!event.layerX) {
                                    event.layerX = event.offsetX;
                                    event.layerY = event.offsetY;
                                }
                                var _dispositifId = _res[1];
                                var _agentId = _res[2];
                                var _destinataire = _res[3];
                                
                                var layer = elt;
                                var x = 0;
                                var y = 0;
                                
                                while (layer.offsetParent != null) {
                                    x += layer.offsetLeft;
                                    y += layer.offsetTop;
                                    if (layer.offsetParent.id == 'fip_page') {
                                        break;
                                    }
                                    layer = layer.offsetParent;
                                }
                                
                                _adCury = y - 50;
                                _adCurx = x + 50;
                                _adCurid = _agentId;

                                    new Ajax.Request(
                                            '/cnfpt/prepa/getdocdetail/?dispositifId=' + _dispositifId + '&agentId=' + _agentId + '&destinataire=' + _destinataire,
                                            {
                                                method: 'get',
                                                onSuccess: function(transport) {
                                                    var _aKey = transport.responseText.match(/__(\d+[^_]*)__/);
                                                    var notice = $('lucarne');
                                                    notice.update(transport.responseText);
                                                    notice.style.top = _adCury + 'px';
                                                    notice.style.left = _adCurx + 'px';
                                                    
                                                }
                                            });
                                
                            });
                            elt.observe('mouseout', function(event) {
                                if (agent_detail.bInLayer == true) {
                                	agent_detail.bInLayer = false;
                                    setTimeout("agent_detail_close();", 50);
                                    return false;
                                }
                            });

                        }
                        
                        var rede5 = new RegExp("^detPolice_(\\d+)_(.*)_(.*)$");
                        if (elt.id && elt.id.match(rede5)) {
                            elt.observe('mouseover', function(event) {
                            	agent_detail.bInLayer = true;
                                var _res = elt.id.match(rede5);
                                if (!event.layerX) {
                                    event.layerX = event.offsetX;
                                    event.layerY = event.offsetY;
                                }
                                var _dispositifId = _res[1];
                                var _agentId = _res[2];
                                var _destinataire = _res[3];
                                
                                var layer = elt;
                                var x = 0;
                                var y = 0;
                                
                                while (layer.offsetParent != null) {
                                    x += layer.offsetLeft;
                                    y += layer.offsetTop;
                                    if (layer.offsetParent.id == 'fip_page') {
                                        break;
                                    }
                                    layer = layer.offsetParent;
                                }
                                
                                _adCury = y - 50;
                                _adCurx = x + 50;
                                _adCurid = _agentId;

                                    new Ajax.Request(
                                            '/cnfpt/police/getdocdetailPolice/?dispositifId=' + _dispositifId + '&agentId=' + _agentId + '&destinataire=' + _destinataire,
                                            {
                                                method: 'get',
                                                onSuccess: function(transport) {
                                                    var _aKey = transport.responseText.match(/__(\d+[^_]*)__/);
                                                    var notice = $('lucarne');
                                                    notice.update(transport.responseText);
                                                    notice.style.top = _adCury + 'px';
                                                    notice.style.left = _adCurx + 'px';
                                                    
                                                }
                                            });
                                
                            });
                            elt.observe('mouseout', function(event) {
                                if (agent_detail.bInLayer == true) {
                                	agent_detail.bInLayer = false;
                                    setTimeout("agent_detail_close();", 50);
                                    return false;
                                }
                            });

                        }
                        
                        
                        
//                        var rede3 = new RegExp("^detCopies_(\\d+)_(.*)$"); //detEmail_2781_Correspondant
//                        if (elt.id && elt.id.match(rede3)) {
//                            elt.observe('mouseover', function(event) {
//                                agent_detail.bInLayer = true;
//                                var _res = elt.id.match(rede3);
//                                if (!event.layerX) {
//                                    event.layerX = event.offsetX;
//                                    event.layerY = event.offsetY;
//                                }
//                                var _sKey = _res[1] + _res[2];
//                                var layer = elt;
//                                var x = 0;
//                                var y = 0;
//                                while (layer.offsetParent != null) {
//                                    x += layer.offsetLeft;
//                                    y += layer.offsetTop;
//                                    if (layer.offsetParent.id == 'fip_page') {
//                                        break;
//                                    }
//                                    layer = layer.offsetParent;
//                                }
//                                _adCury = y - 50;
//                                _adCurx = x + 50;
//                                _adCurid = _sKey;
//                                if (_aagent_detail[_sKey]) {
//                                    $('lucarne').update(_aagent_detail[_sKey]);
//                                    $('lucarne').style.top = _adCury + 'px';
//                                    $('lucarne').style.left = _adCurx + 'px';
//                                } else {
//                                    var _sDesti = "&desti=" + _res[2];
//                                    var sessid = _res[1];
//                                    if (elt.hasAttribute('itemtype') && elt.readAttribute('itemtype') === 'refus') {
//                                        _sDesti += "&refus=1";
//                                    }
//                                    if (elt.hasAttribute('itemtype') && elt.readAttribute('itemtype') === 'attestation') {
//                                        _sDesti += "&attestation=1";	
//                                    }
//                                    new Ajax.Request(
//                                            '/cnfpt/prepa/getCopieDetail/?id=' + sessid + '&sKey=' + _sKey + '&agid=' + _res[1] + _sDesti,
//                                            {
//                                                method: 'get',
//                                                onSuccess: function(transport) {
//                                                    var _aKey = transport.responseText.match(/__(\d+[^_]*)__/);
//                                                    if (_aKey && _aKey[1]) {
//                                                        _aagent_detail[_aKey[1]] = transport.responseText;
//                                                        if (_adCurid == _aKey[1]) {
//                                                            var notice = $('lucarne');
//                                                            notice.update(transport.responseText);
//                                                            notice.style.top = _adCury + 'px';
//                                                            notice.style.left = _adCurx + 'px';
//                                                        }
//                                                    }
//                                                }
//                                            });
//                                }
//                            });
//                            elt.observe('mouseout', function(event) {
//                                if (agent_detail.bInLayer == true) {
//                                    agent_detail.bInLayer = false;
//                                    setTimeout("agent_detail_close();", 50);
//                                    return false;
//                                }
//                            });
//
//                        }
//                        
                        var rede3 = new RegExp("^detCopies_(\\d+)_(.*)_(.*)$");
                        if (elt.id && elt.id.match(rede3)) {
                            elt.observe('mouseover', function(event) {
                            	agent_detail.bInLayer = true;
                                var _res = elt.id.match(rede3);
                                if (!event.layerX) {
                                    event.layerX = event.offsetX;
                                    event.layerY = event.offsetY;
                                }
                                var layer = elt;
                                var _sKey = _res[1] + _res[2];
                                var x = 0;
                                var y = 0;
                                var _sDesti = "&desti=" + _res[3];
                                var sessid = _res[1];
                                while (layer.offsetParent != null) {
                                    x += layer.offsetLeft;
                                    y += layer.offsetTop;
                                    if (layer.offsetParent.id == 'fip_page') {
                                        break;
                                    }
                                    layer = layer.offsetParent;
                                }
                                _adCury = y - 50;
                                _adCurx = x + 50;
                                _adCurid = _sKey;

                                    new Ajax.Request(
                                    		'/cnfpt/prepa/getCopieDetail/?id=' + sessid + '&sKey=' + _sKey + '&agid=' + _res[2] + _sDesti,
                                            {
                                                method: 'get',
                                                onSuccess: function(transport) {
                                                    var _aKey = transport.responseText.match(/__(\d+[^_]*)__/);
                                                    var notice = $('lucarne');
                                                    notice.update(transport.responseText);
                                                    notice.style.top = _adCury + 'px';
                                                    notice.style.left = _adCurx + 'px';
                                                    
                                                }
                                            });
                                
                            });
                            elt.observe('mouseout', function(event) {
                                if (agent_detail.bInLayer == true) {
                                	agent_detail.bInLayer = false;
                                    setTimeout("agent_detail_close();", 50);
                                    return false;
                                }
                            });

                        }
                        
                        
                        var rede4 = new RegExp("^detPreco_(\\d+)_(.*)_(.*)$");
                        if (elt.id && elt.id.match(rede4)) {
                            elt.observe('mouseover', function(event) {
                            	agent_detail.bInLayer = true;
                                var _res = elt.id.match(rede4);
                                if (!event.layerX) {
                                    event.layerX = event.offsetX;
                                    event.layerY = event.offsetY;
                                }
                                var layer = elt;
                                var _sKey = _res[1] + _res[2];
                                var x = 0;
                                var y = 0;
                                var _sDesti = "&desti=" + _res[3];
                                var sessid = _res[1];
                                while (layer.offsetParent != null) {
                                    x += layer.offsetLeft;
                                    y += layer.offsetTop;
                                    if (layer.offsetParent.id == 'fip_page') {
                                        break;
                                    }
                                    layer = layer.offsetParent;
                                }
                                _adCury = y - 50;
                                _adCurx = x + 50;
                                _adCurid = _sKey;

                                    new Ajax.Request(
                                    		'/cnfpt/prepa/getPrecoDetail/?id=' + sessid + '&sKey=' + _sKey + '&agid=' + _res[2] + _sDesti,
                                            {
                                                method: 'get',
                                                onSuccess: function(transport) {
                                                    var _aKey = transport.responseText.match(/__(\d+[^_]*)__/);
                                                    var notice = $('lucarne');
                                                    notice.update(transport.responseText);
                                                    notice.style.top = _adCury + 'px';
                                                    notice.style.left = _adCurx + 'px';
                                                    
                                                }
                                            });
                                
                            });
                            elt.observe('mouseout', function(event) {
                                if (agent_detail.bInLayer == true) {
                                	agent_detail.bInLayer = false;
                                    setTimeout("agent_detail_close();", 50);
                                    return false;
                                }
                            });

                        }
                        
                        
                        
                        
                        
                        var achem = new RegExp("^docAcheminer_(\\d+)_(.*)$"); //detEmail_2781_Correspondant
                        if (elt.id && elt.id.match(achem)) {
                            elt.observe('mouseover', function(event) {
                                agent_detail.bInLayer = true;
                                var _res = elt.id.match(achem);
                                if (!event.layerX) {
                                    event.layerX = event.offsetX;
                                    event.layerY = event.offsetY;
                                }
                                var _sKey = _res[1] + _res[2];
                                var layer = elt;
                                var x = 0;
                                var y = 0;
                                while (layer.offsetParent != null) {
                                    x += layer.offsetLeft;
                                    y += layer.offsetTop;
                                    if (layer.offsetParent.id == 'fip_page') {
                                        break;
                                    }
                                    layer = layer.offsetParent;
                                }
                                _adCury = y - 50;
                                _adCurx = x - 0;
                                _adCurid = _sKey;
                                if (_aagent_detail[_sKey]) {
                                    $('lucarne').update(_aagent_detail[_sKey]);
                                    $('lucarne').style.top = _adCury + 'px';
                                    $('lucarne').style.left = _adCurx + 'px';
                                } else {
                                    var _sDesti = "&desti=" + _res[2];
                                    var _sListe = '';
                                    var sessid = (_res[2] == 'CT' || _res[2] == 'Formateur') ? $('liste_acteursAggsessid').value : $('liste_agentsAggsessid').value;
                                    if (elt.hasAttribute('itemtype') && elt.readAttribute('itemtype') === 'refus') {
                                        _sDesti += "&refus=1";
                                    }
                                    if (elt.hasAttribute('itemtype') && elt.readAttribute('itemtype') === 'attestation') {
                                        _sDesti += "&attestation=1";
                                    }
                                    if (elt.hasAttribute('itemtype') && elt.readAttribute('itemtype') === 'convocation') {
                                        _sListe += "&liste=1";
                                    }
                                    new Ajax.Request(
                                            '/tableaux/getconvocationdetail/?id=' + sessid + '&sKey=' + _sKey + '&agid=' + _res[1] + _sDesti + _sListe,
                                            {
                                                method: 'get',
                                                onSuccess: function(transport) {
                                                    var _aKey = transport.responseText.match(/__(\d+[^_]*)__/);
                                                    if (_aKey && _aKey[1]) {
                                                        _aagent_detail[_aKey[1]] = transport.responseText;
                                                        if (_adCurid == _aKey[1]) {
                                                            var notice = $('lucarne');
                                                            notice.update(transport.responseText);
                                                            notice.style.top = _adCury + 'px';
                                                            notice.style.left = _adCurx + 'px';
                                                        }
                                                    }
                                                }
                                            });
                                }
                            });
                            elt.observe('mouseout', function(event) {
                                if (agent_detail.bInLayer == true) {
                                    agent_detail.bInLayer = false;
                                    setTimeout("agent_detail_close();", 50);
                                    return false;
                                }
                            });

                        }
                        
                        // gestion de l'affichage des sessions payantes dans les tableaux de résultat de recherche en BO
                        var payant = new RegExp("^SessionPictogramme_(\\d+)");
                        if (elt.id && elt.id.match(payant) && elt.tagName.toLowerCase() == 'a') {
                        	elt.observe('click', function(event) {
                        		var _res = elt.id.match(payant);
                        		var sessid = _res[1];
                        		new Ajax.Request('/groupes/getArchiveBdc/?id=' + sessid, {
                        			method: 'get',
                        			onSuccess: function(transport) {
                        				var adresse = transport.responseText;
                        				if (adresse == 'sans_agents') {
                        					alert('Téléchargement du bon de commande impossible car aucun agent inscrit.');
                        				} else if (adresse != '') {
                        					window.location.href = adresse;
                        				}
                        			}
                        		});
                        	});
                        }
                    	// affichage de l'infobulle si la session payante a pour aire de financement RC
                        var rc_payant = new RegExp("^SessionPictogramme_(\\d+)_(.*)$");
                        if (elt.id && elt.id.match(rc_payant)) {
                        	elt.observe('mouseover', function(event) {
                        		agent_detail.bInLayer = true;
                        		var _res = elt.id.match(rc_payant);
                        		if (!event.layerX) {
                        			event.layerX = event.offsetX;
                        			event.layerY = event.offsetY;
                        		}
                        		var _sKey = _res[1] + _res[2];
                        		var layer = elt;
                        		var x = 0;
                        		var y = 0;
                        		while (layer.offsetParent != null) {
                        			x += layer.offsetLeft;
                        			y += layer.offsetTop;
                        			if (layer.offsetParent.id == 'fip_page') {
                        				break;
                        			}
                        			layer = layer.offsetParent;
                        		}
                        		_adCury = y - 50;
                        		_adCurx = x - 0;
                        		_adCurid = _sKey;
                        		if (_aagent_detail[_sKey]) {
                        			$('lucarne').update(_aagent_detail[_sKey]);
                        			$('lucarne').style.top = _adCury + 'px';
                        			$('lucarne').style.left = _adCurx + 'px';
                        		} else {
                        			var sessid = _res[1];
                        			new Ajax.Request(
                        					'/groupes/getInfobullePayant/?id=' + sessid + '&sKey=' + _sKey,
                        					{
                        						method: 'get',
                        						onSuccess: function(transport) {
                        							var _aKey = transport.responseText.match(/__(\d+[^_]*)__/);
                        							if (_aKey && _aKey[1]) {
                        								_aagent_detail[_aKey[1]] = transport.responseText;
                        								if (_adCurid == _aKey[1]) {
                        									var notice = $('lucarne');
                        									notice.update(transport.responseText);
                        									notice.style.top = _adCury + 'px';
                        									notice.style.left = _adCurx + 'px';
                        								}
                        							}
                        						}
                        					});
                        		}
                        	});
                        	elt.observe('mouseout', function(event) {
                        		if (agent_detail.bInLayer == true) {
                        			agent_detail.bInLayer = false;
                        			setTimeout("agent_detail_close();", 50);
                        			return false;
                        		}
                        	});
                        }
                        
                        // gestion de l'affichage des sessions payantes dans les tableaux de résultat de recherche en FO
                        var payant_inter = new RegExp("^interSessionPictogramme_([\\d\|]+)_([\\d\|]+)_(\\d+)");
                        if (elt.id && elt.id.match(payant_inter) && elt.tagName.toLowerCase() == 'a') {
                        	elt.observe('click', function(event) {
                        		var _res = elt.id.match(payant_inter);
                        		var sessid = _res[1];
                        		var coll_id = (_res[2] != '0') ? '&collectivite_id='+ _res[2] : '';
                        		var agent_id = (_res[3] != '0') ? '&agent_id='+ _res[3] : '';
                        		new Ajax.Request('/inscriptions/getArchiveBdcInter/?id=' + sessid + coll_id + agent_id, {
                        			method: 'get',
                        			onSuccess: function(transport) {
                        				var adresse = transport.responseText;
                        				if (adresse == 'sans_agents') {
                        					alert('Téléchargement du bon de commande impossible car aucun agent inscrit.');
                        				} else if (adresse != '') {
                        					window.location.href = adresse;
                        				}
                        			}
                        		});
                        	});
                        }
                    	// affichage de l'infobulle si la session payante a pour aire de financement RC
                        var rc_payant_inter = new RegExp("^interSessionPictogramme_(\\d+)(_.*)*_RC$");
                        if (elt.id && elt.id.match(rc_payant_inter)) {
                        	elt.observe('mouseover', function(event) {
                        		agent_detail.bInLayer = true;
                        		var _res = elt.id.match(rc_payant_inter);
                        		if (!event.layerX) {
                        			event.layerX = event.offsetX;
                        			event.layerY = event.offsetY;
                        		}
                        		var _sKey = _res[1] + _res[2];
                        		var layer = elt;
                        		var x = 0;
                        		var y = 0;
                        		while (layer.offsetParent != null) {
                        			x += layer.offsetLeft;
                        			y += layer.offsetTop;
                        			if (layer.offsetParent.id == 'fip_page') {
                        				break;
                        			}
                        			layer = layer.offsetParent;
                        		}
                        		_adCury = y - 50;
                        		_adCurx = x - 0;
                        		_adCurid = _sKey;
                        		if (_aagent_detail[_sKey]) {
                        			$('lucarne').update(_aagent_detail[_sKey]);
                        			$('lucarne').style.top = _adCury + 'px';
                        			$('lucarne').style.left = _adCurx + 'px';
                        		} else {
                        			var sessid = _res[1];
                        			new Ajax.Request(
                        					'/inscriptions/getInfobullePayantInter/?id=' + sessid + '&sKey=' + _sKey,
                        					{
                        						method: 'get',
                        						onSuccess: function(transport) {
                        							var _aKey = transport.responseText.match(/__(\d+.*)__/);
                        							if (_aKey && _aKey[1]) {
                        								_aagent_detail[_aKey[1]] = transport.responseText;
                        								if (_adCurid == _aKey[1]) {
                        									var notice = $('lucarne');
                        									notice.update(transport.responseText);
                        									notice.style.top = _adCury + 'px';
                        									notice.style.left = _adCurx + 'px';
                        								}
                        							}
                        						}
                        					});
                        		}
                        	});
                        	elt.observe('mouseout', function(event) {
                        		if (agent_detail.bInLayer == true) {
                        			agent_detail.bInLayer = false;
                        			setTimeout("agent_detail_close();", 50);
                        			return false;
                        		}
                        	});
                        }
                        
                        var rela = new RegExp("^liste_agentsEtatMotif_(\\d+)$"); // liste_agentsEtatMotif_14778
                        if (elt.id && elt.id.match(rela)) {
                            elt.observe('click', function(event) {
                                var _id = elt.id.match(rela);
                                var ree = new RegExp("^liste_agentsEtat(.*)$");
                                var _sEtat = "";
                                $$('select').each(
                                        function(elts) {
                                            if (elts.id && elts.id.match(ree)) {
                                                var _idetat = elts.id.match(ree);
                                                _sEtat += (_sEtat !== '') ? ";" : "";
                                                _sEtat += _idetat[1] + "-" + elts.value + "-" + $('liste_agentsEtatmotifrefus' + _idetat[1]).value
                                            }
                                        });
                                Modalbox.show("/groupes/motifrefus/" + $("liste_agentsAggsessid").value + "/" + _id[1] + "/" + _sEtat, {title: "renseigner le motif", width: 600});
                            })
                        }
                        var rep = new RegExp("^GAListplus_(.*)$");
                        if (elt.id && elt.id.match(rep)) {
                            elt.observe('click', function(event) {
                                var _res = elt.id.match(rep);
                                if ($("GAListplusagentmotiv_" + _res[1])) {
                                    $("GAListplusagentmotiv_" + _res[1]).style.display = ($("GAListplusagentmotiv_" + _res[1]).style.display == 'table-row') ? 'none' : 'table-row';
                                }
                                if ($("GAListplusagentavis_" + _res[1])) {
                                    $("GAListplusagentavis_" + _res[1]).style.display = ($("GAListplusagentavis_" + _res[1]).style.display == 'table-row') ? 'none' : 'table-row';
                                }
                            });
                        }
                        var repp = new RegExp("^PAListplus_(.*)$");
                        if (elt.id && elt.id.match(repp)) {
                            elt.observe('click', function(event) {
                                var _inb = 1;
                                while ($(elt.id + '_' + _inb)) {
                                    $(elt.id + '_' + _inb).style.display = ($(elt.id + '_' + _inb).style.display == 'table-row') ? 'none' : 'table-row';
                                    _inb += 1;
                                }
                                //lancement de la requete (une seule fois) pour recuperer les presences aux seances
                                if(!elt.hasAttribute('isFilled')){
                                	//modification du parametre pour ne faire la requete qu'une fois
                                	elt.setAttribute('isFilled', true);
                        	  		new Ajax.Request('/presences/presencesSeancesAgent/agentId:' + elt.id.split('_')[1] + '/sessId:' + $("liste_agentsAggsessid").value + '/isp:'+elt.up(1).hasClassName('impair'), {
                        				method: 'post',
                        				onSuccess: function(res) {
                        					//on modifie le contenu de la ligne initiale contenant le gif tournant
                        					html = res.responseText.evalJSON(true);
                        					$(elt.id+'_1').replace(html);
                        				}
                        			});
                                	
                                }
                            });
                        }
                        var regcr = new RegExp("^GCReporter_(.*)$");
                        if (elt.id && elt.id.match(regcr)) {
                            elt.observe('click', function(event) {
                                var _res = elt.id.match(regcr);
								if ($('GCReporternbplace_'+_res[1])) {
									var inbagent = parseInt($('GCReporternbagenttoreport').value, 10);
									var inbplace = parseInt($('GCReporternbplace_'+_res[1]).value, 10);
									var inbinscr = parseInt($('GCReporternbinscrit_'+_res[1]).value, 10);
									inbinscr -= parseInt($('GCReporternbannuler_'+_res[1]).value, 10);
									inbinscr -= parseInt($('GCReporternbrefuser_'+_res[1]).value, 10);
									if ((inbagent+inbinscr) > inbplace) {
										if (!confirm("Vous allez dépasser le nombre de places prévues pour cette session, confirmez ")) {
											Event.stop(event);
											return false;
										}
									}
								}
                            });
                        }
                        var rea = new RegExp("^GAListagentLieu(.*)$");
                        if (elt.id && elt.id.match(rea)) {
                        	elt.observe('click', function(event) {
                        		if ($('liste_agentsModif'))
                        			$('liste_agentsModif').value = '1';
                        	});
                        }

                    }
            );
            
            if($('btnCreerRegroupement')){
            	$('btnCreerRegroupement').observe('click', function(event) {
            		Event.stop(event);
            		var pForm = $('form_liste_collectivites');
            		var nouveauNom = $('liste_collectivitesStrNom');
            		var textNouveauNom = nouveauNom.value;
            		var nouveauNomEncoded;
            		if (textNouveauNom.length <= 0){
            			//console && console.log('champ vide');
            			alert('Le champ « Regroupement » est obligatoire pour créer un regroupement.');
            			return false;
            		}
            		else{
            			// Vérifier si le nom de regroupement renseigné existe déjà pour la structure courante
            			
            	  		new Ajax.Request('/sessions/verifierNomRegroupement/' + textNouveauNom, {
            				method: 'post',
            				parameters: [textNouveauNom],
            				onSuccess: function(res) {
            					//console && console.log('succes ajax');
            					if (res.responseText == '"false"') {
            						// Le nom existe, il faut modifier le regroupement en base
            						//console && console.log('modification');
        							alert('Le nom du regroupement saisi est déjà utilisé pour votre structure. Saisissez un autre nom.');
        							Event.stop(event);
        							return false;
            	  				}
            					else{
            						//console && console.log('création');
            				  		//Le nom n'existe pas, il faut créer le regroupement
            				  		pForm.action = '/sessions/enregistrerRegroupement/creer/'+textNouveauNom;
            				  		pForm.submit();
            						return true;
            					}
            				},
            				onFailure: function() {
            					alert(_errorAjax);
            					Event.stop(event);
    							return false;
            				}
            			});
            		}
            		return true;
            	});
            }
            
            if ($("BTN_SUPPRIMER")) {
                $("BTN_SUPPRIMER").observe('click', function(event) {
            		Event.stop(event);
            		var pForm = $('form_liste_regroupement');
            		var ligneSelectionne = $$('#form_liste_regroupement input:checked');
            		var nbligneselect = ligneSelectionne.length;
            		//aucune case n'est cochée. Ou il n'y a pas de case à cocher
            		if(nbligneselect == 0){
            			alert("Vous devez sélectionner au moins un regroupement.");
            			return false;
            		}else{
            			if (confirm("Etes-vous sûr de vouloir supprimer le(s) regroupement(s) sélectionné(s) ?")) {
            				pForm.action = '/regroupements/supprimer/';
            				pForm.submit();
            				return true;
            			}
            		}
                });
            }
            
            if ($("rechsesscompopen")) {
                $("rechsesscompopen").observe('click', function(event) {
                    $("rechsesscomp").style.display = 'block';
                    $("rechsesscompopen").style.display = 'none';
                    $("rechsesscompclose").style.display = 'block';
                });
                $("rechsesscompclose").observe('click', function(event) {
                    $("rechsesscomp").style.display = 'none';
                    $("rechsesscompopen").style.display = 'block';
                    $("rechsesscompclose").style.display = 'none';
                });
            }
            if ($("RechercheSessionsCollectiviteStr")) {
                $("RechercheSessionsCollectiviteStr").observe('blur', function(event) {
                    if ($("RechercheSessionsCollectiviteStr").value == '') {
                        $("recherche_sessionsCollectiviteId").value = 0;
                    }
                });
                new Ajax.Autocompleter('RechercheSessionsCollectiviteStr', 'RechercheSessionsCollectiviteStr_autoComplete', '/groupes/autoCompleteCollectivite',
                        {
                            minChars: 3,
                			frequency : 1,
                            afterUpdateElement: function(input, select) {
                                if (select && select.id) {
                                    if ($("recherche_sessionsCollectiviteId")) {
                                        $("recherche_sessionsCollectiviteId").value = select.id;
                                    }
                                }
                            }
                        }
                );
            }
            if ($("RechercheSessionsAgentStr")) {
                $("RechercheSessionsAgentStr").observe('blur', function(event) {
                    if ($("RechercheSessionsAgentStr").value == '') {
                        $("recherche_sessionsAgentId").value = 0;
                    }
                });
				var sCode = $('recherche_sessionsCurStructureCode').value;
                new Ajax.Autocompleter('RechercheSessionsAgentStr', 'RechercheSessionsAgentStr_autoComplete', '/webroot/agentcomp.php/?code='+sCode,
                        {
                            minChars: 3,
                            frequency : 1,
                            afterUpdateElement: function(input, select) {
                                if (select && select.id) {
                                    if ($("recherche_sessionsAgentId")) {
                                        $("recherche_sessionsAgentId").value = select.id;
                                    }
                                }
                            }
                        }
                );
            }
            // regroupements
            if ($("recherche_collectivitesRegroupementNom")) {
                $("recherche_collectivitesRegroupementNom").observe('blur', function(event) {
                    if ($("recherche_collectivitesRegroupementNom").value == '') {
                        $("recherche_collectivitesRegroupementId").value = 0;
                    }
                });
				var div_autocomplete = $("recherche_collectivitesRegroupementNom").readAttribute('rel');
                var rgrpt_autocomplete = new Ajax.Autocompleter('recherche_collectivitesRegroupementNom', div_autocomplete, '/webroot/regroupementcomp.php',
                        {
                            minChars: 3,
                            frequency : 1,
                            afterUpdateElement: function(input, select) {
                                if (select && select.id) {
                                    if ($("recherche_collectivitesRegroupementId")) {
                                        $("recherche_collectivitesRegroupementId").value = select.id;
                                    }
                                }
                            },
                            callback: function(input, query) {
                            	query += '&structure=' + $('recherche_collectivitesRegroupementStructure').value;
                            	return query;
                            }
                        }
                );
                
            }
            
            if ($("BONAligesti")) {
                $("BONAligesti").observe('click', function(event) {
                    if ($('BONAliadmin').hasClassName('actif')) {
                        $('BONAliadmin').toggleClassName('actif');
                    }
                    if ($('BONAliagent').hasClassName('actif')) {
                        $('BONAliagent').toggleClassName('actif');
                    }
                    if (!$('BONAligesti').hasClassName('actif')) {
                        $('BONAligesti').toggleClassName('actif');
                    }
                });
            }
            if ($("FOINSliste_affecter")) {
                $("FOINSliste_affecter").observe('click', function(event) {
                    var bTrait = false;
                    $$('input').each(
                            function(elt) {
                                var rede = new RegExp("^FOINSliste_select_(\\d+)$");
                                if (elt.id && elt.id.match(rede)) {
                                    if (elt.checked) {
                                        bTrait = true;
                                    }
                                }
                            }
                    )
                    if (bTrait == false) {
                        alert('Sélectionnez un agent à affecter');
                        Event.stop(event);
                        return false;
                    }
                    return true;
                });
            } 
            if ($("FOINSliste_refuser")) {
                $("FOINSliste_refuser").observe('click', function(event) {
                    var bTrait = false;
                    var _agentsRefuses = '';
                    if($$('.checkboxTraiterDemandes:checked').length > 1){
                    	$$('.checkboxTraiterDemandes').each(function(eltc) {
                    		if(eltc.checked){
                    			_agentsRefuses += "," + eltc.value;
                    		}
                        });
                    	Modalbox.show("/inscriptions/traiter/motifRefusPlusieursDemandes/" + _agentsRefuses, {title: "renseigner le motif", width: 600});
                        bTrait = true;
                    	
                    }
                    else if($$('.checkboxTraiterDemandes:checked').length == 1){
	                    $$('input').each(
	                            function(elt) {
	                                var rede = new RegExp("^FOINSliste_select_(\\d+)$");
	                                if (elt.id && elt.id.match(rede)) {
	                                    if (elt.checked) {
	                                        var _R = elt.id.match(rede);
	                                        Modalbox.show("/inscriptions/traiter/motif/" + _R[1], {title: "renseigner le motif", width: 600});
	                                        bTrait = true;
	                                    }
	                                }
	                            }
	                    )
                    }
                    if (bTrait == false) {
                        alert('Vous devez sélectionner au moins une demande.');
                    }
                    Event.stop(event);
                    return false;
                });
            }
            if ($("FOINSliste_refuserDemandeDispositif")) {
                $("FOINSliste_refuserDemandeDispositif").observe('click', function(event) {
                    var bTrait = false;
                    if($$('.radiobuttonTraiterDemandes:checked').length == 1){
                        $$('input').each(
                                function(elt) {
                                    var rede = new RegExp("^FOINSliste_select_(\\d+)$");
                                    if (elt.id && elt.id.match(rede)) {
                                        if (elt.checked) {
                                            var _R = elt.id.match(rede);
                                            Modalbox.show("/dispositifs/preinsdispo/refus/" + _R[1], {title: "renseigner le motif", width: 600});
                                            bTrait = true;
                                        }
                                    }
                                }
                        )
                    }
                    if (bTrait == false) {
                        alert('Vous devez sélectionner demande.');
                    }
                    Event.stop(event);
                    return false;
                });
            }
            if ($("FOINSliste_accepterDemandeDispositif")) {
                $("FOINSliste_accepterDemandeDispositif").observe('click', function(event) {
                    var bTrait = false;
                    $$('input').each(
                            function(elt) {
                                var rede = new RegExp("^FOINSliste_select_(\\d+)$");
                                if (elt.id && elt.id.match(rede)) {
                                    if (elt.checked) {
                                        bTrait = true;
                                    }
                                }
                            }
                    )
                    if (bTrait == false) {
                        alert('Vous devez sélectionner une demande.');
                        Event.stop(event);
                        return false;
                    }
                    return true;
                });
            } 
            if ($("FOCOLOmailopen")) {
                $("FOCOLOmailopen").observe('click', function(event) {
                    if (confirm('Etes-vous sûr(e) ?')) {
                        Modalbox.show($("FOCOLOmailopen").href, {title: "envoyer un courriel", width: 600});
                    }
                    Event.stop(event);
                    return false;
                });
            }
            if ($("GAListsessioneffacer")) {
                $("GAListsessioneffacer").observe('click', function(event) {
                    new Ajax.Request('/groupes/selectsession/bclean:1.json',
                            {
                                method: 'get',
                                onSuccess: function(transport) {
                                	$$('.checkbox_sessions').each(function(element) {
                                		element.checked = false;
                                	});
                                    return true;
                                },
                                onFailure: function() {
                                    alert(_errorAjax)
                                }
                            });
                });
            }
            if ($("GAListacteuremail")) {
                $("GAListacteuremail").observe('click', function(event) {
                    var s_Email = "";
                    var pForm = $$('#form_liste_acteurs input');
                    var _aEmail = {};
                    pForm.each(function(e) {
                        if (e.type && e.type == 'checkbox') {
                            if (e.checked == true) {
                                var _aRes = e.id.match(/^GAListacteurSEL_\d+$/);
                                if (_aRes) {
                                    if (!_aEmail[e.value]) {
                                        s_Email += (s_Email != '') ? ';' + e.value : e.value;
                                        _aEmail[e.value] = true;
                                    }
                                }
                            }
                        }
                        ;
                    });
                    if (s_Email != '') {
                        parent.location = 'mailto:' + s_Email;
                    } else {
                        alert("Sélectionnez au moins un acteur !");
                    }
                    Event.stop(event);
                    return false;
                });
            }
			if ($('AgentRejeter')) {
                $("AgentRejeter").observe('click', function(event) {
                    if (!confirm('Etes-vous sûr(e) ?')) {
                        Event.stop(event);
                        return false;
                    }
                });
			}
            if ($('FSPC_VALID')) {
                $("FSPC_VALID").observe('click', function(event) {
                    if (!confirm('Etes-vous sûr(e) ?')) {
                        Event.stop(event);
                        return false;
                    }
                });
            }
            
            // Constituer les groupes
            // -- gestion de la modification des agents et des changements possibles
            if ( $$('.groupe_constituer_monitor_change').size() > 0 ) {
            	
            	// -- Ajout d'un monitoring sur tous les champs éditables pour détecter les changements
            	$$('.groupe_constituer_monitor_change').each(function(element) {
                    $(element).observe('change', function(event) {
                    	monitoring_constitution_groupe_change($(this).id);
                    });
                    
                    // cas spécifique des textarea
                    if ( element.tagName && element.tagName.toLowerCase() == 'textarea') {
                        $(element).observe('keyup', function(event) {
                        	monitoring_constitution_groupe_change($(this).id);
                        });
                    }
                });
            	
                // -- Ajout d'un contrôle lors de la pagination pour détecter si les données des agents ont été modifiés
            	$$('.resultats a, .resultats input').each(function(element) {
            		$(element).observe('click', function(event) {
            			// on controle qu'un changement a eu lieu
            			if ( $('liste_agentsFieldsModified') && $('liste_agentsFieldsModified').value.length > 0 ) {
            				if ( !confirm('Le changement de page va entraîner la perte des données si vous ne réalisez pas un enregistrement. Voulez-vous continuer ?') ) {
            					event.preventDefault();
            					return false;
            				}
            			}
            		});
            	});
            }
        	
        	// Ajout d'un event de contrôle sur chaque checkbox pour cocher la case d'entête 
            $$('.checkedCheckbox').each(function(chk1){
            	// On surveille le click 
                chk1.observe('click', function(evt){
                	
                	// Vérification si checkbox d'entête doit être cochée/décochée
                	control_checkBoxGeneralAgents();
                });
            });
    		
            // Au chargement de la page, on vérifie si la checkbox d'entête doit être cochée/décochée
            control_checkBoxGeneralAgents();
            // CNIl Au chargement de la page, on positionne les valeurs des champs
            var cgu_onload = true;
            if($('input_param_document_cgu_id_hidden')) creer_document_cgu(cgu_onload);
    		
			//Onglet Hors région
			if($('TabListHorsRegion')) {
				$('tabs').observe('click', function() {
					if($('TabListHorsRegion').getAttribute('class', 'active')){
						load_onglet_hors_region(true);
					} else {
						load_onglet_hors_region(false);
					}
				});
				//si arrivée sur onglet au (re)chargement de la page
				if($('TabListHorsRegion').getAttribute('class', 'active')){
					load_onglet_hors_region(true);
				}
			}
			
			//Onglet accord simplifié
			if (undefined != $('isSuperAdmin')) {
				var isSuperAdmin = document.getElementById("isSuperAdmin").value;
				if($('TabListAccordSimplifie') && isSuperAdmin == 1){
						$('tabs').observe('click', function() {
							if($('TabListAccordSimplifie').getAttribute('class', 'active')){
								load_onglet_accord_simplifie(true);
							} else {
								load_onglet_accord_simplifie(false);
							}
						});
						//si arrivée sur onglet au (re)chargement de la page
						if($('TabListAccordSimplifie').getAttribute('class', 'active')){
							load_onglet_accord_simplifie(true);
						}
					
				}else{
					if (($('RechercheInsAgentGlobal') !== null) && 
						($('RechercheInsAgentGlobal') !== undefined) && 
						($('RechercheInsAgentGlobal') !== 0) && 
						($('RechercheInsAgentGlobal') !== "") && 
						($('RechercheInsAgentGlobal') !== false) &&
						($('RechercheInsAgentGlobal') !== NaN))
						$('TabListAccordSimplifie').hide();
				}
			}
			
			//Onglet police municiaple
			if (undefined != $('isSuperAdmin')) {
				var isSuperAdmin = document.getElementById("isSuperAdmin").value;
				if($('TabListPoliceMunicipale') && isSuperAdmin == 1){
						$('tabs').observe('click', function() {
							if($('TabListPoliceMunicipale').getAttribute('class', 'active')){
								load_onglet_police_municipale(true);
							} else {
								load_onglet_police_municipale(false);
							}
						});
						//si arrivée sur onglet au (re)chargement de la page
						if($('TabListPoliceMunicipale').getAttribute('class', 'active')){
							load_onglet_police_municipale(true);
						}
					
				}else{
					if (($('RechercheInsAgentGlobal') !== null) && 
						($('RechercheInsAgentGlobal') !== undefined) && 
						($('RechercheInsAgentGlobal') !== 0) && 
						($('RechercheInsAgentGlobal') !== "") && 
						($('RechercheInsAgentGlobal') !== false) &&
						($('RechercheInsAgentGlobal') !== NaN))
						$('TabListPoliceMunicipale').hide();
				}
			}
			
			// Ajout d'un event de contrôle sur chaque checkbox de la liste des agents pour cocher la case d'entête 
            $$('.checkedCheckboxAgents').each(function(chk1){
            	// On surveille le click 
                chk1.observe('click', function(evt){
                	
                	// Vérification si checkbox d'entête doit être cochée/décochée
                	control_checkBoxGeneralListeAgents();
                });
            });
            
            if($('SEL_COLLEC_0')){
        	    // Ajout d'un event de contrôle sur chaque checkbox de la liste des sessions pour cocher la case d'entête 
        	    $$('.checkbox_collectivites').each(function(chk2){
        	    	// On surveille le click 
        	        chk2.observe('click', function(evt1){
        	        	
        	        	// Vérification si checkbox d'entête doit être cochée/décochée
        	        	control_checkBoxGeneralListeCollectivitesParametrageSessions();
        	        });
        	    });
        	    
        	    // Au chargement de la page, on vérifie si la checkbox d'entête de la liste des sessions doit être cochée/décochée
        	    control_checkBoxGeneralListeCollectivitesParametrageSessions();
        	}
         
         //Correction ano redmine 21378
         if($('.checkedCheckboxAgents')){
         // Au chargement de la page, on vérifie si la checkbox d'entête de la liste des agents doit être cochée/décochée
            control_checkBoxGeneralListeAgents();
         }
            
         // Ajout d'un event de contrôle sur chaque checkbox de la liste des sessions pour cocher la case d'entête 
            $$('.checkedCheckboxSessions').each(function(chk1) {
            	// On surveille le click 
                chk1.observe('click', function(evt) {
                	// Vérification si checkbox d'entête doit être cochée/décochée
                	control_checkBoxGeneralListeSessions();
                });
            });
            
            if ($('.checkedCheckboxSessions')) {
            	// Au chargement de la page, on vérifie si la checkbox d'entête de la liste des sessions doit être cochée/décochée
            	control_checkBoxGeneralListeSessions();
            }
            
            if($('SEL_TSAAGG_0')){
        	    // Ajout d'un event de contrôle sur chaque checkbox de la liste des sessions pour cocher la case d'entête 
        	    $$('.checkbox_sessions').each(function(chk2) {
        	    	// On surveille le click 
        	        chk2.observe('click', function(evt1){
        	        	// Vérification si checkbox d'entête doit être cochée/décochée
        	        	control_checkBoxGeneralListeSessions();
        	        });
        	    });
        	    
        	    if ($('.checkbox_sessions')) {
        	    	// Au chargement de la page, on vérifie si la checkbox d'entête de la liste des sessions doit être cochée/décochée
        	    	control_checkBoxGeneralListeSessions();
        	    }
        	}

        });

/**
 * Fonction de monitoring permettant de détecter et de prendre en compte un changement de valeur sur la page
 */
var monitoring_constitution_groupe_change = function(id) {
	// identifiant global du tableau où sont stockés les valeurs
	var idTableauGlobal = 'liste_agents';
	
	// on vérifie que l'id courant et le champ de temporisation global existe
	if ( id != '' && $(idTableauGlobal + 'FieldsModified')) {
		
		// on retire le valeur 'liste_agent' car c'est l'identifiant du tableau
		var idModified = id.replace(idTableauGlobal, ''); 
		
		// on regarde si la valeur n'existe pas déjà
		if ( $(idTableauGlobal + 'FieldsModified').value.indexOf(idModified) == -1 ) {

			// concatenation de l'identifiant du champ courant au tableau global
			$(idTableauGlobal + 'FieldsModified').value +=  idModified + ";";
		}
	}
};

/**/
var agent_detail_close = function() {
    if (agent_detail.bInLayer == false) {
        $('lucarne').style.left = -4000 + 'px';
    }
}
/**/
var presence_set_agentpresence = function(elt, id) {
    if (!elt || !id)
        return;
    if (elt.value !== 'present') {
        $('liste_agentsNbheure' + id).value = 0;
        $('liste_agentsNbheure' + id).disabled = 'disabled';
    } else {
        $('liste_agentsNbheure' + id).disabled = false;
        presence_set_agentnbheure($('liste_agentsNbheure0'), id);
    }
    if (elt.value !== 'absent') {
        $('liste_agentsMotifabsence' + id).value = '';
        $('liste_agentsMotifabsence' + id).disabled = 'disabled';
    } else {
        $('liste_agentsMotifabsence' + id).disabled = false;
//        $('liste_agentsNbheure' + id).value = 0;    saisie des présences ( nombre d'heures) ref #24819
//        $('liste_agentsNbheure' + id).disabled = false;
    }
}

var presence_set_agentnbheure = function(elt, id) {
    if (!elt || !id)
        return;
    if ($('liste_agentsEtatpresence' + id).value == 'present') {
        if ($('liste_agentsNbjours')) {
            var inb = parseFloat($('liste_agentsNbjours').value);  
            var nbh = parseInt((inb), 10);
            $('liste_agentsNbheure' + id).value = nbh;
			$('liste_agentsNbheure' + id).observe('change', function(event) {
				presence_set_agent($('liste_agentsNbheure' + id));
			});

        }
    }
}
/**/
var presence_set_agent = function(elt) {
	var ree = new RegExp("^liste_agents(Etatpresence|Nbheure|ObjectifAtteint|Arme)(.*)$");
    var _re = elt.id.match(ree);
    if (!_re)
        return;
    var typ = _re[1];
    var id = _re[2];
    if (typ === 'Etatpresence') {
        var ree = new RegExp("^liste_agentsEtatpresence(.*)$");
        if (parseInt(id, 10) === 0) {
            $$('select').each(function(elts) {
                if (elts.id && elts.id.match(ree)) {
                    if (elts.value == '') {
                        elts.value = elt.value;
                        var __id = elts.id.match(ree);
                        if (parseInt(__id[1], 10) !== 0) {
                            presence_set_agentpresence(elt, __id[1]);
                        }
                    }
                }
            });
        } else {
            presence_set_agentpresence(elt, id);
        }
    } else if (typ === 'Nbheure') {
        var ree = new RegExp("^liste_agentsNbheure(.*)$");
        if (parseInt(id, 10) === 0) {
            $$('input').each(function(elts) {
                if (elts.type === 'text' && elts.id && elts.id.match(ree)) {
                    var __id = elts.id.match(ree);
                    presence_set_agentnbheure(elt, __id[1]);
                }
            });
        } else {
			if ($('liste_agentsNbjours')) {
				var inb = parseFloat($('liste_agentsNbjours').value);
				var inh = parseInt($('liste_agentsNbheure0').value, 10);
				var nbh = parseInt((inb * inh), 10);
				var nbhsaisie = parseInt($('liste_agentsNbheure' + id).value, 10);
				if (nbhsaisie > nbh) {
					$('liste_agentsNbheure' + id).value = nbh;
					alert('vous ne pouvez pas saisir d\'heures supplémentaires');
				}
			}

		}
    } else if (typ == 'ObjectifAtteint') {
        var ree = new RegExp("^liste_agentsObjectifAtteint(.*)$");
        if (parseInt(id, 10) === 0) {
            $$('select').each(function(elts) {
                if (elts.id && elts.id.match(ree)) {
                	elts.value = elt.value;
                }
            });
        }  	
    } else if (typ == 'Arme') {
    	var ree = new RegExp("^liste_agentsArme"+ id +"Agent(.*)$");
    	
        if (parseInt(id, 10) > 0) {
            $$('select').each(function(elts) {
                if (elts.id && elts.id.match(ree)) {
                	elts.value = elt.value;
                }
            });
        }  	
    }
}

/**
 * Coche/Decoche la checkbox d'entête du tableau si toutes les lignes sont cochées/décochées
 */
var control_checkBoxGeneralAgents = function(){
	
	// Comparaison entre le nombre de checkbox affichées et le nombre de checkbox affichées et cochées : si égale, toutes les checkbox sont cochées.
	var doEnable = ($$('.checkedCheckbox:checked').length == $$('.checkedCheckbox').length);

	// Toutes les checkbox sont cochées : checkbox d'entête cochée.
    if (doEnable && $$('.checkedCheckbox').length) {
//    	$('GAListagentSEL_0').checked = true;
    } 
    // Au moins une checkbox n'est pas cochées => checkbox d'entête décochée.
    else if($$('.checkedCheckbox').length) {
//    	$('GAListagentSEL_0').checked = false;
    }
};

var control_checkBoxGeneralListeAgents = function(){
	// Comparaison entre le nombre de checkbox affichées et le nombre de checkbox affichées et cochées : si égale, toutes les checkbox sont cochées.
	var doEnable = ($$('.checkedCheckboxAgents:checked').length == $$('.checkedCheckboxAgents').length);

	// Toutes les checkbox sont cochées : checkbox d'entête cochée.
    if (doEnable) {
    	$('SEL_AG_0').checked = true;
    } 
    // Au moins une checkbox n'est pas cochées => checkbox d'entête décochée.
    else {
    	$('SEL_AG_0').checked = false;
    }
};

var control_checkBoxGeneralListeSessions = function(){
	
	// Comparaison entre le nombre de checkbox affichées et le nombre de checkbox affichées et cochées : si égale, toutes les checkbox sont cochées.
	var doEnable = ($$('.checkbox_sessions:checked').length == $$('.checkbox_sessions').length);

	// Toutes les checkbox sont cochées : checkbox d'entête cochée.
    if (doEnable) {
    	$('SEL_TSAAGG_0').checked = true;
    } 
    // Au moins une checkbox n'est pas cochées => checkbox d'entête décochée.
    else {
    	$('SEL_TSAAGG_0').checked = false;
    }
};

var control_checkBoxGeneralListeCollectivitesParametrageSessions = function(){
	
	// Comparaison entre le nombre de checkbox affichées et le nombre de checkbox affichées et cochées : si égale, toutes les checkbox sont cochées.
	var doEnable = ($$('.checkbox_collectivites:checked').length == $$('.checkbox_collectivites').length);

	// Toutes les checkbox sont cochées : checkbox d'entête cochée.
    if (doEnable) {
    	$('SEL_COLLEC_0').checked = true;
    } 
    // Au moins une checkbox n'est pas cochées => checkbox d'entête décochée.
    else {
    	$('SEL_COLLEC_0').checked = false;
    }
};

var fermer_popupModalbox = function (){
	Modalbox.hide();
};

var enregistrerNouveauNom = function (pForm, event){
	// Pour ne pas propager l'event
	Event.stop(event);
	var nouveauNom = $('renommageNouveaunom');
	var textNouveauNom = nouveauNom.value;
	var idRegroupement = $('renommageIdRegroupement');
	var id = idRegroupement.value;
	if (textNouveauNom.length <= 0){
		$('errorNomVide').style.display='block';
		$('errorNomExiste').style.display='none';
	}
	else{
		// Un nom a été renseigné
  		$('errorNomVide').style.display='none';
  		// Vérifier si le nom de regroupement renseigné existe déjà pour la structure courante
  		new Ajax.Request('/regroupements/verifierNomRegroupement/' + textNouveauNom, {
  			
			method: 'post',
			onSuccess: function(res) {
				if (res.responseText == '"false"') {
					$('errorNomExiste').style.display='block';
					return true;
  				}
				else{
			  		//On fait le redirect à partir de cakephp
					$('errorNomVide').style.display='none';
					$('errorNomExiste').style.display='none';
					Modalbox.hide();
			  		pForm.action = '/regroupements/renommer/enregistrer/'+id+'/'+textNouveauNom;
			  		pForm.submit();
					return true;
				}
			},
			onFailure: function() {
				alert(_errorAjax);
				return false;
			}
		});
	}
};

/**
 * retourne l'index d'unselect selon son text
 * @param $thetext le texte du select affiché
 * @param $theselect l'identifiant du select
 * @return $theindex l'index trouvé
 */
var get_index_from_value = function(thetext, theselect){
	var thelength = document.getElementById(theselect).options.length;
	var thecomp=0;
	var theindex=0;
	while(thecomp<thelength){
		if(document.getElementById(theselect).options[thecomp].value === thetext) theindex=thecomp;
		thecomp++;
	}
	return theindex;
};

var creer_document_cgu = function (cgu_onload){
	//CNIL [RG_DOCGEN_02] [RG_DOCGEN_04]
	
	// récupération de l'identifiant du document CGU
	var hidden_id_cgu = $('input_param_document_cgu_id_hidden').value;
	//recupération de l'identifiant du document choisi
	var _doctype_choice=$('input_param_document_type_id').selectedIndex;
	var _doctype_val=$('input_param_document_type_id').options[_doctype_choice].value;
	
	//récupération des valeurs de la structure
	var _struct_choice=$('input_structure_id').selectedIndex;
	var _struct_val=$('input_structure_id').options[_struct_choice].value;

	var _reference_text = 'CGU-inscription-en-ligne';
	var session_type_text = 'national';
	if (_doctype_val === hidden_id_cgu){
		$('input_param_document_type_txt').value=_doctype_val;
		//recup id de l'option "national" pour le selectionner
		var _index_national = get_index_from_value('national', "input_structure_id");
		$('input_structure_id').options[_index_national].selected=true;
		//Rendre les champs grisés et inactifs
		var _struct_val=$('input_structure_id').options[_index_national].value;
		$('input_structure_id_disabled').value=_struct_val;
		$('input_structure_id').disabled=true;
		$('input_session_type').disabled=true;
		$('input_session_type').value = session_type_text;
		$('input_session_type_disabled').value = session_type_text;
		$('input_reference').disabled=true;
		$('input_reference').value = _reference_text;
		$('input_reference_disabled').value = _reference_text;
	}
	else{
		$('input_structure_id').disabled=false;
		$('input_param_document_type_txt').value=_doctype_val;
		//recup id de l'option "national" pour le selectionner
		var _index_national = get_index_from_value('national',"input_structure_id");
		$('input_structure_id').options[_index_national].selected=true;
		//Retablir les champs grisés
		var _struct_val=$('input_structure_id').options[_index_national].value;
		$('input_session_type').disabled=false;
		$('input_reference').disabled=false;
		//si on ne vient pas de la liste
		if (!cgu_onload){
			$('input_reference').value = '';
			$('input_reference_disabled').value = '';
			$('input_libelle').value='';
		}
	}
};

function load_onglet_hors_region(isActive) {
	if (isActive) {
		if ($('VarConfigConfigModified')) {
			$('VarConfigConfigModified').hide();
		}
		if ($('VarConfigConfigPath')) {
			$('VarConfigConfigPath').hide();
		}
        $('formButtons').hide();
        
		new Ajax.Request(
				'/structures/loadOngletSuiviHorsRegion/',
			{
				method: 'get',
				onSuccess: function(res) {
					//console.log(JSON.parse(JSON.stringify(res)));
					if ($('TabListHorsRegion').getAttribute('class', 'active')) {
						var html = res.responseText;
						
						if (!$('divListStructures')) {
							var node = document.createElement("DIV");
							node.setAttribute('id', 'divListStructures');
							node.innerHTML = html;
							$('tabscontent').appendChild(node);
						} else {
							var el = document.getElementById('divListStructures');
							el.remove();
							var node = document.createElement("DIV");
							node.setAttribute('id', 'divListStructures');
							node.innerHTML = html;
							$('tabscontent').appendChild(node);
						}
			            
			            $('FieldConfigConfigConfig0HorsRegion0XmlattrsSuiviHorsRegion').setAttribute('onclick', 'activSuivi()');
			            if ($('isSuiviActif').getAttribute('value') == 1) {
			            	$('FieldConfigConfigConfig0HorsRegion0XmlattrsSuiviHorsRegion').setAttribute('checked', 'checked');
			            	$('suiviToutSelectionner').enable();
			        		$('suiviToutDeselectionner').enable();
			            } else {
			            	$('FieldConfigConfigConfig0HorsRegion0XmlattrsSuiviHorsRegion').removeAttribute('checked');
			            	$('suiviToutSelectionner').disable();
			        		$('suiviToutDeselectionner').disable();
			            }
					}
				},
				onFailure: function(){
					alert('Une erreur est survenue dans le chargement de l\'onglet hors région !');
		        }
		    }
		);
	} else {
		if ($('divListStructures')) {
			$('divListStructures').remove();
		}
		if ($('VarConfigConfigModified')) {
			$('VarConfigConfigModified').show();
		}
		if ($('VarConfigConfigPath')) {
			$('VarConfigConfigPath').show();
		}
        $('formButtons').show();
	}
	
}

function load_onglet_accord_simplifie(isActive) {

	if (isActive) {	
		if ($('VarConfigConfigModified')) {
			$('VarConfigConfigModified').hide();
		}
		
		if ($('VarConfigConfigPath')) {
			$('VarConfigConfigPath').hide();
		}
        $('formButtons').hide();
        
		new Ajax.Request(
				'/structures/loadOngletAccordSimplifie/',
			{
				method: 'get',
				onSuccess: function(res) {
					//console.log(JSON.parse(JSON.stringify(res)));
					if ($('TabListAccordSimplifie').getAttribute('class', 'active')) {

						var html = res.responseText;
						
						if (!$('divAccordSimplifie')) {
							var node = document.createElement("DIV");
							node.setAttribute('id', 'divAccordSimplifie');
							node.innerHTML = html;
							$('tabscontent').appendChild(node);
						} else {
							var el = document.getElementById('divAccordSimplifie');
							el.remove();
							var node = document.createElement("DIV");
							node.setAttribute('id', 'divAccordSimplifie');
							node.innerHTML = html;
							$('tabscontent').appendChild(node);
						}
					}
				},
				onFailure: function(){
					alert('Une erreur est survenue dans le chargement de l\'onglet accord simplifie !');
		        }
		    }
		);
	} else {
		if ($('divAccordSimplifie')) {
			$('divAccordSimplifie').remove();
		}
	}
}

function load_onglet_police_municipale(isActive) {

	if (isActive) {	
		if ($('VarConfigConfigModified')) {
			$('VarConfigConfigModified').hide();
		}
		
		if ($('VarConfigConfigPath')) {
			$('VarConfigConfigPath').hide();
		}
        $('formButtons').hide();
        
		new Ajax.Request(
				'/structures/loadOngletPoliceMunicipale/',
			{
				method: 'get',
				onSuccess: function(res) {
					//console.log(JSON.parse(JSON.stringify(res)));
					if ($('TabListPoliceMunicipale').getAttribute('class', 'active')) {

						var html = res.responseText;
						
						if (!$('divPoliceMunicipale')) {
							var node = document.createElement("DIV");
							node.setAttribute('id', 'divPoliceMunicipale');
							node.innerHTML = html;
							$('tabscontent').appendChild(node);
						} else {
							var el = document.getElementById('divPoliceMunicipale');
							el.remove();
							var node = document.createElement("DIV");
							node.setAttribute('id', 'divPoliceMunicipale');
							node.innerHTML = html;
							$('tabscontent').appendChild(node);
						}
					}
				},
				onFailure: function(){
					alert('Une erreur est survenue dans le chargement de l\'onglet police municipale !');
		        }
		    }
		);
	} else {
		if ($('divPoliceMunicipale')) {
			$('divPoliceMunicipale').remove();
		}
	}
}

function etatDispense($elem, $idDispense, $matieres){
	var etat =  $elem.value;
	var elements = $('form_liste_dispenses').getElementsByTagName('input');
	var matieres = new Array();
	if($matieres != null) {
		 matieres = $matieres.split('-');
	}
	for (var i = 0; i < elements.length; i++) {
		for (var j = 0; j < matieres.length; j++) { 
			if (elements[i].type == 'checkbox' && elements[i].id == 'liste_dispensesMatiere'+matieres[j].replace('_','')+$idDispense ) {
				if (etat != 'accepte') {
					elements[i].checked = 0;
					elements[i].setAttribute("hidden", true);
				} else {
					elements[i].removeAttribute('hidden');
				}
			}
		}
		//correction defect #1943 - ce traitement doit être effectué dehors la boucle sur les matières tremplins - cas d'un dispositif sans modules de tremplin
		if (elements[i].type == 'checkbox' && elements[i].id == 'liste_dispensesPr'+$idDispense ) {
			if (etat != 'accepte') {
				elements[i].checked = 0;
				elements[i].setAttribute("hidden", true);
			} else {
				elements[i].checked = 0;
				elements[i].removeAttribute('hidden');
			}
		}
	}	 
}

function verif(){
	var modifCheckbox = true;
	var modif = false;
	var listeActions = $$('.dispAction');
	var message = '';

	listeActions.each(function(action) {
		if (action.value != 'attente' && action.readAttribute('disabled') != 'disabled') {
			modif = true;
			if(action.value == 'accepte'){
				var dispenseId = action.readAttribute('data-id');
				var checkBoxChecked = false;
				var checkboxes = $$('.dispense-' + dispenseId);
				checkboxes.each(function(checkbox) {
					if (checkbox.checked) {
						// si au moins une case est cochée pour la dispense on l'indique
						checkBoxChecked = true;
					}
				});
				if(!checkBoxChecked){
					// si aucune case n'est cochée pour la dispense on aura un message explicite
					modifCheckbox = false;
				}
			}
		}
	});
	if(modif && !modifCheckbox){
		alert('Attention, au moins une dispense acceptée n\'a aucune préconisation. Veuillez cocher au moins une préconisation .');
		return false;
	}else{
		return confirm('La sauvegarde de vos modifications est définitive. Confirmez-vous ?');
	}
}

function agentSelected(pForm, url){
	var elements = $('form_liste_dispenses').getElementsByTagName('input');
	var _sId = 0;
	var id = null;
	for (var i = 0; i < elements.length; i++) {
		if (elements[i].type && elements[i].type == 'radio') {
			if (elements[i].checked == true) {
				_sId = 1;
				id = elements[i].value;
				break;
			}
		}
	}
	if (_sId == 0) {
		alert('Vous devez sélectionner un agent.');
		return false;
	} else {
		pForm.action = url+id;
  		pForm.submit();
		return true;
	}
}
function sessionSelected(){
	var elements = $('form_session_refusee').getElementsByTagName('input');
	var _sId = 0;
	for (var i = 0; i < elements.length; i++) {
		if (elements[i].type && elements[i].type == 'radio') {
			if (elements[i].checked == true) {
				_sId = 1;
				break;
			}
		}
	}
	if (_sId == 0) {
		alert('Vous devez sélectionner une session.');
		return false;
	}
}


function activSuivi() {
	
	var isSuiviActif = $('isSuiviActif').getAttribute('value');
	var oldValue = isSuiviActif;
	var newValue = 1 - eval(isSuiviActif);
	var elements = $('suivi_hors_region').getElementsByTagName('input');
	
	$('isSuiviActif').setAttribute('value', newValue);
	
	for (var i = 0; i < elements.length; i++) {
		if (elements[i].type == 'checkbox') {
			if (newValue == 0) {
				elements[i].checked = 0;
				elements[i].setAttribute('disabled', 'disabled');
			} else {
				elements[i].removeAttribute('disabled');
			}
		}
	}
	
	if (newValue == 0) {
		$('suiviToutSelectionner').disable();
		$('suiviToutDeselectionner').disable();
	} else {
		$('suiviToutSelectionner').enable();
		$('suiviToutDeselectionner').enable();
	}
}

function suiviHorsRegionSelectAll(action) {
	 
	var elements = $('suivi_hors_region').getElementsByTagName('input');
 
	for (var i = 0; i < elements.length; i++) {
		if (elements[i].type == 'checkbox') {
			elements[i].checked = action;
		}
	}
}

function save_suivi_hors_region() {
	
	var pForm = $$('#suivi_hors_region input');
    var aStructure = [];
    var url = '';
    
    $('loading_icone_for_hors_region').show();
    $('suiviEnregistrerParametrage').hide();
	$('suiviToutSelectionner').hide();
  	$('suiviToutDeselectionner').hide();
    
    //Récupération des checkbox cochées
    pForm.each(function(e) {
        if (e.type && e.type == 'checkbox') {
            if (e.checked == true) {
            	aStructure.push(e.value);
            }
        }
        ;
    });
    
    var listStructureIds = JSON.stringify(aStructure);
    var isSuiviActif = $('isSuiviActif').getAttribute('value');

	new Ajax.Request(
			'/structures/saveSuiviHorsRegion/isSuiviActif:' + isSuiviActif + '/structuresSuiviesId:' + listStructureIds + '.json',
		{
			method: 'post',
			onComplete: function(){ 
		  		$('loading_icone_for_hors_region').hide();
		  		$('suiviEnregistrerParametrage').show();
		  		$('suiviToutSelectionner').show();
		  		$('suiviToutDeselectionner').show();
		  	},
			onSuccess: function(res) {
				//console.log(JSON.parse(JSON.stringify(res)));
				alert('Le formulaire a été correctement enregistré');
				// rechargement de la page
				var ongletIndex = 0;
				var child = document.getElementById('TabListHorsRegion');
				while ((child = child.previousSibling) != null) {
					ongletIndex++;
				}
				url = window.location.protocol + '//' + window.location.host + window.location.pathname + '?extract=include.0.tabsgroup.tab.' + ongletIndex;
				window.location.href = url;
				
			},
			onFailure: function(){
				alert('Une erreur est survenue dans la sauvegarde du suivi des inscriptions hors région !');
	        }
	    }
	);

}

function annule_accord_simplifie_nbplacect(nbPlaceCt) {
	if (typeof accordSimplifieNbPlaceCt !== 'undefined') {
		return accordSimplifieNbPlaceCt;
	} else {
		return nbPlaceCt;
	}
}

function annule_accord_simplifie_delaireponse(delaiReponse) {
	if (typeof accordSimplifieDelaiReponse !== 'undefined') {
		return accordSimplifieDelaiReponse;
	} else {
		return delaiReponse;
	}
}

function save_accord_simplifie() {

	var pForm = $$('#suivi_hors_region input');
    var aStructure = [];
    var url = '';
    var valid = true;
    
    //Récupération des données
    pForm.each(function(e) {
    	Number.isInteger = Number.isInteger || function(value) {
    		    return typeof value === "number" &&
    		           isFinite(value) &&
    		           Math.floor(value) === value;
    		}; 
        if (e.id && e.id == 'pcPlaceCt') {    
        	if(((e.value >= 0 && e.value <= 100) && Number.isInteger(parseFloat(e.value))) || e.value == ""){
        		aStructure.push(e.value);
        		this.pcPlaceCt = e.value;
        	}else if(e.value.length > 0){
        		//e.preventDefault();
        		alert('Le pourcentage d’agents par CT doit être compris entre 0 et 100 et la valeur ne doit pas comporter de décimale.');
        		valid = false;
        	}
        }
        if (e.id && e.id == 'delaiReponse') {    
        	if((e.value >=5 && e.value <= 99) && Number.isInteger(parseFloat(e.value))){
        		aStructure.push(e.value);
        		this.delaiReponse = e.value;
        	}else if(e.value.length > 0){
        		//e.preventDefault();
        		alert('Le délai de traitement doit être compris entre 5 et 99 et la valeur ne doit pas comporter de décimale.');
        		valid =  false;
        	}
        }
        ;
    });
    if(!valid){
    	return false;
    }
    var donneesAccord = JSON.stringify(aStructure);
	new Ajax.Request(
			'/structures/saveAccordSimplifie/donneesAccord:' + donneesAccord + '.json',
		{
			method: 'post',
			onSuccess: function(res) {
				//console.log(JSON.parse(JSON.stringify(res)));
				accordSimplifieNbPlaceCt = this.pcPlaceCt;
				accordSimplifieDelaiReponse = this.delaiReponse;
				alert('Le formulaire a été correctement enregistré.');
			},
		/*	onFailure: function(){
				alert('Une erreur est survenue dans la sauvegarde !');
	        }*/
	    }
	);

}

function annule_police_municipale_delaireponse(delaiReponse) {
	if (typeof policeMuniciapleDelaiReponse !== 'undefined') {
		return policeMuniciapleDelaiReponse;
	} else {
		return delaiReponse;
	}
}

function save_police_municipale() {
	
	var pForm = $$('#suivi_hors_region input');
    var aStructure = [];
    var url = '';
    var valid = true;
    
    //Récupération des données
    pForm.each(function(e) {
    	Number.isInteger = Number.isInteger || function(value) {
    		    return typeof value === "number" &&
    		           isFinite(value) &&
    		           Math.floor(value) === value;
    		}; 
        
        if (e.id && e.id == 'delaiReponse') {    
        	if((e.value >=1 && e.value <= 200) && Number.isInteger(parseFloat(e.value))){
        		aStructure.push(e.value);
        		this.delaiReponse = e.value;
        	}else if(e.value.length > 0){
        		//e.preventDefault();
        		alert('Le délai de rappel doit être compris entre 1 et 200 et la valeur ne doit pas comporter de décimale.');
        		valid =  false;
        	}
        }
        ;
    });
    if(!valid){
    	return false;
    }
    var donneesAccord = JSON.stringify(aStructure);
	new Ajax.Request(
			'/structures/savePoliceMunicipale/donneesAccord:' + donneesAccord + '.json',
		{
			method: 'post',
			onSuccess: function(res) {
				//console.log(JSON.parse(JSON.stringify(res)));
				policeMunicipaleDelaiReponse = this.delaiReponse;
				alert('Le formulaire a été correctement enregistré.');
			},
		/*	onFailure: function(){
				alert('Une erreur est survenue dans la sauvegarde !');
	        }*/
	    }
	);
}

function session_setCollectivites(object){
	var collectiviteId = document.querySelector('[id^="PLACECCT_PC_"]').id;
	var collectiviteName = document.getElementById(collectiviteId).value;
	
	 new Ajax.Request('/sessions/selectcol/pc:' + collectiviteName + '/id:' + collectiviteId + '.json',
             {
                 method: 'get',
                 onSuccess: function(transport) {
                     if ($('FSPC_SC_' + _id[1])) {
                         var _response = transport.responseText.evalJSON();
                         $('FSPC_SC_' + _id[1]).checked = (_response.OK === 'OK') ? true : false;
                     }
                     if ($('FSPC_VALID')) {
                         var _response = transport.responseText.evalJSON();
                         if (_response.REP !== 'NOID') {
                             if (_response.REP === 'NONE') {
                                 $('FSPC_SELECT').style.display = 'none';
                                 $('FSPC_VALID').value = 'Valider sans sélection';
                             } else {
                                 $('FSPC_SELECT').style.display = 'block';
                                 $('FSPC_VALID').value = (parseInt(_response.REP, 10) > 1) ? 'Ajouter les ' + _response.REP + ' collectivités sélectionnées' : "Ajouter la collectivité sélectionnée";
                             }
                         }
                     }
                     return true;
                 },
                 onFailure: function() {
                     alert(_errorAjax)
                 }
             });
	
}

function session_SetSessionsBO(pChk) {
	
	var _id = pChk.value;
	var _idsel = '';
	if (_id == 'ALL') {
		var _re = new RegExp("^GAListsessionSEL_");
		var _pForm = document.getElementById('form_liste_session');
		_id = ''
		for (var _i in _pForm.elements) {
			if (typeof(_pForm.elements[_i]) != 'object' || !_pForm.elements[_i]) {
				continue;
			}
			if (!_pForm.elements[_i].type && _pForm.elements[_i].type != 'checkbox') {
				continue;
			};
			if (_pForm.elements[_i].id.match(_re)) {
				if (parseInt(_pForm.elements[_i].value, 10) > 0) {
					_pForm.elements[_i].checked = pChk.checked;
					_id += "|" + _pForm.elements[_i].value;
				}
			}
		}
	}
	new Ajax.Request('/cnfpt/groupes/selectsessions.json?id=' + _id + '&bsel=' + pChk.checked,
	{
	method:'get',
			onSuccess: function(transport) {
	},
			onFailure: function(){ alert(_errorAjax) }
	});
}

function export_sessions_bo(pForm, endroitFOBO, typeExport, isTout, action){
	if (!pForm) {
		pForm = $('form_liste_session');
	}

	if(isTout != 'Tout'){
		var ligneSelectionne = $$('#form_liste_session input:checked');
		var nbligneselect = ligneSelectionne.length;
		//aucune case n'est cochée. Ou il n'y a pas de case à cocher
		if(nbligneselect == 0){
			alert("Vous devez sélectionner au moins une session.");
			return false;
		}
	} 

	new Ajax.Request('/groupes/export/'+endroitFOBO+'/'+typeExport+'/'+isTout+'/'+action+'.csv', {
			method:'get',
				onSuccess: function(transport) {
					var _response = transport.responseText.evalJSON();
					window.location.replace(_response['aCsv']);
			},
				onFailure: function(){ alert('Vous devez sélectionner au moins une session.') }
	});
	
	
	// redmine 13909 : KO sous IE11 si on ne met pas de return true
	return false;			
}

//Prends INTRA/UNION
function collectivite_SetSelect(pChk) {
	var _id = pChk.value;
	var _idsel = '';
	var _all = _id;
	if (_id == 'ALL') {
		var _re = new RegExp("^SEL_COLLEC_");
		var _pForm = document.getElementById('form_liste_collectivites');
		_id = ''
		var elements = _pForm.getElementsByTagName('input');
		for (var i = 0; i < elements.length; i++) {
			if (elements[i].type == 'checkbox') {
				if (elements[i].id.match(_re)) {
					elements[i].checked = pChk.checked;;
					_id += "|" + elements[i].value;
				}
			}
		}
	}
	new Ajax.Request('/cnfpt/sessions/selectcollectivites.json?id=' + _id + '&bsel=' + pChk.checked,
	{
	method:'get',
			onSuccess: function(transport) {
				var _response = transport.responseText.evalJSON();
				if(_response.REP['Inscr'] == 'HASINSC'){
					if(_all == 'ALL'){
						alert('Au moins une inscription a été réalisée pour les collectivités sélectionnées. Le décochage en masse ne peut pas être réalisé.');
					}
					else{
						alert('Au moins une inscription a été réalisée pour cette collectivité. Impossible de la supprimer de la sélection');
					}
					location.reload();
				}
	},
			onFailure: function(){ alert(_errorAjax) }
	});
}

//Prend INTEG, INTER
function collectivite_SetSelect_multi(pChk) {
	var _id = pChk.value;
	var _idsel = '';
	var _all = _id;
	if (_id == 'ALL') {
		var _re = new RegExp("^FSPC_SC_|^SEL_COLLEC_");
		var _pForm = document.getElementById('form_liste_collectivites');
		_id = ''
		var elements = _pForm.getElementsByTagName('input');
		for (var i = 0; i < elements.length; i++) {
			if (elements[i].type == 'checkbox') {
				if (elements[i].id.match(_re)) {
					elements[i].checked = pChk.checked;;
					_id += "|" + elements[i].value;
				}
			}
		}
	}
	new Ajax.Request('/cnfpt/sessions/selectcollectivites_multi.json?id=' + _id + '&bsel=' + pChk.checked,
	{
	method:'get',
			onSuccess: function(transport) {
				var _response = transport.responseText.evalJSON();
				if(_response.REP['Inscr'] == 'HASINSC'){
					if(_all == 'ALL'){
						alert('Au moins une inscription a été réalisée pour les collectivités sélectionnées. Le décochage en masse ne peut pas être réalisé.');
					}
					else{
						alert('Au moins une inscription a été réalisée pour cette collectivité. Impossible de la supprimer de la sélection');
					}
					location.reload();
				}
	},
			onFailure: function(){ alert(_errorAjax) }
	});
}

function validerPlacesCT(pForm){
	if (!pForm) {
		pForm = $('form_liste_collectivites_nbplace');
	}
	var effectifPrevu = $('effectifPrevu').value;
	var bloquant = $('bloquant').value;
	if(bloquant){
		// Le caractere bloquant est activé, on vérifie que la somme des places par collectivité ne dépasse pas l’effectif prévisionnel
		new Ajax.Request('/sessions/validerPlacesCollectivites/', {
			method: 'post',
			onSuccess: function (res) {
				//console && console.log('effectifPrevu');
				if (res.responseText == '"false"') {
					// La somme des places par collectivité ne dépasse pas l'effectif prévisionnel
					//console && console.log('effectif prévisionnel non dépassé');
					pForm.action = '/sessions/parametrer/validation/intra';
			  		pForm.submit();
					return true;
				}
				else{
					//console && console.log('effectif prévisionnel dépassé');
					alert('Le nombre total de places réservées dépasse l’effectif maximum ('+effectifPrevu+' places). Corriger les valeurs.');
					return false;
				}
			},
			onFailure: function() {
				alert(_errorAjax);
				return false;
			}
		});
	}
	else{
		// Le caractere bloquant n'est pas activé, on redirige à l'onglet de validation
		pForm.action = '/sessions/parametrer/validation/intra';
  		pForm.submit();
		return true;
	}
}

function parametrer_sessions_bo(pForm,url){
	if (!pForm) {
		pForm = $('form_liste_session');
	}
	//fix ano #21593
	var ligneSelectionne = $$('#form_liste_session input:checked');
	var nbligneselect = ligneSelectionne.length;
	//aucune case n'est cochée. Ou il n'y a pas de case à cocher
	if(nbligneselect == 0){
		alert("Vous devez sélectionner au moins une session.");
		return false;
	}
	else{
		pForm.action = url;
		pForm.submit();
		// redmine 13909 : KO sous IE11 si on ne met pas de return true
		return true;
	}
	
};


/**
 * Detection si nous avons quité le traitement actuel, para exemple: fermeture de la page, click sur un lien etc.
 * @maxReload - Nombre maximum d'evenements "beforeunload" autorisés sur la page
 */
function arretTraitement(maxReload, param){
	//Fonction appelé au moment de fermer la page
	  if(typeof artTraitement != 'undefined' && artTraitement){
		  if(typeof arretCount != 'undefined' && maxReload>0){
				arretCount++;
				if(arretCount>maxReload){
					delete(artTraitement);
					delete(arretCount);
				}
			  }else if(maxReload==0){
				  delete(artTraitement);
			  }else{
				  arretCount = 1;
			  }
		  return true;
	  }else{
		  var ajaxOk = false;
		  new Ajax.Request("/agents/ajaxImportArret"+param, {
			method: 'post',
			asynchronous: false,
			onComplete: function(response) {
				response = JSON.parse(response.responseText);
				if (response['response'] == 'arrete') {
					ajaxOk = true;
				} else {
					alert('Une erreur est survenue');
				}
			},
			onFailure: function(response) {
				alert('Une erreur est survenue');
	        },
	        onProgress: function(event) {
				console.debug(event);
	        }
	      });
		  return ajaxOk;
	  }
};

/**
 * Exclure l'element de l'arret de traitement
 * @exclure - id de l'element
 */
function arretTraitementExclure(exclure){
	document.observe("dom:loaded", function() {
		if($(exclure) !== null){
			$(exclure).on('click', function(event) {
				artTraitement = true;
			});
		}
	});
};

/**
* Fonction pour coller dans le champ structure stage et session en une celle fois
* @event evenement de coller; contient le texte a coller
*
*/
function pasteStructure(event){

	event.target.attributes["maxlength"].value = 11;
	setTimeout(function(){
		//récuperation du code sans le premier ':'
		var text = event.target.value.replace(':','');
		event.target.attributes["maxlength"].value = 2;
		//à n'executer que si l'on a 2 caractères de structures 5 de stage et 3 de session
		var id = event.target.id;
		if(text.length == 10){
	        event.preventDefault();
        	document.getElementById(id).value = text.substring(0, 2);
        	if(document.getElementById(id.replace('Structure', 'CodeStage'))){
        		document.getElementById(id.replace('Structure', 'CodeStage')).value = text.substring(2, 7);
    	        document.getElementById(id.replace('Structure', 'CodeSession')).value = text.substring(7, 10);
    	        document.getElementById(id.replace('Structure', 'CodeSession')).enable();
    	        document.getElementById(id.replace('Structure', 'CodeSession')).focus();
        	}else{
    	        document.getElementById(id.replace('Structure', 'Stage')).value = text.substring(2, 7);
    	        document.getElementById(id.replace('Structure', 'Session')).value = text.substring(7, 10);
    	        document.getElementById(id.replace('Structure', 'Session')).enable();
    	        document.getElementById(id.replace('Structure', 'Session')).focus();
        	}
		}
    }, 100);
};


function designer_correcteur_copie(pForm, url) {
	if (!pForm) {
		pForm = $('form_liste_agent');
	}
	var ligneSelectionne = $$('#form_liste_agent input:checked');
	var nbligneselect = ligneSelectionne.length;
	// aucune case n'est cochée. Ou il n'y a pas de case à cocher
	if (nbligneselect == 0) {
		alert("Vous devez cocher au moins une case.");
		return false;
	} else {
		pForm.action = url;
		pForm.submit();
		return true;
	}

};
function copie_SetSelect(pChk, id) {

	var eerAgent = new RegExp("^PTListagentSEL_" + id + "_(\\d+)");
	var _pForm = document.getElementById('form_liste_agent');
	var elements = _pForm.getElementsByTagName('input');
	for (var i = 0; i < elements.length; i++) {
		if (elements[i].type == 'checkbox') {

			if (elements[i].id.match(eerAgent)
					&& elements[i].checked != pChk.checked) {
				elements[i].checked = pChk.checked;
			}
		}
	}
};

function correcteur_SetSelect(pChk) {
	var _id = pChk.value;
	var _idsel = '';
	if (_id == 'ALL') {
		var _re = new RegExp("^SEL_CORRECTEUR_");
		var _pForm = document.getElementById('form_liste_copie');
		_id = ''
		for (var _i in _pForm.elements) {
			if (typeof(_pForm.elements[_i]) != 'object' || !_pForm.elements[_i]) {
				continue;
			}
			if (!_pForm.elements[_i].type && _pForm.elements[_i].type != 'checkbox') {
				continue;
			};
			if (_pForm.elements[_i].id.match(_re)) {
				if (parseInt(_pForm.elements[_i].value, 10) > 0) {
					_pForm.elements[_i].checked = pChk.checked;
					_id += "|" + _pForm.elements[_i].value;
				}
			}
		}
	}
}

function designer_formateur_copie(pForm, url, envoyer) {
	if (!pForm) {
		pForm = $('form_liste_copie');
	}
	var ligneSelectionne = $$('#form_liste_copie input:checked');
	var nbligneselect = ligneSelectionne.length;
	// aucune case n'est cochée. Ou il n'y a pas de case à cocher
	if (nbligneselect == 0) {
		alert("Vous devez sélectionner un correcteur.");
		return false;
	} else {
		pForm.action = url;
		pForm.submit();
		return true;
	}

};

function generer_formateur_copie(pForm, url, envoyer) {
	if (!pForm) {
		pForm = $('form_liste_copie');
	}
	var ligneSelectionne = $$('#form_liste_copie input:checked');
	var nbligneselect = ligneSelectionne.length;
	// aucune case n'est cochée. Ou il n'y a pas de case à cocher
	if (nbligneselect == 0) {
		alert("Vous devez cocher au moins une case.");
		return false;
	} else {
		if(envoyer){
			var checkedCheckbox = $$('input:checkbox[checked=true]');
			var alerte = false;
			for (var i = 0; i < checkedCheckbox.length; i++) {
				if(checkedCheckbox[i].id != 'SEL_CORRECTEUR_0'){
					var idCorrecteur = checkedCheckbox[i].id;
					var genereeCorrecteur = document.getElementById('GENEREE_'.concat(checkedCheckbox[i].id)).value;
					if ('non' == genereeCorrecteur){
						alerte = true;
					}
				}
			}
			if(alerte == true){
				alert("Au moins un correcteur sélectionné n’a pas de liste de copies générée. Veuillez revoir votre sélection.");
			}
		}
		pForm.action = url;
		pForm.submit();
		return true;
	}

};

function afficherDates(event, date1, date2){
	var elt = event.target;
	agent_detail.bInLayer = true;
	if (!event.layerX) {
		event.layerX = event.offsetX;
		event.layerY = event.offsetY;
	}
	var layer = elt;
	var x = 0;
	var y = 0;
	while (layer.offsetParent != null) {
		x += layer.offsetLeft;
		y += layer.offsetTop;
		if (layer.offsetParent.id == 'fip_page') {
			break;
		}
		layer = layer.offsetParent;
	}
	_adCury = y - 50;
	_adCurx = x - 0;
	var notice = $('lucarne');
	if(date2 !== 'undefined'){

		notice.update('<div style="width: 140px; height: 40px" class="datemail" onmouseleave="this.hide()"><h3>Générée le '+date1+'</h3><h3>Envoyée le '+date2+'</h3></div>');
		notice.style.top = _adCury + 'px';
		notice.style.left = _adCurx + 'px';	
	} else if(date1 !== 'undefined') {
		notice.update('<div class="datemail"><h3>Générée le '+date1+'</h3></div>');
		notice.style.top = _adCury + 'px';
		notice.style.left = _adCurx + 'px';
	}
}
function cacherDates(event){
	if (agent_detail.bInLayer == true) {
		agent_detail.bInLayer = false;
		setTimeout("agent_detail_close();", 50);
		return false;
	}
	
}
function verifierValidationPreco(event){
	if($$('form input:checkbox:checked').size() == 0){
		var message = "Etes-vous sûr de vouloir refuser la préconisation ?";
	}else{
		var message = "Les modules suivants seront acceptés :";
		$$('form input:checkbox:checked').each(function(elem){
			if(elem.id.split('-')[1] == 'facul'){
				message += '\n- ' + elem.id.split('-')[2];				
			}else{
				if(elem.id.split('-')[1] == 'oblig'){
					$$('form input:hidden').each(function(elem){
						var aParams = elem.id.split('-');
						console.log(aParams);
						if(aParams.size() == 3){
							if(aParams[0] == 'hiddencheck' && aParams[1] == 'oblig'){
								message += '\n- ' + aParams[2];
							}
						}
					});
				}else if(elem.id.split('-')[1] == 'tremplin'){
					message += '\n- ' + elem.id.split('-')[2];
					$$('[id^=hiddencheck-tremplin-'+elem.id.split('-')[2]+'-]').each(function(elem){
						message += '\n- ' + elem.id.split('-')[3];
					});
				}
			}
		});
	}
	if(confirm(message)){
		return true;
	}else{
		event.preventDefault();
		return false;
	}
}

function PrintElem()
{
    if ($$('div.contenu_overlay')[0] && $$('div.contenu_overlay')[0].innerHTML.length > 0 && $('overlay').visible()) {
    	PopupPrint($('overlay').innerHTML);
    } else {
    	window.print();
    }
}

function PopupPrint(data) 
{
    var mywindow = window.open('', '', 'height=600,width=1000,toolbar=1,scrollbars=1,status=0');
    mywindow.document.write('<html><head><title></title>');
    
	// OK c'est pas joli du tout mais sinon ça marche pas sur Chrome si j'appelle directement les balises <link>
    mywindow.document.write('<style>');
    requestUpdateStatut = new Ajax.Request('/cnfpt/css/structures.css', {
		method:'get',
		asynchronous: false,
		onSuccess: function(transport) {
			mywindow.document.write(transport.responseText);
		}
	});
    mywindow.document.write('</style>');

    mywindow.document.write('<style>');
    requestUpdateStatut = new Ajax.Request('/cnfpt/css/articulations.css', {
		method:'get',
		asynchronous: false,
		onSuccess: function(transport) {
			mywindow.document.write(transport.responseText);
		}
	});
    mywindow.document.write('</style>');

    mywindow.document.write('<style>');
    requestUpdateStatut = new Ajax.Request('/cnfpt/css/contenus.css', {
		method:'get',
		asynchronous: false,
		onSuccess: function(transport) {
			mywindow.document.write(transport.responseText);
		}
	});
    mywindow.document.write('</style>');
    
    mywindow.document.write('</head><body >');
    mywindow.document.write(data);
    mywindow.document.write('</body></html>');

    mywindow.document.close(); // necessary for IE >= 10
    mywindow.focus(); // necessary for IE >= 10

    if(navigator.userAgent.search("Firefox") >-1){
    	//fonction de suppression des fieldsets
    	var beforePrint = function() {
    		//recuperation des balises fieldset
    		var fieldsets = mywindow.document.getElementsByTagName("fieldset");
    		for (var i = 0; i < fieldsets.length; i++) {
    			//remplacement des balises fieldset en div
    			if (fieldsets[i].className == "")
    				fieldsets[i].outerHTML = '<div class="fieldset">'
    						+ fieldsets[i].innerHTML + '</div>'
    		}
    	};

    	//ajouts des fonctions de remplacement lors demandes d'impression par le navigateur, avec ctrl-P et le traitement javascript
    	if (mywindow.matchMedia) {
    		var mediaQueryList = mywindow.matchMedia('print');
    		mediaQueryList.addListener(function(mql) {
    			if (mql.matches) {
    				beforePrint();
    			}
    		});
    	}

    	mywindow.onbeforeprint = beforePrint;

    	//ecrasement du traitement javascript par default
    	var _print = mywindow.print;
    	mywindow.print = function() {
    		beforePrint();
    		_print();
    	}
    }
    
    mywindow.print();
    mywindow.close();
    

    return true;
}

document.observe("dom:loaded", function() {

	elementTriggerPopupControlAgentEmailUnique = false;
	
	// Bouton qui ferme la pop up de controle d'email unique pou run agent
	if (undefined != $('popup-control-email-agent-unique-btn-close')) {
		$('popup-control-email-agent-unique-btn-close').observe('click', function(event) {
			close_popup_control_email_agent_unique();
		});
	}
	
	// Relance l'action en cours dans elementTriggerPopupControlAgentEmailUnique suite à la validation des emails
	if(undefined != $('popup-control-email-agent-unique-btn-valider')) {
		$('popup-control-email-agent-unique-btn-valider').observe('click', function(event) {
			$('popup-control-email-agent-unique-content-error').update();
			if (valider_popup_control_email_agent_unique()) {
				close_popup_control_email_agent_unique();
				if ('undefined' != typeof elementTriggerPopupControlAgentEmailUnique) {
					elementTriggerPopupControlAgentEmailUnique.stopObserving('click');
					elementTriggerPopupControlAgentEmailUnique.click();
				}
				else if ('undefined' != typeof formToCastAfterPopupClosedTransfert && formToCastAfterPopupClosedTransfert == "/TransfertInscription/poursuivreTransfert") {
					window.location.href = formToCastAfterPopupClosedTransfert;
				}
			}
		});
	}
	
});

// Validation du pop up de saisie d'adresse email unique
function valider_popup_control_email_agent_unique() {	
	// On récupère les paramètres utiles
	email = $('popup-control-email-agent-unique-content-input').value.trim();
	agentId = $('agent_id_control_email_agent_unique').value;
	appli = $('appli_control_email_agent_unique').value;
	
	res = false;
	
	if (email == "") {
		valider_popup_control_email_agent_unique_erreur('obligatoire');
	} else {
		// Si on a saisie une adresse un réalise un contrôle
		new Ajax.Request('/inscriptions/ajax_control_email_agent_unique_valider', {
			method: 'post',
			asynchronous: false,
			parameters: {
				'data[Agent][id]': agentId,
				'data[Agent][email]': email,
				'data[Appli][appli]': appli
			},
			onSuccess: function(transport) {
				var response = transport.responseText.evalJSON();
				if (undefined != response.erreur) {
					// En cas d'erreur on l'affiche
					valider_popup_control_email_agent_unique_erreur(response.erreur);
					res = false;
				} else {
					if ('undefined' != typeof miseAjourLigneTableauControlEmailAgentUnique) {
						idLigneToUpdate = miseAjourLigneTableauControlEmailAgentUnique;
						delete miseAjourLigneTableauControlEmailAgentUnique;
						valider_popup_control_email_agent_unique_update_ligne(idLigneToUpdate);
					}
					// Dans le cas où on a besoin d'appeler la méthode agent_select on récupère le formulaire à caster.
					if ('undefined' != typeof formToCastAfterPopupClosed) {
						form = formToCastAfterPopupClosed;
						delete formToCastAfterPopupClosed;
						if (form.getAttribute("id") == 'form_inscription_dispositif') {
							form.submit();
						} else {
							return agent_select(form);
						}
					}
					res = true;
				}
			},
			onFailure: function() {
				alert('Une erreur est survenue pendant la validation de l\'enregistrement.');
				res = false;
			}
		});
	}
	
	return res;
}

// Update des lignes validées suite à la modification d'un email dans l'écran de controle multiple des email unique
function valider_popup_control_email_agent_unique_update_ligne(agentId) {
	$('tableau-control-multiple-email-agent-unique-'+agentId).setStyle({'background-color': 'white'});
	$('tableau-control-multiple-email-agent-unique-valide-'+agentId).update('Valide');
	$('tableau-control-multiple-email-agent-unique-message-'+agentId).update('');
	$('tableau-control-multiple-email-agent-unique-link-'+agentId).update('');
	
}

// Affichage des erreurs lors de la validation de l'email dans le pop up de saisie d'adresse email unique
function valider_popup_control_email_agent_unique_erreur(erreur) {
	errorText = {
	    'non_valide': 'Vous devez indiquer un email valide.',
	    'obligatoire': 'Vous devez indiquer un email valide.',
	    'non_unique_pro': 'Le courriel professionnel est déjà utilisé par un autre compte.',
	    'non_unique_perso': 'Le courriel personnel est déjà utilisé par un autre compte.',
	    'unexpected_error': 'Une erreur est survenue pendant la sauvegarde, veuillez réessayer plus tard.'
	};
	$('popup-control-email-agent-unique-content-error').update(errorText[erreur]);
}

// Controle sur l'unicité de l'adresse email d'un agent.
function control_popup_control_email_agent_unique(agentId) {
	if (undefined == $('agent_id_control_email_agent_unique') && null == agentId) {
		alert('Une erreur est survenue pendant le contrôle d\'unicité de l\'adresse email.');
		return false;
	} else {
		agentId = agentId == null ? $('agent_id_control_email_agent_unique').value : agentId;
		
		res = false;
		
		// On va vérifier si l'adresse email est valide. Si elle ne l'est pas on affiche la popup
		new Ajax.Request('/inscriptions/ajax_control_email_agent_unique', {
			method: 'post',
			asynchronous: false,
			parameters: {
				'data[Agent][id]': agentId
			},
			onSuccess: function(transport) {
				var response = transport.responseText.evalJSON();
				if (typeof response.erreur !== 'undefined' && response.erreur != "") {
					alert('Une erreur est survenue pendant le contrôle d\'unicité de l\'adresse email.');
					res = "error";
				}
				if (response.success == 'unique') {
					res = "success";
				}
				if (response.success == 'non_unique') {
					res = "popup";
				}
			},
			onFailure: function() {
				alert('Une erreur est survenue pendant le contrôle d\'unicité de l\'adresse email.');
				res = "error";
			}
		});
		
		return res;
	}
}

// Fermeture du pop up de saisie d'adresse email unique
function close_popup_control_email_agent_unique() {
	$('popup-control-email-agent-unique-content-input').setValue('');
	$('popup-control-email-agent-unique-content-error').update();
	$('popup-control-email-agent-unique').hide();
	$('navigation').setStyle({'z-index': 3});
}

// Affichage du pop up de saisie d'adresse email unique
function display_popup_control_email_agent_unique(agentId, appli) {
	$('popup-control-email-agent-unique').show();
	$('navigation').setStyle({'z-index': 0});

	$('agent_id_control_email_agent_unique').setValue(agentId);
	$('appli_control_email_agent_unique').setValue(appli);
	
	typeAdresse =  appli == 'front' ? 'professionnelle' : 'personnelle';
	content = $('popup-control-email-agent-unique-content-text').innerHTML;
	content = content.replace('{TYPE_ADRESSE}', typeAdresse);
	$('popup-control-email-agent-unique-content-text').update(content);
}

// Controle multiple d'unicité des adresses email
function control_multiple_popup_control_email_agent_unique() {
	
	new Ajax.Request('/inscriptions/ajax_control_multiple_email_agent_unique', {
		method: 'post',
		asynchronous: false,
		onSuccess: function(transport) {
			var response = transport.responseText;
			$('onglets').insert(response);
			$$('.onglet')[0].hide();
		},
		onFailure: function() {
			alert('Une erreur est survenue pendant le contrôle d\'unicité de l\'adresse email.');
			res = "error";
		}
	});
	
}

function control_multiple_popup_control_email_agent_unique_RGP(dispositifId) {

	if(dispositifId === undefined){
		dispositifId = null;
	}
	new Ajax.Request('/inscriptions/ajax_control_multiple_email_agent_unique_RGP', {
		method: 'post',
		asynchronous: false,
		parameters: {
			'data[Dispositif][id]': dispositifId
		},
		onSuccess: function(transport) {
			var response = transport.responseText;
			$('onglets').insert(response);
			$$('.onglet')[0].hide();
		},
		onFailure: function() {
			alert('Une erreur est survenue pendant le contrôle d\'unicité de l\'adresse email.');
			res = "error";
		}
	});
	
}

function check_if_session_has_specificite_police(sessionId){
	// On vérifie si la session a une spécificité Police
	result = false ;
	new Ajax.Request('/inscriptions/ajax_control_session_has_specificite_police', {
		method: 'post',
		asynchronous: false,
		parameters: {
			'data[InterSession][id]': sessionId
		},
		onSuccess: function(transport) {
			var response = transport.responseText.evalJSON();
			if (typeof response.erreur !== 'undefined' && response.erreur != "") {
				alert("Une erreur est survenue lors de l'appel ajax");
			}
			if (response.result == "has_specificite_police") {
				result = true; 
			}
		},
		onFailure: function() {
			alert("Une erreur est survenue lors de l'appel ajax");
		}
	});
	return result;
}

var checkNomenclature = function(elt) {
	if(elt.value == 'CAPL'){
		//Remise à zéro des champs domaines / sous-domaines
		if($('recherche_sessionsInterDomaineId') != null){
			$('recherche_sessionsInterDomaineId').selectedIndex = 0;
			changementDomaine($('recherche_sessionsInterDomaineId'));
		}
		// //Remise à zéro des champs domaines / sous-domaines dans l'écran recherche session FO
		if($('input_data_inter_session_inter_domaine_id') != null){
			$('input_data_inter_session_inter_domaine_id').selectedIndex = 0;
			changementDomaine($('input_data_inter_session_inter_domaine_id'));
		}
		
		document.getElementById("div_nomenclature_domaine").style.display="none";
		document.getElementById("div_nomenclature_capl").style.display="block";
	}else if(elt.value == 'domaine'){
		//Remise à zéro des champs de la nouvelle nomenclature
		$('input_data_inter_session_capl_id').selectedIndex = 0;
		changementCAPL($('input_data_inter_session_capl_id'));

		document.getElementById("div_nomenclature_domaine").style.display="block";
		document.getElementById("div_nomenclature_capl").style.display="none";
	}	
};

var changementDomaine = function(elt) {
    if (elt.id == 'input_data_inter_session_inter_domaine_id') {
        var liste_sous_domaines = $('input_data_inter_session_inter_sousdomaine_id');
    } else {
        var liste_sous_domaines = $('recherche_sessionsInterSousdomaineId');
    }
    if (elt.value !== '') {
		var sori = ($('recherche_sessionsOrigine')) ? $('recherche_sessionsOrigine').value : '';
		var stype_inter = ($('InterSessionTypeInter') && $('InterSessionTypeInter').value == 'intra_union') ? 'intra' : 'inter';
		var url_ajax = '/inscriptions/getsousdomaine/' + elt.value + '/'+stype_inter+'/'+sori+'/';
        new Ajax.Request(url_ajax+'.json',
                {
                    method: 'get',
                    onSuccess: function(transport) {
                        var _response = transport.responseText.evalJSON();
                        liste_sous_domaines.options.length = 0;
                        liste_sous_domaines.options.add(new Option('Choisissez un sous-domaine', ''));
                        for (var i = 0; i < _response.length; i++) {
                            var _d = _response[i];
                            liste_sous_domaines.options.add(new Option(_d.text, _d.value));
                        }
                        return true;
                    },
                    onFailure: function() {
                        alert(_errorAjax)
                    }
                });

    } else {
        liste_sous_domaines.options.length = 0;
        liste_sous_domaines.options.add(new Option('Choisissez un domaine', ''));
    }
};

var changementCAPL = function(elt){
	 liste_specialites = $('input_data_inter_session_specialite_id');
	 liste_sous_specialites = $('input_data_inter_session_sous_specialite_id');
	 if (elt.value !== '') {
		 var url_ajax = '/inscriptions/getSpecialite/' + elt.value;
         new Ajax.Request(url_ajax+'.json',
              {
                  method: 'get',
                  onSuccess: function(transport) {
                      var _response = transport.responseText.evalJSON();
                      liste_specialites.options.length = 0;
                      liste_specialites.options.add(new Option('Choisissez une Spécialité', ''));
                      liste_sous_specialites.options.length = 0;
                      liste_sous_specialites.options.add(new Option('Choisissez une Sous-Spécialité', ''));
                      for (var i = 0; i < _response.length; i++) {
                          var _d = _response[i];
                          liste_specialites.options.add(new Option(_d.text, _d.value));
                      }
                      return true;
                  },
                  onFailure: function() {
                      alert(_errorAjax)
                  }
              });
	 }else{
		 liste_specialites.options.length = 0;
		 liste_specialites.options.add(new Option('Choisissez une Spécialité', ''));
		 liste_sous_specialites.options.length = 0;
		 liste_sous_specialites.options.add(new Option('Choisissez une Sous-Spécialité', ''));
	 }	
};
