var player = videojs("player", {
  controls: true,
  autoplay: false,
  preload: 'auto'
});

var videoIds = ["apples", "bananas", "cherries", "durians", "mangos"];
var videoLengths = [1, 2, 3, 4, 5];
var loadedAllVideos = false;

// Load the first video
var videoIdAndLength = selectRandomVideo(videoIds, videoLengths);
var videoPath = videoIdToPath(videoIdAndLength[0], videoIdAndLength[1]);
player.src(videoPath);
var logData = JSON.parse(logs);
logData = logData[videoIdAndLength[0]];
var timestamps = Object.keys(logData);
var timestampIndex = 0;

var unorderedListElement = document.getElementsByClassName("logList")[0];

player.on("timeupdate", keepTime);

function keepTime() {
    var currentTimestamp = timestamps[timestampIndex];
    
    if (currentTimestamp == undefined)
        return;
    
    var inSeconds = convertTimestampToSeconds(currentTimestamp);
    if(player.currentTime() > inSeconds) {
        var actionText = logData[currentTimestamp];
        var listElement = document.createElement("li");
        listElement.className = "timestamp";
        listElement.innerHTML = currentTimestamp + " - " +actionText;
        unorderedListElement.appendChild(listElement);
        timestampIndex++;
    }
}

function convertTimestampToSeconds(timestamp) {
    var timeArray = timestamp.split(":");
    var seconds = parseInt(timeArray[1]) + parseInt(timeArray[0] * 60);
    return seconds;
}

function shuffle(array) {
   var j, x, i;
   for (i = array.length - 1; i > 0; i--) {
       j = Math.floor(Math.random() * (i + 1));
       x = array[i];
       array[i] = array[j];
       array[j] = x;
   }
   return array;
}

// returns array of video id, video length
function selectRandomVideo(videoIds, videoLengths) {
    shuffle(videoIds);
    shuffle(videoLengths);
    var videoId = videoIds.pop();
    var videoLength = videoLengths.pop();
    
    if(videoIds.length == 0) {
        loadedAllVideos = true;
        var submitActionsButton = document.getElementById("submitAction");
        submitActionsButton.value = "Submit Actions and Participant ID";
        var participantIDfield = document.getElementsByClassName("participantIDfield")[0];
        participantIDfield.style.display = 'block';
    }
    
    return [videoId, videoLength];
}

function videoIdToPath(videoId, videoLength) {
    return "./videos/" + videoId + "/" + videoId + "_" + videoLength + "_mins.mp4";
}

function loadNextVideo(videoIds, videoLengths) {
    if(videoIds.length != 0) {
        var logListElement = document.getElementsByClassName("logList")[0];
        while(logListElement.firstChild){
            logListElement.removeChild(logListElement.firstChild);
        }
        
        videoIdAndLength = selectRandomVideo(videoIds, videoLengths);
        var videoPath = videoIdToPath(videoIdAndLength[0], videoIdAndLength[1]);
        player.src(videoPath);
        
        logData = JSON.parse(logs);
        logData = logData[videoIdAndLength[0]];
        timestamps = Object.keys(logData);
        timestampIndex = 0;
    
        alert("Loaded video " + (5-videoIds.length) + ". Scroll up. Watch. Predict.");
    }
}

