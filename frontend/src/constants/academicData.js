export const DEFAULT_STAFF = [
  "Dr. Radha Senthilkumar",
  "Dr. P. AnandhaKumar",
  "Dr. Dhananjay Kumar",
  "Dr. M.R. Sumalatha",
  "Dr. R. Geetha Ramani",
  "Dr. P. Kola Sujatha",
  "Dr. S. Umamaheswari",
  "Dr. G. Rajesh",
  "Dr. J. Dhalia Sweetlin",
  "Dr. B. Lydia Elizabeth",
  "M. Hemalatha",
  "S.K. Lavanya",
  "C. Sunil Retmin Raj",
  "E. Pugazhendi",
  "Dr. D. Vivekanandan",
  "P. Seethalakshmi",
  "Kannan sir",
  "CN Mam",
  "Prathiba",
  "Durga Devi",
  "Industry Person",
  "Guest Faculty"
];

export const BATCHES = ["A", "B"];

export const PERIOD_TIME_SLOTS = [
  { index: 0, label: "P1", time: "08:30 – 09:20" },
  { index: 1, label: "P2", time: "09:20 – 10:10" },
  { index: 2, label: "P3", time: "10:25 – 11:15" },
  { index: 3, label: "P4", time: "11:15 – 12:05" },
  { lunch: true, label: "LUNCH", time: "12:05 – 01:00" },
  { index: 4, label: "P5", time: "01:00 – 01:50" },
  { index: 5, label: "P6", time: "01:50 – 02:40" },
  { index: 6, label: "P7", time: "02:55 – 03:45" },
  { index: 7, label: "P8", time: "03:45 – 04:35" },
];

export const SAMPLE_CURRICULUM_PRESET = [
  // Batch A
  { batch: "A", name: "Data Structures", staff: "Dr. Radha Senthilkumar", theory_hours: 3, has_lab: true, lab_hours: 2 },
  { batch: "A", name: "Object Oriented Prog", staff: "Dr. P. AnandhaKumar", theory_hours: 3, has_lab: true, lab_hours: 2 },
  { batch: "A", name: "Operating Systems", staff: "Dr. Dhananjay Kumar", theory_hours: 3, has_lab: false, lab_hours: 0 },
  { batch: "A", name: "Computer Networks", staff: "Dr. M.R. Sumalatha", theory_hours: 3, has_lab: true, lab_hours: 2 },
  { batch: "A", name: "Discrete Mathematics", staff: "Dr. R. Geetha Ramani", theory_hours: 3, has_lab: false, lab_hours: 0 },
  
  // Batch B
  { batch: "B", name: "Data Structures", staff: "Dr. P. Kola Sujatha", theory_hours: 3, has_lab: true, lab_hours: 2 },
  { batch: "B", name: "Object Oriented Prog", staff: "Dr. S. Umamaheswari", theory_hours: 3, has_lab: true, lab_hours: 2 },
  { batch: "B", name: "Operating Systems", staff: "Dr. G. Rajesh", theory_hours: 3, has_lab: false, lab_hours: 0 },
  { batch: "B", name: "Computer Networks", staff: "Dr. J. Dhalia Sweetlin", theory_hours: 3, has_lab: true, lab_hours: 2 },
  { batch: "B", name: "Discrete Mathematics", staff: "Dr. B. Lydia Elizabeth", theory_hours: 3, has_lab: false, lab_hours: 0 },
];
