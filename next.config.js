/** @type {import('next').NextConfig} */

const withPWA = require('next-pwa')({
	dest: 'public',
	disable: process.env.NODE_ENV === 'development',
	register: true,
	skipWaiting: true,
});

const nextConfig = {
	compress: true,
	eslint: {
		dirs: ['src'],
		ignoreDuringBuilds: true,
	},
	poweredByHeader: false,
	reactStrictMode: true,
	swcMinify: true,
	typescript: {
		ignoreBuildErrors: true,
	},
};

module.exports = withPWA(nextConfig);
