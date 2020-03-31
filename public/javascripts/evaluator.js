
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

async function drawAnnotation(clickEvent) {
  const MOD_X = -100,
    MOD_Y = 380;
  const newPath = await $.post('/resume/annotations', {
    x: clickEvent.clientX + MOD_X,
    y: clickEvent.clientY + MOD_Y
  });
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
 event.dataTransfer.dropEffect = "move";
}

function drop_handler(event) {
  event.preventDefault();
  const skill = event.dataTransfer.getData("text/plain");
  console.log("got skill: ", skill);
}
