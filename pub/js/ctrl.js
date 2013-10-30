var BGPG = chrome.extension.getBackgroundPage();

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
		this.tabAnc = ".tabAnc";
		this.noFavicon = "../img/no_favicon.png";
	}

	TOOLS.Ctrl.prototype.init = function() {
		this.setEvent();
	}

	TOOLS.Ctrl.prototype.reloaded = function(obj) {
		var iframe = this.getIframe(obj);
		//iframe.contentWindow.location.reload(true);
		iframe.contentWindow.postMessage('reload','*');
	}

	TOOLS.Ctrl.prototype.preved = function(obj) {
		var iframe = this.getIframe(obj);
		//iframe.contentWindow.history.back();
		iframe.contentWindow.postMessage('back','*');
	}

	TOOLS.Ctrl.prototype.nexted = function(obj) {
		var iframe = this.getIframe(obj);
		//iframe.contentWindow.history.forward();
		iframe.contentWindow.postMessage('forward','*');
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
		this.jampUri(uri, iframe, obj);
	}

	TOOLS.Ctrl.prototype.rewriteUri = function(str) {
		$.trim(str);
		if (str.indexOf("://") < 0) {
			return "http://" + str;
		}
		return str;
	}

	TOOLS.Ctrl.prototype.jampUri = function(uri, iframe, address) {
		if (uri != "") {
			$(address).val(uri);
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
		var self = this,
			tabObj = obj;
			tabAry = [];
		chrome.tabs.getAllInWindow(null, function(tabs) {
			tabAry = self.createTabInfo(tabs);
			self.createTabList(tabAry, tabObj);
		});
	}

	TOOLS.Ctrl.prototype.createTabInfo = function(tabs) {
		var tabAry = []
			c = 0;
		for (var i = 0, I = tabs.length; i < I; i++) {
			if (!tabs[i].selected) {
				tabAry[c] = {};
				tabAry[c].title = tabs[i].title;
				tabAry[c].favicon = this.checkFavicon(tabs[i].favIconUrl);
				tabAry[c].url = tabs[i].url;
				c++;
			}
		}
		return tabAry;
	}

	TOOLS.Ctrl.prototype.checkFavicon = function(icn) {
		if (!icn) {
			return this.noFavicon;
		}
		return icn;
	}

	TOOLS.Ctrl.prototype.createTabList = function(tabsInfo, tabObj) {
		var li = "", tabLen = tabsInfo.length;
		if (tabLen > 0) {
			for (var i = 0; i < tabLen; i++) {
				li += '<li style="background:url(' + tabsInfo[i].favicon + ') no-repeat;"><a href="' + tabsInfo[i].url + '" class="tabAnc">' + tabsInfo[i].title + '</a></li>';
			}
		}
		else {
			li += '<li>no tab</li>';
		}
		var ul = '<ul class="tabInfo unstyled">' + li + '</ul>';
		tabObj.html(ul);
	}

	TOOLS.Ctrl.prototype.tabAncSwitch = function(obj, e) {
		var iframe = this.getIframe(obj);
		var parentWin = this.getParentWin(obj);
		var anc = obj.attr("href");
		var address = $(parentWin).find(this.uriBar);
		this.jampUri(anc, iframe, address);
		this.closeTabInfo($(parentWin).find(this.tabInfo));
		e.preventDefault();
		e.stopPropagation();
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
		this.doc.on("click", self.tabAnc, function(e) {
			self.tabAncSwitch($(this), e);
		});

	}

})(TOOLS || (TOOLS = {}));

$(function() {
	TOOLS.ctrl = new TOOLS.Ctrl();
	TOOLS.ctrl.init();
});