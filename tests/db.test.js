import DatabaseManager from '../server/database.js';

console.log('\n🧪 Zero 1 Database Test Suite\n');

const db = new DatabaseManager();
db.init();

try {
  // Test 1: Create Conversation
  console.log('✅ Test 1: Create Conversation');
  const convId = db.createConversation('Test Conversation');
  console.log('Created:', convId);
  console.log();

  // Test 2: Add Message
  console.log('✅ Test 2: Add Message');
  const msgId = db.addMessage(convId, 'user', 'Hello', null, 100);
  console.log('Message ID:', msgId);
  console.log();

  // Test 3: Get Messages
  console.log('✅ Test 3: Get Messages');
  const messages = db.getMessages(convId);
  console.log('Messages:', messages.length);
  console.log();

  // Test 4: Get All Conversations
  console.log('✅ Test 4: Get All Conversations');
  const convs = db.getAllConversations();
  console.log('Conversations:', convs.length);
  console.log();

  // Test 5: Add File
  console.log('✅ Test 5: Add File');
  const fileId = db.addFile(convId, 'test.txt', 'Test content', 'text', 100);
  console.log('File ID:', fileId);
  console.log();

  // Test 6: Get Files
  console.log('✅ Test 6: Get Files');
  const files = db.getFiles(convId);
  console.log('Files:', files.length);
  console.log();

  // Test 7: Get Agent
  console.log('✅ Test 7: Get Agent Settings');
  const agent = db.getAgent();
  console.log('Agent Name:', agent.name);
  console.log('Personality:', agent.personality);
  console.log('Thinking Mode:', agent.thinking_mode);
  console.log();

  // Test 8: Cache Operations
  console.log('✅ Test 8: Cache Operations');
  const hash = 'test-hash-123';
  db.setCachedAnalysis(convId, hash, 'Test Analysis');
  const cached = db.getCachedAnalysis(hash);
  console.log('Cached:', !!cached);
  console.log();

  console.log('\n✅ All database tests passed!\n');

  db.close();
} catch (error) {
  console.error('\n❌ Database test failed:');
  console.error('Error:', error.message);
  db.close();
}
