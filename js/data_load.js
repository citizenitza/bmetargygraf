const Agazat = {
    szerkezet: 1,
    infrastr: 2,
    geoinfo: 3,
 };
 const SpecSzerk = {
    magasepites: 0,
    hidesmutargy: 1,
    geotech: 2,
    epitestech: 3,
    szerkezetianyagok: 4,
    epitmenyinformacio: 5,
 };
 const SpecInfrastr ={
    kozlekedesiletesitmeny: 0,
    vizimernoki: 1,
    epitmenyinformacio: 2,
    geotech: 3,
 };
 const SpecGeoinfo ={
    geodezia: 0,
    terinfo: 1,
    epitmenyinformacio: 2,
};

function pageInit(_branch){
    //Create HTML objects for each semester
    LoadSpecNames("szerkezet");
    LoadSubjectElements();
    //set initial states
    jQuery(function($) {
		var spec = $("#Specializations").find(':selected').attr('data-szak');
        LoadBranchElements(_branch,spec);
        LoadSpecElements(_branch,spec);
	});
}
function SpecializationsChanged(_branch){
    jQuery(function($) {
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
        LoadBranchElements(_branch,spec);
        LoadSpecElements(_branch,spec);
    });
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

function LoadSubjectElements(){
    //torzsanyag
    subjectsData.Groups[0].subjects.forEach(subject => {
                document.getElementById("torzs_0" + subject.felev).innerHTML += '<div class="targy" status="0" code="' + subject.code +'">' + subject.name + '</div>'
    });
}
function LoadBranchElements(_branch, _spec){ //spec needed because 
//agazat
    //iterate branches
    subjectsData.Groups.forEach(branch => {
        if(branch.type == "agazat" && branch.name == _branch){
            branch.subjects.forEach(element => {
                if("specializations" in element){
                    if(element.specializations.length > 0){
                        if(element.specializations.some(x => x == _spec)){ //if specializations array containst the currently selected spec
                            document.getElementById("agazat_0" + element.felev).innerHTML += '<div class="targy" status="0" code="' + element.code +'" uniquecode="' + element.uniquecode +'">' + element.name + '</div>'
                        }
                    
                    }else{//list size 0 -> no spec requirement
                        document.getElementById("agazat_0" + element.felev).innerHTML += '<div class="targy" status="0" code="' + element.code +'">' + element.name + '</div>'
                    }
                }else{//no specializations field in object -> no spec requieremnt
                    document.getElementById("agazat_0" + element.felev).innerHTML += '<div class="targy" status="0" code="' + element.code +'">' + element.name + '</div>'
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