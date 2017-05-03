Ext.onReady(function() {
	if (undefined !== (wrapper = document.getElementById('modx-user-menu'))) {
		if (undefined !== (li = document.createElement('li'))) {
			li.id = 'limenu-errorlog';
			li.innerHTML = '<div id="error-log" class="error-log-empty">' + 
				'<a href="javascript:;" id="error-log-refresh" title="' + _('error_log') + '" onclick="ErrorLog.refresh(true); return false;">' +
					'<i class="icon-check-circle icon icon-large"></i>' +
				'</a>' +
				'<a href="javascript:;" id="error-log-show" title="' + _('error_log') + '" onclick="ErrorLog.show(); return false;">' +
					'<i class="icon-exclamation-triangle icon icon-large"></i>' +
				'</a>' +
			'</div>';
		
			wrapper.insertBefore(li, wrapper.firstChild);
			
			ErrorLog.refresh();
			
			setInterval(function() {
				ErrorLog.refresh(false);
			}, ErrorLog.config.interval * 1000);
		}
	}
});

ErrorLog.window.ShowErrorLog = function(config) {
    config = config || {};

    Ext.applyIf(config, {
	    width		: 800,
		height		: 500,
		title		: _('error_log'),
		layout 		: 'form',
		items		: [{
        	html		: '<p>' + _('error_log_desc') + '</p>',
            cls			: 'panel-desc'
        }, {
			xtype		: 'textarea',
			hideLabel	: true,
			name		: 'log',
			id			: 'window-error-log-content',
			anchor		: '100%',
			readOnly	: true,
			hidden		: true,
			listeners	: {
				'afterrender'	: {
	                fn			: function(elem) {
	                    this.setTextareaHeight(elem);
	                },
	                scope		: this
	            }
            }
		}, {
            html		: '<p>' + _('error_log_too_large') + '</p>',
            id 			: 'window-error-log-download',
            border		: false,
            hidden		: true
    	}],
		buttons		: [{
			text		: _('ext_refresh'),
			id 			: 'window-error-log-button-refresh',
			hidden 		: true,
			handler		: this.setErrorLog,
			scope		: this
		}, {
            text		: _('error_log_download'),
            id 			: 'window-error-log-button-download',
            hidden 		: true,
            handler 	: this.getErrorLog,
            scope 		: this
		}, {
			text		: _('clear'),
			id 			: 'window-error-log-button-clear',
			handler		: this.resetErrorLog,
			scope		: this
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
	setTextareaHeight: function(elem) {
		var panelHeight 	= parseInt(this.el.select('.x-window-body').first().getHeight());
		var panelPaddingTop = parseInt(this.el.select('.x-window-body').first().getStyle('padding-top').slice(0, -2));
		var panelPaddingBot = parseInt(this.el.select('.x-window-body').first().getStyle('padding-bottom').slice(0, -2));
		
		var panelDescHeight	= parseInt(this.el.select('.panel-desc').first().getHeight());
		var panelDescMargin	= parseInt(this.el.select('.panel-desc').first().getStyle('margin-bottom').slice(0, -2));
		
		var elementMargin	=  parseInt(this.el.select('.x-form-item').first().getStyle('margin-bottom').slice(0, -2)) - panelPaddingBot;
		
		elem.el.setHeight(panelHeight - (panelPaddingTop + panelPaddingBot) - (panelDescHeight + panelDescMargin) - elementMargin);
	},
	getContent: function(type) {
		return Ext.getCmp('window-error-log-' + type);
	},
	getButton: function(type) {
		return Ext.getCmp('window-error-log-button-' + type);
	},
	setErrorLog	: function() {
		this.getEl().mask(_('working'));
	
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
							if (undefined !== (link = Ext.get(Ext.query('#error-log')))) {
								link.addClass('error-log-empty').removeClass('error-log-not-empty');
							}
							
							this.getContent('content').show().setValue('');
							
							this.getButton('refresh').show();
							this.getButton('clear').disable();
							this.getButton('download').hide();
						} else {
							if (undefined !== (link = Ext.get(Ext.query('#error-log')))) {
								link.addClass('error-log-not-empty').removeClass('error-log-empty');
							}

							if (data.object.tooLarge) {
								this.getContent('content').hide().setValue(data.object.log);
								this.getContent('download').show().update(_('error_log_too_large', {
									name : data.object.name
								}));
								
								this.getButton('refresh').hide();
								this.getButton('clear').enable();
								this.getButton('download').show().setText(_('error_log_download', {
									size : data.object.size
								}));
							} else {
								this.getContent('content').show().setValue(data.object.log);
								this.getContent('download').hide();
								
								this.getButton('refresh').show();
								this.getButton('clear').enable();
								this.getButton('download').hide();
							}
						}
						
						this.getEl().unmask();
					},
					scope		: this
				}
			}
		});
	},
	resetErrorLog : function() {
		this.getEl().mask(_('working'));
	
		MODx.Ajax.request({
			url			: MODx.config.connector_url,
			params		: {
				action		: 'system/errorlog/clear'
			},
			listeners	: {
				'success'	: {
					fn			: function (data) {
						if (undefined !== (link = Ext.get(Ext.query('#error-log')))) {
							link.addClass('error-log-empty').removeClass('error-log-not-empty');
						}
							
						Ext.getCmp('window-error-log-content').show().setValue('');
						Ext.getCmp('window-error-log-download').hide();
						
						this.getButton('refresh').show();
						this.getButton('clear').disable();
						this.getButton('download').hide();
							
						this.getEl().unmask();
					},
					scope		: this
				}
			}
		});
	},
	getErrorLog : function() {
    	location.href = MODx.config.connector_url + '?action=system/errorlog/download&HTTP_MODAUTH=' + MODx.siteId;
	}
});

Ext.reg('errorlog-window', ErrorLog.window.ShowErrorLog);

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

ErrorLog.refresh = function(state) {
	MODx.Ajax.request({
		url			: ErrorLog.config.connector_url,
		params		: {
			action		: 'mgr/errorlog/get',
			lines		: ErrorLog.config.lines
		},
		listeners	: {
			'success'	: {
				fn			: function (data) {
					if (undefined !== (link = Ext.get(Ext.query('#error-log')))) {
						if (data.object.empty) {
							link.addClass('error-log-empty').removeClass('error-log-not-empty');
						} else {
							link.addClass('error-log-not-empty').removeClass('error-log-empty');
						}
					}
					
					if (!data.object.empty && state) {
						ErrorLog.show();
					}
				}
			}
		}
	});
}