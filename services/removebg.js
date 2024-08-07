const  { RemoveBgResult, RemoveBgError, removeBackgroundFromImageFile }=  require("remove.bg")

async function removeBg(inputPath, outputFile) {
  try {
    const result = await removeBackgroundFromImageFile({
      path: inputPath,
      apiKey: process.env.REMOVE_BG_API_KEY,
      size: 'regular',
      type: 'person',
      crop: true,
      scale: '100%',
      outputFile,
    });
  
    return result;
  } catch (error) {
    throw new Error(`Error in removing background: ${error.message}`);
  }
}
module.exports = {removeBg}