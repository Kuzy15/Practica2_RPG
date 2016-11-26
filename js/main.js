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

console.log(battle.setup);

battle.on('start', function (data) {
    console.log('START', data);

});

battle.on('turn', function (data) {
    console.log('TURN', data);
	//console.log ('Battle', battle);
    // TODO: render the characters
	var heroes, monsters;
	heroes = document.querySelector('.character-list');
	//He tenido que cambiar el nombre al la lista de los nombres en el index pq no sabia como acceder a ella.
	monsters = document.querySelector('.character-list2');
	var arrayH, arrayM;
	arrayH = battle.characters.allFrom('heroes');
	arrayM = battle.characters.allFrom('monsters');
	for (var obj in arrayH) {
			heroes.innerHTML +=`<li data-chara-id="${arrayH[obj].name}">${arrayH[obj].name} (HP: <strong>${arrayH[obj].hp}</strong>/${arrayH[obj].maxHp}
			, MP: <strong>${arrayH[obj].mp}</strong>/${arrayH[obj].maxMp})</li>`;	
	}
	
	for (var obj in arrayM) {
			monsters.innerHTML +=`<li data-chara-id="${arrayM[obj].name}">${arrayM[obj].name} (HP: <strong>${arrayM[obj].hp}</strong>/${arrayM[obj].maxHp}
			, MP: <strong>${arrayM[obj].mp}</strong>/${arrayM[obj].maxMp})</li>`;	
	}
    // TODO: highlight current character
	
	
	
	
	
    // TODO: show battle actions form
});

battle.on('info', function (data) {
    console.log('INFO', data);

    // TODO: display turn info in the #battle-info panel
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
        // TODO: hide this menu
        // TODO: go to either select target menu, or to the select spell menu
    });

    targetForm.addEventListener('submit', function (evt) {
        evt.preventDefault();
        // TODO: select the target chosen by the player
        // TODO: hide this menu
    });

    targetForm.querySelector('.cancel')
    .addEventListener('click', function (evt) {
        evt.preventDefault();
        // TODO: cancel current battle options
        // TODO: hide this form
        // TODO: go to select action menu
    });

    spellForm.addEventListener('submit', function (evt) {
        evt.preventDefault();
        // TODO: select the spell chosen by the player
        // TODO: hide this menu
        // TODO: go to select target menu
    });

    spellForm.querySelector('.cancel')
    .addEventListener('click', function (evt) {
        evt.preventDefault();
        // TODO: cancel current battle options
        // TODO: hide this form
        // TODO: go to select action menu
    });

    battle.start();
};
