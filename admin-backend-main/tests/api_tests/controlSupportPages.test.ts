import { describe, expect, test } from "@jest/globals"
import axios from "axios"
import constants from "../../src/constants"


describe('fetch searched vars',() =>{
    test('should return paginated report with default params', async() =>{
        const response = await axios.get(`http://${constants.BACKEND_URL}/report/getAll`);
        expect(response.status).toBe(200);
        expect(response.data).toHaveProperty('data');
        expect(response.data).toHaveProperty('pagination');
        expect(response.data.pagination).toHaveProperty('currentPage',parseInt(constants.PAGINATION.DEFAULT_PAGE,10));
        
    });
    test('should return paginated report with specific params', async() =>{
        const response = await axios.get(`http://${constants.BACKEND_URL}/report/getAll`,{
            params:{
                search: 'test',
                id: '9',
                subject: 'test'
            }
        });
        expect(response.status).toBe(200);
        expect(response.data).toHaveProperty('data');
        expect(response.data).toHaveProperty('pagination');
        expect(response.data.pagination).toHaveProperty('currentPage', parseInt(constants.PAGINATION.DEFAULT_PAGE, 10)); 

    });

    test('should return empty data for no matching results', async () => {
        const response = await axios.get(`http://${constants.BACKEND_URL}/report/getAll`, {
            params: {
                search: "bananna"
            }
        });
        expect(response.status).toBe(200);
        expect(response.data.pagination).toHaveProperty('totalRecords');
        expect(response.data.pagination).toHaveProperty('totalPages');
        expect(response.data.pagination).toHaveProperty('currentPage');
        expect(response.data.pagination.totalRecords).toBe(0);
        expect(response.data.data).toEqual([]);
    })
});
