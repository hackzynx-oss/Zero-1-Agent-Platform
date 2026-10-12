import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

console.log('\n🧪 Zero 1 API Test Suite\n');

async function testAPI() {
  try {
    // Test 1: Health Check
    console.log('✅ Test 1: Health Check');
    const health = await axios.get(`${API_BASE}/health`);
    console.log('Status:', health.data.status);
    console.log('Agent:', health.data.agent);
    console.log('Mode:', health.data.mode);
    console.log();

    // Test 2: Get Platform Info
    console.log('✅ Test 2: Platform Info');
    const info = await axios.get(`${API_BASE}`);
    console.log('Platform:', info.data.platform);
    console.log('Features:', info.data.features.length, 'available');
    console.log();

    // Test 3: Create Conversation
    console.log('✅ Test 3: Create Conversation');
    const convRes = await axios.post(`${API_BASE}/conversations/new`, {
      title: 'Test Conversation'
    });
    const conversationId = convRes.data.id;
    console.log('Created:', conversationId);
    console.log();

    // Test 4: Get Conversations
    console.log('✅ Test 4: Get All Conversations');
    const convs = await axios.get(`${API_BASE}/conversations`);
    console.log('Total conversations:', convs.data.length);
    console.log();

    // Test 5: Send Message
    console.log('✅ Test 5: Send Test Message');
    const msgRes = await axios.post(`${API_BASE}/agent/chat`, {
      conversationId,
      message: 'Hello Zero 1, introduce yourself briefly.',
      thinkingMode: true,
      focusLevel: 100
    });
    console.log('Response received:', msgRes.data.response.substring(0, 100) + '...');
    console.log('Has thinking:', !!msgRes.data.thinking);
    console.log('Tokens used:', msgRes.data.usage.total_tokens);
    console.log();

    // Test 6: Get Agent Status
    console.log('✅ Test 6: Agent Status');
    const status = await axios.get(`${API_BASE}/agent/status`);
    console.log('Status:', status.data.status);
    console.log('Mode:', status.data.mode);
    console.log();

    console.log('\n✅ All tests passed! Platform is operational.\n');

  } catch (error) {
    console.error('\n❌ Test failed:');
    console.error('Error:', error.response?.data || error.message);
    console.error();
  }
}

testAPI();
