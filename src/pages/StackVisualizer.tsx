
import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { pushToStack, popFromStack, peekStack, Message } from '../utils/dataStructures';

const StackVisualizer: React.FC = () => {
  const [stack, setStack] = useState<(number | string)[]>([]);
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

  const handlePush = () => {
    if (!value) {
      addMessage({
        text: 'Please enter a value to push.',
        type: 'error',
      });
      return;
    }
    
    const result = pushToStack(stack, value);
    
    setStack(result.newStack);
    addMessage(result.message);
    setActiveIndex(result.newStack.length - 1);
    setTimeout(() => setActiveIndex(null), 2000);
    
    // Reset input
    setValue('');
  };
  
  const handlePop = () => {
    const result = popFromStack(stack);
    
    setStack(result.newStack);
    addMessage(result.message);
    
    if (result.newStack.length > 0) {
      setActiveIndex(result.newStack.length - 1);
      setTimeout(() => setActiveIndex(null), 2000);
    }
  };
  
  const handlePeek = () => {
    const result = peekStack(stack);
    addMessage(result.message);
    
    if (stack.length > 0) {
      setActiveIndex(stack.length - 1);
      setTimeout(() => setActiveIndex(null), 2000);
    }
  };
  
  const handleReset = () => {
    setStack([]);
    setActiveIndex(null);
    addMessage({
      text: 'Stack has been reset.',
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
          Stack <span className="text-arena-red">Visualizer</span>
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
              onClick={handlePush}
              className="ds-btn ds-btn-primary col-span-1"
            >
              Push
            </button>
            <button
              onClick={handlePop}
              className="ds-btn ds-btn-primary col-span-1"
            >
              Pop
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
            <h3 className="text-lg font-semibold mb-2">Stack Visualization:</h3>
            <div className="border border-gray-200 rounded-xl p-4 min-h-64 flex flex-col-reverse items-center justify-end">
              {stack.length === 0 ? (
                <p className="text-gray-500 italic">Stack is empty. Push elements to visualize.</p>
              ) : (
                <div className="w-full max-w-xs">
                  {[...stack].reverse().map((item, reversedIdx) => {
                    const actualIdx = stack.length - 1 - reversedIdx;
                    return (
                      <div
                        key={actualIdx}
                        className={`ds-visualizer-block w-full mb-1 ${
                          actualIdx === activeIndex ? 'ds-visualizer-block-active' : ''
                        }`}
                      >
                        <div className="flex justify-between items-center w-full">
                          {actualIdx === stack.length - 1 && (
                            <span className="text-xs text-arena-red font-semibold">TOP</span>
                          )}
                          <span className="font-mono">{item}</span>
                          <span className="text-sm text-gray-500">{actualIdx}</span>
                        </div>
                      </div>
                    );
                  })}
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
                <h3 className="text-lg font-semibold mb-2">Stack Size:</h3>
                <div className="bg-arena-lightgray rounded-lg p-4 text-center">
                  <span className="text-2xl font-bold">{stack.length}</span>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2">Top Element:</h3>
                <div className="bg-arena-lightgray rounded-lg p-4 text-center">
                  <span className="text-xl font-mono">
                    {stack.length > 0 ? stack[stack.length - 1] : 'None'}
                  </span>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2">Stack Operations:</h3>
                <div className="bg-arena-lightgray rounded-lg p-4">
                  <ul className="list-disc list-inside space-y-2 text-sm">
                    <li><strong>Push:</strong> Add an element to the top of the stack</li>
                    <li><strong>Pop:</strong> Remove the top element from the stack</li>
                    <li><strong>Peek:</strong> View the top element without removing it</li>
                    <li><strong>LIFO:</strong> Last In, First Out principle</li>
                  </ul>
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

export default StackVisualizer;
