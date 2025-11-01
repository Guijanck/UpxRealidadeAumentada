// services/aiService.js
export async function sendImageToAI(imageUri) {
  const formData = new FormData();
  formData.append('file', {
    uri: imageUri,
    name: 'photo.jpg',
    type: 'image/jpeg'
  });

  const response = await fetch('https://rioovieo9h.execute-api.us-east-1.amazonaws.com/v0/answers', {
    method: 'POST',
    body: formData,
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  const data = await response.json();
  return data;
}
