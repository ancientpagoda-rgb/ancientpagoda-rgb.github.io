(function(G){'use strict';
const LAND=[
[[-168,72],[-145,70],[-126,57],[-130,48],[-118,32],[-105,22],[-84,25],[-80,45],[-60,52],[-70,66],[-100,73],[-135,73]],
[[-74,12],[-60,8],[-45,2],[-35,-8],[-43,-24],[-54,-52],[-70,-55],[-79,-28],[-81,-5]],
[[-12,71],[20,72],[40,62],[32,48],[45,36],[28,32],[10,36],[-10,45],[-20,58]],
[[-18,36],[12,38],[35,31],[51,11],[42,-12],[32,-35],[18,-35],[4,-27],[-9,-5],[-14,15]],
[[30,71],[70,75],[110,72],[150,62],[178,54],[162,40],[142,36],[129,20],[107,7],[92,10],[78,25],[58,28],[43,38],[32,50]],
[[112,-11],[154,-10],[153,-39],[133,-44],[114,-34]],
[[130,34],[142,45],[146,35],[138,30]],
[[-52,82],[-20,80],[-23,60],[-47,60]]
];
const START={'English':450,'Spanish':900,'French':800,'Portuguese':1100,'Italian':900,'German':500,'Dutch':500,'Russian':1000,'Ukrainian':1100,'Polish':900,'Hindi':1200,'Urdu':1200,'Bengali':1000,'Marathi':1000,'Punjabi':1000,'Gujarati':1100,'Persian':800,'Mandarin Chinese':1300,'Cantonese':900,'Burmese':1100,'Arabic':600,'Hausa':1000,'Amharic':1200,'Indonesian':1900,'Malay':1300,'Javanese':800,'Filipino / Tagalog':1500,'Swahili':900,'Tamil':-300,'Telugu':600,'Kannada':500,'Malayalam':900,'Turkish':1000,'Japanese':700,'Korean':600,'Vietnamese':900,'Thai':1200,'Hungarian':900};
const PATH={
'English':[[300,53,9],[700,52,-1],[2026,52,-1]],'Spanish':[[500,42,12],[900,40,-4]],'French':[[500,42,12],[800,47,2]],'Portuguese':[[500,42,12],[1100,39,-8]],'Italian':[[500,42,12],[900,42,12]],'German':[[300,55,10],[500,51,10]],'Dutch':[[300,55,10],[500,52,5]],
'Russian':[[700,50,25],[1000,56,38]],'Ukrainian':[[700,50,25],[1100,49,32]],'Polish':[[700,50,25],[900,52,19]],
'Hindi':[[700,29,74],[1200,27,80]],'Urdu':[[700,29,74],[1200,31,74]],'Bengali':[[700,26,85],[1000,24,90]],'Marathi':[[700,24,77],[1000,19,75]],'Punjabi':[[700,29,74],[1000,31,75]],'Gujarati':[[700,25,74],[1100,23,72]],'Persian':[[300,32,53],[800,32,53]],
'Mandarin Chinese':[[900,35,110],[1300,39,116]],'Cantonese':[[700,32,112],[900,23,113]],'Burmese':[[700,24,97],[1100,21,96]],
'Arabic':[[500,24,45],[750,29,40],[2026,25,45]],'Hausa':[[800,12,8],[1000,12,7]],'Amharic':[[800,12,40],[1200,9,39]],
'Indonesian':[[1200,4,102],[1600,-2,113],[1900,-2,118]],'Malay':[[800,4,103],[1300,4,102]],'Javanese':[[800,-7,110]],'Filipino / Tagalog':[[1200,14,121],[1500,14,121]],
'Swahili':[[700,-4,39],[900,-6,39]],'Tamil':[[-300,10,78]],'Telugu':[[600,16,80]],'Kannada':[[500,15,76]],'Malayalam':[[900,10,76]],
'Turkish':[[700,45,75],[1000,40,50],[1200,39,35]],'Japanese':[[700,36,138]],'Korean':[[600,38,127]],'Vietnamese':[[600,21,106],[1200,16,106]],'Thai':[[900,23,102],[1200,15,101]],'Hungarian':[[700,53,55],[900,47,19]]};
const FAMILY_COL={ie:'#8bc59a',st:'#9b86c5',aa:'#cf9a68',an:'#65a9b4',nc:'#74a86d',dr:'#bb8172',tu:'#b1a060',ja:'#c78192',ko:'#9188bc',au:'#81a88b',kd:'#8da976',ur:'#7097a2'};
const PROTO=[
['pie','Proto-Indo-European',-4500,-2500,47,35,'ie'],['pg','Proto-Germanic',-500,450,55,10,'ie'],['latin','Latin',-700,700,42,12,'ie'],['pslav','Proto-Slavic',500,1000,50,25,'ie'],['sanskrit','Sanskrit / Middle Indo-Aryan',-1500,1000,29,76,'ie'],['piran','Proto-Iranian / Middle Persian',-1200,700,33,55,'ie'],
['pst','Proto-Sino-Tibetan',-4000,-1500,31,103,'st'],['och','Old / Middle Chinese',-1200,900,35,110,'st'],['pbur','Proto-Burmic / Old Burmese',600,1200,24,97,'st'],
['paa','Proto-Afro-Asiatic',-5000,-2500,23,36,'aa'],['psem','Proto-Semitic',-2500,600,30,40,'aa'],['pchad','Proto-Chadic',-2500,800,13,15,'aa'],['geez','Geʽez / Ethio-Semitic',100,1200,14,39,'aa'],
['pan','Proto-Austronesian',-3000,-1500,23,121,'an'],['pmp','Proto-Malayo-Polynesian',-1500,500,14,121,'an'],['pmalay','Proto-Malayic / Classical Malay',500,1400,3,104,'an'],['pphil','Proto-Philippine',-500,1200,13,122,'an'],
['pbantu','Bantu / Sabaki lineage',-1000,900,3,17,'nc'],['pdr','Proto-Dravidian',-3000,-1000,17,79,'dr'],['psd','Proto-South Dravidian',-1000,500,13,78,'dr'],['pturk','Proto-Turkic',-1000,500,48,90,'tu'],['poj','Old Turkic / Oghuz',600,1200,43,67,'tu'],['pjap','Proto-Japonic / Old Japanese',-1000,700,34,134,'ja'],['pkor','Proto-Koreanic / Middle Korean',-1000,600,39,127,'ko'],['pviet','Proto-Vietic',-800,900,21,105,'au'],['ptai','Proto-Tai',-500,1200,23,104,'kd'],['pugric','Proto-Ugric / Old Hungarian',-800,900,54,60,'ur']
].map(a=>({id:a[0],name:a[1],start:a[2],end:a[3],lat:a[4],lon:a[5],family:a[6]}));
Object.assign(G,{LAND,START,PATH,FAMILY_COL,PROTO});
})(window.__geoData=window.__geoData||{});
