constRingDiameter = 2.5;
constRingDiameterMaxError = 0.7;

// NB Arrays will effectively be 1-indexed to fit external scheme. 
// So centres[0, n] and minima[0, n] will be empty, as will centres[n, 0] and minima[n, 0] 

// For points PQ, centres[P][Q] should be a low error measurement between centres (of P and Q).
// If later measurements are taken that disagree, the more accurate shoul dbe chosen as the single centres value
const centres = new Array(19).fill().map(_ => []);

// For points RS minima[R][S] will be a measurement between the inner edge of R and the inner edge of S.
// These should be minima, ie a square stud of with sides 0.8 should fit completely within rings R and S
// if spaced minimia[R][S] from other stud.
// These measurements will definitely have an error (as they will be less than the equivalent centres measure)
// minima[R][S] may be an array containing successive measurments (ordered) and some strategy should be used to resolve differences.
const minima = new Array(19).fill().map(_ => []);

const range = new Array(18)
.fill()
.map((el, idx) => idx + 1);

const populate = () => {

  centres[1][2] = 71.5;
  centres[1][18] = 78.4;

  // centres[2][1] = centres[1][2];
  centres[2][3] = 60.2;

  centres[3][4] = 59.6;
  centres[4][5] = 156.2;
  centres[5][6] = 60.7;
  centres[6][7] = 41.5;
  centres[7][8] = 57.5;
  centres[8][9] = 57.1;
  centres[9][10] = 61.0;
  centres[10][11] = 64.4;
  centres[11][12] = 59.4;
  centres[12][13] = 65.4;
  centres[13][14] = 64.0;
  centres[14][15] = 63.9;
  centres[15][16] = 69.1;
  centres[16][17] = 69.3;
  // centres[17][18] = MISSING!;
  // centres[18][1] = centres[1][18];
  
  minima[1][3] = 126.7;
  minima[1][4] = 181.6;
  minima[1][17] = 136.5;
  minima[1][16] = 199.0;

  minima[2][4] = 116.3;
  minima[2][5] = 254.2;
  minima[2][18] = 145.1;
  minima[2][17] = 202.1;

  minima[3][5] = 206.5;
  minima[3][6] = 255.7;
  minima[3][18] = 198.8;

  minima[4][5] = 153.5;  /// also have centre measurement for [4, 5] - suggests ID of c. 2.7
  minima[4][6] = 241.7;
  
  minima[5][7] = 98.8;
  minima[6][8] = 95.7;
  minima[7][9] = 110.4;
  minima[8][10] = 114.6;
  minima[9][11] = 121.6;
  minima[10][12] = 121.1;
  minima[11][13] = 120.6;
  minima[12][14] = 125.0;
  minima[13][15] = 123.6;
  minima[14][16] = 128.8;
  minima[15][17] = 133.1;
  minima[15][18] = 190.7;
  minima[16][18] = 129.0;

  console.log(range);
  console.log(0, centres[0], 1, centres[1], 2, centres[2], 21, centres[2][1], 12, centres[1][2]);

  range.forEach(p => {
    range.forEach(q => {
      if (centres[p][q]) {
        if (!centres[q][p]) {
          centres[q][p] = centres[p][q];
          console.log(q, p, centres[q][p]);
        }
      }
      if (centres[p][q] !== centres[q][p])
        throw new Error(`centres[${p},${q}] != centres[${q},${p}] : centres[${p},${q}]= ${centres[p][q]};  centres[${q},${p}]= ${centres[q][p]}`);
    });
  });

  range.forEach(p => {
    range.forEach(q => {
      if (minima[p][q]) {
        if (!minima[q][p])
          minima[q][p] = minima[p][q];
      }
      if (minima[p][q] !== minima[q][p])
        throw new Error(`minima[${p},${q}] != minima[${q},${p}] : minima[${p},${q}]= ${minima[p][q]};  minima[${q},${p}]= ${minima[q][p]}`);
    });
  });
};

const generateMissingPoint = (p, q) => {
  if (centres[p][q])
    throw new Error(`We already have an accurate measurement between ${p} and ${q}. Deal with that first.`);


  console.log('centres[p]', centres[p]);
  const centresFromP = [];
  centres[p].forEach((dist, r) => {
    console.log(p, r, dist);
    if (dist)
      centresFromP.push(r);
  });
  const centresFromQ = [];
  centres[q].forEach((dist, r) => {
    if (dist)
      centresFromQ.push(r);
  });
  const minimaFromP = [];
  minima[p].forEach((dist, r) => {
    if (dist && !minimaFromP.includes(r))
      minimaFromP.push(r);
  });
  const minimaFromQ = [];
  minima[q].forEach((dist, r) => {
    if (dist && !centresFromQ.includes(r))
      minimaFromQ.push(r);
  });

  if (centresFromP.length + minimaFromP.length < 2)
    throw new Error(`From point ${p} ${centresFromP.length + minimaFromP.length}, only one or less distance found. Can't calculate accurately from one point. go subtract it yourself.`);
  if (centresFromQ.length + minimaFromQ.length < 2)
    throw new Error(`From point ${q} ${centresFromQ.length + minimaFromQ.length}, only one or less distance found. Can't calculate accurately from one point. go subtract it yourself.`);

  console.log({centresFromP, centresFromQ })

  const centresWeHave = centresFromP
    .map(r => [p, r])
    .concat(centresFromQ.map(r => [q, r]));

  const minimaWeHave = minimaFromP
    .map(r => [p, r])
    .concat(minimaFromQ.map(r => [q, r]));

  console.log({ centresWeHave, minimaWeHave });

  // can we use three centres to triangulate?
  const thirdPoints = range.filter(n => centres[n,p] && centre[n,q]);
  if (thirdPoints.length)
    throw new Error (`Not even an error - just not implemented, the easy triangulation using ${thirdPoints.join(' or ')}.`);

  const quadriPoints = [];
  const candidateCentres = centresWeHave.map(pair=> pair[1]);
  // are there only two centres to use?  Easier case, since the minima to use are determined for us.
  if (centresWeHave.length == 2) {
    // just assuming centresWeHave elements end up ordered so that centresWeHave[n,0] = p or q
    if (minima[candidateCentres[1],candidateCentres[2]])
    quadriPoints.push(candidateCentres);
    // and stop. We are done. This solution contains the maximum two centres and we have one minima
    // to join the ends of them. 
  }


  // but it's not going to be that simple in reality :( 
  const candidateMinima = minimaWeHave.map(pair=> pair[1]);
  
  candidateCentres
    .filter(ctr => candidateMinima.includes(ctr))
    .map(ctr => {    
      if (centres[p],[ctr])
        if (_) 
    /// GAhh.. tired brain.
    /// For the set of all possible paths Q R S P where either PR or PS or QR or QS is a centre (and the rest are minima, obvs)
    /// identify which is the centre measured one, call it R and identify which of P or Q it is measured from.
    /// if it is PR, we must find S s.t. RS and SQ exist
    /// if it is QR, we must fins S s.t. RS and SP exist


  })

  // And here
   


};


populate ();
console.log('/n/n/n/n');

generateMissingPoint (17,18);

