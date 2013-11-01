var IMVMSG;
(function(IMVMSG) {
	IMVMSG.Receive = function() {
		this.reload = "reload";
		this.back = "back";
		this.forward = "forward";
	}
	IMVMSG.Receive.prototype.init = function(e) {
		var flag = e.data;
		var self = this;
		switch(flag) {
			case "reload":
				location.reload();
				break;
			case "back":
				history.back();
				break;
			case "forward":
				history.forward();
				break;
			default:
				break;
		}
	}
})(IMVMSG || (IMVMSG = {}));

IMVMSG.receive = new IMVMSG.Receive();
window.addEventListener("message", IMVMSG.receive.init, false);


var IMVVEIWINFO;
(function(IMVVEIWINFO) {
	IMVVEIWINFO.getSiteInfo = function() {
		try {
			window.parent.location.href;
		}
		catch(e) {
			if (e.message.indexOf("chrome-extension://") > 0) {
				var title = document.title;
				var uri = location.href;
				console.log(title + ' : ' + uri);
				var target = parent.postMessage ? parent : (parent.document.postMessage ? parent.document : undefined);
				if (typeof target != "undefined") {
					target.postMessage(title, "*");
				}
			}
		}
	}
})(IMVVEIWINFO || (IMVVEIWINFO = {}));

new IMVVEIWINFO.getSiteInfo();
