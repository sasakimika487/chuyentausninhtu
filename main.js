function 경고(text) {
	alert(text);
};

document.addEventListener("deviceready", init, false);

function init() {
	var dt = new Date(); 
	var month = dt.getMonth()+1; 
	var day = dt.getDate(); 
	var year = dt.getFullYear(); 
	var lasttime = month + '-' + day + '-' + year;
	ConfigManager.load();
	if(AdMob) view_ad();
	SceneManager.run(Scene_Boot);
}


function view_ad() {
	var admobid = {};
	if( /(android)/i.test(navigator.userAgent) ) {
	  admobid = { // for Android
		banner: 'ca-app-pub-7642848480624979/5011161843',
		interstitial: 'ca-app-pub-7642848480624979/1734794641'
	  };
	} else if(/(ipod|iphone|ipad)/i.test(navigator.userAgent)) {
	  admobid = { // for iOS
		banner: 'ca-app-pub-7642848480624979/5011161843',
		interstitial: 'ca-app-pub-7642848480624979/1734794641'
	  };
	} else {
	  admobid = { // for Windows Phone
		banner: 'ca-app-pub-7642848480624979/5011161843',
		interstitial: 'ca-app-pub-7642848480624979/1734794641'
	  };
	}

	document.addEventListener('onAdDismiss', function(e){
		var dt = new Date(); 
		var month = dt.getMonth()+1; 
		var day = dt.getDate(); 
		var year = dt.getFullYear(); 
		var lasttime = month + '-' + day + '-' + year;
		ConfigManager.lasttime = lasttime;
		ConfigManager.save();
	});

	AdMob.createBanner( {
        adId: admobid.banner, 
        isTesting: false,
        overlap: false, 
        offsetTopBar: false, 
        position: AdMob.AD_POSITION.BOTTOM_CENTER,
        autoShow: false,
        bgColor: 'black'
    } );
    
    AdMob.prepareInterstitial({
        adId: admobid.interstitial,
        autoShow: true
    });
}

function read_file(path) {
	window.resolveLocalFileSystemURL(path, function(fileEntry) {
		fileEntry.file(function(file) {
			var reader = new FileReader();
			reader.onloadend = function(e) {
				경고(this.result);
			}
			reader.readAsText(file);
		});
	});
}

function writeToFile(pathName, text) {
	window.resolveLocalFileSystemURL(pathName, function (directoryEntry) {
		directoryEntry.getFile('dldb_player.html', { create: true }, function (fileEntry) {
			fileEntry.createWriter(function (fileWriter) {
				fileWriter.onwriteend = function(e) {
					location.replace(pathName + 'dldb_player.html');
				};
				fileWriter.write(text);
			}, errorHandler.bind(null, "3 : " + pathName));
		}, errorHandler.bind(null, "2 : " + pathName));
	}, errorHandler.bind(null, "1 : " + pathName));
}


var errorHandler = function (fileName, e) {  
    var msg = '';

    switch (e.code) {
        case FileError.QUOTA_EXCEEDED_ERR:
            msg = 'Storage quota exceeded';
            break;
        case FileError.NOT_FOUND_ERR:
            msg = 'File not found';
            break;
        case FileError.SECURITY_ERR:
            msg = 'Security error';
            break;
        case FileError.INVALID_MODIFICATION_ERR:
            msg = 'Invalid modification';
            break;
        case FileError.INVALID_STATE_ERR:
            msg = 'Invalid state';

            break;
        default:
            msg = e.code;
            break;
    };
	
    경고('Error (' + fileName + '): ' + msg);
}
