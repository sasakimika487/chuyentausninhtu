if (!global) var global = {};
for (i = 0;i < $plugins.length ; i++ ) {
	if ($plugins[i].name == "liply_preload") $plugins[i].status = false 
	if ($plugins[i].name == "MadeWithMv") $plugins[i].status = false 
}