/**
 * Express middleware to handle pagination.
 *
 * @param {Object} options - Configuration options for pagination
 * @param {number} [options.itemsPerPage=50] - Default number of items per page.
 * @param {number} [options.maxItemsPerPage=100] - Maximum allowable number of items per page.
 * @returns {Function} Express middleware function
 */
module.exports = (options = {}) => {
  const itemsPerPage = options.itemsPerPage || process.env.ITEMS_PER_PAGE
  const maxItemsPerPage =
    options.maxItemsPerPage || process.env.MAX_ITEMS_PER_PAGE

  return (req, res, next) => {
    let { limit, offset } = req.query

    limit = parseInt(limit, 10) || itemsPerPage
    offset = parseInt(offset, 10) || 0

    if (limit > maxItemsPerPage) {
      return res
        .status(400)
        .json({
          error: `Limit should not exceed ${maxItemsPerPage} items per request.`
        })
    }

    req.pagination = { limit, offset }
    next()
  }
}
