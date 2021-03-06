
function DebugTest(){
    prepareCookie();
    setCookie("szerkezet");
}
function DebugTest2(){
    getCookie("szerkezet");
}

function setCookie(_agazatname) {
    var cookiestring = prepareCookie();
    var specCookieName = _agazatname + "_spec";
    var spec = $("#Specializations").find(':selected').attr('data-szak');
    //save cookies
    Cookies.set(_agazatname, cookiestring, { expires: 60 });
    Cookies.set(specCookieName, spec, { expires: 60 });

}
function getCookie(_agazatname) {
    jQuery(function($) {
        var specCookieName = _agazatname + "_spec";
        var spec = Cookies.get(specCookieName);
        SetSpecialization(spec);
        var retVal = SpecializationsChanged(_agazatname);

        if(retVal == 0){
            var dataTargyak = Cookies.get(_agazatname);
            var decodedData = window.atob(dataTargyak);
            console.log("restore start");    
            restoreFromCookie(decodedData);
            console.log("restore end");   
        }
    });
}
function  prepareCookie(){
    var result = "";
    StateDataArray.forEach(x =>{
        result += x.status;
        result += x.felveheto;
    });
    return window.btoa(result);
    
}
function restoreFromCookie(decodedData,spec){
    for(var i = 0;i<decodedData.length;i+=2){
        var currentIndex = i/2;
        StateDataArray[currentIndex].status = Number(decodedData.charAt(i));
        StateDataArray[currentIndex].felveheto = Number(decodedData.charAt(i + 1));
    }
    RefreshState();
}
function SetSpecialization(data) {
	jQuery(function($) {
		if(data == "undefined"){
				//Nop
		}else{
			for(var i = 0;i<$('#Specializations option').length;i++){
				if($('#Specializations option')[i].getAttribute("data-szak") == data){
				document.getElementById("Specializations").value = $('#Specializations option')[i].value;
				$("#Specializations").val(i)
				}
			}
		}
	});
}