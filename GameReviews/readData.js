//link to download from google images
//https://drive.google.com/thumbnail?id=1IckH-B9XVVx1ZoyoNQTHMTSrgfWoHB5M&sz=w10000
function toSubGenre(name, path, tabName) {
    const url = `reviewsList.html?name=${encodeURIComponent(name)}&path=${encodeURIComponent(path)}&tab=${encodeURIComponent(tabName)}`;
    window.location.href = url;
}

function loadReviewPage() {
    const params = new URLSearchParams(location.search);
    var file = params.get('file');
    const path = `https://docs.google.com/spreadsheets/d/${file}/export?format=csv`;
    fetch(`${path}`)
        .then(res => {
            if(res.ok){
                return res.text();
            }else{
                document.getElementById('msg').textContent = "403 Forbidden";
            }
        })
        .then(csvText =>{
            const data = parseCSV(csvText);

            var title = data[1][0];
            var rating = data[1][1];
            var genre = data[1][2] + ', ' + data[1][3];
            var studio = data[1][4];
            var releaseData = data[1][5];
            var image = data[1][6];
            var summary = getTextFromColumn(9,data);
            var pros =  getTextFromColumn(7,data,true);
            var cons =  getTextFromColumn(8,data,true);
            var po = getTextFromColumn(10,data);
            
            
            var container = document.getElementById('bg-image')
            container.style.backgroundImage = container.style.backgroundImage.replaceAll('@image', image);

            container = document.getElementById('title');
            container.innerHTML = container.innerHTML.replaceAll('@title', title)

            container = document.getElementById('page-title');
            container.innerHTML = container.innerHTML.replaceAll('@title', title)

            container = document.getElementById('rating');
            container.innerHTML = container.innerHTML.replaceAll('@rating', rating)

            container = document.getElementById('genre');
            container.innerHTML = container.innerHTML.replaceAll('@genre', genre)

            container = document.getElementById('studio');
            container.innerHTML = container.innerHTML.replaceAll('@studio', studio)

            container = document.getElementById('releaseDate');
            container.innerHTML = container.innerHTML.replaceAll('@releaseDate', releaseData)

            container = document.getElementById('summary');
            container.innerHTML = container.innerHTML.replaceAll('@summary', summary)

            container = document.getElementById('pros-cons');
            container.innerHTML = container.innerHTML.replaceAll('@pros', pros)
            container.innerHTML = container.innerHTML.replaceAll('@cons', cons)

            container = document.getElementById('opinion');
            if (!po.trim()) {
                container.style.display = "none";
            } else {
                container.innerHTML = container.innerHTML.replaceAll('@po', po);
            }
            document.getElementById('loading').style.display = "none";
            document.getElementById('review').style.display = "block";
            const backLink = document.getElementById('back');
            backLink.textContent = "Back to " + data[1][3];
            backLink.href = `SubGenres/RPG/reviewsList.html?name=${encodeURIComponent(data[1][3])}&path=1vyRGZTadhaD-Zv3HwGmkpO4CIkfMm2xVgvHUJcwUZ1I&tab=${encodeURIComponent(genreShort[data[1][2]]+data[1][3])}`
        });
}




function getReviews() {
    const params = new URLSearchParams(location.search);
    
    const fileId = params.get('path');
    const sheetName = params.get('tab');
    const path = `https://docs.google.com/spreadsheets/d/${fileId}/gviz/tq?tqx=out:csv&sheet=${sheetName}`;
    var title = params.get('name');
    document.getElementById('page-heading').innerText = title;
    document.title = title;

    console.log(path)
    fetch(path)
        .then(res => {
            if(!res.ok){
                document.getElementById("loading").style.display = 'none';
                document.getElementById("no-reviews").style.display = 'block';
                return Promise.reject('File not found');
            }else {
                return res.text();
            }
            
        }).then(csvText => {
            if(csvText === "NONE"){
                return;
            }
            const lines = csvText.split('\n');

            document.getElementById("loading").style.display = 'none';
            if (lines.length <= 1) {
                document.getElementById("no-reviews").style.display = 'block';
            }else{
                document.getElementById("no-reviews").style.display = 'none';
            }

            for(let i = 1; i < lines.length; i++){
                createReviewElement(lines[i]);
            }
        });
}

function createReviewElement(line){
    const elements = line.split(",");
    let title = elements[0].slice(1, -1);
    let file = elements[1].slice(1, -1);
    let image = elements[2].slice(1, -1);
    console.log(title);

    const container = document.getElementById('titles');
    const div = document.createElement('div');
    div.className = 'title';
    div.onclick = function () {
        location.href = `../../reviewTemplate.html?file=${encodeURIComponent(file)}`;
    };
    div.style.backgroundImage = `url('${image}')`;
    div.innerHTML = `
        <div class="title-gradient">
            <h1>${title}</h1>
        </div>
        `;

    container.appendChild(div);
}


function isCellEmpty(cell) {
  return cell === null || cell === undefined || cell.toString().trim() === "";
}

function getTextFromColumn(columnNumber, data, isList = false){
    if(columnNumber < 0 || columnNumber >= data[0].length){
        return "Nothing found here.";
    }
    var result = "";
    for(var i = 1; i < data.length; i++){
        if(!isCellEmpty(data[i][columnNumber])){
            if(isList){
                result += "<li>";
                result += data[i][columnNumber];
                result += "</li>";
            }
            else{
                result += "<p>";
                result += data[i][columnNumber];
                result += "</p>";
            }
        }
    }
    return result;
}

function parseCSV(csvText) {
  const rows = [];
  let currentRow = [];
  let currentCell = '';
  let insideQuotes = false;

  for (let i = 0; i < csvText.length; i++) {
    const char = csvText[i];
    const nextChar = csvText[i + 1];

    if (insideQuotes) {
      if (char === '"' && nextChar === '"') {
        // Escaped quote, add one quote to cell
        currentCell += '"';
        i++; // skip the next quote
      } else if (char === '"') {
        // Closing quote
        insideQuotes = false;
      } else {
        currentCell += char;
      }
    } else {
      if (char === '"') {
        // Opening quote
        insideQuotes = true;
      } else if (char === ',') {
        // Cell finished
        currentRow.push(currentCell);
        currentCell = '';
      } else if (char === '\n') {
        // Row finished
        currentRow.push(currentCell);
        rows.push(currentRow);
        currentRow = [];
        currentCell = '';
      } else if (char === '\r') {
        // Ignore carriage return (\r)
        continue;
      } else {
        currentCell += char;
      }
    }
  }

  // Add the last cell/row if any
  if (currentCell !== '' || currentRow.length > 0) {
    currentRow.push(currentCell);
    rows.push(currentRow);
  }

  return rows;
}

const genreShort = {
  "Action" : "A_",
  "Action-Adventure" : "AA_",
  "Adventure" : "AD_",
  "Role-Play Game" : "RPG_",
  "Simulation" : "SIM_",
  "Strategy" : "STR_"
}