import { Link } from "react-router-dom";

interface BlogCardProps {
  authorName: string;
  title: string;
  content: string;
  publishedDate: string;
  id: number;
}
export const BlogCard = ({
  id,
  authorName,
  title,
  content,
  publishedDate,
}: BlogCardProps) => {
  return (
    <Link to={`/blog/${id}`}>
      <div className="p-4 border-b border-slate-200 pb-3 w-screen max-w-screen-md cursor-pointer">
        <div className="flex">
          <Avatar name={authorName} size={"small"} />
          <div className="font-extralight pl-2 text-sm flex justify-center flex-col">
            {authorName}
          </div>
          <div className="text-xs font-thin pl-2 flex justify-center flex-col ">
            <Circle />
          </div>
          <div className="font-thin text-slate-600 text-sm pl-2 flex justify-center flex-col">
            {publishedDate}
          </div>
        </div>
        <div className="text-xl font-semibold pt-2">{title}</div>
        <div className="text-md font-thin pt-2">
          {content.slice(0, 100) + "...."}
        </div>
        <div className="text-slate-400 font-thin text-sm pt-4">{`${Math.ceil(
          content.length / 100
        )} minute(s) read`}</div>
      </div>
    </Link>
  );
};

 export function Circle() {
  return <div className="w-1 h-1 rounded-full bg-slate-500"></div>;
}

export function Avatar({
  name,
  size = "small",
}: {
  name: string;
  size?: "small" | "big";
}) {
  return (
    <div
      className={`relative inline-flex items-center justify-center ${
        size === "small" ? "h-5 w-5" : "h-10 w-10"
      } overflow-hidden
             bg-gray-100  rounded-full dark:bg-gray-600`}
    >
      <span className="font-sm items-center text-gray-600 dark:text-gray-300 ">
        {name[0]}
      </span>
    </div>
  );
}
