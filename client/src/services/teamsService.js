// teamsService.js
import api from './api.js';

export const getTeams = async () => {
    const res = await api.get('/teams');
    return res.data;
};

export default { getTeams };
