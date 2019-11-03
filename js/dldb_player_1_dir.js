function Scene_DLDB_Dir() {
    this.initialize.apply(this, arguments);
}

Scene_DLDB_Dir.prototype = Object.create(Scene_DLDB.prototype);
Scene_DLDB_Dir.prototype.constructor = Scene_DLDB_Dir;

Scene_DLDB_Dir.prototype.initialize = function() {
	ConfigManager.lastmenu = "Dir";
	$check_run = false;
	$loadtext = false;
	this._run = false;
	this._load_type = false;
	this._save_index = "";
	this._save_text = "";
	this._load_text = "";
	this._load_js = [];
	this._load_js_count = 0;
	if (!ConfigManager.lastdir) {
		ConfigManager.lastdir = StorageManager.NowDir();
	}
    Scene_Base.prototype.initialize.call(this);
};

Scene_DLDB_Dir.prototype.create = function() {
    Scene_Base.prototype.create.call(this);
    this.createWindowLayer();
    this.createCommandWindow();
};

Scene_DLDB_Dir.prototype.createCommandWindow = function() {
	this.base_createWindow(1);
	this._nowdir = new Window_NowDir();
    this._listwindow = new Window_DLDB_FileList();
	this._runwindow = new Window_DLDB_Run();
	this._addwindow = new Window_DLDB_Add();
    this._runwindow.setHandler('Run', this.Game_Ready.bind(this));
    this._addwindow.setHandler('Add', this.Game_Add.bind(this));
    this._listwindow.setHandler('Move', this.Dir_Move.bind(this));
    this._listwindow.setHandler('Up', this.Dir_Up.bind(this));
	this.addWindow(this._nowdir);
    this.addWindow(this._listwindow);
    this.addWindow(this._runwindow);
    this.addWindow(this._addwindow);
};

Scene_DLDB_Dir.prototype.Game_Add = function() {
	var save = [];
	save[1] = ConfigManager.lastdir;
	save[0] = this.Now_Dir_Name();
	save[2] = []
	if (save[0] == 'www') {
	    save[0] = save[1].replace(/^.*\/([^\/]*)\/[^\/]*\/$/, '$1');
	}
	ConfigManager.savelist_put(save);
	ConfigManager.save();
	this._addwindow.hide();
	this._addwindow.active = true;
}
Scene_DLDB_Dir.prototype.Game_Ready = function() {
	this._run = true;
	this._load_type = "";
	this._save_text = "";
	this._load_js = ['dldb_plugin_base'];
	this._load_js_count = 0;
}

Scene_DLDB_Dir.prototype.Game_Setting = function() {
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

		localStorage.setItem("game_dir", "file://" + ConfigManager.lastdir);

		writeToFile("file://" + ConfigManager.lastdir, this._save_text);
		this._save_text = "";
	}

	//시작 부분 index.html 불러오기
	if (this._load_type == "") {
		this._load_type = "index";
		this._save_text = "";
		this.LoadFile(ConfigManager.lastdir + "index.html" );
	}
}


Scene_DLDB_Dir.prototype.check_config = function(symbol) {
	var no = symbol_no(symbol);
    var value = ConfigManager.config[no];
	var now = 0;
	if (value > -1) now = value;
	if (value == false) now = 0;

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

Scene_DLDB_Dir.prototype.update = function() {
    Scene_Base.prototype.update.call(this);
	if (this._windowLayer.width != Graphics.boxWidth)  {
		this._windowLayer.width = Graphics.boxWidth;
	}
	if (this._windowLayer.height != Graphics.boxHeight)  {
		this._windowLayer.height = Graphics.boxHeight;
	}
	if ($loadtext) {
		if($loadtext != "not data") this._save_text += $loadtext;
		$loadtext = false;
		this._run = true;
	}
	if (!this.now_sel) {
		this.now_sel = "run";
		this._runwindow.select(0);
		this._addwindow.select(-1);
	}
	if (this.now_sel != "run" && this._runwindow._index == 0) {
		this.now_sel = "run"
		this._addwindow.select(-1);
	}
	if (this.now_sel != "add" && this._addwindow._index == 0) {
		this.now_sel = "add"
		this._runwindow.select(-1);
	}
	if ($check_run == 1) {
		this._runwindow.show();
		this._addwindow.show();
		for (i = 0;i < ConfigManager.savelist.length;i++ ) {
			if (ConfigManager.savelist[i][1] == ConfigManager.lastdir) this._addwindow.hide();
		}
		$check_run = 2;
	} else if($check_run == false) {
		this._runwindow.hide();
		this._addwindow.hide();
	}
	if (this._run == true) {
		this._run = false;
		this.Game_Setting();
	}
};


Scene_DLDB_Dir.prototype.Now_Dir_Name = function() {
    var dir_arr = ConfigManager.lastdir.split("/")
	return dir_arr[dir_arr.length - 2];
}

Scene_DLDB_Dir.prototype.Dir_Up = function() {
    ConfigManager.lastdir = ConfigManager.lastdir.replace(/\/[^\/]*\/$/, '/');
	ConfigManager.save();
	this._listwindow.chang_dir();
}

Scene_DLDB_Dir.prototype.Dir_Move = function() {
	ConfigManager.lastdir = ConfigManager.lastdir + this._listwindow.item() + "/"
	ConfigManager.save();
	this._listwindow.chang_dir();
}




// 하단 부분
function Window_DLDB_FileList() {
    this.initialize.apply(this, arguments);
}

Window_DLDB_FileList.prototype = Object.create(Window_DLDB_Left.prototype);
Window_DLDB_FileList.prototype.constructor = Window_DLDB_FileList;

Window_DLDB_FileList.prototype.initialize = function() {
	StorageManager.Check_Dir();
    Window_DLDB_Left.prototype.initialize.call(this, 0, 0);
};

Window_DLDB_FileList.prototype.item = function() {
    return $check_end[this.index()];
};

Window_DLDB_FileList.prototype.maxCols = function() {
    return 2;
};

Window_DLDB_FileList.prototype.chang_dir = function() {
	this.now_view = true;
	StorageManager.Check_Dir();
}

Window_DLDB_FileList.prototype.update = function() {
    Window_DLDB_Left.prototype.update.call(this);

	if ($check_end && this.now_view) {
		this._index = -1;
		this.select(this._index);
        this.activate();
		this.refresh();
	}
};

Window_DLDB_FileList.prototype.drawItem = function(index) {
    var rect = this.itemRectForText(index);
    var align = this.itemTextAlign();
	this.resetTextColor();
	if (this.commandName(index) == "/..") {
		this.changeTextColor(this.textColor(2));
	}
	this.drawText(this.commandName(index), rect.x, rect.y, rect.width, align);
};

Window_DLDB_FileList.prototype.makeCommandList = function() {
	if ($check_end) {
		this.now_view = false;
		for (i = 0;i < $check_end.length ;i++ )
		{
		    this.resetTextColor();
			if ($check_end[i] == "/..") {
			    this.addCommand($check_end[i], 'Up');
			} else {
			    this.addCommand($check_end[i], 'Move');
			}
		}
	}
};

StorageManager.NowDir = function() {
	var dir = cordova.file.externalRootDirectory;
	dir = dir.replace("file://","");
	return decodeURIComponent(dir);
};

StorageManager.Check_Dir = function() {
	DataManager.loaddir()
}

DataManager.loaddir = function() {
    var xhr = new XMLHttpRequest();
	$check_end = false;
	var check_index = false;
	var check_up = false;
	var dir_arr = [];
    xhr.open('GET', ConfigManager.lastdir);
    xhr.overrideMimeType('application/json');
    xhr.onload = function() {
        if (xhr.status < 400) {
			var text_line = xhr.responseText.split("\n");
			var text_arr = "";
			for (i = 0;i < text_line.length ;i++ )
			{
				text_arr = text_line[i].match(/<script>addRow\(\"(.*?)\",\"(.*?)\",([0-9]),\"(.*?)\",\"(.*?)\"\);<\/script>/)
				if (text_arr && text_arr[3] == 1) {
					if (text_arr[1] == "..") 	{
						check_up = true;
					} else {
						dir_arr.push(text_arr[1]);
					}
				} else if (text_arr && text_arr[3] == 0 && text_arr[1] == "index.html") {
					check_index = true;
				}
			}

			if(check_index) {
				$check_run = true;
			} else {
				$check_run = false;
			}

			if (check_up) dir_arr.unshift("/..");
			$check_end = dir_arr;
			this.now_view = true;
        } else {
			ConfigManager.lastdir = StorageManager.NowDir();
			DataManager.loaddir();
		}
    };
    xhr.onerror = function() {
 		ConfigManager.lastdir = StorageManager.NowDir();
		DataManager.loaddir();
    };
    xhr.send();
};

function Window_NowDir() {
    this.initialize.apply(this, arguments);
}

Window_NowDir.prototype = Object.create(Window_Top.prototype);
Window_NowDir.prototype.constructor = Window_NowDir;

Window_NowDir.prototype.update = function() {
    Window_Base.prototype.update.call(this);
	if (this.width != Graphics.boxWidth - this.x || this.dir_name != ConfigManager.lastdir) {
		this.width = Graphics.boxWidth - this.x;
		this.refresh();
	}
};

Window_NowDir.prototype.refresh = function() {
    this.contents.clear();
	this.dir_name = ConfigManager.lastdir;
	var width = this.contentsWidth();
	this.drawText(this.dir_name, 10, 0, this.width - 10, 'left');
};

