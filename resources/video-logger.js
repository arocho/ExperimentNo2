var player = videojs("player", {
  controls: true,
  autoplay: false,
  preload: 'auto'
});

var logData = JSON.parse(logs);
var timestamps = Object.keys(logData);
var timestampIndex = 0;

var unorderedListElement = document.getElementsByClassName("logList")[0];

player.on("timeupdate", keepTime);

function keepTime() {
    var currentTimestamp = timestamps[timestampIndex];
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
