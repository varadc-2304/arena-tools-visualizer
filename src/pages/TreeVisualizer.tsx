
import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

interface TreeNode {
  value: string | number;
  children: TreeNode[];
}

interface Message {
  text: string;
  type: 'info' | 'success' | 'error' | 'warning';
}

const TreeVisualizer: React.FC = () => {
  const [root, setRoot] = useState<TreeNode | null>(null);
  const [value, setValue] = useState<string>('');
  const [parentValue, setParentValue] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeNode, setActiveNode] = useState<string | number | null>(null);
  
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

  const addNodeToTree = (
    node: TreeNode | null,
    parentVal: string | number,
    newValue: string | number
  ): TreeNode | null => {
    if (!node) return null;
    
    if (node.value === parentVal) {
      node.children.push({ value: newValue, children: [] });
      return node;
    }
    
    for (let i = 0; i < node.children.length; i++) {
      const updatedChild = addNodeToTree(node.children[i], parentVal, newValue);
      if (updatedChild) {
        node.children[i] = updatedChild;
        return node;
      }
    }
    
    return null;
  };

  const handleAddRoot = () => {
    if (!value) {
      addMessage({
        text: 'Please enter a value for the root node.',
        type: 'error',
      });
      return;
    }
    
    if (root) {
      addMessage({
        text: 'Root already exists. Add child nodes instead.',
        type: 'error',
      });
      return;
    }
    
    setRoot({ value, children: [] });
    addMessage({
      text: `Added ${value} as the root node.`,
      type: 'success',
    });
    setActiveNode(value);
    setTimeout(() => setActiveNode(null), 2000);
    
    setValue('');
  };
  
  const handleAddChild = () => {
    if (!value || !parentValue) {
      addMessage({
        text: 'Please enter both child value and parent value.',
        type: 'error',
      });
      return;
    }
    
    if (!root) {
      addMessage({
        text: 'Please add a root node first.',
        type: 'error',
      });
      return;
    }
    
    const updatedRoot = addNodeToTree(root, parentValue, value);
    
    if (!updatedRoot) {
      addMessage({
        text: `Parent node with value ${parentValue} not found.`,
        type: 'error',
      });
      return;
    }
    
    setRoot({ ...updatedRoot });
    addMessage({
      text: `Added ${value} as a child of ${parentValue}.`,
      type: 'success',
    });
    setActiveNode(value);
    setTimeout(() => setActiveNode(null), 2000);
    
    setValue('');
    setParentValue('');
  };
  
  const handleReset = () => {
    setRoot(null);
    setActiveNode(null);
    addMessage({
      text: 'Tree has been reset.',
      type: 'info',
    });
  };

  // Calculate the width needed for the tree visualization
  const calculateTreeWidth = (node: TreeNode | null): number => {
    if (!node) return 0;
    if (node.children.length === 0) return 1;
    
    let totalWidth = 0;
    for (const child of node.children) {
      totalWidth += calculateTreeWidth(child);
    }
    
    return Math.max(1, totalWidth);
  };

  const treeWidth = root ? calculateTreeWidth(root) * 80 : 0;
  const svgWidth = Math.max(600, treeWidth);
  
  const renderTreeNode = (node: TreeNode, x: number, y: number, level: number = 0, totalWidth: number = svgWidth, indexInLevel: number = 0, totalInLevel: number = 1) => {
    const isActive = node.value === activeNode;
    const nodeWidth = totalWidth / totalInLevel;
    const nodeX = x + (indexInLevel * nodeWidth) + (nodeWidth / 2);
    
    return (
      <g key={`${node.value}-${level}-${indexInLevel}`}>
        {/* Draw node */}
        <circle
          cx={nodeX}
          cy={y}
          r={20}
          fill={isActive ? "#f87171" : "#ef4444"}
          stroke="#991b1b"
          strokeWidth="2"
        />
        <text
          x={nodeX}
          y={y + 5}
          textAnchor="middle"
          fill="white"
          fontWeight="bold"
          fontSize="14"
        >
          {node.value}
        </text>
        
        {/* Draw lines to children and render children */}
        {node.children.length > 0 && (
          <>
            {node.children.map((child, idx) => (
              <line
                key={`line-${node.value}-${child.value}`}
                x1={nodeX}
                y1={y + 20}
                x2={nodeX - ((node.children.length - 1) * 50 / 2) + (idx * 50)}
                y2={y + 60}
                stroke="#6b7280"
                strokeWidth="1.5"
              />
            ))}
            <g>
              {node.children.map((child, idx) => 
                renderTreeNode(
                  child, 
                  x, 
                  y + 80, 
                  level + 1, 
                  totalWidth, 
                  indexInLevel * totalInLevel + idx, 
                  totalInLevel * node.children.length
                )
              )}
            </g>
          </>
        )}
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
          Tree <span className="text-arena-red">Visualizer</span>
        </h1>
      </div>
      
      <div className="bg-white rounded-2xl shadow-md p-6 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="col-span-1">
            <label htmlFor="value" className="block text-sm font-medium text-gray-700 mb-1">
              Node Value
            </label>
            <input
              id="value"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Enter a value"
              className="ds-input w-full"
            />
          </div>
          
          <div className="col-span-1">
            <label htmlFor="parentValue" className="block text-sm font-medium text-gray-700 mb-1">
              Parent Node Value (for adding child)
            </label>
            <input
              id="parentValue"
              value={parentValue}
              onChange={(e) => setParentValue(e.target.value)}
              placeholder="Enter parent value"
              className="ds-input w-full"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <button
            onClick={handleAddRoot}
            className="ds-btn ds-btn-primary col-span-1"
          >
            Add Root
          </button>
          <button
            onClick={handleAddChild}
            className="ds-btn ds-btn-primary col-span-1"
          >
            Add Child
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
            <h3 className="text-lg font-semibold mb-2">Tree Visualization:</h3>
            <div className="border border-gray-200 rounded-xl p-4 min-h-64 overflow-auto">
              {!root ? (
                <div className="flex items-center justify-center h-64">
                  <p className="text-gray-500 italic">Tree is empty. Add a root node to visualize.</p>
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <div className="overflow-auto" style={{ maxWidth: '100%', maxHeight: '500px' }}>
                    <svg width={svgWidth} height="400" className="mx-auto">
                      {renderTreeNode(root, 0, 40, 0)}
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
                <h3 className="text-lg font-semibold mb-2">Tree Operations:</h3>
                <div className="bg-arena-lightgray rounded-lg p-4">
                  <ul className="list-disc list-inside space-y-2 text-sm">
                    <li><strong>Add Root:</strong> Create the root node of the tree</li>
                    <li><strong>Add Child:</strong> Add a child node to an existing node</li>
                    <li><strong>Reset:</strong> Clear the entire tree</li>
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
              
              <div>
                <h3 className="text-lg font-semibold mb-2">Tree Information</h3>
                <div className="bg-arena-lightgray rounded-lg p-4">
                  <p className="mb-2">
                    <strong>Has Root:</strong> {root ? 'Yes' : 'No'}
                  </p>
                  {root && (
                    <p>
                      <strong>Root Value:</strong> {root.value}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TreeVisualizer;
