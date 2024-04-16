import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { decode, sign, verify } from "hono/jwt";
import { createBlogInput, updateBlogInput } from "@sujeet_17/common";

export const blogRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
  Variables: {
    userId: string;
  };
}>();

blogRouter.use("/*", async (c, next) => {
  //extract the user id and pass it down to the user
  const authHeader = c.req.header("authorization") || "";
  const user = await verify(authHeader, c.env.JWT_SECRET);
  if (user) {
    c.set("userId", user.id);
    await next();
  } else {
    c.status(403);
    return c.json({
      msg: "you haven't logged in",
    });
  }
});

blogRouter.post("/", async (c) => {
  const body = await c.req.json();
  const { success } = createBlogInput.safeParse(body);
  if (!success) {
    c.status(411);
    return c.json({
      msg: "Inputs are incorrects",
    });
  }
  const autherId = c.get("userId");
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const blog = await prisma.blog.create({
    data: {
      title: body.title,
      content: body.content,
      authorId: Number(autherId),
    },
  });
  return c.json({
    id: blog.authorId,
  });
});
blogRouter.put("/", async (c) => {
  const body = await c.req.json();
  const { success } = updateBlogInput.safeParse(body);
  if (!success) {
    c.status(411);
    return c.json({
      msg: "Inputs are incorrects",
    });
  }
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const blog = await prisma.blog.update({
    where: {
      id: body.id,
    },
    data: {
      title: body.title,
      content: body.content,
    },
  });
  return c.text("updated");
});

//add pagination
blogRouter.get("/bulk", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  const blog = await prisma.blog.findMany({
    select:{
      content:true, 
      title:true,
      id:true,
      auther:{
        select:{
          name:true
        }
      }
    }
  });

  return c.json({
    blog,
  });
});

blogRouter.get("/:id", async (c) => {
  const id = c.req.param("id");
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const blog = await prisma.blog.findFirst({
      where: {
        id: Number(id),
      },
      select:{
        id:true,
        title:true, 
        content:true, 
        auther:{
          select:{
            name:true
          }
        }
      }
    });
    return c.json({
      blog,
    });
  } catch (e) {
    c.status(411);
    return c.text("Error while fectiching blog post");
  }
});
