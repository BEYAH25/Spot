/** @type {import('next').NextConfig} */
import lingoCompiler from "lingo.dev/compiler";
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    // This helps with the searchParams invariant error
    // missingSuspenseWithCSRBailout: false,
  },
  // Ensure proper handling of client components
transpilePackages: [],
allowedDevOrigins: ['http://127.0.0.1'],
}
// export default lingoCompiler.next({
//   sourceLocale: "en",
//   targetLocales: ["es", "ja", "fr", "ru", "de", "zh", "ar", "ko", "tr"],
//   // models: {
//   //   "*:*": "groq:mistral-saba-24b",
//   // },
//   models: "lingo.dev",
//   sourceRoot: "src",
//   lingoDir: "lingo",
//   rsc: true,
  
// })(nextConfig);
module.exports = nextConfig