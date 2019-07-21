window.todos = (function () {
    var todo = [];
    var state = "ALL";
    return {
        removetodo: function(id){
          $.ajax({
                type: "DELETE",
                data: JSON.stringify({id}),
                url: window.constants.URL+"/"+ id,
                contentType: 'application/json',
                success: function (data) {
                    todo = data.data[0];
                    
                    window.todos.getFilteredTodos(); 
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
                url: window.constants.URL,
                success: function (data) {
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
                url: window.constants.URL,
                success: function (data) {
                    todo = data.data[0];
                    window.todos.getFilteredTodos();
                }
            });
        },
        getAllTodos: function() {
                    const event = new Event('todoListUpdated');
                    event.todos = todo;
                    window.dispatchEvent(event);
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
                url: window.constants.URL+"/clearCompleted",
                success: function (data) {
                 todo = data.data[0];
                 window.todos.getFilteredTodos();
                }
            })
        },

        toggleTodoState: function (id) {
            $.ajax({
                type: "PUT",
                data: JSON.stringify({id}),
                contentType: 'application/json',
                url: window.constants.URL,
                success: function (data) {
                    todo = data.data[0];
                    window.todos.getFilteredTodos();
                }
            })
        }
    };
})();