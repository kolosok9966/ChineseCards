const inputFile = document.getElementById("inputFile");

const wordColumn = document.getElementById("wordColumn");
const hintColumn = document.getElementById("hintColumn");
const translationColumn = document.getElementById("translationColumn");
const startRow = document.getElementById("startRow");
const endRow = document.getElementById("endRow");

const questionField = document.getElementById("questionField");
const hintButton = document.getElementById("hintButton");
const dontKnowButton = document.getElementById("dontKnowButton");
const answerField = document.getElementById("answerField");

const wordsField = document.getElementById("wordsField");
const hintsField = document.getElementById("hintsField");
const translationsField = document.getElementById("translationsField");

class Word {
  constructor(word, hint, translation) {
    this.word = word;
    this.hint = hint;
    this.translation = translation;
  }
}

const wordsArray = [];
var counter=0;

inputFile.addEventListener("change", function (e) {
  var file = e.target.files[0];
  if (file) {
    var reader = new FileReader();
    reader.onload = function (e) {
      var data = new Uint8Array(e.target.result);
      var workbook = XLSX.read(data, { type: "array" });
      var sheetName = workbook.SheetNames[0];
      var worksheet = workbook.Sheets[sheetName];
      var word="";
      var hint="";
      var translation="";
      var i=startRow.value;
      while (i<=endRow) {
        word = worksheet[wordColumn.value+i] ? worksheet[wordColumn.value + i].v : "";;
        hint = worksheet[hintColumn.value+i]  ? worksheet[hintColumn.value + i].v : "";;
        translation = worksheet[translationColumn.value+i]  ? worksheet[translationColumn.value + i].v : "";;
        i++;
        console.log(word);
        wordsArray.push(new Word(word, hint, translation));
      } 
      StartRound();
    };
    reader.readAsArrayBuffer(file);
  }
}
);

function StartRound() {
  if (counter < wordsArray.length) {
    if(wordsArray[counter].translation===""||wordsArray[counter].word==="")
    {
      counter+=1;
      StartRound();
    }
    else{
    questionField.value = counter+1+"/"+wordsArray.length + " "+ wordsArray[counter].translation;
    }
  } else {
    questionField.value = "Игра закончилась"+ counter;
  }
}

answerField.addEventListener("input", () => {
  const inputValue = answerField.value;
  if (inputValue === wordsArray[counter].word + " ") {
    const synth = window.speechSynthesis;
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(wordsArray[counter].word);
      utterance.lang = "zh-CN";
      synth.speak(utterance);
    }
    counter = counter + 1;
    answerField.value = "";
    StartRound();
  }
});

dontKnowButton.addEventListener("click", () => {
  if (counter < wordsArray.length) {
    wordsField.value+=wordsArray[counter].word+"\n";
    hintsField.value+=wordsArray[counter].hint+"\n";
    translationsField.value+=wordsArray[counter].translation+"\n";
    answerField.value = "";
    counter+=1;
    StartRound();
  }
});

hintButton.addEventListener("click", () => {
    if (counter < wordsArray.length) {
      questionField.value+= " "+wordsArray[counter].hint;
    }
  });
