const weekdays = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday'
];

// const first = weekdays[0], second = weekdays[1], fifth = weekdays[4];
const [ first, second, , , fifth = 'Holiday', sixth = 'Holiday' ] = weekdays;
// fifth -> Friday, sixth -> 'Holiday'
console.log( first, second, fifth, sixth );