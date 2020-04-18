var subjects = new Array();
function test(){
    alert(subjectsData.Groups[0].name);
    var subject1 = new Subject("targy1",0,3,"BMEKOJKA","-","vizsga");
    var subject2 = new Subject("targy2",0,3,"BMEKOJKA","-","vizsga");
    var subject3 = new Subject("targy3",0,3,"BMEKOJKA","-","vizsga");
    var subject4 = new Subject("targy4",0,3,"BMEKOJKA","-","vizsga");

    subjects.push(subject1);
    subjects.push(subject2);
    subjects.push(subject3);
    subjects.push(subject4);
    
    
    //  var tmp = new Semester(1,)

    for(var i = 0;i<subjects.length;i++){
        // alert(subjects[i].Name);
        var tmp = document.getElementsByClassName("debug");
        tmp[0].innerHTML += subjects[i].Name; 
    }
}
