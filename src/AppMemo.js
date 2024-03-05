import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { faker } from "@faker-js/faker";

function createRandomPost() {
  return {
    title: `${faker.hacker.adjective()} ${faker.hacker.noun()}`,
    body: faker.hacker.phrase(),
  };
}

function App() {
  const [posts, setPosts] = useState(() =>
    Array.from({ length: 30 }, () => createRandomPost())
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [isFakeDark, setIsFakeDark] = useState(false);

  // Derived state. These are the posts that will actually be displayed
  const searchedPosts =
    searchQuery.length > 0
      ? posts.filter((post) =>
          `${post.title} ${post.body}`
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        )
      : posts;

  //       You see that useMemo and useCallback are pretty similar,
  // but the difference is that useCallback
  // will not immediately call this function,
  // but will instead simply memorize this function,
  // while here, useMemo will basically simply
  // memorize the result of calling this callback.
  // That's the main difference.
  // UseMemo just stores a result, so like a value,
  // which is the result of this callback,
  // while here, in useCallback, only the function itself
  // is actually memorized now.
  const handleAddPost = useCallback(function handleAddPost(post) {
    //     We can basically think of these state setter functions
    // as being automatically memorized.
    // And in fact, this is also the reason
    // why it's completely okay to omit them
    // from the dependency array of all these hooks,
    // so from useEffect, useCallback, and useMemo.
    // In fact, we do have a state setter function right here.
    // We are using a function here inside this useCallback,
    // but still, React, or ESLint, is not complaining
    // that we're not using that function
    // here in the dependency array,
    // while if we were, for example, to use,
    // for example, just the posts,
    // then here, React would complain.
    // Here, we would then have to place the posts
    // inside the dependency array
    // so that whenever the posts change,
    // React could then update the function here in the cache,
    // so it could basically cache the new version
    // of this function with these new variables.
    // But again, with the state setter functions,
    // that's not necessary.
    // And that's true for all the dependency arrays
    // and all the three hooks that have them.
    // Now okay, now that's actually all I had to tell you
    // about these three important tools.
    // Memo, useMemo, and useCallback.
    // Now, as I mentioned earlier,
    // you're not going to use these tools all the time
    // when you work with your own React applications,
    // but you still need to have them in your toolbox.
    setPosts((posts) => [post, ...posts]);
  }, []);

  //   Now, some teams, for some reason,
  // choose to wrap each and every function and value
  // into a useCallback or a useMemo,
  // but that actually makes very little sense
  // and it might even do more harm than good
  // in most of these cases.
  // Using one of these functions here, like useCallback,
  // actually has a cost as well.
  // React needs to run this function
  // and needs to store the function in memory.
  // And so, that only makes sense
  // if we actually see some improvement here in our application.
  // For example, this component right here,
  // there's no need to wrap it into a useCallback
  // because this is not creating any problems for us
  // anywhere in the application.
  // And so, it's best to just find some slow components
  // that do actually have a visible bad performance
  // and then using the tools that we just learned about
  // to only optimize those.
  function handleClearPosts() {
    setPosts([]);
  }

  // Whenever `isFakeDark` changes, we toggle the `fake-dark-mode` class on the HTML element (see in "Elements" dev tool).
  useEffect(
    function () {
      document.documentElement.classList.toggle("fake-dark-mode");
    },
    [isFakeDark]
  );

  const archiveOptions = useMemo(() => {
    return {
      show: false,
      title: `Post archive in addition to ${posts.length} main posts`,
    };
  }, [posts.length]);

  return (
    <section>
      <button
        onClick={() => setIsFakeDark((isFakeDark) => !isFakeDark)}
        className="btn-fake-dark-mode"
      >
        {isFakeDark ? "☀️" : "🌙"}
      </button>

      <Header
        posts={searchedPosts}
        onClearPosts={handleClearPosts}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      <Main posts={searchedPosts} onAddPost={handleAddPost} />
      <Archive
        archiveOptions={archiveOptions}
        onAddPost={handleAddPost}
        ///////////////////////////////
        //         Well, basically React guarantees that the setter functions
        // of the use state hook always have a stable identity,
        // which means that they will not change on renders.
        // We can basically think of these state setter functions
        // as being automatically memorized.
        // And in fact, this is also the reason
        // why it's completely okay to omit them
        // from the dependency array of all these hooks,
        // so from useEffect, useCallback, and useMemo.
        setIsFakeDark={setIsFakeDark}
      />
      <Footer />
    </section>
  );
}

function Header({ posts, onClearPosts, searchQuery, setSearchQuery }) {
  return (
    <header>
      <h1>
        <span>⚛️</span>The Atomic Blog
      </h1>
      <div>
        <Results posts={posts} />
        <SearchPosts
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
        <button onClick={onClearPosts}>Clear posts</button>
      </div>
    </header>
  );
}

function SearchPosts({ searchQuery, setSearchQuery }) {
  return (
    <input
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      placeholder="Search posts..."
    />
  );
}

function Results({ posts }) {
  return <p>🚀 {posts.length} atomic posts found</p>;
}

function Main({ posts, onAddPost }) {
  return (
    <main>
      <FormAddPost onAddPost={onAddPost} />
      <Posts posts={posts} />
    </main>
  );
}

function Posts({ posts }) {
  return (
    <section>
      <List posts={posts} />
    </section>
  );
}

function FormAddPost({ onAddPost }) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const handleSubmit = function (e) {
    e.preventDefault();
    if (!body || !title) return;
    onAddPost({ title, body });
    setTitle("");
    setBody("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Post title"
      />
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Post body"
      />
      <button>Add post</button>
    </form>
  );
}

function List({ posts }) {
  return (
    <ul>
      {posts.map((post, i) => (
        <li key={i}>
          <h3>{post.title}</h3>
          <p>{post.body}</p>
        </li>
      ))}
    </ul>
  );
}

const Archive = memo(function Archive({ archiveOptions, onAddPost }) {
  // Here we don't need the setter function. We're only using state to store these posts because the callback function passed into useState (which generates the posts) is only called once, on the initial render. So we use this trick as an optimization technique, because if we just used a regular variable, these posts would be re-created on every render. We could also move the posts outside the components, but I wanted to show you this trick 😉
  const [posts] = useState(() =>
    // 💥 WARNING: This might make your computer slow! Try a smaller `length` first
    Array.from({ length: 30000 }, () => createRandomPost())
  );

  const [showArchive, setShowArchive] = useState(archiveOptions.show);

  return (
    <aside>
      <h2>{archiveOptions.title}</h2>
      <button onClick={() => setShowArchive((s) => !s)}>
        {showArchive ? "Hide archive posts" : "Show archive posts"}
      </button>

      {showArchive && (
        <ul>
          {posts.map((post, i) => (
            <li key={i}>
              <p>
                <strong>{post.title}:</strong> {post.body}
              </p>
              <button onClick={() => onAddPost(post)}>Add as new post</button>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
});

function Footer() {
  return <footer>&copy; by The Atomic Blog ✌️</footer>;
}

export default App;
