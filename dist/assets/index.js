'use strict';

/* Setting important properties */
exports.chProps = [ 'title', 'url', 'logo' ];
exports.props = [
	'url', 'title', 'ftitle', 'description', 'logo', 'category', 
	'classification', 'duration', 'release_year', 'language'
];
exports.classifications = [ 'L', '10', '12', '14', '16', '18' ];
exports.categories = [ 'action', 'comedy', 'drama', 'horror', 'thriller', 'romance', 'animation', 'childrens', 'documentary', 'fantasy', 'fiction' ];
exports.langs = [ 'pt', 'en' ];
exports.DataType = { Channel: 'CHANNEL', Movie: 'MOVIE' };
exports.origins = [ 'https://egmplayer.xyz' ];
exports.Discord = { GatewayVersion: '10', RqmChannel: '1175944084813250620', LogsChannel: '' };

/* Functions */
exports.vldu = (u) => { try { new URL(u); return !0; } catch { return !1; } };
exports.capitalize = (t) => t.replace(/\S*/g, (w) => w.charAt(0).toUpperCase() + w.substr(1));
exports.TMDBReader = require('./TMDBReader');
