import React, { useState } from 'react';
import validator from 'validator';
import { AiOutlineInfoCircle } from 'react-icons/ai';
import { BiLoaderCircle } from 'react-icons/bi';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {toast} from "react-toastify";

// UPDATE!: CHANGE THE LOADER ICON TO A DIFFERENT ONE

const SignupForm = () => {
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [cPassword, setCPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({}); // Track touched fields
    const [showPasswordInfo, setShowPasswordInfo] = useState(false); // State to control the popup
    const [isLoading, setIsLoading] = useState(false); // State to control loading animation

    const validateField = (fieldName, value) => {
        switch (fieldName) {
            case 'name':
                return value.length >= 2 ? '' : 'Must be at least 2 letters.';
            case 'email':
                return validator.isEmail(value) ? '' : 'Invalid email address.';
            case 'username':
                return value.length >= 3 ? '' : 'Must be at least 3 letters.';
            case 'password':
                return validator.isStrongPassword(value, {
                    minLength: 8,
                    minLowercase: 1,
                    minUppercase: 1,
                    minNumbers: 1,
                    minSymbols: 1,
                }) ? '' : 'Invalid password format.';
            case 'cPassword':
                return value === password ? '' : 'Passwords do not match.';
            default:
                return '';
        }
    };

    const validateForm = () => {
        const newErrors = {};

        newErrors.name = validateField('name', name);
        newErrors.email = validateField('email', email);
        newErrors.username = validateField('username', username);
        newErrors.password = validateField('password', password);
        newErrors.cPassword = validateField('cPassword', cPassword);

        return newErrors;
    };

    const handleInputChange = (fieldName, value) => {
        switch (fieldName) {
            case 'name':
                setName(value);
                break;
            case 'email':
                setEmail(value);
                break;
            case 'username':
                setUsername(value);
                break;
            case 'password':
                setPassword(value);
                break;
            case 'cPassword':
                setCPassword(value);
                break;
            default:
                break;
        }

        const error = validateField(fieldName, value);
        setErrors((prevErrors) => ({ ...prevErrors, [fieldName]: error }));
    };

    const handleBlur = (fieldName) => {
        setTouched({ ...touched, [fieldName]: true });
        setErrors((prevErrors) => ({ ...prevErrors, [fieldName]: validateField(fieldName, getFieldValue(fieldName)) }));
    };

    const getFieldValue = (fieldName) => {
        switch (fieldName) {
            case 'name':
                return name;
            case 'email':
                return email;
            case 'username':
                return username;
            case 'password':
                return password;
            case 'cPassword':
                return cPassword;
            default:
                return '';
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const validationErrors = validateForm();
        setErrors(validationErrors);
        setTouched({
            name: true,
            email: true,
            username: true,
            password: true,
            cPassword: true,
        });

        if (Object.values(validationErrors).every((error) => error === '')) {
            setIsLoading(true);
            try {
                // await new Promise((resolve) => setTimeout(resolve, 500));
                await axios.post('http://localhost:3000/api/auth/register', { name, email, username, password })
                    .then((res) => {
                        toast.success(res.data);
                        navigate('/login');
                    })
                    .catch((err) => {
                        toast.error(err.response.data);
                    })
            } catch (error) {
                console.error('Error during form submission', error.response.data);
            } finally {
                setIsLoading(false);
            }
        }
    };
    return (
        <div className='shadow-2xl pt-8 pl-4 pr-4 pb-2 rounded-xl'>
            <h1 className='text-5xl mb-6'>Hello, There</h1>
            <form onSubmit={handleSubmit} className='flex flex-col'>
                <div className="Form-Field mb-4 relative">
                    <label htmlFor="name">Name</label>
                    <input
                        className='appearance-none border rounded w-full py-2 px-3 text-grey-darker'
                        type="text"
                        name="name"
                        id="name"
                        placeholder='Enter your name'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        onBlur={() => handleBlur('name')}
                    />
                    {touched.name && errors.name && <p className="text-red-500 absolute -top-[3px] right-0 mt-1">{errors.name}</p>}
                </div>
                <div className="Form-Field mb-4 relative">
                    <label htmlFor="email">Email</label>
                    <input
                        className='appearance-none border rounded w-full py-2 px-3 text-grey-darker'
                        type="email"
                        name="email"
                        id="email"
                        placeholder='Enter your email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onBlur={() => handleBlur('email')}
                    />
                    {touched.email && errors.email && <p className="text-red-500 absolute -top-[3px] right-0 mt-1">{errors.email}</p>}
                </div>
                <div className="Form-Field mb-4 relative">
                    <label htmlFor="username">Username</label>
                    <input
                        className='appearance-none border rounded w-full py-2 px-3 text-grey-darker'
                        type="text"
                        name="username"
                        id="username"
                        placeholder='Enter your username'
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        onBlur={() => handleBlur('username')}
                    />
                    {touched.username && errors.username && <p className="text-red-500 absolute -top-[3px] right-0 mt-1">{errors.username}</p>}
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
                        onChange={(e) => setPassword(e.target.value)}
                        onBlur={() => handleBlur('password')}
                    />
                    <div className="flex items-center mt-1 absolute top-0 -right-[23px]">
                        <AiOutlineInfoCircle
                            className="ml-2 text-blue-500 cursor-pointer absolute top-0 right-6"
                            onClick={() => setShowPasswordInfo(!showPasswordInfo)}
                            onMouseEnter={() => setShowPasswordInfo(true)}
                            onMouseLeave={() => setShowPasswordInfo(false)}
                        />
                        {touched.password && errors.password && <p className="text-red-500 relative right-10 -top-[6px]">{errors.password}</p>}
                    </div>
                    {showPasswordInfo && (
                        <div className="absolute bg-white border border-gray-300 rounded shadow-lg p-2 -mt-[6vh] z-10 right-0 w-64">
                            <p>Password must be at least 8 characters long and include:</p>
                            <ul className="list-disc ml-4">
                                <li>At least one uppercase letter</li>
                                <li>At least one lowercase letter</li>
                                <li>At least one number</li>
                                <li>At least one special character</li>
                            </ul>
                        </div>
                    )}
                </div>
                <div className="Form-Field mb-4 relative">
                    <label htmlFor="cPassword">Confirm Password</label>
                    <input
                        className='appearance-none border rounded w-full py-2 px-3 text-grey-darker'
                        type="password"
                        name="cPassword"
                        id="cPassword"
                        placeholder='Re-enter your password'
                        value={cPassword}
                        onChange={(e) => setCPassword(e.target.value)}
                        onBlur={() => handleBlur('cPassword')}
                    />
                    {touched.cPassword && errors.cPassword && <p className="text-red-500 absolute -top-[3px] right-0 mt-1">{errors.cPassword}</p>}
                </div>
                <div className="Form-Field flex justify-center">
                    <button type="submit" className='mb-4 p-4 bg-red-500 rounded-xl h-[50px] text-white flex items-center justify-center'>
                        {isLoading ? <BiLoaderCircle className="animate-spin" /> : 'Register'}
                    </button>
                </div>
            </form>
            <div className="text-center">
                <p>Already have an account? <Link to="/login" className="text-blue-500">Login</Link></p>
            </div>
        </div>
    );
};

export default SignupForm;

