"use client";
import { useEffect, useState } from "react";
import { getPosts, writePosts } from "./actions";
import "./page.css";
import { useRouter } from "next/navigation";

export default function Picker({ fileName }: { fileName: string }) {
  const [index, setIndex] = useState(-1);
  const [posts, setPosts] = useState([]);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const posts = await getPosts(fileName);
      setPosts(posts);

      if (sessionStorage.getItem(fileName)) {
        setIndex(Number(sessionStorage.getItem(fileName)));
      } else {
        const lastPickedIndex = posts
          .map((post) => post.picked !== undefined)
          .lastIndexOf(true);
        setIndex(lastPickedIndex);
      }
    })();
  }, []);

  useEffect(() => {
    console.log("set", index);
    if (index >= 0) sessionStorage.setItem(fileName, String(index));
  }, [index]);

  useEffect(() => {
    const preloadCount = 10;

    for (let i = -preloadCount; i < preloadCount; i++) {
      const post = posts[index + i];
      if (post) {
        console.log("preload", index + i);
        post.images.forEach((image) => {
          const img = new Image();
          img.src = image;
        });
      }
    }
  }, [posts, index]);

  const post = posts[index] as any;
  if (!post) return <div>none</div>;

  const canGoNext = index < posts.length - 1;
  const canGoPrev = index > 0;

  async function handlePick(formData: FormData) {
    post.picked = !!!post.picked;
    writePosts(fileName, [...posts]);
    const updatedPosts = await getPosts(fileName);
    setPosts(updatedPosts);
    if (canGoNext) {
      setIndex(index + 1);
    }
  }

  return (
    <div>
      <h2>
        <a href={post.url}>
          {index + 1} of {posts.length}
        </a>
      </h2>
      <div>
        <button
          onClick={() => {
            setIndex(index - 1);
          }}
          className="button"
          disabled={!canGoPrev}
        >
          Prev
        </button>
        <button
          onClick={() => {
            setIndex(index + 1);
          }}
          className="button"
          disabled={!canGoNext}
        >
          Next
        </button>

        <button
          className="button"
          onClick={() => {
            router.push(`/picked/${fileName}`);
          }}
        >
          {posts.filter((post) => post.picked).length} picked
        </button>

        <button onClick={handlePick} className="button">
          {post.picked ? "unpick" : "pick"}
        </button>
        <hr />
        {post.picked == undefined && "unset"}
        {post.picked === false && "skipped"}
        {post.picked && "picked"}
      </div>
      <hr />

      <Post post={post} />
    </div>
  );
}

function Post({ post, ...props }) {
  return (
    <div {...props}>
      <pre>{post.text}</pre>

      {post.images?.map((image: any) => (
        <img
          key={image}
          className="postImage"
          // src="https://placehold.co/600x400/EEE/31343C"
          src={image}
          alt=""
        />
      ))}
    </div>
  );
}
