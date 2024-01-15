function addUserActivityToCollection(userActivity) {
    // Retrieve existing collection from local storage or create an empty array
    let userActivityCollection = JSON.parse(localStorage.getItem('userActivityCollection')) || [];

    // Add the new user activity to the collection
    userActivityCollection.push(userActivity);

    // Save the updated collection back to local storage
    localStorage.setItem('userActivityCollection', JSON.stringify(userActivityCollection));
}

// Example usage with the provided user activity object
const userActivityObject = {
    "userActivity": {
        // ... (the provided user activity object)
    }
};

addUserActivityToCollection(userActivityObject.userActivity);
async function uploadToGoogleStorage(data, signedUrl) {
    try {
        const response = await fetch(signedUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            console.log('Upload successful');
        } else {
            console.error('Upload failed:', response.statusText);
        }
    } catch (error) {
        console.error('Error during upload:', error.message);
    }
}

// Function to request a signed URL from the application server
async function requestSignedUrl() {
    try {
        const response = await fetch('/api/getSignedUrl', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            // You might need to pass additional information like the file name or content type
            // in the request body to generate a signed URL on the server.
            body: JSON.stringify({
                fileName: 'userActivityCollection.json',
                contentType: 'application/json',
            }),
        });

        if (response.ok) {
            const signedUrl = await response.json();
            return signedUrl;
        } else {
            console.error('Failed to get signed URL:', response.statusText);
            return null;
        }
    } catch (error) {
        console.error('Error during signed URL request:', error.message);
        return null;
    }
}

// Example usage
const userActivityCollection = JSON.parse(localStorage.getItem('userActivityCollection'));

// Check if there is data to upload
if (userActivityCollection && userActivityCollection.length > 0) {
    // Request a signed URL from the server
    const signedUrl = await requestSignedUrl();

    // If a signed URL is obtained, proceed with the upload
    if (signedUrl) {
        await uploadToGoogleStorage(userActivityCollection, signedUrl);
    }
}