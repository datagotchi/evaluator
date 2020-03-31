
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
