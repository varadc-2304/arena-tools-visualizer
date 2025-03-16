
import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { 
  LinkedListNode,
  appendToLinkedList,
  prependToLinkedList,
  removeFromLinkedList,
  searchLinkedList,
  Message 
} from '../utils/dataStructures';

const LinkedListVisualizer: React.FC = () => {
  const [head, setHead] = useState<LinkedListNode | null>(null);
  const [value, setValue] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeValue, setActiveValue] = useState<string | number | null>(null);
  const [linkedListArray, setLinkedListArray] = useState<(string | number)[]>([]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  }, [messages]);
  
  // Convert linked list to array for visualization
  useEffect(() => {
    const arr: (string | number)[] = [];
    let current = head;
    
    while (current) {
      arr.push(current.value);
      current = current.next;
    }
    
    setLinkedListArray(arr);
  }, [head]);

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

  const handleAppend = () => {
    if (!value) {
      addMessage({
        text: 'Please enter a value to append.',
        type: 'error',
      });
      return;
    }
    
    const result = appendToLinkedList(head, value);
    
    setHead(result.newHead);
    addMessage(result.message);
    setActiveValue(value);
    setTimeout(() => setActiveValue(null), 2000);
    
    // Reset input
    setValue('');
  };
  
  const handlePrepend = () => {
    if (!value) {
      addMessage({
        text: 'Please enter a value to prepend.',
        type: 'error',
      });
      return;
    }
    
    const result = prependToLinkedList(head, value);
    
    setHead(result.newHead);
    addMessage(result.message);
    setActiveValue(value);
    setTimeout(() => setActiveValue(null), 2000);
    
    // Reset input
    setValue('');
  };
  
  const handleRemove = () => {
    if (!value) {
      addMessage({
        text: 'Please enter a value to remove.',
        type: 'error',
      });
      return;
    }
    
    const result = removeFromLinkedList(head, value);
    
    setHead(result.newHead);
    addMessage(result.message);
    setActiveValue(value);
    setTimeout(() => setActiveValue(null), 2000);
    
    // Reset input
    setValue('');
  };
  
  const handleSearch = () => {
    if (!value) {
      addMessage({
        text: 'Please enter a value to search for.',
        type: 'error',
      });
      return;
    }
    
    const result = searchLinkedList(head, value);
    addMessage(result.message);
    setActiveValue(value);
    setTimeout(() => setActiveValue(null), 2000);
    
    // Reset input
    setValue('');
  };
  
  const handleReset = () => {
    setHead(null);
    setActiveValue(null);
    addMessage({
      text: 'Linked list has been reset.',
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
          Linked List <span className="text-arena-red">Visualizer</span>
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
              onClick={handleAppend}
              className="ds-btn ds-btn-primary col-span-1"
            >
              Append
            </button>
            <button
              onClick={handlePrepend}
              className="ds-btn ds-btn-primary col-span-1"
            >
              Prepend
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <button
            onClick={handleRemove}
            className="ds-btn ds-btn-primary col-span-1"
          >
            Remove
          </button>
          <button
            onClick={handleSearch}
            className="ds-btn ds-btn-primary col-span-1"
          >
            Search
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
            <h3 className="text-lg font-semibold mb-2">Linked List Visualization:</h3>
            <div className="border border-gray-200 rounded-xl p-8 min-h-64 flex items-center justify-center">
              {linkedListArray.length === 0 ? (
                <p className="text-gray-500 italic">Linked list is empty. Add elements to visualize.</p>
              ) : (
                <div className="flex flex-col w-full max-w-4xl">
                  <div className="flex items-center justify-center mb-2">
                    <div className="px-3 py-1 bg-arena-red text-white text-sm rounded-md">
                      Head
                    </div>
                  </div>
                  <div className="flex items-center justify-center">
                    {linkedListArray.map((item, idx) => (
                      <React.Fragment key={idx}>
                        <div 
                          className={`ds-visualizer-block rounded-full ${
                            item === activeValue ? 'ds-visualizer-block-active' : ''
                          }`}
                        >
                          <span className="font-mono">{item}</span>
                        </div>
                        {idx < linkedListArray.length - 1 && (
                          <ArrowRight className="mx-2 text-arena-red" />
                        )}
                      </React.Fragment>
                    ))}
                    <div className="ml-2 w-4 h-0.5 bg-gray-300"></div>
                    <div className="border border-gray-300 rounded-md px-2 py-1 ml-2 text-sm text-gray-500">
                      null
                    </div>
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
                <h3 className="text-lg font-semibold mb-2">Linked List Size:</h3>
                <div className="bg-arena-lightgray rounded-lg p-4 text-center">
                  <span className="text-2xl font-bold">{linkedListArray.length}</span>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2">Head Value:</h3>
                <div className="bg-arena-lightgray rounded-lg p-4 text-center">
                  <span className="text-xl font-mono">
                    {linkedListArray.length > 0 ? linkedListArray[0] : 'null'}
                  </span>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2">Linked List Operations:</h3>
                <div className="bg-arena-lightgray rounded-lg p-4">
                  <ul className="list-disc list-inside space-y-2 text-sm">
                    <li><strong>Append:</strong> Add a node to the end of the list</li>
                    <li><strong>Prepend:</strong> Add a node to the beginning of the list</li>
                    <li><strong>Remove:</strong> Remove a node with the specified value</li>
                    <li><strong>Search:</strong> Find a node with the specified value</li>
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

export default LinkedListVisualizer;
