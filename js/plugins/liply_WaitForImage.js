(function(){
    'use strict';

    function characterBitmap(self){
        var bitmap;
        if(self._character.tileId() > 0){
            bitmap = this.tilesetBitmap(self._character.tileId());
        }else{
            bitmap = ImageManager.loadCharacter(self._character.characterName());
        }
        return bitmap;
    }

    var Sprite_Character_updateBitmap = Sprite_Character.prototype.updateBitmap;
    Sprite_Character.prototype.updateBitmap = function(){
        var self = this;
        if(this._liply_bitmapState === undefined){
            this._liply_bitmapState = 'same';
        }

        switch(this._liply_bitmapState){
            case 'load':
                delete this._liply_loadingBitmap;
                this._liply_bitmapState = 'same';
                Sprite_Character_updateBitmap.call(this);
                break;

            case 'loading':
                if(this._liply_loadingBitmap !== characterBitmap(this)){
                    this._liply_bitmapState = 'prepare';
                    this.updateBitmap();
                }
                break;

            case 'prepare':
                var bitmap = characterBitmap(this);
                console.log(bitmap.url);

                this._liply_bitmapState = 'loading';
                this._liply_loadingBitmap = bitmap;
                bitmap.addLoadListener(function(){
                    if(self._liply_loadingBitmap === bitmap){
                        self._liply_bitmapState = 'load';
                        self.updateBitmap();
                    }
                });
                break;

            case 'same':
                if(this.bitmap && this.isImageChanged()){
                    this._liply_bitmapState = 'prepare';
                    this.updateBitmap();
                }else{
                    Sprite_Character_updateBitmap.call(this);
                }
                break;
        }
    };


    // var Sprite_Character_updateFrame = Sprite_Character.prototype.updateFrame;
    // Sprite_Character.prototype.updateFrame = function() {
    //     if(this._liply_bitmapState === 'same')
    //         Sprite_Character_updateFrame.call(this);
    // };

    function picture_isImageChanged(self){
        var picture = self.picture();
        return picture && picture.name() !== self._pictureName;
    }


    var Sprite_Picture_updateBitmap = Sprite_Picture.prototype.updateBitmap;
    Sprite_Picture.prototype.updateBitmap = function() {
        var self = this;

        if(this._liply_bitmapState === undefined){
            this._liply_bitmapState = 'same';
        }

        switch(this._liply_bitmapState){
            case 'load':
                Sprite_Picture_updateBitmap.call(this);
                this._liply_bitmapState = 'same';
                break;

            case 'loading':
                if(this._liply_loadingBitmap !== ImageManager.loadPicture(this.picture().name())){
                    this._liply_bitmapState = 'prepare';
                    this.updateBitmap();
                }
                break;

            case 'prepare':
                var bitmap = ImageManager.loadPicture(this.picture().name());

                this._liply_bitmapState = 'loading';
                this._liply_loadingBitmap = bitmap;
                bitmap.addLoadListener(function(){
                    if(self._liply_loadingBitmap === bitmap){
                        self._liply_bitmapState = 'load';
                        self.updateBitmap();
                    }
                });
                break;

            case 'same':
                if(this.bitmap && picture_isImageChanged(this)){
                    this._liply_bitmapState = 'prepare';
                    this.updateBitmap();
                }else{
                    Sprite_Picture_updateBitmap.call(this);
                }
                break;
        }
    };


    Sprite.prototype._onBitmapLoad = function() {
        if (this._bitmap && this._frame.width === 0 && this._frame.height === 0) {
            this._frame.width = this._bitmap.width;
            this._frame.height = this._bitmap.height;
        }
        this._refresh();
    };

    // Bitmap.load = function(url) {
    //     var bitmap = new Bitmap();
    //     bitmap._image = new Image();
    //     bitmap._image.src = url;
    //     bitmap._image.onload = function(){
    //         setTimeout(Bitmap.prototype._onLoad.bind(bitmap), 1000);
    //     };
    //     bitmap._image.onerror = Bitmap.prototype._onError.bind(bitmap);
    //     bitmap._url = url;
    //     bitmap._isLoading = true;
    //     return bitmap;
    // };
})();