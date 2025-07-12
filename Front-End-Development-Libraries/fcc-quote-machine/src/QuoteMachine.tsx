import React, { useState, useEffect, useRef } from 'react';
import type { Quote, QuotesApiResponse } from './types';

const QuoteMachine: React.FC = () => {
  const [quotesData, setQuotesData] = useState<Quote[]>([]);
  const [currentQuote, setCurrentQuote] = useState<string>('');
  const [currentAuthor, setCurrentAuthor] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentColor, setCurrentColor] = useState<string>('#333');
  
  const quoteTextRef = useRef<HTMLDivElement>(null);
  const quoteAuthorRef = useRef<HTMLDivElement>(null);

  const colors = [
    '#16a085',
    '#27ae60',
    '#2c3e50',
    '#f39c12',
    '#e74c3c',
    '#9b59b6',
    '#FB6964',
    '#342224',
    '#472E32',
    '#BDBB99',
    '#77B1A9',
    '#73A857'
  ];

  const getQuotes = async (): Promise<void> => {
    try {
      const response = await fetch('https://gist.githubusercontent.com/camperbot/5a022b72e96c4c9585c32bf6a75f62d9/raw/e3c6895ce42069f0ee7e991229064f167fe8ccdc/quotes.json');
      const data: QuotesApiResponse = await response.json();
      setQuotesData(data.quotes);
    } catch (error) {
      // fallback quotes
      // if we cant fetch from the api, we use the quotes below
      const fallbackQuotes: Quote[] = [
        { 
          quote: "Life is not measured by the number of breaths we take, but by the moments that take our breath away.", 
          author: "Maya Angelou" 
        },
        { 
          quote: "The mind is everything. What you think you become.", 
          author: "Buddha" 
        },
        { 
          quote: "The only way to do great work is to love what you do.", 
          author: "Steve Jobs" 
        }
      ];
      setQuotesData(fallbackQuotes);
    }
  };

  const getRandomQuote = (): Quote => {
    return quotesData[Math.floor(Math.random() * quotesData.length)];
  };

  const animateElement = (element: HTMLElement | null, callback: () => void): void => {
    if (!element) return;
    
    element.style.opacity = '0';
    setTimeout(() => {
      callback();
      element.style.opacity = '1';
    }, 500);
  };

  const getQuote = (): void => {
    if (quotesData.length === 0) return;

    const randomQuote = getRandomQuote();
    const newColor = colors[Math.floor(Math.random() * colors.length)];

    // update social media links
    const tweetUrl = `https://twitter.com/intent/tweet?hashtags=quotes&related=freecodecamp&text=${encodeURIComponent(`"${randomQuote.quote}" ${randomQuote.author}`)}`;
    const tumblrUrl = `https://www.tumblr.com/widgets/share/tool?posttype=quote&tags=quotes,freecodecamp&caption=${encodeURIComponent(randomQuote.author)}&content=${encodeURIComponent(randomQuote.quote)}&canonicalUrl=https%3A%2F%2Fwww.tumblr.com%2Fbuttons&shareSource=tumblr_share_button`;

    // animate quote text
    animateElement(quoteTextRef.current, () => {
      setCurrentQuote(randomQuote.quote);
    });

    // animate quote author
    animateElement(quoteAuthorRef.current, () => {
      setCurrentAuthor(randomQuote.author);
    });

    // animate colors
    setCurrentColor(newColor);
    
    // update body and button colors
    setTimeout(() => {
      document.body.style.backgroundColor = newColor;
      document.body.style.color = newColor;
      
      const buttons = document.querySelectorAll('.button');
      buttons.forEach((button) => {
        (button as HTMLElement).style.backgroundColor = newColor;
      });
    }, 0);

    // update social media links
    setTimeout(() => {
      const tweetLink = document.getElementById('tweet-quote') as HTMLAnchorElement;
      const tumblrLink = document.getElementById('tumblr-quote') as HTMLAnchorElement;
      
      if (tweetLink) tweetLink.href = tweetUrl;
      if (tumblrLink) tumblrLink.href = tumblrUrl;
    }, 0);
  };

  useEffect(() => {
    getQuotes().then(() => {
      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    if (quotesData.length > 0 && isLoading === false) {
      getQuote();
    }
  }, [quotesData, isLoading]);

  const getTweetUrl = (): string => {
    return `https://twitter.com/intent/tweet?hashtags=quotes&related=freecodecamp&text=${encodeURIComponent(`"${currentQuote}" ${currentAuthor}`)}`;
  };

  const getTumblrUrl = (): string => {
    return `https://www.tumblr.com/widgets/share/tool?posttype=quote&tags=quotes,freecodecamp&caption=${encodeURIComponent(currentAuthor)}&content=${encodeURIComponent(currentQuote)}&canonicalUrl=https%3A%2F%2Fwww.tumblr.com%2Fbuttons&shareSource=tumblr_share_button`;
  };

  return (
    <>
      <div id="quote-box">
        <div className="quote-text" ref={quoteTextRef}>
          <i className="fa fa-quote-left" style={{ color: currentColor }}></i>
          <span id="text">{currentQuote}</span>
        </div>
        <div className="quote-author" ref={quoteAuthorRef}>
          <span id="author">- {currentAuthor}</span>
        </div>
        <div className="buttons">
          <a
            className="button"
            id="tweet-quote"
            title="Tweet this quote!"
            target="_blank"
            rel="noopener noreferrer"
            href={getTweetUrl()}
            style={{ backgroundColor: currentColor }}
          >
            <i className="fab fa-twitter"></i>
          </a>
          <a
            className="button"
            id="tumblr-quote"
            title="Post this quote on tumblr!"
            target="_blank"
            rel="noopener noreferrer"
            href={getTumblrUrl()}
            style={{ backgroundColor: currentColor }}
          >
            <i className="fab fa-tumblr"></i>
          </a>
          <button
            className="button"
            id="new-quote"
            onClick={getQuote}
            style={{ backgroundColor: currentColor }}
          >
            New quote
          </button>
        </div>
      </div>
      <div className="footer">
        <span>by </span>
        <a href="https://ysz.life" target="_blank" rel="noopener noreferrer">
          Yanis Sebastian Zürcher
        </a>
      </div>
    </>
  );
};

export default QuoteMachine; 