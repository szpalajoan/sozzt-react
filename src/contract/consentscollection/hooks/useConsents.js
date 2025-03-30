import { useState } from 'react';
import useDataFetching from '../../../useDataFetching';

export const useConsents = (contractId) => {
    const { fetchData } = useDataFetching();
    const [consents, setConsents] = useState([]);
    const [publicConsents, setPublicConsents] = useState([]);

    const fetchConsents = async () => {
        try {
            const response = await fetchData(`contracts/consents/${contractId}`);
            setConsents(response.privatePlotOwnerConsents);
            setPublicConsents(response.publicOwnerConsents);
            return response;
        } catch (error) {
            console.error('Error fetching consents:', error);
            throw error;
        }
    };

    const beginConsentsCollection = async () => {
        try {
            await fetchData(`contracts/${contractId}/begin-consents-collection`, 'POST');
            return true;
        } catch (error) {
            console.error('Error beginning consents collection:', error);
            throw error;
        }
    };

    const addPrivateConsent = async (consentData) => {
        try {
            await fetchData(
                `contracts/consents/${contractId}/private-plot-owner-consent`, 
                'POST', 
                consentData
            );
            await fetchConsents();
        } catch (error) {
            console.error('Error adding private consent:', error);
            throw error;
        }
    };

    const addPublicConsent = async (consentData) => {
        try {
            await fetchData(
                `contracts/consents/${contractId}/public-plot-owner-consent`, 
                'POST', 
                consentData
            );
            await fetchConsents();
        } catch (error) {
            console.error('Error adding public consent:', error);
            throw error;
        }
    };

    const updateConsentStatus = async (consentId, status, comment) => {
        try {
            await fetchData(
                `${contractId}/private-plot-owner-consent/${consentId}/status`,
                'PUT',
                {
                    consentStatus: status,
                    statusComment: comment
                }
            );
            await fetchConsents();
        } catch (error) {
            console.error('Error updating consent status:', error);
            throw error;
        }
    };

    const updatePublicConsentStatus = async (consentId, status, comment) => {
        try {
            await fetchData(
                `contracts/consents/${contractId}/public-plot-owner-consent/${consentId}/status`,
                'PUT',
                {
                    consentStatus: status,
                    statusComment: comment
                }
            );
            await fetchConsents();
        } catch (error) {
            console.error('Error updating public consent status:', error);
            throw error;
        }
    };

    const invalidateConsent = async (consentId, reason) => {
        try {
            await fetchData(
                `contracts/consents/${contractId}/private-plot-owner-consent/${consentId}/invalidate`,
                'POST',
                { reason }
            );
            await fetchConsents();
        } catch (error) {
            console.error('Error invalidating consent:', error);
            throw error;
        }
    };

    const invalidatePublicConsent = async (consentId, reason) => {
        try {
            await fetchData(
                `contracts/consents/${contractId}/public-plot-owner-consent/${consentId}/invalidate`,
                'POST',
                { reason }
            );
            await fetchConsents();
        } catch (error) {
            console.error('Error invalidating public consent:', error);
            throw error;
        }
    };

    const approveConsent = async (consentId, approvalData, type = 'private') => {
        try {
            const endpoint = type === 'private'
                ? `contracts/consents/${contractId}/private-plot-owner-consent/${consentId}`
                : `contracts/consents/${contractId}/public-plot-owner-consent/${consentId}`;

            await fetchData(endpoint, 'PUT', approvalData);
            await fetchConsents();
        } catch (error) {
            console.error('Error approving consent:', error);
            throw error;
        }
    };

    const uploadConsentFile = async (consentId, file, type = 'private') => {
        try {
            const formData = new FormData();
            formData.append('file', file);
            
            const endpoint = type === 'private'
                ? `contracts/consents/${contractId}/private-plot-owner-consent/${consentId}/agreement`
                : `contracts/consents/${contractId}/public-plot-owner-consent/${consentId}/agreement`;
            
            await fetchData(endpoint, 'POST', formData, {
                headers: {
                    'Content-Type': undefined
                }
            });
        } catch (error) {
            console.error('Error uploading consent file:', error);
            throw error;
        }
    };

    const completeConsentsCollection = async () => {
        try {
            await fetchData(
                `contracts/consents/${contractId}/complete`,
                'POST'
            );
        } catch (error) {
            console.error('Error completing consents collection:', error);
            throw error;
        }
    };

    return {
        consents,
        publicConsents,
        fetchConsents,
        beginConsentsCollection,
        addPrivateConsent,
        addPublicConsent,
        updateConsentStatus,
        updatePublicConsentStatus,
        invalidateConsent,
        invalidatePublicConsent,
        approveConsent,
        uploadConsentFile,
        completeConsentsCollection
    };
}; 