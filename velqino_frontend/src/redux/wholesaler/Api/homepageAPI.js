import API from '../../../utils/apiConfig';

const homepageAPI = {
    // Get homepage data
    getHomepageData: () =>
        API.get('catalog/homepage/'),
};

export default homepageAPI;