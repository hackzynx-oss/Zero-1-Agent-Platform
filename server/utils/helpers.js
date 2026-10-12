import crypto from 'crypto';

export const generateHash = (text) => {
  return crypto.createHash('sha256').update(text).digest('hex');
};

export const formatTokens = (tokens) => {
  if (tokens > 1000000) return (tokens / 1000000).toFixed(1) + 'M';
  if (tokens > 1000) return (tokens / 1000).toFixed(1) + 'K';
  return tokens.toString();
};

export const sanitizeInput = (input) => {
  return input
    .trim()
    .replace(/[<>"'&]/g, char => ({
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
      '&': '&amp;'
    }[char]));
};

export const extractCodeBlocks = (text) => {
  const codeBlockRegex = /```([^\n]*)\n([\s\S]*?)```/g;
  const blocks = [];
  let match;
  while ((match = codeBlockRegex.exec(text)) !== null) {
    blocks.push({
      language: match[1] || 'text',
      code: match[2]
    });
  }
  return blocks;
};

export const estimateTokens = (text) => {
  // Rough estimation: 1 token ≈ 4 characters
  return Math.ceil(text.length / 4);
};
