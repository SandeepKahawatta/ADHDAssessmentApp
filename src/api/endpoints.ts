import client from './client';
import {
    QuestionnaireInput,
    GameDataInput,
    QuestionnaireResponse,
    GameDataResponse,
    FinalResultResponse,
    PendingResultResponse
} from '../types';

export const submitQuestionnaire = async (data: QuestionnaireInput): Promise<QuestionnaireResponse> => {
    try {
        const response = await client.post<QuestionnaireResponse>('/submit-questionnaire', data);
        return response.data;
    } catch (error) {
        console.error('Error submitting questionnaire:', error);
        throw error;
    }
};

export const submitGameData = async (data: GameDataInput): Promise<GameDataResponse> => {
    try {
        const response = await client.post<GameDataResponse>('/submit-game-data', data);
        return response.data;
    } catch (error) {
        console.error('Error submitting game data:', error);
        throw error;
    }
};

export const getFinalResult = async (childId: string): Promise<FinalResultResponse | PendingResultResponse> => {
    try {
        const response = await client.get<FinalResultResponse | PendingResultResponse>(`/get-final-result/${childId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching final result:', error);
        throw error;
    }
};
