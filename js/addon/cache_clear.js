if (!DataManager._oldPreCacheWiper_loadMapData) {
	DataManager._oldPreCacheWiper_loadMapData = DataManager.loadMapData;
	DataManager.loadMapData = function(mapId) {
		if (typeof(DataManager._lastSeenMap) == "undefined") {
			DataManager._lastSeenMap = -1;
		}
		if (mapId != DataManager._lastSeenMap) {
			// Purge image data:
			ImageManager.clear();
			// Remember new map id:
			DataManager._lastSeenMap = mapId;
		}
		return DataManager._oldPreCacheWiper_loadMapData(mapId);
	}
}
