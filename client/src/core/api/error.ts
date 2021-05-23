/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import requests from './api';

export const TestError = {
  handleNotFound: () => requests.get('/buggy/not-found'),
  handleBadRequest: () => requests.get('/buggy/bad-request'),
  handleServerError: () => requests.get('/buggy/server-error'),
  handleUnauthorised: () => requests.get('/buggy/unauthorised'),
  handleBadGuid: () => requests.get('/activities/notaguid'),
  handleValidationError: () => requests.post('/activities', {})
};