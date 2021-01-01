$(document).ready(function() {
    $(document).on('mouseenter', '.targy', function() {
        var SourceAddress = this.getAttribute("code");
        var PrereqArray = [];
        StateDataArray.forEach(subject => {    
            if(subject.code == SourceAddress){
                PrereqArray = subject.prereq;
            }
        });

        var cTargy_array = document.getElementsByClassName('targy');
        for (var i = 0; i < cTargy_array.length; ++i) {
            var code = cTargy_array[i].getAttribute("code");
            var uniquecode = cTargy_array[i].getAttribute("uniquecode");
            //elo
            PrereqArray.forEach(x => {
                if(x.includes("!")){ //azonos felev
                    var newCode = x.replace('!', '');
                    if(newCode == code){
                        cTargy_array[i].className += " azonosfelev";
                    }
                }else if(x.includes("~")){//alairas
                    var newCode = x.replace('~', '');
                    if(newCode == code){
                        cTargy_array[i].className += " alairas";
                    }
                }else{//sima elokovetelmeny
                    if(x == code){
                        cTargy_array[i].className += " elokovetelmeny";
                    }
                }
            });
            //uto
            var utoPrereqArray = [];
            StateDataArray.forEach(subject => {    
                if(subject.code == code && subject.code != ""){
                    utoPrereqArray = subject.prereq;
                }
                if(utoPrereqArray.length != 0){
                    if(utoPrereqArray.some(x=> x == SourceAddress)){
                        if(!cTargy_array[i].className.includes("utokovetelmeny")){
                        cTargy_array[i].className += " utokovetelmeny";
                        }
                    }
                }
            });
            if(uniquecode != null){
            }
        }

    });

    $(document).on('mouseleave', '.targy', function() {
        var cTargy_array = document.getElementsByClassName('targy');
        for (var i = 0; i < cTargy_array.length; ++i) {
            cTargy_array[i].className = cTargy_array[i].className.replace(' utokovetelmeny', '');
            cTargy_array[i].className = cTargy_array[i].className.replace(' azonosfelev', '');
            cTargy_array[i].className = cTargy_array[i].className.replace(' alairas', '');
            cTargy_array[i].className = cTargy_array[i].className.replace(' elokovetelmeny', '');
        }
    });
});