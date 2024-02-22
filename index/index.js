import fs from 'fs';
import csv from 'csvtojson';
import { templateVariable, templateCard } from './dataTemplate.js';
import { getColor, translateRarity, translateLang } from './translator.js';
import { getInfo } from './vendor.js';

const fileInputName = './input/carton-premium-es.csv'; 





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
    
    for (const [i, element] of jsonData.entries()){
        let isVariable;
        
        let cardData = await getInfo(element["Scryfall ID"]);
        isVariable = checkIfVariable(jsonData, i);
              
        if (isVariable) {
                jsonformatted.push(templateVariable(
                    {
                        sku:element.Name,
                        name: element.Name,
                        image: (cardData.layout === "transform" || cardData.layout === "modal_dfc") ? cardData.card_faces[0].image_uris.normal : cardData.image_uris.normal,
                        foil: getLocalAttributes(jsonData, i, "Foil"),
                        language: getLocalAttributes(jsonData, i, "Language"), 
                        rarity: getLocalAttributes(jsonData, i, "Rarity"), 
                        versions: getLocalAttributes(jsonData, i, "Set code"),
                        color: getColor(cardData),
                        type: cardData.type_line,
                        cmc: cardData.cmc,
                    }))     
        }


        jsonformatted.push(templateCard(
            {
                sku:`${element["Set code"]}-${element["Collector number"]}-${element.Language}-${element.Foil}`,
                name: element.Name,
                quantity: element.Quantity,
                price: (element["Purchase price"] * 0.9).toFixed(2),
                image: (cardData.layout === "transform" || cardData.layout === "modal_dfc") ? cardData.card_faces[0].image_uris.normal : cardData.image_uris.normal,
                superior: element.Name,
                foil: element.Foil,
                language: element.Language,
                rarity: element.Rarity,
                version: element["Set code"],
                
                

            }
        ));


            console.log(`se han cargado ${i} cartas`);
            if (!fs.existsSync("output")) {
                fs.mkdirSync("output");
            }
        
            fs.writeFile("output/woo-export.json", JSON.stringify(jsonformatted, null, 2), (err) => {
                if (err) throw err;
            })
            
    }
    
    console.log(`Lista la conversion`);
    
}


transformData(fileInputName);






