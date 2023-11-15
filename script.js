const fileStore = JSON.parse(localStorage.getItem('fileStore')) || {};
const fileContentStore = JSON.parse(localStorage.getItem('fileContentStore')) || {};
const searchInput = document.getElementById('searchInput');
        const searchButton = document.getElementById('searchButton');

        
        searchButton.addEventListener('click', function () {
            const searchTerm = searchInput.value.trim().toLowerCase();
            searchFiles(searchTerm);
        });

        function searchFiles(searchTerm) {
            const fileList = document.getElementById('fileList');
            fileList.innerHTML = '';

            let fileNumber = 1;

            for (const key in fileStore) {
                if (fileStore.hasOwnProperty(key)) {
                    const fileData = fileStore[key];

                    if (fileData.name.toLowerCase().includes(searchTerm)) {
                        const row = fileList.insertRow();
                        const fileNumberCell = row.insertCell(0);
                        const fileNameCell = row.insertCell(1);
                        const uploadedByCell = row.insertCell(2);
                        const permissionCell = row.insertCell(3);
                        const actionsCell = row.insertCell(4);

                        fileNumberCell.textContent = fileNumber;
                        fileNameCell.textContent = fileData.name;
                        uploadedByCell.textContent = fileData.uploadedBy;
                        permissionCell.textContent = fileData.permission;

                        const downloadButton = document.createElement('button');
                        downloadButton.textContent = 'Download';
                        downloadButton.classList.add('download-button');
                        downloadButton.addEventListener('click', function () {
                            downloadFile(key);
                        });
                        actionsCell.appendChild(downloadButton);

                        const deleteButton = document.createElement('button');
                        deleteButton.textContent = 'Delete';
                        deleteButton.addEventListener('click', function () {
                            deleteFile(key);
                        });
                        actionsCell.appendChild(deleteButton);

                        fileNumber++;
                    }
                }
            }
        }
        function deleteFile(key) {
        if (fileStore.hasOwnProperty(key)) {
        const confirmDelete = confirm('Are you sure you want to delete this file?');
        if (confirmDelete) {
            delete fileStore[key];
            localStorage.setItem('fileStore', JSON.stringify(fileStore));
            displayFiles();
        }
    }
}



function displayFiles() {
    const fileList = document.getElementById('fileList');
    fileList.innerHTML = '';

    let fileNumber = 1;

    for (const key in fileStore) {
        if (fileStore.hasOwnProperty(key)) {
            const fileData = fileStore[key];

            const row = fileList.insertRow();
            const fileNumberCell = row.insertCell(0);
            const fileNameCell = row.insertCell(1);
            const uploadedByCell = row.insertCell(2);
            const permissionCell = row.insertCell(3);
            const actionsCell = row.insertCell(4);
            const remainingDownloadsCell = row.insertCell(5); 

            fileNumberCell.textContent = fileNumber;
            fileNameCell.textContent = fileData.name;
            uploadedByCell.textContent = fileData.uploadedBy;
            permissionCell.textContent = fileData.permission;

            if (fileData.permission === 'download') {
                const downloadButton = document.createElement('button');
                downloadButton.textContent = 'Download';
                downloadButton.classList.add('download-button');
                downloadButton.addEventListener('click', function () {
                    downloadFile(key);
                });
                actionsCell.appendChild(downloadButton);

                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Delete';
                deleteButton.addEventListener('click', function () {
                    deleteFile(key);
                });
                actionsCell.appendChild(deleteButton);

                
                remainingDownloadsCell.textContent = `Remaining Downloads: ${fileData.remainingDownloads}`;
            }

            fileNumber++;
        }
    }
}




window.addEventListener('load', displayFiles);
function uploadFile() {
    const fileInput = document.getElementById('fileInput');
    const userEmailInput = document.getElementById('userEmail');
    const accessPermission = document.getElementById('accessPermission');
    const downloadLimitInput = document.getElementById('downloadLimit');
    const fileList = document.getElementById('fileList');

    const files = fileInput.files;
    if (files.length === 0) {
        alert('Please select a file to upload.');
        return;
    }

    const userEmail = userEmailInput.value;

    if (!userEmail) {
        alert('Please enter your email.');
        return;
    }

    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailPattern.test(userEmail)) {
        alert('Invalid email format. Please enter a valid email address.');
        return;
    }

    const selectedPermission = accessPermission.value;
    const downloadLimit = parseInt(downloadLimitInput.value);

    if (selectedPermission === 'download' && (isNaN(downloadLimit) || downloadLimit < 1)) {
        alert('Invalid download limit. Please enter a positive number.');
        return;
    }

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileName = file.name;

        const reader = new FileReader();

        reader.onload = function (event) {
            const base64String = event.target.result.split(',')[1] || event.target.result;
            const key = `file_${Date.now()}_${i}`;
            const fileData = {
                name: fileName,
                permission: selectedPermission,
                uploadedBy: userEmail,
                allowedEmail: userEmail,
                downloadable: selectedPermission === 'download',
                downloadLimit: downloadLimit,
                remainingDownloads: downloadLimit,
            };

            fileStore[key] = fileData;
            fileContentStore[key] = base64String;

            localStorage.setItem('fileContentStore', JSON.stringify(fileContentStore));
            localStorage.setItem('fileStore', JSON.stringify(fileStore));

            const fileItem = document.createElement('div');
            fileItem.classList.add('file-item');

            const fileNameElement = document.createElement('span');
            fileNameElement.textContent = fileName;
            fileItem.appendChild(fileNameElement);

            fileList.appendChild(fileItem);
            displayFiles();
        };

        reader.readAsDataURL(file);
    }

    fileInput.value = '';
    userEmailInput.value = '';
    downloadLimitInput.value = '';
}
function downloadFile(key) {
    const fileData = fileStore[key];

    if (fileData && fileData.downloadable) {
        if (fileContentStore[key]) {
            if (fileData.remainingDownloads > 0) {
                // Set the correct MIME type for PDF files
                const mimeType = fileData.name.endsWith('.pdf') ? 'application/pdf' : 'application/octet-stream';
                
                const blob = new Blob([fileContentStore[key]], { type: mimeType });
                const url = URL.createObjectURL(blob);

                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = url;
                a.download = fileData.name;
                document.body.appendChild(a);
                
                a.click();
                window.URL.revokeObjectURL(url);

                fileData.remainingDownloads--;

                fileStore[key] = fileData;
                localStorage.setItem('fileStore', JSON.stringify(fileStore));
                localStorage.setItem('fileContentStore', JSON.stringify(fileContentStore));
            } else {
                alert('Download limit for this file has been reached.');
            }
        } else {
            alert('File content not found.');
        }
    } else {
        alert('You do not have permission to download this file.');
    }
}
