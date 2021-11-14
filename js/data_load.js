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
                currentSpech = spec;
                LoadBranchElements(_branch,spec);
                LoadSpecElements(_branch,spec);
                SetActive(_branch,spec);
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
    subjectsData.Groups[0].subjects.forEach(subject => {
                document.getElementById("torzs_0" + subject.felev).innerHTML += '<div class="targy" status="0" code="' + subject.code +'">' + subject.name + '</div>'
    });
}
function LoadBranchElements(_branch, _spec){ //spec needed because 
//agazat
    //iterate branches
    console.log("func called");
    subjectsData.Groups.forEach(branch => {
        if(branch.type == "agazat" && branch.name == _branch){
            console.log("bramch");
            branch.subjects.forEach(element => {
                if("parentSpecializations" in element){
                    if(element.parentSpecializations.length > 0){
                        if(element.parentSpecializations.some(x => x == _spec)){ //if specializations array containst the currently selected spec
                            document.getElementById("agazat_0" + element.felev).innerHTML += '<div class="targy" status="0" code="' + element.code +'" uniquecode="' + element.uniquecode +'">' + element.name + '</div>'
                        }
                    
                    }else{//list size 0 -> no spec requirement
                        document.getElementById("agazat_0" + element.felev).innerHTML += '<div class="targy" status="0" code="' + element.code +'">' + element.name + '</div>'
                    }
                }else{//no specializations field in object -> no spec requieremnt
                    document.getElementById("agazat_0" + element.felev).innerHTML += '<div class="targy" status="0" code="' + element.code +'">' + element.name + '</div>'
                    console.log("subject added");
                }
            });
        }
    });
}

function LoadSpecElements(_branch, _spec){
    //specializacio
    subjectsData.Groups.forEach(branch => {
        if(branch.type == "agazat" && branch.name == _branch){
            branch.specializations.forEach(spec =>{
                if(spec.type == "spec" && spec.name == _spec){
                    spec.subjects.forEach(subject =>{
                        document.getElementById("spec_0" + subject.felev).innerHTML += '<div class="targy" status="0" code="' + subject.code +'">' + subject.name + '</div>'
                    });
                }
            });
        }
    });
}