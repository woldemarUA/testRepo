// get donnes de la base

async function getArticle(topic = "front-end") {
  try {
    const response = await fetch("competence.json");
    const data = await response.json();
    return data[topic];
  } catch (err) {
    return null;
  }
}

// declarer une variable Générer un pdf
var pdfContent = {};

// preparer information pour le pdf

function sortPs(text) {
  // Regular expression to match text within <p> tags
  const regex = /<p>(.*?)<\/p>/g;
  // Array to store extracted text
  const extractedText = [];
  let match;
  while ((match = regex.exec(text)) !== null) {
    // Extracted text is in match[1]
    extractedText.push(match[1]);
  }

  return extractedText;
}

// render Button texte

function buttonText(topic) {
  let btnText = document.getElementById("button-text");
  btnText.innerHTML = "";
  let parText = document.createElement("p");
  let btnTemlpate =
    "Cliquez sur le bouton ci-dessous pour générer un pdf pour tous les sujets de ";
  switch (topic) {
    case "front-end":
      parText.innerHTML =
        btnTemlpate + "Competences pour developpeur front-end";
      break;
    case "back-end":
      parText.innerHTML = btnTemlpate + "Competences pour developpeur back-end";
      break;
    case "traversales":
      parText.innerHTML = btnTemlpate + "Compétences Transversales";
      break;
    case "reac":
      parText.innerHTML = btnTemlpate + "Résumé du document REAC";
      break;
    case "rev2":
      parText.innerHTML = btnTemlpate + "Résumé du document REV 2";
      break;
    default:
      console.log("Erreur");
  }
  btnText.appendChild(parText);
}

// render aside Menu
const renderSideMenu = (articles, topic = "front-end") => {
  const ids = Object.keys(articles);
  buttonText(topic);
  pdfContent = articles;
  pdfContent["topic"] = topic;
  const menu = document.getElementById("side-menu");

  menu.innerHTML = "";
  ids.forEach((id) => {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = `#${id}`;
    a.id = id;
    a.innerHTML = articles[id]["titre"];
    li.appendChild(a);
    menu.appendChild(li);
  });
};

// render Section
function renderSection(articles) {
  const artDataKey = Object.keys(articles)[0];
  const artData = articles[artDataKey];

  renderArticle(artData);
}

// render article
function renderArticle(article) {
  const articleMain = document.getElementById("article");
  articleMain.innerHTML = "";

  let titre = document.createElement("h3");
  const body = document.createElement("div");

  body.innerHTML = article["description"];
  const compNum = article["competence"];
  if (compNum) {
    const titreGrand = document.createElement("h2");
    titreGrand.textContent = `FICHE COMPÉTENCE PROFESSIONNELLE N°${compNum}`;
    articleMain.appendChild(titreGrand);
  } else {
    titre = document.createElement("h2");
  }
  const titreCont = article["titre"];
  titre.textContent = titreCont;
  articleMain.appendChild(titre);
  articleMain.appendChild(body);
}

// Ecouters

var menu = document.getElementById("menu");
var link = "front-end";

var sideMenu = document.getElementById("side-menu");
var sideLink = "";

// initialisation de la site
document.addEventListener("DOMContentLoaded", async (event) => {
  const initArticles = await getArticle();
  // window.jsPDF = window.jspdf.jsPDF;
  renderSection(initArticles);
  renderSideMenu(initArticles);
});

// menu principal
menu.addEventListener("click", async (event) => {
  if (event.target.getAttribute("href")) {
    link = event.target.getAttribute("href").substring(1);
    let articles = await getArticle(link);
    renderSection(articles);
    renderSideMenu(articles, link);
  }
});

//  menu acote
sideMenu.addEventListener("click", async (event) => {
  let articles = await getArticle(link);
  sideLink = event.target.getAttribute("href").substring(1);

  const article = await articles[sideLink];

  renderArticle(article);
});
// Generer PDF

const pdfButton = document.getElementById("genPdf");
pdfButton.addEventListener("click", async (event) => {
  generatePdf(pdfContent);
});
