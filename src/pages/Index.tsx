
import React from 'react';
import { Layers, ListOrdered, AlignJustify, Link2, Shuffle } from 'lucide-react';
import DataCard from '@/components/DataCard';

const Index = () => {
  return (
    <div className="min-h-screen pt-20 pb-10 animate-fadeIn">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-arena-darkgray">
            Arena<span className="text-arena-red">Tools</span> DS
          </h1>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            Interactive visualizations to help you understand how data structures work
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <DataCard
            title="Array"
            description="A collection of elements stored in contiguous memory locations, allowing quick access with an index."
            icon={<ListOrdered className="w-8 h-8" />}
            route="/array"
            delay={100}
          />
          
          <DataCard
            title="Stack"
            description="A Last-In-First-Out (LIFO) collection where elements are added and removed from the same end."
            icon={<Layers className="w-8 h-8" />}
            route="/stack"
            delay={200}
          />
          
          <DataCard
            title="Queue"
            description="A First-In-First-Out (FIFO) collection where elements are added at one end and removed from the other."
            icon={<AlignJustify className="w-8 h-8" />}
            route="/queue"
            delay={300}
          />
          
          <DataCard
            title="Linked List"
            description="A sequence of elements where each element points to the next, allowing dynamic size changes and efficient insertions."
            icon={<Link2 className="w-8 h-8" />}
            route="/linked-list"
            delay={400}
          />
          
          <DataCard
            title="Deque"
            description="A double-ended queue allowing insertion and removal of elements from both ends efficiently."
            icon={<Shuffle className="w-8 h-8" />}
            route="/deque"
            delay={500}
          />
        </div>
        
        <div className="mt-20 text-center">
          <h2 className="text-2xl font-bold text-arena-darkgray mb-4">
            Learn Data Structures <span className="text-arena-red">Visually</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our interactive visualizers let you see how data structures work in real-time.
            Add, remove, and manipulate elements to understand the underlying principles.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
