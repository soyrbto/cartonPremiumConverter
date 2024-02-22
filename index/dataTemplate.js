function templateVariable(data){

    let variable = 
    {   
        // Generales
        Tipo: "Variable",      
        SKU: data.sku,
        Nombre: data.name,  
        "Inventario": "",
        "Precio normal": "",
        "Categorías": "Cartas", 
        "Imágenes": data.image,
        "Superior": "",
        "Posición": "0", 
        // foil
        "Nombre del atributo 1": "Foil", 
        "Valor(es) del atributo 1": data.foil,
        "Atributo visible 1": "1",
        "Atributo global 1": "1",
        // idioma.colors
        "Nombre del atributo 2": "Idioma",
        "Valor(es) del atributo 2": data.language, 
        "Atributo visible 2": "1",
        "Atributo global 2": "1", 
        // rareza
        "Nombre del atributo 3": "Rareza",
        "Valor(es) del atributo 3": data.rarity, 
        "Atributo visible 3": "1",
        "Atributo global 3": "1",
        //Versiones
        "Nombre del atributo 4": "Version",
        "Valor(es) del atributo 4": data.versions,
        "Atributo visible 4": "1", 
        "Atributo global 4": "1",
        //Color
        "Nombre del atributo 5": "Color", 
        "Valor(es) del atributo 5":data.color,
        "Atributo visible 5": "1",
        "Atributo global 5": "1",
        //Tipo 
        "Nombre del atributo 6": "Tipo", 
        "Valor(es) del atributo 6":data.type,
        "Atributo visible 6": "1",
        "Atributo global 6": "1",
        // CMC
        "Nombre del atributo 7": "CMC", 
        "Valor(es) del atributo 7":data.cmc,
        "Atributo visible 7": "1",
        "Atributo global 7": "1",
        //meta color 
        "Meta: color":data.color,
        "Meta _color":"field_65caaaf3de76f",
        // meta cmc
        "Meta: costo_convertido_de_mana": data.cmc,
        "Meta: _costo_convertido_de_mana":"field_65caab48de770",
        //meta tipo de carta
        "Meta: tipo":data.type,
        "Meta: _tipo":"field_65caab76de772"


    }

    return variable;
}

function templateCard(data){

    let card ={   
        // Meta
        Tipo: "Variation",      
        SKU: data.sku,
        Nombre: data.name,  
        Inventario: data.quantity,
        "Precio normal": data.price,
        "Categorías": "", 
        "Imágenes": data.image,
        "Superior": data.superior,
        "Posición": "", 
        // foil
        "Nombre del atributo 1": "Foil", 
        "Valor(es) del atributo 1": data.foil,
        "Atributo visible 1": "",
        "Atributo global 1": "1",
        "Nombre del atributo 2": "Idioma",
        "Valor(es) del atributo 2": data.language, 
        "Atributo visible 2": "",
        "Atributo global 2": "1", 
        // rareza
        "Nombre del atributo 3": "Rareza",
        "Valor(es) del atributo 3": data.rarity, 
        "Atributo visible 3": "",
        "Atributo global 3": "1",
        //Versiones
        "Nombre del atributo 4": "Version",
        "Valor(es) del atributo 4": data.version, 
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
    }

    return card;
}


export {templateVariable, templateCard};