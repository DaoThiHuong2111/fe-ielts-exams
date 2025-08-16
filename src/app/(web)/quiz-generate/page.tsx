'use client';

// Force dynamic rendering due to parent layout using cookies
export const dynamic = 'force-dynamic'

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  MultipleChoiceForm,
  FillInBlanksForm,
  ExistingQuizzesList,
  ImportSampleData,
} from '@/components/quiz-generator';
import type {
  MultipleChoiceFormData,
  FillInBlanksFormData,
} from '@/components/quiz-generator';
import { validateQuestion } from '@/utils/schemaValidator';
import {
  addQuizToStorage,
  clearQuizData,
  loadQuizData,
  saveQuizData,
  loadPassageData,
  savePassageData,
  addPassageToStorage,
  getAllQuestionsFlat,
} from '@/lib/quiz-storage';
import { generateId } from '@/lib/utils';
import type {
  FillInBlanksData,
  MultipleChoiceData,
  QuizData,
  QuizOption,
  PassageWithQuestions,
  MultipleChoiceQuestion,
  FillInBlanksQuestion,
  Question,
} from '@/types/quiz';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

// Import sample quiz data from JSON files
import ieltsReadingData from '@/data/quiz-sets/ielts-reading-practice.json';
import grammarBasicsData from '@/data/quiz-sets/english-grammar-basics.json';
import vocabularyData from '@/data/quiz-sets/vocabulary-practice.json';

// Combine all sample passages from JSON files
const samplePassagesWithQuestions: PassageWithQuestions[] = [
  ...ieltsReadingData.passages,
  ...grammarBasicsData.passages,
  ...vocabularyData.passages,
] as PassageWithQuestions[];

// Note: Legacy format data has been removed.
// All sample data now comes from the JSON files which follow the new schema format

// Simplified interface for question fields (only used fields)
interface QuestionFields {
  title: string
  instruction: string
}

const PassageForm = ({
  onSave,
}: {
  onSave: (title: string, content: string) => void;
}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSave = () => {
    if (!title.trim() || !content.trim()) {
      toast.error('Tiêu đề và nội dung đoạn văn không được để trống');
      return;
    }
    onSave(title, content);
    setTitle('');
    setContent('');
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <h3 className="text-lg font-semibold">Tạo đoạn văn mới</h3>
      <Label htmlFor="passage-title">Tiêu đề đoạn văn</Label>
      <Input
        id="passage-title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Nhập tiêu đề đoạn văn"
      />
      <Label htmlFor="passage-content">Nội dung đoạn văn</Label>
      <Textarea
        id="passage-content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Nhập nội dung đoạn văn"
      />
      <Button onClick={handleSave}>Lưu đoạn văn</Button>
    </div>
  );
};

export default function QuizGeneratePage() {
  const router = useRouter();
  const [quizType, setQuizType] = useState<
    'multiple-choice' | 'fill-in-blanks'
  >('multiple-choice');
  const [passages, setPassages] = useState<PassageWithQuestions[]>([]);
  const [selectedPassageId, setSelectedPassageId] = useState<string | null>(
    null
  );
  const [isCreatingPassage, setIsCreatingPassage] = useState(true);

  // Form data using only the fields that are actually used
  const [questionFields, setQuestionFields] = useState<QuestionFields>({
    title: '',
    instruction: '',
  });

  const [multipleChoiceFields, setMultipleChoiceFields] =
    useState<MultipleChoiceFormData>({
      options: [
        { id: 'A', label: 'A', text: '' },
        { id: 'B', label: 'B', text: '' },
      ],
      correctAnswers: [],
      maxSelections: 1,
    });

  const [fillInBlanksFields, setFillInBlanksFields] =
    useState<FillInBlanksFormData>({
      text: '',
      blanks: [],
    });

  useEffect(() => {
    const loadedPassages = loadPassageData();
    setPassages(loadedPassages);
    if (loadedPassages.length > 0) {
      setIsCreatingPassage(false);
      setSelectedPassageId(loadedPassages[0].id);
    }
  }, []);

  // Handle changes in question fields
  const handleQuestionFieldChange = (
    field: keyof QuestionFields,
    value: string
  ) => {
    setQuestionFields((prev) => ({ ...prev, [field]: value }));
  };

  // Handle changes in multiple choice fields
  const handleMultipleChoiceFieldChange = (
    field: keyof MultipleChoiceFormData,
    value: any
  ) => {
    setMultipleChoiceFields((prev) => ({ ...prev, [field]: value }));
  };

  // Handle changes in fill-in-blanks fields
  const handleFillInBlanksFieldChange = (
    field: keyof FillInBlanksFormData,
    value: any
  ) => {
    setFillInBlanksFields((prev) => ({ ...prev, [field]: value }));
  };

  const handleSavePassage = (title: string, content: string) => {
    const newPassage: PassageWithQuestions = {
      id: generateId('passage'),
      title,
      content,
      questions: [],
      category: 'reading', // Default category
    };
    addPassageToStorage(newPassage);
    setPassages([...passages, newPassage]);
    setSelectedPassageId(newPassage.id);
    setIsCreatingPassage(false);
    toast.success(
      'Đã tạo đoạn văn thành công. Bây giờ bạn có thể thêm câu hỏi.'
    );
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedPassageId) {
      toast.error(
        'Vui lòng chọn hoặc tạo một đoạn văn trước khi thêm câu hỏi.'
      );
      return;
    }

    // Combine form data into a draft question object for validation
    const draftQuestion: Question =
      quizType === 'multiple-choice'
        ? {
            id: 'temp-validation-id',
            type: 'multiple-choice',
            title: questionFields.title,
            instruction: questionFields.instruction,
            passageId: selectedPassageId,
            ...multipleChoiceFields,
          }
        : {
            id: 'temp-validation-id',
            type: 'fill-in-blanks',
            title: questionFields.title,
            instruction: questionFields.instruction,
            passageId: selectedPassageId,
            ...fillInBlanksFields,
          };

    // *** USE SCHEMA VALIDATOR ***
    const { valid, formattedErrors } = validateQuestion(draftQuestion);
    if (!valid) {
      // Display all validation errors
      formattedErrors?.forEach((error) => {
        toast.error(error, { duration: 5000 });
      });
      return;
    }

    // If validation passes, create the final question with a real ID
    const newQuestion: MultipleChoiceQuestion | FillInBlanksQuestion = {
      ...draftQuestion,
      id: generateId('question'),
    } as MultipleChoiceQuestion | FillInBlanksQuestion;

    const updatedPassages = passages.map((p) => {
      if (p.id === selectedPassageId) {
        return {
          ...p,
          questions: [...p.questions, newQuestion],
        };
      }
      return p;
    });

    savePassageData(updatedPassages);
    setPassages(updatedPassages);

    toast.success('Đã thêm câu hỏi vào đoạn văn!');
    resetForm();
  };

  // Reset form
  const resetForm = () => {
    setQuestionFields({
      title: '',
      instruction: '',
    });

    setMultipleChoiceFields({
      options: [
        { id: 'A', label: 'A', text: '' },
        { id: 'B', label: 'B', text: '' },
      ],
      correctAnswers: [],
      maxSelections: 1,
    });

    setFillInBlanksFields({
      text: '',
      blanks: [],
    });
  };

  // Import sample data - now supports both passages and legacy format
  const handleImportSampleData = () => {
    const existingPassages = loadPassageData();
    const totalExistingQuestions = existingPassages.reduce(
      (sum, p) => sum + p.questions.length,
      0
    );

    if (totalExistingQuestions > 0) {
      const confirmImport = window.confirm(
        `Bạn đã có ${totalExistingQuestions} câu hỏi trong ${existingPassages.length} đoạn văn. Bạn muốn:\n\n` +
          `OK - Thêm dữ liệu mẫu vào danh sách hiện tại\n` +
          `Cancel - Hủy bỏ`
      );
      if (!confirmImport) return;
    }

    // Import new passage-based sample data
    const updatedPassages = [
      ...existingPassages,
      ...samplePassagesWithQuestions,
    ];
    savePassageData(updatedPassages);
    setPassages(updatedPassages);

    // Update selected passage if none selected
    if (!selectedPassageId && updatedPassages.length > 0) {
      setSelectedPassageId(updatedPassages[0].id);
      setIsCreatingPassage(false);
    }

    const totalNewQuestions = samplePassagesWithQuestions.reduce(
      (sum, p) => sum + p.questions.length,
      0
    );
    toast.success(
      `Đã thêm ${totalNewQuestions} câu hỏi từ ${samplePassagesWithQuestions.length} đoạn văn mẫu!`
    );
  };

  // Clear all quizzes
  const handleClearAll = () => {
    if (confirm('Xóa tất cả đoạn văn và câu hỏi đã tạo?')) {
      clearQuizData();
      savePassageData([]);
      setPassages([]);
      setSelectedPassageId(null);
      setIsCreatingPassage(true);
      toast.success('Đã xóa tất cả đoạn văn và câu hỏi');
    }
  };

  // Navigate to demo pages
  const navigateToDemo = (type: 'multiple-choice' | 'fill-in-blanks') => {
    if (type === 'multiple-choice') {
      router.push('/quiz-demo/multi-choice');
    } else {
      router.push('/quiz-demo/fill-in-blank');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-2xl font-bold mb-4">Quản lý Đoạn văn và Câu hỏi</h1>

        {/* Section to display and manage passages */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Danh sách Đoạn văn</CardTitle>
            <Button onClick={() => setIsCreatingPassage(true)}>
              Tạo đoạn văn mới
            </Button>
          </CardHeader>
          <CardContent>
            {passages.length > 0 ? (
              <ul className="space-y-2">
                {passages.map((p) => (
                  <li
                    key={p.id}
                    className={`p-2 rounded-md cursor-pointer ${
                      selectedPassageId === p.id
                        ? 'bg-blue-100'
                        : 'hover:bg-gray-100'
                    }`}
                    onClick={() => setSelectedPassageId(p.id)}
                  >
                    {p.title} ({p.questions.length} câu hỏi)
                  </li>
                ))}
              </ul>
            ) : (
              <p>Chưa có đoạn văn nào. Hãy tạo một đoạn văn mới.</p>
            )}
          </CardContent>
        </Card>

        {isCreatingPassage ? (
          <PassageForm onSave={handleSavePassage} />
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Thêm câu hỏi vào đoạn văn</CardTitle>
              <CardDescription>
                {passages.find((p) => p.id === selectedPassageId)?.title}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Quiz Type Selection */}
                <div className="space-y-2">
                  <Label>Loại câu hỏi</Label>
                  <RadioGroup
                    value={quizType}
                    onValueChange={(value) => {
                      if (
                        value === 'multiple-choice' ||
                        value === 'fill-in-blanks'
                      ) {
                        setQuizType(value);
                      }
                    }}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="multiple-choice" id="mc" />
                      <Label htmlFor="mc">Trắc nghiệm (Multiple Choice)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="fill-in-blanks" id="fib" />
                      <Label htmlFor="fib">Điền từ (Fill in the Blanks)</Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Question Fields - without passage fields as the passage is already selected */}
                <div className="space-y-4">
                  <div>
                    <Label>Tiêu đề câu hỏi</Label>
                    <Input
                      value={questionFields.title}
                      onChange={(e) =>
                        handleQuestionFieldChange('title', e.target.value)
                      }
                      placeholder="Nhập tiêu đề câu hỏi"
                    />
                  </div>
                  <div>
                    <Label>Hướng dẫn</Label>
                    <Textarea
                      value={questionFields.instruction}
                      onChange={(e) =>
                        handleQuestionFieldChange('instruction', e.target.value)
                      }
                      placeholder="Nhập hướng dẫn"
                    />
                  </div>
                </div>

                {/* Multiple Choice Specific Fields */}
                {quizType === 'multiple-choice' && (
                  <MultipleChoiceForm
                    values={multipleChoiceFields}
                    onChange={handleMultipleChoiceFieldChange}
                  />
                )}

                {/* Fill in the Blanks Specific Fields */}
                {quizType === 'fill-in-blanks' && (
                  <FillInBlanksForm
                    values={fillInBlanksFields}
                    onChange={handleFillInBlanksFieldChange}
                  />
                )}

                {/* Submit Buttons */}
                <div className="flex gap-2">
                  <Button type="submit" className="flex-1">
                    Thêm câu hỏi vào đoạn văn
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Reset
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Import Sample Data Button */}
        <div className="mt-6">
          <Button onClick={handleImportSampleData} variant="outline">
            Import Dữ liệu mẫu ({samplePassagesWithQuestions.length} đoạn văn)
          </Button>
        </div>

        {/* Display selected passage questions */}
        {selectedPassageId &&
          passages.find((p) => p.id === selectedPassageId) && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Câu hỏi của đoạn văn</CardTitle>
              </CardHeader>
              <CardContent>
                {passages
                  .find((p) => p.id === selectedPassageId)
                  ?.questions.map((q, idx) => (
                    <div key={q.id} className="p-2 border-b">
                      {idx + 1}. {q.title} ({q.type})
                    </div>
                  )) || <p>Chưa có câu hỏi nào</p>}
              </CardContent>
            </Card>
          )}

        {/* Navigation buttons */}
        <div className="mt-6 flex gap-2">
          <Button onClick={() => navigateToDemo('multiple-choice')}>
            Xem Demo Trắc nghiệm
          </Button>
          <Button onClick={() => navigateToDemo('fill-in-blanks')}>
            Xem Demo Điền từ
          </Button>
        </div>
      </div>
    </div>
  );
}
