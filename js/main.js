var currentBranch;
var currentSpech;
var StateDataArray = [];


function pageInit(_branch){
    currentBranch = _branch;
    //load state data array
    InitStateDataArray();
    //Create HTML objects for each semester
    //load dropdown menu
    LoadSpecNames(_branch);
    //torzsanyag
    LoadSubjectElements();
    
    //agazat + spec
    jQuery(function($) {
		var spec = $("#Specializations").find(':selected').attr('data-szak');
        currentSpech = spec;
        LoadBranchElements(_branch,spec);
        LoadSpecElements(_branch,spec);
        SetActive(_branch,spec);
        RefreshState();
    });
    //check for url param
    var qSpec = getQueryVariable("spec");
    var qData = getQueryVariable("data");
    if(qSpec == false){ // no url -> load from cookie
        getCookie(_branch);
        RefreshState();
    }else{//url query 
        restoreFromURL(qData,qSpec,_branch);
        RefreshState();
    }
}

function RefreshState(){
    SetState();
    SetColor();
    setCreditBar();
}
function SetActive(_branch,_spec){
    //reset
    StateDataArray.forEach(item => {
        item.active = 0;
    });
    var subject_array = document.getElementsByClassName('targy');
    for (var i = 0; i < subject_array.length; ++i) {
        var item = subject_array[i];  
        var code = "";
        var unique = "";
        code = item.getAttribute("code");
        if(item.hasAttribute("uniquecode")){
            unique = item.getAttribute("uniquecode");
        }
        for(var j =0;j<StateDataArray.length;j++){

            if(StateDataArray[j].uniquecode !== undefined){
                if(StateDataArray[j].uniquecode == unique){
                    if(StateDataArray[j].branch == "torzsanyag" || StateDataArray[j].branch == _branch){
                        //item found
                        StateDataArray[j].active = 1;
                        break;
                    }else{
                        var debug =55;
                    }
                }
            }else if(StateDataArray[j].code == code){
                if(StateDataArray[j].branch == "torzsanyag" || StateDataArray[j].branch == _branch){
                    //item found
                    StateDataArray[j].active = 1;
                    break;
                }else{
                    var debug =55;
                }
            }
        }
    }
    StateDataArray.forEach(item => {
        if(item.active == 0){
            item.status = 0;
        }
    });
}
function InitStateDataArray(){
    //emty array
    StateDataArray = [];

    subjectsData.Groups.forEach(branch => {
        //iterate branches (torzs + agazat)
        branch.subjects.forEach(subject =>{
            //load all subject from group
            var newsubject ={
                branch: branch.name,
                spec: "NotSpec",
                type: branch.type,
                name:subject.name,
                code:subject.code,
                credit:subject.credit,
                uniquecode:subject.uniquecode,
                prereq:subject.elo,
                substitues:subject.substitues,
                status:0, //0 - nem felvett, 1 -felvett, 2 - teljesitett
                felveheto:0, //0 - nem felveheto, 1 -felveheto
                specprereq:0,
                active:0,
                substitutes:subject.substitutes,
            };
            StateDataArray.push(newsubject);
            console.log(newsubject.branch);
        });
        if("specializations" in branch){
            branch.specializations.forEach(spec=>{
                //iterate specs
                spec.subjects.forEach(specSubject =>{
                    //load all subject from spec
                    var newsubject ={
                        branch: branch.name,
                        spec:spec.name,
                        type: branch.type,
                        name:specSubject.name,
                        code:specSubject.code,
                        credit:specSubject.credit,
                        uniquecode:specSubject.uniquecode,
                        prereq:specSubject.elo,
                        substitues:specSubject.substitues,
                        status:0,
                        felveheto:0,
                        specprereq:0,
                        active:0,
                        substitutes:specSubject.substitutes,
                    };
                    StateDataArray.push(newsubject);
                    console.log(newsubject.branch);
                });
            });
        }
    });

}

function ClearDataForSpecSubjects(){
    StateDataArray.forEach(item =>{
        if(item.type == "spec"){
            item.status = 0;
            item.felveheto = 0;
        }
    });
}
function SetState(){
    StateDataArray.forEach(item =>{
        if(item.active == 1){
            //check for prequirements
            if(item.prereq.length == 0){
                item.felveheto = 1;
            }else{
                var AllCompleted = true;
                item.prereq.forEach(preSubject =>{
                    if(item.name == "Építmény-információs mod. és menedzsment proj."){
                        var debug1 = 45;//deubg break
                    }
                    var rawCode = "";
                    var type = 0;//0-normal, 1 -azonos felev,
                    if(preSubject.includes("!") && preSubject.includes("~")){
                        type = 1;
                        rawCode = preSubject.replace('!', '').replace('~', '');
                    }else if(preSubject.includes("!")){
                        type = 1;
                        rawCode = preSubject.replace('!', '');
                    }else if(preSubject.includes("~")){
                        type = 0;                    
                        rawCode = preSubject.replace('~', '');
                    }else{
                        type = 0;
                        rawCode = preSubject;
                    }
                    // var
                    for(var i = 0; i<StateDataArray.length;i++){
                        if(StateDataArray[i].code == rawCode && StateDataArray[i].active == 1){
                            if(StateDataArray[i].branch == "torzsanyag" || StateDataArray[i].branch == currentBranch){
                                if(type == 0){
                                    if(StateDataArray[i].status == 0 || StateDataArray[i].status == 1){
                                        AllCompleted = false;
                                        break;
                                    }
                                }else if(type == 1){
                                    if(StateDataArray[i].status == 0){
                                        AllCompleted = false;
                                        break;
                                    } 
                                }
                            }
                        }   
                    }
                });
                if(AllCompleted){
                    item.felveheto = 1;
                }else{
                    item.felveheto = 0;
                    item.status = 0;
                }
            }
        }
    });
}

function deleteData(){
    StateDataArray.forEach(item =>{
        item.status = 0;
    });
    RefreshState();
}
function createLink(){
    var url = "";
    url = getURL("szerkezet");
    console.log(url);

    const el = document.createElement('textarea');
    el.value = url;
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    alert("Copied!");
}
function PushDatatoDisplay(){
    
}

/*******************************************************************************************************
 * Colour
 * *****************************************************************************************************/
function SetColor(){

    var subject_array = document.getElementsByClassName('targy');
    for (var i = 0; i < subject_array.length; ++i) {
        var item = subject_array[i];  
        var code = "";
        var unique = "";
        code = item.getAttribute("code");
        if(item.hasAttribute("uniquecode")){
            unique = item.getAttribute("uniquecode");
        }
        var found = false;
        var index = 0;
        for(var j =0;j<StateDataArray.length;j++){
            if(StateDataArray[j].uniquecode !== undefined){
                if(StateDataArray[j].uniquecode == unique){
                    if(StateDataArray[j].branch == "torzsanyag" || StateDataArray[j].branch == currentBranch){
                        //item found
                        found = true;
                        index = j;
                        break;
                    }
                }
            }else{
                if(StateDataArray[j].code == code){
                    if(StateDataArray[j].branch == "torzsanyag" || StateDataArray[j].branch == currentBranch){
                        //item found
                        found = true;
                        index = j;
                        break;
                    }
                }
            }

        }
        if(found){
            if(StateDataArray[index].felveheto == 1){
                if(StateDataArray[index].status == 0){
                    item.className = "targy felveheto";
                }else if(StateDataArray[index].status == 1){
                    item.className = "targy felvett";
                }else if(StateDataArray[index].status == 2){
                    item.className = "targy teljesitett";
                }
            }else if (StateDataArray[index].felveheto == 0){
                item.className = "targy";
            }
        }
    }
}
/*******************************************************************************************************
 * Credit bar
 * *****************************************************************************************************/
function setCreditBar(){
    jQuery(function($) {
		var teljsum = 0;
		var felvsum = 0;

        for (var i = 0; i < StateDataArray.length; i++) {//branch check
            if(StateDataArray[i].active == 1){
                if(StateDataArray[i].status == 1){
                    felvsum += StateDataArray[i].credit;
                }else if(StateDataArray[i].status == 2){
                    teljsum += StateDataArray[i].credit;
                }
            }
        }
        document.getElementById("Felv").innerHTML = felvsum.toString();
        document.getElementById("Telj").innerHTML = teljsum.toString();
		
		var x_f = felvsum/240;
		var x_t = teljsum/240;
		var width = document.getElementById("kreditBar").offsetWidth;
		var width_f = x_f*width;
		var width_t = x_t*width;
		
		$('.Felv').animate({width: width_f}, 200 );
		$('.Telj').animate({width: width_t}, 200 );
	});
}