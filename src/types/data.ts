export interface Data {
  colleges: College[];
  departments: Department[];
  courses: Course[];
  LAST_UPDATE_TIME: string;
}

export interface College {
  collegeId: string;
  collegeName: string;
}

export interface Department {
  departmentId: string;
  departmentName: string;
  collegeId: string;
}

export interface Course {
  serialNo: number;
  classNo: string;
  title: string;
  credit: number;
  passwordCard: PasswordCard;
  teachers: string[];
  classTimes: string[];
  limitCnt: number | null;
  admitCnt: number;
  waitCnt: number;
  collegeIds: string[];
  departmentIds: string[];
  courseType: CourseType;
}

export type CourseType = "ELECTIVE" | "REQUIRED";

export type PasswordCard = "ALL" | "NONE" | "OPTIONAL";
