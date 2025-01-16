const segmentAngles = [21.1, 17.7, 17.6, 47.2, 17.9, 12.2, 16.9, 16.8, 18, 19, 17.5, 19.3, 18.9, 18.8, 20.4, 20.4, 16.6, 23.2];
const radius = 1; // Assume unit circle

let cumulativeSum = 0;
const angles = segmentAngles.map((angle) => cumulativeSum += angle);
// TODO: deal with this later, we are assuming anges ordered from 0 and this may have rounding error and be 359.x
// angles.unshift(angles.pop());


const angleBetweenPoints = (idx1, idx2)=> {
  // Convert angles to radians
  const angle1 = angles[idx1] * Math.PI / 180;
  const angle2 = angles[idx2] * Math.PI / 180;
  
  // Convert angles to Cartesian coordinates
  const x1 = Math.cos(angle1);
  const y1 = Math.sin(angle1);
  const x2 = Math.cos(angle2);
  const y2 = Math.sin(angle2);
  

  const dx = x2 - x1;
  const dy = y2 - y1;

  // Calculate the angle of the vector relative to the positive x-axis
  const angleFromHoriz = Math.atan2(dy, dx); // Returns the angle in radians
  
  // Convert the angle to degrees
  return (360+(angleFromHoriz * 180 / Math.PI))%360;
}

const xAxisIntersection = (idx1, idx2)=> {
  return xIntercept;
}

closestTo = {};

sextant = 60;

console.log({angles, closestTo});

angles.forEach((angle, idx)=> {
  if (closestTo[sextant]===undefined) 
    closestTo[sextant] = [idx]
  else
    if (angle<= sextant)
      closestTo[sextant][0] = idx
    else {
      if (angle<= sextant+30) {
        closestTo[sextant][1] = idx;
        /// HERE
      }
      else
        closestTo[sextant+60] = [idx];
      sextant += 60;
    }  
})

// only need one value for closestTo[180]
const OP = [angles[closestTo[180][0]] - 180 < Math.abs(angles[closestTo[180][1]] - 180) ? closestTo[180][1] : closestTo[180][0]];
closestTo[180] = OP;
if (closestTo[360])
  delete closestTo[360];

angles.forEach((angle, idx)=> {
  console.log(idx, angle.toFixed(1),'; angle:',  angleBetweenPoints(0,idx));
  console.log(idx, angle.toFixed(1),'; intersects X at:', xAxisIntersection(0,idx));
  console.log('');
  
  
})

console.log({angles, closestTo});



