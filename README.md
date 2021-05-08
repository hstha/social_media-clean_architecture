# Social Media Project Using Clean Architecture Pattern
> This project is simple version of Social Media website like Facebook, Instagram
- The code written for this project are dotnet for backend and Typescript React for frontend
- The code is written in dotnet V5.0.2
- The project use SQLite database
- If you are using VSCode like I do, following extensions are needed:
	- [x] C# (Needed)
	- [x] NuGet Gallery (Needed)
	- [ ] SQLite (Recommended)
	- [ ] C# Extension (Recommended)

## Software you need
	1. Download [dotnet](https://dotnet.microsoft.com/download)
	2. Download [node](https://nodejs.org/en/download/)
	3. Download [vscode](https://code.visualstudio.com/download) or any editor of your choice

## Build
	1. clone git
	2. run server
		- go to api folder and run
			**dotnet watch run**
	3 run frontend
		- go to client folder and run
			**npm i**
			**npm start**

## Introduction To The Project
- This project follows clean architecture.
- Clean Architecture is also refered as onion architecture
- It was introduced by Uncle Bob.
- In this architecture a single project is divided into multiple circular layers on top of one another where each layer is assigned a specific task like handling api, handling business logic, storing data, presenting data to user, etc.
- Level of dependency increases form top to buttom layer i.e. each layer is dependent to its layer below.
- The project is divided into:
  a) Domain: place where we defined structure of data that we store in database
  b) Application: holds business logic. Data is processed before storing or reading from database. In our case: adding, editing, deleting, reading data.
  c) API: holds logic that determines how application interact with UI. In our case receiving and sending HTTP(s) request.
  d) Persistence: contains logic to communicate with database i.e connection to DB, tanslate code into SQL queries.
  e) React(Client): holds logic to show data to user.
- Checklist recommended for clean code architecture:
	 - [ ] Independent from frameworks
	 - [ ] Testable independently
	 - [ ] Independent from the interface
	 - [ ] Independent from the database

## CURD Operation
- For CURD operation we are using CQRS and Mediator Pattern.
- CQRS stands for Command Query Responsibilites Segeration also sometimes called Command Query Seperation.
- **Command**: is something that modifies data and shouldn't return value. In our case creating, editing and deleting activity
- **Query**: is something that ansuers a question, doesn't modify state and should return value. In our case returning all activities or specific activity.
