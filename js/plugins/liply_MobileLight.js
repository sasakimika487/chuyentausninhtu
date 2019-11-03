
//=============================================================================
/*:
 * @plugindesc v1.1.1 Creates an extra layer that darkens a map and adds lightsources!
 * @author original: Terrax heavily rewritten by liply
 *
 * @param Player Radius
 * @desc Adjust the light radius around the player
 * Default: 300
 * @default 300
 *
 * @param Reset Lights
 * @desc Resets the light switches each map
 * Default: No
 * @default No
 *
 * @param Save DaynightCycle
 * @desc Game variable the time of day (0-23) can be stored in
 * Default: 0
 * @default 0
 * 
 * @param Max Light Cache
 * @desc amount of Light Cache
 * Default: 30
 * @default 30
 * @help
 * To activate the script in an area, do the following:
 * 1. Put an event switch into the map.
 * 2. In the 'Note' field (Next to the name) put the following text :
 * Light 250 #FFFFFF
 * - Light activates the script
 * - 250 is the lightradius of the object
 * - #FFFFFF is the lightcolor (white in this case)
 * 3. You're done, its that simple.
 *
 * To alter the player radius in game use the following plugin command :
 * Light radius 200 #FFFFFF  (to change the radius and the color)
 * If you want to change the player radius slowly over time (like a dying torch)
 * use the command 'Light radiusgrow 200 #FFFFFF'
 *
 * To turn on and off lightsources in the game, do the following:
 * Give the lightsource the normal def :  Light 250 #FFFFFF and an extra number
 * so it becomes 'Light 250 #FFFFFF 1'
 * To turn on this light use plugin command : 'Light on 1'.
 * The plugin command will also trigger SelfSwitch 'D' on the targeted light(s).
 * To turn off the light use plugin command : 'Light off 1'.
 * You can reset the switches each map with the option or manualy by
 * the plugin command 'Light switch reset'
 *
 * Replacing the 'Light' keyworld with 'Fire' will give the lights a subtle flicker
 *
 * To completly turn off the script use : 'Light deactivate'
 * To turn it on again use the command: 'Light activate'
 *
 * To activate a day-night cycle on a map, put in a trigger with 'DayNight' in the note.
 * Plugin command 'Daynight speed 10' changes the speed.
 * Speed 10 means it takes 10 seconds to to pass one hour in game (probably to fast)
 * Plugin command 'Daynight hour 16' sets the hour to 16:00 hours
 * Each hour has its own color value, you can define hours 0 to 23
 * Plugin command 'Daynight color 0 #222222' changes 0:00 hours to color value '#222222'
 *
 * To use a flashlight effect use 'Flashlight on' and 'Flashlight off'
 *
 * If you want to use the time of day to trigger effects (like turning on lights when it gets dark)
 * you can use the parameter 'Save DaynightCycle'. The default is 0, which means its off.
 * If you set it to a value,5 for example, it will store the daynight value (0-23) inside game variable 5.
 * You can then use that variable to trigger lights.
 *
 * Released under the MIT license,
 * if used for commercial projects feel free to make a donation or
 * better yet, give me a free version of what you have created.
 * e-mail : master at liply.net
 *
 * Special thanks to everyone in the rpgmakerweb community for idea's, support and interest.
 */

(function(){
    var parameters = PluginManager.parameters('liply_MobileLight');
    
    var dayNightSave = +parameters['Save DaynightCycle'] || 0;


    var pluginActive = true;
    var resetEachMap = parameters['Reset Lights'];
    var maxLightCache = parameters['Max Light Cache'];
    
    //
    // Utility
    //
    function accessor(key, initial){
        var vKey = '_liply_MobileLight_'+key;
        return function(arg){
            if(arg !== undefined){
                $gameVariables[vKey] = arg;
            }else{
                $gameVariables[vKey] = ($gameVariables[vKey] !== undefined)? $gameVariables[vKey]: initial;
                return $gameVariables[vKey];
            }
        }
    }
    
    function variable(initial){
        var value;
        
        return function(arg){
            if(arg !== undefined){
                value = arg;
            }else{
                value = (value !== undefined)? value: initial;
                return value;
            }
        }
    }

    function onOff(arg){
        return arg && arg.toLowerCase() === 'on';
    }

    var player = (function(){
        return {
            flashLight: accessor('playerFlashLight', false),
            radius: accessor('playerRadius', 0),
            flicker: accessor('playerFlicker', false),
            color: variable('#ffffff'),
            position: variable(null),
            lightGrow: variable(0),
            lightGrowTarget: variable(0),
            lightGrowSpeed: variable(0),
            grow: function(){
                var lightGrow = this.lightGrow();
                var target = this.lightGrowTarget();
                var speed = this.lightGrowSpeed();
                if(Math.abs(lightGrow - target) > 0.1){
                    this.lightGrow(lightGrow + (lightGrow < target)? speed: - speed);
                    this.radius(this.lightGrow());
                }
            }
        }
    })();
    
    var dayNight =(function(){
        var _cycle = 0;

        var dayNightColors = [
            '#000000', '#000000', '#000000', '#000000',
            '#000000', '#000000', '#666666', '#AAAAAA',
            '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF',
            '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF',
            '#FFFFFF', '#FFFFFF', '#AAAAAA', '#666666',
            '#000000', '#000000', '#000000', '#000000' ];

        return {
            stop: variable(false),
            cycle: function(arg){
                if(arg !== undefined){
                    if(arg < 0) arg = 0;
                    if(arg > 23) arg = 23;
                    if(dayNightSave > 0){
                        $gameVariables.setValue(dayNightSave, arg);
                    }
                    _cycle = arg;
                }else{
                    return _cycle;
                }
            },
            incCycle: function(){
                this.cycle(this.cycle()+1);
            },
            speed: variable(0),
            colors: accessor('dayNightColors', dayNightColors)
        }
    })();


    var lightSwitch = (function(){
        function lights(){
            $gameVariables._liply_MobileLight_lights =
                $gameVariables._liply_MobileLight_lights || [];

            return $gameVariables._liply_MobileLight_lights;
        }

        return {
            on: function(id){
                lights()[id] = true;
            },
            setPosition: function(id, pos){
                lights()[id] = pos;
            },
            off: function(id){
                lights()[id] = undefined;
            },
            getPosition: function(id){
                return lights()[id];
            },
            get: function(id){
                return !!(lights()[id]);
            },
            clear: function() {
                lights().splice(0);
            }
        }
    })();

    var lightCache = (function(){
        var cache = [];

        return {
            get: function(r1, r2, color1, color2) {
                for (var n = 0; n < cache.length; ++n) {
                    var key = cache[n][0];
                    if (key.r1 === r1 && key.r2 === r2 && key.color1 === color1 && key.color2 === color2) {
                        return cache[n][1];
                    }
                }

                var canvas = document.createElement('canvas');
                canvas.width = r2 * 2 + 2;
                canvas.height = r2 * 2 + 2;
                var context = canvas.getContext('2d');

                var grad = context.createRadialGradient(r2, r2, r1, r2, r2, r2);
                grad.addColorStop(0, color1);
                grad.addColorStop(1, color2);
                context.fillStyle = grad;
                context.fillRect(0, 0, r2 * 2, r2 * 2);

                // if(canvas.width !== 0 && canvas.height !== 0 && r2 !== 0)
                //     context.putImageData(context.getImageData(0,0,r2,r2),0,0);//force pixel

                cache.push([
                    {r1: r1, r2: r2, color1: color1, color2: color2},
                    canvas
                ]);
                if (cache.length > maxLightCache) cache.shift();

                return canvas;
            },
            clear: function(){
                cache = [];
            }
        }
    })();

    function isLight(event){
        var lightCommands = ['light', 'fire', 'daynight'];
        var note = event.note.toLowerCase();
        for(var n = 0; n < lightCommands.length; ++n){
            if(note.startsWith(lightCommands[n])){
                return true;
            }
        }

        return false;
    }

    function clearMapLights(){
        lightSwitch.clear();
    }


    function isValidColor(color){
        return  /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(color);
    }
    
    function fillAll(context, color){
        context.save();
        context.fillStyle = color;
        context.fillRect(0, 0, Graphics.width, Graphics.height);

        context.restore();
    }

    function validateColor(color){
        if(!isValidColor(color)){
            return '#FFFFFF';
        }

        return color;
    }
    
    function quickReject(pos, radius){
        return pos.x < -radius
            || pos.x > Graphics.width + radius
            || pos.y < -radius
            || pos.y > Graphics.height + radius;
    }


    function clearSelfSwitchD(mapId, eventId){
        setSelfSwitchD(mapId, eventId, false);
    }

    function setSelfSwitchD(mapId, eventId, value){
        $gameSelfSwitches.setValue([mapId, eventId, 'D'], value);
    }

    function resetLightSelfSwitches(){
        for(var n = 0; n < $dataMap.events.length; ++n){
            var id = $dataMap.events[n].eventId();
            if(lightSwitch.get(id)){
                clearSelfSwitchD($gameMap._mapId, id);
            }
        }
    }


    //
    // Plugin Commands
    //

    function processDayNight(args){
        switch(args[0]){
            case 'speed':
                var dayNightSpeed = +args[1];
                dayNight.speed(dayNightSpeed || 1000);

                if(dayNightSpeed === 0) dayNight.stop(true);
                else dayNight.stop(false);
                break;

            case 'hour':
                var dayNightCycle = +args[1];
                dayNight.cycle(dayNightCycle);
                break;

            case 'color':
                var hour = +args[1];
                if(hour < 0) hour = 0;
                if(hour > 23) hour = 23;
                var hourColor = args[2];
                if(isValidColor(hourColor)) dayNight.colors()[hour] = hourColor;
                break;
        }
    }

    function processFlashLight(args){
        player.flashLight(onOff(args[0]));
    }

    function processLight(args){
        switch(args[0]){
            case 'radius':
                var newRadius = +args[1];
                if(newRadius >= 0){
                    player.radius(newRadius);
                    player.lightGrow(newRadius);
                    player.lightGrowTarget(newRadius);
                }

                if(args[2]){
                    player.color(validateColor(args[2]));
                }
                break;

            case 'radiusgrow':
                newRadius = +args[1];
                if(newRadius >= 0){
                    player.lightGrow(player.radius());
                    player.lightGrowTarget(newRadius);
                    player.lightGrowSpeed((Math.abs(newRadius - player.radius())) / 500);
                }

                if(args[2]){
                    player.color(validateColor(args[2]));
                }
                break;

            case 'on':
                lightSwitch.on(+args[1]);
                break;

            case 'off':
                lightSwitch.off(+args[1]);
                break;

            case 'deactivate':
                pluginActive = false;
                lightCache.clear();
                break;

            case 'activate':
                pluginActive = true;
                break;

            case 'switch':
                if(args[1] === 'reset'){
                    resetLightSelfSwitches();
                }
                break;
        }

    }

    function processFire(args){
        player.flicker(onOff(args[0]));
        processLight(args);
    }


    var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(cmd, args){
        switch(cmd.toLowerCase()){
            case 'daynight':
                processDayNight(args);
                break;

            case 'flashLight':
                processFlashLight(args);
                break;

            case 'fire':
                processFire(args);
                break;

            case 'light':
                processLight(args);
                break;
        }

        return _Game_Interpreter_pluginCommand.apply(this, arguments);
    };

    
    //
    // Renderings
    //
    function flick(context){
        context.globalAlpha = 0.9 + 0.1 * Math.random();
    }


    function drawRadial(context, p, r1, r2, c1, c2, flicker) {
        if (Utils.isAndroidChrome()) {
            context.save();

            var dimLight = lightCache.get(0, 40, '#999999', c2);
            if(flicker)flick(context);
            context.drawImage(dimLight, p.x - r2, p.y - r2);

            context.restore();
        }else {
            context.save();

            var grad = context.createRadialGradient(p.x, p.y, r1, p.x, p.y, r2);
            grad.addColorStop(0, c1);
            grad.addColorStop(1, c2);
            context.fillStyle = grad;
            if(flicker)flick(context);
            context.fillRect(p.x - r2, p.y - r2, r2 * 2, r2 * 2);

            context.restore();
        }
    }

    function drawFlashLight(context, p, r1, r2, c1, c2, d){
        context.save();

        drawRadial(context, p, r1, r2, c1, c2);

        var x = p.x;
        var y = p.y;
        for(var cone = 1; cone < 8; cone++){
            var coneR1 = cone * 2;
            var coneR2 = cone * 12;

            switch(d){
                case 6:
                    x += cone*6;
                    break;
                case 4:
                    x -= cone*6;
                    break;
                case 2:
                    y += cone*6;
                    break;
                case 8:
                    y -= cone*6;
                    break;
            }
            

            drawRadial(context, {x:x, y:y}, coneR1, coneR2, c1, c2);
        }
        
        context.restore();
    }


    function updatePlayerLight(context){
        player.grow();

        if(player.flashLight())
            drawFlashLight(context, player.position(), 20, player.radius(), player.color(), 'black', $gamePlayer._direction);
        else if(player.radius() < 100)
            drawRadial(context, player.position(), 0, player.radius(), '#999999', 'black', player.flicker());
        else
            drawRadial(context, player.position(), 20, player.radius(), player.color(), 'black', player.flicker());
    }


    function initCanvas(canvas){
        var context = canvas.getContext('2d');
        context.save();
//        canvas.width = canvas.width;//refresh
        fillAll(context, 'black');
        context.globalCompositeOperation = 'lighter';

        return context;
    }
    
    function restoreCanvas(context){
        context.restore();
        context.globalCompositeOperation =  'source-over';
    }
    
    function hexToRgb(hex) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

    var dayNightTimer = 0;
    var oldSeconds = 0;
    function updateDayNight(){
        var dayNightSpeed = dayNight.speed();
        var dayNightStop = dayNight.stop();

        if(dayNightSpeed > 0){
            if(!dayNightStop){
                var now = new Date();
                var seconds = Math.floor(now.getTime()/10);
                if(seconds > oldSeconds){
                    oldSeconds = seconds;
                    dayNightTimer = dayNightTimer + 1;
                    if(dayNightTimer >= (dayNightSpeed * 60)){
                        dayNight.incCycle();
                        dayNightTimer = 0;
                    }
                }

            }
        }
    }
    
    function interpolateColor(c1, c2, alpha){
        var c1Rgb = hexToRgb(c1);
        var r1 = c1Rgb.r;
        var g1 = c1Rgb.g;
        var b1 = c1Rgb.b;

        var c2Rgb = hexToRgb(c2);
        var r2 = c2Rgb.r;
        var g2 = c2Rgb.g;
        var b2 = c2Rgb.b;

        var r = r1 + (r2 - r1) * alpha;
        var g = g1 + (g2 - g1) * alpha;
        var b = b1 + (b2 - b1) * alpha;
        
        return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }
    
    function updateDayNightRendering(context){
        var dayNightColors = dayNight.colors();
        var dayNightCycle = dayNight.cycle();
        var color = dayNightColors[dayNightCycle];
        if(dayNight.speed() > 0){
            var nextColorIndex = dayNightCycle+1;
            if(nextColorIndex >= 24)nextColorIndex = 0;
            
            var color1 = dayNightColors[dayNightCycle];
            var color2 = dayNightColors[nextColorIndex];
            color = interpolateColor(color1, color2, dayNightTimer/(60*dayNight.speed()));
        }
        fillAll(context, color);
    }

    function updateEventLight(context, gameEvent, commands, flicker){
        var radius = +commands[1];
        var color = validateColor(commands[2]);
        var lightId = +commands[3];
        var lightState = isNaN(lightId) || lightSwitch.get(lightId);

        if(radius >= 0){
            if(lightId > 0)
                setSelfSwitchD($gameMap.mapId(), gameEvent.eventId(), lightState);

            var lightPosition = lightSwitch.getPosition(gameEvent.eventId());
            if(lightState && !quickReject(lightPosition, radius)){
                drawRadial(context, lightSwitch.getPosition(gameEvent.eventId()), 0, radius, color, 'black', flicker);
            }
        }

    }

    function updateEventLights(context){
        var events = $gameMap.events();
        for(var n =0, l = events.length; n < l; ++n){
            var event = events[n];
            if(event){
                var noteCommands = event.event().note.split(' ');
                var noteCommand = (noteCommands[0])?noteCommands[0].toLowerCase(): '';
                switch(noteCommand){
                    case 'light':
                        updateEventLight(context, event, noteCommands, false);
                        break;

                    case 'fire':
                        updateEventLight(context, event, noteCommands, true);
                        break;
                    
                    case 'daynight':
                        updateDayNightRendering(context);
                        break;
                }
            }
        }
    }


    
    //
    // hooks 
    //
    function setupEventLights(){
        if(resetEachMap.toLowerCase() === 'yes'){
            resetLightSelfSwitches();
        }
        clearMapLights();

        var events = $gameMap.events();
        for(var n = 0, l = events.length; n < l; ++n){
            if(isLight(events[n].event())){
                lightSwitch.on(events[n].eventId());
            }
        }
    }

    function updateLights(sprite){
        var mask = sprite.bitmap;

        if(pluginActive){
            sprite.visible = true;
            var context = initCanvas(mask.canvas);

            updateDayNight();
            updateEventLights(context);
            updatePlayerLight(context);

            restoreCanvas(context);

            mask._setDirty();
        }else{
            sprite.visible = false;
        }
    }

    var Scene_Map_start = Scene_Map.prototype.start;
    Scene_Map.prototype.start = function(){
        Scene_Map_start.apply(this, arguments);
        setupEventLights();
    };
    
    var Scene_Map_update = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function(){
        Scene_Map_update.apply(this, arguments);

        if(Graphics._skipCount === 0)
            updateLights(this._spriteset._lightMask);
    };

    var _Spriteset_Map_update = Spriteset_Map.prototype.update;
    Spriteset_Map.prototype.update = function() {
        _Spriteset_Map_update.apply(this, arguments);

        for(var n = 0, l = this._characterSprites.length; n < l ; ++n){
            var sprite = this._characterSprites[n];
            var character = sprite._character;
            var ty = $gameMap.tileHeight();
            var p = {x:sprite.x, y:sprite.y - ty/2};

            if(character instanceof Game_Event && lightSwitch.get(character.event().id)){
                lightSwitch.setPosition(character.event().id, p);
            }else if(character instanceof Game_Player){
                player.position(p);
            }
        }
    };

    var maskBitmap;
    function createLightMask(spriteSet){
        var bitmap = maskBitmap;

        if(!bitmap){
            maskBitmap = new Bitmap(Graphics.width, Graphics.height);
            bitmap = maskBitmap;
        }

        spriteSet._lightMask = new Sprite(bitmap);
        spriteSet._lightMask.blendMode = Graphics.BLEND_MULTIPLY;
        spriteSet.addChild(spriteSet._lightMask);
    }

    Spriteset_Map.prototype.createLowerLayer = function() {
        Spriteset_Base.prototype.createLowerLayer.call(this);
        this.createParallax();
        this.createTilemap();
        this.createCharacters();
        this.createShadow();
        this.createDestination();
        createLightMask(this);
        this.createWeather();
    };
})();