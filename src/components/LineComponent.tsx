import React, { useMemo } from 'react';
import { getRandomWord, WordType } from '../utils/wordGenerator';
import { transformWord, conjugateVerb } from '../utils/wordTransformations';

interface LineComponentProps {
  template: string;
}

const LineComponent: React.FC<LineComponentProps> = React.memo(({ template }) => {
  const line = useMemo(() => {
    return template.replace(/\[([a-zA-Z]+)(?:\(([^)]+)\))?\]/g, (_, wordType, context) => {
      const word = getRandomWord(wordType as WordType);
      let transformedWord = word.toLowerCase();
      
      if (context === 'plural') {
        transformedWord = transformWord(word, wordType as WordType, 'plural');
      } else if (context === 'conjugate') {
        transformedWord = conjugateVerb(word);
      }
      
      return transformedWord;
    });
  }, [template]);

  return <div className="poem-line">{line}</div>;
});

LineComponent.displayName = 'LineComponent';

export default LineComponent;
