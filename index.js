const API_ENDPOINT = "https://crudcrud.com/api/75b079cebe934715b3aa373eaf47dc98/passwords";
const passwordList = document.getElementById('password-list');
const totalPasswords = document.getElementById('total-passwords');
const searchInput = document.getElementById('search');

document.addEventListener('DOMContentLoaded', fetchPasswords);

document.getElementById('add-button').addEventListener('click', addPassword);
searchInput.addEventListener('input', filterPasswords);

function addPassword() {
    const title = document.getElementById('title').value;
    const password = document.getElementById('password').value;

    if (title && password) {
        const passwordData = { title, password };

        axios.post(API_ENDPOINT, passwordData)
            .then(response => {
                displayPassword(response.data);
                updateTotalPasswords();
                clearInputs();
            })
            .catch(error => console.error('Error adding password:', error));
    } else {
        alert('Please fill in both fields.');
    }
}

function fetchPasswords() {
    axios.get(API_ENDPOINT)
        .then(response => {
            passwordList.innerHTML = '';
            response.data.forEach(password => displayPassword(password));
            updateTotalPasswords();
        })
        .catch(error => console.error('Error fetching passwords:', error));
}

function displayPassword(passwordData) {
    const li = document.createElement('li');
    li.textContent = `${passwordData.title}: ${passwordData.password}`;
    
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.addEventListener('click', () => deletePassword(passwordData._id, li));

    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    editBtn.addEventListener('click', () => editPassword(passwordData));

    li.appendChild(deleteBtn);
    li.appendChild(editBtn);
    passwordList.appendChild(li);
}

function deletePassword(id, element) {
    axios.delete(`${API_ENDPOINT}/${id}`)
        .then(() => {
            passwordList.removeChild(element);
            updateTotalPasswords();
        })
        .catch(error => console.error('Error deleting password:', error));
}

function editPassword(passwordData) {
    document.getElementById('title').value = passwordData.title;
    document.getElementById('password').value = passwordData.password;
    deletePassword(passwordData._id, document.getElementById('title').parentElement);
}

function filterPasswords() {
    const searchTerm = searchInput.value.toLowerCase();
    const items = passwordList.getElementsByTagName('li');

    Array.from(items).forEach(item => {
        const title = item.textContent.toLowerCase();
        item.style.display = title.includes(searchTerm) ? '' : 'none';
    });
}

function updateTotalPasswords() {
    totalPasswords.textContent = `Total Passwords: ${passwordList.children.length}`;
}

function clearInputs() {
    document.getElementById('title').value = '';
    document.getElementById('password').value = '';
}
