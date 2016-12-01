var ErrorLog = function(config) {
	config = config || {};
	
	ErrorLog.superclass.constructor.call(this, config);
};

Ext.extend(ErrorLog, Ext.Component, {
	window	: {},
	config	: {},
	button 	: null,
	show	: null,
	refresh	: null
});

Ext.reg('errorlog', ErrorLog);

ErrorLog = new ErrorLog();