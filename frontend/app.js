// Railway URL
const API_URL = "https://petcare-production-39a3.up.railway.app";

let selectedPetId = null;
let selectedBreed  = "Labrador Retriever";
let selectedBreedImg = "imgs/labrador.png";

document.addEventListener('DOMContentLoaded', () => {
  loadPets();

  document.querySelectorAll('.breed-opt').forEach(el => {
    el.addEventListener('click', () => {
      document.querySelectorAll('.breed-opt').forEach(e => e.classList.remove('selected'));
      el.classList.add('selected');
      selectedBreed    = el.dataset.breed;
      selectedBreedImg = el.dataset.img;
      document.getElementById('selectedBreedLabel').textContent = selectedBreed;
    });
  });
});

// pets
async function loadPets() {
  try {
    const res  = await fetch(`${API_URL}/api/pets`);
    const pets = await res.json();
    const tbody = document.getElementById('petTableBody');
    if (pets.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5" class="text-center text-muted">No pets yet!</td></tr>';
      return;
    }
    tbody.innerHTML = pets.map(pet => `
      <tr class="pet-row ${pet.id === selectedPetId ? 'table-primary' : ''}"
          onclick="selectPet(${pet.id}, '${escAttr(pet.name)}', '${escAttr(pet.breed)}', ${pet.age}, '${escAttr(pet.img)}')">
        <td class="text-center">
          <img src="${escAttr(pet.img)}" alt="breed" width="36" style="object-fit:contain">
        </td>
        <td>${pet.name}</td>
        <td>${pet.breed}</td>
        <td>${pet.age} yr${pet.age !== 1 ? 's' : ''}</td>
        <td class="text-center">
          <button class="btn btn-outline-warning btn-sm" onclick="startEdit(event, ${pet.id}, '${escAttr(pet.name)}', '${escAttr(pet.breed)}', ${pet.age}, '${escAttr(pet.img)}')">✏️</button>
        </td>
        <td class="text-center">
          <button class="btn btn-outline-danger btn-sm" onclick="deletePet(event, ${pet.id})">🗑</button>
        </td>
      </tr>
    `).join('');
  } catch {
    document.getElementById('petTableBody').innerHTML =
      '<tr><td colspan="5" class="text-center text-danger">Could not connect to server</td></tr>';
  }
}

let editingPetId = null;

async function addPet() {
  const name = document.getElementById('petName').value.trim();
  const age  = parseInt(document.getElementById('petAge').value) || 0;
  if (!name) return showToast('Please enter a name!');

  if (editingPetId) {
    // UPDATE existing pet
    await fetch(`${API_URL}/api/pets/${editingPetId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, breed: selectedBreed, age, img: selectedBreedImg })
    });
    showToast(`${name} updated!`);
    cancelEdit();
  } else {
    // CREATE new pet
    await fetch(`${API_URL}/api/pets`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, breed: selectedBreed, age, img: selectedBreedImg })
    });
    showToast(`${name} added!`);
    document.getElementById('petName').value = '';
    document.getElementById('petAge').value  = '';
  }
  loadPets();
}

function startEdit(event, id, name, breed, age, img) {
  event.stopPropagation();
  editingPetId = id;

  // Fill the form with current pet data
  document.getElementById('petName').value = name;
  document.getElementById('petAge').value  = age;

  // Update breed picker selection
  selectedBreed    = breed;
  selectedBreedImg = img;
  document.getElementById('selectedBreedLabel').textContent = breed;
  document.querySelectorAll('.breed-opt').forEach(el => {
    el.classList.toggle('selected', el.dataset.breed === breed);
  });

  // Change button text and show cancel
  document.getElementById('addPetBtn').textContent = 'Save Changes';
  document.getElementById('addPetBtn').classList.replace('btn-primary', 'btn-warning');
  document.getElementById('cancelEditBtn').style.display = 'block';

  // Scroll to form
  document.querySelector('.card.mb-4').scrollIntoView({ behavior: 'smooth' });
}

function cancelEdit() {
  editingPetId = null;
  document.getElementById('petName').value = '';
  document.getElementById('petAge').value  = '';
  document.getElementById('addPetBtn').textContent = 'Add Pet';
  document.getElementById('addPetBtn').classList.replace('btn-warning', 'btn-primary');
  document.getElementById('cancelEditBtn').style.display = 'none';
}

async function deletePet(event, id) {
  event.stopPropagation();
  if (!confirm('Delete this pet and all their logs?')) return;
  await fetch(`${API_URL}/api/pets/${id}`, { method: 'DELETE' });
  if (selectedPetId === id) {
    selectedPetId = null;
    document.getElementById('logPlaceholder').style.display = 'block';
    document.getElementById('logContent').style.display     = 'none';
  }
  showToast('Pet removed');
  loadPets();
}

// pet selection
function selectPet(id, name, breed, age, imgSrc) {
  selectedPetId = id;
  document.getElementById('logPlaceholder').style.display = 'none';
  document.getElementById('logContent').style.display     = 'block';
  document.getElementById('selectedPetName').textContent  = name;
  document.getElementById('selectedPetInfo').textContent  = `${breed} · ${age} year${age !== 1 ? 's' : ''} old`;
  document.getElementById('selectedPetImg').src           = imgSrc;
  document.getElementById('selectedPetImg').alt           = breed;
  loadPets();
  loadLogs();
}

// logs
async function loadLogs() {
  if (!selectedPetId) return;
  const res  = await fetch(`${API_URL}/api/logs/${selectedPetId}`);
  const logs = await res.json();
  const tbody = document.getElementById('logTableBody');
  if (logs.length === 0) {
    tbody.innerHTML = '<tr><td colspan="4" class="text-center text-muted">No entries yet</td></tr>';
    return;
  }
  const icons = { feeding: 'f', walk: 'w', vet: 'v', bath: 'b', note: 'n' };
  tbody.innerHTML = logs.map(log => `
    <tr>
      <td><span class="badge bg-secondary">${icons[log.type] || ''} ${log.type}</span></td>
      <td>${log.note || '—'}</td>
      <td class="text-muted small">${new Date(log.created_at).toLocaleString()}</td>
      <td class="text-center">
        <button class="btn btn-outline-danger btn-sm" onclick="deleteLog(${log.id})">🗑</button>
      </td>
    </tr>
  `).join('');
}

async function addLog() {
  if (!selectedPetId) return showToast('Select a pet first!');
  const type = document.getElementById('logType').value;
  const note = document.getElementById('logNote').value.trim();
  await fetch(`${API_URL}/api/logs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pet_id: selectedPetId, type, note })
  });
  document.getElementById('logNote').value = '';
  showToast('Entry saved!');
  loadLogs();
}

async function deleteLog(id) {
  await fetch(`${API_URL}/api/logs/${id}`, { method: 'DELETE' });
  showToast('Entry deleted');
  loadLogs();
}

// msg
function showToast(msg) {
  document.getElementById('toastMsg').textContent = msg;
  bootstrap.Toast.getOrCreateInstance(document.getElementById('toast')).show();
}
function escAttr(str) {
  return String(str).replace(/'/g, "\\'");
}