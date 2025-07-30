import axios from 'axios';
import constants from '../../src/constants';

describe('controlUserSettings', () => {
    const chartsToAdd = ['chart1', 'chart2', 'chart3', 'chart4', 'chart5', 'chart6', 'chart7', 'chart8', 'chart9', 'chart10'];
    const chartsToRemove = ['chart1', 'chart2'];
    const remainingCharts = chartsToAdd.filter((chart) => !chartsToRemove.includes(chart));
    
    test('add favorite charts', async () => {
        for (const [index, chart] of chartsToAdd.entries()) {
            const response = await axios.put(`http://${constants.BACKEND_URL}/userSettings/favoriteCharts`, {payload: {chartType: chart, action: 'add' }});
            expect(response.status).toBe(200);
            expect(response.data.length).toBe(index + 1);
        }
    });

    test('remove favorite charts', async () => {
        for (const [index, chart] of chartsToRemove.entries()) {
            const response = await axios.put(`http://${constants.BACKEND_URL}/userSettings/favoriteCharts`, {payload: { chartType: chart, action: 'remove' }});
            expect(response.status).toBe(200);
            expect(response.data.length).toBe(chartsToAdd.length - index - 1);
        };
    });

    test('return favorite charts', async () => {
        const response = await axios.get(`http://${constants.BACKEND_URL}/userSettings`);
        const { favoriteCharts } = response.data;
        expect(response.status).toBe(200);
        expect(favoriteCharts.length).toBe(remainingCharts.length);
        expect(favoriteCharts).toEqual(remainingCharts);
    });
});
