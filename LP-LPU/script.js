const PIPEDREAM_URL = "";

const form = document.getElementById('leadForm');
const result = document.getElementById('result');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  result.textContent = 'Submitting...';

  const data = Object.fromEntries(new FormData(form));

  if(!/^\d{10}$/.test(data.phone||"")){
    result.textContent = 'Please enter a valid 10-digit phone number.';
    return;
  }

  try {
    const res = await fetch(PIPEDREAM_URL, {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify(data)
    });

    const json = await res.json();
    if(res.ok){
      result.textContent = 'Form submitted successfully!';
      form.reset();
    } else {
      result.textContent = json.message || 'Submission failed. Try again.';
    }
  } catch(err) {
    result.textContent = 'Network error.';
  }
});

const modal = document.getElementById('modal');
const feesBtn = document.getElementById('feesBtn');
const closeModal = document.getElementById('closeModal');
const feeContent = document.getElementById('feeContent');

feesBtn.addEventListener('click', async () => {
  modal.style.display = 'flex';
  feeContent.textContent = 'Loading...';
  try {
    const res = await fetch('./api/fees.json');
    const data = await res.json();
    let html = '<ul>';
    for(const [course,info] of Object.entries(data.courses||{})){
      html += `<li><strong>${course}</strong>: ${info.range}</li>`;
    }
    html += '</ul>';
    feeContent.innerHTML = html;
  } catch(e){
    feeContent.textContent = 'Failed to load.';
  }
});

closeModal.addEventListener('click', () => modal.style.display='none');
window.addEventListener('click', e => { if(e.target===modal) modal.style.display='none'; });
