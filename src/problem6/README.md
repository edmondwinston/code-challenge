## Analysis on Software Requirements

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
