import { call, put } from 'redux-saga/effects';
import { getCsrfToken } from 'src/helpers';
import { alertPush, sendError, userFetch } from 'src/modules';
import { API, RequestOptions } from '../../../../../api';
import {
    OrganizationAccountSwitch, organizationAccountSwitchError,
} from '../actions';

const config = (csrfToken?: string): RequestOptions => {
    return {
        apiVersion: 'barong',
        headers: { 'X-CSRF-Token': csrfToken },
    };
};

export function* organizationAccountSwitchSaga(action: OrganizationAccountSwitch) {
    try {
        yield call(API.post(config(getCsrfToken())), `/identity/sessions/switch`, action.payload);
        yield put(alertPush({ message: ['success.account.switch'], type: 'success' }));
        yield put(userFetch());
    } catch (error) {
        yield put(sendError({
            error,
            processingType: 'alert',
            extraOptions: {
                actionError: organizationAccountSwitchError,
            },
        }));
    }
}
