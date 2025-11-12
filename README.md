# TicTacToe
Asynchronously distributed gaming web application

Authors: Radu Manea,...

This app was designed as homework for Danubius University Informatics Dep. students and it naturally evolved in what is now a beautiful & promissing project. 
The front-end was meant to run based on a Prolog REST servlet (rest_server) on 8080 port.

Key Benefits of Refactored React Components

| Component       | Area               | Original Version                                                                 | Refactored Version                                                              | Benefit Summary                                                                 |
|----------------|--------------------|----------------------------------------------------------------------------------|----------------------------------------------------------------------------------|----------------------------------------------------------------------------------|
| **App**        | Architecture       | Mixed logic, direct state mutation, unclear separation of concerns              | Modular structure, pure functions, clear separation of UI and logic             | Improved maintainability and scalability                                         |
|                | AI Integration     | No AI logic                                                                      | Integrated server-based AI move via `FetchData`                                 | Enables intelligent gameplay with automated opponent                            |
|                | State Management   | `checkWin` mutates state directly                                                | State updates handled explicitly and predictably                                | Aligns with React best practices                                                 |
|                | Turn Handling      | Hardcoded turn to `'o'`                                                          | Logical alternation between `'o'` and `'x'`                                      | Fixes gameplay flow                                                              |
|                | Code Clarity       | Redundant destructuring and unused variables                                     | Streamlined logic and cleaner state updates                                     | Easier to read and debug                                                         |
|                | UX Enhancements    | Manual refresh button                                                            | Automatic AI response after user move                                           | Smoother user experience                                                         |
| **FetchData**  | State Ownership    | Mutates `board` prop directly                                                    | Uses internal `useState` for `board`                                            | Prevents side effects and improves reactivity                                   |
|                | Board Setup        | Manual `push` logic with `map`                                                   | Declarative `flat().map()` transformation                                       | Cleaner and more readable                                                        |
|                | Move Detection     | Always triggers server call                                                      | Detects new user move before calling server                                     | Reduces unnecessary network requests                                             |
|                | Error Handling     | Complex regex-based recovery                                                     | Simple and clear error logging                                                  | More robust and maintainable                                                     |
|                | Code Style         | Imperative and verbose                                                           | Declarative and concise                                                         | Easier to maintain and extend                                                    |
| **Row**        | Logic Placement    | Pure component with props                                                        | Adds unused global `handleClick` function                                       | Original version is cleaner and safer                                            |
|                | Code Safety        | No side effects                                                                  | References undefined `board` and `setBoard`                                     | Refactored version introduces potential bugs                                     |
|                | Clarity            | Focused and declarative                                                          | Slightly confusing due to unused logic                                          | Original version is preferred                                                    |

