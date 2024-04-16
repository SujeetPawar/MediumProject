import axios from "axios";
import { useEffect, useState } from "react";
import { BACKEND_URL } from "../config";

export interface Blog {
  content: string;
  title: string;
  id: number;
  auther: {
    name: string;
  };
}

export const useBlogs = () => {
  const [loading, setLoading] = useState(true);
  const [blogs, setBlogs] = useState<Blog[]>([]);

  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/api/v1/blog/bulk`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      })
      .then((respons) => {
        setBlogs(respons.data.blog);
        setLoading(false);
      });
  });

  return {
    loading,
    blogs,
  };
};


export const useBlog = ({id} : {id:string}) =>{
  const [loading, setLoading] = useState(true);
  const [blog, setBlog] = useState<Blog>();

  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/api/v1/blog/${id}`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      })
      .then((respons) => {
        setBlog(respons.data.blog);
        setLoading(false);
      });
  }, [id]);

  return {
    loading,
    blog,
  }; 
}
