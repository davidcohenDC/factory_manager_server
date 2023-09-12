module.exports = (req) => {
    if (!req || !req.headers) {
        return 'no-ip';  // o qualsiasi altro valore di default che desideri utilizzare
    }

    return req.headers['x-forwarded-for']
        ? req.headers['x-forwarded-for'].split(/, /)[0]
        : req.connection.remoteAddress;
}