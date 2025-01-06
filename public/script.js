// script.js

// Register the service worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then(registration => {
                console.log('Service Worker registered with scope:', registration.scope);
            })
            .catch(error => {
                console.error('Service Worker registration failed:', error);
            });
    });
}

// Function to fetch and display reports
function fetchReports() {
    fetch('/api/reports')
        .then(response => response.json())
        .then(data => {
            const reportList = document.getElementById('reportList');
            reportList.innerHTML = ''; // Clear the list before adding new items
            data.forEach(report => {
                const listItem = document.createElement('li');
                listItem.className = 'list-group-item'; // Add Bootstrap class for styling
                listItem.textContent = `Location: ${report.location}, Description: ${report.description}`;
                if (report.photo) {
                    const img = document.createElement('img');
                    img.src = `uploads/${report.photo}`; // Assuming the photo is stored in the 'uploads' directory
                    img.alt = 'Uploaded Photo';
                    img.style.width = '100px'; // Set a width for the image
                    listItem.appendChild(img);
                }
                reportList.appendChild(listItem);
            });
        })
        .catch(error => {
            console.error('Error fetching reports:', error);
        });
}

// Call fetchReports when the page loads
window.onload = fetchReports;

document.getElementById('hazardForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission

    const location = document.getElementById('location').value.trim();
    const description = document.getElementById('description').value.trim();
    const photo = document.getElementById('photo').files[0];

    // Basic validation
    if (!location || !description) {
        alert('Please fill in all fields.');
        return;
    }

    const formData = new FormData();
    formData.append('location', location);
    formData.append('description', description);
    if (photo) {
        formData.append('photo', photo);
    }

    fetch('/api/report', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (response.ok) {
            alert('Incident reported successfully!');
            fetchReports(); // Refresh the report list
            document.getElementById('hazardForm').reset(); // Reset the form
        } else {
            alert('Error reporting incident.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error reporting incident.');
    });
});