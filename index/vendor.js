import axios from "axios";

let requestCount = 0;
let startTime = Date.now();

async function getInfo(scryfallId){
    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `https://api.scryfall.com/cards/${scryfallId}`,
        headers: { }
    };

    requestCount++;
    const currentTime = Date.now();
    if (currentTime - startTime > 1000) { 
        console.log(`Requests in the last second: ${requestCount}`);
        requestCount = 1; 
        startTime = currentTime; 
    }

    // Define maximum retries and initial backoff delay.
    const maxRetries = 5;
    let retryDelay = 500; // Start with half a second delay

    for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
            let cardData = await axios.request(config);
            return cardData.data;
        } catch (error) {
            console.error(`Attempt ${attempt + 1}:`, error.message);
            // If the maximum number of retries has been reached, throw the error.
            if (attempt >= maxRetries - 1) {
                throw error;
            }
            console.log(`Retrying in ${retryDelay}ms...`);
            // Wait for the specified delay before trying again.
            await new Promise(resolve => setTimeout(resolve, retryDelay));
            // Increase the delay for the next attempt (exponential backoff).
            retryDelay *= 2;
        }
    }
}



export {getInfo};