export const SUCCESS_MESSAGES = {
  RESOURCE_CREATED: "Resource created successfully.",
  LOGIN_SUCCESSFUL: "Login successful.",
  REGISTRATION_SUCCESSFUL: "Registration successful. Welcome!",
  OTP_SENT: "OTP sent to your registered contact.",
  LOGOUT_SUCCESSFUL: "Logged out successfully.",
  INFORMATION_UPDATED: "Information updated successfully.",
  CANCELLATION_SUCCESSFUL: "Cancellation successful.",
  ITEM_DELETED: "Item deleted successfully.",
  OPERATION_COMPLETED: "Operation completed successfully.",
  PASSWORD_RESET_SUCCESSFUL: "Password reset successfully. Please log in with your new password.",
  VERIFICATION_SUCCESSFUL: "Verification successful.",
  DATA_RETRIEVED: "Data retrieved successfully.",
  ACTION_PERFORMED: "Action performed successfully.",
  SUBMISSION_SUCCESSFUL: "Submitted successfully."
};

export const ERROR_MESSAGES = {
  // Authentication & Authorization Errors (4xx)
  AUTHENTICATION_REQUIRED: "Authentication required: No access token provided.",
  AUTHENTICATION_FAILED_INVALID_TOKEN: "Authentication failed: Invalid token.",
  AUTHENTICATION_FAILED_USER_NOT_FOUND: "Authentication failed: User not found.",
  TOKEN_EXPIRED: "Authentication token expired. Please log in again.",
  ACCESS_DENIED_PERMISSION: "Access denied: You do not have sufficient permissions.",
  ACCOUNT_BLOCKED: "Your account has been blocked. Please contact support.",
  OPERATION_NOT_PERMITTED: "Operation not permitted.",
  UNAUTHORIZED_ACCESS: "Unauthorized access.", // General unauthorized, use more specific if possible
  INVALID_CREDENTIALS: "Invalid email or password.",
  INVALID_USER_ROLE: "Invalid user role provided.",

  // Resource Not Found Errors (404)
  RESOURCE_NOT_FOUND: "Resource not found.", // General, use more specific if possible
  PAYMENT_NOT_FOUND: "Payment record not found.",
  TICKET_NOT_FOUND: "Ticket not found.",
  BOOKING_NOT_FOUND: "Booking record not found.",
  REQUEST_NOT_FOUND: "Request not found.",
  CATEGORY_NOT_FOUND: "Category not found.",
  USER_NOT_FOUND: "User not found.", // Specific for user resource
  EMAIL_NOT_FOUND: "Email address not found.", // Specific for email lookup

  // Validation & Input Errors (4xx)
  INPUT_VALIDATION_FAILED: "Input validation failed. Please check your data.",
  MISSING_REQUIRED_PARAMETERS: "Missing required parameters.",
  INCOMPLETE_INFORMATION: "Incomplete information provided.",
  INVALID_ID_PROVIDED: "Invalid ID provided.",
  ID_REQUIRED: "ID is required.",
  RESOURCE_ID_NOT_PROVIDED: "Resource ID not provided.",
  LOCATION_COORDINATES_REQUIRED: "Location coordinates (latitude and longitude) are required for this search.",
  INVALID_BOOKING_DATE_UNAVAILABLE: "The selected booking date is unavailable.",
  INVALID_TIME_SLOT_UNAVAILABLE: "The selected time slot is unavailable.",
  TIME_SLOT_FULLY_BOOKED: "The selected time slot is fully booked.",
  CURRENT_PASSWORD_INCORRECT: "The current password provided is incorrect.",
  NEW_PASSWORD_SAME_AS_CURRENT: "New password cannot be the same as the current password.",

  // Conflict Errors (409)
  ALREADY_REQUESTED: "This request has already been submitted.",
  ALREADY_REVIEWED: "This vendor has already been reviewed by the client.",
  EMAIL_ALREADY_EXISTS: "An account with this email address already exists.",
  CATEGORY_ALREADY_EXISTS: "Category with this name already exists.",

  // Internal/Operational Errors (5xx)
  UNEXPECTED_SERVER_ERROR: "An unexpected server error occurred. Please try again later.",
  FAILED_TO_RESET_UNREAD_COUNT: "Failed to reset unread message count.",
  FAILED_TO_MARK_MESSAGES_READ: "Failed to mark messages as read.",
  FAILED_TO_CONFIRM_PAYMENT: "Payment confirmation failed.",
  REFUND_PROCESSING_FAILED: "Refund processing failed.",
  NO_ASSOCIATED_CHARGE_FOUND: "No associated charge found for this payment.",
  CHAT_ROOM_NOT_FOUND: "Chat room not found.", // Could be 404 or 500 depending on context
  NOT_ABLE_TO_MARK_ATTENDANCE: "Permission denied: Only the host can mark attendance." // Specific permission error
};