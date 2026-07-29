// 1. Use array and object destructuring feature to create variable that hold values as shown below.
// ```
// const iPhone11 = {
//     name: 'iPhone 11',
//     manufacturer: 'Apple',
//     price: 699,
//     specs: {
//         color: 'White',
//         memory: {
//             value: 128,
//             unit: 'MB'
//         },
//         cameras: {
//             front: '12 MP Wide',
//             rear: '12 MP Ultra Wide'
//         },
//         availableColors: [ 'Black', 'Green', 'Yellow', 'Purple', 'Red', 'White' ]
//     },
//     calculateDiscoutedPrice: function( percentage ) {
//         return this.price * ( 100 - percentage ) / 100;
//     }
// }

// // create the variables using destructuring - the variables should have values as shown below.
// // destructure here...

// // below line logs - iPhone 11   Apple   128   12 MP Ultra Wide   Green
// console.log( name, brand, ram, rearCamera, secondColor );
// ```

const iPhone11 = {
    name: 'iPhone 11',
    manufacturer: 'Apple',
    price: 699,
    specs: {
        color: 'White',
        memory: {
            value: 128,
            unit: 'MB'
        },
        cameras: {
            front: '12 MP Wide',
            rear: '12 MP Ultra Wide'
        },
        availableColors: [ 'Black', 'Green', 'Yellow', 'Purple', 'Red', 'White' ]
    },
    calculateDiscoutedPrice: function( percentage ) {
        return this.price * ( 100 - percentage ) / 100;
    }
}

const {
    price,
    name
} = iPhone11;

console.log( name, price );
