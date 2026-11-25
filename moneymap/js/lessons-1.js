window.LESSONS = window.LESSONS || [];

window.LESSONS.push({
  id: 'budgeting', num: 1, title: 'Budgeting basics', minutes: 4,
  summary: 'A budget is just a plan that tells your money where to go before it disappears.',
  body: `
<h3>What is a budget?</h3>
<p>A <span class="term" data-def="A plan for how you will spend and save the money you earn each month.">budget</span> is a simple plan for your money. It answers one question: <strong>where should my money go this month?</strong></p>
<p>Without a plan, money tends to leak away. A coffee here, a delivery fee there. At the end of the month you wonder where it all went. A budget does not mean you can never have fun. It means you decide ahead of time, instead of finding out later.</p>

<h3>Start with what you actually take home</h3>
<p>Your budget starts with your <span class="term" data-def="The money that actually lands in your bank account after taxes and other deductions are taken out of your paycheck.">take-home pay</span>. This is the money that lands in your bank account after taxes. If your job pays $45,000 a year, you will not have $45,000 to spend. Taxes, health insurance, and retirement contributions come out first.</p>
<div class="example"><b>Example:</b> Meet Maya. She is 24 and works as a junior designer. After taxes, about <strong>$3,000</strong> lands in her account every month. That $3,000 is the number she plans around, not her salary.</div>

<h3>Needs vs wants</h3>
<p>Every expense falls into one of two buckets:</p>
<ul>
  <li><strong>Needs</strong> are things you must pay to live and work. Rent, groceries, utilities, basic transportation, insurance, and minimum debt payments.</li>
  <li><strong>Wants</strong> are things that make life nicer but are optional. Eating out, streaming services, new clothes you do not need, concerts, and travel.</li>
</ul>
<p>Some things are both. Food is a need. A $14 lunch delivered to your desk is mostly a want. A phone is a need. The newest model is a want. Be honest with yourself here. That honesty is where budgeting gets its power.</p>

<h3>The 50/30/20 rule</h3>
<p>If you have never budgeted before, a common rule of thumb is the <span class="term" data-def="A simple budgeting guideline: about 50% of take-home pay for needs, 30% for wants, and 20% for savings and extra debt payments.">50/30/20 rule</span>. It splits your take-home pay three ways:</p>
<ul>
  <li><strong>50% for needs</strong></li>
  <li><strong>30% for wants</strong></li>
  <li><strong>20% for savings and paying off debt faster</strong></li>
</ul>
<div class="example"><b>Example:</b> Maya takes home $3,000. Using 50/30/20:<br>
Needs: 50% of $3,000 = <strong>$1,500</strong>. Her rent is $1,100, groceries $250, phone $50, and bus pass $90. That adds up to $1,490, so she fits.<br>
Wants: 30% of $3,000 = <strong>$900</strong> for eating out, hobbies, and fun.<br>
Savings: 20% of $3,000 = <strong>$600</strong> goes to savings every month.</div>
<p>Try it with your own numbers below. Move the slider and see how the split changes.</p>
<div data-widget="budget-503020"></div>
<div class="callout">The 50/30/20 split is a starting point, not a law. In an expensive city, needs might take 60%. That is okay. Adjust the numbers, but keep some amount going to savings every month, even if it is small.</div>

<h3>How to actually make a budget</h3>
<ol>
  <li><strong>Find your take-home pay.</strong> Look at what actually arrives in your bank account each month.</li>
  <li><strong>Look back at last month.</strong> Check your bank and card statements. Write down where the money went.</li>
  <li><strong>Sort each expense</strong> into needs, wants, or savings.</li>
  <li><strong>Compare to your plan.</strong> Are wants eating into your savings? Pick one or two areas to trim.</li>
  <li><strong>Check in once a month.</strong> A budget is a living plan. Update it when your life changes.</li>
</ol>

<h3>Pay yourself first</h3>
<p>Here is a trick many people use. On payday, move your savings amount out <strong>first</strong>, before you spend anything. Many banks let you set up an <span class="term" data-def="A transfer your bank does for you on a schedule, such as every payday, so you do not have to remember.">automatic transfer</span> so it happens on its own. If the money is never sitting in your checking account, you will not miss it.</p>
<div class="callout warn">The most common budgeting mistake is saving whatever is "left over" at the end of the month. For most people, nothing is left over. Save first, then spend what remains.</div>
`,
  takeaways: [
    'A budget is a plan that tells your money where to go before you spend it.',
    'Plan around your take-home pay, not your salary.',
    'Needs are must-haves; wants are nice-to-haves. Be honest about which is which.',
    'The 50/30/20 rule is an easy starting point: 50% needs, 30% wants, 20% savings.',
    'Pay yourself first by moving savings out automatically on payday.'
  ],
  quiz: [
    { q: 'Maya takes home $3,000 a month. Under the 50/30/20 rule, how much goes to savings?', options: ['$300', '$900', '$600', '$1,500'], answer: 2, why: '20% of $3,000 is $600. The $900 is the 30% for wants, and $1,500 is the 50% for needs.' },
    { q: 'Which of these is usually a "want" rather than a "need"?', options: ['Rent', 'A streaming subscription', 'Groceries', 'A minimum loan payment'], answer: 1, why: 'Streaming is nice but optional. Rent, groceries, and required debt payments are needs.' },
    { q: 'What does "pay yourself first" mean?', options: ['Move money to savings as soon as you get paid', 'Buy something fun on payday', 'Pay your rent before anything else', 'Ask for a raise'], answer: 0, why: 'Saving first, before spending, means savings actually happen instead of depending on leftovers.' }
  ],
  videos: []
});

window.LESSONS.push({
  id: 'emergency-fund', num: 2, title: 'Emergency funds and saving', minutes: 4,
  summary: 'An emergency fund is a cash cushion that keeps a surprise bill from turning into debt.',
  body: `
<h3>Life will surprise you</h3>
<p>Your car breaks down. Your phone screen cracks. You lose your job. A pet gets sick. These things are not "if" events. Over a lifetime, they are "when" events.</p>
<p>An <span class="term" data-def="Money set aside only for unexpected, necessary expenses like car repairs, medical bills, or losing your job.">emergency fund</span> is money you keep aside just for these moments. It is not for vacations or sales. It is your financial shock absorber.</p>

<h3>Why it matters so much</h3>
<p>Without an emergency fund, a surprise bill usually goes on a credit card. Credit cards often charge 20% or more in interest per year. A $1,200 car repair can quietly grow into a much bigger problem. With an emergency fund, that same repair is just an annoying day, not a crisis.</p>
<div class="example"><b>Example:</b> Maya's car needs $900 in brake repairs. Her friend Jordan has the same repair. Maya pays from her emergency fund and refills it over three months. Jordan has no savings, so it goes on a card charging 24% a year. If Jordan only pays a little each month, that $900 repair can end up costing well over $1,000.</div>

<h3>How much should you save?</h3>
<p>A common rule of thumb is <strong>3 to 6 months of essential expenses</strong>. Essential means your needs: rent, food, utilities, transportation, insurance, and minimum debt payments. You do not need to cover wants, because in a real emergency you would cut those.</p>
<div class="example"><b>Example:</b> Maya's needs cost about $1,500 a month. Three months is $1,500 x 3 = <strong>$4,500</strong>. Six months is $1,500 x 6 = <strong>$9,000</strong>. She aims for $4,500 first.</div>
<p>When should you aim higher? If your income changes a lot month to month, if you are self-employed, or if you support other people, many people aim for six months or more.</p>
<div class="callout">That number can feel huge. Start smaller. A first goal of <strong>$1,000</strong> handles many common surprises. Then build toward one month, then three.</div>

<h3>Where to keep it</h3>
<p>Your emergency fund should be <strong>safe</strong> and <strong>easy to reach</strong>, but not so easy that you spend it by accident.</p>
<ul>
  <li><strong>A high-yield savings account</strong> is a popular choice. A <span class="term" data-def="A savings account, often at an online bank, that pays much more interest than a typical savings account.">high-yield savings account</span> pays more interest than a regular one, and you can usually move money out in a day or two.</li>
  <li><strong>Keep it separate</strong> from your everyday checking account so it does not blend in with spending money.</li>
  <li><strong>Do not put it in the stock market.</strong> Stocks can drop 30% right when you need the money. Emergency money needs to be there on a bad day.</li>
</ul>
<p>Look for a bank that is <span class="term" data-def="Federal Deposit Insurance Corporation. A US government agency that protects your bank deposits if the bank fails.">FDIC</span>-insured. If the bank fails, the government protects deposits up to $250,000 per person, per bank, per account ownership type.</p>
<p>You will often see interest shown as <span class="term" data-def="Annual Percentage Yield. How much your money earns in one year, including the effect of interest earning more interest.">APY</span>. If an account pays 4% APY, $4,500 would earn about $180 over a year. Rates change over time, so compare a few banks.</p>

<h3>How to build it</h3>
<ol>
  <li><strong>Pick a target.</strong> Start with $1,000, then 3 months of needs.</li>
  <li><strong>Automate it.</strong> Set a transfer for every payday, even if it is only $25.</li>
  <li><strong>Add windfalls.</strong> Tax refunds, bonuses, and gifts can speed things up.</li>
  <li><strong>Refill after you use it.</strong> Using it is the whole point. Then rebuild.</li>
</ol>
<div class="example"><b>Example:</b> Maya saves $300 a month toward her emergency fund. To reach $4,500, it takes $4,500 / $300 = <strong>15 months</strong>. When she gets a $600 tax refund and adds it, she gets there two months sooner.</div>

<h3>Other savings goals</h3>
<p>Once your emergency fund is in place, you can save for other goals: a trip, a new laptop, a home down payment. Many people give each goal its own savings account or "bucket," so they can see progress and never borrow from the emergency fund by mistake.</p>
<div class="callout warn">A sale is not an emergency. Neither is a concert. Ask yourself: is this unexpected, necessary, and urgent? If not all three, it probably comes from your "wants" budget instead.</div>
`,
  takeaways: [
    'An emergency fund covers surprise, necessary costs so you do not need high-interest debt.',
    'A common target is 3 to 6 months of essential expenses. Start with $1,000.',
    'Keep it in a safe, separate, FDIC-insured account, often a high-yield savings account.',
    'Do not keep emergency money in stocks; it may drop just when you need it.',
    'Automate small deposits and refill the fund after you use it.'
  ],
  quiz: [
    { q: 'Maya\'s essential expenses are $1,500 a month. What is a 3-month emergency fund for her?', options: ['$1,500', '$3,000', '$9,000', '$4,500'], answer: 3, why: '$1,500 x 3 = $4,500. $9,000 would be a 6-month fund.' },
    { q: 'Where is the usual best place to keep an emergency fund?', options: ['A separate high-yield savings account', 'Individual stocks', 'Cash under your mattress', 'Your everyday checking account mixed with spending money'], answer: 0, why: 'It needs to be safe, easy to reach, and separate. Stocks can fall, and cash at home is not protected and earns nothing.' },
    { q: 'Which is a true emergency?', options: ['A big sale on shoes', 'Concert tickets going on sale', 'Your car needs repairs to get to work', 'A friend\'s birthday trip'], answer: 2, why: 'A car repair you need to get to work is unexpected, necessary, and urgent. The others are wants.' }
  ],
  videos: []
});

window.LESSONS.push({
  id: 'debt-credit', num: 3, title: 'Debt and credit scores', minutes: 5,
  summary: 'Borrowing is a tool: used carefully it helps you, used carelessly the interest works against you.',
  body: `
<h3>What is debt?</h3>
<p><span class="term" data-def="Money you have borrowed and must pay back, usually with extra charges called interest.">Debt</span> is money you borrow and promise to pay back. The lender does not do this for free. They charge <span class="term" data-def="The cost of borrowing money, usually shown as a percentage of the amount you owe per year.">interest</span>, which is the price of borrowing.</p>
<p>The amount you borrow is called the <span class="term" data-def="The original amount of money you borrowed, not counting interest.">principal</span>. You pay back the principal plus interest.</p>

<h3>Good debt vs bad debt</h3>
<p>Not all debt is the same. A simple way to think about it:</p>
<ul>
  <li><strong>Often "good" debt</strong> helps you build something that may grow in value or raise your income, at a reasonable interest rate. Examples: a mortgage on a home you can afford, or a student loan for a degree that leads to a better-paying job.</li>
  <li><strong>Often "bad" debt</strong> pays for things that lose value quickly, usually at a high interest rate. Example: carrying a credit card balance for clothes, dinners, or gadgets.</li>
</ul>
<div class="callout">Even "good" debt can become a problem if it is too large for your income. The question is always: can I comfortably make these payments, and is what I am getting worth the total cost?</div>

<h3>How interest works: APR</h3>
<p>Loans and credit cards show their cost as an <span class="term" data-def="Annual Percentage Rate. The yearly cost of borrowing, shown as a percentage. Higher APR means more expensive debt.">APR</span>. Credit cards commonly charge around 20% or more. Credit cards usually charge interest monthly, so you can divide the APR by 12 to get a rough monthly rate.</p>
<div class="example"><b>Example:</b> Maya has $2,000 on a credit card with a 24% APR. 24% / 12 = about <strong>2% per month</strong>. 2% of $2,000 = <strong>$40</strong> in interest in the first month alone. That $40 buys her nothing.</div>

<h3>The minimum payment trap</h3>
<p>Every credit card bill shows a <span class="term" data-def="The smallest amount the card company lets you pay each month without a late fee. Paying only this keeps you in debt much longer.">minimum payment</span>. It looks friendly. It is designed to keep you paying interest for a long time.</p>
<div class="example"><b>Example:</b> Say Maya pays a flat $50 a month on that $2,000 balance at 24% APR and stops using the card. Most of each payment goes to interest at first. It would take her about <strong>82 months</strong>, nearly 7 years, to pay it off. She would pay roughly <strong>$2,000 in interest</strong>, about as much as she borrowed.<br><br>
If she pays $200 a month instead, she is done in about <strong>12 months</strong> and pays only about <strong>$250</strong> in interest.</div>
<div class="callout warn">If you use a credit card, the simplest habit is to <strong>pay the full statement balance every month</strong>. Then you usually pay no interest at all, and the card is just a convenient way to pay.</div>

<h3>What is a credit score?</h3>
<p>A <span class="term" data-def="A three-digit number that estimates how likely you are to pay back borrowed money on time.">credit score</span> is a number lenders use to judge how risky it is to lend to you. The most common one, the <span class="term" data-def="The most widely used credit score in the US, created by the company Fair Isaac Corporation.">FICO score</span>, runs from <strong>300 to 850</strong>. Higher is better.</p>
<p>Your score affects whether you get approved for loans, apartments, and sometimes even phone plans. It also affects the interest rate you are offered. A better score can save you thousands of dollars on a car loan or mortgage.</p>

<h3>What goes into your score</h3>
<ul>
  <li><strong>Payment history (35%)</strong>: Do you pay on time? This is the biggest factor.</li>
  <li><strong>Amounts owed (30%)</strong>: How much of your available credit you use. This is called <span class="term" data-def="The share of your credit limit you are using. A $300 balance on a $1,000 limit is 30% utilization.">credit utilization</span>. Many people try to keep it under 30%.</li>
  <li><strong>Length of credit history (15%)</strong>: How long you have had credit accounts.</li>
  <li><strong>New credit (10%)</strong>: Opening many new accounts quickly can lower your score for a while.</li>
  <li><strong>Credit mix (10%)</strong>: Having different kinds of credit, like a card and a loan.</li>
</ul>
<div class="example"><b>Example:</b> Maya has a card with a $5,000 limit. If her balance is $1,500, her utilization is $1,500 / $5,000 = <strong>30%</strong>. If she pays it down to $500, it drops to 10%, which usually helps her score.</div>

<h3>Simple habits that build good credit</h3>
<ol>
  <li>Pay every bill on time. Set up autopay for at least the minimum, so you never miss one.</li>
  <li>Pay credit cards in full when you can.</li>
  <li>Keep balances low compared to your limits.</li>
  <li>Keep older accounts open if they have no annual fee.</li>
  <li>Check your credit reports for mistakes. In the US you can get free reports at AnnualCreditReport.com.</li>
</ol>
`,
  takeaways: [
    'Debt is borrowed money you repay with interest, the price of borrowing.',
    'High-interest debt for things that lose value, like credit card balances, is the most harmful kind.',
    'Paying only the minimum can stretch a small balance into years of interest.',
    'FICO scores run 300 to 850; on-time payments and low balances matter most.',
    'Paying cards in full every month usually means paying no interest at all.'
  ],
  quiz: [
    { q: 'A card has a 24% APR. Roughly what is the monthly interest rate?', options: ['24%', '12%', '2%', '0.24%'], answer: 2, why: '24% per year divided by 12 months is about 2% per month.' },
    { q: 'Which factor has the biggest impact on a FICO score?', options: ['Credit mix', 'Payment history', 'New credit', 'Your income'], answer: 1, why: 'Payment history is about 35% of a FICO score. Income is not part of the score at all.' },
    { q: 'Your card limit is $2,000 and your balance is $1,000. What is your credit utilization?', options: ['10%', '20%', '100%', '50%'], answer: 3, why: '$1,000 / $2,000 = 50%. Many people aim to keep it under 30%.' }
  ],
  videos: []
});

window.LESSONS.push({
  id: 'compound-interest', num: 4, title: 'Compound interest', minutes: 5,
  summary: 'Compound interest means your money earns money, and then that money earns money too.',
  body: `
<h3>Money that grows on its own</h3>
<p>When you save or invest, your money can earn a return. <span class="term" data-def="Earning returns not just on the money you put in, but also on the returns you already earned. Growth on top of growth.">Compound interest</span> is what happens when those earnings start earning too. It is growth on top of growth, like a snowball rolling downhill and picking up more snow.</p>
<p>Watch how it works step by step:</p>
<div data-explainer="compound"></div>

<h3>Simple vs compound</h3>
<p>With <span class="term" data-def="Interest paid only on your original amount, never on interest you already earned.">simple interest</span>, you only earn on your original money. With compound interest, you earn on your original money <strong>plus</strong> everything it has already earned.</p>
<div class="example"><b>Example:</b> Maya puts $1,000 somewhere that grows 7% a year.<br>
After year 1: $1,000 + $70 = <strong>$1,070</strong>.<br>
In year 2, she earns 7% on $1,070, not just $1,000. That is $74.90, so she has <strong>$1,144.90</strong>.<br>
After 10 years: about <strong>$1,967</strong>. After 20 years: about <strong>$3,870</strong>. After 30 years: about <strong>$7,612</strong>.<br><br>
With simple interest at 7%, she would only earn $70 every year. After 30 years she would have $1,000 + (30 x $70) = <strong>$3,100</strong>. Compounding more than doubles that.</div>

<h3>Time is the secret ingredient</h3>
<p>Notice how slow compounding looks at first, and how fast it gets later. In Maya's example, the first 10 years add about $967. The last 10 years add about $3,742. Same rate, same starting money. The only difference is time.</p>
<div class="example"><b>Example: the early starter.</b> Maya invests $200 a month ($2,400 a year) from age 25 to 35, then stops. That is 10 years and $24,000 of her own money.<br>
Her friend Sam waits. He invests the same $2,400 a year from 35 to 65. That is 30 years and $72,000 of his money.<br>
Assuming 7% a year, at age 65 Maya has about <strong>$252,000</strong> and Sam has about <strong>$227,000</strong>. Maya put in one third as much and still ends up ahead, because her money had more time to grow.</div>
<div class="callout">The 7% in these examples is an assumption, not a promise. Real investments go up and down, and some years lose money. The point is the shape of the curve: starting earlier gives compounding more time to work.</div>

<h3>The Rule of 72</h3>
<p>Here is a quick mental shortcut. The <span class="term" data-def="A shortcut: divide 72 by your yearly growth rate to estimate how many years it takes your money to double.">Rule of 72</span> says: divide 72 by your yearly growth rate to estimate how long it takes your money to double.</p>
<ul>
  <li>At 7% a year: 72 / 7 = about <strong>10 years</strong> to double.</li>
  <li>At 4% a year: 72 / 4 = about <strong>18 years</strong> to double.</li>
  <li>At 10% a year: 72 / 10 = about <strong>7 years</strong> to double.</li>
</ul>

<h3>Try it yourself</h3>
<p>Change the starting amount, the monthly contribution, the rate, and the number of years. Watch how much of the final total comes from growth instead of from your own deposits.</p>
<div data-widget="compound-calc"></div>

<h3>Compounding can work against you too</h3>
<p>The same math that grows savings also grows debt. When you carry a credit card balance, unpaid interest gets added to what you owe, and then you pay interest on that interest. At 24% APR, the Rule of 72 says an unpaid balance can double in about 3 years.</p>
<div class="callout warn">Inflation quietly works against you too. <span class="term" data-def="The general rise in prices over time, which means each dollar buys a little less each year.">Inflation</span> means prices rise over time. If your savings grow 1% a year while prices rise 3%, your money is actually losing buying power.</div>

<h3>Three levers you control</h3>
<ol>
  <li><strong>Start early.</strong> Time is the most powerful lever.</li>
  <li><strong>Add regularly.</strong> Small, steady contributions add up.</li>
  <li><strong>Leave it alone.</strong> Pulling money out resets the snowball.</li>
</ol>
`,
  takeaways: [
    'Compound interest means you earn returns on your past returns, not just your deposits.',
    'Growth looks slow at first and speeds up over time, so starting early matters most.',
    'Rule of 72: divide 72 by the yearly rate to estimate years to double.',
    'The same math makes unpaid high-interest debt grow fast.',
    'Example returns like 7% are assumptions, not guarantees.'
  ],
  quiz: [
    { q: 'Using the Rule of 72, about how long does money take to double at 6% a year?', options: ['6 years', '12 years', '72 years', '20 years'], answer: 1, why: '72 / 6 = 12, so about 12 years.' },
    { q: 'What makes compound interest different from simple interest?', options: ['It only works in savings accounts', 'It has no risk', 'You earn interest on your past interest too', 'It pays a fixed dollar amount each year'], answer: 2, why: 'Compounding means earnings get added to your balance and then earn returns themselves.' },
    { q: 'Maya invested for 10 years starting at 25. Sam invested for 30 years starting at 35. Why did Maya end with more?', options: ['Her money had more years to compound', 'She picked better stocks', 'She got a higher rate', 'Sam paid more fees'], answer: 0, why: 'They used the same rate. Maya\'s money simply had more total time to grow.' }
  ],
  videos: []
});

window.LESSONS.push({
  id: 'what-is-a-stock', num: 5, title: 'What a stock is', minutes: 4,
  summary: 'A stock is a small slice of ownership in a real company.',
  body: `
<h3>A slice of a real business</h3>
<p>A <span class="term" data-def="A small piece of ownership in a company. Also called equity.">stock</span> is a piece of ownership in a company. Companies divide their ownership into many equal pieces called <span class="term" data-def="One single unit of a company's stock. If a company has 1,000 shares and you own 10, you own 1% of it.">shares</span>. When you buy a share, you become a part-owner, called a <span class="term" data-def="A person or organization that owns at least one share of a company.">shareholder</span>.</p>
<p>When you buy a share of Apple or Nike, you are not just buying a symbol on a screen. You own a tiny piece of a real business with real stores, products, workers, and profits.</p>

<h3>A small example: the bakery</h3>
<div class="example"><b>Example:</b> Maya's friend runs a bakery worth $100,000. To raise money for a second location, she splits ownership into 100 equal shares. Each share is worth $100,000 / 100 = <strong>$1,000</strong>.<br><br>
Maya buys 5 shares for $5,000. She now owns 5 out of 100 shares, which is <strong>5%</strong> of the bakery.<br><br>
The new location is a hit. The bakery is now worth $150,000. Each share is now worth $150,000 / 100 = <strong>$1,500</strong>. Maya's 5 shares are worth <strong>$7,500</strong>.</div>
<p>Big public companies work the same way, just with billions of shares instead of 100.</p>

<h3>Why companies sell stock</h3>
<p>Companies sell shares to raise money without taking on a loan. They use that money to build factories, hire people, or create new products. In return, investors get a share of the company's future.</p>
<p>The first time a company sells shares to the public, it is called an <span class="term" data-def="Initial Public Offering. The first time a private company sells its shares to the general public on a stock exchange.">IPO</span>. After that, the shares trade between investors every day on a <span class="term" data-def="A marketplace where buyers and sellers trade shares, like the New York Stock Exchange or Nasdaq.">stock exchange</span>.</p>
<p>Each company has a short code called a <span class="term" data-def="A short code of letters used to identify a company's stock, like AAPL for Apple.">ticker symbol</span>. Apple is AAPL. Coca-Cola is KO. Walmart is WMT.</p>

<h3>Two ways owners can make money</h3>
<ol>
  <li><strong>The price goes up.</strong> If you buy a share at $100 and later sell it for $130, you made a $30 profit. This is called a <span class="term" data-def="The profit you make when you sell something, like a stock, for more than you paid.">capital gain</span>.</li>
  <li><strong>Dividends.</strong> Some companies share part of their profits with owners in cash. This payment is called a <span class="term" data-def="A cash payment some companies make to shareholders, usually every three months, from their profits.">dividend</span>. Many large, steady companies pay them. Many fast-growing ones do not.</li>
</ol>
<div class="example"><b>Example:</b> The bakery earns $50,000 profit in a year. It keeps $40,000 to grow and pays out $10,000 to owners. That is $10,000 / 100 shares = <strong>$100 per share</strong>. Maya owns 5 shares, so she receives <strong>$500</strong>.</div>

<h3>What decides a stock's price?</h3>
<p>A stock's price is simply the last price a buyer and seller agreed on. If more people want to buy than sell, the price tends to rise. If more want to sell, it tends to fall.</p>
<p>Over the long run, prices tend to follow how well the business does: its sales, its profits, and what investors expect in the future. In the short run, prices can swing a lot on news, rumors, and emotions.</p>

<h3>What else owning a share means</h3>
<ul>
  <li><strong>You usually get a vote.</strong> Shareholders can vote on things like who sits on the company's board.</li>
  <li><strong>You do not run the company.</strong> Owning a few shares does not let you walk in and give orders.</li>
  <li><strong>You can buy pieces of a share.</strong> Many apps offer <span class="term" data-def="A part of one share. If a share costs $400, you could buy a quarter of a share for $100.">fractional shares</span>, so you can invest $20 even if one share costs $400.</li>
  <li><strong>Your loss is limited.</strong> The most you can lose is what you put in. You will never owe the company's debts.</li>
</ul>
<div class="callout warn">Stocks carry real risk. A company can struggle, and its stock can fall a lot or even go to zero if it goes out of business. That is why many people spread their money across many companies, which you will learn about in a later lesson.</div>
<div class="callout">Remember: buying a stock means buying a piece of a business. A useful question before buying any stock is, "Would I be happy owning part of this company for many years?"</div>
`,
  takeaways: [
    'A stock is a share of ownership in a real company.',
    'Companies sell shares to raise money; after an IPO, shares trade on exchanges.',
    'Owners can earn from rising prices (capital gains) and from dividends.',
    'Prices are set by buyers and sellers and, over time, tend to follow business results.',
    'You can lose what you invest, but never more than that.'
  ],
  quiz: [
    { q: 'A company has 1,000 shares and you own 50. What percent of the company do you own?', options: ['50%', '0.5%', '20%', '5%'], answer: 3, why: '50 / 1,000 = 0.05, which is 5%.' },
    { q: 'What is a dividend?', options: ['A cash payment from a company\'s profits to its shareholders', 'A fee you pay to buy stock', 'A type of loan', 'The price of one share'], answer: 0, why: 'A dividend is a share of profits paid out to owners, often every three months.' },
    { q: 'You buy a share for $80 and sell it for $100. What is your capital gain?', options: ['$100', '$80', '$20', '$180'], answer: 2, why: 'The capital gain is the sale price minus what you paid: $100 - $80 = $20.' }
  ],
  videos: []
});
