// Elements
const fieldTitle = document.querySelector('.field-title');
const fieldJobs = document.querySelector('.field-jobs');
const pageCount = document.querySelector('.page-count');
const arrows = document.querySelectorAll('.arrows');
const controlersDOM = document.querySelector('.controlers');
const hide = document.querySelector('.controlers-hide');
const finish = document.querySelector('.finish');
let results = {};
let data; 
let page = 0;
let loaded = false;
let limit;
// Listeners
arrows.forEach((arrow, i) => {
    arrow.addEventListener('click', () => changePage(i))
})
hide.addEventListener('click', toggleControlers)
finish.addEventListener('click', printResults)
fieldJobs.addEventListener('click', selectJob)

// Functions
getData();
async function getData() {
  const req = await fetch('resources/data.json');
  data = await req.json();
  populateList()
}

function populateList() {
  // Populate List
  fieldTitle.textContent = data.items[page].field;

  let html = '';
  
  data.items[page].jobs.forEach(job => {
    if (results[page] === undefined) {
      html +=  `<li class="job">${job}</li>`;
    } else if(results[page].jobs.includes(job)) {
      html +=  `<li class="job selected">${job}</li>`;
    } else {
      html +=  `<li class="job">${job}</li>`;
    }
  })
  fieldJobs.innerHTML = html 


  // Fill Page Count
  limit = data.items.length;
  pageCount.innerHTML = `Page: ${page + 1} - ${limit}`;

  loaded = true;
}

function changePage(i) {
  if(i && loaded) {
    // Right
    if(page === limit - 1) return
    // Save Selected Jobs
    saveJobs();
    page++
    loaded = false;
    populateList()

  } else if (loaded) {
    // Left
    if(page === 0) return
    // Save Selected Jobs
    saveJobs();
    page--
    loaded = false;
    populateList()
  }
}

function saveJobs() {
  const selectedField = fieldTitle.textContent;
  const selectedJobs = []; 
  document.querySelectorAll('.field-jobs .selected').forEach(job => {
    selectedJobs.push(job.textContent)
  })

  results[page] = {
    [selectedField]: selectedField,
    jobs: selectedJobs
  } 
  



  // let unique = true;
  // results.forEach(result => {
  //   if(result.field === selectedField) unique = false 
  // })

  // if(unique) {
  //   results.push({
  //     field: selectedField,
  //     jobs: selectedJobs
  //   })
  // } else {

  // }
}

function selectJob(e) {
  if(e.target.classList.contains('job')) {
    e.target.classList.toggle('selected')
  }
}

function toggleControlers() {
  controlersDOM.classList.toggle('hide')
}
function printResults() {
  // Save Selected Jobs
  saveJobs();

  const modal = document.createElement('div');
  modal.classList.add('modal');
  
  const content = document.createElement('div');
  content.classList.add('content')

  modal.appendChild(content);
  Object.keys(results).forEach(key => {
    const tempDiv = document.createElement('div')
    Object.keys(results[key]).forEach(field => {
        if(Array.isArray(results[key][field])) {
          results[key][field].forEach(job => {
            tempDiv.innerHTML += `✔ ${job}<br>`;
          })
        } else {
          tempDiv.innerHTML += `<h4>${results[key][field]}</h4>`;
        }
    })
    if(tempDiv.children.length > 1) {
      tempDiv.innerHTML += `<br>`
      content.appendChild(tempDiv)
    }
  })

  modal.addEventListener('click', (e) => {
    if(e.target.className.includes('modal')) modal.remove()
  })

  document.body.appendChild(modal)
  
}