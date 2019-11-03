function DLDB_Pad() {
    this.initialize.apply(this, arguments);
}

DLDB_Pad.prototype = Object.create(Window.prototype);
DLDB_Pad.prototype.constructor = DLDB_Pad;

DLDB_Pad.prototype.initialize = function() {
	this._size = 100;
	this._press = false;
	this._view = 0;
    Window.prototype.initialize.call(this);
	DLDB_Pad_Set()
	this.btn = [];
	
	for (var _x = 0;_x < DLDB_Pad_Set._btn_x;_x++) {
		for (var _y = 0;_y < DLDB_Pad_Set._btn_y;_y++) {
			this.btn.push(new DLDB_Button("btn",[_x,_y]));
		}
	}

	this.btn.push(new DLDB_Button("move","up"));
	this.btn.push(new DLDB_Button("move","down"));
	this.btn.push(new DLDB_Button("move","left"));
	this.btn.push(new DLDB_Button("move","right"));
	this.btn.push(new DLDB_Button("move","press"));

	for (i = 0;i < this.btn.length ;i++ ) {
		this.addChild(this.btn[i]);
	}
	this._pad_reload = 0;
};

DLDB_Pad.prototype.reload = function() {
	DLDB_Pad_Set();
	this._btn_reload();
}
DLDB_Pad.prototype._btn_reload = function() {
	for (i = 0;i < this.btn.length ;i++ ) {
		this.btn[i]._reload();
		this.addChild(this.btn[i]);
	}
	DLDB_Pad_Set.load = 1;
}

DLDB_Pad.prototype.stop = function() {
		this._view = -1;
		for (i = 0;i < this.btn.length ;i++ ) {
			this.btn[i].callClickEndHandler();
		}
		this.visible = false;
}

DLDB_Pad.prototype.hide = function() {
	this._view = 0;
	if (this.visible == true) {
		for (i = 0;i < this.btn.length ;i++ ) {
			this.btn[i].callClickEndHandler();
		}
		this.visible = false;
	}
}

DLDB_Pad.prototype._press_off = function() {
	this.btn[this.btn.length - 1].opacity = 100;
	$dldb_pad._press = false;
}

DLDB_Pad.prototype.update = function() {
    Window.prototype.update.call(this);
	if (DLDB_Pad_Set.load == 0) { 	this.reload(); }
	if (DLDB_Pad_Set.load == 2) { 	this._btn_reload(); }
	if (!$gameMessage) {
		this.hide();
		return;
	}
	if (this._view > -1) {
		if ($gameMessage.isBusy()) {
			this.hide();
			return;
		}
		if (!this.visible) {
			this._view++;
			if (this._view == 5) this.visible = true;
		}
	}
}

Game_Interpreter.prototype.updateWait = function() {
	if (this.updateWaitCount() || this.updateWaitMode()) {
		$dldb_pad.hide();
		return true;
	}
	return false;
};

	var Scene_Base_start = Scene_Base.prototype.start;


	Scene_Base.prototype.start = function() {
		$dldb_pad = new DLDB_Pad();
		this.addChild($dldb_pad);
		Scene_Base_start.apply(this, arguments);
	};

TouchInput.isTriggered = function() {
	if ($dldb_pad.visible == true) return false;
    return this._triggered;
};

TouchInput.isCancelled = function() {
	if ($dldb_pad.visible == true) return false;
    return this._cancelled;
};

//ADV 기본 버튼형태
	function DLDB_Button() {
		this.initialize.apply(this, arguments);
	}

	DLDB_Button.prototype = Object.create(Sprite.prototype);
	DLDB_Button.prototype.constructor = DLDB_Button;


	DLDB_Button.prototype.initialize = function(_type,arr) {
		Sprite.prototype.initialize.call(this);
		this._now = false;
		this._click = null;
		this._mouseon = null;
		this._mouseoff = null;
		this._touching = false;
		this._press = true;
		this._btn_type = _type;
		this._arr = arr;
		if (this._btn_type == "btn") { this._re_btn(); }
		if (this._btn_type == "move") { this._re_move(); }
	};

	DLDB_Button.prototype._reload = function() {
		if (this._btn_type == "btn") { this._re_btn(); }
		if (this._btn_type == "move") { this._re_move(); }
	}

	DLDB_Button.prototype._re_move = function() {
		var txt = DLDB_Pad_Set.move_txt(this._arr);
		var x = DLDB_Pad_Set.move_x(this._arr);
		var y = DLDB_Pad_Set.move_y(this._arr);
		this.key_type = txt[2];
		this.view_img(txt[0],txt[1],x,y);
	}

	DLDB_Button.prototype._re_btn = function() {
		var txt = DLDB_Pad_Set.btn_txt(this._arr[0],this._arr[1]);
		var x = DLDB_Pad_Set.btn_x(this._arr[1]);
		var y = DLDB_Pad_Set.btn_y(this._arr[0]);
		this.key_type = txt[2];
		this.view_img(txt[0],txt[1],x,y);
	}

	DLDB_Button.prototype.view_img = function(text,text2,x,y) {
		this._size = DLDB_Pad_Set._size;
		Sprite_Base.prototype.initialize.call(this);
		this.bitmap = new Bitmap(this._size,this._size);
		if (!text) { this.visible = false;return; }
		this.visible = true;
		this.x = x;
		this.y = y;
		this.opacity = 100;
	    this.bitmap.fontSize = this._size;
		var t_w = this.bitmap.measureTextWidth("○")
		this.bitmap.drawText("○", 0, 0, this._size, this._size, 'center');
	    this.bitmap.fontSize = this._size / 2;
		if (text2 == false) {
			var t_w = this.bitmap.measureTextWidth(text)
			while(t_w > this._size / 2) {
				this.bitmap.fontSize--;
				t_w = this.bitmap.measureTextWidth(text)
			}
			this.bitmap.drawText(text, 0, 0 , this._size, this._size, 'center');
		} else {
		    this.bitmap.fontSize = Math.floor(this._size / 3);
			var t_w = this.bitmap.measureTextWidth(text)
			this.bitmap.drawText(text, 0, this._size / 10 * 2, this._size, this.bitmap.fontSize, 'center');

			this.bitmap.fontSize = Math.floor(this._size / 7);
			var t_w = this.bitmap.measureTextWidth(text2)
			this.bitmap.drawText(text2, 0, this._size / 10 * 5, this._size, this._size / 10 * 2, 'center');
		}
		if (this.key_type != "press") {
			this._click = function() {
				 Input._currentState[this.key_type] = true;
				 $dldb_pad._press_off();
				 this.check_opacity();
			}
			this._click_e = function() {
				 Input._currentState[this.key_type] = false;
				 this.check_opacity();
			}
			 Input._currentState[this.key_type] = false;
			 this.check_opacity();
		} else {
			this._click = function() {
				this.opacity = 255;
				$dldb_pad._press = true;
			}
		}

	};

DLDB_Button.prototype.check_opacity = function() {
	 if (Input._currentState[this.key_type]) {
		this.opacity = 255;
	 } else {
		this.opacity = 100;
	 }
 }

DLDB_Button.prototype.callClickHandler = function() {
    if (this._click && $dldb_pad.visible == true) {
        this._click();
    }
};

DLDB_Button.prototype.callClickEndHandler = function() {
    if (this._click_e && $dldb_pad.visible == true) {
        this._click_e();
    }
};

DLDB_Button.prototype.isButtonTouched = function() {
    var x = this.canvasToLocalX(TouchInput.x);
    var y = this.canvasToLocalY(TouchInput.y);
    return x >= 0 && y >= 0 && x < this.width && y < this.height;
};

DLDB_Button.prototype.canvasToLocalX = function(x) {
    var node = this;
    while (node) {
        x -= node.x;
        node = node.parent;
    }
    return x;
};

DLDB_Button.prototype.canvasToLocalY = function(y) {
    var node = this;
    while (node) {
        y -= node.y;
        node = node.parent;
    }
    return y;
};


DLDB_Button.prototype.update = function() {
    Sprite.prototype.update.call(this);
	if(TouchInput._screenPressed && $dldb_pad.visible == true) {
		TouchInput._pressedTime = 1;
	}

	if(this.isButtonTouched()) {
		//클릭시 시작 됩니다.
		if (this._touching == false && TouchInput._screenPressed == true){
			if (this.key_type == "press" || !$dldb_pad._press) {
				this.callClickHandler();
				this._touching = true;
				this._press = false;
			} else {
				this.callClickHandler();
				this._touching = true;
				this._press = true;
			}
			
		}
	}
	if (this._touching == true) {
		if (TouchInput._screenPressed == false || !this.isButtonTouched()) {
			if (this.key_type == "press" || !$dldb_pad._press) {
				if (this._press == false) {
					this.callClickEndHandler();
				}
				this._press = false;
				this._touching = false;
			}
		}
	}
};

function DLDB_Pad_Set() {
	if (DLDB_Pad_Set.load == 0) 	{
		DLDB_Pad_Set.setting();
	}
}

StorageManager.dldb_localFilePath = StorageManager.localFilePath;
StorageManager.localFilePath = function(savefileId) {
	if (savefileId == "dldb_keypad") { return this.localFileDirectoryPath() + "dldb_keypad.rpgsave" }
	return StorageManager.dldb_localFilePath(savefileId);
}
DLDB_Pad_Set.setting = function() {
	d = StorageManager.load("dldb_keypad");
	if (d) {
		DLDB_Pad_Set.load_key(d);
	} else {
		DLDB_Pad_Set.base();
	}
	DLDB_Pad_Set.load = 1;
}

DLDB_Pad_Set.load_key = function(t) {
	d = JSON.parse(t);
	DLDB_Pad_Set._size = d._size;
	DLDB_Pad_Set._width = d._width;
	DLDB_Pad_Set._height = d._height;
	DLDB_Pad_Set._move_type = d._move_type;
	DLDB_Pad_Set._move = d._move;
	DLDB_Pad_Set._btn_x = d._btn_x;
	DLDB_Pad_Set._btn_y = d._btn_y;
	DLDB_Pad_Set._btn_list = d._btn_list;
	DLDB_Pad_Set._btn = d._btn;
}

DLDB_Pad_Set.save = function() {
	var save = {};
	save._size = DLDB_Pad_Set._size;
	save._width = DLDB_Pad_Set._width;
	save._height = DLDB_Pad_Set._height;
	save._move_type = DLDB_Pad_Set._move_type;
	save._move = DLDB_Pad_Set._move;
	save._btn_x = DLDB_Pad_Set._btn_x;
	save._btn_y = DLDB_Pad_Set._btn_y;
	save._btn_list = DLDB_Pad_Set._btn_list;
	save._btn = DLDB_Pad_Set._btn;
	StorageManager.save("dldb_keypad", JSON.stringify(save));
}

DLDB_Pad_Set.base = function() {
	var s = Math.min(Graphics.boxWidth / 8, Graphics.boxHeight / 6);
	DLDB_Pad_Set._size = s;
	DLDB_Pad_Set._width = Graphics.boxWidth;
	DLDB_Pad_Set._height = Graphics.boxHeight;
	DLDB_Pad_Set._move_type = 4;
	DLDB_Pad_Set._move = {"base":[0,2], "base_m":[5,5,5,5], "btn_m":[1,1,1,1]	};
	DLDB_Pad_Set._btn_x = 3;
	DLDB_Pad_Set._btn_y = 3;
	DLDB_Pad_Set._btn_list = [["Enter","cancel","pagedown"],["shift","menu","pageup"],["","",""],[],[],[],[],[],[]];
	DLDB_Pad_Set._btn = {	"base":[2,2], "base_m":[5,5,5,5], "btn_m":[1,1,1,1]	}
}

DLDB_Pad_Set.load = 0;

DLDB_Pad_Set.get_no = function(type1,type2,type3) {
	this._set_type = [];
	this._set_type = [type1,type2,type3];
	if (this._set_type[0] == 0) { var n = DLDB_Pad_Set._move }
	if (this._set_type[0] == 1) { var n = DLDB_Pad_Set._btn }
	if (this._set_type[0] == 2) { return DLDB_Pad_Set._size }
	if (this._set_type[0] < 2 && this._set_type[1] == 0) { return n.base_m[this._set_type[2]] }
	if (this._set_type[0] < 2 && this._set_type[1] == 1) { return n.btn_m[this._set_type[2]] }
}

DLDB_Pad_Set.now_no = function() {
	if (this._set_type[0] == 0) { var n = this._move }
	if (this._set_type[0] == 1) { var n = this._btn }
	if (this._set_type[0] == 2) { return DLDB_Pad_Set._size }
	if (this._set_type[0] < 2 && this._set_type[1] == 0) { return n.base_m[this._set_type[2]] }
	if (this._set_type[0] < 2 && this._set_type[1] == 1) { return n.btn_m[this._set_type[2]] }
}

DLDB_Pad_Set.add_no = function(val) {
	if (this._set_type[0] == 0) { var n = this._move }
	if (this._set_type[0] == 1) { var n = this._btn }
	if (this._set_type[0] == 2) { 
		var n = DLDB_Pad_Set._size += val;
		if (n < 10) { n = 10; }
		DLDB_Pad_Set._size = n;
	}
	if (this._set_type[0] < 2 && this._set_type[1] == 0) { n.base_m[this._set_type[2]] += val }
	if (this._set_type[0] < 2 && this._set_type[1] == 1) { n.btn_m[this._set_type[2]] += val}
}

DLDB_Pad_Set.set_no = function(val) {
	if (this._set_type[0] == 0) { var n = this._move }
	if (this._set_type[0] == 1) { var n = this._btn }
	if (this._set_type[0] == 2) { DLDB_Pad_Set._size = val}
	if (this._set_type[0] < 2 && this._set_type[1] == 0) { n.base_m[this._set_type[2]] = val }
	if (this._set_type[0] < 2 && this._set_type[1] == 1) { n.btn_m[this._set_type[2]] = val}
}


DLDB_Pad_Set.btn_x = function(_x) {
	return this.get_x(this._btn, _x, this._btn_x);
}

DLDB_Pad_Set.move_x = function(txt) {
	if (txt == "up" || txt == "down" || txt == "press") { return this.get_x(this._move, 1, 3); }
	if (txt == "left") { return this.get_x(this._move, 0, 3); }
	if (txt == "right") { return this.get_x(this._move, 2, 3); }
}

DLDB_Pad_Set.get_x = function(_b, _x, _x_c) {
	var w = 0;
	var s = (this._size + _b.btn_m[0] + _b.btn_m[1]) * _x_c + _b.base_m[0] + _b.base_m[1];
	if (_b.base[0] == 1) { w = this._width / 2 }
	if (_b.base[0] == 2) { w = this._width }

	if (_b.base[0] == 1) { w -= s / 2 }
	if (_b.base[0] == 2) { w -= s }
	w = w + _b.btn_m[0] + _b.base_m[0] + (this._size + _b.btn_m[0] + _b.btn_m[1]) * _x;
	return w
}

DLDB_Pad_Set.btn_y = function(_y) {
	return this.get_y(this._btn, _y, this._btn_y);
}

DLDB_Pad_Set.move_y = function(txt) {
	if (txt == "left" || txt == "right" || txt == "press") { return this.get_y(this._move, 1, 3); }
	if (txt == "up") { return this.get_y(this._move, 2, 3); }
	if (txt == "down") { return this.get_y(this._move, 0, 3); }
}

DLDB_Pad_Set.get_y = function(_b, _y, _y_c) {
	var w = 0;
	var s = (this._size + _b.btn_m[2] + _b.btn_m[3]) * _y_c + _b.base_m[2] + _b.base_m[3];
	if (_b.base[1] == 1) { w = this._height / 2 }
	if (_b.base[1] == 2) { w = this._height }

	if (_b.base[1] == 1) { w = w - (s / 2) }
	if (_b.base[1] == 2) { w = w - s }
	w = w + _b.btn_m[2] + _b.base_m[2] + (this._size + _b.btn_m[2] + _b.btn_m[3]) * (_y_c - _y - 1);
	return w
}

DLDB_Pad_Set.btn_txt = function(_x,_y) {
	var txt = [];
	txt[1] = this._btn_list[_x][_y];
	if (txt[1] == "Enter") { return["A","Enter",'ok']};
	if (txt[1] == "cancel") { return["B",'cancel','cancel']};
	if (txt[1] == "shift") { return["X",'shift','shift']};
	if (txt[1] == "menu") { return["Y",'menu','menu']};
	if (txt[1] == "pageup") { return["L",'pageup','pageup']};
	if (txt[1] == "pagedown") { return["R",'pagedown','pagedown']};
	txt[2] = txt[1];
	txt[0] = txt[1];
	txt[1] = "";
	return txt;
}

DLDB_Pad_Set.move_txt = function(name) {
	var txt = [];
	txt[2] = name;
	txt[1] = false;
	if (txt[2] == "up") { txt[0] = "↑"}
	if (txt[2] == "down") { txt[0] = "↓"}
	if (txt[2] == "left") { txt[0] = "←"}
	if (txt[2] == "right") { txt[0] = "→"}
	if (txt[2] == "press") { txt[0] = "press"}
	return txt;
}

DLDB_Pad_Set.prototype.btn_size = function() {
	return this._size;
}
