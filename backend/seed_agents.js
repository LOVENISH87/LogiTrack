const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

mongoose.connect('mongodb://127.0.0.1:27017/logitrack')
    .then(async () => {
        console.log('MongoDB Connected');
        await seedAgents();
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });

const agents = [
    { username: 'Ichigo Kurosaki', email: 'ichigo@soulsociety.com', password: 'password123', phone: '9998887771', role: 'delivery_agent', rating: 5 },
    { username: 'Rukia Kuchiki', email: 'rukia@soulsociety.com', password: 'password123', phone: '9998887772', role: 'delivery_agent', rating: 4 },
    { username: 'Kisuke Urahara', email: 'kisuke@shop.com', password: 'password123', phone: '9998887773', role: 'delivery_agent', rating: 5 },
    { username: 'Yoruichi Shihoin', email: 'yoruichi@flash.com', password: 'password123', phone: '9998887774', role: 'delivery_agent', rating: 5 },
    { username: 'Byakuya Kuchiki', email: 'byakuya@noble.com', password: 'password123', phone: '9998887775', role: 'delivery_agent', rating: 4 },
    { username: 'Kenpachi Zaraki', email: 'kenpachi@fight.com', password: 'password123', phone: '9998887776', role: 'delivery_agent', rating: 3 }
];

async function seedAgents() {
    try {
        for (const agent of agents) {
            const exists = await User.findOne({ email: agent.email });
            if (!exists) {
                await User.create(agent);
                console.log(`Created agent: ${agent.username}`);
            } else {
                console.log(`Agent already exists: ${agent.username}`);
                // Ensure role is correct if it exists
                if (exists.role !== 'delivery_agent') {
                    exists.role = 'delivery_agent';
                    await exists.save();
                    console.log(`Updated role for: ${agent.username}`);
                }
            }
        }
        console.log('Seeding complete');
        process.exit();
    } catch (error) {
        console.error('Error seeding agents:', error);
        process.exit(1);
    }
}
