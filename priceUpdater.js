import fs from 'fs';
import csv from 'csvtojson';
import { AsyncParser } from '@json2csv/node';

const parser = new AsyncParser();

const fileInputName = './input/carton-premium.csv'; 



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


async function transformData(csvData){
    if (!fs.existsSync("output")) {
        fs.mkdirSync("output");
    }
    
    let jsonData = await csvToJsonConverter(csvData);
    let jsonformatted = [];
    
    for (const [i, element] of jsonData.entries()){              
        jsonformatted.push({
            sku: `${element["Set code"]}-${element["Collector number"]}-${element.Language}-${element.Foil}`,
            price: (element["Purchase price"] * 0.9).toFixed(2)
        });
    }
    
    console.log('the json file is ready');
    return jsonformatted;
}

    try {
        let jsonformatted = await transformData(fileInputName);
        const csv = await parser.parse(jsonformatted).promise();
        fs.writeFile("./output/price-update.csv", csv, (err) => {
            if (err) throw err;
        })
    } catch (error) {
        console.error(error);
    }
