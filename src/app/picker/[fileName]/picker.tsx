"use client";
import { useEffect, useState } from "react";
import { getPosts, writePosts } from "./actions";
import "./page.css";
import { useRouter } from "next/navigation";

export default function Picker({ fileName }: { fileName: string }) {
  const [index, setIndex] = useState(-1);
  const [posts, setPosts] = useState([]);
  const [filter, setFilter] = useState<null | "picked" | "skipped" | "unset">(
    null
  );
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
        setIndex(Math.max(0, lastPickedIndex));
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
  console.log(index);
  const post = posts[index] as any;
  if (!post) return <div>none</div>;

  const canGoNext = index < posts.length - 1;
  const canGoPrev = index > 0;

  async function handlePick(pick: boolean) {
    post.picked = pick;
    writePosts(fileName, [...posts]);
    const updatedPosts = await getPosts(fileName);
    setPosts(updatedPosts);
    if (canGoNext && filter === null) {
      goDirection(1);
    }
  }

  function goDirection(direction: 1 | -1) {
    for (
      let i = index + direction;
      i >= 0 && i < posts.length;
      i += direction
    ) {
      if (
        (filter === "picked" && posts[i].picked) ||
        (filter === "skipped" && posts[i].picked === false) ||
        (filter === "unset" && posts[i].picked === null) ||
        filter === null
      ) {
        setIndex(i);
        return;
      }
    }
  }

  return (
    <div>
      <strong>
        {index + 1} of {posts.length}{" "}
        <a
          onClick={() => {
            router.push(`/picked/${fileName}`);
          }}
        >
          ({posts.filter((post) => post.picked).length} picked,{" "}
          {posts.filter((post) => post.picked === false).length} skipped,
          {posts.filter((post) => post.picked === undefined).length} unset)
        </a>
      </strong>
      <div>
        <button
          className="button"
          onClick={() => {
            if (filter === null) setFilter("picked");
            if (filter === "picked") setFilter("skipped");
            if (filter === "skipped") setFilter("unset");
            if (filter === "unset") setFilter(null);
          }}
        >
          {filter === "picked" && "only picked"}
          {filter === "skipped" && "only skipped"}
          {filter === "unset" && "only unset"}
          {filter === null && "no filter"}
        </button>

        <button
          onClick={() => {
            goDirection(-1);
          }}
          className="button"
          disabled={!canGoPrev}
        >
          Prev
        </button>
        <button
          onClick={() => {
            goDirection(+1);
          }}
          className="button"
          disabled={!canGoNext}
        >
          Next
        </button>

        <button onClick={() => handlePick(false)} className="button">
          skip
        </button>
        <button onClick={() => handlePick(true)} className="button">
          pick
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
