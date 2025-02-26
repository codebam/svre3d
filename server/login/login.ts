import { MongoClient, Db } from 'mongodb';
import { Data } from '../db/db.js'; // Assuming this imports your database configuration
import { DBModel } from '../models/dbmodel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { env } from '../constant/env.js';
import { PlayerModel } from '../models/player.js';

export class LoginManager { 
	static async login(username: string, password: string): Promise<string | null> {
		try {
			const db = Data.db; // MongoDB database

			// Access the 'players' and 'secrets' collections
			const playersCollection = db.collection('players');
			const secretsCollection = db.collection('secrets');

			// Check if the user exists in the 'players' collection
			const user = await playersCollection.findOne({ username });

			if (!user) {
				throw new Error('User not found');
			}

			if(!user.verified){
				throw new Error('Email not verified');
			}

			// Verify the password
			const secret = await secretsCollection.findOne({ username });
			if (!secret || !(await bcrypt.compare(password, secret.password))) {
				throw new Error('Invalid credentials');
			}

			const token = await jwt.sign({ username }, env.secret, { expiresIn: '120d' }); 
            
			return token;
		} catch (error) {
			console.error('Login failed:', error);
			return null;
		}
	}

	static async verifyToken(token: string): Promise<string | null> {
		try {
			const decoded = await jwt.verify(token, env.secret);

			if (typeof decoded === 'string') {
				return decoded;
			} else if (typeof decoded === 'object' && decoded.hasOwnProperty('username')) {
				return decoded.username;
			} else {
				throw new Error('Invalid token');
			}
		} catch (error) {
			console.error('Token verification failed:', error);
			return null;
		}
	}


	static async register(username: string, password: string, variant: string, email: string, spawnPoint = { x: 0, z: 0 }): Promise<void> {
		try {
			const db = Data.db;
			const playersCollection = db.collection('players');

			const existingUser = await playersCollection.findOne({ username });
			if (existingUser) {
				throw new Error('User already exists');
			}

			const hashedPassword = await bcrypt.hash(password, 10);

			const newPlayer = await DBModel.create<typeof PlayerModel>('player', { variant, username, spawnPoint, email, position: { x: spawnPoint.x || 0, z: spawnPoint.z || 0, y: 5 } });

			await playersCollection.insertOne(newPlayer);

			const secretsCollection = db.collection('secrets');

			await secretsCollection.insertOne({ username, password: hashedPassword });
		} catch (error) {
			console.error('Registration failed:', error);
			throw error;
		}
	}
}
