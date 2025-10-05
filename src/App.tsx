import { useEffect, useState } from "react";
import { Button } from "./components/ui/Button";
import { Card } from "./components/ui/Card";

interface Post {
  id: number;
  title: string;
  description: string;
}

function App() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const apiUrl = "/api/posts";

    fetch(apiUrl, {
      signal: controller.signal,
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error("Failed to load posts");
        }
        const data = await response.json();
        setPosts(data.posts ?? []);
      })
      .catch((err: Error) => {
        if (err.name !== "AbortError") {
          setError(err.message);
        }
      })
      .finally(() => setIsLoading(false));

    return () => controller.abort();
  }, []);

  return (
    <main className="app">
      <header className="app__header">
        <h1>Orchids Final</h1>
        <p>Dockerized starter kit with Next.js, Vite, and Postgres</p>
      </header>

      <section className="app__actions">
        <Button
          onClick={() => window.open("https://docs.railway.app", "_blank", "noopener")}
        >
          Open Railway Docs
        </Button>
      </section>

      <section className="app__content">
        <Card title="API Posts">
          {isLoading && <p>Loading posts...</p>}
          {error && <p className="error">{error}</p>}
          {!isLoading && !error && (
            <ul className="posts">
              {posts.map((post) => (
                <li key={post.id}>
                  <h3>{post.title}</h3>
                  <p>{post.description}</p>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </section>
    </main>
  );
}

export default App;
