import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// project imports
import ReusableDataGrid from 'ui-component/ReusableDataGrid';
import { userDetails } from '../../../utils/apiService';
import api from '../../../utils/apiService';

// Define the columns specifically for the Students data grid.
const columnsConfig = [
  { field: 'rollno', headerName: 'Roll No', width: 90 },
  { field: 'userName', headerName: 'User Name', width: 150, flex: 1 },
  { field: 'name', headerName: 'Name', width: 150, flex: 1 },
  { field: 'email', headerName: 'Email', width: 110, flex: 1 },
  { field: 'mobile', headerName: 'Mobile', width: 110, flex: 1 },
  { field: 'address', headerName: 'Address', width: 110, flex: 1 },
  { field: 'className', headerName: 'Class', width: 110, flex: 1 },
  { field: 'divisionName', headerName: 'Division', width: 110, flex: 1 }
];

// ==============================|| STUDENTS LIST PAGE ||============================== //

const Students = () => {
  const navigate = useNavigate();
  const accountId = userDetails.getAccountId();
  const [classNames, setClassNames] = useState({});
  const [divisionNames, setDivisionNames] = useState({});

  // Fetch class and division names for display
  useEffect(() => {
    const fetchNames = async () => {
      try {
        // Fetch all classes
        const classResponse = await api.post(`/api/schoolClasses/getAll/${accountId}`, {
          page: 0,
          size: 1000,
          sortBy: 'id',
          sortDir: 'asc'
        });

        const classMap = {};
        (classResponse.data.content || []).forEach((cls) => {
          classMap[cls.id] = cls.name;
        });
        setClassNames(classMap);

        // Fetch all divisions
        const divisionResponse = await api.post(`/api/divisions/getAll/${accountId}`, {
          page: 0,
          size: 1000,
          sortBy: 'id',
          sortDir: 'asc'
        });

        const divisionMap = {};
        (divisionResponse.data.content || []).forEach((div) => {
          divisionMap[div.id] = div.name;
        });
        setDivisionNames(divisionMap);
      } catch (error) {
        console.error('Failed to fetch class/division names:', error);
      }
    };

    fetchNames();
  }, [accountId]);

  // Data transformation function - maps IDs to names
  const transformStudentData = (student) => ({
    ...student,
    rollno: student.rollNo || student.id,
    name: `${student.firstName || ''} ${student.lastName || ''}`.trim() || student.userName,
    // Map IDs to names for display
    className: classNames[student.classId] || `Class ID: ${student.classId}` || 'N/A',
    divisionName: divisionNames[student.divisionId] || `Division ID: ${student.divisionId}` || 'N/A'
  });

  // Custom actions for students
  const customActions = [
    {
      icon: <span>📚</span>, // You can use proper icons here
      label: 'View Assignments',
      tooltip: 'View student assignments',
      color: 'info',
      onClick: (row) => {
        navigate(`/masters/assignments/student/${row.id}`);
      }
    },
    {
      icon: <span>📊</span>,
      label: 'View Attendance',
      tooltip: 'View student attendance',
      color: 'secondary',
      onClick: (row) => {
        navigate(`/masters/attendance/student/${row.id}`);
      }
    }
  ];

  return (
    <>
      {/* Temporary Debug Section */}


      <ReusableDataGrid
        title="Students Management"
        fetchUrl={`/api/users/getAll/${accountId}?type=STUDENT`}
        columns={columnsConfig}
        editUrl="/masters/student/edit"
        deleteUrl="/api/users/delete"
        addActionUrl="/masters/students/add"
        viewUrl="/masters/students/view"
        entityName="STUDENT"
        isPostRequest={true}
        // customActions={customActions}
        searchPlaceholder="Search students by name, email, or roll number..."
        showSearch={true}
        showRefresh={true}
        showFilters={true}
        pageSizeOptions={[5, 10, 25, 50]}
        defaultPageSize={10}
        height={600}
        transformData={transformStudentData}
        onRowClick={(params) => {
          // Optional: Navigate to view page on row click
          // navigate(`/masters/students/view/${params.row.id}`);
        }}
        // Enable filters for students - need school filter for class/division to work
        enableFilters={true}
        showSchoolFilter={true}
        showClassFilter={true}
        showDivisionFilter={true}
        customToolbar={() => (
          <div style={{ marginBottom: '16px', padding: '8px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
            <strong>Total Students:</strong> This grid shows all students with search, pagination, and action capabilities.
            <br />
            <small>Use the filters above to narrow down students by school, class, or division.</small>
          </div>
        )}
      />
    </>
  );
};

export default Students;
