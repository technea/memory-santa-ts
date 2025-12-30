'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

// Define template interface
interface MemeTemplate {
  id: string;
  name: string;
  image: string;
}

// Define generated meme interface
interface GeneratedMeme {
  template: string;
  topText: string;
  bottomText: string;
  timestamp: number;
}

const MemeGenerator = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('santa');
  const [topText, setTopText] = useState<string>('WHEN YOU FINISH');
  const [bottomText, setBottomText] = useState<string>('THE MEMORY GAME');
  const [generatedMeme, setGeneratedMeme] = useState<GeneratedMeme | null>(null);

  const templates: MemeTemplate[] = [
    { id: 'santa', name: 'Santa Laugh', image: '🎅' },
    { id: 'gift', name: 'Gift Surprise', image: '🎁' },
    { id: 'snowman', name: 'Snowman Wisdom', image: '⛄' },
    { id: 'reindeer', name: 'Reindeer Mode', image: '🦌' }
  ];

  const generateMeme = (): void => {
    const meme: GeneratedMeme = {
      template: selectedTemplate,
      topText: topText.toUpperCase(),
      bottomText: bottomText.toUpperCase(),
      timestamp: Date.now()
    };
    
    setGeneratedMeme(meme);

    // Add some visual feedback
    setTimeout(() => {
      alert('🎉 Meme Generated! 🎉');
    }, 100);
  };

  const currentTemplate = templates.find(t => t.id === selectedTemplate);

  // Handle template selection
  const handleTemplateSelect = (templateId: string): void => {
    setSelectedTemplate(templateId);
  };

  // Handle top text change
  const handleTopTextChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setTopText(e.target.value);
  };

  // Handle bottom text change
  const handleBottomTextChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setBottomText(e.target.value);
  };

  // Format timestamp to readable date
  const formatTimestamp = (timestamp: number): string => {
    return new Date(timestamp).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <motion.div
      className="text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="text-2xl font-black text-white mb-6">🎨 MEME GENERATOR</h3>
      <p className="text-[#00D4FF]/80 mb-6">Create hilarious Santa-themed memes!</p>

      {/* Template Selection */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {templates.map((template: MemeTemplate) => (
          <motion.button
            key={template.id}
            onClick={() => handleTemplateSelect(template.id)}
            className={`p-4 rounded-xl border-2 transition-all ${
              selectedTemplate === template.id
                ? 'border-[#00D4FF] bg-[#00D4FF]/20'
                : 'border-white/20 bg-black/30 hover:border-white/40'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label={`Select ${template.name} template`}
            type="button"
          >
            <div className="text-4xl mb-2">{template.image}</div>
            <div className="text-white text-sm font-bold">{template.name}</div>
          </motion.button>
        ))}
      </div>

      {/* Text Inputs */}
      <div className="space-y-4 mb-6">
        <input
          type="text"
          value={topText}
          onChange={handleTopTextChange}
          placeholder="Top text..."
          className="w-full p-3 bg-black/50 border border-white/20 rounded-xl text-white placeholder-white/50 focus:border-[#00D4FF] focus:outline-none"
          maxLength={50}
          aria-label="Top text input"
        />
        <input
          type="text"
          value={bottomText}
          onChange={handleBottomTextChange}
          placeholder="Bottom text..."
          className="w-full p-3 bg-black/50 border border-white/20 rounded-xl text-white placeholder-white/50 focus:border-[#00D4FF] focus:outline-none"
          maxLength={50}
          aria-label="Bottom text input"
        />
      </div>

      {/* Generate Button */}
      <motion.button
        onClick={generateMeme}
        className="px-8 py-3 bg-gradient-to-r from-[#00D4FF] to-[#0052FF] text-white font-black rounded-xl hover:shadow-lg hover:shadow-[#00D4FF]/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        disabled={!topText.trim() && !bottomText.trim()}
        type="button"
        aria-label="Generate meme"
      >
        🎉 GENERATE MEME
      </motion.button>

      {/* Generated Meme Display */}
      {generatedMeme && (
        <motion.div
          className="mt-6 p-6 bg-black/50 rounded-xl border border-[#00D4FF]/30"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          role="region"
          aria-label="Generated meme"
        >
          <div className="text-6xl mb-4" role="img" aria-label={currentTemplate?.name || 'Meme image'}>
            {currentTemplate?.image}
          </div>
          
          <div className="space-y-2 mb-4">
            {generatedMeme.topText && (
              <div className="text-white font-black text-xl">
                {generatedMeme.topText}
              </div>
            )}
            
            {generatedMeme.bottomText && (
              <div className="text-white font-black text-xl">
                {generatedMeme.bottomText}
              </div>
            )}
          </div>
          
          <div className="text-[#00D4FF]/60 text-xs mt-4">
            Generated on {formatTimestamp(generatedMeme.timestamp)}
          </div>
          
          {/* Share Button */}
          <button
            onClick={() => {
              const shareText = `Check out my meme: "${generatedMeme.topText} ${generatedMeme.bottomText}"`;
              navigator.clipboard.writeText(shareText).then(() => {
                alert('Meme text copied to clipboard! 📋');
              });
            }}
            className="mt-4 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-bold rounded-lg hover:opacity-90 transition-opacity"
            type="button"
          >
            📋 Copy Meme Text
          </button>
        </motion.div>
      )}

      {/* Usage Tips */}
      <div className="mt-8 p-4 bg-black/30 rounded-xl border border-white/10">
        <h4 className="text-white font-bold mb-2">💡 Meme Tips:</h4>
        <ul className="text-sm text-gray-300 space-y-1 text-left">
          <li>• Use uppercase for maximum meme impact</li>
          <li>• Keep text short and punchy</li>
          <li>• Try different templates for different moods</li>
          <li>• Share your meme with friends!</li>
        </ul>
      </div>
    </motion.div>
  );
};

export default MemeGenerator;