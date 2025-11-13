export interface SignupRequest {
  name: string;
  email: string;
  countryCode: string;
  mobileNo: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  countryCode: string;
  mobileNo: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
  isOnboardingDone: boolean;
}

export interface SurveyAnswer {
  questionId: string;
  statement: string;
  value: number | null;
  label: string | null;
  textAnswer: string | null;
  courseLinks?: string[];
}

export interface ChildInfo {
  name: string;
  age: number;
  gender: string;
  createdAt: string;
}

export interface SurveyResultWithCourseLinks {
  surveyId: string;
  surveyName: string;
  childId: string;
  totalScore: number;
  band: string;
  answers: SurveyAnswer[];
  child: ChildInfo;
}

export interface CourseRecommendation {
  courseLink: string;
  statement: string;
  surveyName: string;
  childName: string;
}

