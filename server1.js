
const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const MongoClient = require('mongodb').MongoClient;
//Import the mongoose module

const { URLSearchParams } = require('url');
global.URLSearchParams = URLSearchParams;
 
var mongoose = require('mongoose');
const {
    GraphQLID,
    GraphQLString,
    GraphQLList,
    GraphQLObjectType,
    GraphQLSchema,
    GraphQLNonNull
    }=require('graphql');

    var app = express();
//Set up default mongoose connection
var mongoDB = 'mongodb://root:thunder%4054Struck@142.93.118.128:27017/admin';
mongoose.connect(mongoDB, {auth: {
    user:'bp', 
    password:'bhanu@15',
    "useUnifiedTopology": true
  },
  useNewUrlParser: true, useUnifiedTopology: true});

//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
if(db){
    console.log('db conn')
}

const PostModel = db.model("post", {
    title: String,
    bannerImage: String,
    context: String,
    publish: String
});

const PostType = new GraphQLObjectType({
    name: "Post",
    fields: {
        id: { type: GraphQLID },
        title: { type: GraphQLString },
        bannerImage: { type: GraphQLString },
        context: { type: GraphQLString },
        publish: { type: GraphQLString }
    }
});

const schema = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: "Query",
        fields: {
            posts: {
                type: GraphQLList(PostType),
                resolve: (root, args, context, info) => {
                    return PostModel.find().exec();
                }
            },
            post: {
                type: PostType,
                args: {
                    id: { type: GraphQLNonNull(GraphQLID) }
                },
                resolve: (root, args, context, info) => {
                    return PostModel.findById(args.id).exec();
                }
            }
        }
    }),
    mutation: new GraphQLObjectType({
        name: "Mutation",
        fields: {
            post: {
                type: PostType,
                args: {
                    title: { type: GraphQLNonNull(GraphQLString) },
                    bannerImage: { type: GraphQLNonNull(GraphQLString) },
                    context: { type: GraphQLNonNull(GraphQLString) },
                    publish: { type: GraphQLNonNull(GraphQLString) }
                },
                resolve: (root, args, context, info) => {
                    var post = new PostModel(args);
                    return post.save();
                }
            }
        }
    }),
    mutation: new GraphQLObjectType({
      name: "Mutation",
      fields: {
          updatePost: {
              type: PostType,
              args: {
                    
                   title: { type: GraphQLNonNull(GraphQLString) },
                   bannerImage: { type: GraphQLNonNull(GraphQLString) },
                   context: { type: GraphQLNonNull(GraphQLString) },
                   publish: { type: GraphQLNonNull(GraphQLString) }
              },
              resolve: (root, args, context, info) => {
                console.log("entered");
                var post = new PostModel(args);
                  return post.findByIdAndUpdate({"_id":{type:GraphQLNonNull(GraphQLID)}}
                  ,{"$set":{context:context}},{"new": true}).exec();
              }
          }
      }
  })
});

    
app.use('/graphql',graphqlHTTP({
    schema: schema,
    graphiql:true
}));
 

app.listen('9007',()=> console.log('Express Conn\'d'));


