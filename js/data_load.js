function SpecializationsChanged(_branch){
    //clear data
    // console.log("clear start");
    ClearDataForSpecSubjects();
    // console.log("clear end");
    jQuery(function($) {
        if('CurriculumType' in subjectsData){
            if(subjectsData.CurriculumType == "EMK"){
                //clear previous subjects
                for(var i=0;i<5;i++){ // for the 4 semester with branch and spec subjects
                    
                    try{
                        document.getElementById("agazat_0" + (i+4)).innerHTML ="";
                    }catch{; }
                    try{
                        document.getElementById("spec_0" + (i+4)).innerHTML = "";
                    }catch{; }
                }
                //load new
                var spec = $("#Specializations").find(':selected').attr('data-szak');
                // If no spec selected (e.g. empty dropdown), spec is undefined.
                // But LoadBranchElements should still run for branch subjects.
                currentSpech = spec;
                LoadBranchElements(_branch,spec);
                if (spec) {
                    LoadSpecElements(_branch,spec);
                    SetActive(_branch,spec);
                }
                RefreshState();
            }else if(subjectsData.CurriculumType == "EPK"){
                for(var i=1;i<=10;i++){ 
                    try{
                        var id = i < 10 ? "0" + i : i;
                        document.getElementById("agazat_" + id).innerHTML ="";
                    }catch{; }
                    try{
                        var id = i < 10 ? "0" + i : i;
                        document.getElementById("spec_" + id).innerHTML = "";
                    }catch{; }
                }
                var spec = $("#Specializations").find(':selected').attr('data-szak');
                currentSpech = spec;
                LoadBranchElements(_branch,spec);
                if (spec) {
                    LoadSpecElements(_branch,spec);
                    SetActive(_branch,spec);
                }
                RefreshState();
            }else if(subjectsData.CurriculumType == "EPK2025"){
                for(var i=1;i<=10;i++){ 
                    try{
                        var id = i < 10 ? "0" + i : i;
                        document.getElementById("agazat_" + id).innerHTML ="";
                    }catch{; }
                    try{
                        var id = i < 10 ? "0" + i : i;
                        document.getElementById("spec_" + id).innerHTML = "";
                    }catch{; }
                }
                var spec = $("#Specializations").find(':selected').attr('data-szak');
                currentSpech = spec;
                LoadBranchElements(_branch,spec);
                if (spec) {
                    LoadSpecElements(_branch,spec);
                    SetActive(_branch,spec);
                }
                RefreshState();
            }else if(subjectsData.CurriculumType == "Simple"){
                for(var i=0;i<7;i++){ // for the 4 semester with branch and spec subjects
                    try{
                        document.getElementById("spec_0" + (i+1)).innerHTML = "";
                    }catch{; }
                }
                var spec = $("#Specializations").find(':selected').attr('data-szak');
                currentSpech = spec;
                // LoadBranchElements(_branch,spec);
                LoadSpecElements(_branch,spec);
                SetActive(_branch,spec);
                RefreshState();
            }

        }else{
            console.log("false");
        }
    });

    return 0;
}
function LoadSpecNames(_branch){
    //iterate branches
    subjectsData.Groups.forEach(branch => {
        if(branch.type == "agazat" && branch.name == _branch){
            //clear options
            // document.getElementById("Specializations").innerHTML = "<option>Válassz specializációt</option>";
            document.getElementById("Specializations").innerHTML = "";
            //get specs
            var i = 0;
            branch.specializations.forEach(spec => {
                document.getElementById("Specializations").innerHTML += '<option data-szak="' + spec.name + '"  value="' + i++ + '">' + spec.fullname + '</option>' ;
            });
        }
    });
}

function LoadSubjectElements(){ //torzs targyak
    //torzsanyag
    if (subjectsData.Groups[0].subjects.length > 0) {
        subjectsData.Groups[0].subjects.forEach(subject => {
            var felevId = subject.felev < 10 ? "0" + subject.felev : subject.felev;
            var container = document.getElementById("torzs_" + felevId);
            if (container) {
                container.innerHTML += '<div class="targy" status="0" code="' + subject.code +'">' + subject.name + '</div>'
            }
        });
    }
}
function LoadBranchElements(_branch, _spec){ //spec needed because 
//agazat
    //iterate branches
    console.log("func called");
    subjectsData.Groups.forEach(branch => {
        if(branch.type == "agazat" && branch.name == _branch){
            console.log("bramch");
            branch.subjects.forEach(element => {
                if(isNaN(element.felev)){//spec groups here
                }else{
                    var felevId = element.felev < 10 ? "0" + element.felev : element.felev;
                    if("parentSpecializations" in element){
                        if(element.parentSpecializations.length > 0){
                            if(element.parentSpecializations.some(x => x == _spec)){ //if specializations array containst the currently selected spec
                                document.getElementById("agazat_" + felevId).innerHTML += '<div class="targy" status="0" code="' + element.code +'" uniquecode="' + element.uniquecode +'">' + element.name + '</div>'
                            }
                        
                        }else{//list size 0 -> no spec requirement
                            document.getElementById("agazat_" + felevId).innerHTML += '<div class="targy" status="0" code="' + element.code +'">' + element.name + '</div>'
                        }
                    }else{//no specializations field in object -> no spec requieremnt
                        var container = document.getElementById("agazat_" + felevId);
                        if (container) {
                            container.innerHTML += '<div class="targy" status="0" code="' + element.code +'">' + element.name + '</div>'
                            console.log("subject added");
                        } else {
                            console.log("Container not found for semester: " + felevId);
                        }
                    }
                }
            });
        }
    });
}

function LoadSpecElements(_branch, _spec){
    //specializacio
    subjectsData.Groups.forEach(branch => {
        if(branch.type == "agazat" && branch.name == _branch){
            branch.specializations.forEach(spec => {
                if(spec.name == _spec){
                    spec.subjects.forEach(element => {
                        var felevId = element.felev < 10 ? "0" + element.felev : element.felev;
                        var container = document.getElementById("spec_" + felevId);
                        if (container) {
                            container.innerHTML += '<div class="targy" status="0" code="' + element.code +'">' + element.name + '</div>'
                        } else {
                            // Fallback to agazat container if spec container not found (e.g. in simple layout)
                            container = document.getElementById("agazat_" + felevId);
                            if (container) {
                                container.innerHTML += '<div class="targy" status="0" code="' + element.code +'">' + element.name + '</div>'
                            }
                        }
                    });
                }
            });
        }
    });
}