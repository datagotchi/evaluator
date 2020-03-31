// DEBUG: modifiers from drag-drop to the PDF's coordinates
const MOD_X = -200,
  MOD_Y = 380;

async function loadPDF(path) {
  const pdf = await pdfjsLib.getDocument(path).promise;
  const page = await pdf.getPage(1);
  const scale = 1.5;
  const viewport = page.getViewport({ scale: scale });

  const canvas = document.getElementById('pdf');
  const context = canvas.getContext('2d');
  canvas.height = viewport.height;
  canvas.width = viewport.width;

  const renderContext = {
    canvasContext: context,
    viewport: viewport
  };
  page.render(renderContext);
}

async function drawAnnotation(skillObject) {

  const newPath = await $.post('/resume/annotations', skillObject);
  $('#loading').toggleClass('show');
  await loadPDF(newPath);
  $('#loading').toggleClass('show');
}

async function getJob(id) {
  const job = await $.get(`/jobs/${id}`);
  job.skills.forEach((skill) => {
    const [element] = $('#skills').append(`<li draggable=\"true\">${skill}</li>`);
    element.addEventListener("dragstart", drag_start);
  });
}

function drag_start(event) {
  event.dataTransfer.setData("text/plain", event.target.innerHTML);
  event.dataTransfer.dropEffect = "copy";
}

function dragover_handler(event) {
 event.preventDefault();
 event.dataTransfer.dropEffect = "copy";
}

function drop_handler(event) {
  event.preventDefault();
  const text = event.dataTransfer.getData("text/plain");
  const skillObject = {
    text: text,
    x: event.clientX + MOD_X,
    y: event.clientY + MOD_Y
  };
  return drawAnnotation(skillObject);
}
