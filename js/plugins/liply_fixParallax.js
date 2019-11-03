/*:
 * @plugindesc parallaxループしすぎるとおかしくなるバグを修正します
 * @author liply
 *
 * @help
 * 遠景をループしすぎると荒くなるバグを修正します。
 *
 */

(function(){
    Spriteset_Map.prototype.updateParallax = function() {
        if (this._parallaxName !== $gameMap.parallaxName()) {
            this._parallaxName = $gameMap.parallaxName();

            if (this._parallax.bitmap && Graphics.isWebGL() !== true) {
                this._canvasReAddParallax();
            } else {
                this._parallax.bitmap = ImageManager.loadParallax(this._parallaxName);
            }
        }
        if (this._parallax.bitmap && this._parallax.bitmap.isReady()) {
            var bitmap = this._parallax.bitmap;
            this._parallax.origin.x = $gameMap.parallaxOx() % bitmap.width;
            this._parallax.origin.y = $gameMap.parallaxOy() % bitmap.height;
        }
    };
})();