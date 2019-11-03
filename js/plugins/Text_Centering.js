(function(){
    function getTextLineByIndex(text, index){
        var line = 0;
        for(var n = 0; n < index; ++n){
            if(text[n] === '\n')line++;
        }

        return text.split('\n')[line];
    }

    Window_Message.prototype.processNormalCharacter = function(textState) {
        var c = textState.text[textState.index++];
        var w = this.textWidth(c);

        var line = getTextLineByIndex(textState.text, textState.index);
        var width = this.contents.measureTextWidth(line);

        var offset = (this.contentsWidth() - width)/2;
        this.contents.drawText(c, textState.x + offset, textState.y, w * 2, textState.height, 'left');
        textState.x += w;
    };

    Window_ChoiceList.prototype.drawItem = function(index) {
        var rect = this.itemRectForText(index);

        var width = this.contents.measureTextWidth(this.commandName(index));
        var offsetX = Math.floor((rect.width - width)/2);

        var x = rect.x + offsetX;
        var textState = { index: 0, x: x, y: rect.y, left: x };
        textState.text = this.convertEscapeCharacters(this.commandName(index));
        var offsetY = Math.floor((this.itemHeight() - this._scrollY - this.calcTextHeight(textState, false))/2);

        this.drawTextEx(this.commandName(index), rect.x + offsetX, rect.y + offsetY);
    };

})();
