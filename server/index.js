const { GraphQLServer } = require('graphql-yoga')
const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/launchpad_test')

const Profile = mongoose.model('Profile', {
  name: String,
  description: String
});

const typeDefs = `
  type Query {
    hello(name: String): String!
    profiles: [Profile]
  }
  type Profile {
    id: ID!
    name: String!
  }
  type Mutation {
    createProfile(name: String!): Profile
    updateProfile(id: ID!, name: String): Boolean
    deleteProfile(id: ID!): Boolean
  }
`

const resolvers = {
  Query: {
    hello: (_, { name }) => `Hello ${name || 'World'}`,
    profiles: () => Profile.find()
  },
  Mutation: {
    createProfile: async (_, { name }) => {
      const profile = new Profile({name});
      await profile.save();
      return profile;
    },
    updateProfile: async (_, {id, name}) => {
      await Profile.findByIdAndUpdate(id, {name});
      return true
    },
    deleteProfile: async (_, {id}) => {
      await Profile.findByIdAndRemove(id);
      return true
    }
  }
}

const server = new GraphQLServer({ typeDefs, resolvers })
mongoose.connection.once('open', function() {
  server.start(() => console.log('Server is running on localhost:4000'))
});
