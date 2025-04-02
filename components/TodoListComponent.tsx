"use client"

import React, { useState, useEffect } from "react"
import AddTodo from "./AddTodo"
import TodoItem from "./TodoItem"

export interface Todo {
    id: string
    text: string
    completed: boolean
}

export default function TodoListComponent() {

    const [todos, setTodos] = useState<Todo[]>(() => {
        // Load todos from localStorage on client side
        if (typeof window !== "undefined") {
            const saved = localStorage.getItem("todos")
            return saved ? JSON.parse(saved) : []
        }
        return []
    })

    const addTodo = (text: string) => {
        setTodos([
            ...todos,
            {
                id: Date.now().toString(),
                text,
                completed: false,
            },
        ])
    }

    const toggleTodo = (id: string) => {
        setTodos(todos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)))
    }

    const updateTodo = (id: string, text: string) => {
        setTodos(todos.map((todo) => (todo.id === id ? { ...todo, text } : todo)))
    }

    const deleteTodo = (id: string) => {
        setTodos(todos.filter((todo) => todo.id !== id))
    }

    // Save todos to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem("todos", JSON.stringify(todos))
    }, [todos])

    return (
        <div className="space-y-6">
            <div className="text-center">
                <h1 className="text-2xl font-bold text-gray-800">Todo List</h1>
                <p className="text-gray-500">Créer, afficher, modifier et supprimer vos tâches !</p>
            </div>
            <AddTodo onAdd={addTodo} />
            {todos.length > 0 && (
                <ul className="space-y-2">
                    {todos.map((todo) => (
                        <TodoItem key={todo.id} todoData={todo} onToggle={toggleTodo} onUpdate={updateTodo} onDelete={deleteTodo} />
                    ))}
                </ul>
            )}
            {
                todos.length === 0 && <div className="text-center py-8 text-gray-500">Aucune tâches à faire actuellement</div>
            }
        </div>
    )
}
