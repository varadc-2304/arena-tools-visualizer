
export type ArrayOperation = 'add' | 'remove' | 'view' | 'reset';

export interface Message {
  text: string;
  type: 'info' | 'success' | 'error' | 'warning';
}

// Array operations
export const addToArray = (
  arr: (number | string)[],
  value: number | string,
  index: number
): { newArray: (number | string)[]; message: Message } => {
  if (index < 0 || index > arr.length) {
    return {
      newArray: [...arr],
      message: {
        text: `Invalid index: ${index}. Index must be between 0 and ${arr.length}.`,
        type: 'error',
      },
    };
  }

  const newArr = [...arr];
  newArr.splice(index, 0, value);
  
  return {
    newArray: newArr,
    message: {
      text: `Added ${value} at index ${index}.`,
      type: 'success',
    },
  };
};

export const removeFromArray = (
  arr: (number | string)[],
  index: number
): { newArray: (number | string)[]; removed: number | string | null; message: Message } => {
  if (index < 0 || index >= arr.length) {
    return {
      newArray: [...arr],
      removed: null,
      message: {
        text: `Invalid index: ${index}. Index must be between 0 and ${arr.length - 1}.`,
        type: 'error',
      },
    };
  }

  const newArr = [...arr];
  const removed = newArr.splice(index, 1)[0];
  
  return {
    newArray: newArr,
    removed,
    message: {
      text: `Removed ${removed} from index ${index}.`,
      type: 'success',
    },
  };
};

export const viewArrayItem = (
  arr: (number | string)[],
  index: number
): { value: number | string | null; message: Message } => {
  if (index < 0 || index >= arr.length) {
    return {
      value: null,
      message: {
        text: `Invalid index: ${index}. Index must be between 0 and ${arr.length - 1}.`,
        type: 'error',
      },
    };
  }

  return {
    value: arr[index],
    message: {
      text: `Value at index ${index} is ${arr[index]}.`,
      type: 'info',
    },
  };
};

// Stack operations
export const pushToStack = (
  stack: (number | string)[],
  value: number | string
): { newStack: (number | string)[]; message: Message } => {
  const newStack = [...stack, value];
  
  return {
    newStack,
    message: {
      text: `Pushed ${value} to the stack.`,
      type: 'success',
    },
  };
};

export const popFromStack = (
  stack: (number | string)[]
): { newStack: (number | string)[]; popped: number | string | null; message: Message } => {
  if (stack.length === 0) {
    return {
      newStack: [],
      popped: null,
      message: {
        text: 'Cannot pop from an empty stack.',
        type: 'error',
      },
    };
  }

  const newStack = [...stack];
  const popped = newStack.pop()!;
  
  return {
    newStack,
    popped,
    message: {
      text: `Popped ${popped} from the stack.`,
      type: 'success',
    },
  };
};

export const peekStack = (
  stack: (number | string)[]
): { value: number | string | null; message: Message } => {
  if (stack.length === 0) {
    return {
      value: null,
      message: {
        text: 'Cannot peek an empty stack.',
        type: 'error',
      },
    };
  }

  const top = stack[stack.length - 1];
  
  return {
    value: top,
    message: {
      text: `Top of stack is ${top}.`,
      type: 'info',
    },
  };
};

// Queue operations
export const enqueue = (
  queue: (number | string)[],
  value: number | string
): { newQueue: (number | string)[]; message: Message } => {
  const newQueue = [...queue, value];
  
  return {
    newQueue,
    message: {
      text: `Enqueued ${value} to the queue.`,
      type: 'success',
    },
  };
};

export const dequeue = (
  queue: (number | string)[]
): { newQueue: (number | string)[]; dequeued: number | string | null; message: Message } => {
  if (queue.length === 0) {
    return {
      newQueue: [],
      dequeued: null,
      message: {
        text: 'Cannot dequeue from an empty queue.',
        type: 'error',
      },
    };
  }

  const newQueue = [...queue];
  const dequeued = newQueue.shift()!;
  
  return {
    newQueue,
    dequeued,
    message: {
      text: `Dequeued ${dequeued} from the queue.`,
      type: 'success',
    },
  };
};

export const peekQueue = (
  queue: (number | string)[]
): { value: number | string | null; message: Message } => {
  if (queue.length === 0) {
    return {
      value: null,
      message: {
        text: 'Cannot peek an empty queue.',
        type: 'error',
      },
    };
  }

  const front = queue[0];
  
  return {
    value: front,
    message: {
      text: `Front of queue is ${front}.`,
      type: 'info',
    },
  };
};

// Linked List Node Interface
export interface LinkedListNode {
  value: number | string;
  next: LinkedListNode | null;
}

// Linked List operations
export const appendToLinkedList = (
  head: LinkedListNode | null,
  value: number | string
): { newHead: LinkedListNode; message: Message } => {
  const newNode: LinkedListNode = { value, next: null };
  
  if (!head) {
    return {
      newHead: newNode,
      message: {
        text: `Added ${value} as the head of the linked list.`,
        type: 'success',
      },
    };
  }
  
  let current = head;
  while (current.next) {
    current = current.next;
  }
  current.next = newNode;
  
  return {
    newHead: head,
    message: {
      text: `Appended ${value} to the end of the linked list.`,
      type: 'success',
    },
  };
};

export const prependToLinkedList = (
  head: LinkedListNode | null,
  value: number | string
): { newHead: LinkedListNode; message: Message } => {
  const newNode: LinkedListNode = { value, next: head };
  
  return {
    newHead: newNode,
    message: {
      text: `Prepended ${value} to the beginning of the linked list.`,
      type: 'success',
    },
  };
};

export const removeFromLinkedList = (
  head: LinkedListNode | null,
  value: number | string
): { newHead: LinkedListNode | null; removed: boolean; message: Message } => {
  if (!head) {
    return {
      newHead: null,
      removed: false,
      message: {
        text: 'Cannot remove from an empty linked list.',
        type: 'error',
      },
    };
  }
  
  if (head.value === value) {
    return {
      newHead: head.next,
      removed: true,
      message: {
        text: `Removed ${value} from the head of the linked list.`,
        type: 'success',
      },
    };
  }
  
  let current = head;
  while (current.next && current.next.value !== value) {
    current = current.next;
  }
  
  if (current.next) {
    current.next = current.next.next;
    return {
      newHead: head,
      removed: true,
      message: {
        text: `Removed ${value} from the linked list.`,
        type: 'success',
      },
    };
  }
  
  return {
    newHead: head,
    removed: false,
    message: {
      text: `Value ${value} not found in the linked list.`,
      type: 'error',
    },
  };
};

export const searchLinkedList = (
  head: LinkedListNode | null,
  value: number | string
): { found: boolean; message: Message } => {
  if (!head) {
    return {
      found: false,
      message: {
        text: 'Cannot search an empty linked list.',
        type: 'error',
      },
    };
  }
  
  let current = head;
  let index = 0;
  while (current) {
    if (current.value === value) {
      return {
        found: true,
        message: {
          text: `Found ${value} at position ${index} in the linked list.`,
          type: 'success',
        },
      };
    }
    current = current.next;
    index++;
  }
  
  return {
    found: false,
    message: {
      text: `Value ${value} not found in the linked list.`,
      type: 'error',
    },
  };
};

// Deque operations
export const addFrontDeque = (
  deque: (number | string)[],
  value: number | string
): { newDeque: (number | string)[]; message: Message } => {
  const newDeque = [value, ...deque];
  
  return {
    newDeque,
    message: {
      text: `Added ${value} to the front of the deque.`,
      type: 'success',
    },
  };
};

export const addRearDeque = (
  deque: (number | string)[],
  value: number | string
): { newDeque: (number | string)[]; message: Message } => {
  const newDeque = [...deque, value];
  
  return {
    newDeque,
    message: {
      text: `Added ${value} to the rear of the deque.`,
      type: 'success',
    },
  };
};

export const removeFrontDeque = (
  deque: (number | string)[]
): { newDeque: (number | string)[]; removed: number | string | null; message: Message } => {
  if (deque.length === 0) {
    return {
      newDeque: [],
      removed: null,
      message: {
        text: 'Cannot remove from the front of an empty deque.',
        type: 'error',
      },
    };
  }

  const newDeque = [...deque];
  const removed = newDeque.shift()!;
  
  return {
    newDeque,
    removed,
    message: {
      text: `Removed ${removed} from the front of the deque.`,
      type: 'success',
    },
  };
};

export const removeRearDeque = (
  deque: (number | string)[]
): { newDeque: (number | string)[]; removed: number | string | null; message: Message } => {
  if (deque.length === 0) {
    return {
      newDeque: [],
      removed: null,
      message: {
        text: 'Cannot remove from the rear of an empty deque.',
        type: 'error',
      },
    };
  }

  const newDeque = [...deque];
  const removed = newDeque.pop()!;
  
  return {
    newDeque,
    removed,
    message: {
      text: `Removed ${removed} from the rear of the deque.`,
      type: 'success',
    },
  };
};

export const peekFrontDeque = (
  deque: (number | string)[]
): { value: number | string | null; message: Message } => {
  if (deque.length === 0) {
    return {
      value: null,
      message: {
        text: 'Cannot peek the front of an empty deque.',
        type: 'error',
      },
    };
  }

  const front = deque[0];
  
  return {
    value: front,
    message: {
      text: `Front of deque is ${front}.`,
      type: 'info',
    },
  };
};

export const peekRearDeque = (
  deque: (number | string)[]
): { value: number | string | null; message: Message } => {
  if (deque.length === 0) {
    return {
      value: null,
      message: {
        text: 'Cannot peek the rear of an empty deque.',
        type: 'error',
      },
    };
  }

  const rear = deque[deque.length - 1];
  
  return {
    value: rear,
    message: {
      text: `Rear of deque is ${rear}.`,
      type: 'info',
    },
  };
};
