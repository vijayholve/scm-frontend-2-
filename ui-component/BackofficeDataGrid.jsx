import React from 'react';
import ReusableDataGrid from './ReusableDataGrid';
import { userDetails } from 'utils/apiService';

const BackofficeDataGrid = ({
  fetchUrl,
  accountId = userDetails.getAccountId(), // Default to current user's accountId
  ...props
}) => {
  // Transform the payload to include accountId
  const transformPayload = (basePayload) => ({
    ...basePayload,
    accountId // Add accountId to the payload
  });

  // Pass the transformed payload to the ReusableDataGrid
  return (
    <ReusableDataGrid
      fetchUrl={fetchUrl}
      transformData={(data) => {
        // Optionally transform data for Backoffice-specific needs
        return {
          ...data,
          isActive: data.isActive ? 'Active' : 'Inactive',
          createdAt: data.createdAt ? new Date(data.createdAt).toLocaleDateString() : 'N/A'
        };
      }}
      transformPayload={transformPayload} // Custom payload transformation
      {...props}
    />
  );
};

export default BackofficeDataGrid;
