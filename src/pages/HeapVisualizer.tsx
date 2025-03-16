
import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

interface Message {
  text: string;
  type: 'info' | 'success' | 'error' | 'warning';
}

const HeapVisualizer: React.FC = () => {
  const [heap, setHeap] = useState<number[]>([]);
  const [value, setValue] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [heapType, setHeapType] = useState<'min' | 'max'>('min');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  }, [messages]);

  const addMessage = (message: Message) => {
    setMessages(prev => [...prev, message]);
    
    if (message.type === 'error') {
      toast.error(message.text);
    } else if (message.type === 'success') {
      toast.success(message.text);
    } else {
      toast.info(message.text);
    }
  };

  const getParentIndex = (index: number) => {
    return Math.floor((index - 1) / 2);
  };

  const getLeftChildIndex = (index: number) => {
    return 2 * index + 1;
  };

  const getRightChildIndex = (index: number) => {
    return 2 * index + 2;
  };

  const shouldSwap = (parent: number, child: number) => {
    if (heapType === 'min') {
      return parent > child;
    } else {
      return parent < child;
    }
  };

  const heapifyUp = (newHeap: number[], index: number) => {
    if (index === 0) return newHeap;
    
    const parentIndex = getParentIndex(index);
    
    if (shouldSwap(newHeap[parentIndex], newHeap[index])) {
      // Swap with parent
      [newHeap[parentIndex], newHeap[index]] = [newHeap[index], newHeap[parentIndex]];
      return heapifyUp(newHeap, parentIndex);
    }
    
    return newHeap;
  };

  const heapifyDown = (newHeap: number[], index: number) => {
    const leftIndex = getLeftChildIndex(index);
    const rightIndex = getRightChildIndex(index);
    let largestOrSmallestIndex = index;
    
    if (leftIndex < newHeap.length && shouldSwap(newHeap[largestOrSmallestIndex], newHeap[leftIndex])) {
      largestOrSmallestIndex = leftIndex;
    }
    
    if (rightIndex < newHeap.length && shouldSwap(newHeap[largestOrSmallestIndex], newHeap[rightIndex])) {
      largestOrSmallestIndex = rightIndex;
    }
    
    if (largestOrSmallestIndex !== index) {
      // Swap
      [newHeap[index], newHeap[largestOrSmallestIndex]] = [newHeap[largestOrSmallestIndex], newHeap[index]];
      return heapifyDown(newHeap, largestOrSmallestIndex);
    }
    
    return newHeap;
  };

  const handleInsert = () => {
    if (!value || isNaN(Number(value))) {
      addMessage({
        text: 'Please enter a valid numeric value.',
        type: 'error',
      });
      return;
    }
    
    const numValue = Number(value);
    const newHeap = [...heap, numValue];
    const finalHeap = heapifyUp(newHeap, newHeap.length - 1);
    
    setHeap(finalHeap);
    addMessage({
      text: `Inserted ${numValue} into the ${heapType} heap.`,
      type: 'success',
    });
    setActiveIndex(newHeap.length - 1);
    setTimeout(() => setActiveIndex(null), 2000);
    
    setValue('');
  };
  
  const handleExtract = () => {
    if (heap.length === 0) {
      addMessage({
        text: 'Heap is empty.',
        type: 'error',
      });
      return;
    }
    
    const root = heap[0];
    const lastItem = heap.pop();
    
    if (heap.length === 0) {
      setHeap([]);
      addMessage({
        text: `Extracted ${root} from the ${heapType} heap.`,
        type: 'success',
      });
      return;
    }
    
    const newHeap = [...heap];
    newHeap[0] = lastItem!;
    const finalHeap = heapifyDown(newHeap, 0);
    
    setHeap(finalHeap);
    addMessage({
      text: `Extracted ${root} from the ${heapType} heap.`,
      type: 'success',
    });
    setActiveIndex(0);
    setTimeout(() => setActiveIndex(null), 2000);
  };
  
  const handleToggleHeapType = () => {
    const newType = heapType === 'min' ? 'max' : 'min';
    setHeapType(newType);
    
    if (heap.length > 0) {
      // Rebuild the heap with the new type
      const newHeap = [...heap];
      for (let i = Math.floor(newHeap.length / 2) - 1; i >= 0; i--) {
        heapifyDown(newHeap, i);
      }
      
      setHeap(newHeap);
      addMessage({
        text: `Switched to ${newType} heap.`,
        type: 'info',
      });
    } else {
      addMessage({
        text: `Switched to ${newType} heap.`,
        type: 'info',
      });
    }
  };
  
  const handleReset = () => {
    setHeap([]);
    setActiveIndex(null);
    addMessage({
      text: `${heapType} heap has been reset.`,
      type: 'info',
    });
  };

  // Calculate the height of the heap
  const getHeapHeight = (size: number): number => {
    return size === 0 ? 0 : Math.floor(Math.log2(size)) + 1;
  };

  const heapHeight = getHeapHeight(heap.length);
  // Adjust width and height based on the heap size
  const svgWidth = Math.max(600, heapHeight * 150);
  const svgHeight = Math.max(300, heapHeight * 100);

  const renderHeapNode = (index: number, x: number, y: number, level: number, maxWidth: number) => {
    if (index >= heap.length) return null;
    
    // Adjust offset to better space nodes
    const offset = maxWidth / Math.pow(2, level + 1);
    const isActive = index === activeIndex;
    
    return (
      <g key={index}>
        {/* Draw lines to children */}
        {getLeftChildIndex(index) < heap.length && (
          <line
            x1={x}
            y1={y + 15}
            x2={x - offset}
            y2={y + 70}
            stroke="#6b7280"
            strokeWidth="1.5"
          />
        )}
        {getRightChildIndex(index) < heap.length && (
          <line
            x1={x}
            y1={y + 15}
            x2={x + offset}
            y2={y + 70}
            stroke="#6b7280"
            strokeWidth="1.5"
          />
        )}
        
        {/* Draw the node */}
        <circle
          cx={x}
          cy={y}
          r={20}
          fill={isActive ? "#f87171" : "#ef4444"}
          stroke="#991b1b"
          strokeWidth="2"
        />
        <text
          x={x}
          y={y + 5}
          textAnchor="middle"
          fill="white"
          fontWeight="bold"
          fontSize="14"
        >
          {heap[index]}
        </text>
        
        {/* Recursively render children */}
        {renderHeapNode(getLeftChildIndex(index), x - offset, y + 80, level + 1, maxWidth)}
        {renderHeapNode(getRightChildIndex(index), x + offset, y + 80, level + 1, maxWidth)}
      </g>
    );
  };

  return (
    <div className="min-h-screen pt-20 pb-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex items-center mb-8">
        <Link to="/" className="flex items-center text-arena-red hover:text-arena-red/80 mr-4">
          <ArrowLeft className="h-5 w-5 mr-1" />
          <span>Back</span>
        </Link>
        <h1 className="text-4xl font-bold text-center text-arena-darkgray flex-grow mr-10">
          Heap <span className="text-arena-red">Visualizer</span>
        </h1>
      </div>
      
      <div className="bg-white rounded-2xl shadow-md p-6 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="col-span-1">
            <label htmlFor="value" className="block text-sm font-medium text-gray-700 mb-1">
              Value (Numbers Only)
            </label>
            <input
              id="value"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Enter a numeric value"
              className="ds-input w-full"
              type="number"
            />
          </div>
          
          <div className="col-span-1 grid grid-cols-2 gap-2">
            <button
              onClick={handleInsert}
              className="ds-btn ds-btn-primary col-span-1"
            >
              Insert
            </button>
            <button
              onClick={handleExtract}
              className="ds-btn ds-btn-primary col-span-1"
            >
              Extract {heapType === 'min' ? 'Min' : 'Max'}
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <button
            onClick={handleToggleHeapType}
            className="ds-btn ds-btn-primary col-span-1"
          >
            Switch to {heapType === 'min' ? 'Max' : 'Min'} Heap
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
            <h3 className="text-lg font-semibold mb-2">Heap Visualization:</h3>
            <div className="border border-gray-200 rounded-xl p-4 min-h-64 overflow-auto">
              {heap.length === 0 ? (
                <div className="flex items-center justify-center h-64">
                  <p className="text-gray-500 italic">Heap is empty. Insert nodes to visualize.</p>
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <div className="overflow-auto" style={{ maxWidth: '100%', maxHeight: '500px' }}>
                    <svg width={svgWidth} height={svgHeight} className="mx-auto">
                      {renderHeapNode(0, svgWidth / 2, 40, 0, svgWidth - 80)}
                    </svg>
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
                <h3 className="text-lg font-semibold mb-2">Heap Type:</h3>
                <div className="bg-arena-lightgray rounded-lg p-4 text-center">
                  <span className="text-xl font-bold capitalize">{heapType} Heap</span>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2">Heap Size:</h3>
                <div className="bg-arena-lightgray rounded-lg p-4 text-center">
                  <span className="text-2xl font-bold">{heap.length}</span>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2">Heap Operations:</h3>
                <div className="bg-arena-lightgray rounded-lg p-4">
                  <ul className="list-disc list-inside space-y-2 text-sm">
                    <li><strong>Insert:</strong> Add a value to the heap</li>
                    <li><strong>Extract {heapType === 'min' ? 'Min' : 'Max'}:</strong> Remove and return the {heapType === 'min' ? 'minimum' : 'maximum'} value</li>
                    <li><strong>Switch Type:</strong> Toggle between min and max heap</li>
                    <li><strong>{heapType.charAt(0).toUpperCase() + heapType.slice(1)} Heap Property:</strong> For any node, the value is {heapType === 'min' ? 'less than or equal to' : 'greater than or equal to'} its children</li>
                  </ul>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2">Root Value</h3>
                <div className="bg-arena-lightgray rounded-lg p-4 text-center">
                  <span className="text-xl font-mono">
                    {heap.length > 0 ? heap[0] : 'None'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeapVisualizer;
