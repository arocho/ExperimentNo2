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

var participantIds = [183629513, 594492560, 606449569, 1236709656, 2032131568];
var videoLengths = [1, 2, 3, 4, 5];


function selectRandomVideo(participantIds, videoLengths) {
    shuffle(participantIds);
    shuffle(videoLengths);

    var participantId = participantIds.pop();
    var videoLength = videoLengths.pop();
    
    var videoPath = "./videos/" + participantId + "/" + participantId + "_" + videoLength + "_mins.mp4";
    console.log(videoPath);
    return videoPath;
}

player.src( selectRandomVideo(participantIds, videoLengths) );

player.on('ended', function() {
    if(participantIds.length != 0) {
        alert("Loaded video " + (6-participantIds.length) + " out of 5.");
        player.src( selectRandomVideo(participantIds, videoLengths) );
        player.load();
    }
});
