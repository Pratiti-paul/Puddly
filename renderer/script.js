const { ipcRenderer } = require('electron');

const img = document.getElementById('puddly');
const TARGET_HEIGHT = 380; // Single place where character size is defined

function getImageBounds(imgElement) {
  console.log(`Analyzing image: ${imgElement.src}`);
  const canvas = document.createElement('canvas');
  canvas.width = imgElement.naturalWidth;
  canvas.height = imgElement.naturalHeight;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(imgElement, 0, 0);
  
  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imgData.data;
  
  let minX = canvas.width;
  let minY = canvas.height;
  let maxX = 0;
  let maxY = 0;
  let hasContent = false;
  
  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      const alpha = data[(y * canvas.width + x) * 4 + 3];
      if (alpha > 0) {
        hasContent = true;
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  
  if (!hasContent) {
    console.log("No non-transparent pixels found in image!");
    return {
      trimLeft: 0,
      trimTop: 0,
      trimRight: 0,
      trimBottom: 0,
      width: imgElement.naturalWidth,
      height: imgElement.naturalHeight
    };
  }
  
  const result = {
    trimLeft: minX,
    trimTop: minY,
    trimRight: canvas.width - 1 - maxX,
    trimBottom: canvas.height - 1 - maxY,
    width: maxX - minX + 1,
    height: maxY - minY + 1
  };
  
  console.log("Detected bounds:", JSON.stringify(result));
  return result;
}

function updateSize() {
  console.log(`updateSize called. img.complete=${img.complete}, img.naturalWidth=${img.naturalWidth}`);
  if (!img.complete || img.naturalWidth === 0) return;
  
  try {
    const bounds = getImageBounds(img);
    const scale = TARGET_HEIGHT / bounds.height;
    const targetWidth = bounds.width * scale;
    
    console.log(`Calculated size: targetWidth=${targetWidth}, TARGET_HEIGHT=${TARGET_HEIGHT}, scale=${scale}`);
    
    // Style the image so it fits the trimmed bounds exactly
    img.style.width = `${img.naturalWidth * scale}px`;
    img.style.height = `${img.naturalHeight * scale}px`;
    img.style.left = `${-bounds.trimLeft * scale}px`;
    img.style.top = `${-bounds.trimTop * scale}px`;
    
    console.log(`Set img styles: width=${img.style.width}, height=${img.style.height}, left=${img.style.left}, top=${img.style.top}`);
    
    // Send the actual visible dimensions to the main process
    ipcRenderer.send('resize-and-reposition', {
      width: Math.round(targetWidth),
      height: Math.round(TARGET_HEIGHT)
    });
  } catch (error) {
    console.error("Error in updateSize:", error);
  }
}

img.addEventListener('load', updateSize);

// Call initially if the image is already loaded
if (img.complete) {
  updateSize();
}
