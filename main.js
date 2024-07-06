let word = [];
let tries = 6;
let initRow = 'row_1';
let wordOfDay = ''
let isCorrect = false;
async function getWord(){
    const apiURL = 'https://words.dev-apis.com/word-of-the-day?random=1';
    try{
        const response = await fetch(apiURL);
        if(!response){
            throw new Error(`Response Status: ${response.status}`)
        }
        const json = await response.json();
        console.log(json.word)
        wordOfDay = json.word;
    }catch(err){
        console.log(error.message);
    }
}
function isLetter(letter){
    return /^[a-zA-Z]$/.test(letter);
}
function handleInput(){
    document.addEventListener('keydown',(event)=>{
            if(!isCorrect){
                let currRow = document.getElementById(initRow);
                if (!isLetter(event.key)) {
                    event.preventDefault();
                    return 0;
                }
                if(event.key != 'Backspace' && word.length<5){
                    word.push(event.key.toLocaleUpperCase());
                    currRow.children[word.length-1].innerText = event.key.toLocaleUpperCase();
                }
                // currRow.firstElementChild.innerHTML.forEach((x)=>{
                //     console.log(x.firstChild)
                // }) 
            }
    })
}
function backSpace(){
    document.addEventListener('keydown',(event)=>{
        let currRow = document.getElementById(initRow);
        if(event.key==='Backspace' && word.length != 0){
            currRow.children[word.length-1].innerText = ''
            word.pop();
        }
    })
}
async function nextRow(){
    let rowNum = 'row_1';
    let count = 1;
    document.addEventListener('keydown',async(event)=>{
        if(event.key === 'Enter' && word.length === 5 && count<=6){
            await matchWord(word.join(''));
            count += 1;
            rowNum = `row_${count}`
            initRow = rowNum;
            word =[];
        }
    })
}
function matchWord(input){
    let currRow = document.getElementById(initRow);
    const tempWord = wordOfDay.toLocaleUpperCase().split('');
    const tempWordMap = new Map();
    const tempInput = input.split('');
    const tempWordSet = new Set(tempWord);
    const correctPositions = new Array(tempWord.length).fill(false);//offal
    // First pass to mark correct positions
    for (const char of tempWord) {
        tempWordMap.set(char, (tempWordMap.get(char) || 0) + 1);
    }
    console.log('tempWordMap',tempWordMap)
    for (let i = 0; i < tempWord.length; i++) {//ffooa
        if (tempWord[i] === tempInput[i]) {
            currRow.children[i].classList.add('correct');
            correctPositions[i] = true;
            tempWordMap.set(tempWord[i], tempWordMap.get(tempWord[i]) - 1);
        }
    }

    for (let i = 0; i < tempWord.length; i++) {
        if (!correctPositions[i]) {
            if (!tempWordMap.has(tempInput[i]) || tempWordMap.get(tempInput[i]) === 0) {
                currRow.children[i].classList.add('wrong');
            } else {
                currRow.children[i].classList.add('close');
                tempWordMap.set(tempInput[i], tempWordMap.get(tempInput[i]) - 1);
            }
        }
    }
    
    if(input === wordOfDay.toLocaleUpperCase()){
        alert(`You've Won!`);
        isCorrect = true;
        return true;
    }else{
        tries -= 1;
        if(tries === 0){
           if(confirm('You have exceeded 6 attempts of guessing. Do you want to try again?')){
                location.reload();
           }
        }
    }
}
function getResult(input,word){
    if(input===word.toLocaleUpperCase())
        return true
}
function isDuplicate(input_array){
    let unique = new Set();  // O(1)
    let duplicated_element = [];  // O(1)
    for (let i = 0; i < input_array.length; i++) {  // O(n)
        if (unique.has(input_array[i])) {  // O(1)
            duplicated_element.push(input_array[i]);  // O(1)
        }
        unique.add(input_array[i]);  // O(1)
    }
    return Array.from(new Set(duplicated_element));  // O(n)
}
function deleteDupli(arr,element){
    let index = arr.indexOf(element);
    arr.splice(index,1)

    return arr;
}
async function init(){
    await getWord();
    nextRow();
    handleInput();
    backSpace();
}

init();