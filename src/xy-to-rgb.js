export const xyToRgb = (x, y, brightness) => {
  let Y = brightness
    , X = (Y / y) * x
    , Z = (Y / y) * (1 - x - y)
    , rgb =  [
        X * 1.612 - Y * 0.203 - Z * 0.302,
        -X * 0.509 + Y * 1.412 + Z * 0.066,
        X * 0.026 - Y * 0.072 + Z * 0.962
    ]
    ;

  // Apply reverse gamma correction.
  rgb = rgb.map(function (x) {
      return (x <= 0.0031308) ? (12.92 * x) : ((1.0 + 0.055) * Math.pow(x, (1.0 / 2.4)) - 0.055);
  });

  // Bring all negative components to zero.
  rgb = rgb.map(function (x) { return Math.max(0, x); });

  // If one component is greater than 1, weight components by that value.
  let max = Math.max(rgb[0], rgb[1], rgb[2]);
  if (max > 1) {
      rgb = rgb.map(function (x) { return x / max; });
  }

  rgb = rgb.map(function (x) { return Math.floor(x * 255); });

  return rgb;
};
