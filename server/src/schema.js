import { gql } from 'apollo-server-express'
import { find, filter, remove } from 'lodash'

const people = [
    {
        id: '1',
        firstName: 'Bill',
        lastName: 'Gates'
    },
    {
        id: '2',
        firstName: 'Steve',
        lastName: 'Jobs'
    },
    {
        id: '3',
        firstName: 'Linux',
        lastName: 'Torvalds'
    }
]

const cars = [
    {
        id: '1',
        year: '2019',
        make: 'Toyota',
        model: 'Corolla',
        price: '40000',
        personId: '1'
    },
    {
        id: '2',
        year: '2018',
        make: 'Lexus',
        model: 'LX 600',
        price: '13000',
        personId: '1'
    },
    {
        id: '3',
        year: '2017',
        make: 'Honda',
        model: 'Civic',
        price: '20000',
        personId: '1'
    },
    {
        id: '4',
        year: '2019',
        make: 'Acura ',
        model: 'MDX',
        price: '60000',
        personId: '2'
    },
    {
        id: '5',
        year: '2018',
        make: 'Ford',
        model: 'Focus',
        price: '35000',
        personId: '2'
    },
    {
        id: '6',
        year: '2017',
        make: 'Honda',
        model: 'Pilot',
        price: '45000',
        personId: '2'
    },
    {
        id: '7',
        year: '2019',
        make: 'Volkswagen',
        model: 'Golf',
        price: '40000',
        personId: '3'
    },
    {
        id: '8',
        year: '2018',
        make: 'Kia',
        model: 'Sorento',
        price: '45000',
        personId: '3'
    },
    {
        id: '9',
        year: '2017',
        make: 'Volvo',
        model: 'XC40',
        price: '55000',
        personId: '3'
    }
]

const typeDefs = gql`
	type Person {
		id: String!
		firstName: String
		lastName: String
	}
	type Car {
		id: String!
		year: Int
		make: String
		model: String
		price: Float
		personId: String
	}

	type PersonWithCars {
		person: Person
		cars: [Car]
	}

	type Query {
		person(id: String!): Person
		people: [Person]
		car(id: String!): Car
		cars: [Car]
		personWithCars(id: String!): PersonWithCars
	}

    type Mutation {
        createPerson(id: String!, firstName: String!, lastName: String!): Person
        updatePerson(id: String!, firstName: String!, lastName: String!): Person
        deletePerson(id: String!): Person
        createCar(id: String!, year: Int!, make: String!, model: String!, price: Float!, personId: String!): Car
        updateCar(id: String!, year: Int!, make: String!, model: String!, price: Float!, personId: String!): Car
        deleteCar(id: String!): Car
    }
`;

const resolvers = {
    Query: {
        person: (parent, args, context, info) =>{
            return find(people, { id: args.id })
        },

        people: () => people,

        car: (parent, args, context, info) =>  {
            return find(cars, { id: args.id })
        },

        cars: () => cars,

        personWithCars: (parent, args, context, info) => {
            const personCars = filter(cars, { personId: args.id });
            const person = find(people, { id: args.id })
            return {
                person: person,
                cars: personCars
            };
        }
    },
    Mutation: {
        createPerson: (root, args) => {
            const person = {
                id: args.id,
                firstName: args.firstName,
                lastName: args.lastName
            };
            people.push(person);
            return person;
        },

        updatePerson: (root, args) => {
            const person = find(people, { id: args.id });
            if(!person) {
                throw new Error('Person not found for id: ' + args.id);
            }
            person.firstName = args.firstName;
            person.lastName = args.lastName;
            return person;
        },

        deletePerson: (root, args) => {
            const person = find(people, { id: args.id });
            if(!person) {
                throw new Error('Person not found for id: ' + args.id);
            }
            remove(people, { id: args.id });
            remove(cars, { personId: args.id });
            return person;
        },

        createCar: (root, args) => {
            const car = {
                id: args.id,
                year: args.year,
                make: args.make,
                model: args.model,
                price: args.price,
                personId: args.personId
            };
            cars.push(car);
            return car;
        },

        updateCar: (root, args) => {
            const car = find(cars, { id: args.id });
            if(!car) {
                throw new Error('Car not found for id: ' + args.id);
            }
            car.year = args.year;
            car.make = args.make;
            car.model = args.model;
            car.price = args.price;
            car.personId = args.personId;
            return car;
        },
        
        deleteCar: (root, args) => {
            const car = find(cars, { id: args.id });
            if(!car) {
                throw new Error('Car not found for id: ' + args.id);
            }
            remove(cars, { id: args.id });
            return car;
        }
    }
}

export { typeDefs, resolvers }