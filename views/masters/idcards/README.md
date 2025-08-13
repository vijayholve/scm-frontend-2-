# ID Card Management Module

## Overview
The ID Card Management module provides a comprehensive solution for generating, customizing, and managing student and teacher ID cards within the school management system.

## Features

### 🎨 Template Selection
- **Modern Design**: Clean and contemporary design with vibrant gradients
- **Classic Border**: Traditional design with elegant borders and formal styling
- **Minimal Flat**: Simple and minimalist flat design with clean typography

### 👥 User Management
- **Student ID Cards**: Generate ID cards for students with roll numbers, class, and division
- **Teacher ID Cards**: Generate ID cards for faculty with roles and departments
- **Bulk Generation**: Select multiple users for batch ID card generation
- **Individual Generation**: Generate single ID cards with live preview

### 🔧 Advanced Features
- **Live Preview**: Real-time preview of ID card with selected template
- **Print Support**: Direct printing functionality for physical ID cards
- **PDF Download**: Download ID cards as high-quality PDF files
- **Responsive Design**: Mobile-friendly interface for all screen sizes

## Component Structure

```
src/views/masters/idcards/
├── index.jsx                 # Main ID card management component
├── IdCardGenerationModal.jsx # Modal for template selection and generation
├── IdCardTemplate.jsx        # Template components with different designs
└── README.md                # This documentation file
```

## Usage

### Navigation
Access the ID Card module through:
- **Menu Path**: Masters → ID Cards
- **URL**: `/masters/idcards`

### Workflow
1. **Select Entity Type**: Choose between Students or Teachers tab
2. **Filter Data**: Use search and filters (class, division) to find specific users
3. **Select Users**: Check individual users or use "Select All" for bulk operations
4. **Generate ID Cards**: Click "Generate ID Cards" button
5. **Choose Template**: Select from available templates with live preview
6. **Print/Download**: Use print or PDF download functionality

### Templates

#### Modern Design
- Gradient background with vibrant colors
- Contemporary typography
- Icon-based information display
- Professional footer

#### Classic Border
- Traditional border design
- Formal color scheme
- Structured layout
- Academic institution styling

#### Minimal Flat
- Clean, minimalist design
- Flat design principles
- Subtle color accents
- Modern typography

## Technical Implementation

### Dependencies
- `html2canvas`: For capturing ID card components as images
- `jspdf`: For generating PDF documents
- `@mui/material`: Material-UI components for consistent UI
- `@mui/icons-material`: Material Design icons

### Data Structure
ID cards support the following user fields:
- Personal: firstName, lastName, middleName, gender, dob
- Contact: email, mobile, address
- Academic: rollNo (students), className, divisionName, role (teachers)
- System: id, status, accountId, schoolId

### Permissions
The module requires `IDCARD` permission with `view` action for access.

## Customization

### Adding New Templates
1. Create a new template component in `IdCardTemplate.jsx`
2. Add template metadata to the `templates` array in `IdCardGenerationModal.jsx`
3. Update the switch statement in the main `IdCardTemplate` component

### Styling Modifications
- Templates use Material-UI's styled components
- CSS-in-JS approach for dynamic styling
- Responsive design principles
- Print-specific styles for optimal printing

## API Integration

### Required Endpoints
- `/api/students/findall` - Fetch student data
- `/api/users/findall` - Fetch teacher/staff data
- `/api/class/findall` - Fetch class information
- `/api/division/findall` - Fetch division information

### Data Filtering
Supports filtering by:
- Search terms (name, roll number, email)
- Class ID
- Division ID
- User status

## Browser Compatibility
- Modern browsers with ES6+ support
- Print functionality requires browser print dialog support
- PDF generation works in all modern browsers
- Canvas API support required for image generation

## Future Enhancements
- Custom template builder
- QR code integration
- Photo upload functionality
- Batch photo import
- Digital signature integration
- Multiple school logo support