import React, { useState } from 'react';

function SignupForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  const handleSignup = async () => {
    try {
      const response = await fetch('http://localhost:8000/signup/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, email }),
      });

      const data = await response.json();
      if (response.ok) {
        // Signup successful, obtain JWT token and store it in localStorage
        localStorage.setItem('token', data.token);
        // Redirect or update UI based on successful signup
        console.log('Signup successful!');
        console.log('token: ' + data.token);
        console.log('admin: ' + data.admin);
      } else {
        // Handle signup error
        console.error('Signup failed:', data.error);
      }
    } catch (error) {
      // Handle network errors or other exceptions
      console.error('Error during signup:', error);
    }
  };

  return (
    <div>
      <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleSignup}>Signup</button>
    </div>
  );
}

export default SignupForm;
