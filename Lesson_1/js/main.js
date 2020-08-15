const products = [
    {id: 1, title: 'Notebook', price: 2000, image: ''},
    {id: 2, title: 'Keyboard', price: 200, image: ''},
    {id: 3, title: 'Mouse', price: 47, image: 'mouse.jpg'},
    {id: 4, title: 'Gamepad', price: 87, image: ''},
    {id: 5, title: 'Chair', price: 187, image: ''},
    {id: 6, title: 'Chair 2', image: ''},
    {id: 7, title: 'Chair 3', price: 187},
    {id: 8, title: 'Chair 4', price: null},
    {id: 9, title: 'Chair 5', price: null},
    {id: 10, title: 'Chair 6', price: null},
];



const renderProduct = (title, price = 'Цена не указана', image = 'default.jpg') => {
    return `<div class="product-item">
                <img src="img/${image.length ? image : 'default.jpg'}" alt="" class="product-item__img">
                <h3>${title}</h3>
                <p>${price ? price : 'Цена не указана'} ${typeof(price) == 'number' ? 'р.' : ''}</p>
                <button class="buy-btn btn">Купить</button>
            </div>`
};


const renderPage = list => {
    const productsList = list.map(el => renderProduct(el.title, el.price, el.image)); //Метод map возвращает массив
    //Метод join преобразует массив в строку. 
    //Разделитель элементов массива в строке можно указать как аргумент к методу join. 
    //В нашем случае, что бы избавиться от запятой, мы используем пустую строку как разделитель.
    document.querySelector(`.products`).innerHTML = productsList.join(''); 
};


renderPage(products);