// Real news moments for Time Machine mode. Summaries are simplified for learning.
// "What happened next" numbers are calculated live from the real price data, not typed in.
window.NEWS_EVENTS = [
  {
    date: '2020-02-24', ticker: 'SPY', kicker: 'Market-wide · Feb 2020',
    headline: 'Virus fears: stocks have their worst week since 2008',
    body: 'A new coronavirus (COVID-19) is spreading outside China. Factories are closing and travel is being cancelled. In just six trading days the S&P 500 fell more than 10% from its record high, the fastest drop of that size ever recorded.',
    ask: 'Your index fund (SPY) just dropped sharply. What would you do?',
    why: 'Nobody knew how bad the pandemic would get, and prices fell further for another few weeks. Fear spreads fast in markets. Prices often fall before the full facts are known.',
    longTerm: 'Long-term investors usually do not try to guess the bottom. Selling after a big drop locks in the loss. Many people who held, or kept buying a little each month, recovered within months.'
  },
  {
    date: '2020-03-16', ticker: 'SPY', kicker: 'Market-wide · Mar 2020',
    headline: 'Panic: the Federal Reserve cuts interest rates to near zero',
    body: 'Over the weekend, the Federal Reserve (the US central bank) made an emergency cut to interest rates, to almost 0%. On Monday, March 16, the stock market still fell about 12% in one day. Schools, offices, and stores are shutting down across the country.',
    ask: 'Headlines say "crash". The market is down about 30% from February. What would you do?',
    why: 'The S&P 500 hit its lowest point one week later, on March 23, 2020. Then it climbed back as the government and the Fed poured money into the economy. It was back to its old high by August 2020.',
    longTerm: 'The scariest moments are often near the bottom, but nobody can know it at the time. That is why many investors pick a plan (like investing the same amount every month) and stick to it in good and bad weeks.'
  },
  {
    date: '2020-04-20', ticker: 'NFLX', kicker: 'Netflix · Apr 2020',
    headline: 'Stuck at home, the world signs up for Netflix',
    body: 'With people staying home, Netflix reported about 15.8 million new paid subscribers in the first three months of 2020, more than double what it had expected.',
    ask: 'Netflix is booming while most companies struggle. What would you do with NFLX?',
    why: 'Investors had already pushed the price up before the report, because many guessed lockdowns would help Netflix. Good news that everyone expects is often already "priced in".',
    longTerm: 'A boom caused by a one-time event (lockdowns) may not last. Long-term investors ask: will this company still be growing in 5 years, once things are back to normal?'
  },
  {
    date: '2020-08-31', ticker: 'TSLA', kicker: 'Tesla · Aug 2020',
    headline: 'Tesla splits its stock 5-for-1 (and Apple splits 4-for-1)',
    body: 'Each Tesla share became 5 shares, each worth one-fifth of the price. Apple did a 4-for-1 split the same day. Many new investors bought in, because the lower price per share "felt" cheaper.',
    ask: 'A split does not change what the company is worth. What would you do with TSLA?',
    why: 'A split is like cutting a pizza into more slices: you have more pieces, but the same amount of pizza. (Our charts adjust old prices for splits, so the line does not jump.) Tesla still rose a lot in late 2020, mostly from strong car sales and excitement, not from the split itself.',
    longTerm: 'Judge a company by its business and its total value (market cap), not by the price of one share. A $50 share is not automatically cheaper than a $500 share.'
  },
  {
    date: '2020-11-09', ticker: 'DIS', kicker: 'Disney · Nov 2020',
    headline: 'Vaccine breakthrough: Pfizer says its shot works',
    body: 'Pfizer and BioNTech announced their COVID-19 vaccine was more than 90% effective in trials. Stocks of companies hurt by lockdowns, like airlines, cinemas, and theme parks, jumped on the news. Disney\'s parks had been closed or limited for months.',
    ask: 'Disney could reopen fully one day. What would you do with DIS?',
    why: 'Disney rose for a few months as investors looked forward to reopening, and its new Disney+ streaming service was growing fast. Later, the stock fell a lot as streaming costs grew and growth slowed.',
    longTerm: 'Markets look ahead. Prices often move when news arrives, long before the business results actually change. One good headline is not a full investment case.'
  },
  {
    date: '2021-02-01', ticker: 'AMZN', kicker: 'Amazon · Feb 2021',
    headline: 'Jeff Bezos will step down as Amazon CEO',
    body: 'Amazon\'s founder announced he would hand the CEO job to Andy Jassy, who led Amazon Web Services (its cloud computing business). Amazon also reported record holiday sales.',
    ask: 'The famous founder is stepping back. What would you do with AMZN?',
    why: 'The stock barely moved on the news. Investors cared more about Amazon\'s sales and profits than about who was CEO. Later in 2021 and 2022, Amazon fell as online shopping slowed after the pandemic boom.',
    longTerm: 'Leadership changes matter, but the business (what it sells, how much profit it makes) matters more. Do not buy or sell only because of one person.'
  },
  {
    date: '2022-04-18', ticker: 'NFLX', kicker: 'Netflix · Apr 2022',
    headline: 'Netflix loses subscribers for the first time in over 10 years',
    body: 'Netflix said it lost about 200,000 subscribers in three months and expected to lose more. Competition from Disney+, HBO Max, and others was growing. The stock fell about 35% in a single day.',
    ask: 'NFLX is down about 70% from its high. Bargain or trap?',
    why: 'Netflix responded with a cheaper plan with ads and a crackdown on password sharing. Subscriber growth came back, and the stock recovered strongly over the next two years.',
    longTerm: 'A big drop can be an overreaction, or the start of a real decline. Nobody knows which at the time. Buying one company after a crash is a bet. Spreading money across many companies reduces the damage if you guess wrong.'
  },
  {
    date: '2022-06-13', ticker: 'SPY', kicker: 'Market-wide · Jun 2022',
    headline: 'Inflation hits 8.6%. The S&P 500 enters a "bear market"',
    body: 'Prices for food, gas, and rent are rising at the fastest pace in about 40 years. To fight this, the Federal Reserve is raising interest rates quickly. The S&P 500 is now down more than 20% from its January high, the official definition of a bear market.',
    ask: 'The news is gloomy and could get worse. What would you do with SPY?',
    why: 'The market kept bouncing up and down and hit its 2022 low in October. As inflation started to cool in 2023, stocks recovered. The S&P 500 reached new record highs in early 2024.',
    longTerm: 'Bear markets have happened many times, and the market has recovered from every one in the past, though some took years. Investors who need their money soon should not keep it all in stocks.'
  },
  {
    date: '2023-01-23', ticker: 'MSFT', kicker: 'Microsoft · Jan 2023',
    headline: 'Microsoft makes a multibillion-dollar bet on OpenAI',
    body: 'ChatGPT launched in late November 2022 and became one of the fastest-growing apps ever. Now Microsoft, already an investor in OpenAI (the company behind it), announced a new multiyear, multibillion-dollar investment and plans to put AI into its products.',
    ask: 'AI is the new hot topic. What would you do with MSFT?',
    why: 'Investors started seeing AI as a major new business for Microsoft, especially through its cloud service, Azure. The stock rose a lot during 2023.',
    longTerm: 'Big new technologies can create huge winners, but also hype. Microsoft was already a large, profitable company, so it did not depend on AI alone. That is very different from betting on a tiny company with only a story.'
  },
  {
    date: '2023-03-13', ticker: 'SPY', kicker: 'Market-wide · Mar 2023',
    headline: 'Silicon Valley Bank collapses',
    body: 'Silicon Valley Bank, a major bank for tech startups, failed after customers rushed to withdraw their money. It was the second-largest bank failure in US history at the time. People worried other banks could be next.',
    ask: 'Fear of a banking crisis is spreading. What would you do with SPY?',
    why: 'The government stepped in to protect all of SVB\'s depositors, and the panic calmed down. A few other banks failed, but the wider market kept rising through 2023.',
    longTerm: 'Scary headlines come every year. An index fund owns hundreds of companies across many industries, so trouble in one area (like some banks) rarely sinks the whole thing.'
  },
  {
    date: '2023-05-22', ticker: 'NVDA', kicker: 'Nvidia · May 2023',
    headline: 'AI chip demand explodes: Nvidia stock jumps about 24% in a day',
    body: 'Nvidia makes the chips (GPUs) used to train AI systems like ChatGPT. It told investors it expected about $11 billion in sales next quarter, far more than experts expected. Its value moved close to $1 trillion.',
    ask: 'NVDA just jumped. Is it too late to buy? What would you do?',
    why: 'Demand for AI chips kept growing much faster than almost anyone predicted, and Nvidia\'s profits soared. The stock kept climbing over the following year.',
    longTerm: 'Sometimes a stock that "already went up" keeps going up, because the business keeps beating expectations. But for every Nvidia, there are many hyped stocks that crash. That is why most investors keep any single stock to a small part of their money.'
  },
  {
    date: '2024-06-24', ticker: 'NKE', kicker: 'Nike · Jun 2024',
    headline: 'Nike cuts its sales forecast. The stock falls about 20%',
    body: 'Nike warned that sales would drop in the coming year. Shoppers were buying fewer sneakers, and newer brands were winning customers. It was one of Nike\'s worst single-day drops ever.',
    ask: 'A famous brand is struggling. What would you do with NKE?',
    why: 'Nike replaced its CEO later in 2024, but its turnaround took time. Its stock stayed well below its earlier highs while it worked on its problems.',
    longTerm: 'A brand you love is not always a great investment. Investors look at whether sales and profits are growing. A "cheap-looking" price after a fall can stay cheap for a long time.'
  },
  {
    date: '2025-01-27', ticker: 'NVDA', kicker: 'Nvidia · Jan 2025',
    headline: 'DeepSeek shock: Nvidia loses about $590 billion in one day',
    body: 'A Chinese startup, DeepSeek, said it built a powerful AI model using far fewer expensive chips. Investors worried that companies might need fewer Nvidia chips. Nvidia fell about 17% on January 27, the largest one-day loss in market value for any US company ever.',
    ask: 'NVDA just had a record drop. What would you do?',
    why: 'Big tech companies kept spending heavily on AI chips, and Nvidia\'s stock recovered in the following months, though with big swings along the way.',
    longTerm: 'Even giant, profitable companies can drop 17% in a day. If one stock is a huge part of your money, a day like this hurts a lot. Diversification is what lets you sleep at night.'
  },
  {
    date: '2025-03-31', ticker: 'SPY', kicker: 'Market-wide · Apr 2025',
    headline: 'New tariffs shock markets: the S&P 500 falls about 10% in two days',
    body: 'On April 2, the US announced large new tariffs (taxes on imported goods) on many countries. Investors feared higher prices and a slowing economy. The S&P 500 fell about 10% over the next two trading days.',
    ask: 'Markets are in freefall again. What would you do with SPY?',
    why: 'On April 9, many of the tariffs were paused, and the S&P 500 jumped about 9.5% in one day, one of its best days ever. Investors who sold in panic missed that rebound.',
    longTerm: 'The best days often come right after the worst days. Missing just a handful of the best days can greatly reduce long-term returns. That is a big reason why "timing the market" is so hard.'
  }
];
