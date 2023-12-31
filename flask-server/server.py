from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from PIL import Image
import pytesseract
import traceback
import openai
import json

tesseract_path = r'C:\Users\Navya\AppData\Local\Programs\Tesseract-OCR\tesseract.exe'
config_path = os.path.join(os.path.dirname(__file__), 'config.json')

with open(config_path, 'r') as config_file:
    config = json.load(config_file)
    openai.api_key = config['API_KEY']


app = Flask(__name__)
CORS(app)

server_address = os.getenv('SERVER_ADDRESS', 'localhost')
server_port = os.getenv('SERVER_PORT', '5000')

@app.route('/upload', methods=['POST'])
def upload_image():
    print("Received image request.")
    if 'image' not in request.files:
        return jsonify({'error': 'No image provided'}), 400
    
    try:
        # Access the uploaded image from the request.files dictionary
        img = Image.open(request.files['image'])

        pytesseract.pytesseract.tesseract_cmd = tesseract_path
        ing_result = pytesseract.image_to_string(img)

        response = openai.Completion.create(
        engine="text-davinci-002",
        prompt=f'''For the list of ingredients:{ing_result}
                    go through each ingredient in the list seperated by a comma, rate the risk from 0(very dangerous) - 5(safe) based on how good for health it is 
                    and the Safer Choice Criteria and the FDA regulations and give a short description on why the ingredient is ranked low or high.
                    After the new line character, you must analyze the next ingredient.
                    Follow this format exactly do not add any extra spaces or punctuations.
                    Give the answer in this format as a string  --> (risk value)(space character)(Ingredient name)(space,colon,space)(Short Description)(new line character) .
                    ''',
                    max_tokens= 1024
        )
        
       
        rankings = []
        rank = 0
        lines = response.choices[0].text.strip().split("\n")
        for line in lines:
            rankings.append(int(line[0]))
        rank = round(sum(rankings) / len(rankings)) 

        return jsonify({'result': response}, {"rank": rank}), 200

    except Exception as e:
        print("Error processing image:", str(e))
        traceback.print_exc() 
        return jsonify({'error': 'Error processing the image.'}), 500


if __name__ == '__main__':
    app.run(host=server_address, port=server_port, debug=False)  # Add debug=True here
