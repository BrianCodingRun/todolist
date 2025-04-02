"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Check, Trash, Edit, X, Save } from "lucide-react"
import type { Todo } from "./TodoListComponent"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface TodoItemProps {
  todoData: Todo
  onToggle: (id: string) => void
  onUpdate: (id: string, text: string) => void
  onDelete: (id: string) => void
}

export default function TodoItem({ todoData, onToggle, onUpdate, onDelete }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditText] = useState(todoData.text)
  const [translateX, setTranslateX] = useState(0)
  const [startX, setStartX] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const itemRef = useRef<HTMLLIElement>(null)

  // Reset edit state when todo changes
  useEffect(() => {
    setEditText(todoData.text)
  }, [todoData])

  const handleSave = () => {
    if (editText.trim()) {
      onUpdate(todoData.id, editText)
      setIsEditing(false)
    }
  }

  const handleCancel = () => {
    setEditText(todoData.text)
    setIsEditing(false)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartX(e.touches[0].clientX)
    setIsDragging(true)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return

    const currentX = e.touches[0].clientX
    const diff = currentX - startX

    // Limit the swipe distance
    if (diff < -100) {
      setTranslateX(-100)
    } else if (diff > 100) {
      setTranslateX(100)
    } else {
      setTranslateX(diff)
    }
  }

  const handleTouchEnd = () => {
    setIsDragging(false)

    // Swipe left to complete
    if (translateX < -50) {
      onToggle(todoData.id)
    }
    // Swipe right to delete
    else if (translateX > 50) {
      onDelete(todoData.id)
    }

    // Reset position with animation
    setTranslateX(0)
  }

  return (
    <li
      ref={itemRef}
      className={cn(
        "relative bg-secondary rounded-lg shadow-sm border border-gray-200 overflow-hidden transition-all duration-300",
        todoData.completed && "bg-gray-50 border-gray-100",
      )}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Background indicators for swipe actions */}
      <div className="absolute inset-0 flex">
        <div className="flex items-center justify-center bg-green-500 text-white w-1/2">
          <Check className="h-5 w-5" />
        </div>
        <div className="flex items-center justify-center bg-red-500 text-white w-1/2">
          <Trash className="h-5 w-5" />
        </div>
      </div>

      {/* Foreground content */}
      <div
        className={cn(
          "relative bg-white p-3 flex items-start gap-3 transition-transform duration-200",
          todoData.completed && "bg-gray-50",
        )}
        style={{ transform: `translateX(${translateX}px)` }}
      >
        {!isEditing ? (
          <>
            <button
              onClick={() => onToggle(todoData.id)}
              className={cn(
                "flex-shrink-0 w-5 h-5 mt-0.5 rounded-full border border-gray-300",
                todoData.completed && "bg-blue-500 border-blue-500",
              )}
            >
              {todoData.completed && <Check className="h-4 w-4 text-white" />}
              <span className="sr-only">Mark as {todoData.completed ? "incomplete" : "complete"}</span>
            </button>

            <div className="flex-1 min-w-0">
              <p className={cn("text-gray-800 break-words", todoData.completed && "line-through text-gray-500")}>
                {todoData.text}
              </p>
            </div>

            <div className="flex items-center gap-1 flex-shrink-0">
              <Button
                variant="link"
                size="icon"
                onClick={() => setIsEditing(true)}
                disabled={todoData.completed}
                className="h-8 w-8 text-black"
              >
                <Edit className="h-4 w-4" />
                <span className="sr-only">Modifier</span>
              </Button>
              <Button
                variant="link"
                size="icon"
                onClick={() => onDelete(todoData.id)}
                className="h-8 w-8 text-red-500"
              >
                <Trash className="h-4 w-4" />
                <span className="sr-only">Supprimer</span>
              </Button>
            </div>
          </>
        ) : (
          <div className="w-full space-y-3">
            <Input
              type="text"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="w-full text-black"
              autoFocus
            />
            <div className="flex justify-end gap-2">
              <Button size="sm" onClick={handleCancel}>
                <X className="h-4 w-4 mr-1" />
                Annuler
              </Button>
              <Button size="sm" onClick={handleSave} disabled={!editText.trim()}>
                <Save className="h-4 w-4 mr-1" />
                Enregistrer
              </Button>
            </div>
          </div>
        )}
      </div>
    </li>
  )
}