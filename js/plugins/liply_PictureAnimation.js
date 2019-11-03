/*:
 * @plugindesc ピクチャのフレームアニメーションを可能にするプラグインです。
 *
 * @author liply
 *
 * @help
 *
 * ピクチャのフレームアニメーションを可能にするプラグインです。
 * プラグインコマンドは以下です
 *
 * PictureAnimation pictureId width height animationSpan
 * 指定したピクチャをフレームアニメーション化します。
 * width(幅）、height(高さ）のアニメーションが並んでいると仮定して
 * アニメーションを行います。アニメーション間隔はanimationSpanです。
 *
 * PictureBlink pictureId r g b gray blinkSpan
 * 指定したピクチャを指定した間隔（blinkSpan)で色調補正を行います。
 * r(赤色）g（緑色）b（青色）gray（グレー）
 * です。
 *
 * StopPictureAnimation pictureId
 * 指定したピクチャの、本プラグインで行ったアニメーションをすべて解除します。
 *
 */
(function(){
    var Sprite_Picture_update = Sprite_Picture.prototype.update;
    Sprite_Picture.prototype.update = function(){
        Sprite_Picture_update.apply(this, arguments);

        var picture = this.picture();
        if(picture && picture._animationData && this.bitmap){
            var animationData = picture._animationData;
            var width = animationData.width;
            var height = animationData.height;
            var span = animationData.span;
            var time = animationData.time;

            var imageWidth = this.bitmap.width;
            var imageHeight = this.bitmap.height;

            var timeLength = Math.floor(time / span);
            var column = Math.floor(imageWidth / width);
            var row = Math.floor(imageHeight / height);
            var length = column * row;

            var currentIndex = timeLength % length;
            var currentXIndex = currentIndex % column;
            var currentYIndex = Math.floor(currentIndex / column);

            var currentX = currentXIndex * width;
            var currentY = currentYIndex * height;

            this._frame.width = width;
            this._frame.height = height;
            this._frame.x = currentX;
            this._frame.y = currentY;
            this._refresh();
        }
    };

    var Game_Picture_update = Game_Picture.prototype.update;
    Game_Picture.prototype.update = function(){
        Game_Picture_update.apply(this, arguments);

        if(this._animationData){
            this._animationData.time++;
        }
        if(this._blinkData){
            var trigger = this._blinkData.time % this._blinkData.span;

            if(trigger === 0){
                var d = this._blinkData;
                this.tint( [d.r, d.g, d.b, d.gray], 0);

            }else if(trigger === 1){
                this.tint([0,0,0,0], this._blinkData.span);
            }

            this._blinkData.time++;
        }
    };


    var Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(cmd, args){
        var command = cmd.toLowerCase();
        var pictureId, picture;
        function l(str){return str.toLowerCase();}

        if(command === l('PictureAnimation')){
            //PictureAnimation pictureId width height animationSpan
            pictureId = +args[0];
            picture = $gameScreen.picture(pictureId);
            picture._animationData = {
                width: +args[1],
                height: +args[2],
                span: +args[3],
                direction: 1,
                time: 0,
            };

        }else if(command === l('StopPictureAnimation')){
            //StopPictureAnimation pictureId
            pictureId = +args[0];
            picture = $gameScreen.picture(pictureId);
            delete picture._animationData;
            if(picture._blinkData){
                delete picture._blinkData;
                picture.tint([0,0,0,0], 0);
            }

        }else if(command === l('PictureBlink')){
            //PictureBlink pictureId r g b g blinkSpan
            pictureId = +args[0];
            picture = $gameScreen.picture(pictureId);
            picture._blinkData = {
                r: +args[1],
                g: +args[2],
                b: +args[3],
                gray: +args[4],
                span: args[5],
                time: 0,
            };
        }

        return Game_Interpreter_pluginCommand.apply(this, arguments);
    };
})();