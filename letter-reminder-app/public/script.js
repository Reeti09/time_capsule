// Scroll-based fade-out effect
window.addEventListener('scroll', () => {
  const titleOverlay = document.querySelector('.title-overlay');
  const scrollY = window.scrollY;
  const fadeStart = 0;
  const fadeEnd = 300;
  const opacity = Math.max(0, 1 - (scrollY - fadeStart) / (fadeEnd - fadeStart));
  titleOverlay.style.opacity = opacity;
});

// Initialize Quill editor
var quill = new Quill('#editor', {
  theme: 'snow',
  placeholder: 'Write your letter here...',
  modules: {
    toolbar: [
      [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'align': [] }],
      ['bold', 'italic', 'underline', 'strike'],
      ['link'],
      ['blockquote', 'code-block'],
      ['image']
    ]
  }
});

// Template data
const templates = {
  formal: `Dear [Recipient's Name],\n\nI hope this letter finds you well...`,
  casual: `Hey [Recipient's Name],\n\nI hope you're doing well!...`,
  'thank-you': `Dear [Recipient's Name],\n\nI just wanted to thank you...`,
  business: `Dear [Recipient's Name],\n\nI am writing on behalf of [Your Company]...`,
  graduation: `<p>Dear [Recipient],</p><p>I am pleased to inform you...`,
  jobAchievement: `<p>Dear [Recipient],</p><p>I am thrilled to share with you...`,
  missingLovedOne: `<p>Dear [Recipient],</p><p>I hope this letter finds you well...`
};

// Event listener to handle template selection
document.getElementById('templateType').addEventListener('change', function () {
  const selectedTemplate = this.value;
  const templateContent = templates[selectedTemplate] || '';
  quill.root.innerHTML = templateContent;
  document.getElementById('letter').value = templateContent;
});

// Save custom template
document.getElementById('saveCustomTemplateBtn').addEventListener('click', function () {
  const letterContent = quill.root.innerHTML;
  const templateName = prompt("Enter a name for this template:");

  if (templateName && letterContent) {
    const savedTemplates = JSON.parse(localStorage.getItem('savedTemplates')) || {};
    savedTemplates[templateName] = letterContent;
    localStorage.setItem('savedTemplates', JSON.stringify(savedTemplates));
    alert('Template saved!');
    updateSavedTemplatesDropdown();
  }
});

// Update saved templates dropdown
function updateSavedTemplatesDropdown() {
  const savedTemplates = JSON.parse(localStorage.getItem('savedTemplates')) || {};
  const dropdown = document.getElementById('savedTemplatesDropdown');
  dropdown.innerHTML = '<option value="">Select Saved Template</option>';

  for (const templateName in savedTemplates) {
    const option = document.createElement('option');
    option.value = templateName;
    option.textContent = templateName;
    dropdown.appendChild(option);
  }
}

// Load selected saved template into the editor
document.getElementById('savedTemplatesDropdown').addEventListener('change', function () {
  const selectedTemplate = this.value;
  if (selectedTemplate) {
    const savedTemplates = JSON.parse(localStorage.getItem('savedTemplates')) || {};
    quill.root.innerHTML = savedTemplates[selectedTemplate];
  }
});

// Audio recording functionality
let mediaRecorder;
let audioChunks = [];
let audioBlob;
let audioUrl;
let audioElement;

document.getElementById('startRecording').addEventListener('click', function () {
  navigator.mediaDevices.getUserMedia({ audio: true })
    .then(stream => {
      mediaRecorder = new MediaRecorder(stream);
      mediaRecorder.ondataavailable = event => {
        audioChunks.push(event.data);
      };
      mediaRecorder.onstop = () => {
        audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        audioUrl = URL.createObjectURL(audioBlob);
        audioElement = new Audio(audioUrl);
        audioElement.controls = true;
        document.getElementById('lettersList').appendChild(audioElement);
      };

      mediaRecorder.start();
      document.getElementById('startRecording').disabled = true;
      document.getElementById('stopRecording').disabled = false;
    })
    .catch(error => alert('Error accessing microphone: ' + error));
});

document.getElementById('stopRecording').addEventListener('click', function () {
  mediaRecorder.stop();
  document.getElementById('startRecording').disabled = false;
  document.getElementById('stopRecording').disabled = true;
});

// Handle video embedding
document.getElementById('embedVideo').addEventListener('click', function () {
  const videoURL = document.getElementById('videoURL').value;
  const youtubeRegex = /(?:youtube\.com.*(?:v=|\/v\/)|youtu\.be\/)([\w\-]+)/;
  const vimeoRegex = /vimeo\.com\/(\d+)/;
  let iframe = '';

  if (youtubeRegex.test(videoURL)) {
    const match = videoURL.match(youtubeRegex);
    iframe = `<iframe width="560" height="315" src="https://www.youtube.com/embed/${match[1]}" frameborder="0" allowfullscreen></iframe>`;
  } else if (vimeoRegex.test(videoURL)) {
    const match = videoURL.match(vimeoRegex);
    iframe = `<iframe src="https://player.vimeo.com/video/${match[1]}" width="640" height="360" frameborder="0" allowfullscreen></iframe>`;
  }

  if (iframe) {
    const editor = document.querySelector('.ql-editor');
    editor.innerHTML += iframe;
  } else {
    alert('Please enter a valid YouTube or Vimeo URL.');
  }
});

// Handle form submission (send to future, etc.)
document.getElementById('sendToFutureBtn').addEventListener('click', function () {
  const letterContent = quill.root.innerHTML;
  const deliveryDate = document.getElementById('deliveryDate').value;
  const attachment = document.getElementById('attachment').files[0];

  if (!letterContent || !deliveryDate) {
    alert('Please write your letter and set a delivery date!');
    return;
  }

  const letterData = {
    letterContent: letterContent,
    deliveryDate: deliveryDate,
    attachment: attachment ? attachment.name : "No attachment"
  };

  // Optionally, send this data to a server
  console.log('Letter Data:', letterData);
  alert('Your letter has been sent to the future!');
});

// Audio recording functionality (optimized version)
const recordBtn = document.getElementById('recordBtn');
const audioPlayer = document.getElementById('audioPlayer');
const deleteAudioBtn = document.getElementById('deleteAudioBtn');
const saveAudioBtn = document.getElementById('saveAudioBtn');
const audioUrlInput = document.getElementById('audioUrlInput');
const audioStatus = document.getElementById('audioStatus');

if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
  recordBtn.addEventListener('click', () => {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.stop();
      recordBtn.textContent = 'Record Audio';
      audioStatus.textContent = 'Recording stopped. You can play or save the audio now.';
    } else {
      startRecording();
      recordBtn.textContent = 'Stop Recording';
      audioStatus.textContent = 'Recording...';
    }
  });
} else {
  audioStatus.textContent = 'Audio recording is not supported in your browser.';
}

function startRecording() {
  navigator.mediaDevices.getUserMedia({ audio: true })
    .then(stream => {
      mediaRecorder = new MediaRecorder(stream);
      mediaRecorder.ondataavailable = event => {
        audioChunks.push(event.data);
      };
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        audioPlayer.src = audioUrl;
        audioPlayer.style.display = 'block';
        deleteAudioBtn.style.display = 'inline-block'; // Show Delete Button
        saveAudioBtn.style.display = 'inline-block'; // Show Save Audio Button
        audioChunks = [];
      };
      mediaRecorder.start();
    })
    .catch(err => {
      audioStatus.textContent = 'Error starting audio recording: ' + err.message;
    });
}

// Save audio to the hidden input field when the "Save Audio" button is clicked
saveAudioBtn.addEventListener('click', () => {
  const audioUrl = audioPlayer.src;
  audioUrlInput.value = audioUrl; // Store the audio URL in the hidden input
  audioStatus.textContent = 'Audio saved successfully.';
});

// Delete recorded audio
deleteAudioBtn.addEventListener('click', () => {
  audioPlayer.src = '';
  audioPlayer.style.display = 'none';
  deleteAudioBtn.style.display = 'none';
  saveAudioBtn.style.display = 'none'; // Hide Save Audio Button
  audioStatus.textContent = 'Audio has been deleted.';
});
// Audio attachment functionality
document.getElementById('attachAudioBtn').addEventListener('click', function() {
  // Trigger the hidden file input when the "Attach Audio" button is clicked
  document.getElementById('audioFileInput').click();
});

// Handle audio file selection
document.getElementById('audioFileInput').addEventListener('change', function(event) {
  const file = event.target.files[0];

  if (file && file.type.startsWith('audio')) {
    // Show the audio file name in the letter editor
    const fileName = file.name;
    alert('Audio file attached: ' + fileName);

    // You can store the audio file data if needed (e.g., for later submission)
    // For now, we are just showing a confirmation message
  } else {
    alert('Please select a valid audio file.');
  }
});
// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function () {
    // Get the iframe element by its ID
    const iframe = document.getElementById('letterIframe');
    
    // Get the section or content you want to show
    const formSection = document.querySelector('.form-section');
    
    // Initially hide the content
    formSection.style.display = 'none';

    // Add a click event listener to the iframe
    iframe.addEventListener('click', function () {
        // Change the display style to show the content when the iframe is clicked
        formSection.style.display = 'block';
    });
});
// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function () {
    // Get the iframe element by its ID
    const iframe = document.getElementById('letterIframe');
    
    // Get the section or content you want to show
    const formSection = document.getElementById('letterFormSection');
    
    // Add a click event listener to the iframe
    iframe.addEventListener('click', function () {
        // Toggle the display style of the form section when the iframe is clicked
        if (formSection.style.display === 'none') {
            formSection.style.display = 'block';
        } else {
            formSection.style.display = 'none';
        }
    });
});
