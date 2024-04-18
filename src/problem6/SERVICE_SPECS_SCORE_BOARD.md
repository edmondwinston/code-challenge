# Specifications for Score Board service

## Overview

Core requirements of this service include (1) client can update their score (2)
client can perform querying with limit, skip, and sort functionalities. The
client keeps track of the top 10 by subscribing to a Redis Pub/Sub channel
directly, which this service will publish to only when the top 10 changes.

## Functional Requirements

### API specs

```yaml
openapi: 3.1.0
info:
  title: Live Score Board service API
  version: 0.0.1
tags:
  - name: scores
    description: Query scores and perform updates
paths:
  /scores:
    get:
      tags:
        - scores
      summary: Get scores with optional filtering
      description: Retrieve scores with optional parameters for pagination and sorting.
      parameters:
        - name: limit
          in: query
          description: Number of results to return per page
          schema:
            type: integer
            minimum: 1
            maximum: 50
          example: 20
        - name: skip
          in: query
          description: Number of results to skip (for pagination)
          schema:
            type: integer
            minimum: 0
          example: 10
        - name: sorted
          in: query
          description: Field to sort by (+field for ascending, -field for descending)
          schema:
            type: string
          example: +score
      responses:
        '200':
          description: Successful response
          content:
            application/json:
              schema:
                type: array
                items:
                  type: object
                  properties:
                    user:
                      type: string
                      example: Jocelyn June
                    score:
                      type: integer
                      example: 88
        '400':
          description: Bad request - Invalid parameters
        '500':
          description: Internal server error
```
