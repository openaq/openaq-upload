import * as constants from './constants';

const initialState = {
  uploading: false,
  uploadSuccess: false,
  uploadFailed: false,
  success: null,
  error: null
};

function reducer(state = initialState, action) {
  switch (action.type) {
    case constants.UPLOAD_DATA_START: {
      return {
        ...initialState,
        uploading: true
      };
    }

    case constants.UPLOAD_DATA_SUCCESS: {
      return {
        ...initialState,
        uploadSuccess: true,
        success: action.data
      }
    }

    case constants.UPLOAD_DATA_FAILED: {
      return {
        ...initialState,
        uploadFailed: true,
        error: action.error
      }
    }
    case constants.UPLOAD_NEW_FILE: {
      return {
        ...initialState
      }
    }
  }
  return state;
}

export default reducer;
