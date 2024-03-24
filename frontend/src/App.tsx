import { useEffect, useState } from "react";

type Todo = {
  id: string;
  text: string;
};

function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        setLoading(true);
        const res = await fetch("http://localhost:5000/todos");
        const json = await res.json();
        setTodos(json);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Something went wrong");
        setLoading(false);
      }
    };

    fetchTodos();
  }, []);

  const addTodo = async (text: string) => {
    try {
      const res = await fetch("http://localhost:5000/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });
      const newTodo = await res.json();
      setTodos((prev) => [...prev, newTodo]);
    } catch (err) {
      console.error(err);
    }
  };

  const updateTodo = async (id: string, text: string) => {
    try {
      await fetch(`http://localhost:5000/todos/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });
      setTodos((prev) =>
        prev.map((todo) => (todo.id === id ? { ...todo, text } : todo))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      await fetch(`http://localhost:5000/todos/${id}`, {
        method: "DELETE",
      });
      setTodos((prev) => prev.filter((todo) => todo.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return { todos, loading, error, addTodo, updateTodo, deleteTodo };
}

export default function App() {
  const { todos, loading, error, addTodo, updateTodo, deleteTodo } = useTodos();
  const [text, setText] = useState<string>("");

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white bg-opacity-80 shadow-lg rounded-md p-8 backdrop-blur-lg backdrop-filter border border-gray-300">
        <h1 className="text-2xl font-bold mb-4 text-center text-gray-800">
          TODO List
        </h1>
        <div className="mb-4 flex flex-row gap-2">
          <input
            className="shadow appearance-none h-10 border rounded w-full py-2 px-3 text-gray-800 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            placeholder="Add new todo"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button
            className="mb-4 px-4 h-10 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none whitespace-nowrap"
            onClick={() => {
              addTodo(text);
              setText("");
            }}
          >
            Add Todo
          </button>
        </div>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">Error: {error}</p>
        ) : (
          <ul>
            {todos.map((todo) => (
              <li
                key={todo.id}
                className="mb-2 flex flex-row gap-2 items-center"
              >
                <input
                  type="text"
                  defaultValue={todo.text}
                  className="border rounded px-2 py-1 focus:outline-none focus:ring focus:border-blue-500 flex-grow bg-gray-50 text-gray-800"
                  onBlur={(e) => {
                    updateTodo(todo.id, e.target.value);
                  }}
                />
                <button
                  className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none"
                  onClick={() => deleteTodo(todo.id)}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
