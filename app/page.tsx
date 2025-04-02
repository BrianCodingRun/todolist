import TodoListComponent from "@/components/TodoListComponent";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 md:p-24">
      <div className="w-full max-w-md mx-auto">
        <TodoListComponent />
      </div>
    </main>
  );
}
