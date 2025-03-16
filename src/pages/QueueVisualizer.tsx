
import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { enqueue, dequeue, peekQueue, Message } from '../utils/dataStructures';

const QueueVisualizer: React.FC = () => {
  const [queue, setQueue] = useState<(number | string)[]>([]);
  const [value, setValue] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  }, [messages]);

  const addMessage = (message: Message) => {
    setMessages(prev => [...prev, message]);
    
    // Show toast notification
    if (message.type === 'error') {
      toast.error(message.text);
    } else if (message.type === 'success') {
      toast.success(message.text);
    } else {
      toast.info(message.text);
    }
  };

  const handleEnqueue = () => {
    if (!value) {
      addMessage({
        text: 'Please enter a value to enqueue.',
        type: 'error',
      });
      return;
    }
    
    const result = enqueue(queue, value);
    
    setQueue(result.newQueue);
    addMessage(result.message);
    setActiveIndex(result.newQueue.length - 1);
    setTimeout(() => setActiveIndex(null), 2000);
    
    // Reset input
    setValue('');
  };
  
  const handleDequeue = () => {
    const result = dequeue(queue);
    
    setQueue(result.newQueue);
    addMessage(result.message);
    
    if (result.newQueue.length > 0) {
      setActiveIndex(0);
      setTimeout(() => setActiveIndex(null), 2000);
    }
  };
  
  const handlePeek = () => {
    const result = peekQueue(queue);
    addMessage(result.message);
    
    if (queue.length > 0) {
      setActiveIndex(0);
      setTimeout(() => setActiveIndex(null), 2000);
    }
  };
  
  const handleReset = () => {
    setQueue([]);
    setActiveIndex(null);
    addMessage({
      text: 'Queue has been reset.',
      type: 'info',
    });
  };

  return (
    <div className="min-h-screen pt-20 pb-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex items-center mb-8">
        <Link to="/" className="flex items-center text-arena-red hover:text-arena-red/80 mr-4">
          <ArrowLeft className="h-5 w-5 mr-1" />
          <span>Back</span>
        </Link>
        <h1 className="text-4xl font-bold text-center text-arena-darkgray flex-grow mr-10">
          Queue <span className="text-arena-red">Visualizer</span>
        </h1>
      </div>
      
      <div className="bg-white rounded-2xl shadow-md p-6 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="col-span-1">
            <label htmlFor="value" className="block text-sm font-medium text-gray-700 mb-1">
              Value
            </label>
            <input
              id="value"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Enter a value"
              className="ds-input w-full"
            />
          </div>
          
          <div className="col-span-1 grid grid-cols-3 gap-2">
            <button
              onClick={handleEnqueue}
              className="ds-btn ds-btn-primary col-span-1"
            >
              Enqueue
            </button>
            <button
              onClick={handleDequeue}
              className="ds-btn ds-btn-primary col-span-1"
            >
              Dequeue
            </button>
            <button
              onClick={handlePeek}
              className="ds-btn ds-btn-secondary col-span-1"
            >
              Peek
            </button>
          </div>
        </div>
        
        <button
          onClick={handleReset}
          className="ds-btn ds-btn-secondary w-full mb-8"
        >
          Reset
        </button>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h3 className="text-lg font-semibold mb-2">Queue Visualization:</h3>
            <div className="border border-gray-200 rounded-xl p-4 min-h-64 flex items-center justify-center">
              {queue.length === 0 ? (
                <p className="text-gray-500 italic">Queue is empty. Enqueue elements to visualize.</p>
              ) : (
                <div className="w-full flex flex-col items-center">
                  <div className="flex w-full max-w-md justify-between mb-4">
                    <div className="text-sm font-semibold text-arena-red">FRONT (Dequeue)</div>
                    <div className="text-sm font-semibold text-arena-red">REAR (Enqueue)</div>
                  </div>
                  <div className="flex justify-center gap-4 w-full">
                    {queue.map((item, idx) => (
                      <div
                        key={idx}
                        className={`ds-visualizer-block ${
                          idx === activeIndex ? 'ds-visualizer-block-active' : ''
                        }`}
                      >
                        <div className="flex flex-col items-center">
                          <span className="text-sm text-gray-500">{idx}</span>
                          <span className="font-mono">{item}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div ref={messagesEndRef} className="ds-message-box mt-6">
              {messages.length === 0 ? (
                <p className="text-gray-500 italic">Operations will be logged here.</p>
              ) : (
                messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`mb-1 ${
                      msg.type === 'error'
                        ? 'text-red-600'
                        : msg.type === 'success'
                        ? 'text-green-600'
                        : 'text-blue-600'
                    }`}
                  >
                    {msg.text}
                  </div>
                ))
              )}
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Queue Size:</h3>
                <div className="bg-arena-lightgray rounded-lg p-4 text-center">
                  <span className="text-2xl font-bold">{queue.length}</span>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2">Front Element:</h3>
                <div className="bg-arena-lightgray rounded-lg p-4 text-center">
                  <span className="text-xl font-mono">
                    {queue.length > 0 ? queue[0] : 'None'}
                  </span>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2">Queue Operations:</h3>
                <div className="bg-arena-lightgray rounded-lg p-4">
                  <ul className="list-disc list-inside space-y-2 text-sm">
                    <li><strong>Enqueue:</strong> Add an element to the rear</li>
                    <li><strong>Dequeue:</strong> Remove the front element</li>
                    <li><strong>Peek:</strong> View the front element without removing it</li>
                    <li><strong>FIFO:</strong> First In, First Out principle</li>
                  </ul>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2">Last Message</h3>
                <div className="bg-arena-lightgray rounded-lg p-4">
                  <p>
                    {messages.length > 0
                      ? messages[messages.length - 1].text
                      : 'No operations performed yet.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QueueVisualizer;
