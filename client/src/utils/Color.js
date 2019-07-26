/**
 * Stroke and fill colors.
 */
const fillColor1 = 'rgba(128, 182, 244, 0.4)';
const fillColor2 = 'rgba(244, 144, 128, 0.4)';
const strokeColor1 = '#80b6f4';
const strokeColor2 = '#f49080';
const lineChart = {
  fillColor1,
  fillColor2,
  strokeColor1,
  strokeColor2
};

/**
 * Tooltip colors.
 */
const backgroundColor = '#e7e7e7';
const textColor = 'rgba(51, 51, 51, 0.75)';
const tooltip = {
  backgroundColor,
  textColor,
};

/**
 * Creates canvas gradient with given colors starting at (x0, y0) and ending at (x1, y1).
 *
 * @param {CanvasRenderingContext2D} ctx - A canvas element's 2D rendering context.
 * @param {String} color1 - Starting color of gradient.
 * @param {String} color2 - Ending color of gradient.
 * @param {Number} x0 - The x-coordinate of the start of the gradient.
 * @param {Number} y0 - The y-coordinate of the start of the gradient.
 * @param {Number} x1 - The x-coordinate of the end of the gradient.
 * @param {Number} y1 - The y-coordinate of the end of the gradient.
 * @returns {CanvasGradient} - The gradient created.
 */
function getGradient(ctx, color1, color2, x0 = 0, y0 = 0, x1 = 0, y1 = 0) {
  const gradient = ctx.createLinearGradient(x0, y0, x1, y1);
  gradient.addColorStop(0, color1);
  gradient.addColorStop(1, color2);
  return gradient;
}

export {
  getGradient,
  lineChart,
  tooltip,
};