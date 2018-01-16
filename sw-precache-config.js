module.exports = {  
    staticFileGlobs: 
        [    'dist/**.html',    'dist/**.js',    'dist/**.css',    'dist/assets/**', '!dist/assets/sass/**' ],  
    root: 'dist',  
    stripPrefix: 'dist/',  
    navigateFallback: '/index.html'
};