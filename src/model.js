window.todos = (function () {
    var todo = [];
    var state = "ALL";
    return {
        removetodo: function(r_todo){
          $.ajax({
                type: "DELETE",
                data: JSON.stringify(r_todo),
                url: "http://localhost:3000/todos/" + r_todo.id,
                contentType: 'application/json',
                success: function (data) {
                    todo = data.data;
                    window.todos.getTodos(); 
                }
            })
        },

        applyFilter: function (filterName) {
            state = filterName;
        },
        getFilter: function() {
            return state;
        },
        getFilteredTodos: function () {
            if (state === "ALL") return window.todos.getAllTodos();

            if (state === "ACTIVE") return window.todos.getAllActive();

            if (state === "COMPLETED") return window.todos.getAllCompleted();
        },
        getSessiondata: function() {
            $.ajax({
                url: "http://localhost:3000/todos",
                success: function (data) {
                   // alert(data.msg);
                    todo = data.data;
                    const event = new Event('todoListUpdated');
                    event.todos = todo;
                    window.dispatchEvent(event);
                }
            });
        },
        add: function(name) {
            const singleTodo = {
                name: name,
                id: (Math.random()).toFixed(3),
                isCompleted: false,
                
            };
             
            $.ajax({
                type: "POST",
                data: JSON.stringify(singleTodo),
                contentType: 'application/json',
                url: "http://localhost:3000/todos",
                success: function (data) {
                    window.todos.getTodos();
                }
            });
        },
        getAllTodos: function() {
                    const event = new Event('todoListUpdated');
                    event.todos = todo;
                    window.dispatchEvent(event);
            },

        getTodos: function() {
            $.ajax({
               url: "http://localhost:3000/todos",
               success: function (data) {
                   todo = data.data;
                   window.todos.getFilteredTodos();
               }
           });

       },

        getAllActive: function() {
            var filteredTodo = todo.filter(function(todoObj) {
                return !todoObj.isCompleted;
            });

            const event = new Event('todoListUpdated');
            event.todos = filteredTodo;
            window.dispatchEvent(event);
        },
        getAllCompleted: function() {
            var filteredTodo = todo.filter(function(todoObj) {
                return todoObj.isCompleted;
            });

            const event = new Event('todoListUpdated');
            event.todos = filteredTodo;
            window.dispatchEvent(event);
        },
        clearCompletedTodos: function () {
            $.ajax({
                type: "DELETE",
                url: "http://localhost:3000/todos/clearCompleted",
                success: function () {
                    window.todos.getTodos();
                }
            })
        },

        toggleTodoState: function (todo) {
            $.ajax({
                type: "PUT",
                data: JSON.stringify(todo),
                contentType: 'application/json',
                url: "http://localhost:3000/todos",
                success: function () {
                    window.todos.getTodos();
                }
            })
        }
    };
})();