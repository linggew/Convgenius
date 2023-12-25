// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
// import { createHistory } from './middleware/llm_module.js';

// import '@testing-library/jest-dom';
// const {postUserQuery, createHistory, createChat,  chooseAnswer, getChatHistory} = require('./llm_module.js');

const {postUserQuery} = require("./middleware/llm_module")


const userInput = "what is 1 + 1 ";
const prompt = " ";

(async () => {
    try {
        const result = await postUserQuery(userInput, prompt,"GPT");
        console.log("Result:", result);
    } catch (error) {
        console.error("Error:", error);
    }
})();
// Wrap your code in an async function to use await

// createChat("what is a bear", ["Apple is a company", "A brand", "null"], 0, "6572a8d22c2b012c2f694585")
//     .then(response => {
//         console.log(response.chat);
//     })
//     .catch(error => {
//         console.error('Error:', error);
//     });




// Test for chooseAnswer

// Test for chooseAnswer when historyId given
//chooseAnswer("where is my Iphone  ", ["near you"," in cs building","null"], 0, history_id = "6573d954a61795ad91ddb9b0", historyTitle = "", "6573d4a91f276c82997e9198")
// chooseAnswer("where is CIF ", ["Near G"," A place","null"], 0, history_id = "6572a8d12c2b012c2f694582", historyTitle = "", "656fd7660a975904af419a42")

// Test for chooseAnswer when historyId is not given
// chooseAnswer("where is siebel Building ", ["near Grainger"," near your home","null"], 0, historyId = -1, historyTitle = "siebel building history", "6573d4a91f276c82997e9198")

// 

// getChatHistory("656fd7660a975904af419a42")
//     .then(result => {
        
        
//         console.log(result)
//         // const lastHistory = result [result .length - 1];
//         // console.log('Last Hiistory!!!!!!!!!!!!!!!!!!!')
//         // console.log(lastHistory);
//         // console.log('chats!!!!!!!!!!!!!!!!!!!')
//         // console.log(lastHistory.chats.answer);
       

//     })
//     .catch(error => console.error('Error calling getChatHistory:', error));



// Test for getChatHistory
// async function displayChatHistory() {
//     try {
//         const histories = await getChatHistory("6573d4a91f276c82997e9198");
        
//         // Iterate over each history object and log it
//         histories.forEach((history, index) => {
//             console.log(`History ${index + 1}:`, JSON.stringify(history, null, 2));
//         });
//     } catch (error) {
//         console.error('Error in displayChatHistory:', error);
//     }
// }

// displayChatHistory();
