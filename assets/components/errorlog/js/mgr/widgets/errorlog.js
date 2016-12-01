Ext.onReady(function() {
	if (undefined !== (wrapper = document.getElementById('modx-user-menu'))) {
		if (undefined !== (li = document.createElement('li'))) {
			li.id = 'limenu-errorlog';
			li.innerHTML = '<a href="javascript:;" id="errorlog-link" class="errorlog-empty" title="' + _('errorlog.error_log') + '" onclick="ErrorLog.show(); return false;"><i class="icon-exclamation-triangle icon icon-large"></i></a>';
		
			wrapper.insertBefore(li, wrapper.firstChild);
			
			ErrorLog.refresh();
			
			setInterval(function() {
				ErrorLog.refresh();
			}, ErrorLog.config.interval * 1000);
		}
	}
});

ErrorLog.show = function(e) {
	if (this.errorLogWindow) {
		this.errorLogWindow.destroy();
	}
	
	this.errorLogWindow = new MODx.load({
	    xtype		: 'errorlog-window',
		closeAction	: 'close',
		listeners	: {
			'show'		: {
				fn			: function(window) {
					window.setErrorLog();
				},
				scope		: this
			}	
		}
	});
	
	this.errorLogWindow.show(e);
}

ErrorLog.refresh = function() {
	MODx.Ajax.request({
		url			: ErrorLog.config.connector_url,
		params		: {
			action		: 'mgr/errorlog/get',
			lines		: ErrorLog.config.lines
		},
		listeners	: {
			'success'	: {
				fn			: function (data) {
					if (undefined !== (link = Ext.get(Ext.query('#errorlog-link')))) {
						if (data.object.empty) {
							link.addClass('errorlog-empty');
							link.removeClass('errorlog-not-empty');
							
							link.title = _('errorlog.error_log');
						} else {
							link.addClass('errorlog-not-empty');
							link.removeClass('errorlog-empty');
						
							link.title = _('errorlog.error_log') + ' (' + data.object.lines + ')';
						}
					}
				}
			}
		}
	});
}

ErrorLog.window.ShowErrorLog = function(config) {
    config = config || {};

    Ext.applyIf(config, {
	    width		: 800,
		height		: 500,
		title		: _('errorlog.error_log'),
		layout 		: 'form',
		id			: 'errorlog-window',
		stateful	: false,
		items		: [{
        	html		: '<p>' + _('errorlog.error_log_desc') + '</p>',
            cls			: 'panel-desc'
        }, {
			xtype		: 'textarea',
			hideLabel	: true,
			name		: 'log',
			id			: 'window-error-log-content',
			anchor		: '100%',
			height		: '305px',
			readOnly	: true,
			hidden		: true
		}, {
            html		: '<p>' + _('errorlog.error_log_too_large') + '</p>',
            id 			: 'window-error-download-content',
            border		: false,
            hidden		: true
    	}],
		buttons		: [{
			text		: _('ext_refresh'),
			id 			: 'window-error-log-refresh-button',
			hidden 		: true,
			handler		: this.setErrorLog,
			scope		: this
		}, {
			text		: _('errorlog.clear'),
			id 			: 'window-error-log-clear-button',
			hidden 		: true,
			handler		: this.resetErrorLog,
			scope		: this
		}, {
            text		: _('errorlog.error_log_download'),
            id 			: 'window-error-log-download-button',
            hidden 		: true,
            handler 	: this.getErrorLog,
            scope 		: this
		}, {
            text		: _('close'),
            cls			: 'primary-button',
            handler 	: this.close,
            scope 		: this
		}]
	});

    ErrorLog.window.ShowErrorLog.superclass.constructor.call(this, config);
};

Ext.extend(ErrorLog.window.ShowErrorLog, MODx.Window, {
	setErrorLog	: function() {
		var window = this;
		window.getEl().mask(_('working'));
	
		MODx.Ajax.request({
			url			: ErrorLog.config.connector_url,
			params		: {
				action		: 'mgr/errorlog/get',
				lines		: ErrorLog.config.lines,
				content 	: true
			},
			listeners	: {
				'success'	: {
					fn			: function (data) {
						if (data.object.empty) {
							Ext.getCmp('window-error-log-content').setValue('');
							Ext.getCmp('window-error-log-clear-button').disable();
							
							if (undefined !== (link = Ext.get(Ext.query('#errorlog-link')))) {
								link.addClass('errorlog-empty');
								link.removeClass('errorlog-not-empty');
								
								link.title = _('errorlog.error_log');
							}
						} else {
							Ext.getCmp('window-error-log-content').setValue(data.object.log);
							Ext.getCmp('window-error-log-clear-button').enable();
							
							if (undefined !== (link = Ext.get(Ext.query('#errorlog-link')))) {
								link.addClass('errorlog-not-empty');
								link.removeClass('errorlog-empty');
								
								link.title = _('errorlog.error_log') + ' (' + data.object.lines + ')';
							}
						}
						
						if (data.object.tooLarge) {
							Ext.getCmp('window-error-log-content').hide();
							Ext.getCmp('window-error-download-content').show().update(_('errorlog.error_log_too_large', {name: data.object.name}));
							
							Ext.getCmp('window-error-log-refresh-button').hide();
							Ext.getCmp('window-error-log-clear-button').hide();
							Ext.getCmp('window-error-log-download-button').show().setText(_('errorlog.error_log_download', {size: data.object.size}));
						} else {
							Ext.getCmp('window-error-log-content').show();
							Ext.getCmp('window-error-download-content').hide();
							
							Ext.getCmp('window-error-log-refresh-button').show();
							Ext.getCmp('window-error-log-clear-button').show();
							Ext.getCmp('window-error-log-download-button').hide();
						}
						
						window.getEl().unmask();
					}
				}
			}
		});
	},
	resetErrorLog : function() {
		var window = this;
		window.getEl().mask(_('working'));
	
		MODx.Ajax.request({
			url			: MODx.config.connector_url,
			params		: {
				action		: 'system/errorlog/clear'
			},
			listeners	: {
				'success'	: {
					fn			: function (data) {
						if (undefined !== (link = Ext.get(Ext.query('#errorlog-link')))) {
							link.addClass('errorlog-empty');
							link.removeClass('errorlog-not-empty');
							
							link.title = _('errorlog.error_log');
						}
							
						Ext.getCmp('window-error-log-content').show().setValue('');
						
						Ext.getCmp('window-error-log-refresh-button').show();
						Ext.getCmp('window-error-log-clear-button').show().disable();
						Ext.getCmp('window-error-log-download-button').hide();
							
						window.getEl().unmask();
					}
				}
			}
		});
	},
	getErrorLog : function() {
    	location.href = MODx.config.connector_url + '?action=system/errorlog/download&HTTP_MODAUTH=' + MODx.siteId;
	}
});

Ext.reg('errorlog-window', ErrorLog.window.ShowErrorLog);