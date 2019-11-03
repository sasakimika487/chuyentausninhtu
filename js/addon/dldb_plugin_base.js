function 경고(text) {
	alert(text);
};

document.addEventListener("deviceready", init, false);

function onBackKeyDown() {
    navigator.notification.confirm("Exit Game", function(index) {
        if(index === 1) {
			navigator.app.exitApp();
        }
    }, "Exit Game", ["Exit", "Cancel"]);
 
}

window.onload_base = window.onload;
window.onload = function() {
};

function init() {
	document.addEventListener("backbutton", onBackKeyDown, false);
	window.onload_base();
}

(function() {
 
  WebAudio._createContext = function() {
    try {
        this._context =  new (AudioContext || webkitAudioContext || mozAudioContext)();
    } catch (e) {
        this._context = null;
    }
  };
  
  WebAudio._detectCodecs = function() {
    var audio = document.createElement('audio');
    if (audio.canPlayType) {
        this._canPlayOgg = audio.canPlayType('audio/ogg; codecs=\"vorbis\"');
        this._canPlayM4a = audio.canPlayType('audio/x-m4a');
    }
  };
  
  AudioManager.audioFileExt = function() {
    if (WebAudio.canPlayOgg()) {
        return '.ogg';
    } else {
        return '.m4a';
    }
  };
  
})();

SceneManager.initAudio = function() {
    var noAudio = Utils.isOptionValid('noaudio');
};

StorageManager.localFileDirectoryPath = function() {
    return 'save/';
};

StorageManager.dldb_save = function(filename, text) {
	var base = $dldb_game_dir;
	var arr = filename.split('/');
	if (arr[0] == '') arr.shift();
	this.dldb_save_file(base,arr,text);
}

StorageManager.dldb_readfile = function(url) {
	var xml = new XMLHttpRequest();
	xml.open("GET",url,false);
	xml.send();
	var text = xml.responseText;
	return text;
}

StorageManager.backup = function(savefileId) {
}
StorageManager.backupExists = function(savefileId) {
	return false;
}

StorageManager.localFileExists = function(savefileId) {
  StorageManager.webStorageExists(savefileId);
}

StorageManager.saveToLocalFile = function(savefileId, json) {
  StorageManager.saveToWebStorage(savefileId, json);
};

StorageManager.loadFromLocalFile = function(savefileId) {
  StorageManager.loadFromWebStorage(savefileId);
};

localStorage.setItem = function(key, data) {
	StorageManager.dldb_save(key, data);
};

$dldb_game_dir = localStorage.getItem("game_dir");
localStorage.dldb_getItem = localStorage.getItem;
localStorage.getItem = function(key) {
    return StorageManager.dldb_readfile(key);
};

StorageManager.webStorageKey = function(savefileId) {
	return this.localFilePath(savefileId);
};

StorageManager.SaveToNo = function(no, text) {
	var savetext = LZString.compressToBase64(text);
	this.dldb_save(StorageManager.webStorageKey(no),savetext);
}

if (!TilingSprite_prototype_generateTilingTexture) {
    var TilingSprite_prototype_generateTilingTexture = TilingSprite.prototype.generateTilingTexture;
    TilingSprite.prototype.generateTilingTexture = function(arg){
        TilingSprite_prototype_generateTilingTexture.call(this, arg);
        if (this.tilingTexture.canvasBuffer)
            PIXI.Texture.removeTextureFromCache(this.tilingTexture.canvasBuffer.canvas._pixiId);
    }
}

	var require = function(name) {
		if (name == 'fs') {
			data = {};
			//파일 읽기
			data.readFileSync = function(path, option) {
				return StorageManager.dldb_readfile(path);
			}

			data.existsSync = function(path) {
				return true;
			}

			//폴더 만들기
			data.mkdirSync = function(dirPath) {
			}

			// 파일 저장
			data.writeFileSync = function(filename, text) {
				StorageManager.dldb_write_file(filename, text);
			}

			return data;
		}
		if (name =='nw.gui') 
			return nwDispatcher.requireNwGui();
		return global.require(name);
	}


	StorageManager.writeFileSync = function(filename, text) {
	}

	StorageManager.dldb_save_file = function(base, arr, text) {
		var check_dir = arr.shift();
		if (arr.length > 0) {
			resolveLocalFileSystemURL(base, function (directoryEntry) {
				directoryEntry.getDirectory(check_dir, { create: true }, function (directoryEntry1) {
					StorageManager.dldb_save_file(base + check_dir + "/", arr, text);
				});
			});
		}  else {
			resolveLocalFileSystemURL(base, function (directoryEntry) {
				directoryEntry.getFile(check_dir, { create: true }, function (fileEntry) {
					fileEntry.createWriter(function (fileWriter) {
						fileWriter.write(text);
					});
				});
			});
		}
	}


	DataManager.isThisGameFile = function(savefileId) {
		var globalInfo = this.loadGlobalInfo();
		if (globalInfo && globalInfo[savefileId]) return true;
		return false;
	};
