import fs from "fs";
import path from "path";
import "./page.css";
import { redirect, RedirectType } from "next/navigation";
export default async function PickerPage({
  params,
}: {
  params: Promise<{ fileName: string; index: number }>;
}) {
  let { fileName, index } = await params;
  index = Number(index);
  let posts = [];

  if (fileName) {
    const filePath = path.join(process.cwd(), "data", fileName); // Adjust directory as needed
    try {
      const fileContent = await fs.promises.readFile(filePath, "utf-8");
      posts = JSON.parse(fileContent);
    } catch (error) {
      throw new Error("Error reading file: " + error.message);
    }
  }

  async function writeJson(newPosts) {
    "use server";
    const filePath = path.join(process.cwd(), "data", fileName); // Adjust directory as needed
    try {
      await fs.promises.writeFile(filePath, JSON.stringify(newPosts, null, 4));
    } catch (error) {
      throw new Error("Error reading file: " + error.message);
    }
  }

  const post = posts[index] as any;
  if (!post) return <div>none</div>;

  const canGoNext = index < posts.length - 1;
  const canGoPrev = index > 0;

  async function pick(formData: FormData) {
    "use server";
    post.picked = !!!post.picked;
    writeJson(posts);
    if (canGoNext) {
      redirect(`/picker/${fileName}/${index + 1}`);
    }
  }

  return (
    <div>
      <h1>
        <a href={post.url}>
          {index + 1} of {posts.length}
        </a>
      </h1>
      <div>
        <form
          action={async () => {
            "use server";
            redirect(`/picker/${fileName}/${index - 1}`, RedirectType.replace);
          }}
        >
          <button type="submit" className="button" disabled={!canGoPrev}>
            Prev
          </button>
        </form>
        <form
          action={async () => {
            "use server";
            redirect(`/picker/${fileName}/${index + 1}`, RedirectType.replace);
          }}
        >
          <button type="submit" className="button" disabled={!canGoNext}>
            Next
          </button>
        </form>

        <button
          className="button"
          onClick={async () => {
            "use server";
            redirect(`/picked/${fileName}`);
          }}
        >
          {posts.filter((post) => post.picked).length} picked
        </button>

        <form action={pick}>
          <button className="button">{post.picked ? "unpick" : "pick"}</button>
        </form>
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
