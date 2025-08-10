const API_BASE = "http://127.0.0.1:8000";

// Save token
function saveToken(token) {
    localStorage.setItem("accessToken", token);
}

// Get token
function getToken() {
    return localStorage.getItem("accessToken");
}

// Check login
function isLoggedIn() {
    return !!getToken();
}

// Logout
function logout() {
    localStorage.removeItem("accessToken");
    window.location.href = "{% url 'login_page' %}";
}

// Handle Login
async function loginUser(username, password) {
    try {
        const res = await fetch(`${API_BASE}/api/token/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
        });
        const data = await res.json();
        console.log("Login Response:", data);
        if (data.access) {
            saveToken(data.access);
            window.location.href = dashboardPageUrl;
        } else {
            alert("Invalid credentials");
        }
    } catch (error) {
        console.error(error);
        alert("Login failed");
    }
}

// Handle Registration
async function registerUser(username, email, password) {
    try {
        const res = await fetch("http://127.0.0.1:8000/register/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, email, password })
        });

        if (res.ok) {
            alert('Registration successful! Please log in.');
            window.location.href = loginPageUrl;
        } else {
            const data = await res.json();
            alert('Error: ' + JSON.stringify(data));
        }
    } catch (error) {
        console.error(error);
        alert('Something went wrong.');
    }
}

// Fetch Assignments
async function fetchAssignments() {
    const token = getToken();
    if (!token) {
        alert("Please login first");
        window.location.href = loginPageUrl;
        return;
    }
    try {
        const res = await fetch(`${API_BASE}/assignments/`, {
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (!res.ok) {
            throw new Error(`HTTP error! Status: ${res.status}`);
        }

        const assignments = await res.json();
        displayAssignments(assignments);
    } catch (error) {
        console.error("Error fetching assignments:", error);
    }
}


// Display assignments
function displayAssignments(assignments) {
    const container = document.getElementById("assignment-list");
    container.innerHTML = "";
    if (assignments.length === 0) {
        container.innerHTML = "<p>No assignments yet.</p>";
        return;
    }

    assignments.forEach(a => {
        const div = document.createElement("div");
        div.className = "assignment";

        div.innerHTML = `
            <h3>${a.name}</h3>
            <p>Deadline: ${a.deadline}</p>
            <p>Status: ${a.status}</p>
            <div class="actions">
                <button onclick="editAssignment(${a.id}, '${a.name}', '${a.deadline}', '${a.status}')">Edit</button>
                <button onclick="deleteAssignment(${a.id})" style="background:red;">Delete</button>
            </div>
        `;
        container.appendChild(div);
    });
}

// Add new assignment
async function addAssignment(name, deadline, status = "not complete") {
    if (!name || !deadline) {
        alert("Please fill in all fields");
        return;
    }

    const token = getToken();
    try {
        const res = await fetch(`${API_BASE}/assignments/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ name, deadline, status })
        });

        if (!res.ok) {
            const errData = await res.json();
            console.error("Error adding assignment:", errData);
            alert("Error adding assignment: " + JSON.stringify(errData));
            return;
        }

        fetchAssignments();
        document.getElementById('assignment-name').value = "";
        document.getElementById('assignment-deadline').value = "";
    } catch (error) {
        console.error(error);
    }
}
fetch('http://localhost:3000/api/assignments', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        title: 'Test Assignment',
        dueDate: '2025-08-15'
    })
})
.then(response => response.json())
.then(data => {
    console.log('Assignment added:', data);
})
.catch(error => {
    console.error('Error:', error);
});




// Delete Assignment
async function deleteAssignment(id) {
    if (!confirm("Are you sure you want to delete this assignment?")) return;

    const token = getToken();
    const res = await fetch(`${API_BASE}/assignments/${id}/`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
    });

    if (res.ok) {
        fetchAssignments();
    } else {
        alert("Failed to delete assignment");
    }
}

// Edit Assignment
function editAssignment(id, name, deadline, status) {
    const container = document.getElementById("assignment-list");
    const editDiv = document.createElement("div");
    editDiv.className = "edit-form";

    editDiv.innerHTML = `
        <h3>Edit Assignment</h3>
        <input type="text" id="edit-name" value="${name}">
        <input type="date" id="edit-deadline" value="${deadline}">
        <select id="edit-status">
            <option value="not complete" ${status === 'not complete' ? 'selected' : ''}>Not Complete</option>
            <option value="in progress" ${status === 'in progress' ? 'selected' : ''}>In Progress</option>
            <option value="completed" ${status === 'completed' ? 'selected' : ''}>Completed</option>
        </select>
        <button onclick="updateAssignment(${id})">Save</button>
        <button onclick="cancelEdit()">Cancel</button>
    `;

    container.prepend(editDiv);
}

function cancelEdit() {
    document.querySelector(".edit-form").remove();
}

async function updateAssignment(id) {
    const name = document.getElementById("edit-name").value;
    const deadline = document.getElementById("edit-deadline").value;
    const status = document.getElementById("edit-status").value;

    if (!name || !deadline) {
        alert("Please fill in all fields");
        return;
    }

    const token = getToken();
    const res = await fetch(`${API_BASE}/assignments/${id}/`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ name, deadline, status })
    });

    if (res.ok) {
        cancelEdit();
        fetchAssignments();
    } else {
        alert("Failed to update assignment");
    }
}

function logout() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    window.location.href = loginPageUrl; // Uses the injected Django URL
}

async function loadUserProfile() {
    const token = localStorage.getItem("accessToken");
    if (!token) {
        alert("User not authenticated");
        return;
    }

    try {
        const response = await fetch("http://127.0.0.1:8000/user-profile/", {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + token,
                "Content-Type": "application/json",
            }
        });

        if (!response.ok) {
            throw new Error("Failed to load profile");
        }

        const data = await response.json();
        document.getElementById("profile-box").innerHTML = `
            <p><strong>Username:</strong> ${data.username}</p>
            <p><strong>Email:</strong> ${data.email}</p>
            <p><strong>Joined:</strong> ${new Date(data.date_joined).toLocaleDateString()}</p>
        `;
    } catch (error) {
        console.error("Profile load error:", error);
        document.getElementById("profile-box").innerHTML = "Failed to load profile.";
    }
}
