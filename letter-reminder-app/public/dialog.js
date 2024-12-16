// dialog.js

// Function to handle form submission and show success alert
function handleFormSubmit(event) {
    event.preventDefault();  // Prevent the default form submission

    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    // Make a POST request to send the email
    fetch('http://localhost:3000/send-email', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email: email,
            message: message,
        }),
    })
    .then(response => response.json())
    .then(data => {
        // Show success alert and clear fields if email was sent successfully
        if (data.success) {
            showSuccessAlert();  // Show success alert
            clearFormFields();   // Clear form fields
        } else {
            alert('Failed to send email. Please try again.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
    });
}

// Function to show the success alert
function showSuccessAlert() {
    alert('Success! Your letter has been sent successfully.');
}

// Function to clear the form fields
function clearFormFields() {
    document.getElementById('email').value = '';   // Clear email field
    document.getElementById('message').value = ''; // Clear message field
}