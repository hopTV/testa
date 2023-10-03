/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  outputStandalone: true,
  images: {
    domains: [
      'www.primefaces.org',
      'www.worldometers.info',
      'www.worldatlas.com'
    ]
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack']

      // use: [
      //   {
      //     loader: "@svgr/webpack",
      //     options: {
      //       prettier: false,
      //       svgo: true,
      //       svgoConfig: {
      //         plugins: [
      //           {
      //             name: "preset-default",
      //             params: {
      //               overrides: {
      //                 // disable plugins
      //                 removeViewBox: false,
      //               },
      //             },
      //           },
      //         ],
      //       },
      //       titleProp: true,
      //     },
      //   },
      // ],
    })

    return config
  }
}

module.exports = nextConfig
