document.addEventListener('DOMContentLoaded', () => {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const checkboxes = document.querySelectorAll('.filter-checkbox');
    const projects = document.querySelectorAll('article.mini-post');
    const headers = document.querySelectorAll('#main h1, #main h2:not(#filter-interface h2)');
    const noResultsMsg = document.getElementById('no-results');

    function applyFilters() {
        const activeCategoryBtn = document.querySelector('.filter-btn[data-filter-type="category"].active');
        const activeCategory = activeCategoryBtn ? activeCategoryBtn.getAttribute('data-value') : 'all';
        
        const checkedExpertise = Array.from(checkboxes)
                                      .filter(cb => cb.checked)
                                      .map(cb => cb.value.toLowerCase());

        let visibleCount = 0;

        projects.forEach(project => {
            const projectCat = (project.getAttribute('data-category') || "").toLowerCase();
            const projectTags = (project.getAttribute('data-tags') || "").toLowerCase().split(' ');

            // Check Category Match
            const matchesCategory = (activeCategory === 'all' || projectCat === activeCategory);
            
            // Check Expertise Match (OR logic: show if ANY selected tag is present, or if NO tags selected show all)
            const matchesExpertise = checkedExpertise.length === 0 || checkedExpertise.some(tag => projectTags.includes(tag));

            const isVisible = matchesCategory && matchesExpertise;
            
            project.style.display = isVisible ? 'block' : 'none';
            if (isVisible) visibleCount++;
        });

        // Update UI (No Results & Headers)
        if (noResultsMsg) noResultsMsg.style.display = (visibleCount === 0) ? 'block' : 'none';

        headers.forEach(header => {
            let hasVisibleProject = false;
            let nextEl = header.nextElementSibling;
            while (nextEl && !['H1', 'H2'].includes(nextEl.tagName)) {
                if (nextEl.classList.contains('mini-post') && nextEl.style.display !== 'none') {
                    hasVisibleProject = true;
                    break;
                }
                if (nextEl.classList.contains('mini-posts')) {
                    const anyVisible = Array.from(nextEl.querySelectorAll('article.mini-post')).some(p => p.style.display !== 'none');
                    if (anyVisible) { hasVisibleProject = true; break; }
                }
                nextEl = nextEl.nextElementSibling;
            }
            header.style.display = (activeCategory === 'all' && checkedExpertise.length === 0) || hasVisibleProject ? 'block' : 'none';
        });
    }

    filterButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const parentGroup = button.closest('.filter-group');
            parentGroup.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            applyFilters();
        });
    });

    checkboxes.forEach(cb => {
        cb.addEventListener('change', () => {
            applyFilters();
        });
    });
});

function resetFilters() {
    // 1. Reset category to "All"
    const allBtn = document.querySelector('.filter-btn[data-value="all"]');
    if (allBtn) {
        const parentGroup = allBtn.closest('.filter-group');
        parentGroup.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
        allBtn.classList.add('active');
    }
    
    // 2. Uncheck all checkboxes
    document.querySelectorAll('.filter-checkbox').forEach(cb => {
        cb.checked = false;
    });

    // 3. Trigger filtering logic
    // We can manually trigger applyFilters by clicking the allBtn
    if (allBtn) allBtn.click();
}
