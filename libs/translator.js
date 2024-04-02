

function getColor(card){
let colors;
    if (card.layout === "transform" || card.layout === "modal_dfc"){
        colors = card.card_faces[0].colors;
    } else { 
        colors = card.colors
    }

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



function translateRarity(card){
    let rarity = card;
    let rarityEs=""; 

    switch (rarity) {
        case "common" :
            rarityEs = "Comun"
            break;
        case "uncommon" :
            rarityEs = "No comun"
            break;

        case "rare" :
            rarityEs = "Rara"
            break;

        case "mythic" :
            rarityEs = "Mitica"
            break;

        case "special" :
            rarityEs = "Especial"
            break;

        default:
            rarityEs = "Rareza invalida";
            break;
    }

    return rarityEs;
}


function translateLang(card) {
    let language = card;
    let languageES;

    switch(language) {
        case "es" : languageES = "Español" 
        break;

        case "en" : languageES = "Ingles"
        break;

        default: languageES = "Lenguaje desconocido"
        break;
    }

    return languageES;

}



function translateFoil(card) {
    let foil = card;
    let foilEs;

    switch(foil) {
        case "foil" : foilEs = "Foil" 
        break;

        case "normal" : foilEs = "No"
        break;

        case "etched" : foilEs = "Etched"
        break;

        default: foilEs = "modo desconocido"
        break;
    }

    return foilEs;

}

export {getColor, translateRarity, translateLang, translateFoil};


