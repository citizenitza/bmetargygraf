using Microsoft.Office.Interop.Excel;
using Excel = Microsoft.Office.Interop.Excel;

namespace emk_parser1 {
    public record subjectsData {
        public string CurriculumType;
        public int MaxCredit;
        public List<Group> Groups = new List<Group>();
    }
    public record Group {
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
        Spec
    }
    internal static class Parser {
        static Dictionary<string, string> NameLookup =  new Dictionary<string, string>();
        static subjectsData Result = new subjectsData();
        static string path = System.AppDomain.CurrentDomain.BaseDirectory + "input.xlsx";
        static Excel.Application ExcelApp;
        static Excel.Workbook Workbook;
        static Excel.Worksheet Worksheet;

        public static void AddNames() {
            NameLookup.Add("Szerkezet-Építőmérnöki Ágazat", "szerkezet");
            NameLookup.Add("Magasépítési Specializáció", "magasepites");
            NameLookup.Add("Híd és Műtárgy Specializáció", "hidesmutargy");
            NameLookup.Add("Geotechnika Specializáció", "geotech");
            NameLookup.Add("Építéstechnológia és Menedzsment Specializáció", "epitestech");
            NameLookup.Add("Szerkezeti Anyagok és Technológiák Specializáció", "szerkezetianyagok");
            NameLookup.Add("Építmény-információs Modellezés és Menedzsment Specializáció", "epitmenyinformacio");
            NameLookup.Add("Infrastruktúra-Építőmérnöki Ágazat", "infrastruktura");
            NameLookup.Add("Közlekedési Létesítmények Specializáció", "kozlekedesiletesitmeny");
            NameLookup.Add("Vízmérnöki Specializáció", "vizimernoki");
            NameLookup.Add("Vízi Közmű és Környezetmérnöki Specializáció", "vizkikozmu");
            NameLookup.Add("Építmény-információs modellezés és menedzsment specializáció", "epitmenyinformacio");
            NameLookup.Add("Geotechnika Specializáció", "geotech");
            NameLookup.Add("Geoinformatika-Építőmérnöki Ágazat", "geoinformatika");
            NameLookup.Add("Geodézia Specializáció", "geodezia");
            NameLookup.Add("Térinformatikai Specializáció", "terinfo");
            NameLookup.Add("Építmény-információs modellezés és menedzsment specializáció", "epitmenyinformacio");
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
            CurrentState currentState;
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
                }
                else {
                    for (int i = 3; i <= rowCount; i++) {
                        object[,] currentRow = (object[,])WsRange.Rows[i, Type.Missing].Value;
                        if (currentRow[1, 2]?.ToString().IndexOf("Törzstárgyak", StringComparison.OrdinalIgnoreCase) >= 0) {
                            currentState = CurrentState.Torzs;
                        }
                        else if (currentRow[1, 2]?.ToString().IndexOf(" ágazat ", StringComparison.OrdinalIgnoreCase) >= 0) {
                            currentState = CurrentState.Agazat;
                            string newAgazat = currentRow[1, 2].ToString().Split('(')[0];
                            if(newAgazat != CurrentAgazat) {
                                //create new agazat
                            }
                        }
                        else if (currentRow[1, 2]?.ToString().IndexOf("specializáció", StringComparison.OrdinalIgnoreCase) >= 0) {
                            currentState = CurrentState.Spec;
                            string newsSpec = currentRow[1, 2].ToString();
                            if (newsSpec != CurrentSpec) {
                                //create new agazat
                            }
                        }
                        
                        if (currentRow[1,3]?.ToString().IndexOf("bme", StringComparison.OrdinalIgnoreCase) >= 0) {
                            //subject
                            if (currentRow[1, 4]?.ToString() == string.Empty) {
                                //alternative targy

                            }
                        }
                    }


                }
            }
        }


        public static void GenerateOutput() {

        }
    }
}
