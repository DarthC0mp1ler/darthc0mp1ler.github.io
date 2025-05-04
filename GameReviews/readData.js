

function getLinks(path) {
    console.log(path)
    fetch(path)
        .then(res => res.text())
        .then(html => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const links = Array.from(doc.querySelectorAll('a'))
                .map(link => link.getAttribute('href'))
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


function loadReviewPage() {
    const params = new URLSearchParams(location.search);
    var file = params.get('file');
    file = file.replaceAll('%20',' ')
        .replaceAll('%26','&');
    console.log(file)
    fetch(`../${encodeURIComponent(file)}`)
        .then(res => res.ok ? res.text() : Promise.reject('File not found'))
        .then(xmlText => {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xmlText, "text/xml");

            var image = xmlDoc.querySelector('image')?.textContent;
            var title = xmlDoc.querySelector('title')?.textContent;
            var rating = xmlDoc.querySelector('rating')?.textContent;
            var genre = xmlDoc.querySelector('genre')?.textContent;
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

            container = document.getElementById('rating');
            container.innerHTML = container.innerHTML.replaceAll('@rating', rating)

            container = document.getElementById('genre');
            container.innerHTML = container.innerHTML.replaceAll('@genre', genre)

            container = document.getElementById('releaseDate');
            container.innerHTML = container.innerHTML.replaceAll('@releaseDate', releaseData)

            container = document.getElementById('summary');
            container.innerHTML = container.innerHTML.replaceAll('@summary', summary)

            container = document.getElementById('pros-cons');
            container.innerHTML = container.innerHTML.replaceAll('@pros', pros)
            container.innerHTML = container.innerHTML.replaceAll('@cons', cons)

            container = document.getElementById('opinion');
            container.innerHTML = container.innerHTML.replaceAll('@po', po)
        })
}

