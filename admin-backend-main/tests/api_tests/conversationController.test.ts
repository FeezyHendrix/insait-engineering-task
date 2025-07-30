import { describe, expect, test } from '@jest/globals';
import axios from 'axios';
import constants from '../../src/constants'; 

describe('Conversation API Pagination', () => {  
test('should return paginated conversations on valid input', async () => {
  const res = await axios.get(`http://${constants.BACKEND_URL}/conversations/conversationPages/1`, {
    params: {limit: 1 },
  });

  expect(res.status).toBe(200);
  expect(res.data).toHaveProperty('data');
  expect(res.data).toHaveProperty('pagination');
  expect(res.data.pagination).toHaveProperty('totalRecords');
  expect(res.data.pagination.totalRecords).not.toBeNaN();
  expect(res.data.pagination.totalRecords).toBeGreaterThan(0);
  expect(res.data.pagination).toHaveProperty('totalPages');
  expect(res.data.pagination.totalPages).not.toBeNaN();
  expect(res.data.pagination.totalPages).toBeGreaterThan(0);

  res.data.data.forEach((conversation: any) => {
    expect(conversation).toHaveProperty('messageCount');
    expect(conversation.messageCount).toBeGreaterThanOrEqual(2);
  });

    expect(res.data.pagination).toEqual({
      totalRecords: expect.any(Number),
      currentPage: 1,
      totalPages: expect.any(Number),
      nextPage: 2,
      previousPage: null,
      
    });
    expect(res.data.pagination.totalRecords).toBeGreaterThan(0);
    expect(res.data.pagination.totalPages).toBeGreaterThan(0);
  });

  test('should return 400 on invalid pagination data', async () => {
    const response = await axios
      .get(`http://${constants.BACKEND_URL}/conversations/conversationPages/-1`, {
        params: {limit: 10 },
      })
      .catch((err) => err.response);
    expect(response.status).toBe(400);
  });

  test('return products', async () => {
    const response = await axios.get(`http://${constants.BACKEND_URL}/conversations/products`);
    expect(response.status).toBe(200);
    expect(response.data).toEqual([
      "CDs",
      "mortgages",
      "loans",
      "credit card",
      "Fds",
      "bonds",
      "forex cash"
    ]);
  })

  test('should return a conversation by ID', async () => {
    const conversationId = 1; 
    const res = await axios.get(`http://${constants.BACKEND_URL}/conversations/${conversationId}`);

    expect(res.status).toBe(200);
    expect(res.data).toHaveProperty('id', conversationId);
    expect(res.data).toHaveProperty('product');
    expect(Array.isArray(res.data.messages)).toBe(true);
  });

});


