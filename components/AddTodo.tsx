"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface AddTodoProps {
  onAdd: (text: string) => void
}

export default function AddTodo({ onAdd }: AddTodoProps) {
  const [text, setText] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (text.trim()) {
      onAdd(text.trim())
      setText("")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex items-center space-x-2">
        <Input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Ajouter une nouvelle tâche..."
          className="flex-1"
        />
        <Button type="submit" disabled={!text.trim()}>
          Créer
        </Button>
      </div>
    </form>
  )
}