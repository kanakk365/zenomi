import apiClient from "./client";
import { SurveyResultWithCourseLinks, CourseRecommendation } from "./types";

export const getSurveyResultsWithCourseLinks = async (): Promise<
  SurveyResultWithCourseLinks[]
> => {
  const response = await apiClient.get<SurveyResultWithCourseLinks[]>(
    "/surveys/results/with-course-links"
  );
  return response.data;
};

export const extractCourseRecommendations = (
  surveyResults: SurveyResultWithCourseLinks[]
): CourseRecommendation[] => {
  const courses: CourseRecommendation[] = [];

  surveyResults.forEach((result) => {
    result.answers.forEach((answer) => {
      if (answer.courseLinks && answer.courseLinks.length > 0) {
        answer.courseLinks.forEach((link) => {
          courses.push({
            courseLink: link,
            statement: answer.statement,
            surveyName: result.surveyName,
            childName: result.child.name,
          });
        });
      }
    });
  });

  return courses;
};
