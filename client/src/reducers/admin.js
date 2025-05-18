// This is a placeholder reducer for admin functionality
// In a complete implementation, we would add actions for user management, etc.

const initialState = {
  users: [],
  retailers: [],
  manufacturers: [],
  pendingApprovals: [],
  loading: false,
  error: {}
};

function adminReducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    // Add actual cases when you implement admin actions
    default:
      return state;
  }
}

export default adminReducer; 