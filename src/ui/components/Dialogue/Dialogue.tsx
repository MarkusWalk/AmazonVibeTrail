import React, { useState, useEffect } from 'react'
import { Modal } from '../Modal'
import { allDialogues } from '@data/dialogues/sampleDialogues'
import type { DialogueTree, DialogueNode, DialogueChoice } from '@models/dialogue'
import styles from './Dialogue.module.css'

interface DialogueProps {
  dialogueId: string
  onClose: () => void
  onChoiceSelected?: (choiceId: string, choice: DialogueChoice) => void
  onDialogueComplete?: () => void
}

export const Dialogue: React.FC<DialogueProps> = ({
  dialogueId,
  onClose,
  onChoiceSelected,
  onDialogueComplete,
}) => {
  const [dialogueTree, setDialogueTree] = useState<DialogueTree | null>(null)

  // Load dialogue tree based on dialogueId
  useEffect(() => {
    const tree = allDialogues.find((d: DialogueTree) => d.id === dialogueId)
    if (tree) {
      setDialogueTree(tree)
    } else {
      console.warn(`[Dialogue] No dialogue tree found for ID: ${dialogueId}`)
    }
  }, [dialogueId])
  const [currentNode, setCurrentNode] = useState<DialogueNode | null>(null)
  const [textDisplay, setTextDisplay] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [canContinue, setCanContinue] = useState(false)

  // Initialize dialogue
  useEffect(() => {
    if (dialogueTree) {
      const startNode = dialogueTree.nodes.find(
        (n) => n.id === dialogueTree.startNodeId
      )
      if (startNode) {
        setCurrentNode(startNode)
        setTextDisplay('')
        setIsTyping(true)
        setCanContinue(false)
      }
    }
  }, [dialogueTree])

  // Typewriter effect
  useEffect(() => {
    if (!currentNode || !isTyping) return

    let currentIndex = 0
    const fullText = currentNode.text
    setTextDisplay('')

    const typingInterval = setInterval(() => {
      if (currentIndex < fullText.length) {
        setTextDisplay(fullText.substring(0, currentIndex + 1))
        currentIndex++
      } else {
        setIsTyping(false)
        setCanContinue(true)
        clearInterval(typingInterval)
      }
    }, 30) // Typing speed in ms per character

    return () => clearInterval(typingInterval)
  }, [currentNode, isTyping])

  const handleSkipTyping = () => {
    if (isTyping && currentNode) {
      setTextDisplay(currentNode.text)
      setIsTyping(false)
      setCanContinue(true)
    }
  }

  const handleContinue = () => {
    if (!currentNode || !dialogueTree) return

    // If there's an auto-advance, use it
    if (currentNode.nextNodeId && !currentNode.choices) {
      const nextNode = dialogueTree.nodes.find(
        (n) => n.id === currentNode.nextNodeId
      )
      if (nextNode) {
        setCurrentNode(nextNode)
        setIsTyping(true)
        setCanContinue(false)
      } else {
        // End of dialogue
        handleDialogueEnd()
      }
    }
  }

  const handleChoiceClick = (choice: DialogueChoice) => {
    if (isTyping) return

    onChoiceSelected?.(choice.id, choice)

    if (choice.nextNodeId === null) {
      // End dialogue
      handleDialogueEnd()
    } else {
      // Move to next node
      const nextNode = dialogueTree?.nodes.find(
        (n) => n.id === choice.nextNodeId
      )
      if (nextNode) {
        setCurrentNode(nextNode)
        setIsTyping(true)
        setCanContinue(false)
      } else {
        handleDialogueEnd()
      }
    }
  }

  const handleDialogueEnd = () => {
    onDialogueComplete?.()
    onClose()
  }

  if (!dialogueTree || !currentNode) {
    return null
  }

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      size="large"
      closeOnOverlayClick={false}
      showCloseButton={false}
    >
      <div className={styles.dialogueContainer}>
        {/* Speaker Portrait */}
        <div className={styles.portraitSection}>
          <div className={styles.portraitFrame}>
            {currentNode.portrait ? (
              <div className={styles.portrait}>
                {/* Placeholder - would show sprite here */}
                <div className={styles.portraitPlaceholder}>
                  👤
                </div>
              </div>
            ) : (
              <div className={styles.portraitPlaceholder}>👤</div>
            )}
          </div>
          <div className={styles.speakerName}>{currentNode.speaker}</div>
        </div>

        {/* Dialogue Text */}
        <div className={styles.textSection}>
          <div className={styles.textBox} onClick={handleSkipTyping}>
            <p className={styles.dialogueText}>{textDisplay}</p>
            {isTyping && <span className={styles.typingIndicator}>▼</span>}
          </div>

          {/* Continue Button (for auto-advance nodes) */}
          {!isTyping &&
            canContinue &&
            !currentNode.choices &&
            currentNode.nextNodeId && (
              <button className={styles.continueButton} onClick={handleContinue}>
                Continue ▶
              </button>
            )}

          {/* Choices */}
          {!isTyping && currentNode.choices && currentNode.choices.length > 0 && (
            <div className={styles.choices}>
              {currentNode.choices.map((choice, index) => (
                <button
                  key={choice.id}
                  className={styles.choiceButton}
                  onClick={() => handleChoiceClick(choice)}
                >
                  <span className={styles.choiceNumber}>{index + 1}</span>
                  <span className={styles.choiceText}>{choice.text}</span>
                </button>
              ))}
            </div>
          )}

          {/* End Dialogue (if no choices and no next node) */}
          {!isTyping &&
            canContinue &&
            !currentNode.choices &&
            !currentNode.nextNodeId && (
              <button
                className={styles.continueButton}
                onClick={handleDialogueEnd}
              >
                End Conversation
              </button>
            )}
        </div>
      </div>

      {/* Skip hint */}
      {isTyping && (
        <div className={styles.skipHint}>Click text to skip typing</div>
      )}
    </Modal>
  )
}
