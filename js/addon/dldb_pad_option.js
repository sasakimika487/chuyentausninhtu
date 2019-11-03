Window_Options.prototype.dldb_game_pad_makeCommandList = Window_Options.prototype.makeCommandList;
Window_Options.prototype.makeCommandList = function() {
    this.dldb_game_pad_makeCommandList();
    this.addCommand("DLDB Pad Setting", 'dldb_pad');
}
	
Window_Options.prototype.dldb_game_pad_processOk = Window_Options.prototype.processOk;
Window_Options.prototype.processOk = function() {
    var index = this.index();
    var symbol = this.commandSymbol(index);
    if (this.commandSymbol(this.index()) == 'dldb_pad') {
		SceneManager.push(Scene_DLDB_Pad);
    } else {
		this.dldb_game_pad_processOk();
    }
};

function Scene_DLDB_Pad() {
    this.initialize.apply(this, arguments);
}

Scene_DLDB_Pad.prototype = Object.create(Scene_Base.prototype);
Scene_DLDB_Pad.prototype.constructor = Scene_DLDB_Pad;

Scene_DLDB_Pad.prototype.create = function() {
    Scene_Base.prototype.create.call(this);
	this.createoption();
};


Scene_DLDB_Pad.prototype.review = function() {
	$dldb_pad._btn_reload();
}

Scene_DLDB_Pad.prototype._btn_back = function() {
	var now = this._select[this._select.length - 1];
	if (now == this._win_no) { DLDB_Pad_Set.set_no(this._no_base) }
	this.review();
	now.active = false;
	now.visible = false;
	this._select.length = this._select.length - 1
	this._select[this._select.length - 1].active = true;
}

Scene_DLDB_Pad.prototype._btn_ok = function() {
	var now = this._select[this._select.length - 1];
	var index = now.index();
	if (now == this._option) {
		if (index == 0) { this._select.push(this._win_key); }
		if (index == 1) { this._no_base = DLDB_Pad_Set.get_no(2, 0, 0); this._select.push(this._win_no); }
		if (index == 2) { this._select.push(this._win_btn_set); }
		if (index == 3) { this._select.push(this._win_btn_set); }
		if (index == 4) { this._select.push(this._win_exit); }
	}
	if (now == this._win_key) {
		this._select.push(this._win_set_key);
	}
	if (now == this._win_btn_set) {
		if (index == 0) { 
			if (this._option.index() == 2) { var t = DLDB_Pad_Set._move.base}
			if (this._option.index() == 3) { var t = DLDB_Pad_Set._btn.base}
			this._win_align._index = t[0] + t[1] * 3;
			this._win_align.select(this._win_align._index);
			this._select.push(this._win_align);
		}
		if (index == 1) { this._no_base = DLDB_Pad_Set.get_no(this._option.index() - 2, 0, 0); this._select.push(this._win_no); }
		if (index == 2) { this._no_base = DLDB_Pad_Set.get_no(this._option.index() - 2, 0, 1); this._select.push(this._win_no); }
		if (index == 3) { this._no_base = DLDB_Pad_Set.get_no(this._option.index() - 2, 0, 2); this._select.push(this._win_no); }
		if (index == 4) { this._no_base = DLDB_Pad_Set.get_no(this._option.index() - 2, 0, 3); this._select.push(this._win_no); }
		if (index == 5) { this._no_base = DLDB_Pad_Set.get_no(this._option.index() - 2, 1, 0); this._select.push(this._win_no); }
		if (index == 6) { this._no_base = DLDB_Pad_Set.get_no(this._option.index() - 2, 1, 1); this._select.push(this._win_no); }
		if (index == 7) { this._no_base = DLDB_Pad_Set.get_no(this._option.index() - 2, 1, 2); this._select.push(this._win_no); }
		if (index == 8) { this._no_base = DLDB_Pad_Set.get_no(this._option.index() - 2, 1, 3); this._select.push(this._win_no); }
	}
	if (now == this._win_no) {
		if (index == 0) { DLDB_Pad_Set.add_no(1) }
		if (index == 1) { DLDB_Pad_Set.add_no(10) }
		if (index == 2) { DLDB_Pad_Set.add_no(100) }
		if (index == 3) { DLDB_Pad_Set.add_no(-1) }
		if (index == 4) { DLDB_Pad_Set.add_no(-10) }
		if (index == 5) { DLDB_Pad_Set.add_no(-100) }
		if (index == 6) { this._no_base = DLDB_Pad_Set.now_no(); }
		this.review();
	}

	if (now == this._win_exit) {
		DLDB_Pad_Set.load = 0;
		if (index == 0) { 
			DLDB_Pad_Set.load = 2;
			DLDB_Pad_Set.save();
		}

		this.popScene();
	}
	if (now == this._win_align) {
		if (this._option.index() == 2) { var t = DLDB_Pad_Set._move.base}
		if (this._option.index() == 3) { var t = DLDB_Pad_Set._btn.base}
		t[1] = Math.floor(index / 3);
		t[0] = index - (t[1] * 3);
		if (this._option.index() == 2) { DLDB_Pad_Set._move.base = t}
		if (this._option.index() == 3) { DLDB_Pad_Set._btn.base = t}
		this.review();
	}
	if (now == this._win_set_key) {
		var n = this._win_set_key.index();
		if (n == 0) {
			var name = ""
		} else {
			var name = this._win_set_key._list[n].name;
		}
		DLDB_Pad_Set._btn_list[2][this._win_key.index()] = name;
	}

	this._select[this._select.length - 1].visible = true;
	this._select[this._select.length - 1].active = true;
	if (this._select.length > 1) { 
		this._select[this._select.length - 2].active = false;
		this._select[this._select.length - 1].x = this._select[this._select.length - 2].x + this._select[this._select.length - 2].width;
	}
}


Scene_DLDB_Pad.prototype.createoption = function() {
	this._option = new Window_Pad_Options();
	this.addChild(this._option);
	this._select = [this._option];
    this._option.setHandler('ok', this._btn_ok.bind(this));

	this._win_key = new Window_Pad_Options_Key();
	this._win_key = this._sub_edit(this._win_key);
    this._win_key.setHandler('ok', this._btn_ok.bind(this));
    this._win_key.setHandler('cancel', this._btn_back.bind(this));
	this.addChild(this._win_key);

	this._win_set_key = new Window_Pad_Set_Key();
	this._win_set_key = this._sub_edit(this._win_set_key);
    this._win_set_key.setHandler('ok', this._btn_ok.bind(this));
    this._win_set_key.setHandler('cancel', this._btn_back.bind(this));
	this.addChild(this._win_set_key);

	this._win_btn_set = new Window_Pad_Options_Btn_Set();
	this._win_btn_set = this._sub_edit(this._win_btn_set);
    this._win_btn_set.setHandler('ok', this._btn_ok.bind(this));
    this._win_btn_set.setHandler('cancel', this._btn_back.bind(this));
	this.addChild(this._win_btn_set);

	this._win_exit = new Window_Pad_Options_Exit();
	this._win_exit = this._sub_edit(this._win_exit);
    this._win_exit.setHandler('ok', this._btn_ok.bind(this));
    this._win_exit.setHandler('cancel', this._btn_back.bind(this));
	this.addChild(this._win_exit);

	this._win_align = new Window_Pad_Options_Align();
	this._win_align = this._sub_edit(this._win_align);
    this._win_align.setHandler('ok', this._btn_ok.bind(this));
    this._win_align.setHandler('cancel', this._btn_back.bind(this));
	this.addChild(this._win_align);

	this._win_no = new Window_Pad_Options_No();
	this._win_no = this._sub_edit(this._win_no);
    this._win_no.setHandler('ok', this._btn_ok.bind(this));
    this._win_no.setHandler('cancel', this._btn_back.bind(this));
	this.addChild(this._win_no);
}

Scene_DLDB_Pad.prototype._sub_view = function(win) {
	this._option.active = false;
	win.active = true;
	win.visible = true;
}

Scene_DLDB_Pad.prototype._sub_edit = function(win) {
	win.x = this._option.width;
	win.active = false;
	win.visible = false;
	return win;
}


function Window_Pad_Options() {
    this.initialize.apply(this, arguments);
}

Window_Pad_Options.prototype = Object.create(Window_Command.prototype);
Window_Pad_Options.prototype.constructor = Window_Pad_Options;

Window_Pad_Options.prototype.makeCommandList = function() {
	this.addCommand("ETC Btn Set", 'ok', true);
	this.addCommand("Size", 'ok', true);
	this.addCommand("Move", 'ok', true);
	this.addCommand("Btn", 'ok', true);
	this.addCommand("Exit", 'ok', true);
};


function Window_Pad_Options_Key() {    this.initialize.apply(this, arguments); }
Window_Pad_Options_Key.prototype = Object.create(Window_Command.prototype);
Window_Pad_Options_Key.prototype.constructor = Window_Pad_Options_Key;

Window_Pad_Options_Key.prototype.makeCommandList = function() {
	this.addCommand("Etc Btn 1", 'ok', true);
	this.addCommand("Etc Btn 2", 'ok', true);
	this.addCommand("Etc Btn 3", 'ok', true);
}

function Window_Pad_Options_Btn_Set() {    this.initialize.apply(this, arguments); }
Window_Pad_Options_Btn_Set.prototype = Object.create(Window_Command.prototype);
Window_Pad_Options_Btn_Set.prototype.constructor = Window_Pad_Options_Btn_Set;
Window_Pad_Options_Btn_Set.prototype.makeCommandList = function() {
	this.addCommand("Align", 'ok', true);
	this.addCommand("Margin Left", 'ok', true);
	this.addCommand("Margin Right", 'ok', true);
	this.addCommand("Margin Top", 'ok', true);
	this.addCommand("Margin bottom", 'ok', true);
	this.addCommand("Btn Margin Left", 'ok', true);
	this.addCommand("Btn Margin Right", 'ok', true);
	this.addCommand("Btn Margin Top", 'ok', true);
	this.addCommand("Btn Margin bottom", 'ok', true);
}

function Window_Pad_Options_Align() {    this.initialize.apply(this, arguments); }
Window_Pad_Options_Align.prototype = Object.create(Window_Command.prototype);
Window_Pad_Options_Align.prototype.constructor = Window_Pad_Options_Btn_Set;
Window_Pad_Options_Align.prototype.makeCommandList = function() {
	this.addCommand("Top - Left", 'ok', true);
	this.addCommand("Top - Center", 'ok', true);
	this.addCommand("Top - Right", 'ok', true);
	this.addCommand("Center - Left", 'ok', true);
	this.addCommand("Center", 'ok', true);
	this.addCommand("Center - Right", 'ok', true);
	this.addCommand("Bottom - Left", 'ok', true);
	this.addCommand("Bottom - Center", 'ok', true);
	this.addCommand("Bottom - Right", 'ok', true);
}

function Window_Pad_Options_No() {    this.initialize.apply(this, arguments); }
Window_Pad_Options_No.prototype = Object.create(Window_Command.prototype);
Window_Pad_Options_No.prototype.constructor = Window_Pad_Options_No;
Window_Pad_Options_No.prototype.makeCommandList = function() {
	this.addCommand("+1", 'ok', true);
	this.addCommand("+10", 'ok', true);
	this.addCommand("+100", 'ok', true);
	this.addCommand("-1", 'ok', true);
	this.addCommand("-10", 'ok', true);
	this.addCommand("-100", 'ok', true);
	this.addCommand("Save", 'ok', true);
}

function Window_Pad_Options_Exit() {    this.initialize.apply(this, arguments); }
Window_Pad_Options_Exit.prototype = Object.create(Window_Command.prototype);
Window_Pad_Options_Exit.prototype.constructor = Window_Pad_Options_Btn_Set;
Window_Pad_Options_Exit.prototype.makeCommandList = function() {
	this.addCommand("Save & Exit", 'ok', true);
	this.addCommand("Exit", 'ok', true);
}

function Window_Pad_Set_Key() {    this.initialize.apply(this, arguments); }
Window_Pad_Set_Key.prototype = Object.create(Window_Command.prototype);
Window_Pad_Set_Key.prototype.constructor = Window_Pad_Options_Btn_Set;
Window_Pad_Set_Key.prototype.makeCommandList = function() {
	var _list = ["up","down","left","right","ok","cancel","shift","menu","pageup","pagedown"];
	this.addCommand("Not", 'ok', true);
	for (var t in Input.keyMapper) {
		var code = Input.keyMapper[t];
		if (_list.indexOf(code) == -1) {
			_list.push(code);
			this.addCommand(code, 'ok', true);
		}
	}
}

