const fs = require('fs');
const path = require('path');
const axios = require('axios');
const csv = require('csvtojson');
const converter = require('json-2-csv');
const fileInputName = './input/carton-premium-es.csv'; 
const options = {};


let requestCount = 0;
let startTime = Date.now();



function rarityTranslator(rarity){
    let rarityES; 
    switch (rarity) {
        case "common" :
            rarityEs = "comun"
            break;
        case "uncommon" :
            rarityEs = "no comun"
            break;

        case "rare" :
            rarityEs = "rara"
            break;

        case "mythic" :
            rarityEs = "mitica"
            break;

        default:
            rarityES = "Rareza invalida";
            break;
    }

    return rarityEs;
}


function colorTranslator(colors){

    let colorEs;
    let colorEsTotal="";

    let qtyColors = colors.length;

    colors.forEach((element,i) => {


    switch (element) {
        case "U" :
            colorEs = "Azul"
            break;
        case "B" :
            colorEs = "Negro"
            break;

        case "W" :
            colorEs = "Blanco"
            break;

        case "G" :
            colorEs = "Verde"
            break;

        case "R" :
            colorEs = "Rojo"   
            break;

        case "" :
            colorEs = "Incoloro"   
            break;

        default:
            colorEs = "Color invalido";
            break;
    }


    if (qtyColors !== i+1){
        colorEsTotal += `${colorEs}, `;
    } else {
        colorEsTotal += colorEs;
    }

});


    return colorEsTotal ;
}


async function csvToJsonConverter(csvInput){
    console.log("Converting the csv into json");
    try{
        let jsonData = await csv().fromFile(csvInput)
        console.log("success converting the csv file to json")
        return jsonData;
    }catch (error){
        console.error(error);
    }

}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function getInfo(scryfallId){
    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `https://api.scryfall.com/cards/${scryfallId}`,
        headers: { }
    };

    await sleep(100); // Wait for 100ms before making the request

    // Update the request counter and check the time
    requestCount++;
    const currentTime = Date.now();
    if (currentTime - startTime > 1000) { // More than a second has passed
        console.log(`Requests in the last second: ${requestCount}`);
        requestCount = 1; // Reset the counter
        startTime = currentTime; // Reset the start time
    }

    try {
        let cardData = await axios.request(config);
        return cardData.data;
    } catch (error) {
        console.error(error);
    }
}









async function transformData(csvData){
    let jsonData = await csvToJsonConverter(csvData);
    
    let jsonformatted = [];
    let tipoVariable;
    let versiones="";
    
    for (const [i, element] of jsonData.entries()){

        let cardData = await getInfo(element["Scryfall ID"]);
    
        
        if (i === 0) {
            tipoVariable = true;
        } else if (jsonData[i-1].Name === jsonData[i].Name){
            tipoVariable  = false;
        } else {
            tipoVariable = true
        }

        
        if (tipoVariable) {

        for (let j = i; j < jsonData.length && (jsonData[i].Name === jsonData[j].Name); j++) {
            if(j + 1 < jsonData.length && jsonData[j].Name === jsonData[j+1].Name) {
                versiones += `${jsonData[j]["Set name"]}, `;
            } else {
                versiones += jsonData[j]["Set name"];
                break;
            }
        }
        

                jsonformatted.push({   
                // Generales
                Tipo: "Variable",      
                SKU: `${element.Name}`,
                Nombre: element.Name,  
                Inventario: "",
                "Precio normal": "",
                "Categorías": "Cartas", 
                "Imágenes": `https://cards.scryfall.io/normal/front/9/2/${element["Scryfall ID"]}.jpg`,
                "Superior": "",
                "Posición": "0", 
                // foil
                "Nombre del atributo 1": "Foil", 
                "Valor(es) del atributo 1":"foil, no foil, etched",
                "Atributo visible 1": "1",
                "Atributo global 1": "1",
                // idioma.colors
                "Nombre del atributo 2": "Idioma",
                "Valor(es) del atributo 2": "Ingles, Español", 
                "Atributo visible 2": "1",
                "Atributo global 2": "1", 
                // rareza
                "Nombre del atributo 3": "Rareza",
                "Valor(es) del atributo 3": "Comun, no comun, rara, mitica", 
                "Atributo visible 3": "1",
                "Atributo global 3": "1",
                //Versiones
                "Nombre del atributo 4": "Version",
                "Valor(es) del atributo 4": versiones,
                "Atributo visible 4": "1", 
                "Atributo global 4": "1",
                //Color
                "Nombre del atributo 5": "Color", 
                "Valor(es) del atributo 5":colorTranslator(cardData.colors),
                "Atributo visible 5": "1",
                "Atributo global 5": "1",
                "Meta: idioma": "" ,
                //Tipo 
                "Nombre del atributo 6": "Tipo", 
                "Valor(es) del atributo 6":cardData.type_line,
                "Atributo visible 6": "",
                "Atributo global 6": "1",
                // CMC
                "Nombre del atributo 7": "CMC", 
                "Valor(es) del atributo 7":cardData.cmc,
                "Atributo visible 7": "1",
                "Atributo global 7": "1",
                //meta color 
                "Meta: color":colorTranslator(cardData.colors),
                "Meta _color":"field_65caaaf3de76f",
                // meta cmc
                "Meta: costo_convertido_de_mana": cardData.cmc,
                "Meta: _costo_convertido_de_mana":"field_65caab48de770",
                //meta tipo de carta
                "Meta: tipo":cardData.type_line,
                "Meta: _tipo":"field_65caab76de772"


            });

            
        }



        jsonformatted.push({   
            // Meta
            Tipo: "Variation",      
            SKU: `${element["Set code"]}-${element["Collector number"]}-${element.Language}-${element.Foil}`,
            Nombre: element.Name,  
            Inventario: element.Quantity,
            "Precio normal": (element["Purchase price"] * 0.9).toFixed(2),
            "Categorías": "", 
            "Imágenes":`https://cards.scryfall.io/normal/front/9/2/${element["Scrifall ID"]}.jpg`,
            "Superior": element.Name,
            "Posición": "", 
            // foil
            "Nombre del atributo 1": "Foil", 
            "Valor(es) del atributo 1": element.Foil==="foil" ? "foil" : "no foil",
            "Atributo visible 1": "",
            "Atributo global 1": "1",
            "Nombre del atributo 2": "Idioma",
            "Valor(es) del atributo 2": element.Language === "es" ? "Español": "Ingles", 
            "Atributo visible 2": "",
            "Atributo global 2": "1", 
            // rareza
            "Nombre del atributo 3": "Rareza",
            "Valor(es) del atributo 3": rarityTranslator(element.Rarity), 
            "Atributo visible 3": "",
            "Atributo global 3": "1",
            //Versiones
            "Nombre del atributo 4": "Version",
            "Valor(es) del atributo 4": element["Set name"], 
            "Atributo visible 4": "", 
            "Atributo global 4": "1",
            //Color
            "Nombre del atributo 5": "", 
            "Valor(es) del atributo 5":"",
            "Atributo visible 5": "",
            "Atributo global 5": "",
             //Tipo 
             "Nombre del atributo 6": "", 
             "Valor(es) del atributo 6":"",
             "Atributo visible 6": "",
             "Atributo global 6": "",
             // CMC
             "Nombre del atributo 7": "", 
             "Valor(es) del atributo 7":"",
             "Atributo visible 7": "1",
             "Atributo global 7": "",
             //meta color 
             "Meta: color":"",
             "Meta _color":"",
             // meta cmc
             "Meta: costo_convertido_de_mana": "",
             "Meta: _costo_convertido_de_mana":"",
             //meta tipo de carta
             "Meta: tipo": "",
             "Meta: _tipo":""


        });

        
        
    }
    
    //  const csv = await converter.json2csv(jsonformatted, options);
    const outputDir = 'output';
    const filePath = path.join(outputDir, "woo-export.json" );

    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir);
    }
    fs.writeFile(filePath, JSON.stringify(jsonformatted, null, 2), (err) => {
        if (err) throw err;
        console.log(`The file has been saved!`);
    })
}



transformData(fileInputName);






