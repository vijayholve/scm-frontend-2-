import React from 'react';
import { useNavigate } from 'react-router-dom';

// project imports
import ReusableDataGrid from 'ui-component/ReusableDataGrid';
import { userDetails } from '../../../utils/apiService';

// Define the columns for teachers
const columnsConfig = [
  { field: 'id', headerName: 'ID', width: 90 },
  { field: 'userName', headerName: 'User Name', width: 150, flex: 1 },
  { field: 'email', headerName: 'Email', width: 110, flex: 1 },
  { field: 'mobile', headerName: 'Mobile', width: 110, flex: 1 },
  { field: 'address', headerName: 'Address', width: 110, flex: 1 }
];

// ==============================|| TEACHERS LIST PAGE ||============================== //

const Teachers = () => {
  const navigate = useNavigate();
  const accountId = userDetails.getAccountId();

  // Custom actions for teachers
  const customActions = [
    {
      icon: <span>📚</span>,
      label: 'View Subjects',
      tooltip: 'View assigned subjects',
      color: 'info',
      onClick: (teacher) => {
        navigate(`/masters/subjects/teacher/${teacher.id}`);
      }
    },
    {
      icon: <span>📅</span>,
      label: 'View Schedule',
      tooltip: 'View teaching schedule',
      color: 'secondary',
      onClick: (teacher) => {
        navigate(`/masters/timetable/teacher/${teacher.id}`);
      }
    }
  ];

  return (
    <ReusableDataGrid
      title="Teachers Management"
      fetchUrl={`/api/users/getAll/${accountId}?type=TEACHER`}
      columns={columnsConfig}
      editUrl="/masters/teacher/edit"
      deleteUrl="/api/users/delete"
      addActionUrl="/masters/teachers/add"
      viewUrl="/masters/teachers/view"
      entityName="TEACHER"
      isPostRequest={true}
      customActions={customActions}
      searchPlaceholder="Search teachers by name, email, or username..."
      showSearch={true}
      showRefresh={true}
      showFilters={true}
      pageSizeOptions={[5, 10, 25, 50]}
      defaultPageSize={10}
      height={600}
      // Enable filters for teachers (school only)
      enableFilters={true}
      showSchoolFilter={true}
      showClassFilter={false}
      showDivisionFilter={false}
      customToolbar={() => (
        <div style={{ marginBottom: '16px', padding: '8px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
          <strong>Total Teachers:</strong> This grid shows all teachers with search, pagination, and action capabilities.
          <br />
          <small>Use the school filter above to narrow down teachers by school.</small>
        </div>
      )}
    />
  );
};

export default Teachers;
