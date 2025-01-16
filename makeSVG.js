const fs = require('fs');

const decimalPlaces = 1;
const dpMultiple =  10 ** decimalPlaces;

const generateSVG = (angles, radius, fileName = 'roooof.svg', circleParams) => {

  const hookDefaults = {
    intDiam: 2.7,     // Default internal diameter
    stroke: 1.3,    // Default stroke width
    colour: "#600", // Default fill and stroke color
    arm: 5         // Default arm length
  };
  const { intDiam, stroke, colour, arm } = { ...hookDefaults, ...circleParams };
  const decimalPlaces = 2;
  const showOuterLengths = true;

  let total = 0;
  const cumulativeAngles = angles.map(segmentAngle => {
    total += segmentAngle;
      return total;
  });

  // Convert angles to radians
  const cumulativeAnglesInRadians = cumulativeAngles.map(angle => angle * (Math.PI / 180));

  // Calculate points based on the angles and radius
  const points = cumulativeAnglesInRadians.map(theta => {
      const x = 300 + radius * Math.sin(theta);
      const y = 300 + radius * Math.cos(theta);
      if (decimalPlaces===undefined)
        return { x, y }
      else
        return { 
          x : Math.round(x*dpMultiple)/dpMultiple,
          y : Math.round(y*dpMultiple)/dpMultiple
        };
  });

  console.log({points});
  

  // Create the SVG content
  let svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600">\n`;

  // Draw lines between consecutive points
  points.forEach ((p, idx)=> {
      const nextP = points[(idx + 1) % points.length]; // Wrap around to first point
      svgContent += `<line x1="${p.x}" y1="${p.y}" x2="${nextP.x}" y2="${nextP.y}" stroke="black" />\n`;

    const radiusWithStroke = intDiam / 2 + stroke / 2;
      svgContent += `<circle cx="${p.x}" cy="${p.y}" r="${radiusWithStroke}" fill="none" stroke="${colour}" stroke-width="${stroke}" />\n`;
      // svgContent += `<circle cx="${point.x}" cy="${point.y}" r="1.3" stroke="#600" />\n`;

    if (arm) {
      const armEndX = p.x + (p.x - 300) / radius * arm;
      const armEndY = p.y + (p.y - 300) / radius * arm;
      svgContent += `<line x1="${p.x}" y1="${p.y}" x2="${Math.round(armEndX)}" y2="${Math.round(armEndY)}" stroke="${colour}" stroke-width="${stroke}" />\n`;
    }
    if (true) {
      const textOffset = 10;
      const textX = p.x + (p.x - 300) / radius * (textOffset + (arm | 0));
      const textY = p.y + (p.y - 300) / radius * (textOffset + (arm | 0));
      svgContent += `<text x="${Math.round(textX)}" y="${Math.round(textY)}" font-size="9" fill="${colour}" text-anchor="middle" alignment-baseline="middle">${1+(idx+1)%angles.length}</text>\n`;
    }
    if (showOuterLengths) {
      const midPoint = 
        decimalPlaces===undefined
          ? {
            x : (nextP.x+p.x)/2,
            y : (nextP.y+p.y)/2
          }
          : {
            x : Math.round( (nextP.x+p.x)*dpMultiple/2 )/dpMultiple,
            y : Math.round( (nextP.y+p.y)*dpMultiple/2 )/dpMultiple
          };
      const outerEdgeLength = Math.round( Math.sqrt((nextP.x- p.x)**2 + (nextP.y- p.y)**2) *dpMultiple)/dpMultiple;
      const textOffset = 10;
      const textX = midPoint.x + (midPoint.x - 300) / radius * (textOffset + (arm*2 | 0));
      const textY = midPoint.y + (midPoint.y - 300) / radius * (textOffset + (arm*2 | 0));
      svgContent += `<text x="${Math.round(textX)}" y="${Math.round(textY)}" font-size="7" fill="${ '#0' }" text-anchor="middle" alignment-baseline="middle">${outerEdgeLength}${true ? 'cm' : ''}</text>\n`;
    }

    svgContent += '\n'
  })

  // Close the SVG tag
  svgContent += `</svg>`;

  // Write the SVG content to a file
  fs.writeFileSync(fileName, svgContent, 'utf8');
}

const angles = [ 21.1, 17.7, 17.6, 47.2, 17.9, 12.2, 16.9, 16.8, 18, 19, 17.5, 19.3, 18.9, 18.8, 20.4, 20.4, 16.6, 23.2 ]
const radius = 195;

generateSVG(angles, radius, 'circle_visualization.svg');