
var StateDataArray = [];


function pageInit(_branch){
    //load state data array
    InitStateDataArray();


    //Create HTML objects for each semester
    //load dropdown menu
    LoadSpecNames("szerkezet");
    //torzsanyag
    LoadSubjectElements();
    
    //agazat + spec
    jQuery(function($) {
		var spec = $("#Specializations").find(':selected').attr('data-szak');
        LoadBranchElements(_branch,spec);
        LoadSpecElements(_branch,spec);
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
                name:subject.name,
                code:subject.code,
                uniquecode:subject.uniquecode,
                prereq:subject.elo,
                substitues:subject.substitues,
                status:0,
                felveheto:0,
                specprereq:0,
            };
            StateDataArray.push(newsubject);
        });
        if("specializations" in branch){
            branch.specializations.forEach(spec=>{
                //iterate specs
                spec.subjects.forEach(specSubject =>{
                    //load all subject from spec
                    var newsubject ={
                        name:specSubject.name,
                        code:specSubject.code,
                        uniquecode:specSubject.uniquecode,
                        prereq:specSubject.elo,
                        substitues:specSubject.substitues,
                        status:0,
                        felveheto:0,
                        specprereq:0,
                    };
                    StateDataArray.push(newsubject);
                });
            });
        }
    });

}