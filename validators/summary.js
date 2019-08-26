const { check, validationResult } = require('express-validator');

/**
 * Checks for validation errors.
 *
 * @param {object} req - HTTP request object.
 * @param {object} res - HTTP response object.
 * @returns {*} - If there were any validation errors, returns error messages.
 */
function checkErrors(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(422).json({ errors: errors.array() });
}

/**
 * Checks if start and end date are in chronological order.
 *
 * @param {string} value - Value of query parameter passed in.
 * @param {object} req - HTTP request object.
 * @returns {*} - If both 'start' and 'end' are present, checks if start <= end.
 *                If only one of 'start' or 'end' is present, returns true.
 *                Otherwise, rejects promise.
 */
function chronologicalOrder(value, { req }) {
  const invalidOrderMessage = 'Start date must not be after end date.';

  if (req.query.start && req.query.end) {
    // both dates are present
    const start = new Date(req.query.start);
    const end = new Date(req.query.end);

    return (start <= end)
      ? true
      : Promise.reject(invalidOrderMessage);
  }

  return (req.query.start || req.query.end)
    // only one of 'start' or 'end' is present, not both
    ? true
    // neither 'start' nor 'end' exist
    : Promise.reject(invalidOrderMessage)
}

/**
 * Checks if date is a valid date and is of the correct form ('YYYY-MM-DD').
 *
 * @param {string} value - Value of query parameter passed in.
 * @returns {*} - If date is a valid date of the form 'YYYY-MM-DD', returns true.
 *                Otherwise, rejects promise.
 */
function isValidDate(value)  {
  const invalidDateMessage = 'Must be a valid date of the form \'YYYY-MM-DD\'.';

  // checks if date matches format
  if (!value.match(/^\d{4}-\d{2}-\d{2}$/))
    return Promise.reject(invalidDateMessage);

  // checks if date is valid date
  const date = new Date(value);
  return (date.toISOString().slice(0, 10) !== value)
    ? Promise.reject(invalidDateMessage)
    : true
}

const summaryValidator = [
  check('type')
    .optional()
    .isIn(['expenses' ,'income'])
    .withMessage('Type must be one of [\'expenses\', \'income\'], or omitted.'),
  check('start')
    .optional()
    .custom(isValidDate)
    .custom(chronologicalOrder),
  check('end')
    .optional()
    .custom(isValidDate)
    .custom(chronologicalOrder),
];

module.exports = { checkErrors, summaryValidator };