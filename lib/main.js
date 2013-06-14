var prefs = require("preferences-service");
var tabs = require("tabs");
var data = require('self').data;
var widget = require("widget");
var panels = require('panel');
var simpleStorage = require('simple-storage');
var notifications = require("notifications");
var unload = require("unload");
var icon = data.url("icon.png");
var iconSmallOn = data.url("icon-small-on.png");
var iconSmall = data.url("icon-small.png");

if (prefs.isSet("general.useragent.override") === false) {
    on = false;
    currIcon = iconSmall;
} else {
    on = true;
    currIcon = iconSmallOn;
}
    function settings(setting) {
        if ((setting) === "useragent") {
            return simpleStorage.storage.useragent;   
        }  
    }
  function toggleUserAgent() {
    if (on === false) {
        prefs.set("general.useragent.override", settings("useragent"));
        on = true;
        return on;
    } else {
        prefs.reset("general.useragent.override");
        on = false;
        return on;
    } 
  } 
exports.main = function(options) {
  //create a button to click
  var switcher = widget.Widget({
    id: 'toggle-switch',
    label: 'User Agent Quick Switch - Right Click for Settings',
    contentURL: currIcon,
    contentScriptWhen: 'ready',
    contentScriptFile: data.url('widget.js')
  });
  //on normal click switch the custom user agent on and off
  switcher.port.on('left-click', function() {
        if (settings("useragent") !== "" && settings("useragent") !== undefined || on === true) {
            switcher.contentURL = toggleUserAgent() ? iconSmallOn : iconSmall;
        } else {
            notifications.notify({
                title: "User Agent Quick Switch - Error",
                text: "You need to set an user agent.",
                iconURL: icon
            });
        }
  });
  //on right click show the settings panel
  switcher.port.on('right-click', function() {
        settingsPanel.show();
  });
  
     //settings panel  
  var settingsPanel = panels.Panel({
    width: 580,
    height: 200,
    contentURL: data.url('settings.html'),
    contentScriptFile: [data.url('settingsjs.js'), data.url('jquery.min.js')],
    contentScriptWhen: 'ready',
    onShow: function() {
    //tell the content script what is in the local storage
    var settingsArray = [];   
    settingsArray[0] = settings("useragent");        
     this.postMessage(settingsArray);
    },
    onMessage: function(message) {   
    //don't do extra work, make sure that changes were actually made
    if (message[0] !== "") {
        simpleStorage.storage.useragent = message[0];
        if (on === true) {
            prefs.set("general.useragent.override", message[0])
        }
        console.log(prefs.get("general.useragent.override"));
         //hide the panel
        settingsPanel.hide();   
        notifications.notify({
            title: "User Agent Quick Switch - Settings Saved!",
            text: "Your new user agent has been saved.",
            iconURL: icon
        });
    } 
    }
}); 
}
//unload
exports.onUnload = function (reason) {
    if (reason === "uninstall" || reason === "disable") {
        prefs.reset("general.useragent.override");
        simpleStorage.storage.useragent = undefined;
    }
}
