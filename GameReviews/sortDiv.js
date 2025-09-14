function sortDivChildren( sortBy, ascending = true) {
    const container = document.getElementById('review-titles');
    if (!container) return;

    // Convert HTMLCollection to array
    const childrenArray = Array.from(container.children);

    childrenArray.sort((a, b) => {
        let valA, valB;

        switch (sortBy) {
            case 'rating':
                // extract number from "5.5/10"
                valA = parseFloat(a.dataset.rating) || 0;
                valB = parseFloat(b.dataset.rating) || 0;
                break;
            case 'title':
                valA = (a.dataset.title || "").toLowerCase();
                valB = (b.dataset.title || "").toLowerCase();
                break;
            case 'date':
                valA = new Date(a.dataset.date);
                valB = new Date(b.dataset.date);
                break;
            default:
                valA = 0;
                valB = 0;
        }

        if (valA < valB) return ascending ? -1 : 1;
        if (valA > valB) return ascending ? 1 : -1;
        return 0;
    });

    // Append in sorted order (this moves the elements in the DOM)
    childrenArray.forEach(child => container.appendChild(child));
}
