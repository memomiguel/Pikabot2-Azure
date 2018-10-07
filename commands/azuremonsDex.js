'use strict';
 
const https = require('https');
const fs = require('fs');
 
const azuremonsDBLink = "https://pastebin.com/raw/Yw6md8Uf";
let azuremonsDB = null;
 
const dex = DataDownloader.getPokedex();
const items = DataDownloader.getItems();
const abilities = DataDownloader.getAbilities();
 
const tierColor = {
    S: "#20C554",
    A: "#26DF60",
    B: "#92C520",
    C: "#C5B620",
    D: "#C56320",
    E: "#C53920",
    "?": "#000"
};
 
let getAzuremon = (azuremon, index) => {
    let finalResults = [];
    if (index && azuremonsDB[index].species === azuremon) return azuremonsDB[index];
 
    for (let i = 0, len = azuremonsDB.length; i < len; i++) {
        if (azuremonsDB[i].species === azuremon) {
            azuremonsDB[i].index = i;
            finalResults.push(azuremonsDB[i]);
        }
    }
 
    return finalResults;
};
 
let genDisplayData = (azuremon) => {
    let num = dex[azuremon.species].num;
    let species = dex[azuremon.species].species;
    let types = dex[azuremon.species].types;
    let item = azuremon.item === "-" ? azuremon.item : items[azuremon.item].name;
    let ability = abilities[azuremon.ability].name;
 
 
    if (String(num).length === 1) num = "00" + num;
    if (String(num).length === 2) num = "0" + num;
    if (azuremon.item === "-") azuremon.item = "-";
 
    types = `${types[0]} ${types.length > 1 ? ` / ${types[1]}` : ""}`;
 
    let monData = {
        num: [num],
        species: [species],
        types: [types],
        alt: azuremon.alt,
        item: [item],
        ability: [ability],
        owner: azuremon.owner,
        hp: azuremon.stats.hp,
        atk: azuremon.stats.atk,
        def: azuremon.stats.def,
        spatk: azuremon.stats.spatk,
        spdef: azuremon.stats.spdef,
        spe: azuremon.stats.spe,
        tier: azuremon.tier
    };
 
    return monData;
};
 
let genDisplay = (azuremonData) => {
    return `<div style="border: 1px solid silver; background: #EEE; color: #000; padding: 5px; font-family: monospace;"><span style="float: right; padding: 5px ${azuremonData.tier.length > 1 ? "" : "8px"}; margin: 0.5% 0; background: ${tierColor[azuremonData.tier.replace(/[^A-Z?]/gi, "")]}; border-radius: 5px; color: #FFF;"><strong>${azuremonData.tier}</strong></span><img style="float: right; padding-right: 5px;" src="https://www.serebii.net/pokedex-sm/icon/${azuremonData.num}.png" width="32" height="32" />${azuremonData.species} (${azuremonData.alt}) @ ${azuremonData.item}<br />Type(s): ${azuremonData.types}<br />Ability: ${azuremonData.ability}<br />Owner: ${azuremonData.owner}<br />Stats: ${azuremonData.hp}/${azuremonData.atk}/${azuremonData.def}/${azuremonData.spatk}/${azuremonData.spdef}/${azuremonData.spe}</div>`;
};
 
let getDB = () => {
    return new Promise((resolve, reject) => {
        https.get(azuremonsDBLink, (res) => {
            res.setEncoding('utf8');
 
            let data = "";
            res.on('data', (chunk) => {
                data += chunk;
            });
 
            res.on('end', () => {
                resolve(data);
            });
        }).on('error', (err) => {
            reject("Unable to retrieve database");
            console.error(err);
        });
    });
};
 
let writeDB = (data) => {
    let monData = [];
    let breakData = data.split("\n");
    let valueData = breakData.splice(2, (data.length - 2));
 
    for (let i = 0, len = valueData.length; i < len; i++) {
        let azuremonData = valueData[i].split("|");
 
        for (let j = 0, len = azuremonData.length; j < len; j++) {
            azuremonData[j] = azuremonData[j].trim();
        }
 
        let altRank = azuremonData[7].split("[");
        let alt = altRank[0].trim();
        let tier = altRank[1];
        tier = tier.substr(0, tier.indexOf("]"));
 
        monData.push({
            "species": azuremonData[0],
            "stats": {
                "hp": azuremonData[1],
                "atk": azuremonData[2],
                "def": azuremonData[3],
                "spatk": azuremonData[4],
                "spdef": azuremonData[5],
                "spe": azuremonData[6],
            },
            "alt": alt,
            "ability": azuremonData[8],
            "item": azuremonData[9],
            "tier": tier,
            "owner": azuremonData[10]
        });
    }
 
    fs.writeFileSync('./database/azuremons-db.json', JSON.stringify(monData, null, 4), 'utf8');
};
 
 
if (!fs.existsSync("./database/azuremons-db.json")) {
    getDB()
        .then((data) => {
            writeDB(data)
 
            azuremonsDB = JSON.parse(fs.readFileSync("./database/azuremons-db.json", "utf8"));
        })
        .catch((err) => console.error(err));
} else {
    azuremonsDB = JSON.parse(fs.readFileSync("./database/azuremons-db.json", "utf8"));
}
 
exports.commands = {
    azupd: 'azuremonsupdate',
    azupdate: 'azuremonsupdate',
    azuremonupdate: 'azuremonsupdate',
    azuremonsupdate: function (arg, user, room) {
        if (!this.isExcepted) return;
 
        getDB()
            .then((data) => {
                writeDB(data);
                ok("Azuremons DB Updated");
               
                this.reply("Azuremons DB updated!");
            })
            .catch((err) => {
                this.reply(err);
            });
    },
 
    azuremon: 'azuremons',
    azuremons: function (arg, user, room) {
        if (!this.can("info")) return;
 
        let targets = arg.split(",");
        let target = toId(targets[0]);
 
        let index = targets[1] || false;
        if (index) index = Number(toId(index));
 
        let monData = getAzuremon(target, index);
        if (!monData || (monData instanceof Array && !monData.length)) return this.reply("Specified azuremon doesn't exist");
 
        if (monData.length > 1) {
            let out = "<div style=\"border: 1px solid silver; background: #E5E5E5; color: #000; padding: 5px; overflow-y: auto; max-height: 100px;\">";
 
            for (let i = 0, len = monData.length; i < len; i++) {
                let displayData = genDisplayData(monData[i]);
                let display = genDisplay(displayData);
 
                out += "<details><summary style=\"font-family: monospace;\">";
                out += `${displayData.alt} (${displayData.owner}) @ ${displayData.item} | Ability: ${displayData.ability}</summary>`;
                out += `${display}</details>`;
            }
 
            return this.reply(`/addhtmlbox ${out}</div>`);
        } else {
            let azuremon = monData instanceof Array ? monData[0] : monData;
            if (!azuremon) return this.reply("Specified azuremon doesn't exist");
 
            let displayData = genDisplayData(azuremon);
            let display = genDisplay(displayData);
 
            return this.reply(`/addhtmlbox ${display}`);
        }
    },
};
