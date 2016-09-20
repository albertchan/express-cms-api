module.exports = {
  // See http://brunch.io/#documentation for docs.
  files: {
    javascripts: {
      joinTo: {
        'js/vendor.js': /^(?!src\/client)/,
        'js/app.js': /^(src\/client)/
      }
    }
  },

  paths: {
    // Dependencies and current project directories to watch
    watched: [],
  },

  plugins: {
    babel: {
      presets: ['es2015']
    }
  }
};
