import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  const level = parseInt(params.level);

  if (!level || level < 1 || level > 10) {
    return NextResponse.json(
      { error: 'Invalid level' },
      { status: 400 }
    );
  }

  try {
    // Try to generate enhanced NFT with external service or fallback to SVG
    const svgContent = await generateEnhancedSantaNFT(level);

    return new NextResponse(svgContent, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=31536000',
      },
    });
  } catch (error) {
    console.error('NFT generation error:', error);
    // Fallback to basic SVG generation
    const svgContent = generateSantaNFT(level);

    return new NextResponse(svgContent, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=31536000',
      },
    });
  }
}

// Enhanced NFT generation with potential external API integration
async function generateEnhancedSantaNFT(level) {
  // For now, we'll create a more sophisticated SVG
  // In production, this could integrate with:
  // - OpenAI DALL-E for AI-generated images
  // - Base NFT APIs for on-chain generation
  // - IPFS for decentralized storage
  // - External design APIs

  const themes = getLevelThemes();
  const theme = themes[level - 1] || themes[0];

  // Add dynamic elements based on level
  const specialEffects = getSpecialEffects(level);
  const animatedElements = getAnimatedElements(level);

  return `<svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
    <defs>
      ${generateGradients(theme)}
      ${generatePatterns(theme)}
      ${generateFilters(level)}
    </defs>

    <!-- Dynamic Background -->
    <rect width="400" height="400" fill="url(#dynamicBg)" rx="20" />

    <!-- Background Pattern -->
    <rect width="400" height="400" fill="url(#${theme.pattern})" rx="20" opacity="0.1" />

    <!-- Special Effects Layer -->
    ${specialEffects}

    <!-- Main Santa Character -->
    ${generateSantaCharacter(theme, level)}

    <!-- Animated Elements -->
    ${animatedElements}

    <!-- Level Badge -->
    ${generateLevelBadge(level, theme)}

    <!-- NFT Metadata Overlay -->
    ${generateMetadataOverlay(level, theme)}

  </svg>`;
}

function generateSantaNFT(level) {
  const colors = [
    '#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff',
    '#ff8000', '#8000ff', '#ff0080', '#80ff00'
  ];

  const levelColor = colors[level - 1] || '#ffffff';

  return `<svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#1e293b;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#334155;stop-opacity:1" />
      </linearGradient>
      <linearGradient id="santaHat" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#ff0000;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#cc0000;stop-opacity:1" />
      </linearGradient>
      <linearGradient id="levelAccent" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:${levelColor};stop-opacity:1" />
        <stop offset="50%" style="stop-color:#ffffff;stop-opacity:0.8" />
        <stop offset="100%" style="stop-color:${levelColor};stop-opacity:1" />
      </linearGradient>
    </defs>

    <!-- Background -->
    <rect width="400" height="400" fill="url(#bg)" rx="20" />

    <!-- Decorative border -->
    <rect x="10" y="10" width="380" height="380" fill="none" stroke="${levelColor}" stroke-width="3" rx="15" />

    <!-- Santa Hat -->
    <polygon points="150,120 200,60 250,120" fill="url(#santaHat)" />
    <circle cx="200" cy="50" r="15" fill="#ffffff" />

    <!-- Santa Face -->
    <circle cx="200" cy="180" r="80" fill="#ffdbac" />
    <circle cx="185" cy="165" r="8" fill="#000000" />
    <circle cx="215" cy="165" r="8" fill="#000000" />
    <ellipse cx="200" cy="190" rx="15" ry="8" fill="#ff6b9d" />

    <!-- Beard -->
    <ellipse cx="200" cy="210" rx="35" ry="25" fill="#ffffff" />

    <!-- Level Badge -->
    <circle cx="320" cy="80" r="40" fill="url(#levelAccent)" stroke="#ffffff" stroke-width="3" />
    <text x="320" y="85" text-anchor="middle" fill="#ffffff" font-family="Arial, sans-serif" font-size="24" font-weight="bold">${level}</text>

    <!-- Stars -->
    <text x="50" y="50" fill="#ffd700" font-size="30">⭐</text>
    <text x="330" y="330" fill="#ffd700" font-size="25">⭐</text>
    <text x="50" y="330" fill="#ffd700" font-size="20">⭐</text>

    <!-- Title -->
    <text x="200" y="320" text-anchor="middle" fill="#ffffff" font-family="Arial, sans-serif" font-size="18" font-weight="bold">Santa Level ${level}</text>
    <text x="200" y="345" text-anchor="middle" fill="#cccccc" font-family="Arial, sans-serif" font-size="12">Memory Game Champion</text>
  </svg>`;
}

// Helper functions for enhanced NFT generation
function getLevelThemes() {
  return [
    { // Level 1 - Classic Santa
      bg: ['#1e293b', '#334155'],
      hat: ['#ff0000', '#cc0000'],
      accent: ['#ff0000', '#ffffff', '#ff0000'],
      pattern: 'snowPattern',
      special: '🎅'
    },
    { // Level 2 - Golden Champion
      bg: ['#2d1810', '#451a03'],
      hat: ['#ffd700', '#ffb300'],
      accent: ['#ffd700', '#ffffff', '#ffd700'],
      pattern: 'starPattern',
      special: '🏆'
    },
    // Add more themes...
    { // Level 10 - Legendary
      bg: ['#451a03', '#713f12'],
      hat: ['#fbbf24', '#f59e0b'],
      accent: ['#fbbf24', '#ffffff', '#fbbf24'],
      pattern: 'legendaryPattern',
      special: '⭐'
    }
  ];
}

function generateGradients(theme) {
  return `
    <linearGradient id="dynamicBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${theme.bg[0]};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${theme.bg[1]};stop-opacity:1" />
    </linearGradient>
    <linearGradient id="santaHat" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${theme.hat[0]};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${theme.hat[1]};stop-opacity:1" />
    </linearGradient>
    <radialGradient id="faceGradient" cx="50%" cy="50%" r="50%">
      <stop offset="0%" style="stop-color:#ffdbac;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#f4c2a1;stop-opacity:1" />
    </radialGradient>
  `;
}

function generatePatterns(theme) {
  const patterns = {
    snowPattern: `
      <pattern id="snowPattern" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse">
        <circle cx="10" cy="10" r="2" fill="#ffffff" opacity="0.3"/>
        <circle cx="25" cy="25" r="1.5" fill="#ffffff" opacity="0.2"/>
        <circle cx="40" cy="15" r="1" fill="#ffffff" opacity="0.4"/>
      </pattern>
    `,
    starPattern: `
      <pattern id="starPattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
        <polygon points="30,5 35,20 50,20 38,30 42,45 30,35 18,45 22,30 10,20 25,20" fill="#ffd700" opacity="0.3"/>
      </pattern>
    `,
    legendaryPattern: `
      <pattern id="legendaryPattern" x="0" y="0" width="55" height="55" patternUnits="userSpaceOnUse">
        <polygon points="27.5,5 45,17.5 45,32.5 27.5,45 10,32.5 10,17.5" fill="#fbbf24" opacity="0.2"/>
      </pattern>
    `
  };

  return patterns[theme.pattern] || patterns.snowPattern;
}

function generateFilters(level) {
  return `
    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="${level}" result="coloredBlur"/>
      <feMerge>
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  `;
}

function getSpecialEffects(level) {
  if (level >= 8) {
    return `
      <circle cx="200" cy="200" r="180" fill="none" stroke="url(#santaHat)" stroke-width="2" opacity="0.1">
        <animate attributeName="r" values="180;190;180" dur="3s" repeatCount="indefinite"/>
      </circle>
    `;
  }
  return '';
}

function getAnimatedElements(level) {
  return `
    <g opacity="0.6">
      <circle cx="50" cy="50" r="3" fill="#ffffff">
        <animate attributeName="opacity" values="0.3;1;0.3" dur="2s" repeatCount="indefinite"/>
      </circle>
      <circle cx="350" cy="350" r="2" fill="#ffffff">
        <animate attributeName="opacity" values="0.5;1;0.5" dur="3s" repeatCount="indefinite"/>
      </circle>
    </g>
  `;
}

function generateSantaCharacter(theme, level) {
  return `
    <!-- Santa Hat -->
    <polygon points="150,120 200,60 250,120" fill="url(#santaHat)" />
    <ellipse cx="200" cy="55" rx="18" ry="12" fill="#ffffff" opacity="0.9"/>
    <circle cx="200" cy="50" r="8" fill="#ffffff" />

    <!-- Special Level Emblem -->
    <circle cx="200" cy="45" r="12" fill="${theme.accent[0]}" opacity="0.8"/>
    <text x="200" y="50" text-anchor="middle" fill="#ffffff" font-family="Arial, sans-serif" font-size="14" font-weight="bold">${theme.special}</text>

    <!-- Santa Face -->
    <circle cx="200" cy="180" r="80" fill="url(#faceGradient)" />

    <!-- Eyes -->
    <ellipse cx="185" cy="165" rx="10" ry="8" fill="#2d3748" />
    <ellipse cx="215" cy="165" rx="10" ry="8" fill="#2d3748" />
    <circle cx="187" cy="163" r="2" fill="#ffffff" />
    <circle cx="217" cy="163" r="2" fill="#ffffff" />

    <!-- Nose and Mouth -->
    <ellipse cx="200" cy="185" rx="8" ry="6" fill="#ff6b9d" />
    <path d="M185 205 Q200 215 215 205" stroke="#2d3748" stroke-width="3" fill="none" stroke-linecap="round"/>

    <!-- Beard -->
    <ellipse cx="200" cy="220" rx="60" ry="40" fill="#ffffff" />
    <ellipse cx="200" cy="240" rx="50" ry="30" fill="#f8f8f8" opacity="0.8" />
  `;
}

function generateLevelBadge(level, theme) {
  return `
    <circle cx="320" cy="80" r="42" fill="#1a202c" opacity="0.8"/>
    <circle cx="320" cy="78" r="38" fill="${theme.accent.join('')}" stroke="#ffffff" stroke-width="3" filter="url(#glow)" />
    <circle cx="315" cy="73" r="3" fill="#ffffff" opacity="0.6"/>
    <text x="320" y="85" text-anchor="middle" fill="#ffffff" font-family="Arial, sans-serif" font-size="28" font-weight="bold">${level}</text>
  `;
}

function generateMetadataOverlay(level, theme) {
  const rarity = level === 10 ? 'LEGENDARY' : level >= 8 ? 'EPIC' : level >= 6 ? 'RARE' : level >= 4 ? 'UNCOMMON' : 'COMMON';

  // Premium NFT descriptions for each level
  const nftDescriptions = {
    1: 'BASE CLASSIC SANTA NFT',
    2: 'BASE FLOATING GIFT NFT',
    3: 'BASE WORKSHOP NFT',
    4: 'BASE REINDEER NFT',
    5: 'BASE SLEIGH NFT',
    6: 'BASE CRYSTAL NFT',
    7: 'BASE ROYAL NFT',
    8: 'BASE AURORA NFT',
    9: 'BASE LEGENDARY NFT',
    10: 'BASE MYTHIC NFT'
  };

  const title = nftDescriptions[level] || `Santa Level ${level}`;

  return `
    <!-- Rarity Badge -->
    <rect x="20" y="20" width="80" height="25" fill="${theme.accent[0]}" rx="12" opacity="0.8"/>
    <text x="60" y="35" text-anchor="middle" fill="#ffffff" font-family="Arial, sans-serif" font-size="10" font-weight="bold">${rarity}</text>

    <!-- Title with shadow -->
    <text x="201" y="321" text-anchor="middle" fill="#000000" font-family="Arial, sans-serif" font-size="16" font-weight="bold" opacity="0.5">${title}</text>
    <text x="200" y="320" text-anchor="middle" fill="#ffffff" font-family="Arial, sans-serif" font-size="16" font-weight="bold">${title}</text>

    <text x="201" y="346" text-anchor="middle" fill="#000000" font-family="Arial, sans-serif" font-size="12" opacity="0.5">Premium 3D Animated NFT</text>
    <text x="200" y="345" text-anchor="middle" fill="#cccccc" font-family="Arial, sans-serif" font-size="12">Premium 3D Animated NFT</text>
  `;
}
