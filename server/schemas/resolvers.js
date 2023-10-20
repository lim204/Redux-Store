const { AuthenticationError } = require('apollo-server-express');
const { User, Product, Category, Order } = require('../models');
const { signToken } = require('../utils/auth');
// const stripe = require('stripe')

const resolvers = {
    Query: {
        categories: async () => {
            return await Category.find();
        },
        products: async (parent,{categories, name}) => {
            const params = {};
            if (category){
                params.category = category;
            }

            if (name){
                params.name = {
                    $regex: name
                };
            }
          return await Product.find(params).populate('category');
        },
    }
}

module.exports = resolvers;