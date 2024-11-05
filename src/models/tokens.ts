import mongoose, { Document, Model, Schema } from 'mongoose';

// Define an interface for the Token document
interface IToken extends Document {
  user: mongoose.Schema.Types.ObjectId; // Reference to the User model
  token: string;                        // The JWT token string
  createdAt: Date;                      // Token creation date
  expiresAt: Date;                      // Token expiration date
}

// Define the Token schema
const tokenSchema = new mongoose.Schema<IToken>({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  expiresAt: {
    type: Date,
    required: true, // Set to the JWT token's expiration date
  },
});

// Static method to clean up expired tokens
tokenSchema.statics.removeExpiredTokens = async function () {
  const now = new Date();
  await this.deleteMany({ expiresAt: { $lt: now } });
};

// Define the Token model with the schema
const Token: Model<IToken> = mongoose.model<IToken>('Token', tokenSchema);

export default Token;