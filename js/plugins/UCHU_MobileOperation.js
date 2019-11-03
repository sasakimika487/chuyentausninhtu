//=============================================================================
// UCHU_MobileOperation.js
// Version: 1.0.0
//=============================================================================

/*:
@plugindesc
スマホ操作用プラグイン。横持ち/縦持ちに対応した仮想ボタン、
タッチ操作の方法を追加拡張し、スマホプレイを快適にします。
@author
uchuzine
@help
UCHU_MobileOperation (Version: 1.0.0)
------------------------------------------------------------------------------
■特徴
------------------------------------------------------------------------------
プラグイン作成にあたり、por Masked氏のMBS_MobileDirPad.jsを参考にしています。

○本プラグインの特徴
・ゲーム画面外(黒帯部分)にボタンを設置するため、プレイ画面に干渉しにくい
・パッドやボタンは個別に表示／非表示の切り替えが可能
・ボタンの基準点を画面四隅のいずれかに指定でき、縦持ち操作に対応可能
・方向パッドの操作性を重視し、タッチ判定領域、斜め方向の感度など調整可能
　（詳細は下記の説明を参照）
・方向パッドによる移動と、デフォルトの目的地タッチによる移動を併用可能
・特定のタッチ操作、ジェスチャーによるボタン操作の拡張

これらを利用し、

・仮想十字キーは使わずに、MENUボタンと決定ボタンのみ使用
・ボタンは全て使用せず、画面長押しでオート連打、画面外タッチでメニュー呼出

といった使い方もできます。

------------------------------------------------------------------------------
■一部のパラメータの説明
------------------------------------------------------------------------------
▼ DPad OpelationRange（方向パッド作動領域）‥‥
方向パッド画像の表示サイズに対する、タッチ判定領域の大きさを倍率で指定します。
数値を上げても見た目は変わりませんが、画像の中心から外側に判定が広がります。
例）
「1」のとき‥‥画像のサイズがタッチ判定の大きさになる（画像の内接円の中のみ）
「2」のとき‥‥タッチ判定の大きさが縦横２倍になる（画像の外側に50%ずつ広がる）

数値を上げることで操作ミスを防ぎ、操作性を上げることができますが
上げ過ぎて他のボタン等に重なってしまわないように注意してください。

▼ DPad DiagonalRange（方向パッドの斜め方向範囲）‥‥
方向の判定は、パッド画像の対角線を境界線にして上下左右に分けていますが、
この数値を上げると、対角線上をタッチしたときにその両側の方向がオンになり
（「右」＋「上」など）、８方向判定ができるようになります。
８方向移動のプラグインを使用している時などは、この数値を設定してください。

数値の大きさが斜め判定角度の広さとなり、「0～1」の範囲で指定します
例)
「0」のとき‥‥上下左右の４方向のみ入力可能。
「0.5」のとき‥均等８分割の８方向入力が可能。
「1」のとき‥‥「右上」「右下」「左上」「左下」の４方向入力。

数値を上げるほど、「上を押すつもりが右上になっていた」等のミスが起こるため
４方向で問題ない場合は、「0」を指定すると操作ミスが最小限になります。

------------------------------------------------------------------------------
■パッド、ボタン画像について
------------------------------------------------------------------------------
・画像ファイルは任意のサイズで作成可能ですが、縦横比1:1で作成してください。
　表示の際は、「DPad Size」で指定したpixel数にリサイズされます。
　ボタン画像も同様です。
・方向パッドのグラフィックの中心が画像の中心になるようにしてください。



@param ---PC Option---
@default

@param PC BtnDisplay
@desc PCで実行時も、仮想ボタンを表示する:true しない:false
初期値:false
@default false

@param PC TouchExtend
@desc PCで実行時も、タッチの操作拡張を有効にする:true しない:false
初期値:true;
@default true

@param ---File Path---
@default

@param DPad Image
@desc 方向パッド画像のファイルパス
@default ./img/system/DirPad.png

@param ActionBtn Image
@desc 決定ボタン画像のファイルパス
@default ./img/system/ActionButton.png

@param CancelBtn Image
@desc キャンセル（メニュー）ボタン画像のファイルパス
@default ./img/system/CancelButton.png

@param ---Button Customize---
@default

@param Button Opacity
@desc ボタンの不透明度(0～1) 初期値:0.7
@default 0.7

@param Vertical BtnZoom
@desc スマホ縦持ちで表示したときの全ボタンの拡大率
初期値:1.7
@default 1.7

@param Tablet BtnZoom
@desc タブレット横持ちで表示したときの全ボタンの拡大率
初期値:0.8
@default 0.8

@param TabVertical BtnZoom
@desc タブレット縦持ちで表示したときの全ボタンの拡大率
初期値:1.1
@default 1.1

@param HideButton OnMessage
@desc 画面下部にメッセージ表示時、仮想ボタンの表示順位をゲーム画面の下に下げる:true そのまま:false
初期値:true
@default true

@param DPad Visible
@desc 方向パッドを表示する：true しない:false  初期値:true
@default true

@param DPad Size
@desc 方向パッドの大きさ(px）。 初期値:90
@default 200

@param DPad Margin
@desc 方向パッド画像の位置。画面端からの隙間の大きさで指定。
 (左からの幅; 下からの幅) 初期値:10; 10
@default 10; 10

@param DPad Orientation
@desc 方向パッドの基準位置を、左下以外に変えたい場合。
left か right; top か bottom で指定。 初期値:left; bottom
@default left; bottom

@param DPad OpelationRange
@desc 方向パッド画像に対する、タッチの作動範囲(倍率、1～)
画像の外側にタッチ判定を広げ、操作ミスを防ぐ。初期値:1.3
@default 1.3

@param DPad DiagonalRange
@desc 方向パッド斜め方向の判定の広さ(0～1)。斜めに入りやすくする程、操作がブレやすくなる。4方向でよい場合は0に。初期値:0.3;
@default 0.3

@param ActionBtn Visible
@desc 決定ボタンを表示する:true しない:false  初期値:true
@default true

@param ActionBtn Size
@desc 決定ボタンの大きさ(px）。 初期値:100
@default 100

@param ActionBtn Margin
@desc 決定ボタンの位置。画面端からの隙間の大きさで指定。
 (右からの幅; 下からの幅) 初期値:10; 90
@default 10; 90

@param ActionBtn Orientation
@desc 決定ボタンの基準位置を、右下以外に変えたい場合。
left か right; top か bottom で指定。 初期値:right; bottom
@default right; bottom

@param CancelBtn Visible
@desc キャンセル（メニュー）ボタンを表示する:true しない:false
初期値:true
@default true

@param CancelBtn Size
@desc キャンセルボタンの大きさ(px）。 初期値:100
@default 100

@param CancelBtn Margin
@desc キャンセルボタンの位置。画面端からの隙間の大きさで指定。
 (右からの幅; 下からの幅) 初期値:110; 10
@default 110; 10

@param CancelBtn Orientation
@desc キャンセルボタンの基準位置を、右下以外に変えたい場合。
left か right; top か bottomで指定。 初期値:right; bottom
@default right; bottom


@param ---TouchInput Extend---
@default 

@param Flick PageUp-PageDown
@desc 画面上を左右にフリックすると、PageUp/PageDown操作になる。
ステータス画面でキャラを切り替えたい時などに。初期値:true
@default true

@param HoldCanvas ActionBtn
@desc 画面を長押しすると、決定ボタンを押した状態になる。
初期値:true
@default true

@param OutCanvas CancelBtn
@desc ゲーム画面外の黒帯部分全体が、キャンセルボタン扱いになる。
初期値:false
@default false

@param OutCanvas ActionBtn
@desc ゲーム画面外の黒帯部分全体が、決定ボタン扱いになる。
初期値:false
@default false
*/

var Imported = Imported || {};
Imported.UCHU_MobileOperation = "1.0.0";

var UCHU_MobileOperation = {};

(function() {
    "use strict";
	
	//-----------------------------------------------------------------------------
	// Setup
	
	var Parameters = PluginManager.parameters('UCHU_MobileOperation');
	var PRM = PRM || {};
	
	PRM.url=[];
	PRM.visible=[];
	PRM.size=[];
	PRM.pos=[];
	PRM.spot=[];
	
	PRM.pcBtn = Boolean(Parameters["PC BtnDisplay"] === 'true' || false);
	PRM.pcExt = Boolean(Parameters["PC TouchExtend"] === 'true' || false);
	PRM.url[0] = String(Parameters["DPad Image"]);
	PRM.url[1] = String(Parameters["ActionBtn Image"]);
	PRM.url[2] = String(Parameters["CancelBtn Image"]);
	PRM.opacity = Number(Parameters["Button Opacity"]);
	PRM.vZoom = Number(Parameters["Vertical BtnZoom"]);
	PRM.tabZoom = Number(Parameters["Tablet BtnZoom"]);
	PRM.tabvZoom = Number(Parameters["TabVertical BtnZoom"]);
	PRM.hideBtn = Boolean(Parameters["HideButton OnMessage"] === 'true' || false);
	PRM.visible[0] = Boolean(Parameters["DPad Visible"] === 'true' || false);
	PRM.size[0] = Number(Parameters["DPad Size"]);
	PRM.pos[0] =Parameters["DPad Margin"].split(";");
	PRM.spot[0] = Parameters["DPad Orientation"].split(";");
	PRM.pad_scale = Number(Parameters["DPad OpelationRange"]);
	PRM.pad_dia = Math.max(0,Math.min(1,(1-Number(Parameters["DPad DiagonalRange"]))));
	PRM.visible[1] = Boolean(Parameters["ActionBtn Visible"] === 'true' || false);
	PRM.size[1] = Number(Parameters["ActionBtn Size"]);
	PRM.pos[1] = Parameters["ActionBtn Margin"].split(";");
	PRM.spot[1] = Parameters["ActionBtn Orientation"].split(";");
	PRM.visible[2] = Boolean(Parameters["CancelBtn Visible"] === 'true' || false);
	PRM.size[2] = Number(Parameters["CancelBtn Size"]);
	PRM.pos[2] = Parameters["CancelBtn Margin"].split(";");
	PRM.spot[2] = Parameters["CancelBtn Orientation"].split(";");
	PRM.flickpage = Boolean(Parameters["Flick PageUp-PageDown"] === 'true' || false);
	PRM.holdaction = Boolean(Parameters["HoldCanvas ActionBtn"] === 'true' || false);
	PRM.outcansel = Boolean(Parameters["OutCanvas CancelBtn"] === 'true' || false);
	PRM.outaction = Boolean(Parameters["OutCanvas ActionBtn"] === 'true' || false);
	
	var btn_id=["DirPad","ok","escape"];
	var current_zoom=1;	
	var st_x = 0;
	var st_y = 0;
	var pad_range=PRM.size[0]*PRM.pad_scale;
	var pad_size=pad_range*current_zoom/2;
	var Btn_ready=false;
	var Btn_hide=false;
	var PressBtn=false;
	var dirx=0;
	var diry=0;
	var autofire=false;
	var hvzoom=[1, PRM.vZoom];
	var ua = (function(u){
	  return {
	    Tablet:(u.indexOf("windows") != -1 && u.indexOf("touch") != -1) || u.indexOf("ipad") != -1 || (u.indexOf("android") != -1 && u.indexOf("mobile") == -1) || (u.indexOf("firefox") != -1 && u.indexOf("tablet") != -1) || u.indexOf("kindle") != -1 || u.indexOf("silk") != -1 || u.indexOf("playbook") != -1
	  };
	})(window.navigator.userAgent.toLowerCase());

	if(ua.Tablet){
		hvzoom=[PRM.tabZoom, PRM.tabvZoom];
	}
	if (!Utils.isMobileDevice() && !PRM.pcBtn) {PRM.visible[0]=PRM.visible[1]=PRM.visible[2]=false;}

	//-----------------------------------------------------------------------------
	// Locate_DirPad

	function Locate_DirPad() {
		this.initialize.apply(this, arguments);
	}


	Locate_DirPad.prototype.initialize = function() {
		var img = new Image();
		var url = PRM.url[0];
		img.onerror = function() {Graphics.printError('DirPad Image was Not Found:',url);};
		img.src = url;
		img = null;
		this.Div = document.createElement("div");
		this.Div.id = 'Dirpad';
		this.Div.style.position = 'fixed';
		this.Div.style[PRM.spot[0][0].replace(/\s+/g, "")] = String(PRM.pos[0][0]-(pad_range-PRM.size[0])/2)+'px';
		this.Div.style[PRM.spot[0][1].replace(/\s+/g, "")] = String(PRM.pos[0][1]-(pad_range-PRM.size[0])/2)+'px';
		this.Div.style.width = pad_range+'px';
		this.Div.style.height = pad_range+'px';
		this.Div.style.opacity = PRM.opacity;
		this.Div.style.zIndex = '4';
		this.Div.style.userSelect="none";
		this.Div.style["-webkit-tap-highlight-color"]="rgba(0,0,0,0)";
		this.Div.style.background = 'url('+PRM.url[0]+') 50% 50% / '+String(Math.round(PRM.size[0]/pad_range*100))+'% no-repeat';
		
		if(!Utils.isMobileDevice() && PRM.pcBtn){
			this.Div.addEventListener('mousedown', function(e) {
			  dirope(e.layerX,e.layerY);PressBtn=true;
			}, false);
			this.Div.addEventListener('mouseover', function(e) {
			  if(TouchInput.isPressed()){dirope(e.layerX,e.layerY);PressBtn=true;}
			}, false);
			this.Div.addEventListener('mousemove', function(e) {
			  if(TouchInput.isPressed()){dirope(e.layerX,e.layerY);PressBtn=true;}
			}, false);
			this.Div.addEventListener('mouseup', function(e) {
				disope();PressBtn=false;
			}, false);
			this.Div.addEventListener('mouseout', function(e) {
				disope();PressBtn=false;
			}, false);	
		}
		this.Div.addEventListener('touchstart', function(e) {
			PressBtn=true;
			dirope(e.touches[0].clientX-dirx, e.touches[0].clientY-diry);
		}, false);
		this.Div.addEventListener('touchmove', function(e) {
			dirope(e.touches[0].clientX-dirx, e.touches[0].clientY-diry);
			PressBtn=true;
		}, false);
		this.Div.addEventListener('touchend', function(event) {
			disope();PressBtn=false;
		}, false);
			document.body.appendChild(this.Div);
	};
	
	function dirope(xx,yy) {
		var touchx=(xx-pad_size)/pad_size;
		var touchy=(yy-pad_size)/pad_size;
		if(Math.sqrt(touchx*touchx+touchy*touchy)>1){disope();
		}else{
			if(touchx>Math.abs(touchy)*PRM.pad_dia){Input._currentState['right']=true;Input._currentState['left']=false;}
			else if(touchx<-Math.abs(touchy)*PRM.pad_dia){Input._currentState['left']=true;Input._currentState['right']=false;}
			else{Input._currentState['left']=false;Input._currentState['right']=false;}
			if(touchy>Math.abs(touchx)*PRM.pad_dia){Input._currentState['down']=true;Input._currentState['up']=false;}
			else if(touchy<-Math.abs(touchx)*PRM.pad_dia){Input._currentState['up']=true;Input._currentState['down']=false;}
			else{Input._currentState['up']=false;Input._currentState['down']=false;}
		}
	}
	function disope() {
		Input._currentState['up']=false;
		Input._currentState['down']=false;
		Input._currentState['left']=false;
		Input._currentState['right']=false;
	}
	
	//-----------------------------------------------------------------------------
	// Locate_Button

	function Locate_Button() {
		this.initialize.apply(this, arguments);
	}
	Locate_Button.prototype.initialize = function(type) {
		var img = new Image();
		var url = PRM.url[type];
		img.onerror = function() {Graphics.printError('Button Image was Not Found:',url);};
		img.src = url;
		img = null;
		this.Div = document.createElement("div");
		this.Div.id = btn_id[type]+'Btn';
		this.Div.style.position = 'fixed';
		this.Div.style[PRM.spot[type][0].replace(/\s+/g, "")] = PRM.pos[type][0]+'px';
		this.Div.style[PRM.spot[type][1].replace(/\s+/g, "")] = PRM.pos[type][1]+'px';
		this.Div.style.width = PRM.size[type]+'px';
		this.Div.style.height = PRM.size[type]+'px';
		this.Div.style.opacity = PRM.opacity;
		this.Div.style.zIndex = '4';
		this.Div.style.userSelect="none";
		this.Div.style.background = 'url('+PRM.url[type]+') 0 0 / cover no-repeat';
		
		if(!Utils.isMobileDevice() && PRM.pcBtn){
			this.Div.addEventListener('mousedown', function(e) {
				Input._currentState[btn_id[type]] = true;PressBtn=true;
			}, false);
			this.Div.addEventListener('mouseover', function(e) {
			  if(TouchInput.isPressed()){Input._currentState[btn_id[type]] = true;PressBtn=true;return false;}
			}, false);
			this.Div.addEventListener('mouseup', function(e) {
			  Input._currentState[btn_id[type]] = false;PressBtn=false;
			}, false);
			this.Div.addEventListener('mouseout', function(e) {
			  Input._currentState[btn_id[type]] = false;PressBtn=false;
			}, false);
		}
		
		this.Div.addEventListener('touchstart', function(e) {
			Input._currentState[btn_id[type]] = true;PressBtn=true;
		}, false);
		this.Div.addEventListener('touchend', function(e) {
			Input._currentState[btn_id[type]] = false;PressBtn=false;
		}, false);
		
		document.body.appendChild(this.Div);
	};	

	//-----------------------------------------------------------------------------
	// Replace function
			
	var Scene_Base_start = Scene_Base.prototype.start;
	Scene_Base.prototype.start = function() {
		Scene_Base_start.apply(this, arguments);
	    if (Utils.isMobileDevice() || PRM.pcBtn) {
			if(!Btn_ready){
				Btn_ready=true;
				if(PRM.visible[0]){this.DirPad = new Locate_DirPad();}
				if(PRM.visible[1]){this.okButton = new Locate_Button(1);}
				if(PRM.visible[2]){this.canselButton = new Locate_Button(2);}
				Graphics._updateRealScale();
				document.documentElement.style["-webkit-user-select"]="none";
				document.addEventListener("touchmove", function(evt) {evt.preventDefault();}, false);
			}
		}
	};
		
	if(PRM.visible[0] || PRM.visible[1] || PRM.visible[2]){
	
		var Game_Temp_setDestination = Game_Temp.prototype.setDestination;
		Game_Temp.prototype.setDestination = function(x, y) {
			Game_Temp_setDestination.apply(this, arguments);
			if(PressBtn){
				this._destinationX = null;
				this._destinationY = null;
			}
		};
		
		var Graphics_updateRealScale = Graphics._updateRealScale;
		Graphics._updateRealScale = function() {
			Graphics_updateRealScale.apply(this, arguments);
			if (this._stretchEnabled) {
				if(document.getElementById("Dirpad")){
				if(window.innerWidth<window.innerHeight){current_zoom=hvzoom[1];}else{current_zoom=hvzoom[0];}
					pad_size=pad_range*current_zoom/2;
					if(PRM.visible[0]){
						document.getElementById("Dirpad").style.zoom=current_zoom;
						dirx=document.getElementById("Dirpad").offsetLeft*current_zoom;
						diry=document.getElementById("Dirpad").offsetTop*current_zoom;
					}
					if(PRM.visible[1]){document.getElementById("okBtn").style.zoom=current_zoom;}
					if(PRM.visible[2]){document.getElementById("escapeBtn").style.zoom=current_zoom;}
				}
			}
		};
	}
	
	//-----------------------------------------------------------------------------
	// Option

	if(PRM.hideBtn){
		Scene_Base.prototype.hideUserInterface = function() {
			if (Utils.isMobileDevice() || PRM.pcBtn) {Btn_hide=true;
				if(PRM.visible[0]){document.getElementById("Dirpad").style.zIndex = '0';}
				if(PRM.visible[1]){document.getElementById("okBtn").style.zIndex = '0';}
				if(PRM.visible[2]){document.getElementById("escapeBtn").style.zIndex = '0';}
			}
		};
		Scene_Base.prototype.showUserInterface = function() {
			if (Utils.isMobileDevice() && !Btn_hide || PRM.pcBtn && !Btn_hide) {
				if(PRM.visible[0]){document.getElementById("Dirpad").style.zIndex = '4';}
				if(PRM.visible[1]){document.getElementById("okBtn").style.zIndex = '4';}
				if(PRM.visible[2]){document.getElementById("escapeBtn").style.zIndex = '4';}
			}
		};
	
		var Scene_Map_createMessageWindows = Scene_Map.prototype.createMessageWindow;
		var Scene_Map_processMapTouch = Scene_Map.prototype.processMapTouch;
		var Scene_Map_terminate = Scene_Map.prototype.terminate;
		
		Scene_Map.prototype.createMessageWindow = function() {
			Scene_Map_createMessageWindows.call(this);
			var oldStartMessage = this._messageWindow.startMessage;
			var oldTerminateMessage = this._messageWindow.terminateMessage;
			var scene = this;
			
			this._messageWindow.startMessage = function() {	
				oldStartMessage.apply(this, arguments);
				if($gameMessage.positionType()==2){
					scene.hideUserInterface();
				}
			};
			Window_Message.prototype.terminateMessage = function() {
				oldTerminateMessage.apply(this, arguments);
				Btn_hide=false;
				setTimeout("Scene_Base.prototype.showUserInterface();", 200);
			};
		};
		
		var Scene_Battle_createMessageWindow = Scene_Battle.prototype.createMessageWindow;
		Scene_Battle.prototype.createMessageWindow = function() {
			Scene_Battle_createMessageWindow.call(this);
			var oldStartMessage = this._messageWindow.startMessage;
			var oldTerminateMessage = this._messageWindow.terminateMessage;
			var scene = this;
			this._messageWindow.startMessage = function() {
				oldStartMessage.apply(this, arguments);
				if($gameMessage.positionType()==2){
					scene.hideUserInterface();
				}
			};
			Window_Message.prototype.terminateMessage = function() {
				oldTerminateMessage.apply(this, arguments);
				Btn_hide=false;
				setTimeout("Scene_Base.prototype.showUserInterface();", 200);
			};
		};
	}

	if(Utils.isMobileDevice() || PRM.pcExt){
		
		if(PRM.holdaction){
			var TouchInput_update = TouchInput.update;
			TouchInput.update = function() {
				TouchInput_update.apply(this, arguments);
				if (this.isPressed()) {
					if(PRM.holdaction && this._pressedTime==24 && !PressBtn){Input._currentState['ok']=true;autofire=true;}
				}else if(autofire){
					autofire=false;
					Input._currentState['ok']=false;
				}
			};
		}
		
		if(PRM.flickpage || PRM.outcansel || PRM.outaction){
			TouchInput._endRequest= function(type) {
				Input._currentState[type]=false;
			}
			if(Utils.isMobileDevice()){
				var TouchInput_onTouchStart = TouchInput._onTouchStart;
				TouchInput._onTouchStart = function(event) {
				    TouchInput_onTouchStart.apply(this, arguments);
					var touch = event.changedTouches[0];
					st_x = Graphics.pageToCanvasX(touch.pageX);
					st_y = Graphics.pageToCanvasY(touch.pageY);
				    if(!PressBtn){
						if(st_x<0 || st_y<0 || st_x>Graphics.boxWidth || st_y>Graphics.boxHeight){
							if(PRM.outcansel){Input._currentState['escape']=true;setTimeout("TouchInput._endRequest('escape');", 100);}
							if(PRM.outaction){Input._currentState['ok']=true;setTimeout("TouchInput._endRequest('ok');", 100);}
						}
					}
				};
			}else{
				var TouchInput_onLeftButtonDown = TouchInput._onLeftButtonDown;
				TouchInput._onLeftButtonDown = function(event) {
					TouchInput_onLeftButtonDown.apply(this, arguments);
					st_x = Graphics.pageToCanvasX(event.pageX);
					st_y = Graphics.pageToCanvasY(event.pageY);
					if(!PressBtn){
						if(st_x<0 || st_y<0 || st_x>Graphics.boxWidth || st_y>Graphics.boxHeight){
							if(PRM.outcansel){Input._currentState['escape']=true;setTimeout("TouchInput._endRequest('escape');", 100);}
							if(PRM.outaction){Input._currentState['ok']=true;setTimeout("TouchInput._endRequest('ok');", 100);}
						}
					}
				};
			}
		}
			
		if(PRM.flickpage){

			var TouchInput_onMove = TouchInput._onMove;
			TouchInput._onMove = function(x, y) {
				TouchInput_onMove.apply(this, arguments);
				if((st_x-x)<-50 && Math.abs(st_y-y)<100 ){st_y=9999;Input._currentState['pageup']=true;setTimeout("TouchInput._endRequest('pageup');", 100);}
				if((st_x-x)>50 && Math.abs(st_y-y)<100 ){st_y=9999;Input._currentState['pagedown']=true;setTimeout("TouchInput._endRequest('pagedown');", 100);}
			}
		}
	}	
})();

