
async function loadPDF(path) {
  let pdf;
  await pdfjsLib.getDocument(path).promise.then((thePDF) => {
    pdf = thePDF;
  }).catch((err) => {
    console.error('err: ', err);
  });
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
  const newPath = await $.post('/resume/annotations', {
    x: clickEvent.clientX,
    y: clickEvent.clientY
  });
  $('#loading').toggleClass('show');
  await loadPDF(newPath);
  $('#loading').toggleClass('show');
}
