function getDesktopSize(size) {
  return `${size >= 0 ? 'min' : 'max'}(${Math.round((size / 19.2) * 1000) / 1000}svw,
       ${Math.round((size / 10.8) * 1000) / 1000}svh)`;
}

function getTabletSize(size) {
  return `${size >= 0 ? 'min' : 'max'}(${Math.round((size / 10.24) * 1000) / 1000}svw,
       ${Math.round((size / 13.66) * 1000) / 1000}svh)`;
}

function getMobileSize(size) {
  return `${size >= 0 ? 'min' : 'max'}(${Math.round((size / 3.6) * 1000) / 1000}svw,
       ${Math.round((size / 6.4) * 1000) / 1000}svh)`;
}

module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    'postcss-functions': { functions: { getDesktopSize, getTabletSize, getMobileSize } },
  },
};
