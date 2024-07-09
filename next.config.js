/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  i18n: {
    defaultLocale: "en",
    locales: ["en","es","fr","hi"]
  },
  
  
  webpack(config) {
    config.resolve.fallback = {

      // if you miss it, all the other options in fallback, specified
      // by next.js will be dropped.
      
      ...config.resolve.fallback,  

      fs: false, // the solution
    };
    
    return config;
  },
};
