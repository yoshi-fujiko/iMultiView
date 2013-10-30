window.onload = function(){
  window.onmessage = receive;
}

function receive(e){
	var flag = e.data;
	if (flag === "reload") {
		location.reload();
	}
	if (flag === "back") {
		history.back();
	}
	if (flag === "forward") {
		history.forward();
	}
	//console.log(e.data + " : " + e.origin);
  //document.getElementById('interruptDiv').innerHTML = e.data + ' from ' + e.origin;
  //メッセージを送り返す
  //e.source.postMessage('返信' , '*');
}