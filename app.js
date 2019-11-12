const express = require('express');
const cors = require('cors');
const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:8000'
}));

const db = {
  posts: [
    {
      id: 1,
      title: 'Post 1',
      body: 'P1 Body',
    },
    {
      id: 2,
      title: 'Post 2',
      body: 'something else here...',
    },
    {
      id: 3,
      title: 'Post 3',
      body: 'something else here...',
    }
  ],
  comments: [
    {
      id: 1,
      post: 1,
      body: "P1 C1 Body"
    },
    {
      id: 2,
      post: 1,
      body: "P1 C2 Body"
    },
    {
      id: 3,
      post: 2,
      body: "P2 C1 Body"
    },
    {
      id: 4,
      post: 2,
      body: "P2 C2 Body"
    },
    {
      id: 5,
      post: 3,
      body: "P3 C1 Body"
    }
  ]
};

app.post('/api/comments', (request, response) => {
  const comment = request.body;
  if (comment.post) {
    const post = db.posts.find((post) => {
      return post.id === comment.post;
    });
    if (post) {
      comment.id = db.comments.length + 1;
      db.comments.push(comment);
      response.json(comment);
    } else {
      response.status(404).send();
    }
  }
  else {
    response.json(
      {
        "errors": {
          "post": "post is required"
        }
      }
    );
    response.status(400).send(); 
  }
});

app.get('/api/posts/:id/comments', (request, response) => {
  const id = Number(request.params.id);
  const comments = db.comments.filter((comment) => {
    return comment.post === id;
  });
  response.json({comments});
});

app.delete("/api/comments/:id", (request, response) => {
  const id = Number(request.params.id);
  const comment = db.comments.find(comment => {
    return comment.id === id;
  });
  if (comment) {
    db.comments = db.comments.filter(comment => {
      return comment.id !== id;
    });
    response.status(204).send();
  } else {
    response.status(404).send();
  }
}); 

app.put("/api/comments/:id", (request, response) => {
  const id = Number(request.params.id);
  const comment = db.comments.find(comment => {
    return comment.id === id;
  })
  if (comment) {
    Object.assign(comment, request.body);
    response.status(204).json(comment).send();
  } else {
    response.status(404).send();
  }
});

// ===============
app.get('/api/posts', (request, response) => {
  response.json(db.posts);
});

app.post('/api/posts', (request, response) => {
  const post = request.body;  
  post.id = db.posts.length + 1;
  db.posts.push(post);
  response.json(post);
});

app.get('/api/posts/:id', (request, response) => {
  const id = Number(request.params.id);
  const post = db.posts.find((post) => {
    return post.id === id;
  });

  if (post) {
    response.json(post);
  } else {
    response.status(404).send();
  }
});

app.delete('/api/posts/:id', (request, response) => {
  const id = Number(request.params.id);
  const post = db.posts.find((post) => {
    return post.id === id;
  });

  if (post) {
    db.posts = db.posts.filter((post) => {
      return post.id !== id;
    });
    response.status(204).send();
  } else {
    response.status(404).send();
  }
});

app.put('/api/posts/:id', (request, response) => {
  const id = Number(request.params.id);
  const post = db.posts.find((post) => {
    return post.id === id;
  });
  if (post) {
    Object.assign(post, request.body)
    response.json(post);
  } else {
    response.status(404).send();
  }
});

app.listen(process.env.PORT || 8000);