

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
    let rarity = card.Rarity;
    let rarityEs=""; 

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
            rarityEs = "Rareza invalida";
            break;
    }

    return rarityEs;
}


function translateLang(card) {
    let language = card.language;
    let languageES;

    switch(language) {
        case "es" : languageES = "español" 
        break;

        case "en" : languageES = "Ingles"
        break;

        default: languageES = "Lenguaje desconocido"
        break;
    }

}

export {getColor, translateRarity, translateLang};


