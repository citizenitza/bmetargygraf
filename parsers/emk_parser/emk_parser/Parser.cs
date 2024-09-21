using Microsoft.Office.Interop.Excel;
using Excel = Microsoft.Office.Interop.Excel;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.IO;

namespace emk_parser1 {
    public record subjectsData {
        public string CurriculumType;
        public int MaxCredit;
        public List<Group> Groups = new List<Group>();
    }
    public record Group {
        [JsonProperty]
        public string type;
        public string name;
        public string fullname;
        public List<Subject> subjects = new List<Subject>();
        public List<Group> specializations = new List<Group>();
    }
    public record Subject {
        public string name;
        public string code;
        public int credit;
        public int lecture;
        public int seminar;
        public int lab;
        public int consultation;
        public string requirement;
        public int felev;
        public bool HasSubstitues;
        public List<string> elo = new List<string>();
        public List<Substitute> substitutes = new List<Substitute>();
    }
    public record Substitute {
        public string name;
        public string code;
    }
    public enum CurrentState {
        Torzs,
        Agazat,
        Spec,
        NA
    }
    internal static class Parser {
        static Dictionary<string, string> NameLookup = new Dictionary<string, string>();
        static subjectsData Result = new subjectsData();
        static string path = System.AppDomain.CurrentDomain.BaseDirectory + "input.xlsx";
        static Excel.Application ExcelApp;
        static Excel.Workbook Workbook;
        static Excel.Worksheet Worksheet;

        public static void AddNames() {
            NameLookup.Add("Szerkezet-építőmérnöki ágazat", "szerkezet");
            NameLookup.Add("Magasépítési specializáció", "magasepites");
            NameLookup.Add("Híd és műtárgy specializáció", "hidesmutargy");
            NameLookup.Add("Geotechnika specializáció", "geotech");
            NameLookup.Add("Építéstechnológia és menedzsment specializáció", "epitestech");
            NameLookup.Add("Szerkezeti anyagok és technológiák specializáció", "szerkezetianyagok");
            NameLookup.Add("Építmény-információs modellezés és menedzsment specializáció", "epitmenyinformacio");
            NameLookup.Add("Infrastruktúra-építőmérnöki ágazat", "infrastruktura");
            NameLookup.Add("Közlekedési létesítmények specializáció", "kozlekedesiletesitmeny");
            NameLookup.Add("Vízmérnöki specializáció", "vizimernoki");
            NameLookup.Add("Vízi közmű és környezetmérnöki specializáció", "vizkikozmu");
            //NameLookup.Add("Építmény-információs modellezés és menedzsment specializáció", "epitmenyinformacio");
            // NameLookup.Add("Geotechnika Specializáció", "geotech");
            NameLookup.Add("Geoinformatika-építőmérnöki ágazat", "geoinformatika");
            NameLookup.Add("Geodézia és térinformatika specializáció", "geodezia");
            NameLookup.Add("Térinformatikai specializáció", "terinfo");
            // NameLookup.Add("Építmény-információs modellezés és menedzsment specializáció", "epitmenyinformacio");
        }
        public static void OpenExcel(string newpath) {
            path = newpath;
            OpenExcel();
        }

        public static void OpenExcel() {
            ExcelApp = new Excel.Application();
            try {
                Workbook = ExcelApp.Workbooks.Open(path, ReadOnly: true);
            } catch (Exception ex) {
                Console.WriteLine(ex.Message);
            }
            CurrentState currentState = CurrentState.NA;
            bool TorzsDone = false;
            bool AgazatDone = false;
            string CurrentAgazat = "";
            string CurrentSpec = "";

            Result.CurriculumType = "EMK";
            Result.MaxCredit = 240;
            Group torzstargyak = new Group();
            torzstargyak.type = "torzs";
            torzstargyak.name = "torzsanyag";
            torzstargyak.fullname = "Törzstárgyak";
            Result.Groups.Add(torzstargyak);
            foreach (Excel.Worksheet ws in Workbook.Worksheets) {
                //check if bsc
                Excel.Range WsRange = ws.UsedRange;
                string debug = ws.Name;
                int rowCount = WsRange.Rows.Count;
                int colCount = WsRange.Columns.Count;
                object[,] first = (object[,])WsRange.Rows[1, Type.Missing].Value;
                if (!(first[1, 2]?.ToString().IndexOf("bsc", StringComparison.OrdinalIgnoreCase) >= 0)) {
                    //not bsc
                    continue;
                } else {
                    for (int i = 3; i <= rowCount; i++) {
                        object[,] currentRow = (object[,])WsRange.Rows[i, Type.Missing].Value;
                        if (currentRow[1, 2]?.ToString().IndexOf("Törzstárgyak", StringComparison.OrdinalIgnoreCase) >= 0) {
                            currentState = CurrentState.Torzs;
                        } else if (currentRow[1, 2]?.ToString().IndexOf(" ágazat ", StringComparison.OrdinalIgnoreCase) >= 0) {
                            currentState = CurrentState.Agazat;
                            string newAgazat = currentRow[1, 2].ToString().Split('(')[0].Trim();
                            if (newAgazat != CurrentAgazat) {
                                //create new agazat
                                CurrentAgazat = newAgazat;
                                Group newAgazatGroup = new Group();
                                newAgazatGroup.type = "agazat";
                                newAgazatGroup.fullname = newAgazat;
                                newAgazatGroup.name = NameLookup[newAgazat];
                                Result.Groups.Add(newAgazatGroup);
                                AgazatDone = false;
                            }
                        } else if (currentRow[1, 2]?.ToString().IndexOf("specializáció", StringComparison.OrdinalIgnoreCase) >= 0) {
                            currentState = CurrentState.Spec;
                            string newsSpec = currentRow[1, 2].ToString().Trim();
                            if (newsSpec != CurrentSpec) {
                                //create new agazat
                                Group newSpecGroup = new Group();
                                newSpecGroup.type = "spec";
                                newSpecGroup.fullname = newsSpec;
                                try {
                                    newSpecGroup.name = NameLookup[newsSpec];
                                    Result.Groups.Last().specializations.Add(newSpecGroup);
                                } catch (Exception ex) when (ex is System.Collections.Generic.KeyNotFoundException) {
                                    continue;
                                }
                            }
                        }

                        if (currentRow[1, 3]?.ToString().IndexOf("bme", StringComparison.OrdinalIgnoreCase) >= 0) {
                            //subject
                            if(currentRow[1, 2].ToString() == "BIM az építőiparban") {
                                ;
                            }
                            if (currentRow[1, 4]?.ToString() == null) {
                                //alternative targy

                            } else {
                                //regular
                                Subject newSubject = new Subject();
                                newSubject.name = currentRow[1, 2].ToString().Trim();
                                newSubject.code = currentRow[1, 3].ToString().Trim();
                                newSubject.credit = (int)Convert.ToUInt32(currentRow[1, 4]);
                                newSubject.lecture = (int)Convert.ToUInt32(currentRow[1, 5]);
                                newSubject.seminar = (int)Convert.ToUInt32(currentRow[1, 6]);
                                newSubject.lab = (int)Convert.ToUInt32(currentRow[1, 7]);
                                newSubject.consultation = (int)Convert.ToUInt32(currentRow[1, 8]);
                                if (currentRow[1, 10]?.ToString() == "F") {
                                    newSubject.requirement = "Félévközi";
                                } else if (currentRow[1, 10]?.ToString() == "V") {
                                    newSubject.requirement = "Vizsga";
                                } else if (currentRow[1, 10]?.ToString() == "A") {
                                    newSubject.requirement = "Aláírás";
                                }
                                if (currentRow[1, 13]?.ToString() == "X") {
                                    newSubject.felev = 1;
                                } else if (currentRow[1, 14]?.ToString() == "X") {
                                    newSubject.felev = 2;
                                } else if (currentRow[1, 15]?.ToString() == "X") {
                                    newSubject.felev = 3;
                                } else if (currentRow[1, 16]?.ToString() == "X") {
                                    newSubject.felev = 4;
                                } else if (currentRow[1, 17]?.ToString() == "X") {
                                    newSubject.felev = 5;
                                } else if (currentRow[1, 18]?.ToString() == "X") {
                                    newSubject.felev = 6;
                                } else if (currentRow[1, 19]?.ToString() == "X") {
                                    newSubject.felev = 7;
                                } else if (currentRow[1, 20]?.ToString() == "X") {
                                    newSubject.felev = 8;
                                }
                                if(currentRow[1, 1]?.ToString() == "*") {
                                    newSubject.HasSubstitues = true;
                                } else {
                                    newSubject.HasSubstitues = false;
                                }
                                string test = currentRow[1, 21]?.ToString();
                                if (test != "-" && test != null) {
                                    if ((currentRow[1, 21]?.ToString().IndexOf("vagy", StringComparison.OrdinalIgnoreCase)>=0)){
                                        newSubject.elo.Add("BME" + currentRow[1, 21].ToString().Split("vagy")[1].Trim());
                                    } else {
                                        newSubject.elo.Add("BME" + currentRow[1, 21].ToString().Trim());
                                    }

                                }
                                test = currentRow[1, 22]?.ToString();
                                if (test != "-" && test != null) {
                                    newSubject.elo.Add("BME" + currentRow[1, 22].ToString().Trim());
                                }
                                test = currentRow[1, 23]?.ToString();
                                if (test != "-" && test != null) {
                                    newSubject.elo.Add("BME" + currentRow[1, 23].ToString().Trim());
                                }
                               
                                //add subject
                                if(currentState == CurrentState.Torzs && !TorzsDone) {
                                    Result.Groups[0].subjects.Add(newSubject);//add to torzs
                                }else if(currentState == CurrentState.Agazat && !AgazatDone) {
                                    Result.Groups.Last().subjects.Add(newSubject);
                                } else if(currentState == CurrentState.Spec) {
                                    Result.Groups.Last().specializations.Last().subjects.Add(newSubject);
                                }

                            }
                        }
                    }


                }

                if (!TorzsDone) {
                    TorzsDone = true;
                }
                if (!AgazatDone) {
                    AgazatDone = true;
                }
            }
            for(int i = 0; i < 6; i++) {
                AddSzabadonValasztott(i+1);
            }
            GenerateOutput();
        }
        public static void AddSzabadonValasztott(int id) {
            Subject newSubject = new Subject();
            newSubject.name = "Szabadon választható " + id.ToString();
            newSubject.code = "Szabad0" + id.ToString();
            newSubject.credit = 2;
            newSubject.lecture = 2;
            newSubject.seminar = 0;
            newSubject.lab = 0;
            newSubject.consultation = 0;
            newSubject.requirement = "Félévközi/Vizsga";
            newSubject.HasSubstitues = false;
            if(id <= 3 ) {
                newSubject.felev = 7;
            } else {
                newSubject.felev = 8;
            }
            Result.Groups[0].subjects.Add(newSubject);//add to torzs
        }

        public static void GenerateOutput() {
            string path = System.AppDomain.CurrentDomain.BaseDirectory + @"output.txt";
            using (StreamWriter sw = File.AppendText(path)) {
                var serializer = new JsonSerializer();
                var stringWriter = new StringWriter();
                using (var writer = new JsonTextWriter(stringWriter)) {
                    writer.QuoteName = false;
                    writer.Formatting = Formatting.Indented;
                    serializer.Serialize(writer, Result);
                }

                var json = "subjectsData = " + stringWriter.ToString();
                sw.Write(json);
            }

        }
    }
}
