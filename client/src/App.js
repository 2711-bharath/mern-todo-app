import { useEffect, useState } from 'react';
import Preloader from './components/Preloader';
import { createTodo, readTodos, updateTodo, deleteTodo } from './functions';

function App() {

  const [todo, setTodo] = useState({title: '', content: ''})
  const [todos, setTodos] = useState(null)
  const [currentId, setCurrentId] = useState(0)
  
  useEffect(() => {
    let currentTodo = currentId!==0?todos.find(todo => todo._id === currentId):{title: '', content: ''}
    setTodo(currentTodo)
  }, [currentId])


  useEffect(() => {
    const fetchData = async() => {
      const result = await readTodos();
      setTodos(result)
    }
    fetchData();
  }, [currentId])

  const clear = () => {
    setCurrentId(0)
    setTodo({title: '', content: ''})
  }

  useEffect(() => {
    const clearInpFeild = (e) => {
      if(e.keyCode === 27) {
        clear()
      }
    }
    window.addEventListener('keydown', clearInpFeild)
    return () => window.removeEventListener('keydown', clearInpFeild)
  }, [])

  const onSubmitHandler = async(e) => {
    e.preventDefault();
    if(todo.title === '' || todo.content == '') {
      alert("Enter input in given feilds")
    } else {
      if(currentId === 0) {
        const res = await createTodo(todo);
        setTodos([...todos, res]);
        clear();
      } else {
        await updateTodo(currentId, todo)
        clear();
      }
    }
  }

  const removeTodo = async(id) => {
    let todosCopy = [...todos];
    setTodos(todosCopy.filter(todo => todo._id !== id))
    await deleteTodo(id);
    
  }

  return (
    <div>
      <nav>
        <div class="nav-wrapper">
          <a href="#" class="brand-logo center">Todo App</a>
        </div>
      </nav>

      <div className="container mt-3">
          <div className="row">
            <form className="col s12" onSubmit={onSubmitHandler}>
              <div className="row">
                <div className="input-field col s6">
                  <i className="material-icons prefix">title</i>
                  <input id="title" type="text" className="validate" value={todo.title} onChange={e => setTodo({...todo, title: e.target.value})} />
                  <label htmlFor="title">Title</label>
                </div>
                <div className="input-field col s6">
                  <i className="material-icons prefix">description</i>
                  <input id="description" type="text" className="validate" value={todo.content} onChange={e => setTodo({...todo, content: e.target.value})} />
                  <label htmlFor="description">Content</label>
                </div>
              </div>
              <div className="align-content right">
                  <button type="submit" className="waves-effect waves-light btn">{currentId !== 0 ? 'Update': 'Add'} Todo</button>
              </div>
            </form>
            {
              !todos? <Preloader />: todos.length > 0 ? <ul className='collection mt-3'>
                {todos.map((todo) => (
                      <li key={todo._id} className="collection-item px-4  py-2" onClick={() => setCurrentId(todo._id)}>
                        <h5 className="fw-normal mb-2">{todo.title}</h5>
                        <p>{todo.content}
                          <a href='#!' className="secondary-content" onClick={() => removeTodo(todo._id)}><i className="material-icons">delete</i></a>
                        </p>
                      </li>
                ))}
              </ul> : <div>No data in todo list</div>
            }
          </div>
      </div>
    </div>
  );
}

export default App;
