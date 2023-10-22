const { AuthenticationError } = require('apollo-server-express');
const { User, Product, Category, Order } = require('../models');
const { signToken } = require('../utils/auth');
const { argsToArgsConfig } = require('graphql/type/definition');
// const stripe = require('stripe')

const resolvers = {
    Query: {
        categories: async () => {
            return await Category.find();
        },
        products: async (parent,{category, name}) => {
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
        product: async (parent,{_id})=>{
            return await Product.findById(_id).populate('category');
        },
        user: async (parent,arg,context) =>{
            if (context.user){
                const user = await User.findById(context._id).populate
                ({
                    path: 'orders.products',
                    populate: 'category'
                });
                user.orders.sort((a,b)=>b.purchaseDate - a.purchaseDate);

                return user;
            }
            throw new AuthenticationError('Not logged in');
        },
        order: async(parent,{_id}, context)=>{
            if(context.user) {
                const user = await User.findById(context.user._id).populate
                ({
                    path:'orders.products',
                    populate:'category'
                });
                return user.orders.id(_id);
            }
            throw new AuthenticationError('Not logged in');
        },
        checkout: async (parent,arg,context)=> {
            const url = new URL(context.headers.referer).origin;
            const order = new Order({producr:argsToArgsConfig.products});
            const line_items =[];

            const {products} = await order.populate('products');

            for (let i = 0; i<products.length;i++){
                const product = await stripIgnoredCharacters.product.create({
                    name:products[i].name,
                    description: products[i].description,
                    images: [`${url}/images/${products[i].image}`]
                });
                const price = await stripe.prices.create({
                    product: product.id,
                    unit_amount: products[i].price * 100,
                    currency: 'usd',
                  });
          
                  line_items.push({
                    price: price.id,
                    quantity: 1
                  });
            }
            
        }

    }
}

module.exports = resolvers;