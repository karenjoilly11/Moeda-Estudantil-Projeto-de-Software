import api from './api';

export const instituicaoService = {
  listar: async () => {
    try {
      const response = await api.get('/instituicoes');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar instituições:', error);
      return [];
    }
  },
};
