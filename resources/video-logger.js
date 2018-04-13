var player = videojs("player", {
  controls: true,
  autoplay: false,
  preload: 'auto'
});

var logData = JSON.parse(logs);
var timestamps = Object.keys(logData);
console.log(timestamps);
var timestampIndex = 0;

var unorderedListElement = document.getElementsByClassName("logList")[0];

player.on("timeupdate", keepTime);

function keepTime() {
    var currentTimestamp = timestamps[timestampIndex];
    var inSeconds = convertTimestampToSeconds(currentTimestamp);
    console.log(inSeconds);
    if(player.currentTime() > inSeconds) {
        console.log(inSeconds);
        var actionText = logData[currentTimestamp];
        var listElement = document.createElement("li");
        listElement.innerHTML = currentTimestamp + " - " +actionText;
        unorderedListElement.appendChild(listElement);
        timestampIndex++;
    }
}

function convertTimestampToSeconds(timestamp) {
    //4:32
    var timeArray = timestamp.split(":");
    var seconds = parseInt(timeArray[1]) + parseInt(timeArray[0] * 60);
    return seconds;
}