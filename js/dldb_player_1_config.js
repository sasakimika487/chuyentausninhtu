function Scene_DLDB_Config() {
    this.initialize.apply(this, arguments);
}

Scene_DLDB_Config.prototype = Object.create(Scene_DLDB.prototype);
Scene_DLDB_Config.prototype.constructor = Scene_DLDB_Config;

Scene_DLDB_Config.prototype.initialize = function() {
    Scene_Base.prototype.initialize.call(this);
};

Scene_DLDB_Config.prototype.create = function() {
    Scene_Base.prototype.create.call(this);
    this.createWindowLayer();
    this.createCommandWindow();
};

Scene_DLDB_Config.prototype.createCommandWindow = function() {
	if (ConfigManager.lastmenu == "Config") {
		this.base_createWindow(2);
		this._topwindow = new Window_Top_Config();
		this._topwindow.set_text('Config Base');
		this._configwindow = new Window_DLDB_Options(-1);
		this.addWindow(this._topwindow);
		this.addWindow(this._configwindow);
	} else {
		this._game_no = ConfigManager.select_game;
		this._topwindow = new Window_Top_Config();
		this._closewindow = new Window_Config_Close();
	    this._closewindow.setHandler('Close', this.option_end.bind(this));
		this._topwindow.set_text(ConfigManager.savelist[this._game_no][0] + " Config");
		this._configwindow = new Window_DLDB_Options(this._game_no);
		this.addWindow(this._topwindow);
		this.addWindow(this._closewindow);
		this.addWindow(this._configwindow);
	}
};

Scene_DLDB_Config.prototype.option_end = function() {
	SceneManager.pop();
}

function Window_Config_Close() {
    this.initialize.apply(this, arguments);
}

Window_Config_Close.prototype = Object.create(Window_DLDB_Left_Btn.prototype);
Window_Config_Close.prototype.constructor = Window_Config_Close;

Window_Config_Close.prototype.initialize = function() {
    this._windowWidth = 130;
    Window_Command.prototype.initialize.call(this, 0, 580);
};

Window_Config_Close.prototype.makeCommandList = function() {
    this.addCommand("Close",  "Close");
};


function Window_Top_Config() {
    this.initialize.apply(this, arguments);
}

Window_Top_Config.prototype = Object.create(Window_Top.prototype);
Window_Top_Config.prototype.constructor = Window_Top_Config;

Window_Top_Config.prototype.update = function() {
    Window_Base.prototype.update.call(this);
	if (this.width != Graphics.boxWidth - this.x || this.dir_name != ConfigManager.lastdir) {
		this.width = Graphics.boxWidth - this.x;
		this.refresh();
	}
};

Window_Top_Config.prototype.set_text = function(text) {
	this._name = text;
	this.refresh();
}

Window_Top_Config.prototype.refresh = function() {
    this.contents.clear();
	this.drawText(this._name, 10, 0, this.width - 10, 'left');
};