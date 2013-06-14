var settingsArray = [];
//create a var for the language code input
var useragent = document.getElementById('useragent');

//check for a message from the addon
self.on("message", function onMessage(settings_translate) {

//set the language code, whether to translate on same page or new tab, and keyboard shortcut input to what is currently in local storage    
useragent.value = settings_translate[0];

$("#useragent").click(function() {
    $(this)[0].focus();
    $(this)[0].select();
})

//check for a click on the save button
$("#save").unbind("click").click(function(event) {
    event.stopImmediatePropagation();    
    event.stopPropagation();
    event.preventDefault();   
    
    //take the values of the stuff and put in an array
    settingsArray[0] = useragent.value;
    
    //set everything to zero again
    useragent.value = "";
    //send the new value to the addon
    self.postMessage(settingsArray);
});

});