
import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { 
  addFrontDeque,
  addRearDeque,
  removeFrontDeque,
  removeRearDeque,
  peekFrontDeque,
  peekRearDeque,
  Message 
} from '../utils/dataStructures';

const DequeVisualizer: React.FC = () => {
  const [deque, setDeque] = useState<(number | string)[]>([]);
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

  const handleAddFront = () => {
    if (!value) {
      addMessage({
        text: 'Please enter a value to add to the front.',
        type: 'error',
      });
      return;
    }
    
    const result = addFrontDeque(deque, value);
    
    setDeque(result.newDeque);
    addMessage(result.message);
    setActiveIndex(0);
    setTimeout(() => setActiveIndex(null), 2000);
    
    // Reset input
    setValue('');
  };
  
  const handleAddRear = () => {
    if (!value) {
      addMessage({
        text: 'Please enter a value to add to the rear.',
        type: 'error',
      });
      return;
    }
    
    const result = addRearDeque(deque, value);
    
    setDeque(result.newDeque);
    addMessage(result.message);
    setActiveIndex(result.newDeque.length - 1);
    setTimeout(() => setActiveIndex(null), 2000);
    
    // Reset input
    setValue('');
  };
  
  const handleRemoveFront = () => {
    const result = removeFrontDeque(deque);
    
    setDeque(result.newDeque);
    addMessage(result.message);
    
    if (result.newDeque.length > 0) {
      setActiveIndex(0);
      setTimeout(() => setActiveIndex(null), 2000);
    }
  };
  
  const handleRemoveRear = () => {
    const result = removeRearDeque(deque);
    
    setDeque(result.newDeque);
    addMessage(result.message);
    
    if (result.newDeque.length > 0) {
      setActiveIndex(result.newDeque.length - 1);
      setTimeout(() => setActiveIndex(null), 2000);
    }
  };
  
  const handlePeekFront = () => {
    const result = peekFrontDeque(deque);
    addMessage(result.message);
    
    if (deque.length > 0) {
      setActiveIndex(0);
      setTimeout(() => setActiveIndex(null), 2000);
    }
  };
  
  const handlePeekRear = () => {
    const result = peekRearDeque(deque);
    addMessage(result.message);
    
    if (deque.length > 0) {
      setActiveIndex(deque.length - 1);
      setTimeout(() => setActiveIndex(null), 2000);
    }
  };
  
  const handleReset = () => {
    setDeque([]);
    setActiveIndex(null);
    addMessage({
      text: 'Deque has been reset.',
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
          Deque <span className="text-arena-red">Visualizer</span>
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
          
          <div className="col-span-1 grid grid-cols-2 gap-2">
            <button
              onClick={handleAddFront}
              className="ds-btn ds-btn-primary col-span-1"
            >
              Add Front
            </button>
            <button
              onClick={handleAddRear}
              className="ds-btn ds-btn-primary col-span-1"
            >
              Add Rear
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <button
            onClick={handleRemoveFront}
            className="ds-btn ds-btn-primary col-span-1"
          >
            Remove Front
          </button>
          <button
            onClick={handleRemoveRear}
            className="ds-btn ds-btn-primary col-span-1"
          >
            Remove Rear
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <button
            onClick={handlePeekFront}
            className="ds-btn ds-btn-secondary col-span-1"
          >
            Peek Front
          </button>
          <button
            onClick={handlePeekRear}
            className="ds-btn ds-btn-secondary col-span-1"
          >
            Peek Rear
          </button>
          <button
            onClick={handleReset}
            className="ds-btn ds-btn-secondary col-span-1"
          >
            Reset
          </button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h3 className="text-lg font-semibold mb-2">Deque Visualization:</h3>
            <div className="border border-gray-200 rounded-xl p-6 min-h-64 flex items-center justify-center">
              {deque.length === 0 ? (
                <p className="text-gray-500 italic">Deque is empty. Add elements to visualize.</p>
              ) : (
                <div className="w-full flex flex-col items-center">
                  <div className="flex w-full max-w-md justify-between mb-4">
                    <div className="text-sm font-semibold text-arena-red">FRONT</div>
                    <div className="text-sm font-semibold text-arena-red">REAR</div>
                  </div>
                  <div className="flex justify-center gap-4 w-full">
                    {deque.map((item, idx) => (
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
                <h3 className="text-lg font-semibold mb-2">Deque Size:</h3>
                <div className="bg-arena-lightgray rounded-lg p-4 text-center">
                  <span className="text-2xl font-bold">{deque.length}</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-base font-semibold mb-2">Front:</h3>
                  <div className="bg-arena-lightgray rounded-lg p-3 text-center">
                    <span className="text-lg font-mono">
                      {deque.length > 0 ? deque[0] : 'None'}
                    </span>
                  </div>
                </div>
                <div>
                  <h3 className="text-base font-semibold mb-2">Rear:</h3>
                  <div className="bg-arena-lightgray rounded-lg p-3 text-center">
                    <span className="text-lg font-mono">
                      {deque.length > 0 ? deque[deque.length - 1] : 'None'}
                    </span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2">Deque Operations:</h3>
                <div className="bg-arena-lightgray rounded-lg p-4">
                  <ul className="list-disc list-inside space-y-2 text-sm">
                    <li><strong>Add Front:</strong> Add an element to the front</li>
                    <li><strong>Add Rear:</strong> Add an element to the rear</li>
                    <li><strong>Remove Front:</strong> Remove the front element</li>
                    <li><strong>Remove Rear:</strong> Remove the rear element</li>
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

export default DequeVisualizer;
