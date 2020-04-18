class Semester{
    constructor(_ID, _Subjects){
        this.ID = _ID;
        this.Subjects = _Subjects;   
    } 

}
class Subject{
    constructor(_name,_semster,_credit,_code,_prereq,_requirement){
        this.Name = _name;
        this.Semester = _semster;
        this.Credit = _credit;
        this.Code = _code;
        this.Prereq = _prereq;
        this.Requirement = _requirement;
    }
}