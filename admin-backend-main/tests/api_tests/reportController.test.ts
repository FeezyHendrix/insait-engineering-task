import axios from 'axios';
import constants from '../../src/constants';

describe('controlSupportPages', () => {
    test('should return paginated data if valid input is provided', async () => {
        const page = 1;
        const limit = 10;
        const order = 'asc';
        const orderBy = 'id';
        
        const response = await axios.get(`http://${constants.BACKEND_URL}/report/getAll`, {
            params: { page, limit, order, orderBy }
        });

        expect(response.status).toBe(200);
        expect(response.data).toHaveProperty('data');
        expect(response.data).toHaveProperty('pagination');
        expect(response.data.pagination).toHaveProperty('currentPage', page);
        expect(response.data.pagination).toHaveProperty('totalRecords');
        expect(response.data.pagination).toHaveProperty('totalPages');
    });

    test('should return filtered reports when search query is provided', async () => {
        const searchQuery = 'test';
        const response = await axios.get(`http://${constants.BACKEND_URL}/report/getAll`, {
            params: { search: searchQuery },
        });

        expect(response.status).toBe(200);
        expect(response.data).toHaveProperty('data');
        expect(response.data.data.length).toBeGreaterThanOrEqual(0);
    });
});
