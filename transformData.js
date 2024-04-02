import fs from 'fs';
import csv from 'csvtojson';
import { AsyncParser } from '@json2csv/node';
import { templateVariable, templateCard } from './libs/dataTemplate.js';
import { getColor, translateRarity, translateLang, translateFoil } from './libs/translator.js';
import { getInfo } from './libs/vendor.js';

const fileInputName = './input/carton-premium.csv'; 
const parser = new AsyncParser();





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



function getLocalAttributes(jsonData, i, attribute) {
    let arrayOfVersiones = new Set(); 


    if (i < jsonData.length) {
        do {
            arrayOfVersiones.add(jsonData[i][attribute]);
            i++;
        } while (i < jsonData.length && jsonData[i].Name === jsonData[i - 1].Name);

        attribute = Array.from(arrayOfVersiones).join(', ');
    }
    return attribute;
}


function checkIfVariable(data, i){
    let isVariable;

    if (i === 0) {
        isVariable = true;
    } else if (data[i-1].Name === data[i].Name){
        isVariable  = false;
    } else {
        isVariable = true
    }
    return isVariable;
}




async function transformData(csvData){
    let jsonData = await csvToJsonConverter(csvData);
    let jsonformatted = [];

    if (!fs.existsSync("output")) {
        fs.mkdirSync("output");
    }
        // Enable this to remove the api request from the process; 
        // let cardData = await getInfo("d2a8e716-ea33-4ae2-9ff8-5e78b0e50459");
    
    for (const [i, element] of jsonData.entries()){
        let cardData = await getInfo(element["Scryfall ID"]);
        let isVariable;
        isVariable = checkIfVariable(jsonData, i);
              
        if (isVariable) {
                jsonformatted.push(
                    templateVariable(
                        {
                            sku:element.Name,
                            name: element.Name,
                            image: (cardData.layout === "transform" || cardData.layout === "modal_dfc") ? cardData.card_faces[0].image_uris.normal : cardData.image_uris.normal,
                            foil: translateFoil(getLocalAttributes(jsonData, i, "Foil")),
                            language: translateLang(getLocalAttributes(jsonData, i, "Language")), 
                            rarity: translateRarity(getLocalAttributes(jsonData, i, "Rarity")), 
                            versions: getLocalAttributes(jsonData, i, "Set code"),
                            color: getColor(cardData),
                            type: cardData.type_line,
                            cmc: cardData.cmc,
                        }
                    ))     
        }


        jsonformatted.push(templateCard(
            {
                sku:`${element["Set code"]}-${element["Collector number"]}-${element.Language}-${element.Foil}`,
                name: element.Name,
                quantity: element.Quantity,
                price: (element["Purchase price"] * 0.9).toFixed(2),
                image: (cardData.layout === "transform" || cardData.layout === "modal_dfc") ? cardData.card_faces[0].image_uris.normal : cardData.image_uris.normal,
                superior: element.Name,
                foil: translateFoil(element.Foil),
                language: translateLang(element.Language),
                rarity: translateRarity(element.Rarity),
                version: element["Set code"],
                
            }
        ));      
        
        console.log(jsonformatted[i]);
    }
    
    console.log(`Lista la conversion`);
    return jsonformatted;
    
}


try {
    let jsonformatted = await transformData(fileInputName);
    const csv = await parser.parse(jsonformatted).promise();
    fs.writeFile("output/woo-export.csv", csv, (err) => {
        if (err) throw err;
    })
} catch (error) {
    console.error(error);
}




