
import { createI18n } from 'vue-i18n';

const messages = {
  en: {
    Additional_information:"Additional information",
    makeOrderNameForm:"Placing an order",
    brand:"Brand",
    paymentWay:"Payment",
    personal_info:"Your contacts",
    shippingWay: "Shipping",
    productDescription:"description",
    price:"Price",
    search:"search",
    cart:"cart",
    home:'home',
    login:"login",
    reg:"registration",
    media:"media",
    about:"about",
    serchingProductsError:"No such products with this name, try to find something similar",
    aboutUsText : {
      headline: "About Us",
      intro: "Welcome to the world of Variety — your reliable guide to the wonderful realm of diversity and quality! We are an online store where each product has its unique story, and every purchase becomes a part of your own story. Our team aims to offer you the best products from various walks of life — from fashion and beauty to household goods and accessories, to make your life brighter, more convenient, and memorable.",
      shopPolicy: {
        statement1: "Quality is a Priority: We work only with reliable suppliers and brands, ensuring high quality of every product presented in our store.",
        statement2: "Excellent Service: Our customer support team is always ready to assist you with any questions regarding products, orders, or delivery. We value each customer and strive to make your shopping experience as comfortable and enjoyable as possible.",
        statement3: "Secure Purchase: We place great importance on the security of your personal information and financial data. Our encryption systems ensure the protection of your data throughout the entire purchasing process.",
      },
      returnMoneyPolicyName: "Return Policy",
      returnMoneyPolicy: {
        statement1: "Satisfaction Guarantee: If you are not completely satisfied with your purchase, you can return the item within 14 days of receiving the order and receive a full refund or exchange for another item.",
        statement2: "Condition of the Item: For the item to be eligible for return, it must maintain its original condition and packaging. We reserve the right to refuse returns if the item has been used or damaged.",
        statement3: "Simple Process: To initiate the return process, contact our customer support, and we will guide you through all the necessary steps.",
      },
      conclusion: "We strive to be your reliable partner in finding the best products and meeting your needs. We hope that your shopping experience at Variety will be enjoyable and satisfying, and we are always ready to help you make your choice wise and thoughtful. Thank you for choosing us!",
    },
    contactUs:"Welcome to the contact section of our online store. We value your time and strive to provide the highest level of service to all of our clients. If you have any questions, suggestions or comments, please contact us!",
    
  },
  uk: {
    Additional_information:"Додаткова інформація",
    brand:"Бренд",
    makeOrderNameForm:"Оформлення замовлення",
    productDescription:"Опис",
    personal_info:"Ваші контактні дані",
    shippingWay: "Доставка",
    price:"Ціна",
    search:"пошук",
    cart:"кошик",
    paymentWay:"Оплата",
    home:'головна',
    login:'вхід',
    reg:"регістрація",
    media:"медія",
    about:"про нас",
    serchingProductsError:"Такого товару не має в наявності, спробуйте знайти щось схоже",
    aboutUsText : {
      headline: "Про нас",
      intro: "Ласкаво просимо в світ Variety — вашого надійного провідника в дивовижний світ різноманітності та якості! Ми є інтернет-магазином, де кожен продукт має свою унікальну історію, а кожна покупка стає частиною вашої власної історії. Наша команда прагне запропонувати вам найкращі товари з різних сфер життя — від моди та краси до побутових товарів та аксесуарів, щоб зробити ваше життя яскравішим, зручнішим та запам'ятовуючимся.",
      shopPolicy: {
        statement1: "Якість у пріоритеті: Ми працюємо лише з надійними постачальниками та брендами, гарантуючи високу якість кожного товару, представленого в нашому магазині.",
        statement2: "Переважне обслуговування: Наша команда служби підтримки завжди готова допомогти вам у будь-яких питаннях щодо товарів, замовлень або доставки. Ми цінуємо кожного клієнта та прагнемо зробити ваше покупкове досвід максимально комфортним та приємним.",
        statement3: "Безпечна покупка: Ми приділяємо велике значення безпеці вашої особистої інформації та фінансових даних. Наші системи шифрування забезпечують захист ваших даних на протязі всього процесу покупки.",
      },
      returnMoneyPolicyName: "Політика повернення",
      returnMoneyPolicy: {
        statement1: "Гарантія задоволеності: Якщо ви не повністю задоволені своєю покупкою, ви можете повернути товар протягом 14 днів з моменту отримання замовлення і отримати повний повернення коштів або обмін на інший товар.",
        statement2: "Стан товару: Для повернення товару він повинен зберігати свій початковий стан та упаковку. Ми залишаємо за собою право відмовити у поверненні, якщо товар був використаний або пошкоджений.",
        statement3: "Простий процес: Щоб почати процес повернення, зверніться до нашої служби підтримки, і ми проведемо вас через всі необхідні кроки.",
      },
      conclusion: "Ми прагнемо стати вашим надійним партнером у пошуку найкращих товарів та задоволення ваших потреб. Сподіваємося, що ваш досвід покупок в Variety буде приємним та задоволюючим, і ми завжди готові допомогти вам зробити ваш вибір розумним та осмисленим. Дякуємо, що обрали нас!",
    },
    contactUs:"Ласкаво просимо до контактів нашого інтернет-магазину. Ми цінуємо ваш час та прагнемо забезпечити високий рівень обслуговування для всіх наших клієнтів. Якщо у вас виникли запитання, пропозиції чи зауваження, будь ласка, зв'яжіться з нами!",

  },
  ru:{
    Additional_information:"Дополнительная информация",
    brand:"Бренд",
    paymentWay:"Оплата",
    makeOrderNameForm:"Оформление заказа",
    personal_info:"Ваши контактные данные",
    shippingWay: "Доставка",
    productDescription:"Описание",
    price:"Цена",
    search:"поиск",
    cart:"корзина",
    home:'главная',
    login:'вход',
    reg:'регистрация',
    media:"медиа",
    about:"про нас",
    serchingProductsError:"Товара нет в наличии, попробуйте найти что-то похожее",
    aboutUsText : {
      headline:"О нас",
      intro:"Добро пожаловать в мир Variety — вашего надежного проводника в удивительный мир разнообразия и качества! Мы являемся интернет-магазином, где каждый продукт имеет свою уникальную историю, а каждая покупка становится частью вашей собственной истории. Наша команда стремится предложить вам лучшие товары из различных областей жизни — от моды и красоты до бытовых товаров и аксессуаров, чтобы сделать вашу жизнь более яркой, удобной и запоминающейся.",
      shopPolicy:{
        statement1:"Качество в приоритете: Мы работаем только с надежными поставщиками и брендами, гарантируя высокое качество каждого товара, представленного в нашем магазине.",
        statement2:"Превосходное обслуживание: Наша команда службы поддержки всегда готова помочь вам в любых вопросах относительно товаров, заказов или доставки. Мы ценим каждого клиента и стремимся сделать ваше покупательное опыт максимально комфортным и приятным.",
        statement3:"Безопасная покупка: Мы придаем большое значение безопасности вашей личной информации и финансовых данных. Наши системы шифрования обеспечивают защиту ваших данных на протяжении всего процесса покупки.",
      },
      returnMoneyPolicyName:"Политика возврата",
      returnMoneyPolicy:{
        statement1:'Гарантия удовлетворенности: Если вы не полностью удовлетворены своей покупкой, вы можете вернуть товар в течение 14s дней с момента получения заказа и получить полный возврат средств или обмен на другой товар',
        statement2:'Состояние товара: Для возврата товара он должен сохранять свое первоначальное состояние и упаковку. Мы оставляем за собой право отказать в возврате, если товар был использован или поврежден',
        statement3:'Простой процесс: Чтобы начать процесс возврата, свяжитесь с нашей службой поддержки, и мы проведем вас через все необходимые шаги.',
      },
      conclusion:"Мы стремимся стать вашим надежным партнером в поиске лучших товаров и удовлетворения ваших потребностей. Надеемся, что ваш опыт покупок в Variety будет приятным и удовлетворяющим, и мы всегда готовы помочь вам сделать ваш выбор мудрым и осмысленным. Спасибо, что выбрали нас!"
    },
    contactUs:'Добро пожаловать в раздел контактов нашего интернет-магазина. Мы ценим ваше время и стремимся обеспечить высокий уровень обслуживания для всех наших клиентов. Если у вас возникли вопросы, предложения или замечания, пожалуйста, свяжитесь с нами!',
  },
};

const i18n = createI18n({
  locale: 'uk',
  fallbackLocale: 'uk',
  messages,
});

export default i18n;