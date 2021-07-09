const headerCityButton = document.querySelector('.header__city-button');

    let hash = location.hash.substring(1)

    headerCityButton.textContent = localStorage.getItem('lomoda-location')  || 'Ваш город';
    
    headerCityButton.addEventListener('click', () => {
    const city = prompt('Укажите ваш город!')
    headerCityButton.textContent = city
    localStorage.setItem('lomoda-location',city)
})
// блокировка скролла
// // начало способом задолбал
//     const disableScroll = () => {
//         document.body.style.overflow = 'hidden';
//     };
//     const enableScroll = () => {
//         document.body.style.overflow = '';
//     } 
//     // конец способом задолбал
    // блокировка скролла
    const disableScroll = () => {
        const widthScroll = window.innerWidth - document.body.offsetWidth
        document.body.dbScrollY = window.scrollY;

        document.body.style.cssText = `
        position: fixed;
        top:${-window.scrollY}px;
        left:0;
        width: 100%;
        height: 100vh;
        overflow: hidden;
        padding-right:  ${widthScroll}px;
        `;
    };
     const enableScroll = () => {
        document.body.style.cssText = ``;
        window.scroll({
            top:document.body.dbScrollY
        })
    }     



// модальное окно

const subheader__Cart = document.querySelector('.subheader__cart')
const cartOverlay = document.querySelector('.cart-overlay')
const cart__btn_close = document.querySelector('.cart__btn-close')

const cartModalOpen = () => {
    cartOverlay.classList.add('cart-overlay-open')
    disableScroll()
};

// запрос базы данных 

const getData = async () => {
    const data = await fetch('db.json');

    if(data.ok) {
        return data.json()
    } else {
        throw new Error(`Данные небыли получены,ошибка ${data.status} ${data.statusText} `)
    }

}
const getGoods = (callback,prop,value) => {
    getData()
    .then(data => {
        if (value) {
            callback(data.filter(item => item[prop] == value))
        } else{
            callback(data)
        }
    
})
.catch(err => {
    console.error(err)
})
}


subheader__Cart.addEventListener('click', cartModalOpen)
const cartModalClose = () =>{
    cartOverlay.classList.remove('cart-overlay-open')
};
cartOverlay.addEventListener('click',event =>{
    const target =  event.target
    if ( target.matches('.cart__btn-close') || target.matches('.cart-overlay')){
        cartModalClose();
        enableScroll()
    }
})


try {
    const goodList = document.querySelector('.goods__list')
    // const titleWomen = document.querySelector('.linksss1')
    // const titleMen = document.querySelector('.linksss2')
    // const titleKids = document.querySelector('.linksss3')
    // const titleGoods = document.querySelector('.goods__title')
    // titleKids.addEventListener('click',() =>{
    //     titleGoods.textContent = 'Детям'
    // })
    // titleMen.addEventListener('click',() =>{
    //     titleGoods.textContent = 'Мужчинам'
    // })
    // titleWomen.addEventListener('click',() =>{
    //     titleGoods.textContent = 'Женщинам'
    // })

    if (!goodList) {
        throw `This is not a goods page` 
    }
        const goods__title = document.querySelector('.goods__title')

        const changeTitle = () => {
            goods__title.textContent = document.querySelector(`[href*="#${hash}"]`).textContent
        }
    const createCard = ({id, preview , cost , brand , name , sizes}) => {

        
        const li = document.createElement('li')


        li.classList.add('goods__item')
        
        li.innerHTML = `
        <article class="good">
        <a class="good__link-img" href="card-good.html#${id}">
            <img class="good__img" src="goods-image/${preview}" alt="">
        </a>
        <div class="good__description">
            <p class="good__price">${cost} &#8381;</p>
            <h3 class="good__title">${brand} <span class="good__title__grey">/ ${name}</span></h3>
            ${sizes ? 
                `<p class="good__sizes">Размеры (RUS): <span class="good__sizes-list">${sizes.join(' ')}</span></p>` :
                  ''}
            
            <a class="good__link" href="card-good.html#${id}">Подробнее</a>
        </div>
    </article>
        `;
        return li
    }
    const renderGoodsList = data => {
        goodList.textContent = '';
        
        // for (let i = 0; i < data.length; i++) {
        //    console.log('цикл for', data[i])
           
        // }
        // for (const item of data) {
        //     console.log('цикл forof',item)
        // }


        data.forEach(item => {
            const card = createCard(item);
            goodList.append(card)
        });
    }
    window.addEventListener('hashchange',() => {
        hash = location.hash.substring(1)
        // if (hash == 'men') {
        //             const title = document.querySelector('.goods__title"')
        //             title.textContent = 'Мужчинам'
        //         }else if (hash == 'kids') {
        //             title.textContent = 'Детям'
        //         } else {
        //             title.textContent = 'Женщинам'
        //         }
        changeTitle()
        getGoods(renderGoodsList,'category',hash)
       
        
    })

    changeTitle()
    getGoods(renderGoodsList,'category',hash)
} catch (err) {
    console.warn(err)
}

// страница товара 

try {
    if(!document.querySelector('.card-good')){
        throw'This is not a card-good!'
    }
    const cardGoodImage = document.querySelector('.card-good__image');   
    const cardGoodBrand = document.querySelector('.card-good__brand');
    const cardGoodTitle = document.querySelector('.card-good__title');
    const cardGoodPrice = document.querySelector('.card-good__price');
    const cardGoodColor = document.querySelector('.card-good__color');
    const cardGoodColorList = document.querySelector('.card-good__color-list');
    const cardGoodSizes = document.querySelector('.card-good__sizes');
    const cardGoodSelectWrapper = document.querySelectorAll('.card-good__select__wrapper')
    const cardGoodSizesList = document.querySelector('.card-good__sizes-list');
    const cardGoodBuy = document.querySelector('.card-good__buy');

    const genereteList = (data) => data.reduce((html,item,i) =>  html +
     `<li class="card-good__select-item" data-id="${i}">${item}</li>`,'');

    const renderCardGood = ([{brand, name , cost , color , sizes , photo}]) => {
        cardGoodImage.src = `goods-image/${photo}`;
        cardGoodImage.alt = `${brand}  ${name}`
        cardGoodBrand.textContent = brand;
        cardGoodTitle.textContent = name;
        cardGoodPrice.textContent = `${cost} ₽`;
        if (color) {
            cardGoodColor.textContent = color[0]; 
            cardGoodColor.dataset.id = 0;   
            cardGoodColorList.innerHTML = genereteList(color);
        } else{ 
            cardGoodColor.style.display = 'none';
        }
        if (sizes) {
            cardGoodSizes.textContent = sizes[0];    
            cardGoodSizes.dataset.id = 0;
            cardGoodSizesList.innerHTML = genereteList(sizes);    
        }else{
            cardGoodSizes.style.display = 'none';
        }
        
    };
     
    cardGoodSelectWrapper.forEach(item => {
        item.addEventListener('click', e => {
            const target = e.target;

            if (target.closest('.card-good__select')) {
                target.classList.toggle('card-good__select__open');
            } 
            if(target.closest('.card-good__select-item')) {
                const cardGoodSelect = item.querySelector('.card-good__select')      
                cardGoodSelect.textContent = target.textContent;
                cardGoodSelect.dataset.id = target.dataset.id;
                cardGoodSelect.classList.remove('card-good__select__open')          
            }
        });
    });
    getGoods(renderCardGood,'id',hash);
} catch (err) {
    console.warn(err);
}