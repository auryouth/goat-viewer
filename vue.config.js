module.exports = {
  publicPath: process.env.NODE_ENV === "production" ? "/goat-viewer/" : "/",
  transpileDependencies: [/[\\\/]node_modules[\\\/]dxf-viewer[\\\/]/],
};
