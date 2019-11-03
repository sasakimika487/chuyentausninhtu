/*:
 * @plugindesc liply_ControlSkip
 * @author liply
 *
 * @help
 * Skip on/off
 * 1:on, 0: off
 *
 * @param Skip
 * @desc 1:on, 0: off
 * @default 0
 *
 */

(function(){
    var parameters = PluginManager.parameters('liply_ControlSkip');
    var skip = +parseInt(parameters['Skip']) === 1;



    var Scene_Map_isFastForward = Scene_Map.prototype.isFastForward;
    Scene_Map.prototype.isFastForward = function(){
        return skip && Scene_Map_isFastForward.apply(this, arguments);
    };

    var _Window_ScrollText_isFastForward = Window_ScrollText.prototype.isFastForward;
    Window_ScrollText.prototype.isFastForward = function() {
        return skip && _Window_ScrollText_isFastForward.apply(this, arguments);
    };
})();