const themeToggle = document.querySelector('.theme-toggle');
const menuToggle = document.querySelector('.menu-toggle');
const sidebar = document.querySelector('.sidebar');
const body = document.body;


themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    updateThemeIcon();
    saveThemePreference();
});


function updateThemeIcon() {
    const icon = themeToggle.querySelector('i');
    if (body.classList.contains('dark-mode')) {
        icon.className = 'fas fa-sun';
    } else {
        icon.className = 'fas fa-moon';
    }
}


function saveThemePreference() {
    const theme = body.classList.contains('dark-mode') ? 'dark' : 'light';
    localStorage.setItem('atlas-theme', theme);
}


function loadThemePreference() {
    const savedTheme = localStorage.getItem('atlas-theme');
    if (savedTheme === 'dark') {
        body.classList.add('dark-mode');
    }
    updateThemeIcon();
}


menuToggle.addEventListener('click', () => {
    sidebar.classList.toggle('active');
});


document.addEventListener('click', (e) => {
    if (window.innerWidth <= 992 && 
        !sidebar.contains(e.target) && 
        !menuToggle.contains(e.target) && 
        sidebar.classList.contains('active')) {
        sidebar.classList.remove('active');
    }
});


function resizeCharts() {
    if (typeof salesChart !== 'undefined' && salesChart !== null) {
        salesChart.resize();
    }
    if (typeof categoryChart !== 'undefined' && categoryChart !== null) {
        categoryChart.resize();
    }
}

function initializeCharts() {

    const salesCtx = document.getElementById('salesChart').getContext('2d');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const salesData = [20000, 25000, 30000, 40000, 50000, 65000, 80000, 90000, 85000, 145000, 240000, 250000];
    
    const isDarkMode = body.classList.contains('dark-mode');
    const gridColor = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
    const textColor = isDarkMode ? '#f0f0f0' : '#333';

    const salesChart = new Chart(salesCtx, {
        type: 'line',
        data: {
            labels: months,
            datasets: [{
                label: 'Monthly Sales',
                data: salesData,
                borderColor: '#3c44b1',
                backgroundColor: 'rgba(60, 68, 177, 0.1)',
                tension: 0.4,
                fill: true,
                pointBackgroundColor: '#fff',
                pointBorderColor: '#3c44b1',
                pointBorderWidth: 2,
                pointRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: gridColor
                    },
                    ticks: {
                        color: textColor
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: textColor,
                        maxRotation: 45,
                        minRotation: 0
                    }
                }
            }
        }
    });
    

    const categoryCtx = document.getElementById('categoryChart').getContext('2d');
    
    const categoryChart = new Chart(categoryCtx, {
        type: 'doughnut',
        data: {
            labels: ['Fun', 'Clothes', 'Night out', 'Take out'],
            datasets: [{
                data: [16288, 22063, 16545, 8515],
                backgroundColor: ['#003b73', '#0074b7', '#60a3d9', '#bfd7ed'],
                borderWidth: 0,
                borderRadius: 5
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '70%',
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const value = context.raw;
                            const total = context.dataset.data.reduce((sum, val) => sum + val, 0);
                            const percentage = ((value / total) * 100).toFixed(1);
                            return `${context.label}: ${value} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
    

    Chart.register({
        id: 'doughnutCenterText',
        beforeDraw: function(chart) {
            if (chart.config.type === 'doughnut') {

                const ctx = chart.ctx;
                
             
                const width = chart.width;
                const height = chart.height;

                ctx.restore();
                

                const text = '$ 65,152';
                const fontSize = Math.min(width, height) * 0.15;
                ctx.font = `bold ${fontSize}px Arial`;
                ctx.textBaseline = 'middle';
                ctx.textAlign = 'center';
                

                const textColor = isDarkMode ? '#fff' : '#333';
                ctx.fillStyle = textColor;
                

                ctx.fillText(text, width / 2, height / 2);
                ctx.save();
            }
        }
    });
    
    return { salesChart, categoryChart };
}

window.addEventListener('resize', () => {
    if (window.innerWidth > 992 && sidebar.classList.contains('active')) {
        sidebar.classList.remove('active');
    }

    setTimeout(resizeCharts, 100);
});


themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    updateThemeIcon();
    saveThemePreference();

    setTimeout(() => {
        initializeCharts();
    }, 100);
});


document.addEventListener('DOMContentLoaded', () => {
    loadThemePreference();
    const charts = initializeCharts();
  
    window.salesChart = charts.salesChart;
    window.categoryChart = charts.categoryChart;
    setupTablePagination();
    

    window.addEventListener('resize', () => {
        if (window.innerWidth > 992 && sidebar.classList.contains('active')) {
            sidebar.classList.remove('active');
        }
    });
    

    const loadingDemo = () => {
        const tableRows = document.querySelectorAll('.data-table tbody tr');
        tableRows.forEach((row, index) => {
            setTimeout(() => {
                row.style.opacity = '1';
            }, 100 * index);
        });
    };
    
    loadingDemo();
});

const searchInput = document.querySelector('.search-box input');
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();

        console.log(`Searching for: ${searchTerm}`);
    });
}