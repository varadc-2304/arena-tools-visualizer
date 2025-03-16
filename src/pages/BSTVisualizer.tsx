
import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

interface BSTNode {
  value: number;
  left: BSTNode | null;
  right: BSTNode | null;
}

interface Message {
  text: string;
  type: 'info' | 'success' | 'error' | 'warning';
}

const BSTVisualizer: React.FC = () => {
  const [root, setRoot] = useState<BSTNode | null>(null);
  const [value, setValue] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeNode, setActiveNode] = useState<number | null>(null);
  
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

  const insertNode = (node: BSTNode | null, value: number): BSTNode => {
    if (node === null) {
      return { value, left: null, right: null };
    }
    
    if (value < node.value) {
      node.left = insertNode(node.left, value);
    } else if (value > node.value) {
      node.right = insertNode(node.right, value);
    }
    
    return node;
  };

  const removeNode = (node: BSTNode | null, value: number): BSTNode | null => {
    if (node === null) return null;
    
    if (value < node.value) {
      node.left = removeNode(node.left, value);
    } else if (value > node.value) {
      node.right = removeNode(node.right, value);
    } else {
      // Node with only one child or no child
      if (node.left === null) {
        return node.right;
      } else if (node.right === null) {
        return node.left;
      }
      
      // Node with two children
      // Get the inorder successor (smallest in the right subtree)
      let temp = node.right;
      let minVal = temp.value;
      
      while (temp.left !== null) {
        temp = temp.left;
        minVal = temp.value;
      }
      
      node.value = minVal;
      node.right = removeNode(node.right, minVal);
    }
    
    return node;
  };

  const searchNode = (node: BSTNode | null, value: number): boolean => {
    if (node === null) return false;
    
    if (node.value === value) return true;
    
    if (value < node.value) {
      return searchNode(node.left, value);
    } else {
      return searchNode(node.right, value);
    }
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
    
    const exists = searchNode(root, numValue);
    if (exists) {
      addMessage({
        text: `Value ${numValue} already exists in the BST.`,
        type: 'error',
      });
      return;
    }
    
    const newRoot = root ? insertNode({ ...root }, numValue) : insertNode(null, numValue);
    setRoot(newRoot);
    
    addMessage({
      text: `Inserted ${numValue} into the BST.`,
      type: 'success',
    });
    setActiveNode(numValue);
    setTimeout(() => setActiveNode(null), 2000);
    
    setValue('');
  };
  
  const handleRemove = () => {
    if (!value || isNaN(Number(value))) {
      addMessage({
        text: 'Please enter a valid numeric value.',
        type: 'error',
      });
      return;
    }
    
    if (!root) {
      addMessage({
        text: 'BST is empty. Nothing to remove.',
        type: 'error',
      });
      return;
    }
    
    const numValue = Number(value);
    
    const exists = searchNode(root, numValue);
    if (!exists) {
      addMessage({
        text: `Value ${numValue} does not exist in the BST.`,
        type: 'error',
      });
      return;
    }
    
    const newRoot = removeNode({ ...root }, numValue);
    setRoot(newRoot);
    
    addMessage({
      text: `Removed ${numValue} from the BST.`,
      type: 'success',
    });
    
    setValue('');
  };
  
  const handleSearch = () => {
    if (!value || isNaN(Number(value))) {
      addMessage({
        text: 'Please enter a valid numeric value.',
        type: 'error',
      });
      return;
    }
    
    if (!root) {
      addMessage({
        text: 'BST is empty. Nothing to search.',
        type: 'error',
      });
      return;
    }
    
    const numValue = Number(value);
    
    const exists = searchNode(root, numValue);
    
    if (exists) {
      addMessage({
        text: `Found ${numValue} in the BST.`,
        type: 'success',
      });
      setActiveNode(numValue);
      setTimeout(() => setActiveNode(null), 2000);
    } else {
      addMessage({
        text: `Value ${numValue} not found in the BST.`,
        type: 'error',
      });
    }
    
    setValue('');
  };
  
  const handleReset = () => {
    setRoot(null);
    setActiveNode(null);
    addMessage({
      text: 'BST has been reset.',
      type: 'info',
    });
  };

  const renderBSTNode = (
    node: BSTNode | null,
    x: number,
    y: number,
    level: number,
    maxWidth: number,
    isLeft: boolean = false,
    isRight: boolean = false
  ) => {
    if (!node) return null;
    
    const offset = maxWidth / Math.pow(2, level + 1);
    const isActive = node.value === activeNode;
    
    return (
      <g>
        {/* Draw lines to children */}
        {node.left && (
          <line
            x1={x}
            y1={y + 15}
            x2={x - offset}
            y2={y + 70}
            stroke="#6b7280"
            strokeWidth="1.5"
          />
        )}
        {node.right && (
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
          {node.value}
        </text>
        
        {/* Recursively render children */}
        {node.left && renderBSTNode(node.left, x - offset, y + 80, level + 1, maxWidth, true, false)}
        {node.right && renderBSTNode(node.right, x + offset, y + 80, level + 1, maxWidth, false, true)}
      </g>
    );
  };

  // Calculate the height of the BST
  const getHeight = (node: BSTNode | null): number => {
    if (!node) return 0;
    return Math.max(getHeight(node.left), getHeight(node.right)) + 1;
  };

  const bstHeight = getHeight(root);
  const svgWidth = 600;
  const svgHeight = bstHeight * 100 + 50;

  return (
    <div className="min-h-screen pt-20 pb-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex items-center mb-8">
        <Link to="/" className="flex items-center text-arena-red hover:text-arena-red/80 mr-4">
          <ArrowLeft className="h-5 w-5 mr-1" />
          <span>Back</span>
        </Link>
        <h1 className="text-4xl font-bold text-center text-arena-darkgray flex-grow mr-10">
          Binary Search Tree <span className="text-arena-red">Visualizer</span>
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
              onClick={handleRemove}
              className="ds-btn ds-btn-primary col-span-1"
            >
              Remove
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
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
            <h3 className="text-lg font-semibold mb-2">BST Visualization:</h3>
            <div className="border border-gray-200 rounded-xl p-4 min-h-64 overflow-auto">
              {!root ? (
                <div className="flex items-center justify-center h-64">
                  <p className="text-gray-500 italic">BST is empty. Insert nodes to visualize.</p>
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <svg width={svgWidth} height={svgHeight} className="mx-auto">
                    {renderBSTNode(root, svgWidth / 2, 40, 0, svgWidth - 40)}
                  </svg>
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
                <h3 className="text-lg font-semibold mb-2">BST Height:</h3>
                <div className="bg-arena-lightgray rounded-lg p-4 text-center">
                  <span className="text-2xl font-bold">{bstHeight}</span>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2">BST Operations:</h3>
                <div className="bg-arena-lightgray rounded-lg p-4">
                  <ul className="list-disc list-inside space-y-2 text-sm">
                    <li><strong>Insert:</strong> Add a node to the BST</li>
                    <li><strong>Remove:</strong> Delete a node from the BST</li>
                    <li><strong>Search:</strong> Find a node in the BST</li>
                    <li><strong>BST Property:</strong> For any node, all values in its left subtree are less than the node's value, and all values in its right subtree are greater than the node's value</li>
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

export default BSTVisualizer;
