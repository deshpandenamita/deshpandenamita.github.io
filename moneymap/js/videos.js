// MoneyMap narrated videos (made with videos/build/render.py) + "Watch more" links per lesson.
window.VIDEO_LIBRARY = [
  { slug: 'compound-interest', title: 'Compound interest: money that grows on its own', lesson: 'compound-interest', tone: 'sun',
    blurb: 'Watch $1,000 grow for 30 years, see why starting early beats investing more later, and how debt compounds too.' },
  { slug: 'stock-prices', title: 'Why do stock prices move?', lesson: 'stock-market', tone: 'pink',
    blurb: 'Buyers vs sellers, good news vs bad news: the tug-of-war behind every price.' },
  { slug: 'diversification', title: "Diversification: don't put all your eggs in one basket", lesson: 'index-funds', tone: 'mint',
    blurb: 'Twenty companies, one year, wildly different results. See why spreading out lowers your risk.' },
  { slug: 'index-funds', title: 'How an index fund works', lesson: 'index-funds', tone: 'purple',
    blurb: 'Own a tiny piece of about 500 companies with one share, and keep fees low.' }
];

// Paste extra YouTube links (or local .mp4 paths) into any lesson's list.
window.LESSON_VIDEOS = {
  'budgeting': [],
  'emergency-fund': [],
  'debt-credit': [],
  'compound-interest': ['videos/compound-interest.mp4'],
  'what-is-a-stock': [],
  'stock-market': ['videos/stock-prices.mp4'],
  'index-funds': ['videos/diversification.mp4', 'videos/index-funds.mp4'],
  'risk-reward': ['videos/diversification.mp4'],
  'reading-a-stock': [],
  'beginner-mistakes': []
};
