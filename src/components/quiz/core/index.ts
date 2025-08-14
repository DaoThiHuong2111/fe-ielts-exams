// Core quiz components
export { AnswerBox } from '../answer-box'
export { ReadingPassage } from '../reading-passage'
export { UniversalQuizContainer } from '../universal-quiz-container'

// Multiple Choice components
export { AnswerOption } from '../multiple-choice/answer-option'
export { QuizContainer } from '../multiple-choice/quiz-container'
export { QuizQuestion } from '../multiple-choice/quiz-question'

// Fill in the Blanks components
export { BlankInput } from '../fill-in-blanks/blank-input'
export { FillInBlanksContainer } from '../fill-in-blanks/fill-in-blanks-container'
export { FillInBlanksQuestion } from '../fill-in-blanks/fill-in-blanks-question'

// Core types
export type {
    BlankPosition, FillInBlanksAnswer, FillInBlanksData, MultipleChoiceAnswer, MultipleChoiceData, QuizAnswer, QuizData,
    QuizOption,
    QuizType
} from '@/types/quiz'

