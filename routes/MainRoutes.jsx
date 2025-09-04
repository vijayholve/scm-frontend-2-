import { lazy, useEffect } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import EditDivision from 'views/masters/division/division.edit';
import Divisions from 'views/masters/division/division';
import Exams from 'views/masters/exam';
import { use } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
const NotFound = Loadable(lazy(() => import('views/pages/NotFound')));

// dashboard routing
const DashboardDefault = Loadable(lazy(() => import('views/dashboard')));
const StudentDashboardV1 = Loadable(lazy(() => import('views/dashboard/studentDashboard/StudentDashboardV1')));

// utilities routing
const UtilsTypography = Loadable(lazy(() => import('views/utilities/Typography')));
const UtilsColor = Loadable(lazy(() => import('views/utilities/Color')));
const UtilsShadow = Loadable(lazy(() => import('views/utilities/Shadow')));
// const UtilsMaterialIcons = Loadable(lazy(() => import('views/utilities/MaterialIcons')));
// const UtilsTablerIcons = Loadable(lazy(() => import('views/utilities/TablerIcons')));
const TeacherView = Loadable(lazy(() => import('../views/masters/teacher/TeacherView'))); // Corrected import path
const StudentView = Loadable(lazy(() => import('../views/masters/student/StudentView'))); // Corrected import path

const Users = Loadable(lazy(() => import('views/masters/teacher/index')));
const EditUsers = Loadable(lazy(() => import('views/masters/teacher/edit')));

const Institutes = Loadable(lazy(() => import('views/masters/institute/institutes')));
const EditInstitute = Loadable(lazy(() => import('views/masters/institute/institute.edit')));

const Schools = Loadable(lazy(() => import('views/masters/school/schools')));
const EditSchools = Loadable(lazy(() => import('views/masters/school/school.edit')));

const Students = Loadable(lazy(() => import('views/masters/student/index')));
const EditStudents = Loadable(lazy(() => import('views/masters/student/edit')));
// const BulkStudentAdd = Loadable(lazy(() => import('views/masters/student/BulkStudentAdd')));

const Attendence = Loadable(lazy(() => import('views/masters/attendence/attendenceList')));

const Subjects = Loadable(lazy(() => import('views/masters/subject/subjects')));
const EditSubject = Loadable(lazy(() => import('views/masters/subject/subject.edit')));

const division = Loadable(lazy(() => import('views/masters/division/division')));
const divisionEdit = Loadable(lazy(() => import('views/masters/division/division.edit')));

const Classes = Loadable(lazy(() => import('views/masters/class/classes')));
const ClassEdit = Loadable(lazy(() => import('views/masters/class/class.edit')));

const Assignments = Loadable(lazy(() => import('views/masters/assignment/assignments')));
const AssignmentEdit = Loadable(lazy(() => import('views/masters/assignment/assignment.edit')));

const AttendanceEdit = Loadable(lazy(() => import('views/masters/attendence/attendence.edit')));
const AttendanceList = Loadable(lazy(() => import('views/masters/attendence/attendenceList')));
const StudentAttendanceList = Loadable(lazy(() => import('views/masters/attendence/studentAttendanceList')));

const Roles = Loadable(lazy(() => import('views/masters/roles/roleslist')));
const RoleEdit = Loadable(lazy(() => import('views/masters/roles/role.edit')));

const Timetable = Loadable(lazy(() => import('views/masters/timetable/index')));
const TimetableEdit = Loadable(lazy(() => import('views/masters/timetable/edit')));
const TimetableView = Loadable(lazy(() => import('views/masters/timetable/view')));
const Profiles = Loadable(lazy(() => import('views/masters/profile/index')));

// ID Card routing
const IdCardManagement = Loadable(lazy(() => import('views/masters/idcards/index')));


const StudentParentList = Loadable(lazy(() => import('views/masters/StudentParent/index')));
const StudentParentEdit = Loadable(lazy(() => import('views/masters/StudentParent/edit')));

const CourseList = Loadable(lazy(() => import('views/masters/LMS/components/CourseList')));
const CourseDashboard = Loadable(lazy(() => import('views/masters/LMS/components/CourseDashboard')));
const CourseEdit = Loadable(lazy(() => import('views/masters/LMS/Course.edit')));
const CourseView = Loadable(lazy(() => import('views/masters/LMS/components/CourseView')));

// Quiz routing
const QuizList = Loadable(lazy(() => import('views/masters/test/QuizList')));
const CreateQuiz = Loadable(lazy(() => import('views/masters/test/CreateQuiz')));
const StudentQuizList = Loadable(lazy(() => import('views/masters/test/StudentQuizList')));
const QuizAttempt = Loadable(lazy(() => import('views/masters/test/QuizAttempt')));
const QuizResult = Loadable(lazy(() => import('views/masters/test/QuizResult')));
const QuizDashboard = Loadable(lazy(() => import('views/masters/test/QuizDashboard')));

// ... other imports
const ExamEdit = Loadable(lazy(() => import('views/masters/exam/CreateExam'))); 
const StudentExamList = Loadable(lazy(() => import('views/masters/exam/StudentExamList')));
const TeacherExamView = Loadable(lazy(() => import('views/masters/exam/TeacherExamView')));
const ExamList = Loadable(lazy(() => import('views/masters/exam/index')));
const StudentExamResult = Loadable(lazy(() => import('views/masters/exam/StudentExamResult')));
// Fee routing
const FeeDashboard = Loadable(lazy(() => import('views/masters/fee/index')));
const StudentFeeView = Loadable(lazy(() => import('views/masters/fee/StudentFeeView')));
const FeeDetailView = Loadable(lazy(() => import('views/masters/fee/FeeDetailView')));

const AuditLogList = Loadable(lazy(() => import('views/masters/profile/AuditLogList')));

const DocumentList = Loadable(lazy(() => import('../views/masters/documentHub/DocumentList')));
const DocumentUpload = Loadable(lazy(() => import('../views/masters/documentHub/DocumentUpload')));

const NotificationModule = Loadable(lazy(() => import('../views/masters/notifications/NotificationModule')));

// sample page routing
const SamplePage = Loadable(lazy(() => import('views/sample-page')));

function hasPermission(permissions, entity, action = 'view') {
  const perm = permissions.find(
    (p) => (p.entityName?.toLowerCase() === entity.toLowerCase() || p.name?.toLowerCase() === entity.toLowerCase()) && p.actions?.[action]
  );
  return !!perm;
}

const getMainRoutes = (permissions = []) => ({
  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: '/',
      element: <DashboardDefault />
    },
    {
      path: 'dashboard',
      children: [
        {
          path: 'default',
          element: <DashboardDefault />
        }
      ]
    },
    {
      path: 'student-dashboard',
      element: <StudentDashboardV1 />
    },
    {
      path: 'masters',
      children: [
        hasPermission(permissions, 'TEACHER', 'view') && {
          path: 'teachers',
          element: <Users />
        },
        hasPermission(permissions, 'TEACHER', 'edit') && {
          path: 'teacher/edit/:id',
          element: <EditUsers />
        },
        hasPermission(permissions, 'TEACHER', 'add') && {
          path: 'teacher/add',
          element: <EditUsers />
        },
        hasPermission(permissions, 'TEACHER', 'view') && { // Added Teacher View Route
          path: 'teachers/view/:id',
          element: <TeacherView />
        },
        hasPermission(permissions, 'STUDENT', 'view') && {
          path: 'students',
          element: <Students />
        },
        hasPermission(permissions, 'STUDENT', 'edit') && {
          path: 'student/edit/:id',
          element: <EditStudents />
        },
        hasPermission(permissions, 'STUDENT', 'add') && {
          path: 'student/add',
          element: <EditStudents />
        },
      //   hasPermission(permissions, 'STUDENT', 'add') && {
      //     path: 'student/bulk-add',
      //     element: <BulkStudentAdd />
      // },
        hasPermission(permissions, 'STUDENT', 'view') && { // Added Student View Route
          path: 'students/view/:id',
          element: <StudentView />
        },
        // ...repeat for other entities like 'INSTITUTE', 'SCHOOL', etc.
        // Example for roles:
        hasPermission(permissions, 'INSTITUTE', 'view') && {
          path: 'institutes',
          element: <Institutes />
        },
        hasPermission(permissions, 'INSTITUTE', 'edit') && {
          path: 'institute/edit/:id',
          element: <EditInstitute />
        },
        hasPermission(permissions, 'INSTITUTE', 'add') && {
          path: 'institute/add',
          element: <EditInstitute />
        },
        hasPermission(permissions, 'SCHOOL', 'view') && {
          path: 'schools',
          element: <Schools />
        },
        hasPermission(permissions, 'SCHOOL', 'edit') && {
          path: 'school/edit/:id',
          element: <EditSchools />
        },
        hasPermission(permissions, 'SCHOOL', 'add') && {
          path: 'school/add',
          element: <EditSchools />
        },
        hasPermission(permissions, 'CLASS', 'view') && {
          path: 'classes',
          element: <Classes />
        },
        hasPermission(permissions, 'CLASS', 'edit') && {
          path: 'class/edit/:id',
          element: <ClassEdit />
        },
        hasPermission(permissions, 'CLASS', 'add') && {
          path: 'class/add',
          element: <ClassEdit />
        },
        hasPermission(permissions, 'DIVISION', 'view') && {
          path: 'divisions',
          element: <Divisions />
        },
        hasPermission(permissions, 'DIVISION', 'edit') && {
          path: 'division/edit/:id',
          element: <EditDivision />
        },
        hasPermission(permissions, 'DIVISION', 'add') && {
          path: 'division/add',
          element: <EditDivision />
        },
        hasPermission(permissions, 'SUBJECT', 'view') && {
          path: 'subjects',
          element: <Subjects />
        },
        hasPermission(permissions, 'SUBJECT', 'edit') && {
          path: 'subject/edit/:id',
          element: <EditSubject />
        },
        hasPermission(permissions, 'SUBJECT', 'add') && {
          path: 'subject/add',
          element: <EditSubject />
        },
        hasPermission(permissions, 'ASSIGNMENT', 'view') && {
          path: 'assignments',
          element: <Assignments />
        },
        hasPermission(permissions, 'ASSIGNMENT', 'edit') && {
          path: 'assignment/edit/:id',
          element: <AssignmentEdit />
        },
        hasPermission(permissions, 'ASSIGNMENT', 'add') && {
          path: 'assignment/add',
          element: <AssignmentEdit />
        },
        hasPermission(permissions, 'ATTENDANCE', 'view') && {
          path: 'attendance/list',
          element: <AttendanceList />
        },
        hasPermission(permissions, 'ATTENDANCE', 'edit') && {
          path: 'attendance/edit/:id',
          element: <AttendanceEdit />
        },
        hasPermission(permissions, 'ATTENDANCE', 'add') && {
          path: 'attendance/add',
          element: <AttendanceEdit />
        },
        hasPermission(permissions, 'STUDENT_ATTENDANCE', 'view') && {
          path: 'student-attendance',
          element: <StudentAttendanceList />
        },
        hasPermission(permissions, 'ROLE', 'view') && {
          path: 'roles',
          element: <Roles />
        },
        hasPermission(permissions, 'ROLE', 'edit') && {
          path: 'role/edit/:id',
          element: <RoleEdit />
        },
        hasPermission(permissions, 'ROLE', 'add') && {
          path: 'role/add',
          element: <RoleEdit />
        },
        hasPermission(permissions, 'USER_PROFILE', 'view') && {
          path: 'profile',
          element: <Profiles />
        },
        hasPermission(permissions, 'IDCARD', 'view') && {
          path: 'idcards',
          element: <IdCardManagement />
        },
        // hasPermission(permissions, 'EXAM', 'view') && {
        //   path: 'exams',
        //   element: <ExamList />
        // },

        // hasPermission(permissions, 'EXAM', 'edit') && {
        //   path: 'exam/edit/:id',
        //   element: <ExamEdit />
        // },
        // hasPermission(permissions, 'EXAM', 'add') && {
        //   path: 'exam/add',
        //   element: <ExamEdit />
        // },

        hasPermission(permissions, 'EXAM', 'view') && {
          path: 'exams',
          element: <ExamList />
      },
      hasPermission(permissions, 'EXAM', 'edit') && {
          path: 'exam/edit/:id',
          element: <ExamEdit /> // Use the new component
      },
      hasPermission(permissions, 'EXAM', 'add') && {
          path: 'exam/add',
          element: <ExamEdit /> // Use the new component
      },
      {
          path: 'exams/student',
          element: <StudentExamList />
      },
      {
          path: 'exams/student/result/:examId',
          element: <StudentExamResult />
      },
      {
          path: 'exams/teacher',
          element: <TeacherExamView />
      },
        hasPermission(permissions, 'STUDENT_PARENT', 'view') && {
          path: 'studentParents',
          element: <StudentParentList />
        },
        hasPermission(permissions, 'STUDENT_PARENT', 'edit') && {
          path: 'studentParent/edit/:id',
          element: <StudentParentEdit />
        },
        hasPermission(permissions, 'STUDENT_PARENT', 'add') && {
          path: 'studentParent/add',
          element: <StudentParentEdit />
        },
        hasPermission(permissions, 'TIMETABLE', 'view') && {
          path: 'timetables',
          element: <Timetable />
        },
        hasPermission(permissions, 'TIMETABLE', 'edit') && {
          path: 'timetable/edit/:id',
          element: <TimetableEdit />
        },
        hasPermission(permissions, 'TIMETABLE', 'add') && {
          path: 'timetable/add',
          element: <TimetableEdit />
        },
        hasPermission(permissions, 'TIMETABLE', 'view') && {
          path: 'timetable/view/:id',
          element: <TimetableView />
        },
        hasPermission(permissions, 'LMS', 'view') && {
          path: 'lms',
          element: <CourseList />
        },
        hasPermission(permissions, 'LMS', 'edit') && {
          path: 'lms/course/edit/:id',
          element: <CourseEdit />
        },
        hasPermission(permissions, 'LMS', 'add') && {
          path: 'lms/course/add',
          element: <CourseEdit />
        },
        hasPermission(permissions, 'LMS', 'view') && {
          path: 'lms/course/view/:courseId',
          element: <CourseView />
        },
        hasPermission(permissions, 'QUIZ', 'view') && {
          path: 'quiz',
          element: <QuizList />
        },
        hasPermission(permissions, 'QUIZ', 'edit') && {
          path: 'quiz/edit/:id',
          element: <CreateQuiz />
        },
        hasPermission(permissions, 'QUIZ', 'add') && {
          path: 'quiz/add',
          element: <CreateQuiz />
        },
        hasPermission(permissions, 'QUIZ', 'view') && {
          path: 'quiz/dashboard/:quizId',
          element: <QuizDashboard />
        },
        {
          path: 'quiz/attempt/:quizId',
          element: <QuizAttempt />
        },
        {
          path: 'quiz/result/:quizId',
          element: <QuizResult />
        },
        
        {
          path: 'student/quizzes',
          element: <StudentQuizList />
        },
         hasPermission(permissions, 'DOCUMENT_HUB', 'view') && {
            path: 'document-hub',
            element: <DocumentList />
        },
        hasPermission(permissions, 'DOCUMENT_HUB', 'add') && {
            path: 'document-hub/upload',
            element: <DocumentUpload />
        },
        // Fee management routes
        hasPermission(permissions, 'FEE_MANAGEMENT', 'view') && {
          path: 'fees',
          element: <FeeDashboard />
        },
        hasPermission(permissions, 'FEE_MANAGEMENT', 'view') && {
          path: 'fees/view/:id',
          element: <FeeDetailView />
        },
        {
          path: 'student/fees',
          element: <StudentFeeView />
        },
        {
          path: 'student/fees/:studentId',
          element: <StudentFeeView />
        },
          {
          path: 'notifications',
          element: <NotificationModule />
        },
        // NE
        // W AUDIT LOG ROUTE
        hasPermission(permissions, 'AUDIT_LOG', 'view') && 
        {
            path: 'audit-log',
            element: <AuditLogList />
        },
       


      ]
    },
     {
      path: '*',
      element: <NotFound />
    }
  ]
});

export default getMainRoutes;
