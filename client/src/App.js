import React, { useState } from 'react';
import axios from 'axios';
import "./App.css";

function App() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [textResult, setTextResult] = useState("Analysis will display here.");
  const [analysisDone, setAnalysisDone] = useState(false); // New state variable


  const handleChangeImage = e => {
    if(e.target.files[0]){
      setSelectedImage(e.target.files[0]);
      setAnalysisDone(false); // Reset analysisDone when image changes
    }
    else{
      setSelectedImage(null);
      setTextResult("")
      setAnalysisDone(false);

    }
  }

  const handleUploadImage = async () => {
    const formData = new FormData();
    formData.append('image', selectedImage);

    try {
      const response = await axios.post('http://localhost:5000/upload', formData);
      console.log("Response Data:", response.data);
      console.log("array Data:", response.data.result.choices[0].text);

      setTextResult(response.data.result.choices[0].text);
      setAnalysisDone(true); // Set analysisDone to true after analysis

    } catch (error) {
      console.error('Error uploading image:', error);
      setTextResult('Error processing the image.');
    }
  };  
 
  return (
  <div className="App" role="main">
    <h1>Ingredient Guardian</h1>
    <h2>AI-Powered Ingredient Health Scanner </h2>
    <p className="p2">Upload a picture of the an Ingredient Label and press Analyze to get started!</p>
    <p className="p3">You must upload a picture showing only the ingredients then click "Analyze Image"</p>
    <div className="upload-wrapper" > 
      <label tabindex="0" htmlFor="upload">Upload Image</label>
      <input type="file" id="upload"  accept='image/*' onChange={handleChangeImage} />
      <button onClick={handleUploadImage}>Analyze Image</button>
    </div>
   
    <div className="result">
  {selectedImage && !analysisDone && (
    <div className="box-image">
      <img src={URL.createObjectURL(selectedImage)} alt="thumb" />
    </div>
  )}
  {analysisDone && (
    textResult.trim().split('\n').map((line, index) => (
      <div key={index} className="box-p">
        <p>{line}</p>
      </div>
    ))
  )}
</div>

    <p className="p4"> Developed by Navya Gupta, this web application uses a React-based frontend, a Flask-based Python server backend, and  OpenAI API.</p>
  </div>
  );
}

export default App;