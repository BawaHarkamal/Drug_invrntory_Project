// This is a placeholder reducer for manufacturer functionality
// In a complete implementation, we would add actions for production batches, etc.

const initialState = {
  productionBatches: [],
  loading: false,
  error: {}
};

function manufacturerReducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    // Add actual cases when you implement manufacturer actions
    default:
      return state;
  }
}

export default manufacturerReducer; 