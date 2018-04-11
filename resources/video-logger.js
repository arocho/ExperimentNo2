var player = videojs("player", {
  controls: true,
  autoplay: false,
  preload: 'auto'
});

var logData = JSON.parse(logs);

player.on("timeupdate", keepTime);
var index = 0;
function keepTime() {
    console.log("player.currentTime()", player.currentTime());
}