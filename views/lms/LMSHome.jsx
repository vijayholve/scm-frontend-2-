import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { userDetails, api, checkMultipleCourseEnrollments } from '../../utils/apiService';
import { useDataCache } from '../../contexts/DataCacheContext';
import { useNavigate } from 'react-router-dom';
import Navbar from 'ui-component/lms/Navbar';
import DynamicHeroSection from 'ui-component/lms/HeroSection';
import ValueProposition from 'ui-component/lms/ValueProposition';
import CourseShowcase from 'ui-component/lms/CourseShowcase';
import BlackWhiteSection from 'ui-component/lms/BlackWhiteSection';
import Footer from 'ui-component/lms/Footer';
import LMSLayout from 'ui-component/lms/LMSLayout';

const LMSHome = () => {
  const navigate = useNavigate();
  const [userType, setUserType] = useState('guest'); // 'guest', 'user', 'enrolled'
  const [isLoading, setIsLoading] = useState(true);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const { fetchData } = useDataCache();

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      // Check for SCM-AUTH in localStorage following project conventions
      const authToken = localStorage.getItem('SCM-AUTH');

      if (!authToken) {
        setUserType('guest');
        setIsLoading(false);
        return;
      }

      // Parse the stored auth data
      const authData = JSON.parse(authToken);

      if (authData && authData.accessToken) {
        // User is authenticated
        const user = userDetails.getUser();
        const accountId = userDetails.getAccountId();

        if (user && accountId) {
          await checkUserEnrollments(accountId, user.id);
        } else {
          setUserType('user');
        }
      } else {
        setUserType('guest');
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      setUserType('guest');
    } finally {
      setIsLoading(false);
    }
  };

  const checkUserEnrollments = async (accountId, userId) => {
    try {
      // First, fetch all available courses using DataCacheContext pattern
      const coursesResult = await fetchData(`/api/lms/course/getAll/${accountId}`, {
        page: 0,
        size: 100, // Get all courses to check enrollments
        sortBy: 'id',
        sortDir: 'asc'
      });

      if (coursesResult.success && coursesResult.data?.length > 0) {
        const courseIds = coursesResult.data.map((course) => course.id);

        // Check enrollment status for each course using the specific API
        const enrollmentResults = await checkMultipleCourseEnrollments(accountId, courseIds, userId);

        if (enrollmentResults.length > 0) {
          // Get full course details for enrolled courses
          const enrolledCourseDetails = coursesResult.data.filter((course) =>
            enrollmentResults.some((enrollment) => enrollment.courseId === course.id)
          );

          // Enhance course details with enrollment status
          const enrichedEnrolledCourses = enrolledCourseDetails.map((course) => {
            const enrollmentInfo = enrollmentResults.find((e) => e.courseId === course.id);
            return {
              ...course,
              enrollmentStatus: enrollmentInfo.enrollmentStatus,
              progress: enrollmentInfo.enrollmentStatus.progress || 0,
              enrolledDate: enrollmentInfo.enrollmentStatus.enrolledDate,
              lastAccessed: enrollmentInfo.enrollmentStatus.lastAccessed
            };
          });

          setEnrolledCourses(enrichedEnrolledCourses);
          setUserType('enrolled');
        } else {
          setEnrolledCourses([]);
          setUserType('user');
        }
      } else {
        setUserType('user');
      }
    } catch (error) {
      console.error('Error checking user enrollments:', error);
      setUserType('user');
    }
  };

  const handleLogout = () => {
    // Clear localStorage following project conventions
    localStorage.removeItem('SCM-AUTH');
    setUserType('guest');
    setEnrolledCourses([]);
    // Optionally redirect to home or login page
    window.location.href = '/lms';
  };

  const handleGetStarted = () => {
    if (userType === 'guest') {
      navigate('/auth/login');
    } else if (userType === 'enrolled') {
      navigate('/lms/dashboard');
    } else {
      navigate('/lms/courses');
    }
  };

  const handleExploreCourses = () => {
    navigate('/lms/courses');
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        Loading...
      </Box>
    );
  }

  return (
    <LMSLayout>
      <Box component="main" sx={{ flexGrow: 1 }}>
        {/* Dynamic Hero Section based on user auth status */}
        <DynamicHeroSection userType={userType} enrolledCourses={enrolledCourses} />

        {/* Value Proposition / Features */}
        <ValueProposition />

        {/* Black Section - Call to Action */}
        <BlackWhiteSection
          variant="black"
          userType={userType}
          onButtonClick={handleGetStarted}
        />

        {/* Course Showcase with auth-aware content */}
        <CourseShowcase userType={userType} enrolledCourses={enrolledCourses} />

        {/* White Section - Features */}
        <BlackWhiteSection
          variant="white"
          userType={userType}
          onButtonClick={handleExploreCourses}
        />
      </Box>
    </LMSLayout>
  );
};

export default LMSHome;
