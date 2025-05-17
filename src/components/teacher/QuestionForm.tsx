
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { useLanguage } from '@/context/LanguageContext';
import { Trash, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface QuestionOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface Question {
  id: string;
  text: string;
  weight: number;
  type: 'single' | 'multiple';
  options: QuestionOption[];
}

interface QuestionFormProps {
  questionNumber: number;
  question: Question;
  onUpdate: (question: Question) => void;
  onRemove: () => void;
}

export default function QuestionForm({ 
  questionNumber, 
  question, 
  onUpdate, 
  onRemove
}: QuestionFormProps) {
  const { t } = useLanguage();
  const [localQuestion, setLocalQuestion] = useState<Question>(question);

  const handleTextChange = (text: string) => {
    setLocalQuestion(prev => {
      const updated = { ...prev, text };
      onUpdate(updated);
      return updated;
    });
  };

  const handleWeightChange = (weight: string) => {
    const numWeight = parseInt(weight, 10) || 0;
    setLocalQuestion(prev => {
      const updated = { ...prev, weight: numWeight };
      onUpdate(updated);
      return updated;
    });
  };

  const handleTypeChange = (type: 'single' | 'multiple') => {
    setLocalQuestion(prev => {
      // Reset correct answers when changing types
      const updatedOptions = prev.options.map(opt => ({
        ...opt,
        isCorrect: false
      }));
      
      const updated = { ...prev, type, options: updatedOptions };
      onUpdate(updated);
      return updated;
    });
  };

  const addOption = () => {
    setLocalQuestion(prev => {
      const newOption = {
        id: `option-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        text: '',
        isCorrect: false
      };
      
      const updated = { 
        ...prev, 
        options: [...prev.options, newOption] 
      };
      
      onUpdate(updated);
      return updated;
    });
  };

  const removeOption = (optionId: string) => {
    setLocalQuestion(prev => {
      const updated = {
        ...prev,
        options: prev.options.filter(opt => opt.id !== optionId)
      };
      
      onUpdate(updated);
      return updated;
    });
  };

  const updateOptionText = (optionId: string, text: string) => {
    setLocalQuestion(prev => {
      const updated = {
        ...prev,
        options: prev.options.map(opt => 
          opt.id === optionId ? { ...opt, text } : opt
        )
      };
      
      onUpdate(updated);
      return updated;
    });
  };

  const updateCorrectOption = (optionId: string, isCorrect: boolean) => {
    setLocalQuestion(prev => {
      let updatedOptions;
      
      if (prev.type === 'single' && isCorrect) {
        // For single answer, uncheck all other options
        updatedOptions = prev.options.map(opt => ({
          ...opt,
          isCorrect: opt.id === optionId
        }));
      } else {
        // For multiple answers, just toggle the selected option
        updatedOptions = prev.options.map(opt => 
          opt.id === optionId ? { ...opt, isCorrect } : opt
        );
      }
      
      const updated = { ...prev, options: updatedOptions };
      onUpdate(updated);
      return updated;
    });
  };

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">
          {t('question')} {questionNumber}
        </h3>
        <Button 
          variant="outline" 
          size="sm"
          onClick={onRemove}
          className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
        >
          <Trash className="h-4 w-4 mr-1" />
          {t('remove')}
        </Button>
      </div>
      
      <div className="space-y-4">
        {/* Question Text */}
        <div>
          <Label htmlFor={`question-text-${question.id}`}>{t('questionText')}</Label>
          <Textarea
            id={`question-text-${question.id}`}
            value={localQuestion.text}
            onChange={(e) => handleTextChange(e.target.value)}
            placeholder={t('enterQuestionText')}
            className="mt-1"
          />
        </div>
        
        {/* Question Weight */}
        <div>
          <Label htmlFor={`question-weight-${question.id}`}>{t('questionWeight')}</Label>
          <Input
            id={`question-weight-${question.id}`}
            type="number"
            min="1"
            value={localQuestion.weight}
            onChange={(e) => handleWeightChange(e.target.value)}
            placeholder="1"
            className="mt-1 w-24"
          />
        </div>
        
        {/* Question Type */}
        <div>
          <Label>{t('questionType')}</Label>
          <RadioGroup 
            value={localQuestion.type}
            onValueChange={(value) => handleTypeChange(value as 'single' | 'multiple')}
            className="mt-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="single" id={`single-${question.id}`} />
              <Label htmlFor={`single-${question.id}`} className="cursor-pointer">
                {t('singleAnswer')}
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="multiple" id={`multiple-${question.id}`} />
              <Label htmlFor={`multiple-${question.id}`} className="cursor-pointer">
                {t('multipleAnswers')}
              </Label>
            </div>
          </RadioGroup>
        </div>
        
        {/* Options */}
        <div>
          <div className="flex items-center justify-between">
            <Label>{t('answerOptions')}</Label>
            <Button 
              type="button" 
              onClick={addOption} 
              size="sm" 
              variant="outline"
              className="text-brand-blue"
            >
              <Plus className="h-4 w-4 mr-1" />
              {t('addOption')}
            </Button>
          </div>
          
          <div className="space-y-2 mt-2">
            {localQuestion.options.map((option, index) => (
              <div key={option.id} className="flex items-center gap-2">
                <div className="grow">
                  <Input
                    value={option.text}
                    onChange={(e) => updateOptionText(option.id, e.target.value)}
                    placeholder={`${t('option')} ${index + 1}`}
                  />
                </div>
                <Button
                  type="button"
                  onClick={() => removeOption(option.id)}
                  size="icon"
                  variant="ghost"
                  className="text-red-500 hover:text-red-600"
                >
                  <Trash className="h-4 w-4" />
                  <span className="sr-only">{t('removeOption')}</span>
                </Button>
              </div>
            ))}

            {localQuestion.options.length === 0 && (
              <p className="text-sm text-gray-500 italic">
                {t('noOptionsAdded')}
              </p>
            )}
          </div>
        </div>
        
        {/* Correct Answers */}
        {localQuestion.options.length > 0 && (
          <div>
            <Label>{t('correctAnswers')}</Label>
            <div className="space-y-2 mt-2">
              {localQuestion.type === 'single' ? (
                <RadioGroup 
                  value={
                    localQuestion.options.find(opt => opt.isCorrect)?.id || ""
                  }
                  onValueChange={(value) => {
                    const optionId = value;
                    updateCorrectOption(optionId, true);
                  }}
                >
                  {localQuestion.options.map((option, index) => (
                    <div key={option.id} className="flex items-center space-x-2">
                      <RadioGroupItem 
                        value={option.id} 
                        id={`correct-single-${option.id}`}
                      />
                      <Label 
                        htmlFor={`correct-single-${option.id}`}
                        className={cn(
                          "cursor-pointer",
                          !option.text && "italic text-gray-500"
                        )}
                      >
                        {option.text || `${t('option')} ${index + 1}`}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              ) : (
                <div className="space-y-2">
                  {localQuestion.options.map((option, index) => (
                    <div key={option.id} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`correct-multi-${option.id}`}
                        checked={option.isCorrect}
                        onCheckedChange={(checked) => 
                          updateCorrectOption(option.id, checked === true)
                        }
                      />
                      <Label 
                        htmlFor={`correct-multi-${option.id}`}
                        className={cn(
                          "cursor-pointer",
                          !option.text && "italic text-gray-500"
                        )}
                      >
                        {option.text || `${t('option')} ${index + 1}`}
                      </Label>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
