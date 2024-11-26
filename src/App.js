import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [code, setCode] = useState('');
  const [array, setArray] = useState([]);
  const [visualSteps, setVisualSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [searchTarget, setSearchTarget] = useState(null);

  // Move ALGORITHMS inside App component
  const ALGORITHMS = {
    sorting: {
      'bubble': (arr, trackStep) => bubbleSort(arr, trackStep),
      'selection': (arr, trackStep) => selectionSort(arr, trackStep),
      'insertion': (arr, trackStep) => insertionSort(arr, trackStep),
      'quick': (arr, trackStep) => quickSort(arr, 0, arr.length - 1, trackStep),
      'merge': (arr, trackStep) => mergeSort(arr, 0, arr.length - 1, trackStep),
    },
    searching: {
      'binary': (arr, trackStep) => {
        const target = arr[Math.floor(Math.random() * arr.length)];
        setSearchTarget(target);
        return binarySearch(arr.sort((a, b) => a - b), target, trackStep);
      },
      'linear': (arr, trackStep) => {
        const target = arr[Math.floor(Math.random() * arr.length)];
        setSearchTarget(target);
        return linearSearch(arr, target, trackStep);
      }
    }
  };

  // Generate random array on mount
  useEffect(() => {
    generateRandomArray();
  }, []);

  const generateRandomArray = () => {
    const newArray = Array.from({length: 15}, () => Math.floor(Math.random() * 100));
    setArray(newArray);
    setVisualSteps([newArray]);
    setCurrentStep(0);
  };

  const runCode = () => {
    try {
      const workingArray = [...array];
      const steps = [workingArray.slice()];
      
      // Clean up input
      const userInput = code.toLowerCase().trim().replace(/[_\s]/g, '');
      
      // Find matching algorithm
      const algorithmType = Object.entries(ALGORITHMS).find(([_, types]) => 
        Object.keys(types).some(name => userInput.includes(name))
      );

      if (!algorithmType) {
        alert('Please enter a valid algorithm name');
        return;
      }

      const [type, algorithms] = algorithmType;
      
      // Clear search target if using sorting algorithm
      if (type === 'sorting') {
        setSearchTarget(null);
      }

      const algorithmName = Object.keys(algorithms).find(name => 
        userInput.includes(name)
      );

      if (algorithmName) {
        algorithms[algorithmName](workingArray, (arr) => steps.push(arr.slice()));
        setVisualSteps(steps);
        setCurrentStep(0);
      }
    } catch (error) {
      console.error('Error executing code:', error);
      alert('Error executing algorithm');
    }
  };

  return (
    <div className="app-container" style={{ 
      textAlign: 'center',
      maxWidth: '800px',
      margin: '0 auto',
      padding: '20px',
      position: 'relative',
      minHeight: '100vh'
    }}>
      <div style={{
        position: 'absolute',
        right: '-250px',
        top: '50%',
        transform: 'translateY(-50%)',
        width: '200px',
        padding: '15px',
        backgroundColor: '#f0f8ff',
        borderRadius: '8px',
        border: '1px solid #61dafb',
        textAlign: 'left',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ 
          color: '#0066cc',
          marginTop: '0',
          marginBottom: '10px',
          fontSize: '16px'
        }}>Available Algorithms:</h3>
        {Object.entries(ALGORITHMS).map(([type, algorithms]) => (
          <div key={type} style={{ marginBottom: '15px' }}>
            <h4 style={{ 
              margin: '5px 0',
              color: '#444',
              fontSize: '14px',
              textTransform: 'capitalize'
            }}>{type}:</h4>
            <ul style={{ 
              margin: '5px 0',
              paddingLeft: '20px',
              fontSize: '13px',
              color: '#666'
            }}>
              {Object.keys(algorithms).map(name => (
                <li key={name} style={{ marginBottom: '3px' }}>
                  {name}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <h1 className="app-title" style={{ 
        color: '#0066cc',
        marginBottom: '30px'
      }}>AlgoScope</h1>
      
      {searchTarget !== null && (
        <div style={{
          fontSize: '18px',
          marginBottom: '20px',
          padding: '10px',
          backgroundColor: '#f0f8ff',
          borderRadius: '8px',
          border: '1px solid #61dafb'
        }}>
          Searching for number: <strong>{searchTarget}</strong>
        </div>
      )}
      
      <div className="visualization-container" style={{
        marginBottom: '30px'
      }}>
        {visualSteps[currentStep]?.map((value, idx) => (
          <div 
            key={idx}
            className="array-bar"
            style={{
              height: `${value * 3}px`,
              backgroundColor: '#61dafb',
              width: '30px',
              margin: '0 2px',
              display: 'inline-block'
            }}
          >
            {value}
          </div>
        ))}
      </div>

      <div className="controls-container" style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '20px'
      }}>
        <textarea
          className="algorithm-input"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder={`Enter algorithm name:\n${Object.entries(ALGORITHMS)
            .map(([type, algos]) => `${type}: ${Object.keys(algos).join(', ')}`)
            .join('\n')}`}
          style={{
            width: '80%',
            height: '100px',
            padding: '10px',
            borderRadius: '8px',
            border: '2px solid #61dafb',
            fontSize: '16px',
            fontFamily: 'monospace',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            resize: 'none',
            color: '#0066cc'
          }}
        />
        <div style={{ 
          display: 'flex',
          gap: '10px',
          justifyContent: 'center'
        }}>
          <button className="control-button" onClick={generateRandomArray}>Generate New Array</button>
          <button className="control-button" onClick={runCode}>Run Algorithm</button>
        </div>
      </div>

      <div className="steps-container" style={{
        marginTop: '20px',
        display: 'flex',
        gap: '10px',
        justifyContent: 'center'
      }}>
        <button 
          className="step-button"
          onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
          disabled={currentStep === 0}
        >
          Previous Step
        </button>
        <button 
          className="step-button"
          onClick={() => setCurrentStep(prev => Math.min(visualSteps.length - 1, prev + 1))}
          disabled={currentStep === visualSteps.length - 1}
        >
          Next Step
        </button>
      </div>
    </div>
  );
}

// Add these sorting functions outside App component
const bubbleSort = (arr, trackStep) => {
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        trackStep(arr);
      }
    }
  }
};

const selectionSort = (arr, trackStep) => {
  for (let i = 0; i < arr.length; i++) {
    let minIdx = i;
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[j] < arr[minIdx]) minIdx = j;
    }
    if (minIdx !== i) {
      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
      trackStep(arr);
    }
  }
};

const insertionSort = (arr, trackStep) => {
  for (let i = 1; i < arr.length; i++) {
    let key = arr[i];
    let j = i - 1;
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j--;
      trackStep(arr);
    }
    arr[j + 1] = key;
    trackStep(arr);
  }
};

const quickSort = (arr, low, high, trackStep) => {
  if (low < high) {
    let pi = partition(arr, low, high, trackStep);
    quickSort(arr, low, pi - 1, trackStep);
    quickSort(arr, pi + 1, high, trackStep);
  }
};

const partition = (arr, low, high, trackStep) => {
  let pivot = arr[high];
  let i = low - 1;
  
  for (let j = low; j < high; j++) {
    if (arr[j] < pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
      trackStep(arr);
    }
  }
  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  trackStep(arr);
  return i + 1;
};

const mergeSort = (arr, left, right, trackStep) => {
  if (left < right) {
    const mid = Math.floor((left + right) / 2);
    mergeSort(arr, left, mid, trackStep);
    mergeSort(arr, mid + 1, right, trackStep);
    merge(arr, left, mid, right, trackStep);
  }
};

const merge = (arr, left, mid, right, trackStep) => {
  const n1 = mid - left + 1;
  const n2 = right - mid;
  const L = new Array(n1);
  const R = new Array(n2);

  for (let i = 0; i < n1; i++) L[i] = arr[left + i];
  for (let j = 0; j < n2; j++) R[j] = arr[mid + 1 + j];

  let i = 0, j = 0, k = left;
  while (i < n1 && j < n2) {
    if (L[i] <= R[j]) {
      arr[k] = L[i];
      i++;
    } else {
      arr[k] = R[j];
      j++;
    }
    k++;
    trackStep(arr);
  }

  while (i < n1) {
    arr[k] = L[i];
    i++;
    k++;
    trackStep(arr);
  }

  while (j < n2) {
    arr[k] = R[j];
    j++;
    k++;
    trackStep(arr);
  }
};

const binarySearch = (arr, target, trackStep) => {
  let left = 0;
  let right = arr.length - 1;
  
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    // Highlight current search area
    const searchArea = [...arr];
    searchArea[mid] = `[${searchArea[mid]}]`; // Mark current element
    trackStep(searchArea);
    
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return -1;
};

const linearSearch = (arr, target, trackStep) => {
  for (let i = 0; i < arr.length; i++) {
    const searchArea = [...arr];
    searchArea[i] = `[${searchArea[i]}]`; // Mark current element
    trackStep(searchArea);
    if (arr[i] === target) return i;
  }
  return -1;
};

export default App;
