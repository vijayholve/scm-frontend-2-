import React from 'react';
import { useNavigate } from 'react-router-dom';

// project imports
import ReusableDataGrid from 'ui-component/ReusableDataGrid';

// Define the columns for exams
const columnsConfig = [
  { field: 'id', headerName: 'ID', width: 90 },
  { field: 'examName', headerName: 'Exam Name', flex: 1 },
  { field: 'academicYear', headerName: 'Year', width: 100 },
  { field: 'examType', headerName: 'Exam Type', flex: 1 },
  { field: 'maxMarksOverall', headerName: 'Total Marks', width: 130 },
  {
    field: 'startDate',
    headerName: 'Start Date',
    width: 180,
    valueFormatter: (params) => {
      if (!params || !params.value) return 'N/A';
      return new Date(params.value).toLocaleString();
    }
  }
];

// ==============================|| EXAMS LIST PAGE ||============================== //

const Exams = () => {
  const navigate = useNavigate();

  // Custom actions for exams
  const customActions = [
    {
      icon: <span>👁️</span>,
      label: 'View Exam',
      tooltip: 'View exam details',
      color: 'info',
      onClick: (row) => {
        navigate(`/masters/exam/view/${row.id}`);
      }
    },
    {
      icon: <span>📝</span>,
      label: 'Edit Exam',
      tooltip: 'Edit exam details',
      color: 'primary',
      onClick: (row) => {
        navigate(`/masters/exam/edit/${row.id}`);
      }
    },
    {
      icon: <span>🗑️</span>,
      label: 'Delete Exam',
      tooltip: 'Delete exam',
      color: 'error',
      onClick: (row) => {
        if (window.confirm('Are you sure you want to delete this exam?')) {
          // Handle delete logic here
          console.log('Deleting exam:', row.id);
        }
      }
    }
  ];

  // Data transformation function
  const transformExamData = (exam) => ({
    ...exam,
    startDate: exam.startDate || new Date().toISOString()
  });

  return (
    <ReusableDataGrid
      title="Exams Management"
      fetchUrl="/api/exams/getAll" // Replace with actual API endpoint
      columns={columnsConfig}
      editUrl="/masters/exam/edit"
      deleteUrl="/api/exams/delete"
      addActionUrl="/masters/exam/add"
      viewUrl="/masters/exam/view"
      entityName="EXAM"
      isPostRequest={true}
      customActions={customActions}
      searchPlaceholder="Search exams by name, type, or year..."
      showSearch={true}
      showRefresh={true}
      showFilters={true}
      pageSizeOptions={[5, 10, 25, 50]}
      defaultPageSize={10}
      height={600}
      transformData={transformExamData}
      // Enable filters for exams
      enableFilters={true}
      showSchoolFilter={true}
      showClassFilter={true}
      showDivisionFilter={true}
      customToolbar={() => (
        <div style={{ marginBottom: '16px', padding: '8px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
          <strong>Exams Overview:</strong> Manage all exams with search, pagination, and comprehensive action capabilities.
          <br />
          <small>Use the filters above to narrow down exams by school, class, or division.</small>
        </div>
      )}
    />
  );
};

export default Exams;
