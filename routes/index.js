const express = require('express');
const router = express.Router();

const hummus = require('hummus'),
  pdfPath = './public/resume.pdf',
  pdfWriter = hummus.createWriterToModify(pdfPath, {
    modifiedFilePath: './public/resume-modified.pdf',
    log: './public/hummus-log.txt'
  }),
  pageModifier = new hummus.PDFPageModifier(pdfWriter, 0, true),
  Annotator = require('../../annotator/annotator.js'),
  annotator = new Annotator(pdfWriter, pageModifier);

/*
routes:
  /resumes/:id
  /job/:id
*/

// DEBUG: put the jobs in a database or something
const jobs = [
  {
    id: 1,
    title: 'Data Scientist',
    company: 'Test Inc'
  }
];

router.get('/jobs', (req, res, next) => {
  res.json(jobs);
});

// DEBUG: add annotation
router.post('/resume/annotations', (req, res, next) => {
  const x = req.body.x,
    y = req.body.y;
  annotator.drawRectangle(x, y, 50, 50);
  pageModifier.endContext().writePage();
  pdfWriter.end();
  res.json('./resume-modified.pdf');
});

module.exports = router;
