// playersService.js
import api from './api.js';

export const getPlayers = async () => {
    const res = await api.get('/players');
    return res.data;
};

export default { getPlayers };
