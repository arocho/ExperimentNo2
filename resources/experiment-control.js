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

var videoIds = [183629513, 594492560, 606449569, 1236709656, 2032131568];
var videoLengths = [1, 2, 3, 4, 5];


function selectRandomVideo(videoIds, videoLengths) {
    shuffle(videoIds);
    shuffle(videoLengths);

    var videoId = videoIds.pop();
    var videoLength = videoLengths.pop();
    
    var videoPath = "./videos/" + videoId + "/" + videoId + "_" + videoLength + "_mins.mp4";
    console.log(videoPath);
    return videoPath;
}

player.src( selectRandomVideo(videoIds, videoLengths) );

function loadNextVideo(videoIds, videoLengths) {
    if(videoIds.length != 0) {
        var logListElement = document.getElementsByClassName("logList")[0];
        while(logListElement.firstChild){
            logListElement.removeChild(logListElement.firstChild);
        }
        player.src( selectRandomVideo(videoIds, videoLengths) );
        player.load();
        alert("Loaded video " + (5-videoIds.length) + ". Scroll up. Watch. Predict.");
    }
}
