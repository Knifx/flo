async function searchProducts() {
    const query = document.getElementById('query').value;
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = 'Идет поиск...';

    console.log(`Запрос: ${query}`);
    
    try {
        // Используем прокси-сервер для API-запроса
        const url = `https://your-render-url.onrender.com/proxy?limit=30&offset=0&shop_id=9&city_id=72&fields=id,name,name2,shops_ids,url,noted,discount_url,discount_name,date,notalladdr,image336,imagefull,brands,pricebefore,priceafter,discount_type,discount,externalurl,countPlus,countMinus,comments,desc,color,daystitle,liked,started_today,published_today&query=${encodeURIComponent(query)}`;
        console.log(`Запрос к API через прокси: ${url}`);
        const response = await axios.get(url);
        console.log('Ответ от API:', response.data);

        if (response.data.products) {
            const products = response.data.products;
            resultsDiv.innerHTML = '';
            products.forEach(product => {
                console.log(`Обработка продукта: ${product.name}`);
                const productDiv = document.createElement('div');
                productDiv.innerHTML = `
                    <h2>${product.name}</h2>
                    <p>Цена: ${product.priceafter} руб.</p>
                    <img src="${product.image336.src}" alt="${product.name}" style="max-width: 200px;">
                    <p>Акция действует с ${formatDate(product.startdate)} по ${formatDate(product.enddate)}. ${calculateDaysLeft(product.enddate)}</p>
                `;
                resultsDiv.appendChild(productDiv);
            });
        } else {
            resultsDiv.innerHTML = 'Товары не найдены.';
            console.log('Товары не найдены.');
        }
    } catch (error) {
        resultsDiv.innerHTML = 'Ошибка при поиске товаров.';
        console.error('Ошибка при запросе к API:', error);
    }
}

function calculateDaysLeft(enddateStr) {
    const enddate = new Date(enddateStr);
    const today = new Date();
    const timeDiff = enddate - today;
    const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));
    console.log(`Оставшиеся дни: ${daysLeft} (enddate: ${enddateStr}, today: ${today})`);
    if (daysLeft < 0) {
        return "Акция закончилась";
    } else if (daysLeft === 0) {
        return "Заканчивается сегодня";
    } else {
        return `Осталось ${daysLeft} дней`;
    }
}

function formatDate(dateStr) {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(2);
    return `${day}.${month}.${year}`;
}
