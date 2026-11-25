window.LESSONS = window.LESSONS || [];

/* ---------- Lesson 6 ---------- */
window.LESSONS.push({
  id: 'stock-market', num: 6, title: 'How the stock market works', minutes: 4,
  summary: 'The stock market is a giant marketplace where buyers and sellers agree on prices for tiny pieces of companies.',
  body: `
<h3>A marketplace, not a building</h3>
<p>When people say "the stock market," they mean all the places where shares of companies are bought and sold. It works a lot like a farmers market. Sellers show up with something to sell. Buyers show up with money. A sale happens when both sides agree on a price.</p>
<p>The main marketplaces are called <span class="term" data-def="An organized marketplace where shares are bought and sold under clear rules.">exchanges</span>. In the US, the two biggest are the New York Stock Exchange (NYSE) and the Nasdaq. Today almost all trading happens on computers, in fractions of a second.</p>
<p>Regular US trading hours are 9:30 a.m. to 4:00 p.m. Eastern Time, Monday to Friday, except market holidays.</p>

<h3>You need a broker to get in</h3>
<p>You cannot walk into an exchange and buy a share yourself. You go through a <span class="term" data-def="A company that places buy and sell orders on the exchange for you. Today this is usually an app or website.">broker</span>. A broker is the middleman. You open an account, add money, and tell the broker what you want to buy. The broker sends your order to the market.</p>
<p>Many popular brokers now charge $0 commission for buying and selling US stocks. That was not true 20 years ago, when each trade could cost $10 or more.</p>

<h3>Why prices move: supply and demand</h3>
<p>A stock price is simply the last price at which a buyer and a seller agreed to trade. Nobody sets it from above. If more people want to buy a stock than sell it, buyers have to offer more, and the price goes up. If more people want to sell, sellers have to accept less, and the price goes down.</p>
<div data-explainer="supply"></div>
<p>What makes people want to buy or sell? News about the company, its profits, the economy, interest rates, and plain human feelings like excitement and fear.</p>

<h3>Bid, ask, and the spread</h3>
<p>At any moment, a stock has two prices:</p>
<ul>
<li>The <span class="term" data-def="The highest price a buyer is currently willing to pay for a share.">bid</span>: the most any buyer is offering right now.</li>
<li>The <span class="term" data-def="The lowest price a seller is currently willing to accept for a share.">ask</span>: the least any seller will accept right now.</li>
</ul>
<p>The small gap between them is called the <span class="term" data-def="The difference between the bid price and the ask price.">spread</span>. For big, popular companies the spread is often just a penny or two. For small, rarely traded stocks it can be much wider.</p>
<div class="example"><b>Example:</b> A stock shows a bid of $50.00 and an ask of $50.10. If you want to buy right now, you pay about $50.10. If you want to sell right now, you get about $50.00. The spread is $0.10 per share.</div>

<h3>Market orders vs limit orders</h3>
<p>When you place an order, you choose what kind it is. The two most common types are:</p>
<ul>
<li><strong>Market order:</strong> "Buy (or sell) right now at the best price available." It almost always goes through fast. But you do not control the exact price.</li>
<li><strong>Limit order:</strong> "Buy only at this price or lower" (or "sell only at this price or higher"). You control the price. But if the stock never reaches your price, the order may never go through.</li>
</ul>
<div class="example"><b>Example:</b> A stock's ask is $50.10. You place a <strong>market order</strong> for 10 shares, and it fills at about $50.10 each, costing about $501. Your friend places a <strong>limit order</strong> to buy 10 shares at $49.50. If the price later dips to $49.50, your friend pays $495. If the price never drops that low, your friend buys nothing.</div>
<div class="callout">Many beginners use limit orders for stocks that trade less often, or when prices are jumping around quickly. It protects you from paying much more than you expected.</div>

<h3>Shares, fractions, and owners</h3>
<p>Some brokers let you buy <span class="term" data-def="A piece of one share, so you can invest a dollar amount like $25 instead of buying a whole share.">fractional shares</span>. If one share costs $400 and you only want to invest $40, you can own one tenth of a share. You still get one tenth of the gains, losses, and any dividends.</p>
<div class="callout warn">Prices can move a lot in a single day. A fast-moving stock can change several percent in minutes. That is normal market behavior, not a sign that something is broken.</div>

<h3>Putting it together</h3>
<ol>
<li>You open an account with a broker and add money.</li>
<li>You choose a stock and an order type.</li>
<li>The broker sends your order to an exchange.</li>
<li>A seller is matched with you, and you now own the shares.</li>
</ol>
<p>That is the whole loop. Everything else is details.</p>
`,
  takeaways: [
    "The stock market is a marketplace where buyers and sellers agree on prices for shares.",
    "You buy and sell through a broker, which sends your order to an exchange like the NYSE or Nasdaq.",
    "Prices move because of supply and demand: more buyers push prices up, more sellers push them down.",
    "A market order is fast but the price can vary; a limit order controls the price but may not go through."
  ],
  quiz: [
    { q: "What does a stock's price actually represent?",
      options: ["A price set each morning by the government", "The company's total value divided by its age", "The last price a buyer and seller agreed to trade at", "The price the company's CEO chooses"],
      answer: 2, why: "No one sets the price from above. It is just the most recent price a buyer and a seller agreed on." },
    { q: "A stock has a bid of $20.00 and an ask of $20.05. What is the spread?",
      options: ["$0.05", "$20.05", "$40.05", "$0.50"],
      answer: 0, why: "The spread is the ask minus the bid: $20.05 minus $20.00 equals $0.05." },
    { q: "You place a limit order to buy at $30, but the stock stays at $32 all day. What happens?",
      options: ["You buy at $32 anyway", "Your order does not go through", "You buy at $31 as a compromise", "The broker charges you a penalty"],
      answer: 1, why: "A limit order only fills at your price or better. If the price never drops to $30, nothing is bought." }
  ],
  videos: []
});

/* ---------- Lesson 7 ---------- */
window.LESSONS.push({
  id: 'index-funds', num: 7, title: 'Index funds, ETFs, and diversification', minutes: 5,
  summary: 'Instead of picking one company, you can buy a tiny slice of hundreds of companies at once.',
  body: `
<h3>The problem with picking one stock</h3>
<p>Imagine you put all your savings into one pizza shop. If that shop does great, you do great. If a new competitor opens next door, or the oven breaks, you could lose a lot. Your money depends on one business.</p>
<p>Stocks work the same way. Even huge, famous companies can stumble. Some well-known companies have gone bankrupt, and their shareholders lost nearly everything.</p>

<h3>Diversification: don't put all your eggs in one basket</h3>
<p><span class="term" data-def="Spreading your money across many different investments so that one bad one cannot sink you.">Diversification</span> means spreading your money across many investments. When you own many companies, one bad one hurts you only a little. The winners and losers tend to balance out.</p>
<div class="example"><b>Example:</b> You invest $1,000. In plan A, all $1,000 goes into one company. In plan B, you put $10 into each of 100 companies. Now say one company goes out of business. In plan A, you lose $1,000, which is 100%. In plan B, you lose $10, which is just 1% of your money.</div>
<div data-explainer="diversify"></div>
<p>Diversification does not remove all risk. If the whole market drops, a diversified portfolio drops too. But it removes the risk of one single company wiping you out.</p>

<h3>What is an index?</h3>
<p>An <span class="term" data-def="A list of companies that together represent part of the market, used to measure how that part is doing.">index</span> is a list of companies used to measure how a part of the market is doing. You have probably heard of these:</p>
<ul>
<li><strong>S&amp;P 500:</strong> about 500 of the largest US companies.</li>
<li><strong>Dow Jones Industrial Average:</strong> 30 large, well-known US companies.</li>
<li><strong>Nasdaq Composite:</strong> thousands of companies listed on the Nasdaq exchange, with many tech companies.</li>
</ul>
<p>When the news says "the market was up 1% today," it usually means one of these indexes went up 1%.</p>

<h3>Index funds: buy the whole list at once</h3>
<p>An <span class="term" data-def="A fund that automatically owns all the companies in an index, so its results match that index.">index fund</span> is a fund that simply buys every company in an index. When you buy one share of an S&amp;P 500 index fund, you own a tiny slice of about 500 large US companies in a single purchase.</p>
<p>Bigger companies make up a bigger part of the fund. This is called being weighted by <span class="term" data-def="The total value of a company's shares: share price times the number of shares.">market cap</span>. So a giant company affects the fund more than a smaller one.</p>
<div data-explainer="index"></div>
<p>Nobody in an index fund is trying to guess which stocks will win. The fund just follows the list. That is why it is called <span class="term" data-def="Investing that follows an index instead of trying to pick winners.">passive investing</span>.</p>

<h3>So what is an ETF?</h3>
<p>An <span class="term" data-def="Exchange-traded fund: a fund that trades on a stock exchange during the day, just like a single stock.">ETF</span> (exchange-traded fund) is a fund you buy and sell on an exchange, just like a stock. Many ETFs are index funds. For example, there are several popular ETFs that track the S&amp;P 500.</p>
<p>The main difference from a traditional <span class="term" data-def="A pool of money from many investors, managed as one investment. Traditional ones are bought once a day at the closing price.">mutual fund</span> is how you buy it. ETFs trade all day at changing prices. Traditional mutual funds are bought or sold once a day, at the price set after the market closes.</p>

<h3>Fees matter: the expense ratio</h3>
<p>Every fund charges a yearly fee called the <span class="term" data-def="The yearly fee a fund charges, shown as a percent of the money you have invested in it.">expense ratio</span>. Broad index funds are often very cheap, sometimes under 0.1% per year. Actively managed funds, where professionals pick stocks, often charge more.</p>
<div class="example"><b>Example:</b> You have $10,000 in a fund. With a 0.03% expense ratio, you pay $3 per year. With a 1% expense ratio, you pay $100 per year. That is over 30 times more, every year, and the gap grows as your money grows.</div>
<div class="callout">Research has repeatedly found that most actively managed funds do not beat their matching index over long periods, especially after fees. That is a big reason many investors choose low-cost index funds.</div>

<h3>The big picture</h3>
<p>Index funds give you instant diversification, low fees, and a simple plan. You will not beat the market with an index fund, but you will match it, minus a small fee. Historically, that has been a solid result for long-term investors.</p>
`,
  takeaways: [
    "Diversification means spreading money across many investments so one bad pick cannot sink you.",
    "An index, like the S&P 500, is a list of companies used to measure part of the market.",
    "An index fund owns everything in an index; an ETF is a fund that trades like a stock, and many ETFs are index funds.",
    "Low fees matter: a small difference in expense ratio adds up over many years."
  ],
  quiz: [
    { q: "You split $500 evenly across 50 companies, and one goes out of business. About how much do you lose?",
      options: ["$500", "$50", "$100", "$10"],
      answer: 3, why: "$500 split across 50 companies is $10 each. Losing one company costs you $10, or 2% of your money." },
    { q: "What does an S&P 500 index fund hold?",
      options: ["About 500 large US companies", "The 5 best stocks of the year", "Only technology companies", "Government savings bonds"],
      answer: 0, why: "It owns roughly 500 of the largest US companies, weighted by their market cap." },
    { q: "A fund has a 0.5% expense ratio and you have $2,000 in it. What is the yearly fee?",
      options: ["$1", "$5", "$10", "$100"],
      answer: 2, why: "0.5% of $2,000 is $2,000 times 0.005, which equals $10 per year." }
  ],
  videos: []
});

/* ---------- Lesson 8 ---------- */
window.LESSONS.push({
  id: 'risk-reward', num: 8, title: 'Risk vs reward, and why timing the market is hard', minutes: 5,
  summary: 'Higher possible returns come with bigger ups and downs, and guessing the perfect moment to buy or sell rarely works.',
  body: `
<h3>No free lunch</h3>
<p>In investing, <span class="term" data-def="The chance that an investment loses value or moves up and down a lot.">risk</span> and <span class="term" data-def="The gain you get from an investment, usually shown as a percent per year.">return</span> are tied together. Safer places for your money usually grow slowly. Investments that can grow faster usually swing up and down more along the way.</p>
<ul>
<li><strong>Savings account:</strong> very safe, insured up to limits, but usually low growth.</li>
<li><strong>Bonds:</strong> loans to governments or companies. Usually steadier than stocks, usually lower long-run returns.</li>
<li><strong>Stocks:</strong> bigger swings, but historically the highest long-run growth of the three.</li>
</ul>
<p>Historically, the S&amp;P 500 has returned roughly 10% per year on average over long periods, before inflation. But that is an average. Some years it rose over 25%. Some years it fell more than 30%. The past also does not guarantee the future.</p>

<h3>Ups and downs are normal</h3>
<p>The ups and downs have a name: <span class="term" data-def="How much and how fast prices move up and down.">volatility</span>. A drop of 10% or more from a recent high is called a <span class="term" data-def="A drop of about 10% or more from a recent high.">correction</span>. A drop of 20% or more is called a <span class="term" data-def="A drop of about 20% or more from a recent high, often lasting months.">bear market</span>. Both have happened many times, and the market has recovered from all of them so far, though some recoveries took years.</p>
<ul>
<li>In 2008, during the financial crisis, the S&amp;P 500 fell about 37% for the year.</li>
<li>In early 2020, as COVID-19 spread, it fell about 34% in roughly a month. It got back to its old high within about five months.</li>
</ul>

<h3>Losses hurt more than you think</h3>
<div class="example"><b>Example:</b> You have $10,000 and it falls 30%. Now you have $7,000. To get back to $10,000, you need to gain $3,000. But $3,000 is about 43% of $7,000. So a 30% drop needs a roughly 43% gain just to break even.</div>
<p>This is one reason diversification matters. It helps keep any single loss from getting too deep.</p>

<h3>Time is your friend</h3>
<p>Your <span class="term" data-def="How long you plan to keep your money invested before you need to use it.">time horizon</span> matters a lot. Over a single year, stocks are a coin flip with a tilt. Over decades, the tilt has historically mattered much more. Over long periods of 15 to 20 years or more, a broad US stock index has historically almost always ended higher than it started.</p>
<div class="callout">A common guideline: money you need within the next few years, like rent, tuition, or a house down payment, usually does not belong in stocks. Money you will not touch for many years has more time to recover from drops.</div>

<h3>Why timing the market is so hard</h3>
<p><span class="term" data-def="Trying to sell before prices fall and buy back before they rise.">Timing the market</span> means trying to sell right before a drop and buy back right before a rise. It sounds smart. In practice, you have to be right twice: when to get out and when to get back in.</p>
<p>The trouble is that the best days often come right after the worst days. Studies of the S&amp;P 500 have found that many of the biggest single-day gains happened within a couple of weeks of the biggest losses. If you sold in a panic, you likely missed the bounce.</p>
<div class="example"><b>Example:</b> Research by large investment firms looking at about 20 years of S&amp;P 500 history has found that missing just the 10 best days roughly cut the ending value in half, compared with staying invested the whole time. Ten days out of about 5,000 trading days made that much difference.</div>
<div class="callout warn">Nobody can reliably predict short-term moves, including professionals on TV. Headlines that sound certain are still guesses.</div>

<h3>A simpler approach many investors use</h3>
<p>Instead of timing, many long-term investors use <span class="term" data-def="Investing the same amount on a regular schedule, no matter what prices are doing.">dollar-cost averaging</span>. They invest the same amount on a regular schedule, like $100 every month.</p>
<div class="example"><b>Example:</b> You invest $100 each month. In month one, the fund costs $50, so you get 2 shares. In month two, it drops to $25, so you get 4 shares. You spent $200 and own 6 shares, for an average cost of about $33.33 per share, lower than the simple average of the two prices, $37.50.</div>
<p>When prices fall, your fixed amount buys more shares automatically. It takes emotion out of the decision.</p>
<p>Want to feel what a crash is like without risking real money? Try it yourself in the <a href="practice.html">Practice dashboard</a> and jump back to early 2020.</p>
`,
  takeaways: [
    "Higher potential returns usually come with bigger ups and downs.",
    "Drops are normal; the US market has recovered from every past crash so far, though sometimes slowly.",
    "A long time horizon gives your money more time to recover from bad years.",
    "Timing the market is very hard because the best days often come right after the worst days."
  ],
  quiz: [
    { q: "Your $1,000 investment drops 50% to $500. What gain do you need to get back to $1,000?",
      options: ["50%", "75%", "100%", "25%"],
      answer: 2, why: "You need to gain $500 on $500, which is a 100% gain. Losses take bigger gains to recover." },
    { q: "Why is timing the market so difficult?",
      options: ["Brokers forbid it", "You must guess both when to sell and when to buy back, and big up days often follow big down days", "Prices only change once a year", "It is only allowed for professionals"],
      answer: 1, why: "You have to be right twice, and selling in a panic often means missing the rebound days." },
    { q: "Which money is generally best suited for stocks?",
      options: ["Money you will not need for many years", "Next month's rent", "Your emergency fund", "A down payment you need next spring"],
      answer: 0, why: "Stocks can drop a lot in the short run. Long-term money has time to recover." }
  ],
  videos: []
});

/* ---------- Lesson 9 ---------- */
window.LESSONS.push({
  id: 'reading-a-stock', num: 9, title: 'Reading a stock page', minutes: 5,
  summary: 'A stock quote page is full of numbers, and each one answers a simple question about the company.',
  body: `
<h3>Don't panic at all the numbers</h3>
<p>Look up any company in a finance app and you will see a wall of numbers. It looks scary, but each number answers a simple question. Here is a sample quote card. We will walk through it piece by piece.</p>
<div data-widget="stock-card"></div>

<h3>Ticker symbol</h3>
<p>Every stock has a short code called a <span class="term" data-def="A short code of letters that identifies a stock, like AAPL for Apple.">ticker</span>. Apple is AAPL. Coca-Cola is KO. Walmart is WMT. You type the ticker to find the stock.</p>

<h3>Price and daily change</h3>
<p>The big number is the current share price. Next to it you will see how much it changed today, in dollars and as a percent. Green usually means up. Red usually means down.</p>
<div class="example"><b>Example:</b> A stock closed yesterday at $100 and is now $102. The change is +$2.00, or +2%, because $2 is 2% of $100.</div>
<div class="callout">The share price alone does not tell you if a company is big, small, cheap, or expensive. A $20 stock is not automatically a better deal than a $400 stock.</div>

<h3>Market cap: how big is the company?</h3>
<p><span class="term" data-def="Market capitalization: the total value of all a company's shares. Share price times number of shares.">Market cap</span> is the total value of all the company's shares. You get it by multiplying the share price by the number of shares that exist.</p>
<div class="example"><b>Example:</b> A company's shares cost $150, and there are 1 billion shares. Its market cap is $150 times 1 billion, which equals $150 billion. Another company's shares cost $15, but it has 20 billion shares. Its market cap is $300 billion, twice as big, even though its share price is much lower.</div>
<p>Roughly, companies worth over $10 billion are often called large-cap. Smaller companies tend to swing more in price.</p>

<h3>P/E ratio: how pricey is it compared to profits?</h3>
<p>Companies report their profit per share, called <span class="term" data-def="Earnings per share: the company's yearly profit divided by its number of shares.">EPS</span> (earnings per share). The <span class="term" data-def="Price-to-earnings ratio: share price divided by yearly earnings per share. Shows how many dollars you pay for each $1 of yearly profit.">P/E ratio</span> divides the share price by EPS. It tells you how many dollars you pay for each $1 of the company's yearly profit.</p>
<div class="example"><b>Example:</b> A stock costs $150 and earned $6 per share last year. Its P/E is $150 divided by $6, which equals 25. You are paying $25 for every $1 of yearly profit.</div>
<p>A high P/E often means investors expect fast growth in the future. A low P/E can mean the stock is a bargain, or that investors expect trouble. Compare P/E ratios between similar companies, not between a tech company and a grocery chain. If a company lost money, it may show no P/E at all.</p>

<h3>Dividends and dividend yield</h3>
<p>Some companies share part of their profits with shareholders as cash. This payment is a <span class="term" data-def="Cash a company pays to its shareholders, often every three months.">dividend</span>. In the US, many pay every three months. The <span class="term" data-def="The yearly dividend divided by the share price, shown as a percent.">dividend yield</span> shows the yearly dividend as a percent of the share price.</p>
<div class="example"><b>Example:</b> A stock costs $150 and pays $3 per share each year. The yield is $3 divided by $150, which is 2%. If you own 50 shares, you receive 50 times $3, which is $150 a year.</div>
<p>Not every company pays dividends. Many fast-growing companies keep their profits to reinvest in the business. A very high yield can be a warning sign: sometimes the yield looks high only because the price fell sharply.</p>

<h3>52-week range</h3>
<p>The <span class="term" data-def="The lowest and highest prices the stock traded at over the past year.">52-week range</span> shows the lowest and highest price over the past year. It gives you a feel for how much the stock moves.</p>
<div class="example"><b>Example:</b> The range is $120 to $180, and the price is $150. The stock is right in the middle. A stock near its 52-week low is not automatically cheap, and one near its high is not automatically expensive.</div>

<h3>Volume</h3>
<p><span class="term" data-def="The number of shares traded during a period, usually one day.">Volume</span> is how many shares changed hands today. Popular large companies often trade tens of millions of shares a day. Unusually high volume often means there is news, like an earnings report.</p>

<h3>Putting it together</h3>
<ul>
<li><strong>Price:</strong> what one share costs right now.</li>
<li><strong>Market cap:</strong> how big the whole company is.</li>
<li><strong>P/E:</strong> how pricey it is compared to its profits.</li>
<li><strong>Dividend yield:</strong> how much cash it pays you each year, as a percent.</li>
<li><strong>52-week range:</strong> how much it has moved over the past year.</li>
<li><strong>Volume:</strong> how busy trading is today.</li>
</ul>
<div class="callout warn">No single number tells you whether to buy. These are clues, not answers.</div>
`,
  takeaways: [
    "Market cap (price times shares) tells you how big a company is; share price alone does not.",
    "P/E ratio is price divided by earnings per share: what you pay for each $1 of yearly profit.",
    "Dividend yield is the yearly dividend divided by the price; not all companies pay dividends.",
    "The 52-week range and volume show how much a stock moves and how actively it trades."
  ],
  quiz: [
    { q: "A company's shares cost $40 and it has 500 million shares. What is its market cap?",
      options: ["$540 million", "$20 billion", "$2 billion", "$12.5 million"],
      answer: 1, why: "$40 times 500 million shares equals $20,000 million, which is $20 billion." },
    { q: "A stock costs $90 and its earnings per share are $3. What is its P/E ratio?",
      options: ["3", "27", "93", "30"],
      answer: 3, why: "P/E is price divided by EPS: $90 divided by $3 equals 30." },
    { q: "A $50 stock pays $1 per share in dividends each year. What is its dividend yield?",
      options: ["2%", "1%", "5%", "50%"],
      answer: 0, why: "Yield is the yearly dividend divided by the price: $1 divided by $50 equals 0.02, or 2%." }
  ],
  videos: []
});

/* ---------- Lesson 10 ---------- */
window.LESSONS.push({
  id: 'beginner-mistakes', num: 10, title: 'Common beginner mistakes', minutes: 4,
  summary: 'Most early investing losses come from a handful of avoidable habits, not from bad luck.',
  body: `
<h3>Everyone makes mistakes</h3>
<p>Even experienced investors make mistakes. The good news: most beginner mistakes are well known, so you can learn them in advance. Here are the big ones.</p>

<h3>1. Investing before you have a safety net</h3>
<p>If you invest money you might need soon, a surprise bill could force you to sell at a bad time. That is why many people build an <span class="term" data-def="Savings set aside for surprises like job loss or car repairs, often 3 to 6 months of expenses.">emergency fund</span> first, kept in a safe savings account.</p>

<h3>2. Investing while carrying high-interest debt</h3>
<p>Credit card interest is often above 20% per year. Stocks have historically averaged around 10% per year, and that is not guaranteed.</p>
<div class="example"><b>Example:</b> You owe $2,000 on a card with a 22% <span class="term" data-def="Annual percentage rate: the yearly interest rate charged on borrowed money.">APR</span>. That costs about $440 a year in interest. Paying it off is like earning a guaranteed 22%, which is very hard to beat by investing.</div>

<h3>3. Putting everything into one stock</h3>
<p>It is tempting to bet big on one exciting company. But single companies can drop sharply, or even fail. Spreading money across many companies, for example through an index fund, lowers that risk.</p>

<h3>4. Chasing hot tips and hype</h3>
<p>A stock that jumped 200% gets a lot of attention online. By the time you hear about it, much of the rise may already be over. Buying because everyone else is buying is often called <span class="term" data-def="Fear of missing out: buying something because you are afraid of being left behind, not because you understand it.">FOMO</span>.</p>
<div class="callout warn">Be very careful with tips from social media, group chats, or strangers promising big, fast returns. Some are scams designed to push the price up so the promoters can sell. If it sounds too good to be true, it usually is.</div>

<h3>5. Panic selling during a drop</h3>
<p>When prices fall, it feels safer to sell. But selling locks in the loss. Historically, the US market has recovered from every major drop so far, though some took years. People who sold at the bottom of 2020 missed one of the fastest recoveries in history.</p>

<h3>6. Trading too often</h3>
<p>Buying and selling constantly feels productive. But it usually means more mistakes, more emotional decisions, and possibly more taxes. In the US, profits on investments held one year or less are usually taxed at a higher rate than profits on investments held longer.</p>

<h3>7. Ignoring fees</h3>
<p>Small fees add up over many years.</p>
<div class="example"><b>Example:</b> You have $50,000 invested. A fund with a 1% yearly fee costs you $500 a year. A fund with a 0.05% fee costs you $25 a year. That is a $475 difference every single year, before counting the growth that money could have earned.</div>

<h3>8. Buying what you don't understand</h3>
<p>If you cannot explain in one or two sentences what you bought and how it makes money, slow down. This is especially true for complex products like <span class="term" data-def="Contracts that let you bet on a stock's price moving by a certain date. Easy to lose all the money you put in.">options</span> or funds that use borrowed money to boost returns.</p>

<h3>9. Checking your account every hour</h3>
<p>Prices wiggle every day. Watching every move makes you anxious and more likely to act on emotion. Many long-term investors check only occasionally and stick to a plan.</p>

<h3>10. Waiting forever to start</h3>
<p>Waiting for the "perfect moment" can cost you years of growth. Thanks to compound interest, time in the market often matters more than the exact day you start. Starting small is still starting.</p>

<h3>A simple checklist</h3>
<ol>
<li>Build an emergency fund.</li>
<li>Pay off high-interest debt.</li>
<li>Invest money you will not need for years.</li>
<li>Diversify and keep fees low.</li>
<li>Make a plan, and do not let headlines push you around.</li>
</ol>
<div class="callout">The best way to learn how you react to a crash is to practice with fake money first. Try it yourself in the <a href="practice.html">Practice dashboard</a>: jump into the past, make decisions, and see what really happened next.</div>
`,
  takeaways: [
    "Build an emergency fund and pay off high-interest debt before investing.",
    "Avoid putting everything into one stock or chasing hype and hot tips.",
    "Panic selling and constant trading often turn temporary drops into permanent losses.",
    "Keep fees low, understand what you buy, and start early, even with small amounts."
  ],
  quiz: [
    { q: "You owe $1,000 on a credit card at 24% APR. About how much interest is that per year?",
      options: ["$24", "$124", "$2,400", "$240"],
      answer: 3, why: "24% of $1,000 is $240 per year, a cost that is very hard to beat by investing." },
    { q: "The market drops 25% in a month. What does selling everything right away do?",
      options: ["Locks in the loss and risks missing the recovery", "Guarantees you will make money", "Cancels the loss", "Has no effect at all"],
      answer: 0, why: "Selling turns a paper loss into a real one, and big rebound days often come soon after big drops." },
    { q: "A stranger online says a stock will 'definitely triple this week.' What is the wisest reaction?",
      options: ["Invest your emergency fund", "Borrow money to buy more", "Be very skeptical; it may be hype or a scam", "Buy right away before others do"],
      answer: 2, why: "No one can guarantee returns. Promises of fast, certain gains are a classic sign of hype or fraud." }
  ],
  videos: []
});
