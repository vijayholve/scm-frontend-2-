// vijayholve/scm-frontend-2-/scm-frontend-2--af3a43b8c782ff35d5cb58355cbb444aa215ca69/views/lms/CourseDetails.jsx

import React from 'react';
import { useParams } from 'react-router-dom';
import CourseView from './course/CourseView'; // Import the new modular component
import LMSLayout from 'ui-component/lms/LMSLayout';

const CourseDetailsWrapper = () => {
  const { courseId } = useParams();
  
  // The logic has been moved to a modular component structure
  return(

    <LMSLayout>
    <CourseView courseId={courseId} />
  </LMSLayout>
  )
};

export default CourseDetailsWrapper;