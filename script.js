// Mobile Menu Logic (Runs after the page loads)
document.addEventListener('DOMContentLoaded', () => {

    // Initialize Lucide Icons after DOM is ready
    lucide.createIcons();

    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
            mobileMenu.classList.toggle('flex');
            const icon = mobileMenu.classList.contains('flex') ? 'x' : 'menu';
            mobileMenuBtn.innerHTML = `<i data-lucide="${icon}" class="w-8 h-8"></i>`;
            lucide.createIcons();
        });
    }
});

// Closes the menu when a nav link is clicked
function toggleMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuBtn && mobileMenu) {
        mobileMenu.classList.add('hidden');
        mobileMenu.classList.remove('flex');
        mobileMenuBtn.innerHTML = `<i data-lucide="menu" class="w-8 h-8"></i>`;
        lucide.createIcons();
    }
}
