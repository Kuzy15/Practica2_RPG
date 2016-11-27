var battle = new RPG.Battle();
var actionForm, spellForm, targetForm;
var infoPanel;



function prettifyEffect(obj) {
    return Object.keys(obj).map(function (key) {
        var sign = obj[key] > 0 ? '+' : ''; // show + sign for positive effects
        return `${sign}${obj[key]} ${key}`;
    }).join(', ');
}


battle.setup({
    heroes: {
        members: [
            RPG.entities.characters.heroTank,
            RPG.entities.characters.heroWizard
        ],
        grimoire: [
            RPG.entities.scrolls.health,
            RPG.entities.scrolls.fireball
        ]
    },
    monsters: {
        members: [
            RPG.entities.characters.monsterSlime,
            RPG.entities.characters.monsterBat,
            RPG.entities.characters.monsterSkeleton,
            RPG.entities.characters.monsterBat
        ]
    }
});


battle.on('start', function (data) {
    console.log('START', data);

});

battle.on('turn', function (data) {
    console.log('TURN', data);
	//console.log ('Battle', battle);
    // HECHO - TODO: render the characters. No sabemos como poner bat 2, si los que nos devuelve el metodo son todos bat.
	var heroes, monsters;
	heroes = document.querySelector('.character-list');
	//He tenido que cambiar el nombre al la lista de los nombres en el index pq no sabia como acceder a ella.
	monsters = document.querySelector('.character-list2');
	var arrayH, arrayM;
	arrayH = battle.characters.allFrom('heroes');
	arrayM = battle.characters.allFrom('monsters');
	heroes.innerHTML = "";
	for (var obj in arrayH) {
     var dead = battle.character.isDead();//No se como llamar a este método
    if(dead){//si esta muerto se añade la clase 'dead'. Otra posibilidad: if(obj.isDead())... pero tampoco va
      heroes.innerHTML +=`<li data-chara-id="${arrayH[obj].name}" class="dead">${arrayH[obj].name} (HP: <strong>${arrayH[obj].hp}</strong>/${arrayH[obj].maxHp}
			, MP: <strong>${arrayH[obj].mp}</strong>/${arrayH[obj].maxMp})</li>`;
    }
    else{
			heroes.innerHTML +=`<li data-chara-id="${arrayH[obj].name}">${arrayH[obj].name} (HP: <strong>${arrayH[obj].hp}</strong>/${arrayH[obj].maxHp}
			, MP: <strong>${arrayH[obj].mp}</strong>/${arrayH[obj].maxMp})</li>`;
    }
	}
	monsters.innerHTML = "";
	var i = 0;
	for (var obj in arrayM) {

		if (arrayM[obj].name === 'bat'){

			i++;
		}
		if ( arrayM[obj].name === 'bat' && i === 2){
			monsters.innerHTML +=`<li id="${arrayM[obj].name} 2">${arrayM[obj].name} 2 (HP: <strong>${arrayM[obj].hp}</strong>/${arrayM[obj].maxHp}
			, MP: <strong>${arrayM[obj].mp}</strong>/${arrayM[obj].maxMp})</li>`;


		}else{
			monsters.innerHTML +=`<li id="${arrayM[obj].name}">${arrayM[obj].name} (HP: <strong>${arrayM[obj].hp}</strong>/${arrayM[obj].maxHp}
			, MP: <strong>${arrayM[obj].mp}</strong>/${arrayM[obj].maxMp})</li>`;
		}
	}
    // HECHO - TODO: highlight current character
	//el querySelector no funciona con bat 2.
	var currentCh = document.querySelector(`[id =${data.activeCharacterId}]`);
	currentCh.classList.add("active");


    // HECHO - TODO: show battle actions form
    actionForm.style.display="block";
   var actions = document.querySelector('.choices1');
    var options = battle.options.list();

      for(var i = 0; i< options.length;++i){

      actions.innerHTML += `<li><label><input type="radio" name="option" value="${options[i]}">${options[i]}</label></li>`;
    }


});

battle.on('info', function (data) {
    console.log('INFO', data);
    // TODO: display turn info in the #battle-info panel
	 infoPanel = document.querySelector('#battle-info');
	 if (data.action === 'defend'){
		infoPanel.innerHTML =`<strong>${data.activeCharacterId}</strong> defended <strong>${data.success ? 'successfully.' : 'and failed.' }</strong> Defense: ${data.newDefense}`;
	 }
	 if (data.action === 'attack'){
		 var effectsTxT = prettifyEffect(data.effect || {});
		 infoPanel.innerHTML =`<strong>${data.activeCharacterId}</strong> attacked <strong>${data.targetId}</strong> ${data.success ? ' and caused ${effectsTxT}'
			: 'and failed.' }`;
	 }
	if (data.action === 'cast'){
		var effectsTxT = prettifyEffect(data.effect || {});
		 infoPanel.innerHTML =`<strong>${data.activeCharacterId}</strong> casted <em>${data.spell}</em> ${data.success ? ' and caused'
			: 'and failed.' }`;



	}

});

battle.on('end', function (data) {
    console.log('END', data);

    // TODO: re-render the parties so the death of the last character gets reflected
    // TODO: display 'end of battle' message, showing who won
});

window.onload = function () {
    actionForm = document.querySelector('form[name=select-action]');
    targetForm = document.querySelector('form[name=select-target]');
    spellForm = document.querySelector('form[name=select-spell]');
    infoPanel = document.querySelector('#battle-info');


    actionForm.addEventListener('submit', function (evt) {
        evt.preventDefault();

        // TODO: select the action chosen by the player
		var action = actionForm.elements['option'].value;
		battle.options.select(action);
		//He hecho el required en el TODO show battle action porque supongo que se puede añadir required allí.

        // TODO: hide this menu
		actionForm.style.display = 'none';
        // TODO: go to either select target menu, or to the select spell menu

		if (action === 'attack'){
			targetForm.style.display = 'block';
			var targets = document.querySelector('.choices2');
			var charParty, enemiesParty;
			charParty = battle._activeCharacter.party;
			if (charParty === 'monsters'){
				enemiesParty = 'heroes';
			}
			else enemiesParty = 'monsters';
			var chars = battle.characters.allFrom(enemiesParty);
				targets.innerHTML = "";
			for(var obj in chars){

			targets.innerHTML += `<li><label><input type="radio" name="option" value="${chars[obj].name}" >${chars[obj].name}</label></li>`;
    }
		}

		else if (action === 'cast'){
			spellForm.style.display = 'block';
			var spells = document.querySelector('.choices3');
			var charParty = battle._activeCharacter.party;
			var partyGrimoire = battle._grimoires[charParty];
			var spellButton = spellForm.elements[0];
			console.log(battle);
			if (partyGrimoire.hasOwnProperty('fireball') ){
				spellButton.disabled = 'false';
				spells.innerHTML = "";
				for (var obj in partyGrimoire){
					spells.innerHTML += `<li><label><input type="radio" name="option" value="${partyGrimoire[obj]}" >${partyGrimoire[obj]}</label></li>`;
				}
			}
			else{
				spellButton.disabled = 'true';
			}
		}
    });

    targetForm.addEventListener('submit', function (evt) {
        evt.preventDefault();
        // TODO: select the target chosen by the player
		var target = targetForm.elements['option'].value;
		battle.options.select(target);

        // TODO: hide this menu
		targetForm.style.display = 'none';
		actionForm.style.display = 'block';

    });

    targetForm.querySelector('.cancel')
    .addEventListener('click', function (evt) {
        evt.preventDefault();
        // TODO: cancel current battle options
		 battle.options.cancel;
        // TODO: hide this form
		targetForm.style.display = 'none';
        // TODO: go to select action menu
		actionForm.style.display = 'block';
    });

    spellForm.addEventListener('submit', function (evt) {
        evt.preventDefault();
        // TODO: select the spell chosen by the player
		var spell = spellForm.elements['option'].value;
		battle.options.select(spell);
        // TODO: hide this menu
		spellForm.style.display = 'none';
        // TODO: go to select target menu
		targetForm.style.display = 'block';
    });

    spellForm.querySelector('.cancel')
    .addEventListener('click', function (evt) {
        evt.preventDefault();
        // TODO: cancel current battle options
		battle.options.cancel;
        // TODO: hide this form
		spellForm.style.display = 'none';
        // TODO: go to select action menu
		actionForm.style.display = 'block';
    });

    battle.start();
};
