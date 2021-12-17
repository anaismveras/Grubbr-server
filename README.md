# Grubbr

## Team name
Da Grubbrs Band

## Each team member's assigned role
- Cory Sorel - Turtle - Creating API and Linking Restaurants, Backend, React
- Lindsay  Haigh- Llama- Back End, Routes, React, Routes
- Eduardo Ferreira - Liger - Front End, React
- Anais Veras - Zoo Keeper - Front End, Wireframe, READme, R

## Elevator Pitch
When “Restaurant goers” can’t decide what they want to eat, Grubbr can help them swipe through restaurants nearby or in searched cities with your friends. The user will be able to add friends that have common restaurants and start chatting or set up a date!

## User Stories
The User: Anyone who likes to go to restaurants, especially people who like to try new restaurants and also needs a date, either a friend or a romantic one.
Well, have you ever been with a partner/friend and you get into an argument because you both cant figure out what to eat? Grubbr can help people make friends based on the same types of restaurants they like.

## Grubbr Models (ERD)

![Screen Shot 2021-12-17 at 12 18 15 PM](https://user-images.githubusercontent.com/78924263/146583008-856e0a5e-3053-471d-a2ef-ef47324a08ec.png)

## Grubbr Routes

![Grubber Routes](https://s12.aconvert.com/convert/p3r68-cdx67/tichk-7ucsp.png)

## Resources
- Grubbr's Client GitHub Repo
https://github.com/ornery-mouse/Grubbr-client

## Deployed Site
https://grubbr.herokuapp.com/

# Authentication

### Authentication Routes

![Screen Shot 2021-12-17 at 11 18 57 AM](https://user-images.githubusercontent.com/78924263/146575483-84df2cc5-37ed-428e-84bc-8617d86156b9.png)

#### POST /sign-up

Request:

```sh
curl --include --request POST http://localhost:8000/sign-up \
  --header "Content-Type: application/json" \
  --data '{
    "credentials": {
      "email": "an@example.email",
      "password": "an example password",
      "password_confirmation": "an example password"
    }
  }'
```

```sh
curl-scripts/sign-up.sh
```

Response:

```md
HTTP/1.1 201 Created
Content-Type: application/json; charset=utf-8

{
  "user": {
    "id": 1,
    "email": "an@example.email"
  }
}
```

#### POST /sign-in

Request:

```sh
curl --include --request POST http://localhost:8000/sign-in \
  --header "Content-Type: application/json" \
  --data '{
    "credentials": {
      "email": "an@example.email",
      "password": "an example password"
    }
  }'
```

```sh
curl-scripts/sign-in.sh
```

Response:

```md
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

{
  "user": {
    "id": 1,
    "email": "an@example.email",
    "token": "33ad6372f795694b333ec5f329ebeaaa"
  }
}
```

#### PATCH /change-password/

Request:

```sh
curl --include --request PATCH http://localhost:8000/change-password/ \
  --header "Authorization: Bearer $TOKEN" \
  --header "Content-Type: application/json" \
  --data '{
    "passwords": {
      "old": "an example password",
      "new": "super sekrit"
    }
  }'
```

```sh
TOKEN=33ad6372f795694b333ec5f329ebeaaa curl-scripts/change-password.sh
```

Response:

```md
HTTP/1.1 204 No Content
```

#### DELETE /sign-out/

Request:

```sh
curl --include --request DELETE http://localhost:8000/sign-out/ \
  --header "Authorization: Bearer $TOKEN"
```

```sh
TOKEN=33ad6372f795694b333ec5f329ebeaaa curl-scripts/sign-out.sh
```

Response:

```md
HTTP/1.1 204 No Content
```
