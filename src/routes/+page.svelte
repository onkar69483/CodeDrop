<script>
    // Here, you can import components, manage states, and handle actions if needed.
    // Example: import Header from './Header.svelte';
  </script>
  
  <style>
    /* Basic styling for layout and elements */
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      background-color: #f9f9f9;
    }
  
    header {
      background-color: #0070f3;
      color: white;
      padding: 1rem;
      text-align: center;
    }
  
    main {
      max-width: 800px;
      margin: 2rem auto;
      padding: 1rem;
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
  
    h1 {
      font-size: 2.5rem;
      margin-bottom: 0.5rem;
      text-align: center;
    }
  
    p {
      font-size: 1rem;
      line-height: 1.5;
    }
  
    ul {
      margin-top: 1rem;
      padding-left: 1.5rem;
    }
  
    a {
      color: #0070f3;
      text-decoration: none;
    }
  
    a:hover {
      text-decoration: underline;
    }
  
    footer {
      text-align: center;
      padding: 1rem;
      margin-top: 2rem;
      font-size: 0.9rem;
      color: #555;
    }
  </style>
  
  <header>
    <h1>Welcome to CodeDrop</h1>
  </header>
  
  <main>
    <section>
      <h2>About CodeDrop</h2>
      <p>
        CodeDrop is a simple and efficient way to share code snippets with others. It allows you to
        paste code, set expiration times, and share links securely and quickly. Perfect for quick
        collaborations and temporary exchanges.
      </p>
    </section>
  
    <section>
      <h2>Documentation</h2>
      <p>
        For more details and documentation, please visit
        <a href="https://github.com/onkar69483/CodeDrop/blob/main/README.md" target="_blank" rel="noopener noreferrer">Documentation</a>.
      </p>
    </section>
  </main>
  
  <footer>
    <p>&copy; 2024 CodeDrop. All rights reserved.</p>
  </footer>
  