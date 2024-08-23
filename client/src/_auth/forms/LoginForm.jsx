import React, { useState } from 'react';
import { BiLoaderCircle } from 'react-icons/bi';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { loginStart, loginSuccess, loginFail } from '../../redux/user/slices/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from "react-toastify";


// UPDATE!: Position the correct error messsages correctly

const LoginForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const { loading } = useSelector((state) => state.user);
    const dispatch = useDispatch();

    const navigate = useNavigate();


    const validateField = (fieldName, value) => {
        switch (fieldName) {
            case 'username':
                if (!value) {
                    return 'Username is required.';
                }
                return value.length >= 3 ? '' : 'Username must be at least 3 characters long.';
            case 'password':
                return value.length >= 8 ? '' : 'Password must be at least 8 characters long.';
            default:
                return '';
        }
    };

    const handleInputChange = (fieldName, value) => {
        switch (fieldName) {
            case 'username':
                setUsername(value);
                break;
            case 'password':
                setPassword(value);
                break;
            default:
                break;
        }

        const error = validateField(fieldName, value);
        setErrors((prevErrors) => ({ ...prevErrors, [fieldName]: error }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const validationErrors = validateForm();
        if (Object.values(validationErrors).every((error) => error === '')) {
            dispatch(loginStart());
            try {
                await new Promise((resolve) => setTimeout(resolve, 500));
                await axios.post('http://localhost:3000/api/auth/login', { username, password }, { withCredentials: true })
                    .then((res) => {
                        toast.success("Login successful!")
                        dispatch(loginSuccess(res.data));
                        setTimeout(() => {
                            // Code to execute after the timeout
                        }, 1000);
                        navigate("/home");
                    })
                    .catch((err) => {
                        console.log(err.response.data.message);
                        dispatch(loginFail(err.response.data.message));
                        toast.error(err.response.data.message)
                    });
            } catch (error) {
                console.error('Error during form submission', error.response.data.message);
                dispatch(loginFail('Error during form submission'));
            }
        } 
    };

    const validateForm = () => {
        const newErrors = {};
        newErrors.username = validateField('username', username);
        newErrors.password = validateField('password', password);
        return newErrors;
    };

    return (
        <div className='shadow-2xl pt-8 pl-4 pr-4 pb-2 rounded-xl'>
            <h1 className='text-5xl mb-6'>Welcome Back</h1>
            <form onSubmit={handleSubmit} className='flex flex-col'>
                <div className="Form-Field mb-4 relative">
                    <label htmlFor="username">Username</label>
                    <input
                        className='appearance-none border rounded w-full py-2 px-3 text-grey-darker'
                        type="text"
                        name="username"
                        id="username"
                        placeholder='Enter your username'
                        value={username}
                        onChange={(e) => handleInputChange('username', e.target.value)}
                        onBlur={() => setErrors((prevErrors) => ({ ...prevErrors, username: validateField('username', username) }))}
                    />
                    {errors.username && <p className="text-red-500 absolute -top-[3px] right-0 mt-1">{errors.username}</p>}
                </div>
                <div className="Form-Field mb-4 relative">
                    <label htmlFor="password">Password</label>
                    <input
                        className='appearance-none border rounded w-full py-2 px-3 text-grey-darker'
                        type="password"
                        name="password"
                        id="password"
                        placeholder='Enter your password'
                        value={password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        onBlur={() => setErrors((prevErrors) => ({ ...prevErrors, password: validateField('password', password) }))}
                    />
                    <div className="flex items-center mt-1 absolute top-0 -right-[23px]">
                        {errors.password && <p className="text-red-500 relative right-6 -top-[3px]">{errors.password}</p>}
                    </div>
                </div>
                <div className="Form-Field flex justify-center">
                    <button disabled={loading} type="submit" className='mb-4 p-4 bg-red-500 rounded-xl h-[50px] text-white flex items-center justify-center'>
                        {loading ? <BiLoaderCircle className="animate-spin" /> : 'Login'}
                    </button>
                </div>
            </form>
            <div className="text-center">
                <p>Don't have an account? <Link to="/signup" className="text-blue-500">Signup</Link></p>
            </div>

        </div>
    );
};

export default LoginForm;
