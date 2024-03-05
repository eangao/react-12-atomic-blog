import { createContext, useContext, useMemo, useState } from "react";
import { faker } from "@faker-js/faker";

function createRandomPost() {
  return {
    title: `${faker.hacker.adjective()} ${faker.hacker.noun()}`,
    body: faker.hacker.phrase(),
  };
}

// 1) CREATE A CONTEXT
const PostContext = createContext();

function PostProvider({ children }) {
  const [posts, setPosts] = useState(() =>
    Array.from({ length: 30 }, () => createRandomPost())
  );
  const [searchQuery, setSearchQuery] = useState("");

  // Derived state. These are the posts that will actually be displayed
  const searchedPosts =
    searchQuery.length > 0
      ? posts.filter((post) =>
          `${post.title} ${post.body}`
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        )
      : posts;

  function handleAddPost(post) {
    setPosts((posts) => [post, ...posts]);
  }

  function handleClearPosts() {
    setPosts([]);
  }

  const value = useMemo(() => {
    return {
      posts: searchedPosts,
      onAddPost: handleAddPost,
      onClearPosts: handleClearPosts,
      searchQuery,
      setSearchQuery,
    };
  }, [searchedPosts, searchQuery]);

  return (
    // 2) PROVIDE VALUE TO CHILD COMPONENTS
    <PostContext.Provider
      //     because their parent re-rendered
      // which is what makes sense for these two, for example
      // not because context changed.
      // So why does that appear here?
      // Well, the reason is that
      // this value right here is an object, right?
      // And this post provider is a child element
      // of the app component.
      // And so therefore, when the app component re-renders
      // then this post provider re-renders, as well
      // and therefore, this object will be recreated.
      // And so, if this object will be recreated
      // it means that the context value has changed
      // and therefore, all the components that consume that context
      // are going to be re-rendered.
      // All right, so that's the reason why here we see
      // that the context has changed
      // because actually it did change because this value here
      // so this object did update.
      // So, the solution for that is to memorize this object.
      //////////////////////////////
      //object
      // value={{
      //   posts: searchedPosts,
      //   onAddPost: handleAddPost,
      //   onClearPosts: handleClearPosts,
      //   searchQuery,
      //   setSearchQuery,
      // }}
      //////////////////////

      value={value}
    >
      {children}
    </PostContext.Provider>
  );
}

function usePosts() {
  const context = useContext(PostContext);
  if (context === undefined)
    throw new Error("PostContext was used outside of the PostProvider");
  return context;
}

export { PostProvider, usePosts };

// to optimize this a little bit.

// But before we go do that
// it's actually very important to understand
// that you only need to optimize your context

// in case that three things are true at the same time.

// So first of all, the state
// in the context needs to change all the time.

// Second, the context has many consumers

// and third, and probably most importantly
// the app is actually slow and laggy.

// So only if all of these are true
// it is time to optimize context.

// Now, the actual optimization of your context
// can be quite confusing
// because it's gonna depend a lot
// on how you build your application
// and how you set up your context
// and also, what exactly you pass into the context.
// And so, I cannot give you a clear recipe here
// but I will just try to show you a few different things here.
