const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone');
const { GraphQLError } = require('graphql');
const mongoose = require('mongoose');
const { v1: uuid } = require('uuid');

const Author = require('./models/author');
const Book = require('./models/book');

require('dotenv').config();

let authorsTestData = [
    {
        name: 'Robert Martin',
        id: "afa51ab0-344d-11e9-a414-719c6709cf3e",
        born: 1952,
    },
    {
        name: 'Martin Fowler',
        id: "afa5b6f0-344d-11e9-a414-719c6709cf3e",
        born: 1963
    },
    {
        name: 'Fyodor Dostoevsky',
        id: "afa5b6f1-344d-11e9-a414-719c6709cf3e",
        born: 1821
    },
    {
        name: 'Joshua Kerievsky', // birthyear not known
        id: "afa5b6f2-344d-11e9-a414-719c6709cf3e",
    },
    {
        name: 'Sandi Metz', // birthyear not known
        id: "afa5b6f3-344d-11e9-a414-719c6709cf3e",
    },
];

let booksTestData = [
    {
        title: 'Clean Code',
        published: 2008,
        author: 'Robert Martin',
        id: "afa5b6f4-344d-11e9-a414-719c6709cf3e",
        genres: ['refactoring']
    },
    {
        title: 'Agile software development',
        published: 2002,
        author: 'Robert Martin',
        id: "afa5b6f5-344d-11e9-a414-719c6709cf3e",
        genres: ['agile', 'patterns', 'design']
    },
    {
        title: 'Refactoring, edition 2',
        published: 2018,
        author: 'Martin Fowler',
        id: "afa5de00-344d-11e9-a414-719c6709cf3e",
        genres: ['refactoring']
    },
    {
        title: 'Refactoring to patterns',
        published: 2008,
        author: 'Joshua Kerievsky',
        id: "afa5de01-344d-11e9-a414-719c6709cf3e",
        genres: ['refactoring', 'patterns']
    },
    {
        title: 'Practical Object-Oriented Design, An Agile Primer Using Ruby',
        published: 2012,
        author: 'Sandi Metz',
        id: "afa5de02-344d-11e9-a414-719c6709cf3e",
        genres: ['refactoring', 'design']
    },
    {
        title: 'Crime and punishment',
        published: 1866,
        author: 'Fyodor Dostoevsky',
        id: "afa5de03-344d-11e9-a414-719c6709cf3e",
        genres: ['classic', 'crime']
    },
    {
        title: 'Demons',
        published: 1872,
        author: 'Fyodor Dostoevsky',
        id: "afa5de04-344d-11e9-a414-719c6709cf3e",
        genres: ['classic', 'revolution']
    },
];

const typeDefs = `
  type Book {
    id: ID!
    title: String!
    published: Int!
    author: Author!
    genres: [String!]!
  }

  type Author {
    id: ID!
    name: String!
    born: Int
    bookCount: Int!
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
  }

  type Mutation {
    addBook(
        title: String!
        author: String!
        published: Int!
        genres: [String!]!
    ): Book
    editAuthor(
        name: String!
        setBornTo: Int
    ): Author
  }
`;

const resolvers = {
    Query: {
        bookCount: async () => Book.collection.countDocuments(),
        authorCount: async () => Author.collection.countDocuments(),
        allBooks: async (root, { author, genre }) => {
            const filter = {};
            if (author) {
                const { _id: authorId } = await Author.findOne({ name: author });
                filter.author = authorId;
            }
            if (genre) {
                filter.genres = genre;
            }
            return Book.find(filter);
        },
        allAuthors: async () => Author.find({}),
    },

    Mutation: {
        addBook: async (root, args) => {
            const { title, author } = args;
            let authorObj = await Author.findOne({ name: author });
            if (authorObj && await Book.findOne({ title, author: authorObj._id }) != null) {
                throw new GraphQLError('A book by this title by this author already exists in the database!', {
                    extensions: {
                        code: 'BAD_USER_INPUT',
                        invalidArgs: [title, author],
                    }
                });
            }

            if (authorObj == null) {
                authorObj = new Author({ name: author });
                try {
                    await authorObj.save();
                } catch (error) {
                    throw new GraphQLError(`Invalid author parameter: ${error.message}`, {
                        extensions: {
                            code: 'BAD_USER_INPUT',
                            invalidArgs: [author],
                        }
                    });
                }
            }

            const newBook = new Book({ ...args, author: authorObj._id });
            try {
                await newBook.save();
            } catch (error) {
                throw new GraphQLError(`Invalid book parameters: ${error.message}`, {
                    extensions: {
                        code: 'BAD_USER_INPUT',
                        invalidArgs: [title, args.published, args.genres],
                    }
                });
            }
            return newBook;
        },

        editAuthor: async (root, { name, setBornTo }) => {
            const author = await Author.findOne({ name });
            if (author == null) {
                return null;
            }

            if (setBornTo) {
                author.born = setBornTo;
            }

            try {
                await author.save();
            } catch (error) {
                throw new GraphQLError(`Invalid author parameter: ${error.message}`, {
                    extensions: {
                        code: 'BAD_USER_INPUT',
                        invalidArgs: [setBornTo],
                    }
                });
            }
            return author;
        },
    },

    Book: {
        author: async ({ author }) => Author.findOne({ _id: author }),
    },

    Author: {
        bookCount: async ({ name }) => {
            const { _id: author } = await Author.findOne({ name });
            return Book.collection.countDocuments({ author });
        }
    },
};

const main = async () => {
    const mongodbUri = process.env.MONGODB_URI;
    try {
        await mongoose.connect(mongodbUri);
        console.log('Connected to mongodb.');
    } catch (error) {
        console.error('Failed to connect to mongodb:', error.message);
        process.exit(1);
    }

    if (process.env.RESET_DB) {
        console.log('RESET_DB is set in the environment, cleaning up the db and fillling in test data.');
        await Author.deleteMany({});
        await Book.deleteMany({});
        const authorIdMap = {};
        for (const { id, ...authorSansId } of authorsTestData) {
            const author = new Author(authorSansId);
            const doc = await author.save();
            authorIdMap[doc.name] = doc._id;
        }
        for (const { id, ...bookSansId } of booksTestData) {
            bookSansId.author = authorIdMap[bookSansId.author];
            const book = new Book(bookSansId);
            await book.save();
        }
    }

    const server = new ApolloServer({ typeDefs, resolvers });
    try {
        const { url } = await startStandaloneServer(server, { listen: { port: 4000 } });
        console.log(`Apollo (GraphQL) server ready at: ${url}`);
    } catch (error) {
        console.error('Failed to start Apollo server:', error.message);
        process.exit(1);
    }
};

main();
