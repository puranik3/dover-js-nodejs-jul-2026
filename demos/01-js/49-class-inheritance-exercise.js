// Create a Movie class that represents details of a movie. Suggested information to have in an
// object of the class - name, cast (an array of strings with cast member's names),
// yearOfRelease, boxOfficeCollection, addToCast( newMember ) that accepts a new cast
// member's name and adds to the cast array, addToCollection( amount ) that accepts box
// office collections for a week and adds it to the current boxOfficeCollection. Create 2 objects
// of this class that represent any 2 movies. Call the methods addToCast() and
// addToCollection() and verify they work according to expectations.
class Movie {
  constructor(name, cast, yearOfRelease, boxOfficeCollection) {
    this.name = name;
    this.cast = cast;
    this.yearOfRelease = yearOfRelease;
    this.boxOfficeCollection = boxOfficeCollection;
  }
 
  addToCast(newMember) {
    this.cast.push(newMember);
  }

  addToCollection(amount) {
    this.boxOfficeCollection += amount;
  }
}

const sholay = new Movie( 'Sholay', [ 'Dharmendra' ], 1975, 1000000 );
sholay.addToCast( 'Amitabh Bachchan' );
sholay.addToCollection( 500000 );

const bahubali = new Movie( 'Bahubali', [ 'Prabhas' ], 2015, 2000000 );
bahubali.addToCast( 'Anushka Shetty' );
bahubali.addToCollection( 1000000 );

console.log(sholay);
console.log(bahubali);

// 10. Create a SequelMovie class that inherits from Movie class. SequelMovie has an additional
// property called earlierMovies - an array of Movie objects. It has an additional method called
// getLifetimeEarnings() that returns the sum of boxOfficeCollection of all earlier movies along
// with the SequelMovie object's boxOfficeCollection.
class SequelMovie extends Movie {
  constructor(name, cast, yearOfRelease, boxOfficeCollection, earlierMovies) {
    super(name, cast, yearOfRelease, boxOfficeCollection);

    this.earlierMovies = earlierMovies;
  }

  getLifetimeEarnings() {
    return this.boxOfficeCollection + this.earlierMovies.reduce((sum, movie) => sum + movie.boxOfficeCollection, 0);
  }
}

const bahubali2 = new SequelMovie( 'Bahubali 2', [ 'Prabhas' ], 2017, 3000000, [ bahubali ] );
console.log(bahubali2.getLifetimeEarnings()); // 6000000