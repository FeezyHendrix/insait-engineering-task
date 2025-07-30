import { http, HttpResponse, passthrough } from 'msw';
import constants from '../../constants';
import { mockConfigurationResponse, mockEditableConfigurationsGet } from '../mockData';

export const handlers = [
  http.get(`${constants.COMPANY_CONFIG_BASE_URL}`, () => {
    return HttpResponse.json(mockConfigurationResponse)}),


  http.get(`${constants.COMPANY_CONFIG_BASE_URL}/editable/*`, () => {
    return HttpResponse.json(mockEditableConfigurationsGet)}),

  http.put(
    `${constants.COMPANY_CONFIG_BASE_URL}/editable/*`,
    () => {
      return HttpResponse.json({}, { status: 200 })
    }
  ),

  http.all('*', () => {
    return passthrough();
  }),

];