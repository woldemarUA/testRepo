// initialisation de PDF module

window.jsPDF = window.jspdf.jsPDF;
var doc = new jsPDF({
  orientation: "portrait",
  unit: "mm",
  format: "a4",
});

// fonction pour centrer le text

function centerText(text, fontSize, y) {
  const textWidth =
    (doc.getStringUnitWidth(text) * fontSize) / doc.internal.scaleFactor;
  const x = (doc.internal.pageSize.width - textWidth) / 2;
  doc.text(text, x, y);
}

// fonction pour generer PDF

function generatePdf(pdf) {
  let fileName = pdf["topic"];

  delete pdf["topic"];
  let yTextPos = 5;
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(15);
  switch (fileName) {
    case "front-end":
      centerText(
        "Competences pour developpeur front-end",
        doc.getFontSize(),
        yTextPos
      );

      break;
    case "back-end":
      centerText(
        "Competences pour developpeur back-end",
        doc.getFontSize(),
        yTextPos
      );
      break;
    case "traversales":
      centerText("Compétences Transversales", doc.getFontSize(), yTextPos);
      break;
    case "reac":
      centerText("Résumé du document REAC", doc.getFontSize(), yTextPos);
      break;
    case "rev2":
      centerText("Résumé du document REV 2", doc.getFontSize(), yTextPos);
      break;
    default:
      console.log("Erreur");
  }
  doc.setFont("Helvetica", "normal");
  yTextPos += 10;
  Object.keys(pdf).forEach((key) => {
    let competence = "";

    let titre = pdf[key]["titre"];
    let paragraphs = sortPs(pdf[key]["description"]);
    doc.setFont("Helvetica", "bold");

    if (!pdf[key].competence) {
      competence = "NO COMPETENCE";
      doc.setFontSize(14);
    } else {
      competence = `FICHE COMPÉTENCE PROFESSIONNELLE N°${pdf[key].competence}`;
      doc.setFontSize(14);
      centerText(competence, doc.getFontSize(), yTextPos);
      doc.setFontSize(12);
    }

    centerText(titre, doc.getFontSize(), yTextPos + 8);
    yTextPos += 10;
    doc.setFont("Helvetica", "normal");
    paragraphs.forEach((paragraph) => {
      doc.setFontSize(10);
      if (paragraph.includes("<ul>")) {
        paragraph = paragraph.replace(/<\/?ul>/g, "");
        paragraph = paragraph.replace(/<\li>/g, "\u002A\u2022 ");
        paragraph = paragraph.replace(/<\/li>/g, "");
        paragraph = paragraph.split("\u002A");
        paragraph.forEach((paragraph) => {
          doc.text(paragraph, 15, yTextPos + 5);
          yTextPos += 5;
        });
      } else {
        const words = paragraph.split(" ");

        let line = "";
        const maxWidth = 190;
        words.forEach((word) => {
          const currentWidth = doc.getTextWidth(line + " " + word);
          if (currentWidth <= maxWidth) {
            line += " " + word;
          } else {
            doc.text(line, 10, yTextPos + 5); //distance entre lignes
            line = word;
            yTextPos += 5; //distance entre lignes
          }
        });
        if (line.trim() !== "") {
          doc.text(line.trim(), 10, yTextPos + 5); //distance entre lignes
        }
      }

      yTextPos += 6; //distance entre paragraphs
    });
    yTextPos += 8; //distance entre competences
  });

  doc.save(`${fileName}.pdf`);
  doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });
}
