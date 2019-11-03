/*:
 * @plugindesc Print copyable detailed error
 * @author liply
 *
 * @help
 * Print copyable detailed error.
 */

(function(){
    function sanitize(str){
        return str.toString().replace(/[&<>]/g, function(t){
            return {'&': '&amp;', '<': '&lt;', '>': '&gt;'}[t];
        });
    }

    function applyStyle(tag, styles){
        for(var style in styles){
            if(styles.hasOwnProperty(style)){
                tag.style[style] = styles[style].toString();
            }
        }
    }

    function showDetailedError(error){
        var tag = document.createElement('div');
        tag.id = 'ErrorDetail';
        tag.innerHTML = sanitize(error.message) + '<br><br>' + sanitize(error.stack);

        var styles = {
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            margin: 'auto',
            width: '70%',
            height: '50%',
            overflowY: 'scroll',
            zIndex: 10,
            color: 'white',
            textAlign: 'center'
        };

        var wrapperStyles = {
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            margin: 'auto',
            width: '90%',
            height: '90%',
            backgroundColor: 'rgba(0,0,0,0.3)',
            zIndex: 10,
            webkitUserSelect: 'text'
        };

        var wrapper = document.createElement('div');

        applyStyle(tag, styles);
        applyStyle(wrapper, wrapperStyles);

        wrapper.appendChild(tag);
        document.body.appendChild(wrapper);
    }

    SceneManager.onError = function(e) {
        console.error(e.message);
        console.error(e.filename, e.lineno);
        try {
            this.stop();
            showDetailedError(e);
            AudioManager.stopAll();
        } catch (e2) {
        }
    };

    SceneManager.catchException = function (e){
        if (e instanceof Error) {
            showDetailedError(e);
        } else {
            Graphics.printError('UnknownError', e);
        }
        AudioManager.stopAll();
        this.stop();
    }
})();