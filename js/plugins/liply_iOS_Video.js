(function(){
    var waitForLoading = false;
    var register = false;
    
    function handleTouch(ev){
        if(Graphics._video.paused && Graphics.isVideoPlaying())Graphics._video.play();
    }
    
    var _Graphics_playVideo = Graphics.playVideo;
    Graphics.playVideo = function(){
        _Graphics_playVideo.apply(this, arguments);
        waitForLoading = true;

        if(!register){
            register = true;
            document.addEventListener('touchstart', handleTouch);
        }
    };


    var _Graphics_onVideoLoad = Graphics._onVideoLoad;
    Graphics._onVideoLoad = function() {
        _Graphics_onVideoLoad.apply(this, arguments);
        waitForLoading = false;
    };
    
    var _Graphics_onVideoEnd = Graphics._onVideoEnd;
    Graphics._onVideoEnd = function(){
        _Graphics_onVideoEnd.apply(this, arguments);

        if(register){
            document.removeEventListener('touchstart', handleTouch);
            register = false;
        }
    };

    var _Graphics_isVideoPlaying = Graphics.isVideoPlaying;
    Graphics.isVideoPlaying = function() {
        return waitForLoading || _Graphics_isVideoPlaying.apply(this, arguments);
    };
})();