var mydata;
var listOfActions;
var listOfEntityTypes = [];
var listText= "";

var defaultOption = document.createElement("option");
defaultOption.text = "select entity";
defaultOption.value = "select";

function loadData() {
    mydata = JSON.parse(content);
    listOfActions = mydata.actions;
}

function findParameters(action) {
    for (var i = 0; i < listOfActions.length; i++) {
        if (listOfActions[i].verb == action) {
            console.log("Found this action");
            console.log(listOfActions[i].parameters);
            return listOfActions[i].parameters;
        }
    }
    return null;
}

function constructSelect(listOfGameObjects) {
    var sentenceSelect = document.createElement("select");
    sentenceSelect.className = "listOfGameObjects";
    sentenceSelect.setAttribute("id", "listOfGameObjects");
    sentenceSelect.add(defaultOption);
    for (var i = 0; i < listOfGameObjects.length; i++) {
        var option = document.createElement("option");
        //text
        option.text = listOfGameObjects[i];
        option.value = listOfGameObjects[i];
        //image
        var imgSrc = "./resources/Sprites/" + listOfGameObjects[i] + ".png";
        option.setAttribute("data-img-src", imgSrc);
        sentenceSelect.add(option);
    }
    return sentenceSelect;
}

function gatherSentenceParts(action) {
    var firstParameter = "";
    var secondParameter = "";
    var preposition = "";
    var firstParameterSelect = null;
    var secondParameterSelect = null
    var isComplexSentence = false;

    var parameterList = findParameters(action);
    firstParameter = parameterList[0];

    if (action == "Look at") {
        if(listOfEntityTypes.length == 0) {
            setListOfEntityTypes();
        }
        firstParameterSelect = constructSelect(listOfEntityTypes);
    }
    else {
        firstParameterSelect = constructSelect(mydata[firstParameter]);
    }

    if (parameterList.length > 1) {
        isComplexSentence = true;
        console.log("Parameter list greater than one");
        if(action == "Use") {      
            preposition = "with";

            if(listOfEntityTypes.length == 0) {
                setListOfEntityTypes();
            }
            secondParameterSelect = constructSelect(listOfEntityTypes);
        }
        else {
            preposition = "to";

            secondParameter = parameterList[1];
            secondParameterSelect = constructSelect(mydata[secondParameter]);
        }
    }
    buildSentenceHTMLelements(action, preposition, firstParameterSelect, isComplexSentence, secondParameterSelect);  
}

function setListOfEntityTypes(){
    var itemList = mydata["item"];
    var characterList = mydata["character"];
    var entranceList = mydata["entrance"];
    listOfEntityTypes = itemList.concat(characterList).concat(entranceList);
}

function buildSentenceHTMLelements(action, preposition, firstParameterSelect, 
                                isComplexSentence, secondParameterSelect) {
    var sentenceContainer = document.createElement("div");
    sentenceContainer.className = "sentenceContainer";
    var textContainer = document.createElement("span");
    textContainer.className = "sentence";
    sentenceContainer.appendChild(textContainer);
    textContainer.appendChild(document.createTextNode(action + " "));
    textContainer.appendChild(firstParameterSelect);

    if(isComplexSentence) {
        textContainer.appendChild(document.createTextNode(" " + preposition + " "));
        textContainer.appendChild(secondParameterSelect);
    }
    insertHTMLsentence(sentenceContainer);
}

function insertHTMLsentence(sentence) {
    var sentenceContainerElement = document.getElementsByClassName("sentenceContainer")[0];
    sentenceContainerElement.parentNode.replaceChild(sentence, sentenceContainerElement);
}

function addAction() {
    var sentenceSpanElement = document.getElementsByClassName("sentence")[0];
    if (sentenceSpanElement) {
        var sentenceContentArray = sentenceSpanElement.childNodes;
        var allTextSentence = "";
        for (var i = 0; i < sentenceContentArray.length; i++) {
            if (i % 2 == 0) {
                var textNodeData = sentenceContentArray[i].data;
                allTextSentence += textNodeData;
            }
            else {
                var selectValue = sentenceContentArray[i].value;
                if(selectValue == "select") {
                    alert("Please select an entity.");
                    return;
                }
                allTextSentence += selectValue;
            }
        }
        var addedActionText = document.createElement("li");
        addedActionText.className = "addedActionText";
        addedActionText.innerHTML = allTextSentence;

        var listItemRemover = document.createElement("i");
        listItemRemover.className = "js-remove"
        listItemRemover.innerHTML = "✖"
        addedActionText.appendChild(listItemRemover);

        document.getElementsByClassName("addedActionsList")[0].appendChild(addedActionText);
        sentenceSpanElement.parentNode.removeChild(sentenceSpanElement);
    }
    else {
        alert("Please select an action first.");
    }        
}

//Concatenate predicted actions, 
//store on local storage, 
//then insert into one downloadable file 
//after completing the last video's predictions
//Loads next video, and disables the button (until video end)
function submitActions() {
    var addedActionsList = document.getElementsByClassName("addedActionsList")[0];
    if(addedActionsList.childElementCount == 0) {
        alert("Please add an action");
        return;
    }
    
    if(loadedAllVideos && confirm("Submit and Finish?")) {
        var participantIDfield = document.getElementsByClassName("participantIDfield")[0];
        var participantIDfieldValue = participantIDfield.value;
        if (participantIDfieldValue == "Participant ID" || participantIDfieldValue == "") {
            alert("Please enter a participant ID before submitting.");
            return;
        }
        
        appendToListText();
             
        //Should happen only after 5th video
        var textFile = null,
        makeTextFile = function (text) {
            var data = new Blob([text], {type: 'text/plain', endings: 'native'});

            // If we are replacing a previously generated file we need to
            // manually revoke the object URL to avoid memory leaks.
            if (textFile !== null) {
              window.URL.revokeObjectURL(textFile);
            }
            textFile = window.URL.createObjectURL(data);
            return textFile;
        };

        var link = document.getElementById('downloadLink');
        link.setAttribute("download", participantIDfieldValue + ".txt");
        link.href = makeTextFile(listText);
        link.style.display = 'block';
        document.getElementById("submitAction").disabled = "true";
    }
    
    if (!loadedAllVideos) {
        if(confirm("Submit list of actions and go to next video?")) {

            appendToListText();

            var addedActionsList = document.getElementsByClassName("addedActionsList")[0];
            while(addedActionsList.firstChild) {
                addedActionsList.removeChild(addedActionsList.firstChild);
            }
            loadNextVideo(videoIds, videoLengths);
        }
    }
}

function appendToListText() {
    var listData = document.getElementsByClassName("addedActionText");
    listText += videoIdAndLength[0] + ", " + videoIdAndLength[1] + ", ";

    if (listData) {
        for (var i = 0; i < listData.length; i++) {
            listText += listData[i].firstChild.data;
            if(i != (listData.length-1))
                listText += ", ";
        }
        listText += "\n";
    }
}
