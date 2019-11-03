function 경고(text) {
	alert(text);
};

// 상단 부분
function Window_DLDB_BaseList() {
    this.initialize.apply(this, arguments);
}

Window_DLDB_BaseList.prototype = Object.create(Window_Command.prototype);
Window_DLDB_BaseList.prototype.constructor = Window_DLDB_BaseList;

Window_DLDB_BaseList.prototype.initialize = function() {
    this._windowWidth = 130;
    Window_Command.prototype.initialize.call(this, 0, 0);
};

Window_DLDB_BaseList.prototype.windowWidth = function() {
    return 130;
};

Window_DLDB_BaseList.prototype.maxCols = function() {
    return 1;
};

Window_DLDB_BaseList.prototype.makeCommandList = function() {
    this.addCommand("List",    'List');
    this.addCommand("Dir",   'Dir');
    this.addCommand("Config", 'Config');
};


//하단 기본
function Window_DLDB_Left_Btn() {
    this.initialize.apply(this, arguments);
}

Window_DLDB_Left_Btn.prototype = Object.create(Window_Command.prototype);
Window_DLDB_Left_Btn.prototype.constructor = Window_DLDB_Left_Btn;

Window_DLDB_Left_Btn.prototype.windowWidth = function() {
    return 130;
};

Window_DLDB_Left_Btn.prototype.maxCols = function() {
    return 1;
};

// 하단 Run
function Window_DLDB_Run() {
    this.initialize.apply(this, arguments);
}

Window_DLDB_Run.prototype = Object.create(Window_DLDB_Left_Btn.prototype);
Window_DLDB_Run.prototype.constructor = Window_DLDB_Run;

Window_DLDB_Run.prototype.initialize = function() {
    this._windowWidth = 130;
    Window_Command.prototype.initialize.call(this, 0, 580);
};

Window_DLDB_Run.prototype.makeCommandList = function() {
    this.addCommand("Run",  "Run");
};

// 하단 Add
function Window_DLDB_Add() {
    this.initialize.apply(this, arguments);
}

Window_DLDB_Add.prototype = Object.create(Window_DLDB_Left_Btn.prototype);
Window_DLDB_Add.prototype.constructor = Window_DLDB_Add;

Window_DLDB_Add.prototype.initialize = function() {
    this._windowWidth = 130;
    Window_Command.prototype.initialize.call(this, 0, 480);
};

Window_DLDB_Add.prototype.makeCommandList = function() {
    this.addCommand("Add",  "Add");
};

// 하단 Edit
function Window_DLDB_Edit() {
    this.initialize.apply(this, arguments);
}

Window_DLDB_Edit.prototype = Object.create(Window_DLDB_Left_Btn.prototype);
Window_DLDB_Edit.prototype.constructor = Window_DLDB_Edit;

Window_DLDB_Edit.prototype.initialize = function() {
    this._windowWidth = 130;
    Window_Command.prototype.initialize.call(this, 0, 480);
};

Window_DLDB_Edit.prototype.makeCommandList = function() {
    this.addCommand("Edit",  "Edit");
};

// 하단 Edit
function Window_DLDB_Del() {
    this.initialize.apply(this, arguments);
}

Window_DLDB_Del.prototype = Object.create(Window_DLDB_Left_Btn.prototype);
Window_DLDB_Del.prototype.constructor = Window_DLDB_Del;

Window_DLDB_Del.prototype.initialize = function() {
    this._windowWidth = 130;
    Window_Command.prototype.initialize.call(this, 0, 280);
};

Window_DLDB_Del.prototype.makeCommandList = function() {
    this.addCommand("Del",  "Del");
};

// 기본형
function Scene_DLDB() {
    this.initialize.apply(this, arguments);
}

Scene_DLDB.prototype = Object.create(Scene_Base.prototype);
Scene_DLDB.prototype.constructor = Scene_DLDB;

Scene_DLDB.prototype.initialize = function() {
    Scene_Base.prototype.initialize.call(this);
};

Scene_DLDB.prototype.create = function() {
    Scene_Base.prototype.create.call(this);
    this.createWindowLayer();
    this.createCommandWindow();
};

Scene_DLDB.prototype.base_createWindow = function(no) {
    this._topwindow = new Window_DLDB_BaseList();
	if (no != 0) this._topwindow.setHandler('List', this.View_List.bind(this));
	if (no != 1) this._topwindow.setHandler('Dir', this.View_Dir.bind(this));
	if (no != 2) this._topwindow.setHandler('Config', this.View_Config.bind(this));
	this._topwindow.select(no);
	this.addWindow(this._topwindow);
};

Scene_DLDB.prototype.View_List = function() {
	SceneManager.goto(Scene_DLDB_List);
}

Scene_DLDB.prototype.View_Dir = function() {
	SceneManager.goto(Scene_DLDB_Dir);
}

Scene_DLDB.prototype.View_Config = function() {
	ConfigManager.lastmenu = "Config";
	SceneManager.goto(Scene_DLDB_Config);
}

Scene_DLDB.prototype.Game_Ready = function() {
	this._run = true;
	this._load_type = "";
	this._save_text = "";
	this._load_js = ['dldb_plugin_base'];
	this._load_js_count = 0;
}

Scene_DLDB.prototype.LoadFile = function(file) {
	this._run = false;
    var xhr = new XMLHttpRequest();
    xhr.open('GET', file);
    xhr.overrideMimeType('application/json');
    xhr.onload = function() {
        if (xhr.status < 400) {
			$loadtext = xhr.responseText;
        } else {
			$loadtext = "not data";
		}
    };
    xhr.onerror = function() {
		$loadtext = "not data";
    };
    xhr.send();
};
//상단부분

function Window_Top() {
    this.initialize.apply(this, arguments);
}

Window_Top.prototype = Object.create(Window_Base.prototype);
Window_Top.prototype.constructor = Window_Top;

Window_Top.prototype.initialize = function() {
	this._x = 130;
	var width = this.windowWidth();
    var height = this.windowHeight();
    Window_Base.prototype.initialize.call(this, this._x, 0, width, height);
    this.refresh();
};

Window_Top.prototype.windowWidth = function() {
    return Graphics.boxWidth  - this._x;
};

Window_Top.prototype.windowHeight = function() {
    return 50;
};


// 하단 부분
function Window_DLDB_Left() {
    this.initialize.apply(this, arguments);
}

Window_DLDB_Left.prototype = Object.create(Window_Command.prototype);
Window_DLDB_Left.prototype.constructor = Window_DLDB_Left;

Window_DLDB_Left.prototype.initialize = function() {
	$check_end = false;
	this.now_view = true;
    Window_Command.prototype.initialize.call(this, 0, 0);
    this.updatePlacement();
	this.refresh();
};

Window_DLDB_Left.prototype.standardFontSize = function() {
    return 32;
};

Window_DLDB_Left.prototype.standardPadding = function() {
    return 32;
};

Window_DLDB_Left.prototype.windowWidth = function() {
    return Graphics.boxWidth;
};

Window_DLDB_Left.prototype.item = function() {
    return $check_end[this.index()];
};

Window_DLDB_Left.prototype.updatePlacement = function() {
    this.x = 130;
    this.y = 50;
	this.width = Graphics.boxWidth - this.x;
	this.height = Graphics.boxHeight - this.y;
	this.select(-1);
};

Window_DLDB_Left.prototype.maxCols = function() {
    return 1;
};

Window_DLDB_Left.prototype.update = function() {
    Window_HorzCommand.prototype.update.call(this);
	if (this.width != Graphics.boxWidth - this.x || this.height != Graphics.boxHeight - this.y) {
		this.width = Graphics.boxWidth - this.x;
		this.height = Graphics.boxHeight - this.y;
		this.refresh();
		this.select(this._index);
	}
};




function Window_DLDB_Options() {
    this.initialize.apply(this, arguments);
}

Window_DLDB_Options.prototype = Object.create(Window_Command.prototype);
Window_DLDB_Options.prototype.constructor = Window_DLDB_Options;

Window_DLDB_Options.prototype.initialize = function(game_no) {
	this._game_no = game_no;
    Window_Command.prototype.initialize.call(this, 0, 580);
    this.updatePlacement();
	this.refresh();
	this.select(-1);
};


Window_DLDB_Options.prototype.standardFontSize = function() {
    return 32;
};

Window_DLDB_Options.prototype.standardPadding = function() {
    return 32;
};

Window_DLDB_Options.prototype.statusWidth = function() {
    return 120;
};

Window_DLDB_Options.prototype.updatePlacement = function() {
    this.x = 130;
    this.y = 50;
	this.width = Graphics.boxWidth - this.x;
	this.height = Graphics.boxHeight - this.y;
};


Window_DLDB_Options.prototype.makeCommandList = function() {
    this.addCommand("Game Pad", 'game_pad');
    this.addCommand("Cache Clear", 'cache_clear');
    this.addCommand("Fast Message", 'fast_mes');
};

function symbol_no(symbol) {
	var arr = ['game_pad','cache_clear','fast_mes'];
	return arr.indexOf(symbol);
}

Window_DLDB_Options.prototype.Get_Type_Base = function(symbol) {
	switch(symbol) {
		case "game_pad":
			return ['OFF','AUTO','Large','Small']
		default:
			return ['OFF','ON'];
	}
}

Window_DLDB_Options.prototype.drawItem = function(index) {
    var rect = this.itemRectForText(index);
    var statusWidth = 250;
    var titleWidth = 650;
    this.resetTextColor();
    this.changePaintOpacity(this.isCommandEnabled(index));
    this.drawText(this.commandName(index), rect.x, rect.y, titleWidth, 'left');
    this.drawText(this.statusText(index), titleWidth, rect.y, statusWidth, 'right');
};

Window_DLDB_Options.prototype.statusText = function(index) {
    var symbol = this.commandSymbol(index);
    var value = this.getConfigValue(symbol);
    return this.Get_StatusText(symbol,value);
};

Window_DLDB_Options.prototype.Get_StatusText = function(symbol,value) {
	var arr = this.Get_Type(symbol);
	return arr[value];
};

Window_DLDB_Options.prototype.Get_Type = function(symbol) {
	var arr = this.Get_Type_Base(symbol);
	if (this._game_no > -1) {
		arr.unshift("BASE");
	}
	return arr;
}

Window_DLDB_Options.prototype.processOk = function() {
    var index = this.index();
    var symbol = this.commandSymbol(index);
    var value = this.getConfigValue(symbol);
    this.changeValue(symbol);
};

Window_DLDB_Options.prototype.cursorRight = function(wrap) {
    var index = this.index();
    var symbol = this.commandSymbol(index);
    var value = this.getConfigValue(symbol);
    this.changeValue(symbol);
};

Window_DLDB_Options.prototype.cursorLeft = function(wrap) {
    var index = this.index();
    var symbol = this.commandSymbol(index);
    var value = this.getConfigValue(symbol);
    this.changeValue(symbol);
};

Window_DLDB_Options.prototype.changeValue = function(symbol) {
    var index = this.index();
    var symbol = this.commandSymbol(index);
    var value = this.getConfigValue(symbol) + 1;
	var arr = this.Get_Type(symbol);
	if (arr.length == value) value = 0;
	this.setConfigValue(symbol,value);
	this.redrawItem(this.findSymbol(symbol));
};

Window_DLDB_Options.prototype.getConfigValue = function(symbol) {
	var no = symbol_no(symbol);
	var value ;

	if (this._game_no > -1) {
	    value = ConfigManager.savelist[this._game_no][2][no];
	} else {
	    value = ConfigManager.config[no];
	}
	if (value == false) return 0;
	if (value > -1) return value;
	return 0;
};

Window_DLDB_Options.prototype.setConfigValue = function(symbol, volume) {
	var no = symbol_no(symbol);
	if (this._game_no > -1) {
	    ConfigManager.savelist[this._game_no][2][no] = volume;
	} else {
	    ConfigManager.config[no] = volume;
	}
	ConfigManager.save();
};



function wait(msecs)
{
	var start = new Date().getTime();
	var cur = start;
	while(cur - start < msecs)
	{
	cur = new Date().getTime();
	}
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
