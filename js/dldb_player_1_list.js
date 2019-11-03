function Scene_DLDB_List() {
    this.initialize.apply(this, arguments);
}

Scene_DLDB_List.prototype = Object.create(Scene_DLDB.prototype);
Scene_DLDB_List.prototype.constructor = Scene_DLDB_List;

Scene_DLDB_List.prototype.initialize = function() {
	ConfigManager.lastmenu = "List";
	$check_run = false;
	$loadtext = false;
	this._run = false;
	this._load_type = false;
	this._save_index = "";
	this._save_text = "";
	this._load_text = "";
	this._load_js = [];
	this._load_js_count = 0;
    Scene_Base.prototype.initialize.call(this);
};

Scene_DLDB_List.prototype.create = function() {
    Scene_Base.prototype.create.call(this);
    this.createWindowLayer();
    this.createCommandWindow();
};

Scene_DLDB_List.prototype.createCommandWindow = function() {
	this.base_createWindow(0);
	this._nowdir = new Window_Top_List();
    this._listwindow = new Window_DLDB_ListView();
	this._runwindow = new Window_DLDB_Run();
	this._editwindow = new Window_DLDB_Edit();
	this._delwindow = new Window_DLDB_Del();
	if (ConfigManager.select_game > -1) {
		this._listwindow.select(ConfigManager.select_game);
		ConfigManager.select_game = -1;
	}
	this._runwindow.setHandler('Run', this.Game_Ready.bind(this));
    this._editwindow.setHandler('Edit', this.Game_Edit.bind(this));
    this._delwindow.setHandler('Del', this.Game_Del.bind(this));
	this.addWindow(this._nowdir);
    this.addWindow(this._listwindow);
    this.addWindow(this._runwindow);
    this.addWindow(this._editwindow);
    this.addWindow(this._delwindow);
};


//여기 부터
Scene_DLDB_List.prototype.Game_Ready = function() {
	this._run = true;
	this._load_type = "";
	this._save_text = "";
	this._load_js = ['dldb_plugin_base'];
	this._load_js_count = 0;
}

Scene_DLDB_List.prototype.Game_Edit = function() {
	ConfigManager.select_game = this._listwindow._index;
	SceneManager.push(Scene_DLDB_Config);
}

Scene_DLDB_List.prototype.Game_Del = function() {
	ConfigManager.savelist.splice(this._listwindow._index,1)
	this._listwindow.refresh();
	this._delwindow.activate();
	if (this._listwindow._index == ConfigManager.savelist.length) {
		this._listwindow.select(ConfigManager.savelist.length - 1);
	}
}

Scene_DLDB_List.prototype.update = function() {
    Scene_Base.prototype.update.call(this);
	if (this._windowLayer.width != Graphics.boxWidth)  {
		this._windowLayer.width = Graphics.boxWidth;
	}
	if (this._windowLayer.height != Graphics.boxHeight)  {
		this._windowLayer.height = Graphics.boxHeight;
	}
	if (this._listwindow.index() == -1) {
		this._editwindow.hide();
		this._runwindow.hide();
		this._delwindow.hide();
	}
	if (!this.now_sel) {
		this.now_sel = "run";
		this._runwindow.select(0);
		this._delwindow.select(-1);
		this._editwindow.select(-1);
	}
	if (this.now_sel != "edit" && this._editwindow._index == 0) {
		this.now_sel = "edit"
		this._runwindow.select(-1);
		this._delwindow.select(-1);
	}
	if (this.now_sel != "run" && this._runwindow._index == 0) {
		this.now_sel = "run"
		this._editwindow.select(-1);
		this._delwindow.select(-1);
	}
	if (this.now_sel != "del" && this._delwindow._index == 0) {
		this.now_sel = "del"
		this._editwindow.select(-1);
		this._runwindow.select(-1);
	}
	if ($loadtext) {
		if($loadtext != "not data") this._save_text += $loadtext;
		$loadtext = false;
		this._run = true;
	}
	if (this._run == true) {
		this._run = false;
		var data = ConfigManager.savelist[this._listwindow._index];
		this._run_dir = data[1];
		ConfigManager.savelist.splice(this._listwindow._index,1)
		ConfigManager.savelist.unshift(data);
		ConfigManager.save();
		this._listwindow.select(0);
		this.Game_Setting();
	}
};

Scene_DLDB_List.prototype.Game_Setting = function() {
	//신규 index.html 타입 저장하기
	if (this._load_type == "index") {
		var base_dir = location.href;
		base_dir = base_dir.replace("index.html","");
		var savetext = ""
		savetext = savetext + "<script src=\"" + base_dir + "cordova.js\"></script>"
		savetext = savetext + "<script src=\"" + base_dir + "js/app.js\"></script>"
		savetext = savetext + "<script src=\"" + base_dir + "xdk/init-dev.js\"></script>"
		this._save_text = this._save_text.replace("</head>",savetext + '</head>');
		savetext = "";
		this._load_js = ['dldb_plugin_base'];
		if (this.check_config("game_pad")) {
			this._load_js.push(this.check_config("game_pad"));
			this._load_js.push("dldb_pad_option");
		}
		if (this.check_config("cache_clear")) this._load_js.push('cache_clear');
		if (this.check_config("fast_mes")) this._load_js.push('dldb_fast_mes');

		for (load_no = 0;load_no < this._load_js.length ;load_no++) {
			savetext = savetext + "<script src=\"" + base_dir + "js/addon/" + this._load_js[load_no] + ".js\"></script>"
		}

		this._save_text = this._save_text.replace("</body>",savetext + "</body>");

		savetext = "<script type=\"text/javascript\" src=\"js/plugins.js\"></script>"
		this._save_text = this._save_text.replace(savetext,savetext + "<script src=\"" + base_dir + "js/addon/dldb_plugin_base_plugin_del.js\"></script>");

		localStorage.setItem("game_dir", "file://" + this._run_dir);

		writeToFile("file://" + this._run_dir, this._save_text);
		this._save_text = "";
	}

	//시작 부분 index.html 불러오기
	if (this._load_type == "") {
		this._load_type = "index";
		this._save_text = "";
		this.LoadFile(this._run_dir + "index.html" );
	}
}

Scene_DLDB_List.prototype.check_config = function(symbol) {
	var no = symbol_no(symbol);
    var value = ConfigManager.savelist[this._listwindow._index][2][no];
	var now = 0;
	if (value > -1) now = value;
	if (value == false) now = 0;

	if (now == 0) {
		value = ConfigManager.config[no];
		if (value > -1) now = value;
		if (value == false) now = 0;
	} else {
		now--;
	}

	switch(symbol) {
		case "game_pad":
			switch(now) {
				case 0: return false;
				case 1: return "dldb_pad_A";
				case 2: return "dldb_pad_L";
				case 3: return "dldb_pad_S";
			}
		default:
			if (now == 0) return false;
			return value;
	}
}

// 하단 부분
function Window_DLDB_ListView() {
    this.initialize.apply(this, arguments);
}

Window_DLDB_ListView.prototype = Object.create(Window_DLDB_Left.prototype);
Window_DLDB_ListView.prototype.constructor = Window_DLDB_ListView;

Window_DLDB_ListView.prototype.initialize = function() {
    Window_DLDB_Left.prototype.initialize.call(this, 0, 0);
};

Window_DLDB_ListView.prototype.item = function() {
    return ConfigManager.savelist[this._index][1];
};

Window_DLDB_ListView.prototype.maxCols = function() {
    return 1;
};


Window_DLDB_ListView.prototype.update = function() {
    Window_DLDB_Left.prototype.update.call(this);
	if (ConfigManager.savelist.length > 0 && this._index == -1) {
		this._index = 0;
		this.select(this._index);
	}
	if (ConfigManager.savelist.length == 0) {
		this._index = -1;
		this.select(this._index);
        this.activate();
		this.refresh();
	}
};

Window_DLDB_ListView.prototype.makeCommandList = function() {
	if (ConfigManager.savelist) {
		this.now_view = false;
		for (i = 0;i < ConfigManager.savelist.length ;i++ )
		{
		    this.addCommand(ConfigManager.savelist[i][0]);
		}
	}
};

function Window_Top_List() {
    this.initialize.apply(this, arguments);
}

Window_Top_List.prototype = Object.create(Window_Top.prototype);
Window_Top_List.prototype.constructor = Window_Top_List;

Window_Top_List.prototype.update = function() {
    Window_Base.prototype.update.call(this);
	if (this.width != Graphics.boxWidth - this.x || this.dir_name != ConfigManager.lastdir) {
		this.width = Graphics.boxWidth - this.x;
		this.refresh();
	}
};

Window_Top_List.prototype.refresh = function() {
    this.contents.clear();
	this.drawText("View List", 10, 0, this.width - 10, 'left');
};