(function(G){'use strict';
const MIG=[
{name:'IE westward dispersal',start:-3500,end:-1400,c:'#8bc59a',pts:[[47,35],[49,27],[50,18],[48,8]]},
{name:'IE Indo-Iranian dispersal',start:-2500,end:-1000,c:'#8bc59a',pts:[[47,35],[41,48],[35,62],[29,76]]},
{name:'Austronesian expansion',start:-2500,end:900,c:'#65a9b4',pts:[[23,121],[14,121],[3,120],[-7,110],[-5,140]]},
{name:'Bantu expansion',start:-1000,end:1000,c:'#74a86d',pts:[[6,10],[1,18],[-4,27],[-8,36]]},
{name:'Turkic westward movement',start:500,end:1200,c:'#b1a060',pts:[[48,90],[45,70],[41,52],[39,35]]},
{name:'Arabic expansion / contact zone',start:600,end:950,c:'#cf9a68',pts:[[24,45],[31,35],[32,18],[35,-5]]},
{name:'Arabic–Swahili Indian Ocean contact',start:700,end:1200,c:'#e2a46e',pts:[[24,45],[12,45],[-6,39]]},
{name:'Chinese-character diffusion east',start:200,end:850,c:'#72bfd1',pts:[[35,110],[37,127],[36,138]]},
{name:'Chinese-character diffusion south',start:200,end:1000,c:'#72bfd1',pts:[[35,110],[25,108],[18,106]]},
{name:'Latin-script globalization',start:1500,end:1950,c:'#b995e8',pts:[[42,12],[30,0],[5,30],[-2,100],[14,121]]}
];
const SCRIPT=[
['Latin alphabet',-650,2026,42,12,'#b995e8',0],['Greek alphabet',-800,2026,38,23,'#b995e8',1],['Phoenician',-1050,-300,34,36,'#b995e8',1],['Aramaic',-800,700,34,39,'#b995e8',1],['Arabic script',400,2026,24,45,'#b995e8',0],['Perso-Arabic',800,2026,32,53,'#b995e8',1],['Cyrillic',900,2026,43,25,'#b995e8',0],['Geʽez script',300,2026,14,39,'#d18a68',0],['Brahmi',-300,600,24,78,'#d4b66d',0],['Devanagari',1000,2026,26,80,'#d4b66d',0],['Bengali–Assamese',1000,2026,24,90,'#d4b66d',1],['Gurmukhi',1500,2026,31,75,'#d4b66d',1],['Gujarati script',1500,2026,23,72,'#d4b66d',1],['Tamil script',600,2026,10,78,'#d4b66d',1],['Telugu script',1000,2026,16,80,'#d4b66d',1],['Kannada script',1000,2026,15,76,'#d4b66d',1],['Malayalam script',1100,2026,10,76,'#d4b66d',1],['Thai script',1250,2026,15,101,'#d4b66d',1],['Burmese script',1000,2026,21,96,'#d4b66d',1],['Javanese script',1200,2026,-7,110,'#d4b66d',1],['Chinese characters',-1300,2026,35,110,'#72bfd1',0],['Japanese kanji',400,2026,36,138,'#72bfd1',1],['Hangul',1443,2026,38,127,'#d98cae',0],['Quốc ngữ',1650,2026,16,106,'#b995e8',1]
].map(a=>({name:a[0],start:a[1],end:a[2],lat:a[3],lon:a[4],c:a[5],level:a[6]}));
const SCRIPT_USE={
'Latin alphabet':[['English',600],['Spanish',700],['French',800],['Portuguese',1100],['Italian',800],['German',800],['Dutch',900],['Polish',1000],['Hungarian',1000],['Filipino / Tagalog',1550],['Malay',1600],['Javanese',1800],['Indonesian',1900],['Swahili',1800],['Hausa',1900],['Turkish',1928]],
'Cyrillic':[['Russian',1000],['Ukrainian',1100]],'Arabic script':[['Arabic',600]],'Perso-Arabic':[['Persian',800],['Urdu',1200]],'Devanagari':[['Hindi',1200],['Marathi',1200]],'Bengali–Assamese':[['Bengali',1100]],'Gurmukhi':[['Punjabi',1550]],'Gujarati script':[['Gujarati',1500]],'Geʽez script':[['Amharic',1200]],'Chinese characters':[['Mandarin Chinese',200],['Cantonese',200]],'Japanese kanji':[['Japanese',700]],'Hangul':[['Korean',1446]],'Quốc ngữ':[['Vietnamese',1700]],'Thai script':[['Thai',1300]],'Burmese script':[['Burmese',1100]],'Tamil script':[['Tamil',600]],'Telugu script':[['Telugu',1000]],'Kannada script':[['Kannada',1000]],'Malayalam script':[['Malayalam',1100]],'Javanese script':[['Javanese',1200]]};
Object.assign(G,{MIG,SCRIPT,SCRIPT_USE});
})(window.__geoData=window.__geoData||{});
