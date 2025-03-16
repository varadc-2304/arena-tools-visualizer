
import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { addToArray, removeFromArray, viewArrayItem, Message, ArrayOperation } from '../utils/dataStructures';

const ArrayVisualizer: React.FC = () => {
  const [array, setArray] = useState<(number | string)[]>([]);
  const [index, setIndex] = useState<string>('');
  const [value, setValue] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [lastAddedItem, setLastAddedItem] = useState<string | number | null>(null);
  const [lastRemovedItem, setLastRemovedItem] = useState<string | number | null>(null);
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

  const handleAdd = () => {
    if (!value) {
      addMessage({
        text: 'Please enter a value to add.',
        type: 'error',
      });
      return;
    }
    
    const idx = index ? parseInt(index) : array.length;
    const result = addToArray(array, value, idx);
    
    setArray(result.newArray);
    addMessage(result.message);
    setLastAddedItem(value);
    setActiveIndex(idx);
    setTimeout(() => setActiveIndex(null), 2000);
    
    // Reset inputs
    setValue('');
    setIndex('');
  };
  
  const handleRemove = () => {
    if (!index) {
      addMessage({
        text: 'Please enter an index to remove from.',
        type: 'error',
      });
      return;
    }
    
    const idx = parseInt(index);
    const result = removeFromArray(array, idx);
    
    setArray(result.newArray);
    addMessage(result.message);
    setLastRemovedItem(result.removed);
    setActiveIndex(idx);
    setTimeout(() => setActiveIndex(null), 2000);
    
    // Reset index input
    setIndex('');
  };
  
  const handleView = () => {
    if (!index) {
      addMessage({
        text: 'Please enter an index to view.',
        type: 'error',
      });
      return;
    }
    
    const idx = parseInt(index);
    const result = viewArrayItem(array, idx);
    
    addMessage(result.message);
    setActiveIndex(idx);
    setTimeout(() => setActiveIndex(null), 2000);
    
    // Reset index input
    setIndex('');
  };
  
  const handleReset = () => {
    setArray([]);
    setLastAddedItem(null);
    setLastRemovedItem(null);
    setActiveIndex(null);
    addMessage({
      text: 'Array has been reset.',
      type: 'info',
    });
  };
  
  const handleOperation = (operation: ArrayOperation) => {
    switch (operation) {
      case 'add':
        handleAdd();
        break;
      case 'remove':
        handleRemove();
        break;
      case 'view':
        handleView();
        break;
      case 'reset':
        handleReset();
        break;
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex items-center mb-8">
        <Link to="/" className="flex items-center text-arena-red hover:text-arena-red/80 mr-4">
          <ArrowLeft className="h-5 w-5 mr-1" />
          <span>Back</span>
        </Link>
        <h1 className="text-4xl font-bold text-center text-arena-darkgray flex-grow mr-10">
          Array <span className="text-arena-red">Visualizer</span>
        </h1>
      </div>
      
      <div className="bg-white rounded-2xl shadow-md p-6 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="col-span-1">
            <label htmlFor="index" className="block text-sm font-medium text-gray-700 mb-1">
              Index
            </label>
            <input
              id="index"
              type="number"
              value={index}
              onChange={(e) => setIndex(e.target.value)}
              placeholder="0, 1, 2, ..."
              className="ds-input w-full"
              min="0"
            />
          </div>
          
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
          
          <div className="col-span-1 lg:col-span-2 grid grid-cols-3 gap-2">
            <button
              onClick={() => handleOperation('add')}
              className="ds-btn ds-btn-primary col-span-1"
            >
              Add
            </button>
            <button
              onClick={() => handleOperation('remove')}
              className="ds-btn ds-btn-primary col-span-1"
            >
              Remove
            </button>
            <button
              onClick={() => handleOperation('view')}
              className="ds-btn ds-btn-secondary col-span-1"
            >
              View
            </button>
          </div>
        </div>
        
        <button
          onClick={() => handleOperation('reset')}
          className="ds-btn ds-btn-secondary w-full mb-8"
        >
          Reset
        </button>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h3 className="text-lg font-semibold mb-2">Array Visualization:</h3>
            <div className="ds-array-container min-h-32">
              {array.length === 0 ? (
                <p className="text-gray-500 italic">Array is empty. Add elements to visualize.</p>
              ) : (
                array.map((item, idx) => (
                  <div
                    key={idx}
                    className={`ds-visualizer-block ${idx === activeIndex ? 'ds-visualizer-block-active' : ''}`}
                  >
                    <div className="flex flex-col items-center">
                      <span className="text-sm text-gray-500">{idx}</span>
                      <span className="font-mono">{item}</span>
                    </div>
                  </div>
                ))
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
                <h3 className="text-lg font-semibold mb-2">Size of the Array:</h3>
                <div className="bg-arena-lightgray rounded-lg p-4 text-center">
                  <span className="text-2xl font-bold">{array.length}</span>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2">Last Added Item:</h3>
                <div className="bg-arena-lightgray rounded-lg p-4 text-center">
                  <span className="text-xl font-mono">
                    {lastAddedItem !== null ? lastAddedItem : 'None'}
                  </span>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2">Last Removed Item:</h3>
                <div className="bg-arena-lightgray rounded-lg p-4 text-center">
                  <span className="text-xl font-mono">
                    {lastRemovedItem !== null ? lastRemovedItem : 'None'}
                  </span>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2">Message Box</h3>
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

export default ArrayVisualizer;
