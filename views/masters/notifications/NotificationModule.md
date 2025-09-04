Notification Module
This document outlines the architecture and functionality of the Notification Module, implemented using a single, monolithic component. This approach consolidates all the views and logic for notifications into one file for simplicity and direct control.

Core Component and its Role
The module is built around a single component:

NotificationModule.jsx

Purpose: This component serves as the entire module's entry point and handles all user interactions and UI rendering.

Functionality: It manages the display for all views, including the list of notifications, the creation/editing form, and the detailed view of a single notification. Instead of relying on a router for navigation, it uses internal component state to switch between these different views.

How It Works
The single-component approach for the Notification Module operates on internal state-driven rendering:

The NotificationModule.jsx component maintains state variables such as currentView (e.g., "list", "add", "edit", "view") and selectedNotification.

When the component initially loads at the /masters/notifications route, it defaults to showing the list view.

Clicking a button like "Create New" or "Edit" on a notification row does not change the URL. Instead, it triggers an internal function that updates the currentView and selectedNotification states.

Based on these state changes, the component conditionally renders the relevant part of its UI, displaying either the list table, the form, or the detailed view. For instance, if currentView is set to "edit", the component renders the notification form and pre-populates it with data from selectedNotification.

This design makes the module self-contained and easy to understand from a single file, but it may become more complex to maintain as features are added.

Integration
The entire module is integrated into the application via a single route in routes/MainRoutes.jsx:

{
  path: 'notifications',
  element: <NotificationModule />
},

The menu item in menu-items/utilities.js points directly to this path, giving the user immediate access to the module's main view.



API Endpoints and Payloads
The Notification Module would interact with the backend through a set of REST API endpoints to perform its CRUD (Create, Read, Update, Delete) operations.

1. Create Notification
Endpoint: POST /api/notifications/create

Purpose: To create a new notification.

Payload (formState):

JSON

{
  "title": "Exam Timetable Released",
  "message": "The exam timetable for Class 8A has been uploaded. Please check the Exam Module.",
  "audience": "Class",
  "userType": ["STUDENT"],
  "activeFrom": "2025-09-01",
  "activeTo": "2025-09-05",
  "priority": "High",
  "type": "Info",
  "rollingBanner": true,
  "accountId": "your-account-id",
  "createdBy": "Admin"
}
2. Read Notifications (List View)
Endpoint: GET /api/notifications/getAll

Purpose: To fetch a list of all notifications. This endpoint would likely support query parameters for filtering and pagination.

Query Parameters: ?status=Active or ?status=Expired

3. Read a Single Notification (View/Edit)
Endpoint: GET /api/notifications/getById/:id

Purpose: To fetch the details of a specific notification by its ID.

URL Parameter: :id (the unique identifier of the notification)

4. Update Notification
Endpoint: PUT /api/notifications/update

Purpose: To update an existing notification.

Payload (formState): The payload would be identical to the creation payload, but it must include the unique id of the notification to be updated.

JSON

{
  "id": 1,
  "title": "Updated Exam Timetable",
  "message": "The revised exam timetable for Class 8A is now available.",
  "audience": "Class",
  "userType": ["STUDENT"],
  "activeFrom": "2025-09-01",
  "activeTo": "2025-09-10",
  "priority": "High",
  "type": "Info",
  "rollingBanner": true,
  "accountId": "your-account-id",
  "updatedBy": "Admin"
}
5. Delete Notification
Endpoint: DELETE /api/notifications/delete/:id

Purpose: To delete a specific notification.

URL Parameter: :id (the unique identifier of the notification)
