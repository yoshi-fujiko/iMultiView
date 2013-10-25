var TOOLS;
(function(TOOLS) {

	TOOLS.Ctrl = function() {
		this.doc = $(document);
		this.reload = ".btnReload";
		this.prev = ".btnPrev";
		this.next = ".btnNext";
		this.blank = ".btnBlank";
		this.tab = ".btnTab";
		this.qr = ".btnQr";
		this.viewWin = ".viewWin";
		this.viewFrm = ".viewFrm";
		this.uriBar = ".form_text";
		this.tabInfo = ".tabInfo";
	}

	TOOLS.Ctrl.prototype.init = function() {
		this.setEvent();
	}

	TOOLS.Ctrl.prototype.reloaded = function(obj) {
		var iframe = this.getIframe(obj);
		iframe.contentWindow.location.reload(true);
	}

	TOOLS.Ctrl.prototype.preved = function(obj) {
		var iframe = this.getIframe(obj);
		iframe.contentWindow.history.back();
	}

	TOOLS.Ctrl.prototype.nexted = function(obj) {
		var iframe = this.getIframe(obj);
		iframe.contentWindow.history.forward();
	}

	TOOLS.Ctrl.prototype.iframeToWin = function(obj) {
		var iframeUri = this.getIframeUri(obj);
		window.open(iframeUri);
	}

	TOOLS.Ctrl.prototype.selectUri = function(obj) {
		obj.select();
	}

	TOOLS.Ctrl.prototype.entryUri = function(obj) {
		var iframe = this.getIframe(obj);
		var val = obj.val();
		var uri = this.rewriteUri(val);
		this.jampUri(uri, iframe);
		obj.val(uri);
	}

	TOOLS.Ctrl.prototype.rewriteUri = function(str) {
		$.trim(str);
		if (str.indexOf("://") < 0) {
			return "http://" + str;
		}
		return str;
	}

	TOOLS.Ctrl.prototype.jampUri = function(uri, iframe) {
		if (uri != "") {
			iframe.contentWindow.location.href = uri;
		}
	}

	TOOLS.Ctrl.prototype.getIframeUri = function(obj) {
		var parentWin = this.getParentWin(obj);
		return parentWin.find(this.uriBar).eq(0).val();
	}

	TOOLS.Ctrl.prototype.getParentWin = function(obj) {
		return obj.closest(this.viewWin);
	}

	TOOLS.Ctrl.prototype.getIframe = function(obj) {
		var parentWin = this.getParentWin(obj);
		return parentWin.find(this.viewFrm)[0];
	}

	TOOLS.Ctrl.prototype.tabList = function(obj) {
		var tabsInfo = this.getTabInfo(obj);
	}
	TOOLS.Ctrl.prototype.closeTabInfo = function(obj) {
		obj.remove();
	}

	TOOLS.Ctrl.prototype.getTabInfo = function(obj) {
		var title, favicon, url, tabAry = [];
		var c = 0;
		var self = this;
		var tabObj = obj;
		chrome.tabs.getAllInWindow(null, function(tabs) {
			for (var i = 0, I = tabs.length; i < I; i++) {
				if (!tabs[i].selected) {
					tabAry[c] = {};
					tabAry[c].title = tabs[i].title;
					tabAry[c].favicon = tabs[i].favIconUrl;
					tabAry[c].url = tabs[i].url;
					c++;
				}
			}
			self.createTabList(tabAry, tabObj);
		});
	}

	TOOLS.Ctrl.prototype.createTabList = function(tabsInfo, tabObj) {
		var li = "";
		for (var i = 0, I = tabsInfo.length; i < I; i++) {
			li += '<li style="background:url(' + tabsInfo[i].favicon + ') no-repeat;"><a href="' + tabsInfo[i].url + '">' + tabsInfo[i].title + '</a></li>';
		}
		var ul = '<ul class="tabInfo unstyled">' + li + '</ul>';
		tabObj.html(ul);

	}

	TOOLS.Ctrl.prototype.setEvent = function() {
		var self = this;
		this.doc.on("click", self.reload, function() {
			self.reloaded($(this));
		});
		this.doc.on("click", self.prev, function() {
			self.preved($(this));
		});
		this.doc.on("click", self.next, function() {
			self.nexted($(this));
		});
		this.doc.on("keydown", self.uriBar, function(e) {
			if (e.keyCode === 13) {
				self.entryUri($(this));
			}
		});
		this.doc.on("click", self.uriBar, function() {
			self.selectUri($(this));
		});
		this.doc.on("click", self.blank, function() {
			self.iframeToWin($(this));
		});
		this.doc.on("click", self.tab, function() {
			self.tabList($(this));
		});
		this.doc.on("mouseleave", self.tabInfo, function() {
			self.closeTabInfo($(this));
		});

	}

})(TOOLS || (TOOLS = {}));

$(function() {
	TOOLS.ctrl = new TOOLS.Ctrl();
	TOOLS.ctrl.init();
});