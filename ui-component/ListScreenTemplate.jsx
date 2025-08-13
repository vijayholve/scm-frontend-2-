import React from 'react';
import { useNavigate } from 'react-router-dom';

// project imports
import ReusableDataGrid from 'ui-component/ReusableDataGrid';

// ==============================|| LIST SCREEN TEMPLATE ||============================== //

/**
 * Template for creating new list screens using ReusableDataGrid
 *
 * Steps to use this template:
 * 1. Copy this file to your desired location
 * 2. Rename the component and file
 * 3. Update the columns configuration
 * 4. Update the API endpoints
 * 5. Add custom actions if needed
 * 6. Customize the data transformation
 * 7. Update the entity name for permissions
 */

const ListScreenTemplate = () => {
  const navigate = useNavigate();

  // Step 1: Define your columns
  const columnsConfig = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'name', headerName: 'Name', flex: 1 },
    { field: 'description', headerName: 'Description', flex: 1 },
    { field: 'status', headerName: 'Status', width: 120 },
    { field: 'createdAt', headerName: 'Created Date', width: 150 }
  ];

  // Step 2: Define custom actions (optional)
  const customActions = [
    {
      icon: <span>👁️</span>, // Replace with proper Material-UI icons
      label: 'View Details',
      tooltip: 'View detailed information',
      color: 'info',
      onClick: (row) => {
        navigate(`/view/${row.id}`);
      }
    },
    {
      icon: <span>📝</span>,
      label: 'Edit',
      tooltip: 'Edit item',
      color: 'primary',
      onClick: (row) => {
        navigate(`/edit/${row.id}`);
      }
    },
    {
      icon: <span>🗑️</span>,
      label: 'Delete',
      tooltip: 'Delete item',
      color: 'error',
      onClick: (row) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
          // Handle delete logic here
          console.log('Deleting item:', row.id);
        }
      }
    }
  ];

  // Step 3: Define data transformation function (optional)
  const transformData = (item) => ({
    ...item,
    // Add any data transformations here
    // Example: format dates, combine fields, etc.
    createdAt: item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'N/A',
    status: item.isActive ? 'Active' : 'Inactive'
  });

  // Step 4: Define custom toolbar (optional)
  const customToolbar = () => (
    <div
      style={{
        marginBottom: '16px',
        padding: '8px',
        backgroundColor: '#f5f5f5',
        borderRadius: '4px',
        border: '1px solid #e0e0e0'
      }}
    >
      <strong>Template Information:</strong> This is a template for creating new list screens.
      <br />
      <small>Replace this with your actual content or remove if not needed.</small>
    </div>
  );

  return (
    <ReusableDataGrid
      // Step 5: Update these props for your use case
      title="Template List Screen" // Update title
      fetchUrl="/api/template" // Update API endpoint
      columns={columnsConfig}
      // Step 6: Update URLs for your routes
      editUrl="/template/edit" // Update edit route
      deleteUrl="/api/template/delete" // Update delete API
      addActionUrl="/template/add" // Update add route
      viewUrl="/template/view" // Update view route
      // Step 7: Update entity name for permissions
      entityName="TEMPLATE" // Update entity name
      // Step 8: Configure other options
      isPostRequest={true} // Set to false if using GET requests
      customActions={customActions}
      searchPlaceholder="Search items by name or description..." // Update placeholder
      // Step 9: Customize display options
      showSearch={true}
      showRefresh={true}
      showFilters={true}
      pageSizeOptions={[5, 10, 25, 50]}
      defaultPageSize={10}
      height={600}
      // Step 10: Add data transformation if needed
      transformData={transformData}
      // Step 11: Add custom toolbar if needed
      customToolbar={customToolbar}
      // Step 12: Add row click handler if needed
      onRowClick={(params) => {
        // Optional: Handle row clicks
        // navigate(`/template/view/${params.row.id}`);
      }}
    />
  );
};

export default ListScreenTemplate;

// ==============================|| USAGE EXAMPLES ||============================== //

/**
 * Example 1: Simple list screen with basic CRUD
 */
const SimpleExample = () => (
  <ReusableDataGrid
    title="Simple List"
    fetchUrl="/api/simple"
    columns={[
      { field: 'id', headerName: 'ID', width: 90 },
      { field: 'name', headerName: 'Name', flex: 1 }
    ]}
    editUrl="/simple/edit"
    deleteUrl="/api/simple/delete"
    addActionUrl="/simple/add"
    entityName="SIMPLE"
  />
);

/**
 * Example 2: List screen with custom actions only
 */
const CustomActionsExample = () => {
  const navigate = useNavigate();

  const customActions = [
    {
      icon: <span>📊</span>,
      label: 'Analytics',
      tooltip: 'View analytics',
      color: 'info',
      onClick: (row) => navigate(`/analytics/${row.id}`)
    }
  ];

  return (
    <ReusableDataGrid
      title="Custom Actions Example"
      fetchUrl="/api/custom"
      columns={[
        { field: 'id', headerName: 'ID', width: 90 },
        { field: 'name', headerName: 'Name', flex: 1 }
      ]}
      customActions={customActions}
      entityName="CUSTOM"
    />
  );
};

/**
 * Example 3: List screen with data transformation
 */
const DataTransformationExample = () => {
  const transformData = (item) => ({
    ...item,
    fullName: `${item.firstName} ${item.lastName}`,
    age: new Date().getFullYear() - new Date(item.birthDate).getFullYear()
  });

  return (
    <ReusableDataGrid
      title="Data Transformation Example"
      fetchUrl="/api/transformed"
      columns={[
        { field: 'id', headerName: 'ID', width: 90 },
        { field: 'fullName', headerName: 'Full Name', flex: 1 },
        { field: 'age', headerName: 'Age', width: 80 }
      ]}
      transformData={transformData}
      entityName="TRANSFORMED"
    />
  );
};

/**
 * Example 4: List screen with filters
 */
const FiltersExample = () => {
  const filters = {
    status: 'active',
    category: 'premium'
  };

  return (
    <ReusableDataGrid
      title="Filters Example"
      fetchUrl="/api/filtered"
      columns={[
        { field: 'id', headerName: 'ID', width: 90 },
        { field: 'name', headerName: 'Name', flex: 1 },
        { field: 'status', headerName: 'Status', width: 100 }
      ]}
      filters={filters}
      entityName="FILTERED"
    />
  );
};
