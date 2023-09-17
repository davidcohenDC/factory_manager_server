module.exports = {
    formatMessage: (username, message) => {
        return {
            username,
            message,
            time: new Date().toISOString()
        };
    }
};