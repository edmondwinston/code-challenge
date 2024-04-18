## Requirements Analysis

> 1. We have a website with a score board, which shows the top 10 user’s scores.

- _Score board_ -> Scoring data -> **CRUD** as a base
- _Top 10_ -> **Limit** query
- A normal score board would allow its users to perform custom querying ->
  **Search** query & **Filter** query
- Pagination implementation could be required for the search view.

> 2. We want live update of the score board.

- The preferred ones are WS and SSE, depends on what kind of score this board is
  displaying, i.e. the update interval required from the business. Simple
  polling may also be an option.
- Pub/sub could be implemented using GraphQL, if we are allowed to be fancy; but
  Redis Stream is also not bad, as in a distributed setting where our upstream
  is another microservice or a third-party one, consuming from a stream and
  having the top 10 in a sorted set can be an efficient solution.

> 3. User can do an action (which we do not need to care what the action is),
   > completing this action will increase the user’s score.

- _Action_ -> Acknowledgement -> Clients need to have update capability -> SSE
  may not be the best choice -> _WS_ and _Redis Stream_
- The score board will need to be updated _immediately_.

> 4. Upon completion the action will dispatch an API call to the application
   > server to update the score.

- Didn't see this when I wrote the above. Since this is a generic test, I will
  make assumptions in the specs.
- If later analysis make it obvious that WS is an overkill, then the client
  could update the stream directly, and we may not have to do anything besides
  configurating it (which is what I would preferred, in case there are no
  further requirements).

> 5. We want to prevent malicious users from increasing scores without
   > authorisation.

- The term _malicious users_ has several different interpretations, and so is
  _authorisation_. Most of the time, a requirement like this would indicate both
  **OAth** and **RBAC** implementation, but for the greater good, we will assume
  that RBAC is just a list of emails, and if the Google OAth email matches one
  of them, update right is granted.

## Approaches Evaluation

Approaches below exclude authentication, and focus on developing a flow to make
updating the score and the score board seamless.

> The first question raised in the analysis above is whether to use WS or SSE,
> but by taking a step back and looking at the big picture, we realise the live
> feature of the score board requires (1) an event-based connection (2) a
> database. This analysis results in two genre of approaches, either
> implementing them separately, or as a whole

**Approach 1: SSE/Long-polling (LP), an update endpoint, and a database**

Client maintains the live score board using either SSE or LP, and pushes score
updates to an endpoint where they are published across subscriptions of an
observer.

Something like `BehaviourSubject` is preferred in order for new subscribers to
conveniently have the latest top 10 without having to query the database every
single time. Again, we would want to minimise the latency, so this subject is
storing the top 20.

```ts
// file: scoring.service.ts

// `CustomBehaviourSubject` filter values that shouldn't be notified on the observer side.
const topScoreSubject = new CustomBehaviourSubject([]);

// ...

const scoreUpdated = (req: Request, res: Response) => {
  const top20 = topScoreSubject.value;
  const [newTop20, updatedTop] = insertAndUpdateIfNeccessary(
    req.payload.user,
    top20,
  );

  if (updatedTop === 10) {
    topScoreSubject.next(newTop20);
  } else if (updatedTop === 20) {
    topScoreSubject.next({ shouldNotify: false, v: newTop20 });
  } else {
    insertToDb(req.payload.user);
  }
};

// file: scoring.controller.ts

export const scoreRouter = express.Router()
  .post("/", scoreUpdated);
```

**Approach 2: Redis Stream, Pub/Sub, and maybe a wrapper service**

To be clear, Redis Stream is a data structure, not something like Pub/Sub, which
is essentially a socket and will block. The idea here is that clients will
subscribe to a top-10 channel, which will publish only when the top 10 changes,
while new updates will be added into a stream for future references. Top 10 can
be kept track using a sorted set, as mentioned, and updated via triggers that we
register to Redis itself. This would drastically reduce the need for a separate
service, which does not mean we should, but rather consider based on the current
architecture and client needs.

```js
redis.registerStreamTrigger(
  "score-updated",
  "stream:*",
  function (c, data) {
    // Callback run on each score update added to the stream.
    const top10 = c.call("ZREVRANGE", "ss_top10_scores", 0, 9);
    c.call("ZADD", "ss_top10_scores", data.score, data.username);
    const newTop10 = c.call("ZREVRANGE", "ss_top10_scores", 0, 9));
    const top10Updated = top10 === newTop10;
    if (top10Updated) {
      c.call("PUBLISH", "chan:top_10", JSON.stringify(newTop10));
    }
  },
);
```

The idea is the same if the decision is to have our own service, with note that
latest message ID of the stream must be stored in case of multiple updates
between stream reads.
