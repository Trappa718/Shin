// ==========================================
// ШИН — ПАСПОРТ ПИТОМЦА
// ==========================================


// Имя питомца
const PET_NAME = "Шин";


// Дата рождения
const BIRTHDAY = "2026-04-24";


// ==========================================
// КАЛЕНДАРЬ КОРМЛЕНИЯ
// ==========================================
//
// Шин кормится один раз в неделю.
//
// Первая дата:
// 15.09.2026
//
// Далее автоматически:
// 22.09
// 29.09
// 06.10
// и т.д.
//
// Здесь уже записаны даты на ближайшие месяцы.
//

const FEEDING_DATES = [

    "2026-09-15",
    "2026-09-22",
    "2026-09-29",

    "2026-10-06",
    "2026-10-13",
    "2026-10-20",
    "2026-10-27",

    "2026-11-03",
    "2026-11-10",
    "2026-11-17",
    "2026-11-24",

    "2026-12-01",
    "2026-12-08",
    "2026-12-15",
    "2026-12-22",
    "2026-12-29",

    "2027-01-05",
    "2027-01-12",
    "2027-01-19",
    "2027-01-26",

    "2027-02-02",
    "2027-02-09",
    "2027-02-16",
    "2027-02-23",

    "2027-03-02",
    "2027-03-09",
    "2027-03-16",
    "2027-03-23",
    "2027-03-30"

];


// ==========================================
// МЕСЯЦЫ
// ==========================================

const MONTH_NAMES = [

    "Январь",
    "Февраль",
    "Март",
    "Апрель",
    "Май",
    "Июнь",
    "Июль",
    "Август",
    "Сентябрь",
    "Октябрь",
    "Ноябрь",
    "Декабрь"

];


// ==========================================
// ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
// ==========================================

function pad(number) {

    return String(number).padStart(2, "0");

}


function dateToKey(date) {

    return (
        date.getFullYear()
        + "-"
        + pad(date.getMonth() + 1)
        + "-"
        + pad(date.getDate())
    );

}


function parseDate(key) {

    const parts = key.split("-");

    return new Date(
        Number(parts[0]),
        Number(parts[1]) - 1,
        Number(parts[2])
    );

}


function formatDate(date) {

    return date.toLocaleDateString(
        "ru-RU",
        {
            day: "numeric",
            month: "short"
        }
    ).replace(".", "");

}


// ==========================================
// ВОЗРАСТ
// ==========================================

function calculateAge() {

    const birthday = parseDate(BIRTHDAY);

    const today = new Date();

    let months =
        (today.getFullYear() - birthday.getFullYear()) * 12
        +
        (today.getMonth() - birthday.getMonth());


    if (today.getDate() < birthday.getDate()) {

        months--;

    }


    months = Math.max(0, months);


    const years = Math.floor(months / 12);

    const remainingMonths = months % 12;


    if (years > 0) {

        if (remainingMonths > 0) {

            return `${years} г. ${remainingMonths} мес.`;

        }

        return `${years} г.`;

    }


    return `${remainingMonths} мес.`;

}


document.getElementById("age").textContent =
    calculateAge();


// ==========================================
// СЛЕДУЮЩЕЕ КОРМЛЕНИЕ
// ==========================================

function getNextFeeding() {

    const today = new Date();

    today.setHours(0, 0, 0, 0);


    const dates = FEEDING_DATES

        .map(parseDate)

        .filter(date => date >= today)

        .sort((a, b) => a - b);


    return dates[0];

}


const nextFeeding =
    getNextFeeding();


if (nextFeeding) {

    document.getElementById("nextFeed").textContent =
        formatDate(nextFeeding);

}


// ==========================================
// КАЛЕНДАРЬ
// ==========================================

const today = new Date();

let currentMonth =
    new Date(
        today.getFullYear(),
        today.getMonth(),
        1
    );



function renderCalendar() {

    const year =
        currentMonth.getFullYear();

    const month =
        currentMonth.getMonth();


    // Заголовок месяца

    document.getElementById("monthTitle")
        .textContent =
        `${MONTH_NAMES[month]} ${year}`;


    const calendar =
        document.getElementById("calendar");


    calendar.innerHTML = "";


    // Первый день месяца

    const firstDay =
        new Date(
            year,
            month,
            1
        );


    // Количество дней

    const daysInMonth =
        new Date(
            year,
            month + 1,
            0
        ).getDate();


    // День недели

    // В JS:
    // воскресенье = 0
    //
    // Нам нужно:
    // понедельник = 0

    const offset =
        (firstDay.getDay() + 6) % 7;


    // Пустые клетки

    for (
        let i = 0;
        i < offset;
        i++
    ) {

        const empty =
            document.createElement("div");

        empty.className =
            "day empty";

        calendar.appendChild(empty);

    }


    // Дни месяца

    for (
        let day = 1;
        day <= daysInMonth;
        day++
    ) {

        const date =
            new Date(
                year,
                month,
                day
            );


        const element =
            document.createElement("div");


        element.className =
            "day";


        element.textContent =
            day;


        const key =
            dateToKey(date);


        // Сегодня

        if (
            key === dateToKey(today)
        ) {

            element.classList.add("today");

        }


        // День кормления

        if (
            FEEDING_DATES.includes(key)
        ) {

            element.classList.add("feeding");

        }


        calendar.appendChild(element);

    }

}


// ==========================================
// ПЕРЕКЛЮЧЕНИЕ МЕСЯЦЕВ
// ==========================================

document
    .getElementById("previousMonth")
    .addEventListener(
        "click",
        () => {

            currentMonth =
                new Date(
                    currentMonth.getFullYear(),
                    currentMonth.getMonth() - 1,
                    1
                );


            renderCalendar();

        }
    );


document
    .getElementById("nextMonth")
    .addEventListener(
        "click",
        () => {

            currentMonth =
                new Date(
                    currentMonth.getFullYear(),
                    currentMonth.getMonth() + 1,
                    1
                );


            renderCalendar();

        }
    );


// Первый запуск

renderCalendar();
