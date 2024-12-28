// const { projects, clients } = require("../sampleData.js");

const { GraphQLObjectType, GraphQLID, GraphQLString,GraphQLList, GraphQLSchema, GraphQLNonNull, GraphQLEnumType} = require("graphql");

const Project = require('../models/Project')
const Client = require('../models/Client')

// Project Type
const ProjectType = new GraphQLObjectType({
    name: "Project",
    fields: () => ({
      id: { type: GraphQLID },
      clientId: { type: GraphQLString },
      name: { type: GraphQLString },
      description: { type: GraphQLString },
      status: { type: GraphQLString },
      client:{
        type: ClientType,
        resolve(parent, args){
            // return clients.find(client => client.id === parent.id)
          return Client.findById(parent.clientId);        }
      }
    }),
  });


// Client Type
const ClientType = new GraphQLObjectType({
  name: "client",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    phone: { type: GraphQLString },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    projects: {
        type: new GraphQLList(ProjectType),
        resolve(parent, args){
            // return projects;
            return Project.find();
        }
    },
    project: {
      type: ProjectType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        // return projects.find((project) => project.id === args.id);
        return Project.findById(args.id);
      },
    },
    clients: {
        type: new GraphQLList(ClientType),
        resolve(parent, args){
            return Client.find();
        }
    },
    client: {
      type: ClientType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Client.findById(args.id);
      },
    },
  },
});


// Mutations
const mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    // Add a client
    addClient: {
      type: ClientType,
      args: {
        name: { type: GraphQLNonNull(GraphQLString) },
        email: { type: GraphQLNonNull(GraphQLString) },
        phone: { type: GraphQLNonNull(GraphQLString) },
      },
      resolve(parent, args) {
        const client = new Client({
          name: args.name,
          email: args.email,
          phone: args.phone,
        });
        return client.save();
      },
    },

    // Delete a client
    deleteClient: {
      type: ClientType,
      args: { id: { type: GraphQLNonNull(GraphQLID) } },
      resolve(parent, args) {
        return Client.findByIdAndDelete(args.id).then((result) => {
          if (!result) throw new Error("Client not found");
          return {
            message: "The client was successfully deleted",
            ...result._doc,
          };
        });
      },
    },

    // Update a client
    updateClient: {
      type: ClientType,
      args: {
        id: { type: GraphQLNonNull(GraphQLID) },
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        phone: { type: GraphQLString },
      },
      async resolve(parent, args) {
        try {
          // Check if client already exist
          const client = await Client.findById(args.id);
          if (!client) {
            throw new Error("Client was not found");
          }
          // Mise à jour du client avec les valeurs fournies
          client.name = args.name ?? client.name;
          client.email = args.email ?? client.email;
          client.phone = args.phone ?? client.phone;
          const updatedClient = await client.save();
          return {
            message: "The client was successfully updated",
            ...updatedClient._doc,
          };
        } catch (error) {
          throw new Error(`Error updating client : ${error.message}`);
        }
      },
    },

    // Add a project
    addProject: {
      type: ProjectType,
      args: {
        name: { type: GraphQLNonNull(GraphQLString) },
        description: { type: GraphQLNonNull(GraphQLString) },
        status: {
          type: new GraphQLEnumType({
            name: "ProjectStatus",
            values: {
              new: { value: "Not Started" },
              in_progress: { value: "In Progress" },
              completed: { value: "Completed" },
            },
          }),
          defaultValue: "Not Started",
        },
        clientId: { type: GraphQLNonNull(GraphQLID) },
      },
      resolve(parent, args) {
        const project = new Project({
          name: args.name,
          description: args.description,
          status: args.status,
          clientId: args.clientId,
        });

        return project.save();
      },
    },

    // Delete a project
    deleteProject: {
      type: ProjectType,
      args: { id: { type: GraphQLNonNull(GraphQLID) } },
      resolve(parent, args) {
        return Project.findByIdAndDelete(args.id).then((result) => {
          if (!result) throw new Error("Project not found");
          return {
            message: "The Project was successfully deleted",
            ...result._doc,
          };
        });
      },
    },

    // Update a project
    updateProject: {
      type: ProjectType,
      args: {
        id: { type: GraphQLNonNull(GraphQLID) },
        name: { type: GraphQLString },
        description: { type: GraphQLString },
        status: {
          type: new GraphQLEnumType({
            name: "ProjectStatusUpdate",
            values: {
              new: { value: "Not Started" },
              progress: { value: "In Progress" },
              completed: { value: "Completed" },
            },
          }),
        },
        clientId: { type: GraphQLID },
      },
      resolve(parent, args) {
        return Project.findByIdAndUpdate(
          args.id,
          {
            $set: {
              name: args.name,
              description: args.description,
              status: args.status,
            },
          },
          { new: true }
        );
      },
    },
  },
});



module.exports = new GraphQLSchema({
    query : RootQuery,
    mutation: mutation
});


