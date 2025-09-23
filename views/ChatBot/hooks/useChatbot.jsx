import axios from 'axios';
import { useState, useEffect, useRef } from 'react';

/**
 * Custom hook to manage the state and logic for the chatbot.
 * @returns {{
 * messages: Array,
 * input: string,
 * isLoading: boolean,
 * isChatOpen: boolean,
 * setInput: Function,
 * handleSendMessage: Function,
 * setIsChatOpen: Function,
 * messagesEndRef: React.RefObject
 * }}
 */
const useChatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const messagesEndRef = useRef(null);

  // This is a mock function to simulate an API call to your Django backend.
  const sendQueryToDjangoAPI = async (userQuestion) => {
    const API_URL = 'http://127.0.0.1:8000/api/chatbot/query/';
    try {
      const response = await axios.post(API_URL, { question: userQuestion });
      return response.data;
    } catch (error) {
      console.error('Error fetching from API:', error);
      return { query: 'Error occurred.', results: [], error: error.message };
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    const trimmedInput = input.trim();
    if (!trimmedInput) return;

    const userMessage = { text: trimmedInput, sender: 'user' };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const apiResponse = await sendQueryToDjangoAPI(trimmedInput);

      if (apiResponse.query) {
        const botQueryMessage = { text: `Query: \`${apiResponse.query}\``, sender: 'bot' };
        setMessages((prevMessages) => [...prevMessages, botQueryMessage]);
      }
      if (apiResponse.results && apiResponse.results.length > 0) {
        const botResultMessage = { results: apiResponse.results, sender: 'bot' };
        setMessages((prevMessages) => [...prevMessages, botResultMessage]);
      } else if (apiResponse.error) {
        const botErrorMessage = { text: `Error: ${apiResponse.error}`, sender: 'bot' };
        setMessages((prevMessages) => [...prevMessages, botErrorMessage]);
      } else {
        const botNoResultMessage = { text: 'No results found or an error occurred.', sender: 'bot' };
        setMessages((prevMessages) => [...prevMessages, botNoResultMessage]);
      }
    } catch (error) {
      const botErrorMessage = { text: `Error: Could not connect to the chatbot service.`, sender: 'bot' };
      setMessages((prevMessages) => [...prevMessages, botErrorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  return {
    messages,
    input,
    isLoading,
    isChatOpen,
    setInput,
    handleSendMessage,
    setIsChatOpen,
    messagesEndRef
  };
};

export default useChatbot;
