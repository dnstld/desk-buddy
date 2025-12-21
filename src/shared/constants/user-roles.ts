export const ROLES = {
  OWNER: "owner",
  MANAGER: "manager",
  MEMBER: "member",
} as const;

export type UserRole = (typeof ROLES)[keyof typeof ROLES];

export const ALERT_MESSAGES = {
  DELETE_TITLE: "Delete User",
  DELETE_CONFIRM: "Delete",
  ROLE_CHANGE_TITLE: "Change Role",
  CONFIRM: "Confirm",
  CANCEL: "Cancel",
  ERROR_TITLE: "Error",
  DELETE_WARNING: "This action cannot be undone.",
} as const;

export const ROLE_DESCRIPTIONS = {
  MANAGER: "Can create and manage rooms and reservations",
  MEMBER: "Standard access to the workspace",
  TOGGLE_ON: "Toggle on to make this person a manager",
} as const;

export const LOADING_MESSAGES = {
  LOADING_USER: "Loading user...",
  UPDATING_ROLE: "Updating role...",
  SETTING_MANAGER: "Setting manager...",
  DELETING_USER: "Deleting user...",
} as const;
