import React from 'react';
import { useNavigate } from 'react-router-dom';

// project imports
import ReusableDataGrid from 'ui-component/ReusableDataGrid';
import { userDetails } from '../../../utils/apiService';

// Define the columns for classes
const columnsConfig = [
  { field: 'id', headerName: 'ID', width: 90 },
  { field: 'name', headerName: 'Class Name', flex: 1 },
  { field: 'schoolName', headerName: 'School', width: 150 },
  { field: 'description', headerName: 'Description', flex: 1 },
  { field: 'isActive', headerName: 'Status', width: 120 },
  { field: 'createdAt', headerName: 'Created Date', width: 150 }
];

// ==============================|| CLASSES LIST PAGE ||============================== //

const Classes = () => {
  const navigate = useNavigate();
  const accountId = userDetails.getAccountId();

  // Custom actions for classes
  const customActions = [
    {
      icon: <span>👁️</span>,
      label: 'View Class',
      tooltip: 'View class details',
      color: 'info',
      onClick: (row) => {
        navigate(`/masters/class/view/${row.id}`);
      }
    },
    {
      icon: <span>📝</span>,
      label: 'Edit Class',
      tooltip: 'Edit class details',
      color: 'primary',
      onClick: (row) => {
        navigate(`/masters/class/edit/${row.id}`);
      }
    },
    {
      icon: <span>👥</span>,
      label: 'View Students',
      tooltip: 'View students in this class',
      color: 'secondary',
      onClick: (row) => {
        navigate(`/masters/students?classId=${row.id}`);
      }
    },
    {
      icon: <span>📚</span>,
      label: 'View Subjects',
      tooltip: 'View subjects for this class',
      color: 'info',
      onClick: (row) => {
        navigate(`/masters/subjects?classId=${row.id}`);
      }
    }
  ];

  // Data transformation function
  const transformClassData = (cls) => ({
    ...cls,
    isActive: cls.isActive ? 'Active' : 'Inactive',
    createdAt: cls.createdAt ? new Date(cls.createdAt).toLocaleDateString() : 'N/A',
    schoolName: cls.school?.name || 'N/A'
  });

  return (
    <ReusableDataGrid
      title="Classes Management"
      fetchUrl={`/api/schoolClasses/getAll/${accountId}`}
      columns={columnsConfig}
      editUrl="/masters/class/edit"
      deleteUrl="/api/schoolClasses/delete"
      addActionUrl="/masters/class/add"
      viewUrl="/masters/class/view"
      entityName="CLASS"
      isPostRequest={true}
      customActions={customActions}
      searchPlaceholder="Search classes by name or description..."
      showSearch={true}
      showRefresh={true}
      showFilters={true}
      pageSizeOptions={[5, 10, 25, 50]}
      defaultPageSize={10}
      height={600}
      transformData={transformClassData}
      // Enable filters for classes (school only)
      enableFilters={true}
      showSchoolFilter={true}
      showClassFilter={false}
      showDivisionFilter={false}
      customToolbar={() => (
        <div style={{ marginBottom: '16px', padding: '8px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
          <strong>Classes Overview:</strong> Manage all classes with search, pagination, and comprehensive action capabilities.
          <br />
          <small>Use the school filter above to narrow down classes by school.</small>
        </div>
      )}
    />
  );
};

export default Classes;
