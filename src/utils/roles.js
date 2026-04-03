/**
 * Supported RBAC roles.
 */
export const ROLES = Object.freeze({
  VIEWER: "viewer",
  ANALYST: "analyst",
  ADMIN: "admin"
});

/**
 * Numeric role weight used for authorization comparisons.
 * Higher weight means more privileges.
 * @param {string} role
 * @returns {number}
 */
export const roleWeight = (role) => {
  switch (role) {
    case ROLES.VIEWER:
      return 1;
    case ROLES.ANALYST:
      return 2;
    case ROLES.ADMIN:
      return 3;
    default:
      return 0;
  }
};

