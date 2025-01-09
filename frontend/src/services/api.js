import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000';
axios.defaults.headers.common['Content-Type'] = 'application/json';

export const getContents = (parentId) => 
    axios.get(`${API_BASE_URL}/nodes/`, { params: { parent_id: parentId } });

export const createNode = (data) => 
    axios.post(`${API_BASE_URL}/nodes/`, data);

export const deleteNode = (id) => 
    axios.delete(`${API_BASE_URL}/nodes/${id}/`);

export const updateNode = (id, data) => 
    axios.put(`${API_BASE_URL}/nodes/${id}/`, data);

export const migrateNode = (id, data) => 
    axios.put(`${API_BASE_URL}/migrate-node/${id}/`, data);
