/*:
 * @plugindesc liply_Controller
 * @author liply
 *
 * @help
 * v1.0.6 押しっぱなしによる進みっぱなしを抑制
 * v1.0.5 preventDefaultをさらに強化
 * v1.0.4 preventDefault強化
 * v1.0.3 Controller利用時、PointerEventによるキャンセルを抑制
 * v1.0.2 メッセージ表示時のコントローラを裏に回す処理の安定化
 * v1.0.1 コントローラを裏に回す時、落ちるバグを修正
 * v1.0.0
 *
 * @param Show in PC
 * @default off
 */
(function () {
'use strict';

function contains(str, target){
    return str.indexOf(target) !== -1;
}

var Vector2 = function Vector2(x, y){
    this.x = x;
    this.y = y;
};

Vector2.fromEvent = function fromEvent (ev){
    return new Vector2(ev.pageX, ev.pageY);
};

Vector2.prototype.mag = function mag (){
    return Math.sqrt(this.x*this.x + this.y*this.y);
};

Vector2.prototype.sub = function sub (other){
    return new Vector2(this.x - other.x, this.y - other.y);
};

Vector2.prototype.norm = function norm (){
    var mag = this.mag();
    if(mag === 0) return new Vector2(0,0);
    else return new Vector2(this.x / mag, this.y / mag);
};

function resolveOrigin(style, scale, config){
    var origin = config.origin;
    if(contains(origin, 'top')){
        style.top = config.y * scale + 'px';
    }
    if(contains(origin, 'bottom')){
        style.bottom = config.y * scale + 'px';
    }
    if(contains(origin, 'left')){
        style.left = config.x * scale + 'px';
    }
    if(contains(origin, 'right')){
        style.right = config.x * scale + 'px';
    }
}

var VirtualButton = function VirtualButton(config){
    var this$1 = this;

    var div = document.createElement('div');

    this._div = div;
    this._config = config;
    this._scale = 1;
    this._buttonName = config.name;

    this.setStyle(div, this._scale, config);

    this._resizeHandler = function (){
        this$1.setStyle(div, this$1._scale, config);
        this$1.touchCancel(null);
    };
};

VirtualButton.prototype.setScale = function setScale (scale){
    this._scale = scale;
    this.setStyle(this._div, scale, this._config);
};

VirtualButton.prototype.setStyle = function setStyle (div, scale, config){
    div.id = config.id;
    Object.assign(div.style, {
        position: 'fixed',
        width: config.size * this._scale + 'px',
        height: config.size * this._scale + 'px',
        userSelect: 'none',
        pointerEvents: 'none',
        zIndex: '11',
        backgroundSize: 'cover',
        backgroundImage: ("url(\"img/system/" + (config.image) + ".png\")"),
    });

    resolveOrigin(div.style, scale, config);
};

VirtualButton.prototype.show = function show (){
//    this.touchCancel(null);
    this._div.style.zIndex = '11';
};

VirtualButton.prototype.hide = function hide (){
//    this.touchCancel(null);
    this._div.style.zIndex = '0';
};

VirtualButton.prototype.getRelativePosition = function getRelativePosition (pos){
    var bounds = this._div.getBoundingClientRect();
    var x = bounds.left + bounds.width/2;
    var y = bounds.top + bounds.height/2;

    return new Vector2(pos.x - x,pos.y - y);
};

VirtualButton.prototype.getRadius = function getRadius (){
    var bounds = this._div.getBoundingClientRect();
    return Math.max(bounds.width, bounds.height) / 2;
};

VirtualButton.prototype.isHit = function isHit (pos) {
    var d = this.getRelativePosition(pos);
    var distance = d.mag();

    return distance < this.getRadius();
};

VirtualButton.prototype.applyState = function applyState (state){
    if(this._buttonName === 'dash'){
        this.applyDash(state);
    }else{
        this.applyNormal(state);
    }
};

VirtualButton.prototype.applyDash = function applyDash (state){
    switch(this._state){
        case 'neutral':
            if(this._pressed && this.isAnyDir(state)){
                state['shift'] = true;
                this._state = 'dash';
            }else if(this._released){
                this._released = false;
                state['escape'] = true;
                this._state = 'trigger';
            }
            break;

        case 'dash':
            if(this._released){
                state['shift'] = false;
                this._released = false;
                this._state = 'neutral';
            }
            break;

        case 'trigger':
            state['escape'] = false;
            this._state = 'neutral';
            break;

        default:
            this._state = 'neutral';
    }
};

VirtualButton.prototype.isAnyDir = function isAnyDir (state){
    return state['left'] || state['right'] || state['up'] || state['down'];
};

    VirtualButton.prototype.applyNormal = function applyNormal (state){
    if(this._pressed && !state[this._buttonName]){
        state[this._buttonName] = this._pressed;
    }

    if(this._released){
        this._released = false;
        state[this._buttonName] = false;
    }
};

VirtualButton.prototype.attach = function attach (div){
    div.appendChild(this._div);
    window.addEventListener('resize', this._resizeHandler);
};

VirtualButton.prototype.detach = function detach (div){
    div.removeChild(this._div);
    window.removeEventListener('resize', this._resizeHandler);
};

VirtualButton.prototype.touchStart = function touchStart (ev){
        var this$1 = this;

    Array.prototype.forEach.call(ev.changedTouches, function (touch){
        var pos = Vector2.fromEvent(touch);
        if(this$1.isHit(pos)){
            this$1._inputPosition = pos;
            this$1._pressed = true;
            this$1._touchId = touch.identifier;
            this$1._released = false;
        }
    });

    return this._pressed;
};

VirtualButton.prototype.touchMove = function touchMove (ev){
        var this$1 = this;

    return Array.prototype.some.call(ev.changedTouches, function (touch){ return touch.identifier === this$1._touchId; });
};

VirtualButton.prototype.touchEnd = function touchEnd (ev){
        var this$1 = this;

    if(this._pressed){
        Array.prototype.forEach.call(ev.changedTouches, function (touch){
            if(this$1._touchId === touch.identifier){
                this$1._pressed = false;
                this$1._touchId = null;

                this$1._released = true;
            }
        });
        return this._released;
    }

    return false;
};

VirtualButton.prototype.touchCancel = function touchCancel (ev){
    this._pressed = false;
    this._released = true;
    return false;
};

VirtualButton.prototype.mouseDown = function mouseDown (ev){
    if(ev.button === 0 && this.isHit(Vector2.fromEvent(ev))){
        this._pressed = true;
        this._released = false;
    }

    return this._pressed;
};

VirtualButton.prototype.mouseMove = function mouseMove (ev){
    return this._pressed;
};

VirtualButton.prototype.mouseUp = function mouseUp (ev){
    if(this._pressed && ev.button === 0){
        this._pressed = false;
        this._released = true;
        return true;
    }

    return false;
};

var VirtualStick = (function (VirtualButton) {
    function VirtualStick(config){
        VirtualButton.call(this, config);
        this._play = config.play;
        this._relative = config.relative;
    }

    if ( VirtualButton ) VirtualStick.__proto__ = VirtualButton;
    VirtualStick.prototype = Object.create( VirtualButton && VirtualButton.prototype );
    VirtualStick.prototype.constructor = VirtualStick;

    VirtualStick.prototype.getDirection4 = function getDirection4 (pos) {
        var d;
        if(this._relative){
            d = this._inputPosition.sub(this.getRelativePosition(pos));
        }else{
            d = this.getRelativePosition(pos);
        }

        var distance = d.mag();
        if (distance < this._play * this.getRadius()) return null;

        var n = d.norm();
        var check = Math.sqrt(1 / 2);

        if (check < n.x) return 6;
        if (-check > n.x) return 4;
        if (check < n.y) return 2;
        if (-check > n.y) return 8;
        return null;
    };

    VirtualStick.prototype.applyState = function applyState (state){
        if(this._pressed || this._released){
            state['left'] = state['right'] = state['up'] = state['down'] = false;
            this._released = false;
        }

        switch(this._dir){
            case 2:
                state['down'] = true;
                break;
            case 8:
                state['up'] = true;
                break;

            case 4:
                state['left'] = true;
                break;
            case 6:
                state['right'] = true;
                break;
        }
    };

    VirtualStick.prototype.touchStart = function touchStart (ev){
        if(VirtualButton.prototype.touchStart.call(this, ev)){
            this._dir = this.getDirection4(this._inputPosition);
            return true;
        }

        return false;
    };

    VirtualStick.prototype.touchMove = function touchMove (ev){
        var this$1 = this;

        if(VirtualButton.prototype.touchMove.call(this, ev)){
            var touchEvent = null;
            for(var n = 0; n < ev.changedTouches.length; ++n){
                touchEvent = ev.changedTouches[n];
                if(touchEvent.identifier === this$1._touchId){
                    this$1._dir = this$1.getDirection4(Vector2.fromEvent(touchEvent));
                    return true;
                }
            }
        }

        return false;
    };

    VirtualStick.prototype.touchEnd = function touchEnd (ev){
        if(VirtualButton.prototype.touchEnd.call(this, ev)){
            this._dir = null;
            return true;
        }

        return false;
    };

    VirtualStick.prototype.mouseDown = function mouseDown (ev){
        if(VirtualButton.prototype.mouseDown.call(this, ev)){
            this._dir = this.getDirection4(Vector2.fromEvent(ev));
            return true;
        }

        return false;
    };

    VirtualStick.prototype.mouseMove = function mouseMove (ev){
        if(VirtualButton.prototype.mouseMove.call(this, ev)){
            this._dir = this.getDirection4(Vector2.fromEvent(ev));
            return true;
        }

        return false;
    };

    VirtualStick.prototype.mouseUp = function mouseUp (ev){
        if(VirtualButton.prototype.mouseUp.call(this, ev)){
            this._dir = null;
            return true;
        }

        return false;
    };

    return VirtualStick;
}(VirtualButton));

var VirtualController = function VirtualController(config, scale){
    this._buttons = config.buttons.map(function (button){ return new VirtualButton(button); });
    this._stick = new VirtualStick(config.stick);

    this._buttons.forEach(function (button){ return button.attach(document.body); });
    this._stick.attach(document.body);
    this._allButtons = [this._stick].concat(this._buttons);

    this.setScale(scale);
    this._delegateEventHandlers();
};

VirtualController.prototype.setScale = function setScale (scale){
    this._allButtons.forEach(function (button){ return button.setScale(scale); });
};

VirtualController.prototype.detach = function detach (){
    this._allButtons.forEach(function (button){ return button.detach(); });
};

VirtualController.prototype.applyState = function applyState (state){
    this._allButtons.forEach(function (button){ return button.applyState(state); });
};

VirtualController.prototype.show = function show (){
    this._allButtons.forEach(function (button){ return button.show(); });
};

VirtualController.prototype.hide = function hide (){
    this._allButtons.forEach(function (button){ return button.hide(); });
};

VirtualController.prototype._delegateEventHandlers = function _delegateEventHandlers (){
        var this$1 = this;

    [
        'touchStart', 'touchMove', 'touchEnd', 'touchCancel',
        'mouseDown', 'mouseMove', 'mouseUp',
    ].forEach(function (name){
        this$1[name] = function (ev){
            var result = this$1._allButtons.map(function (button){ return button[name](ev); });
            var processed = result.some(function (value){ return value; });
            // if(processed)ev.preventDefault();
            ev.preventDefault();

            return processed;
        }
    });
};

var controllerUrl = 'data/Controller.json';
var controller;

var pluginParameters = PluginManager.parameters('liply_Controller');
var showInPC = (pluginParameters['Show in PC'] || 'on').toLowerCase() === 'on';

function isControllerEnabled(){
    return Utils.isMobileDevice() || showInPC
}


var DataManager_loadDatabase =  DataManager.loadDatabase;
DataManager.loadDatabase = function(){
    DataManager_loadDatabase.call(this);

    if(isControllerEnabled()){
        var xhr = new XMLHttpRequest();
        xhr.open('GET', controllerUrl);
        xhr.overrideMimeType('application/json');
        xhr.onload = function (){
            if(xhr.status < 400){
                controller = new VirtualController(JSON.parse(xhr.responseText), Graphics._realScale);
            }
        };
        xhr.onerror = function (){
            DataManager._errorUrl = DataManager._errorUrl || controllerUrl;
        };
        xhr.send();
    }
};

var Window_Message_prototype_startMessage = Window_Message.prototype.startMessage;
Window_Message.prototype.startMessage = function(){
    if(controller && $gameMessage.positionType() === 2){
        controller.hide();
    }
    Window_Message_prototype_startMessage.apply(this, arguments);
};


var Window_Message_prototype_terminateMessage = Window_Message.prototype.terminateMessage;
Window_Message.prototype.terminateMessage = function(){
    if(controller && $gameMessage.positionType() === 2){
        controller.show();
    }
    Window_Message_prototype_terminateMessage.apply(this, arguments);
};

var DataManager_isDatabaseLoaded = DataManager.isDatabaseLoaded;
DataManager.isDatabaseLoaded = function(){
    if(isControllerEnabled())return !!controller && DataManager_isDatabaseLoaded.call(this);
    else return DataManager_isDatabaseLoaded.call(this);
};

var Input_update = Input.update;
Input.update = function(){
    if(controller) controller.applyState(this._currentState);
    Input_update.call(this);
};

var Graphics_updateRealScale = Graphics._updateRealScale;
Graphics._updateRealScale = function(){
    Graphics_updateRealScale.call(this);
    if(controller)controller.setScale(Graphics._realScale);
};

var events = {
    _onMouseDown: 'mouseDown',
    _onMouseUp: 'mouseUp',
    _onMouseMove: 'mouseMove',
    _onTouchStart: 'touchStart',
    _onTouchMove: 'touchMove'
};

var passEvents = {
    _onTouchEnd: 'touchEnd',
    _onTouchCancel: 'touchCancel'
};

Object.keys(events).forEach(function (key){
    var handlerName = events[key];
    var oldHandler = TouchInput[key];

    TouchInput[key] = function(ev){
        if(!(controller && controller[handlerName](ev))){
            oldHandler.call(this, ev);
        }
    }
});

Object.keys(passEvents).forEach(function (key){
    var handlerName = passEvents[key];
    var oldHandler = TouchInput[key];

    TouchInput[key] = function(ev){
        controller && controller[handlerName](ev);
        oldHandler.call(this, ev);
    }
});




var TouchInput_onPointerDown = TouchInput._onPointerDown;
TouchInput._onPointerDown = function(event) {
    if(!isControllerEnabled())
        TouchInput_onPointerDown.call(this, event);
};

if (typeof Object.assign != 'function') {
    (function () {
        Object.assign = function (target) {
            'use strict';
            var arguments$1 = arguments;

            if (target === undefined || target === null) {
                throw new TypeError('Cannot convert undefined or null to object');
            }

            var output = Object(target);
            for (var index = 1; index < arguments.length; index++) {
                var source = arguments$1[index];
                if (source !== undefined && source !== null) {
                    for (var nextKey in source) {
                        if (Object.prototype.hasOwnProperty.call(source, nextKey)) {
                            output[nextKey] = source[nextKey];
                        }
                    }
                }
            }
            return output;
        };
    })();
}

}());