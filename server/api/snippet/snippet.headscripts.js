window.console = window.console || function(t) {};
window.open = function(){ console.log("window.open is disabled."); };
window.print   = function(){ console.log("window.print is disabled."); };
window.alert   = function(){ console.log("window.alert is disabled."); };
window.confirm = function(){ console.log("window.confirm is disabled."); };
window.prompt  = function(){ console.log("window.prompt is disabled."); };
window.Notification = function() { console.log("HTML5 notifications are disabled."); };
