
function toSubGenre(name, path, fileurl) {
    const url = `${encodeURIComponent(fileurl)}?name=${encodeURIComponent(name)}&path=${encodeURIComponent(path)}`
    window.location.href = url;
}

function getLinks(path) {
    console.log(path)
    fetch(path)
        .then(res => res.text())
        .then(html => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const links = Array.from(doc.querySelectorAll('a'))
                .map(link => link.getAttribute('href'))
                .filter(href => !href.endsWith('index.xml'))
                .filter(href => href.endsWith('.xml'));
            console.log(links);

            var element = document.getElementById("titles");
            links.forEach(link => {
                const a = document.createElement('a');
                a.href = `../../reviewTemplate.html?file=${encodeURIComponent(link)}`;
                a.textContent = link
                    .split('review_')[1]
                    .split('.xml')[0]
                    .replaceAll('_', ' ')
                    .replaceAll('%20', ' ')
                    .replaceAll('%26', '&')
                    .replaceAll(/\s+/g, ' ');
                a.classList.add('home-link');
                element.appendChild(a);
            })


        });
}

function getReviews() {
    const params = new URLSearchParams(location.search);
    var path = params.get('path');
    var title = params.get('name');
    document.getElementById('page-heading').innerText = title;
    document.title = title;

    //let path = document.getElementById("page-data").dataset.value;
    console.log(path)
    fetch(path)
        .then(res => {
            //res.ok ? res.text() : Promise.reject('File not found')
            if(!res.ok){
                document.getElementById("no-reviews").style.display = 'block';
                return Promise.reject('File not found');
            }else {
                return res.text();
            }
            
        })
        .then(xmlText => {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xmlText, "application/xml");

            const reviewElements = xmlDoc.querySelectorAll('review');
            console.log(reviewElements.length);

            if (xmlDoc.querySelector("parsererror")) {
                console.error("Error parsing XML:", xmlDoc.querySelector("parsererror").textContent);
            }
            const folderPath = path.substring(0, path.lastIndexOf("/") + 1);
            const container = document.getElementById('titles');

            

            if (reviewElements.length === 0) {
                document.getElementById("no-reviews").style.display = 'block';
            }else{
                document.getElementById("no-reviews").style.display = 'none';
            }

            for (const review of reviewElements) {
                let file = folderPath.replaceAll('../', '') + review.querySelector('file')?.textContent.trim();
                let title = review.querySelector('title')?.textContent.trim();
                let image = review.querySelector('image')?.textContent.trim();

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
        });
}


function loadReviewPage() {
    const params = new URLSearchParams(location.search);
    var file = params.get('file');
    console.log("reading file:")
    console.log(file)
    fetch(`${file}`)
        .then(res => {
            res.ok ? res.text() : Promise.reject('File not found')
        })
        .then(xmlText => {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xmlText, "text/xml");

            var image = xmlDoc.querySelector('image')?.textContent;
            var title = xmlDoc.querySelector('title')?.textContent;
            var rating = xmlDoc.querySelector('rating')?.textContent;
            var genre = xmlDoc.querySelector('genre')?.textContent;
            var studio = xmlDoc.querySelector('studio')?.textContent;
            var releaseData = xmlDoc.querySelector('releaseDate')?.textContent;
            var summary = xmlDoc.querySelector('summary')?.innerHTML;
            var pros = xmlDoc.querySelector('pros').innerHTML;
            var cons = xmlDoc.querySelector('cons').innerHTML;
            var po = xmlDoc.querySelector('po')?.textContent.trim();
            po = po.split('\n')
                .filter(paragraph => paragraph !== '')
                .map(paragraph => '<p>' + paragraph.trim() + '</p>')
                .join("\n");

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
        })
}

