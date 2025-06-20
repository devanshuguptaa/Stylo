// MongoDB initialization script
// This script runs when the MongoDB container starts for the first time

// Switch to the stylo database
db = db.getSiblingDB('stylo');

// Create collections with initial data
db.createCollection('users');
db.createCollection('contacts');

// Create indexes for better performance
db.users.createIndex({ "email": 1 }, { unique: true });
db.users.createIndex({ "googleId": 1 });
db.contacts.createIndex({ "email": 1 });

// Insert sample user data (optional - for testing)
db.users.insertOne({
    name: "Demo User",
    email: "demo@stylo.com",
    password: "$2b$10$rQZ8N3YqX9vK2mP1nL5tR7sA4bC6dE8fG0hI1jK2lM3nO4pQ5rS6tU7vW8xY9z",
    createdAt: new Date(),
    updatedAt: new Date()
});

// Insert sample contact data (optional - for testing)
db.contacts.insertOne({
    name: "John Doe",
    email: "john@example.com",
    message: "Great products! I love the design.",
    createdAt: new Date()
});

print("✅ MongoDB initialized successfully!");
print("📊 Database: stylo");
print("👥 Collections: users, contacts");
print("🔍 Indexes created for performance");
print("📝 Sample data inserted for testing"); 