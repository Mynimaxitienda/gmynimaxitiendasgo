import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from "@google/generative-ai";
import Base64 from 'base64-js';
import MarkdownIt from 'markdown-it';
import { maybeShowApiKeyBanner } from './gemini-api-banner';
import './style.css';

// 🔥🔥 FILL THIS OUT FIRST! 🔥🔥
// Get your Gemini API key by:
// - Selecting "Add Gemini API" in the "Project IDX" panel in the sidebar
// - Or by visiting https://g.co/ai/idxGetGeminiKey
let API_KEY = 'AIzaSyDj6-SVaawN9khs_HniU91_DtbzQTAKoVE';

let form = document.querySelector('form');
let promptInput = document.querySelector('input[name="prompt"]');
let output = document.querySelector('.output');

const fileInput = document.getElementById('fileInput');
const imagePreview = document.getElementById('imagePreview');
const rutaCompleta = document.getElementById('rutaCompleta');
const verImagenBtn = document.getElementById('verImagen');

const txtdescrip = document.getElementById("txtdescrip");
const txtespecifi = document.getElementById("txtespecifi");
const txtficha = document.getElementById("txtficha");
const txtnombre = document.getElementById("txtnombre");
const gconsulta = document.getElementById("gconsulta");

var texto = "";

let selectedImage; // Variable para almacenar la imagen seleccionada

fileInput.addEventListener('change', function () {
  const file = this.files[0];

  if (file) {
    const reader = new FileReader();

    reader.onload = function (e) {
      const imageSrc = e.target.result;
      $('#imagen').attr('src', imageSrc);
      $('input[name="chosen-image"]').val(imageSrc);
    };

    reader.readAsDataURL(file);

    // (Optional) Clear previous image preview (if any)
    imagePreview.innerHTML = '';

    // Create and display the selected image
    const img = document.createElement('img');
    img.src = URL.createObjectURL(file);
    imagePreview.appendChild(img);
  } else {
    alert('Por favor, selecciona una imagen primero.');
  }
});

verImagenBtn.addEventListener('click', () => {
  if (selectedImage) {
    // Limpiar el div antes de mostrar la nueva imagen (opcional)
    imagePreview.innerHTML = '';

    // Crear un nuevo elemento <img>
    const img = document.createElement('img');
    img.src = URL.createObjectURL(selectedImage);
    imagePreview.appendChild(img);
  } else {
    alert('Por favor, selecciona una imagen primero.');
  }
});


form.onsubmit = async (ev) => {
  ev.preventDefault();
  output.textContent = 'Generating...';

  try {
    // Load the image as a base64 string
    let imageUrl = form.elements.namedItem('chosen-image').value;
    let imageBase64 = await fetch(imageUrl)
      .then(r => r.arrayBuffer())
      .then(a => Base64.fromByteArray(new Uint8Array(a)));

    // Assemble the prompt by combining the text with the chosen image
    let contents = [
      {
        role: 'user',
        parts: [
          { inline_data: { mime_type: 'image/jpeg', data: imageBase64, } },
          { text: promptInput.value }
        ]
      }
    ];

    // Call the multimodal model, and get a stream of results
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash", // or gemini-1.5-pro
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
        },
      ],
    });

    const result = await model.generateContentStream({ contents });

    // Read from the stream and interpret the output as markdown
    let buffer = [];
    let md = new MarkdownIt();
    for await (let response of result.stream) {
      buffer.push(response.text());
      output.innerHTML = md.render(buffer.join(''));
    }
  } catch (e) {
    output.innerHTML += '<hr>' + e;
  }
};

txtdescrip.addEventListener('click', () => {
  texto = "Ver descripcion del producto. Respuesta en español.";
  gconsulta.value = "";
  gconsulta.value = texto;
});

txtespecifi.addEventListener('click', () => {
  gconsulta.value = "";
  texto = "Ver Especificaciones del producto. Respuesta en español.";
  gconsulta.value = texto;
});


txtficha.addEventListener('click', () => {
  gconsulta.value = "";
  texto = "Ver Ficha técnica del producto. Respuesta en español.";
  gconsulta.value = texto;
});

txtnombre.addEventListener('click', () => {
  gconsulta.value = "";
  texto = "Ver nombre del producto. Respuesta en español.";
  gconsulta.value = texto;
});


// You can delete this once you've filled out an API key
maybeShowApiKeyBanner(API_KEY);