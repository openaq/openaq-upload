import * as constants from './constants';

import api from '../../services/openaq-api';

export function uploadData (data) {
    console.log('uploading data...')
    return (dispatch, getState) => {
        dispatch({
            type: constants.UPLOAD_DATA_START,
            data: data
        })
        return api.putUploadToolData(data)
            .then(data => {
                console.log('data', data)
                if (data.error) {
                    dispatch({
                        type: constants.UPLOAD_DATA_FAILED,
                        error: data
                    });
                } else {
                    dispatch({
                        type: constants.UPLOAD_DATA_SUCCESS,
                        data: data
                    });
                }
            })
    }
}

