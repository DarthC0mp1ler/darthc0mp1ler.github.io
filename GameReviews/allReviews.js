const tabs = [
    "A_Action",
    "A_Battle Royale",
    "A_Beat'em UP",
    "A_Fighting",
    "A_Platformer",
    "A_Shooter",
    "A_Stealth",
    "A_Survival",
    "AA_Action-Adventure",
    "AA_Hack And Slash",
    "AA_Metroidvania",
    "AA_Stealth",
    "AA_Survival",
    "AA_Survival And Horror",
    "AD_Adventure",
    "AD_Puzzle",
    "AD_Visual Novel",
    "AD_Interactive Movie",
    "RPG_Action RPG",
    "RPG_CRPG",
    "RPG_Dungeon Crawler",
    "RPG_JRPG",
    "RPG_MMORPG",
    "S_City Management",
    "S_Life Simulation",
    "S_Management Simulation",
    "ST_4X",
    "ST_Grand Strategy Wargame",
    "ST_MOBA",
    "ST_RTS"
];

const genreShort = {
    "Action": "A_",
    "Action-Adventure": "AA_",
    "Adventure": "AD_",
    "Role-Play Game": "RPG_",
    "Simulation": "SIM_",
    "Strategy": "STR_"
}

function loadReviews() {
    tabs.forEach(tab => {
        getReviews(tab);
    });
}

function getReviews(tab) {

    const fileId = '1vyRGZTadhaD-Zv3HwGmkpO4CIkfMm2xVgvHUJcwUZ1I';
    const sheetName = tab;
    const path = `https://docs.google.com/spreadsheets/d/${fileId}/gviz/tq?tqx=out:csv&sheet=${sheetName}`;

    //console.log(path)
    fetch(path)
        .then(res => {
            if (!res.ok) {
                return Promise.reject('File not found');
            } else {
                return res.text();
            }

        }).then(csvText => {
            if (csvText === "NONE") {
                return;
            }
            // const lines = csvText.split('\n');
            const lines = csvText.split('\n');

            for (let i = 1; i < lines.length; i++) {
                createReviewElement(lines[i], tab);
            }
        });
}

function createReviewElement(line, tab) {
    const elements = parseCSV(line)[0];

    let title = elements[0];
    let file = elements[1];
    let image = elements[2];
    let rating = elements[3];
    let date = elements[4];

    const container = document.getElementById('review-titles');
    const div = document.createElement('div');
    div.className = 'rls-item';
    div.dataset.rating = rating;
    div.dataset.title = title;
    div.dataset.genre = tab;
    div.dataset.date = date;
    div.onclick = function () {
        location.href = `reviewTemplate.html?file=${encodeURIComponent(file)}`;
    };
    div.style.backgroundImage = `url('${image}')`;
    div.innerHTML = `
            <h1>${title}</h1>
            <h1 style="color:goldenrod">${rating}</h1>
            `;
    if(rating.split("/")[0] === "10"){
        div.style.boxShadow = "0px 0px 30px rgba(255, 255, 255, 1)";
    }
    container.appendChild(div);
}

function onFilter() {
    const container = document.getElementById('review-titles');
    const titles = container.children;
    const value = document.getElementById('filter-text').value.trim().toLowerCase();
    const genre = document.getElementById('genre').value;
    
    Array.from(titles).forEach(block => {
        if (genre === "NONE") {
            if (value === "") {
                block.style.display = "block";
            } else {
                if (block.dataset.title.toLowerCase().includes(value)) {
                    block.style.display = "block";
                } else {
                    block.style.display = "none";
                }
            }
        } else {
            if (block.dataset.genre.startsWith(genre)) {
                if (value === "") {
                    block.style.display = "block";
                } else {
                    if (block.dataset.title.toLowerCase().includes(value)) {
                        block.style.display = "block";
                    } else {
                        block.style.display = "none";
                    }
                }
            } else {
                block.style.display = "none";
            }
        }
    });
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
