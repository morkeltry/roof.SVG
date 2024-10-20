const distances = [
  78.4, 71.5, 60.2, 59.6, 156.2, 60.7, 41.5, 57.5, 57.1, 61.0, 64.4, 59.4, 65.4, 64.0, 63.9, 69.1, 69.3, 56.3
]

function calculateCircleProperties(distances) {
  const numPoints = distances.length;
  const maxError = 0.025;
  const maxAngleSum = 2 * Math.PI;
  const adjustmentFactor = 0.02; // Factor to adjust radius incrementally

  let stableError = 0;

  // Initial guess for radius
  let radius = 182;
  let newRadius = 195;

  let error = Infinity;
  let angleSum = 0;

  let i = 5000;
  
  while (i-- && stableError<10) {
    // Calculate angles using the current radius
    const angles = distances.map(d => {
        const cosValue = 1 - (d * d) / (2 * radius * radius);
        // Clamp the cosValue to the range [-1, 1]
        const clampedCosValue = Math.max(-1, Math.min(1, cosValue));
        return Math.acos(clampedCosValue);
    });

    // Calculate the sum of angles
    const angleSum = angles.reduce((sum, angle) => sum + angle, 0);

    // Calculate the error
    error = Math.abs(maxAngleSum - angleSum);

    // Adjust the radius based on angle sum
    if (angleSum < maxAngleSum) {
        // The total angle is too small, increase the radius
        newRadius *= (1 - adjustmentFactor); 
    } else {
        // The total angle is too large, decrease the radius
        newRadius *= (1 + adjustmentFactor); 
    }

    radius = (radius + newRadius) / 2;

    
    if (error > maxError)
      stableError = 0
    else
      stableError++;

    console.log ({angleSum, error, newRadius: radius});
  }

  console.log (i);

  return {
      radius: radius,
      angles: distances.map(d => {
          const cosValue = 1 - (d * d) / (2 * radius * radius);
          const clampedCosValue = Math.max(-1, Math.min(1, cosValue));
          return Math.acos(clampedCosValue);
      })
  };
}

const anglesInDegrees = angles=> angles.map(angle => (angle * (180 / Math.PI)).toFixed(1));

const circleProperties = calculateCircleProperties(distances);

console.log("Calculated Radius:", circleProperties.radius);
console.log("Calculated Angles (degrees):", anglesInDegrees(circleProperties.angles));



// Calculated Radius: 194.3 to 195.7
// Calculated Angles (degrees): 
//   '23.1', '21.1', '17.7',
//   '17.5', '47.1', '17.9',
//   '12.2', '16.9', '16.8',
//   '18.0', '19.0', '17.5',
//   '19.3', '18.8', '18.8',
//   '20.4', '20.4', '16.6'

// angleSum: 358.6 to 361.3 degrees  (6.2587 to 6.3058 radians)
// Remember again, the final distances, 56.3 was generated and is unreliable
