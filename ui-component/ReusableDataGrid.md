# ReusableDataGrid Component Documentation

## Overview

The `ReusableDataGrid` component is a comprehensive, feature-rich data grid component designed to handle all list screens in the SCM application. It provides consistent functionality across different modules while maintaining flexibility for customization.

## Features

- ✅ **Server-side pagination** with configurable page sizes
- ✅ **Search functionality** with real-time filtering
- ✅ **Built-in CRUD operations** (Create, Read, Update, Delete)
- ✅ **Permission-based actions** using the permission system
- ✅ **Custom actions** for module-specific functionality
- ✅ **Data transformation** hooks for data formatting
- ✅ **Responsive design** with Material-UI components
- ✅ **Loading states** and error handling
- ✅ **Row selection** and click handlers
- ✅ **Custom toolbars** for additional functionality
- ✅ **Filter indicators** and refresh capabilities
- ✅ **Integrated filtering system** for school, class, and division

## Basic Usage

```jsx
import ReusableDataGrid from 'ui-component/ReusableDataGrid';

const MyListScreen = () => {
  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'name', headerName: 'Name', flex: 1 },
    { field: 'email', headerName: 'Email', width: 200 }
  ];

  return (
    <ReusableDataGrid
      title="My Data"
      fetchUrl="/api/my-data"
      columns={columns}
      editUrl="/edit"
      deleteUrl="/api/delete"
      addActionUrl="/add"
      entityName="MY_ENTITY"
    />
  );
};
```

## Props Reference

### Required Props

| Prop       | Type   | Description                          |
| ---------- | ------ | ------------------------------------ |
| `title`    | string | Title displayed in the card header   |
| `fetchUrl` | string | API endpoint to fetch data           |
| `columns`  | array  | Column definitions for the data grid |

### Optional Props

| Prop                      | Type     | Default         | Description                                 |
| ------------------------- | -------- | --------------- | ------------------------------------------- |
| `editUrl`                 | string   | -               | Base URL for edit actions                   |
| `deleteUrl`               | string   | -               | API endpoint for delete operations          |
| `addActionUrl`            | string   | -               | URL for the add button                      |
| `viewUrl`                 | string   | -               | Base URL for view actions                   |
| `entityName`              | string   | -               | Entity name for permission checks           |
| `isPostRequest`           | boolean  | true            | Whether to use POST for data fetching       |
| `filters`                 | object   | {}              | Additional filters to apply to API requests |
| `customActions`           | array    | []              | Custom action buttons for each row          |
| `searchPlaceholder`       | string   | "Search..."     | Placeholder text for search input           |
| `showSearch`              | boolean  | true            | Whether to show search functionality        |
| `showRefresh`             | boolean  | true            | Whether to show refresh button              |
| `showFilters`             | boolean  | true            | Whether to show filter indicators           |
| `pageSizeOptions`         | array    | [5, 10, 25, 50] | Available page size options                 |
| `defaultPageSize`         | number   | 10              | Default page size                           |
| `height`                  | number   | 600             | Height of the data grid                     |
| `transformData`           | function | null            | Function to transform API response data     |
| `onRowClick`              | function | null            | Handler for row click events                |
| `customToolbar`           | function | null            | Custom toolbar component                    |
| `checkboxSelection`       | boolean  | false           | Enable checkbox selection                   |
| `disableSelectionOnClick` | boolean  | false           | Disable selection on row click              |
| `enableFilters`           | boolean  | true            | Enable the integrated filter system         |
| `showSchoolFilter`        | boolean  | true            | Show school filter                          |
| `showClassFilter`         | boolean  | true            | Show class filter                           |
| `showDivisionFilter`      | boolean  | true            | Show division filter                        |

## Filter System

The component includes an integrated filtering system for school, class, and division that automatically handles:

- **Hierarchical filtering**: Class options depend on selected school, division options depend on selected class
- **Filter state management**: Automatically resets dependent filters when parent filters change
- **API integration**: Filters are automatically included in API requests
- **Visual feedback**: Shows active filters with chips and clear functionality

### Filter Configuration Examples

#### Students List (All Filters)
```jsx
<ReusableDataGrid
  title="Students Management"
  fetchUrl="/api/students"
  columns={columns}
  // Enable all filters
  enableFilters={true}
  showSchoolFilter={true}
  showClassFilter={true}
  showDivisionFilter={true}
/>
```

#### Teachers List (School Filter Only)
```jsx
<ReusableDataGrid
  title="Teachers Management"
  fetchUrl="/api/teachers"
  columns={columns}
  // Enable only school filter
  enableFilters={true}
  showSchoolFilter={true}
  showClassFilter={false}
  showDivisionFilter={false}
/>
```

#### Roles List (School Filter Only)
```jsx
<ReusableDataGrid
  title="Roles Management"
  fetchUrl="/api/roles"
  columns={columns}
  // Enable only school filter
  enableFilters={true}
  showSchoolFilter={true}
  showClassFilter={false}
  showDivisionFilter={false}
/>
```

#### Classes List (School Filter Only)
```jsx
<ReusableDataGrid
  title="Classes Management"
  fetchUrl="/api/classes"
  columns={columns}
  // Enable only school filter
  enableFilters={true}
  showSchoolFilter={true}
  showClassFilter={false}
  showDivisionFilter={false}
/>
```

## Column Configuration

Columns follow the Material-UI DataGrid specification:

```jsx
const columns = [
  {
    field: 'id',
    headerName: 'ID',
    width: 90
  },
  {
    field: 'name',
    headerName: 'Name',
    flex: 1,
    editable: true // Make column editable
  },
  {
    field: 'status',
    headerName: 'Status',
    width: 120,
    renderCell: (params) => <Chip label={params.value} color={params.value === 'Active' ? 'success' : 'error'} />
  }
];
```

## Custom Actions

Define custom actions for each row:

```jsx
const customActions = [
  {
    icon: <VisibilityIcon />,
    label: 'View Details',
    tooltip: 'View detailed information',
    color: 'info',
    permission: 'view', // Optional permission check
    onClick: (row) => {
      navigate(`/view/${row.id}`);
    }
  },
  {
    icon: <DownloadIcon />,
    label: 'Download',
    tooltip: 'Download file',
    color: 'secondary',
    onClick: (row) => {
      downloadFile(row.id);
    }
  }
];
```

## Data Transformation

Transform API response data before displaying:

```jsx
const transformData = (item) => ({
  ...item,
  fullName: `${item.firstName} ${item.lastName}`,
  formattedDate: new Date(item.createdAt).toLocaleDateString(),
  status: item.isActive ? 'Active' : 'Inactive'
});
```

## Custom Toolbar

Add custom toolbar above the grid:

```jsx
const customToolbar = () => (
  <Box sx={{ mb: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
    <Typography variant="h6">Summary</Typography>
    <Typography>Total Records: {totalCount}</Typography>
    <Button variant="contained" onClick={exportData}>
      Export Data
    </Button>
  </Box>
);
```

## Permission Integration

The component automatically checks permissions for actions:

```jsx
// In your permission system
const permissions = [
  {
    entityName: 'STUDENT',
    actions: {
      view: true,
      edit: true,
      delete: false
    }
  }
];

// Component will automatically show/hide actions based on permissions
<ReusableDataGrid
  entityName="STUDENT"
  // ... other props
/>;
```

## Advanced Features

### Row Selection

```jsx
const [selectionModel, setSelectionModel] = useState([]);

<ReusableDataGrid
  checkboxSelection={true}
  selectionModel={selectionModel}
  onSelectionModelChange={setSelectionModel}
  // ... other props
/>;
```

### Row Click Handling

```jsx
<ReusableDataGrid
  onRowClick={(params) => {
    console.log('Clicked row:', params.row);
    // Navigate or perform actions
  }}
  // ... other props
/>
```

### Custom Loading/Error States

```jsx
<ReusableDataGrid
  loadingOverlay={<CustomLoadingSpinner />}
  errorOverlay={<CustomErrorDisplay />}
  // ... other props
/>
```

## Examples

### Students List with All Filters

```jsx
const StudentsList = () => {
  const columns = [
    { field: 'rollNo', headerName: 'Roll No', width: 100 },
    { field: 'name', headerName: 'Name', flex: 1 },
    { field: 'className', headerName: 'Class', width: 120 },
    { field: 'divisionName', headerName: 'Division', width: 120 }
  ];

  const transformData = (student) => ({
    ...student,
    name: `${student.firstName} ${student.lastName}`,
    className: student.class?.name || 'N/A',
    divisionName: student.division?.name || 'N/A'
  });

  return (
    <ReusableDataGrid
      title="Students Management"
      fetchUrl="/api/students"
      columns={columns}
      editUrl="/students/edit"
      deleteUrl="/api/students/delete"
      addActionUrl="/students/add"
      entityName="STUDENT"
      transformData={transformData}
      searchPlaceholder="Search students by name, roll number..."
      // Enable all filters
      enableFilters={true}
      showSchoolFilter={true}
      showClassFilter={true}
      showDivisionFilter={true}
    />
  );
};
```

### Teachers List with School Filter Only

```jsx
const TeachersList = () => {
  const customActions = [
    {
      icon: <SubjectIcon />,
      label: 'View Subjects',
      tooltip: 'View assigned subjects',
      color: 'info',
      onClick: (teacher) => navigate(`/subjects/teacher/${teacher.id}`)
    },
    {
      icon: <ScheduleIcon />,
      label: 'View Schedule',
      tooltip: 'View teaching schedule',
      color: 'secondary',
      onClick: (teacher) => navigate(`/schedule/teacher/${teacher.id}`)
    }
  ];

  return (
    <ReusableDataGrid
      title="Teachers Management"
      fetchUrl="/api/teachers"
      columns={teacherColumns}
      customActions={customActions}
      entityName="TEACHER"
      // Enable only school filter
      enableFilters={true}
      showSchoolFilter={true}
      showClassFilter={false}
      showDivisionFilter={false}
    />
  );
};
```

## Best Practices

1. **Consistent Naming**: Use consistent entity names for permission checks
2. **Data Transformation**: Always transform API data to match column definitions
3. **Custom Actions**: Use custom actions for module-specific functionality
4. **Error Handling**: Implement proper error handling in custom actions
5. **Performance**: Use `useCallback` for custom action functions when possible
6. **Accessibility**: Provide meaningful tooltips and labels for actions
7. **Filter Configuration**: Choose appropriate filters based on the entity type:
   - **Students**: All filters (school, class, division)
   - **Teachers**: School filter only
   - **Roles**: School filter only
   - **Classes**: School filter only
   - **Exams**: All filters (school, class, division)

## Troubleshooting

### Common Issues

1. **Actions not showing**: Check if `entityName` matches your permission system
2. **Data not loading**: Verify `fetchUrl` and `isPostRequest` configuration
3. **Columns not displaying**: Ensure column `field` names match your data structure
4. **Permissions not working**: Verify permission structure and entity names
5. **Filters not working**: Check if `enableFilters` is true and appropriate filter props are set

### Debug Mode

Enable console logging to debug issues:

```jsx
// Add to your component for debugging
useEffect(() => {
  console.log('Permissions:', permissions);
  console.log('Entity Name:', entityName);
}, [permissions, entityName]);
```

## Migration Guide

### From Old List Screens

1. **Replace imports**: Import `ReusableDataGrid` instead of individual components
2. **Define columns**: Extract column definitions to a separate array
3. **Remove state management**: The component handles data, loading, and pagination
4. **Add entity name**: Include `entityName` for permission checks
5. **Configure filters**: Set appropriate filter configuration based on entity type
6. **Test functionality**: Verify all CRUD operations work correctly

### Example Migration

**Before:**

```jsx
const [data, setData] = useState([]);
const [loading, setLoading] = useState(false);
// ... lots of state management code

return (
  <MainCard>
    <DataGrid rows={data} columns={columns} loading={loading} />
  </MainCard>
);
```

**After:**

```jsx
return (
  <ReusableDataGrid
    title="My Data"
    fetchUrl="/api/my-data"
    columns={columns}
    entityName="MY_ENTITY"
    // Configure filters based on entity type
    enableFilters={true}
    showSchoolFilter={true}
    showClassFilter={false}
    showDivisionFilter={false}
    // ... other props
  />
);
```

This component significantly reduces boilerplate code while providing a rich, consistent user experience across all list screens, including an integrated filtering system for school, class, and division management.
