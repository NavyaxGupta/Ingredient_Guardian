import React, { useState } from 'react';
import axios from 'axios';
import "./App.css";

function App() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [textResult, setTextResult] = useState("Analysis will display here.");
  const [avgResult, setAvgResult] = useState(null);
  const [analysisDone, setAnalysisDone] = useState(false); 

  const getClassFromRank = (rank) => {
    if (rank >= 0 && rank <= 1) {
      return 'rank-red';
    } else if (rank >= 2 && rank <= 3) {
      return 'rank-yellow';
    } else {
      return 'rank-green';
    }
  };

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

      setTextResult(response.data[0].result.choices[0].text);
      setAvgResult(response.data[1].rank);
      setAnalysisDone(true); // Set analysisDone to true after analysis

    } catch (error) {
      console.error('Error with server', error);
      setTextResult('Error processing the image.');
    }
  };  
 
  return (
  <div className="App" role="main">
    <h1>Ingredient Guardian</h1>
    <h2>AI-Powered Ingredient Health Scanner </h2>

    <p className="p2">
    Upload a picture of the an Ingredient Label and press Analyze to get started!
    <br />
    You must upload a picture showing only the ingredients then click "Analyze Image"
    <br />
    Ingredient Ranking will be on a scale of 0 dangerous - 5 healthy.
    </p>

    <div className="upload-wrapper" > 
      <label htmlFor="upload">Upload Image</label>
      <input type="file" id="upload"  accept='image/*' onChange={handleChangeImage} />
      <button onClick={handleUploadImage}>Analyze Image</button>
    </div>

    {selectedImage && analysisDone && (
    <div className='avg-container'>
      <p className={`avg ${getClassFromRank(avgResult)}`}>{avgResult}</p>
    </div>
    )}

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

    <p className="endMsg"> Developed by Navya Gupta, this web application uses a React-based frontend, a Flask-based Python server backend, and  OpenAI API.</p>
  </div>
  );
}

export default App;