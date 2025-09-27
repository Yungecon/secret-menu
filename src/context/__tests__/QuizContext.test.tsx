import { describe, it, expect, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { QuizProvider } from '../QuizContext'
import { useQuiz } from '../../hooks/useQuiz'
import { QuizAnswers } from '../../types'

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QuizProvider>{children}</QuizProvider>
)

describe('QuizContext', () => {
  it('should provide initial empty answers', () => {
    const { result } = renderHook(() => useQuiz(), { wrapper })
    
    expect(result.current.answers).toEqual({})
  })

  it('should update answers when setAnswers is called', () => {
    const { result } = renderHook(() => useQuiz(), { wrapper })
    
    const newAnswers: QuizAnswers = {
      sweetVsBitter: 'sweet',
      citrusVsStone: 'citrus'
    }

    act(() => {
      result.current.setAnswers(newAnswers)
    })

    expect(result.current.answers).toEqual(newAnswers)
  })

  it('should reset answers when resetQuiz is called', () => {
    const { result } = renderHook(() => useQuiz(), { wrapper })
    
    // First set some answers
    const answers: QuizAnswers = {
      sweetVsBitter: 'bitter',
      lightVsBoozy: 'boozy'
    }

    act(() => {
      result.current.setAnswers(answers)
    })

    expect(result.current.answers).toEqual(answers)

    // Then reset
    act(() => {
      result.current.resetQuiz()
    })

    expect(result.current.answers).toEqual({})
  })

  it('should throw error when useQuiz is used outside provider', () => {
    // Suppress console.error for this test
    const originalError = console.error
    vi.spyOn(console, 'error').mockImplementation(() => {})

    expect(() => {
      renderHook(() => useQuiz())
    }).toThrow('useQuiz must be used within a QuizProvider')

    console.error = originalError
  })
})