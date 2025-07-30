import axios from 'axios';
import constants from '../../src/constants';
import { testScenarioPayload } from '../constants';

describe('controlUserSettings', () => {
    test('post 101 scenarios and get 429 on last one', async () => {
        for (let i = 0; i <= 100; i++) {
            try {
                const response = await axios.post(`http://${constants.BACKEND_URL}/testScenarios`, {data: testScenarioPayload});
                expect(response.status).toBe(201);
                expect(response.data).toHaveProperty('success');
                expect(i).toBeLessThan(100);              
            } catch (error: any) {
                expect(error.response?.status).toBe(429);
                expect(error.response?.data).toEqual('Too many requests from this IP, please try again in 15 minutes');
                expect(i).toBe(100);
            }
        }
    }, 20000);

    test('successfully get and delete a scenario', async () => {
        const response = await axios.get(`http://${constants.BACKEND_URL}/testScenarios`);
        const { data } = response.data;
        const { testScenarioId } = data[0];
        const deleteResponse = await axios.delete(`http://${constants.BACKEND_URL}/testScenarios/${testScenarioId}`);
        expect(deleteResponse.status).toBe(200);
        expect(deleteResponse.data).toHaveProperty('success');
    });
});
