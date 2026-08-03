// Create a Movie class that represents details of a movie. Suggested information to have in an
// object of the class - name, cast (an array of strings with cast member's names),
// yearOfRelease, boxOfficeCollection, addToCast( newMember ) that accepts a new cast
// member's name and adds to the cast array, addToCollection( amount ) that accepts box
// office collections for a week and adds it to the current boxOfficeCollection. Create 2 objects
// of this class that represent any 2 movies. Call the methods addToCast() and
// addToCollection() and verify they work according to expectations.

// 10. Create a SequelMovie class that inherits from Movie class. SequelMovie has an additional
// property called earlierMovies - an array of Movie objects. It has an additional method called
// getLifetimeEarnings() that returns the sum of boxOfficeCollection of all earlier movies along
// with the SequelMovie object's boxOfficeCollection.