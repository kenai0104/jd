import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Player } from '@lottiefiles/react-lottie-player';
import { Line, Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import animationData from '../assets/animation.json';
import '../css/Home.css';
import kenaiLogo from '../assets/kenaiLogo.png';
import stringSimilarity from 'string-similarity';


ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Home = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [transcribedText, setTranscribedText] = useState('');
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState([]);
  const recognitionRef = useRef(null);
  const chatContainerRef = useRef(null);

  const botResponses = {
    "Can you show me a bar graph of inventory levels by product type?": {
      response: "Here’s a bar graph showing the inventory levels by product type.",
      graphType: 'bar',
      graphData: {
        labels: ['T-shirts', 'Hoodies', 'Mugs', 'Caps'],
        datasets: [{
          label: 'Inventory by Product Type',
          data: [500, 200, 300, 150],
          backgroundColor: '#36A2EB',
          borderColor: '#36A2EB',
          borderWidth: 1,
        }],
      },
    },
  
    "Can you show me a bar graph of stock levels for sizes S, M, L, XL, and XXL?": {
      response: "Here’s a bar graph showing the stock levels for different t-shirt sizes.",
      graphType: 'bar',
      graphData: {
        labels: ['S', 'M', 'L', 'XL', 'XXL'],
        datasets: [{
          label: 'Stock Levels by Size',
          data: [500, 1000, 1500, 2000, 1200],
          backgroundColor: '#FF5733',
          borderColor: '#FF5733',
          borderWidth: 1,
        }],
      },
    },
  
    "Can you show me a bar graph of product availability by warehouse?": {
      response: "Here’s a bar graph showing product availability by warehouse.",
      graphType: 'bar',
      graphData: {
        labels: ['Warehouse A', 'Warehouse B', 'Warehouse C'],
        datasets: [{
          label: 'Product Availability by Warehouse',
          data: [5000, 7000, 6000],
          backgroundColor: '#FFCE56',
          borderColor: '#FFCE56',
          borderWidth: 1,
        }],
      },
    },
  
    "Can you show me a pie chart of inventory distribution by product category?": {
      response: "Here’s a pie chart showing the inventory distribution by product category.",
      graphType: 'pie',
      graphData: {
        labels: ['Clothing', 'Accessories', 'Home Goods'],
        datasets: [{
          data: [40, 30, 30],
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        }],
      },
    },
  
    "Can you show me a pie chart of the product categories with the most stock?": {
      response: "Here’s a pie chart showing the product categories with the most stock.",
      graphType: 'pie',
      graphData: {
        labels: ['T-shirts', 'Hoodies', 'Mugs', 'Caps'],
        datasets: [{
          data: [1500, 1000, 500, 300],
          backgroundColor: ['#FF5733', '#36A2EB', '#FFCE56', '#4BC0C0'],
        }],
      },
    },
  
    "Can you show me a pie chart of the stock distribution between local and international products?": {
      response: "Here’s a pie chart showing the stock distribution between local and international products.",
      graphType: 'pie',
      graphData: {
        labels: ['Local Products', 'International Products'],
        datasets: [{
          data: [7000, 3000],
          backgroundColor: ['#FF6384', '#36A2EB'],
        }],
      },
    },
    "Can you show me a line graph of product sales over the past 6 months?": {
    response: "Here’s a line graph showing the sales trend over the past 6 months.",
    graphType: 'line',
    graphData: {
      labels: ['October', 'November', 'December', 'January', 'February', 'March'],
      datasets: [{
        label: 'Sales Trend',
        data: [3000, 4000, 3500, 4500, 5000, 5500],
        borderColor: '#FF5733',
        backgroundColor: '#FF5733',
        tension: 0.1,
      }],
    },
  },

  "Can you show me a line graph of monthly stock levels for the past year?": {
    response: "Here’s a line graph showing the stock levels for the past year.",
    graphType: 'line',
    graphData: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      datasets: [{
        label: 'Stock Levels',
        data: [1200, 1300, 1100, 1400, 1450, 1350, 1600, 1700, 1650, 1800, 1900, 2000],
        borderColor: '#36A2EB',
        backgroundColor: '#36A2EB',
        tension: 0.1,
      }],
    },
  },

  "Can you show me a line graph of monthly returns over the past year?": {
    response: "Here’s a line graph showing the returns trend over the past year.",
    graphType: 'line',
    graphData: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      datasets: [{
        label: 'Returns Trend',
        data: [50, 60, 40, 80, 90, 70, 85, 95, 100, 110, 120, 130],
        borderColor: '#FFCE56',
        backgroundColor: '#FFCE56',
        tension: 0.1,
      }],
    },
  },

  "Can you show me a line graph of profit margins for the last 6 months?": {
    response: "Here’s a line graph showing the profit margins over the past 6 months.",
    graphType: 'line',
    graphData: {
      labels: ['October', 'November', 'December', 'January', 'February', 'March'],
      datasets: [{
        label: 'Profit Margins',
        data: [12, 15, 13, 14, 16, 18],
        borderColor: '#4BC0C0',
        backgroundColor: '#4BC0C0',
        tension: 0.1,
      }],
    },
  },
    "How much stock do we have for product XYZ?": {
    response: "We currently have 500 units of product XYZ in stock.",
  },

  "What is the current stock level for t-shirts?": {
    response: "We have 2,000 t-shirts in stock across all sizes.",
  },

  "How many t-shirts are available in size XL?": {
    response: "We have 1,200 XL-sized t-shirts available.",
  },

  "What is the average stock level for the last 3 months?": {
    response: "The average stock level for the last 3 months is 1,500 units per month.",
  },

  "Can you tell me about the product categories with the most inventory?": {
    response: "The product categories with the most inventory are T-shirts, Hoodies, and Mugs.",
  },

  "What is the current stock of hoodies in warehouse B?": {
    response: "Warehouse B currently has 600 hoodies in stock.",
  },

  "Can you show me the total inventory value of all products?": {
    response: "The total inventory value of all products is approximately $50,000.",
  },

  "What products have been sold out recently?": {
    response: "Recently, the following products have been sold out: Mugs (Blue), Caps (Size Medium).",
  },

  "How is our stock performing compared to last month?": {
    response: "Stock performance has increased by 10% compared to last month.",
  },

  "Can you show me the number of out-of-stock items for the last month?": {
    response: "In the last month, we had 15 items that went out of stock.",
  },

  "Can you provide an overview of our warehouse distribution?": {
    response: "Currently, Warehouse A holds 5,000 units, Warehouse B holds 7,000 units, and Warehouse C holds 6,000 units.",
  },
  };
  
  const getGraphTypeFromInput = (input) => {
    const text = input.toLowerCase();
    if (text.includes('graph') || text.includes('bar')) return 'bar';
    if (text.includes('pie') || text.includes('chart')) return 'pie';
    if (text.includes('production')) return 'line';
    return null;
  };

  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css';
    document.head.appendChild(link);
  }, []);

  const startVoiceRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech Recognition is not supported in your browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        finalTranscript += event.results[i][0].transcript;
      }
      setTranscribedText(finalTranscript);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error', event.error);
    };

    recognition.start();
    setShowModal(true);
  };

  const stopVoiceRecognition = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  const closeModal = () => {
    stopVoiceRecognition();
    setShowModal(false);
    setTranscribedText('');
  };

const handleMessage = (text) => {
  const trimmed = text.trim().toLowerCase().replace(/[^\w\s]/gi, '');
  if (trimmed === '') return;

  setMessages(prev => [...prev, { text: trimmed, sender: 'user' }]);

  // Check for greetings
  const greetings = ['hi', 'hello', 'hey'];
  if (greetings.includes(trimmed)) {
    const greetingResponse = "Hello, how can I help you?";
    let index = 0;
    let animatedText = '';
    const interval = setInterval(() => {
      if (index < greetingResponse.length) {
        animatedText += greetingResponse[index];
        setMessages(prev => {
          const last = prev[prev.length - 1];
          if (last && last.sender === 'bot' && last.typing) {
            return [...prev.slice(0, -1), { ...last, text: animatedText }];
          } else {
            return [...prev, { text: animatedText, sender: 'bot', typing: true }];
          }
        });
        index++;
      } else {
        clearInterval(interval);
        setMessages(prev => [
          ...prev.slice(0, -1),
          { text: greetingResponse, sender: 'bot' }
        ]);
      }
    }, 30);
    return; // Stop further processing
  }

  // Bot response matching
  const questionList = Object.keys(botResponses);
  const match = stringSimilarity.findBestMatch(trimmed, questionList);
  const bestMatch = match.bestMatch;

  if (bestMatch.rating > 0.5) {
    const response = botResponses[bestMatch.target];
    let index = 0;
    let animatedText = '';
    const interval = setInterval(() => {
      if (index < response.response.length) {
        animatedText += response.response[index];
        setMessages(prev => {
          const last = prev[prev.length - 1];
          if (last && last.sender === 'bot' && last.typing) {
            return [...prev.slice(0, -1), { ...last, text: animatedText }];
          } else {
            return [...prev, { text: animatedText, sender: 'bot', typing: true }];
          }
        });
        index++;
      } else {
        clearInterval(interval);
        setMessages(prev => [
          ...prev.slice(0, -1),
          {
            text: response.response,
            sender: 'bot',
            graphType: response.graphType || null,
            graphData: response.graphData || null,
          },
        ]);
      }
    }, 30);
  } else {
    const errorMsg = "I'm sorry, I didn't understand that.";
    let index = 0;
    let animatedText = '';
    const interval = setInterval(() => {
      if (index < errorMsg.length) {
        animatedText += errorMsg[index];
        setMessages(prev => {
          const last = prev[prev.length - 1];
          if (last && last.sender === 'bot' && last.typing) {
            return [...prev.slice(0, -1), { ...last, text: animatedText }];
          } else {
            return [...prev, { text: animatedText, sender: 'bot', typing: true }];
          }
        });
        index++;
      } else {
        clearInterval(interval);
        setMessages(prev => [
          ...prev.slice(0, -1),
          { text: errorMsg, sender: 'bot' }
        ]);
      }
    }, 30);
  }
};



// const handleMessage = (text) => {
//   const trimmed = text.trim();
//   if (trimmed === '') return;

//   setMessages(prev => [...prev, { text: trimmed, sender: 'user' }]);

//   const normalizedInput = trimmed.toLowerCase();
//   let response = botResponses[trimmed];

//   // Custom handling for "hi"
//   if (normalizedInput === 'hi') {
//     response = {
//       response: "Hello! How can I help you?",
//     };
//   }

//   if (response) {
//     let index = 0;
//     let animatedText = '';
//     const interval = setInterval(() => {
//       if (index < response.response.length) {
//         animatedText += response.response[index];
//         setMessages(prev => {
//           const last = prev[prev.length - 1];
//           if (last && last.sender === 'bot' && last.typing) {
//             return [...prev.slice(0, -1), { ...last, text: animatedText }];
//           } else {
//             return [...prev, { text: animatedText, sender: 'bot', typing: true }];
//           }
//         });
//         index++;
//       } else {
//         clearInterval(interval);
//         setMessages(prev => [
//           ...prev.slice(0, -1),
//           {
//             text: response.response,
//             sender: 'bot',
//             graphType: response.graphType || null,
//             graphData: response.graphData || null,
//           },
//         ]);
//       }
//     }, 30);
//   } else {
//     // Default error message for unrecognized input
//     const errorMsg = "I'm sorry, I didn't understand that.";
//     let index = 0;
//     let animatedText = '';
//     const interval = setInterval(() => {
//       if (index < errorMsg.length) {
//         animatedText += errorMsg[index];
//         setMessages(prev => {
//           const last = prev[prev.length - 1];
//           if (last && last.sender === 'bot' && last.typing) {
//             return [...prev.slice(0, -1), { ...last, text: animatedText }];
//           } else {
//             return [...prev, { text: animatedText, sender: 'bot', typing: true }];
//           }
//         });
//         index++;
//       } else {
//         clearInterval(interval);
//         setMessages(prev => [
//           ...prev.slice(0, -1),
//           { text: errorMsg, sender: 'bot' }
//         ]);
//       }
//     }, 30);
//   }
// };


  
  const handleSendTranscription = () => {
    handleMessage(transcribedText);
    setTranscribedText('');
    closeModal();
  };

  const handleSendInput = () => {
    handleMessage(inputText);
    setInputText('');
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <>
      <div className={`home-container ${showModal ? 'modal-active' : ''}`}>
        <div className="kenai-logo">
          <img src={kenaiLogo} alt="Kenai Logo" />
        </div>

        <div className="logo-container">
          <Player autoplay loop speed={1} src={animationData} style={{ height: '70px', width: '70px' }} />
        </div>

        <div className="laptop-body">
          <div className="laptop-screen">
            <div className="chat-messages" ref={chatContainerRef}>
            {messages && messages.map((message, index) => (
  <div key={index}>
    <div className={`chat-message ${message.sender === 'user' ? 'user-message' : 'bot-message'}`}>
      <div className="chat-bubble-content">
        <span className="chat-icon-inside">
          <i className={`fas ${message.sender === 'user' ? 'fa-user' : 'fa-robot'}`}></i>
        </span>
        <span className="chat-text">{message.text}</span>
      </div>
    </div>

    {message.sender === 'bot' && message.graphType && (
      <div className="graph-under-message">
        <h4>
          {message.graphType === 'line'
            ? 'Production Graph'
            : message.graphType === 'bar'
            ? 'Inventory or Sales Graph'
            : 'Product Distribution'}
        </h4>
        {message.graphType === 'line' && <Line data={message.graphData} />}
        {message.graphType === 'bar' && <Bar data={message.graphData} />}
        {message.graphType === 'pie' && <Pie data={message.graphData} />}
      </div>
    )}
  </div>
))}

            </div>

            <button className="talk-button-inside" onClick={startVoiceRecognition}>
              <i className="fas fa-microphone"></i>
            </button>

            <div className="input-container">
              <input
                type="text"
                placeholder="Ask something..."
                className="input-field"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSendInput();
                  }
                }}
              />
              <button className="input-send-button" onClick={handleSendInput}>
                <i className="fas fa-paper-plane"></i>
              </button>
            </div>
          </div>

          <div className="laptop-base" />
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>
              <i className="fas fa-times"></i>
            </button>
            <h2>Transcribed Speech</h2>
            <p>{transcribedText || 'Start speaking and your words will appear here...'}</p>
            <button className="send-button" onClick={handleSendTranscription}>
              <i className="fas fa-paper-plane"></i> Send
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Home;
