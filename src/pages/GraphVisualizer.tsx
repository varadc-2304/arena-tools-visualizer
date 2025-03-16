
import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

interface GraphNode {
  id: string;
  x: number;
  y: number;
}

interface GraphEdge {
  source: string;
  target: string;
  directed: boolean;
}

interface Message {
  text: string;
  type: 'info' | 'success' | 'error' | 'warning';
}

const GraphVisualizer: React.FC = () => {
  const [nodes, setNodes] = useState<GraphNode[]>([]);
  const [edges, setEdges] = useState<GraphEdge[]>([]);
  const [nodeName, setNodeName] = useState<string>('');
  const [sourceNode, setSourceNode] = useState<string>('');
  const [targetNode, setTargetNode] = useState<string>('');
  const [isDirected, setIsDirected] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
  const [activeEdge, setActiveEdge] = useState<{source: string, target: string} | null>(null);
  
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

  const getRandomPosition = () => {
    // Generate a position not too close to the edges
    const width = 500;
    const height = 300;
    const padding = 50;
    
    return {
      x: Math.random() * (width - 2 * padding) + padding,
      y: Math.random() * (height - 2 * padding) + padding
    };
  };

  const handleAddNode = () => {
    if (!nodeName) {
      addMessage({
        text: 'Please enter a node name.',
        type: 'error',
      });
      return;
    }
    
    if (nodes.some(node => node.id === nodeName)) {
      addMessage({
        text: `Node "${nodeName}" already exists.`,
        type: 'error',
      });
      return;
    }
    
    const position = getRandomPosition();
    const newNode: GraphNode = {
      id: nodeName,
      x: position.x,
      y: position.y
    };
    
    setNodes([...nodes, newNode]);
    addMessage({
      text: `Added node "${nodeName}".`,
      type: 'success',
    });
    setActiveNodeId(nodeName);
    setTimeout(() => setActiveNodeId(null), 2000);
    
    setNodeName('');
  };
  
  const handleAddEdge = () => {
    if (!sourceNode || !targetNode) {
      addMessage({
        text: 'Please select both source and target nodes.',
        type: 'error',
      });
      return;
    }
    
    if (sourceNode === targetNode) {
      addMessage({
        text: 'Self-loops are not supported in this visualizer.',
        type: 'error',
      });
      return;
    }
    
    const edgeExists = edges.some(
      edge => (edge.source === sourceNode && edge.target === targetNode) || 
             (!isDirected && edge.source === targetNode && edge.target === sourceNode)
    );
    
    if (edgeExists) {
      addMessage({
        text: 'This edge already exists.',
        type: 'error',
      });
      return;
    }
    
    const newEdge: GraphEdge = {
      source: sourceNode,
      target: targetNode,
      directed: isDirected
    };
    
    setEdges([...edges, newEdge]);
    addMessage({
      text: `Added ${isDirected ? 'directed' : 'undirected'} edge from "${sourceNode}" to "${targetNode}".`,
      type: 'success',
    });
    setActiveEdge({source: sourceNode, target: targetNode});
    setTimeout(() => setActiveEdge(null), 2000);
    
    setSourceNode('');
    setTargetNode('');
  };
  
  const handleRemoveNode = () => {
    if (!nodeName) {
      addMessage({
        text: 'Please enter a node name to remove.',
        type: 'error',
      });
      return;
    }
    
    const nodeExists = nodes.some(node => node.id === nodeName);
    
    if (!nodeExists) {
      addMessage({
        text: `Node "${nodeName}" does not exist.`,
        type: 'error',
      });
      return;
    }
    
    // Remove the node
    const newNodes = nodes.filter(node => node.id !== nodeName);
    
    // Remove any edges connected to this node
    const newEdges = edges.filter(
      edge => edge.source !== nodeName && edge.target !== nodeName
    );
    
    setNodes(newNodes);
    setEdges(newEdges);
    addMessage({
      text: `Removed node "${nodeName}" and all connected edges.`,
      type: 'success',
    });
    
    setNodeName('');
  };
  
  const handleRemoveEdge = () => {
    if (!sourceNode || !targetNode) {
      addMessage({
        text: 'Please select both source and target nodes.',
        type: 'error',
      });
      return;
    }
    
    const edgeIndex = edges.findIndex(
      edge => (edge.source === sourceNode && edge.target === targetNode) || 
             (!edge.directed && edge.source === targetNode && edge.target === sourceNode)
    );
    
    if (edgeIndex === -1) {
      addMessage({
        text: 'This edge does not exist.',
        type: 'error',
      });
      return;
    }
    
    const newEdges = [...edges];
    newEdges.splice(edgeIndex, 1);
    
    setEdges(newEdges);
    addMessage({
      text: `Removed edge between "${sourceNode}" and "${targetNode}".`,
      type: 'success',
    });
    
    setSourceNode('');
    setTargetNode('');
  };
  
  const handleReset = () => {
    setNodes([]);
    setEdges([]);
    setNodeName('');
    setSourceNode('');
    setTargetNode('');
    setActiveNodeId(null);
    setActiveEdge(null);
    addMessage({
      text: 'Graph has been reset.',
      type: 'info',
    });
  };

  // Helper function to calculate midpoint of a line
  const midpoint = (x1: number, y1: number, x2: number, y2: number) => {
    return {
      x: (x1 + x2) / 2,
      y: (y1 + y2) / 2
    };
  };

  // Helper function to calculate the angle of a line
  const lineAngle = (x1: number, y1: number, x2: number, y2: number) => {
    return Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
  };

  return (
    <div className="min-h-screen pt-20 pb-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex items-center mb-8">
        <Link to="/" className="flex items-center text-arena-red hover:text-arena-red/80 mr-4">
          <ArrowLeft className="h-5 w-5 mr-1" />
          <span>Back</span>
        </Link>
        <h1 className="text-4xl font-bold text-center text-arena-darkgray flex-grow mr-10">
          Graph <span className="text-arena-red">Visualizer</span>
        </h1>
      </div>
      
      <div className="bg-white rounded-2xl shadow-md p-6 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="col-span-1">
            <label htmlFor="nodeName" className="block text-sm font-medium text-gray-700 mb-1">
              Node Name
            </label>
            <input
              id="nodeName"
              value={nodeName}
              onChange={(e) => setNodeName(e.target.value)}
              placeholder="Enter node name"
              className="ds-input w-full"
            />
          </div>
          
          <div className="col-span-1 grid grid-cols-2 gap-2">
            <button
              onClick={handleAddNode}
              className="ds-btn ds-btn-primary col-span-1"
            >
              Add Node
            </button>
            <button
              onClick={handleRemoveNode}
              className="ds-btn ds-btn-primary col-span-1"
            >
              Remove Node
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="col-span-1">
            <label htmlFor="sourceNode" className="block text-sm font-medium text-gray-700 mb-1">
              Source Node
            </label>
            <select
              id="sourceNode"
              value={sourceNode}
              onChange={(e) => setSourceNode(e.target.value)}
              className="ds-input w-full"
            >
              <option value="">Select Source Node</option>
              {nodes.map(node => (
                <option key={`source-${node.id}`} value={node.id}>{node.id}</option>
              ))}
            </select>
          </div>
          
          <div className="col-span-1">
            <label htmlFor="targetNode" className="block text-sm font-medium text-gray-700 mb-1">
              Target Node
            </label>
            <select
              id="targetNode"
              value={targetNode}
              onChange={(e) => setTargetNode(e.target.value)}
              className="ds-input w-full"
            >
              <option value="">Select Target Node</option>
              {nodes.map(node => (
                <option key={`target-${node.id}`} value={node.id}>{node.id}</option>
              ))}
            </select>
          </div>
          
          <div className="col-span-1 flex items-end">
            <label className="flex items-center space-x-2 mb-2 w-full">
              <input
                type="checkbox"
                checked={isDirected}
                onChange={() => setIsDirected(!isDirected)}
                className="form-checkbox h-5 w-5 text-arena-red"
              />
              <span className="text-sm font-medium text-gray-700">Directed Edge</span>
            </label>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <button
            onClick={handleAddEdge}
            className="ds-btn ds-btn-primary col-span-1"
          >
            Add Edge
          </button>
          <button
            onClick={handleRemoveEdge}
            className="ds-btn ds-btn-primary col-span-1"
          >
            Remove Edge
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
            <h3 className="text-lg font-semibold mb-2">Graph Visualization:</h3>
            <div className="border border-gray-200 rounded-xl p-4 min-h-96 overflow-auto">
              {nodes.length === 0 ? (
                <div className="flex items-center justify-center h-64">
                  <p className="text-gray-500 italic">Graph is empty. Add nodes and edges to visualize.</p>
                </div>
              ) : (
                <div className="relative h-96 w-full">
                  <svg width="100%" height="100%" viewBox="0 0 600 400" className="mx-auto">
                    {/* Draw edges */}
                    {edges.map((edge, idx) => {
                      const sourceNode = nodes.find(n => n.id === edge.source);
                      const targetNode = nodes.find(n => n.id === edge.target);
                      
                      if (!sourceNode || !targetNode) return null;
                      
                      const mid = midpoint(sourceNode.x, sourceNode.y, targetNode.x, targetNode.y);
                      const angle = lineAngle(sourceNode.x, sourceNode.y, targetNode.x, targetNode.y);
                      const isActive = activeEdge && 
                                      activeEdge.source === edge.source && 
                                      activeEdge.target === edge.target;
                      
                      return (
                        <g key={`edge-${idx}`}>
                          <line
                            x1={sourceNode.x}
                            y1={sourceNode.y}
                            x2={targetNode.x}
                            y2={targetNode.y}
                            stroke={isActive ? "#f87171" : "#6b7280"}
                            strokeWidth="2"
                          />
                          
                          {edge.directed && (
                            <polygon
                              points="0,-5 10,0 0,5"
                              transform={`translate(${mid.x}, ${mid.y}) rotate(${angle})`}
                              fill={isActive ? "#f87171" : "#6b7280"}
                            />
                          )}
                        </g>
                      );
                    })}
                    
                    {/* Draw nodes */}
                    {nodes.map(node => {
                      const isActive = node.id === activeNodeId;
                      
                      return (
                        <g key={`node-${node.id}`}>
                          <circle
                            cx={node.x}
                            cy={node.y}
                            r={20}
                            fill={isActive ? "#f87171" : "#ef4444"}
                            stroke="#991b1b"
                            strokeWidth="2"
                          />
                          <text
                            x={node.x}
                            y={node.y + 5}
                            textAnchor="middle"
                            fill="white"
                            fontWeight="bold"
                            fontSize="14"
                          >
                            {node.id}
                          </text>
                        </g>
                      );
                    })}
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
                <h3 className="text-lg font-semibold mb-2">Graph Information:</h3>
                <div className="bg-arena-lightgray rounded-lg p-4">
                  <p className="mb-2"><strong>Nodes:</strong> {nodes.length}</p>
                  <p><strong>Edges:</strong> {edges.length}</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2">Graph Operations:</h3>
                <div className="bg-arena-lightgray rounded-lg p-4">
                  <ul className="list-disc list-inside space-y-2 text-sm">
                    <li><strong>Add Node:</strong> Create a new vertex in the graph</li>
                    <li><strong>Remove Node:</strong> Delete a vertex and its connected edges</li>
                    <li><strong>Add Edge:</strong> Create a connection between two nodes</li>
                    <li><strong>Remove Edge:</strong> Delete a connection between two nodes</li>
                    <li><strong>Directed/Undirected:</strong> Toggle edge direction</li>
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

export default GraphVisualizer;
