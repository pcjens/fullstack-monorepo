const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone');
const { GraphQLError } = require('graphql');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const Author = require('./models/author');
const Book = require('./models/book');
const User = require('./models/user');

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

  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }

  type Token {
    value: String!
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
    me: User
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
    createUser(
        username: String!
        favoriteGenre: String!
    ): User
    login(
        username: String!
        password: String!
    ): Token
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
        me: (root, args, { user }) => user,
    },

    Mutation: {
        addBook: async (root, args, { user }) => {
            if (user == null) {
                throw new GraphQLError('Login required.', {
                    extensions: { code: 'BAD_USER_INPUT' }
                });
            }

            const { title, author } = args;

            let authorObj = await Author.findOne({ name: author });
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

        editAuthor: async (root, { name, setBornTo }, { user }) => {
            if (user == null) {
                throw new GraphQLError('Login required.', {
                    extensions: { code: 'BAD_USER_INPUT' }
                });
            }

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
                throw new GraphQLError(error.message, {
                    extensions: {
                        code: 'BAD_USER_INPUT',
                        invalidArgs: [setBornTo],
                    }
                });
            }
            return author;
        },

        createUser: async (root, args) => {
            const newUser = new User({ ...args });
            try {
                await newUser.save();
            } catch (error) {
                throw new GraphQLError(error.message, {
                    extensions: {
                        code: 'BAD_USER_INPUT',
                        invalidArgs: [args.username, args.favoriteGenre],
                    }
                });
            }
            return newUser;

        },

        login: async (root, { username, password }) => {
            const user = await User.findOne({ username });
            if (!user || password !== 'secret') {
                throw new GraphQLError('Wrong credentials.', {
                    extensions: { code: 'BAD_USER_INPUT' }
                });
            }
            const token = { id: user._id, username };
            return { value: jwt.sign(token, process.env.JWT_SECRET) };
        },
    },

    Book: {
        author: async ({ author }) => Author.findById(author),
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
        await User.deleteMany({});
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
        const user = new User({ username: 'test', favoriteGenre: 'classic' });
        await user.save();
    }

    const server = new ApolloServer({ typeDefs, resolvers });
    try {
        const { url } = await startStandaloneServer(server, {
            listen: { port: 4000 },
            context: async ({ req, res }) => {
                const auth = req?.headers.authorization ?? '';
                let user = null;
                if (auth.startsWith('Bearer ')) {
                    const { id } = jwt.verify(auth.substring(7), process.env.JWT_SECRET);
                    user = await User.findById(id);
                }
                return { user };
            }
        });
        console.log(`Apollo (GraphQL) server ready at: ${url}`);
    } catch (error) {
        console.error('Failed to start Apollo server:', error.message);
        process.exit(1);
    }
};

main();
