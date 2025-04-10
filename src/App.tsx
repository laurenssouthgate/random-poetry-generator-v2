import React, { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import LineComponent from './components/LineComponent';
import templates from './assets/templates.json'; // Static import of the templates
import './App.css'; // Optional: Add your styles

const App: React.FC = () => {
  const [inputLines, setInputLines] = useState<number>(1);
  const [inputValue, setInputValue] = useState<string>("1");
  const [generatedLines, setGeneratedLines] = useState<string[]>([]);
  const [error, setError] = useState<string>('');
  const [generationKey, setGenerationKey] = useState<number>(0);
  const poemContainerRef = useRef<HTMLDivElement>(null);

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Track the raw string input
    const rawValue = e.target.value;
    setInputValue(rawValue);
    
    // Convert to number if possible
    if (rawValue === '') {
      // Allow empty string but don't update inputLines yet
      return;
    }
    
    const numValue = parseInt(rawValue, 10);
    if (!isNaN(numValue)) {
      // Only update if it's a valid number and within range
      if (numValue >= 1 && numValue <= 100) {
        setInputLines(numValue);
      } else if (numValue > 100) {
        // Cap at 100
        setInputLines(100);
        setInputValue("100");
      }
    }
  };

  const handleGenerate = () => {
    try {
      // Ensure we have a valid number before generating
      if (inputValue === '' || inputLines < 1) {
        setInputLines(1);
        setInputValue("1");
      }
      
      const lines: string[] = [];
      for (let i = 0; i < inputLines; i++) {
        const randomTemplate = templates[Math.floor(Math.random() * templates.length)];
        lines.push(randomTemplate);
      }
      setGeneratedLines(lines);
      setGenerationKey(prev => prev + 1);
      setError('');
    } catch (err) {
      setError('Error generating lines.');
      console.error(err);
    }
  };

  // Handle input blur to ensure valid state when leaving field
  const handleInputBlur = () => {
    if (inputValue === '' || parseInt(inputValue, 10) < 1) {
      setInputLines(1);
      setInputValue("1");
    }
  };

  const handleSaveImage = async () => {
    if (!poemContainerRef.current) return;

    try {
      const tempContainer = document.createElement('div');
      
      tempContainer.style.backgroundColor = 'white';
      tempContainer.style.padding = '2rem';
      tempContainer.style.width = `${poemContainerRef.current.offsetWidth}px`;
      tempContainer.style.fontFamily = 'Georgia, serif';
      tempContainer.style.fontSize = '1.2rem';
      tempContainer.style.lineHeight = '1.8';
      tempContainer.style.color = '#2c3e50';
      
      const poemLines = poemContainerRef.current.querySelectorAll('.poem-line');
      poemLines.forEach(line => {
        let text = line.textContent || '';
        if (text.length > 0) {
          const firstLetter = text.charAt(0).toUpperCase();
          const restOfText = text.slice(1);
          text = firstLetter + restOfText;
          
          const paragraph = document.createElement('p');
          paragraph.style.margin = '1rem 0';
          paragraph.textContent = text;
          tempContainer.appendChild(paragraph);
        }
      });
      
      tempContainer.style.position = 'absolute';
      tempContainer.style.left = '-9999px';
      document.body.appendChild(tempContainer);
      
      const canvas = await html2canvas(tempContainer, {
        backgroundColor: '#ffffff',
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false
      });
      
      document.body.removeChild(tempContainer);

      const link = document.createElement('a');
      link.download = 'poem.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      setError('Error saving image.');
      console.error(err);
    }
  };

  const handleSharePoem = async () => {
    if (!poemContainerRef.current || generatedLines.length === 0) return;
    
    try {
      const poemLines = poemContainerRef.current.querySelectorAll('.poem-line');
      const poemText = Array.from(poemLines)
        .map(line => {
          const text = line.textContent || '';
          return text.charAt(0).toUpperCase() + text.slice(1);
        })
        .join('\n\n');
      
      if (navigator.share) {
        await navigator.share({
          title: 'Illuminated Poem',
          text: poemText,
        });
      } else {
        navigator.clipboard.writeText(poemText);
        alert('Poem copied to clipboard! The Web Share API is not supported in this browser.');
      }
    } catch (err) {
      if (err instanceof Error && err.name !== 'AbortError') {
        setError('Error sharing poem.');
        console.error(err);
      }
    }
  };

  return (
    <div className="App">
      <h1>Random Poem Generator</h1>
      
      {/* Display the generated lines */}
      <div className="poem-container" ref={poemContainerRef}>
        {generatedLines.length > 0 &&
          generatedLines.map((line, index) => (
            <LineComponent 
              key={`${generationKey}-${index}`} 
              template={line} 
            />
          ))}
      </div>

      {/* Controls section */}
      <div className="controls">
        <div className="input-group">
          <label htmlFor="numLines">Number of lines:</label>
          <input
            id="numLines"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={inputValue}
            onChange={handleNumberChange}
            onBlur={handleInputBlur}
            onKeyDown={(e) => {
              if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                e.preventDefault();
              }
            }}
            min="1"
            max="100"
            placeholder="1"
          />
        </div>

        <div className="button-group">
          <button onClick={handleGenerate}>Generate</button>
          {generatedLines.length > 0 && (
            <>
              <button onClick={handleSaveImage} className="save-button">
                Save as Image
              </button>
              <button onClick={handleSharePoem} className="share-button">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M13.5 1a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM11 2.5a2.5 2.5 0 1 1 .603 1.628l-6.718 3.12a2.499 2.499 0 0 1 0 1.504l6.718 3.12a2.5 2.5 0 1 1-.488.876l-6.718-3.12a2.5 2.5 0 1 1 0-3.256l6.718-3.12A2.5 2.5 0 0 1 11 2.5zm-8.5 4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm11 5.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z"/>
                </svg>
                Share
              </button>
            </>
          )}
        </div>

        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
};

export default App;
