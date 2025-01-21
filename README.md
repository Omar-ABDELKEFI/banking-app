### Step 1: Set Up the Spring Boot Backend

1. **Create a New Spring Boot Project**:
   You can use Spring Initializr (https://start.spring.io/) to generate a new Spring Boot project with the following dependencies:
   - Spring Web
   - Spring Data JPA
   - MySQL Driver
   - Spring Boot DevTools
   - Spring Boot Starter Actuator

2. **Update `pom.xml`**:
   Ensure your `pom.xml` includes the necessary dependencies. You can use the provided `pom.xml` context from your question.

3. **Create the Entity Classes**:
   Create two entity classes: `Client` and `Account`.

   ```java
   // Client.java
   package tn.iit.model;

   import jakarta.persistence.*;
   import lombok.Data;

   @Entity
   @Data
   public class Client {
       @Id
       @GeneratedValue(strategy = GenerationType.IDENTITY)
       private Long id;
       private String name;
       private String surname;
   }
   ```

   ```java
   // Account.java
   package tn.iit.model;

   import jakarta.persistence.*;
   import lombok.Data;

   @Entity
   @Data
   public class Account {
       @Id
       @GeneratedValue(strategy = GenerationType.IDENTITY)
       private Long id;
       private String rib;
       private double balance;

       @ManyToOne
       @JoinColumn(name = "client_id")
       private Client client;
   }
   ```

4. **Create Repositories**:
   Create repositories for both entities.

   ```java
   // ClientRepository.java
   package tn.iit.repository;

   import org.springframework.data.jpa.repository.JpaRepository;
   import tn.iit.model.Client;

   public interface ClientRepository extends JpaRepository<Client, Long> {
   }
   ```

   ```java
   // AccountRepository.java
   package tn.iit.repository;

   import org.springframework.data.jpa.repository.JpaRepository;
   import tn.iit.model.Account;

   public interface AccountRepository extends JpaRepository<Account, Long> {
   }
   ```

5. **Create Controllers**:
   Create REST controllers for handling CRUD operations.

   ```java
   // ClientController.java
   package tn.iit.controller;

   import org.springframework.beans.factory.annotation.Autowired;
   import org.springframework.http.ResponseEntity;
   import org.springframework.web.bind.annotation.*;
   import tn.iit.model.Client;
   import tn.iit.repository.ClientRepository;

   import java.util.List;

   @RestController
   @RequestMapping("/api/clients")
   public class ClientController {
       @Autowired
       private ClientRepository clientRepository;

       @GetMapping
       public List<Client> getAllClients() {
           return clientRepository.findAll();
       }

       @PostMapping
       public Client createClient(@RequestBody Client client) {
           return clientRepository.save(client);
       }

       @DeleteMapping("/{id}")
       public ResponseEntity<Void> deleteClient(@PathVariable Long id) {
           clientRepository.deleteById(id);
           return ResponseEntity.noContent().build();
       }
   }
   ```

   ```java
   // AccountController.java
   package tn.iit.controller;

   import org.springframework.beans.factory.annotation.Autowired;
   import org.springframework.http.ResponseEntity;
   import org.springframework.web.bind.annotation.*;
   import tn.iit.model.Account;
   import tn.iit.repository.AccountRepository;

   import java.util.List;

   @RestController
   @RequestMapping("/api/accounts")
   public class AccountController {
       @Autowired
       private AccountRepository accountRepository;

       @GetMapping
       public List<Account> getAllAccounts() {
           return accountRepository.findAll();
       }

       @PostMapping
       public Account createAccount(@RequestBody Account account) {
           return accountRepository.save(account);
       }

       @DeleteMapping("/{id}")
       public ResponseEntity<Void> deleteAccount(@PathVariable Long id) {
           accountRepository.deleteById(id);
           return ResponseEntity.noContent().build();
       }
   }
   ```

6. **Configure MySQL Database**:
   In `src/main/resources/application.properties`, configure your MySQL database connection.

   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/your_database_name
   spring.datasource.username=your_username
   spring.datasource.password=your_password
   spring.jpa.hibernate.ddl-auto=update
   ```

### Step 2: Set Up the React TypeScript Frontend

1. **Create a New React App**:
   Use Create React App to set up a new React project with TypeScript.

   ```bash
   npx create-react-app client-app --template typescript
   cd client-app
   ```

2. **Install Required Packages**:
   Install Bootstrap, Axios, SweetAlert, and React Autocomplete.

   ```bash
   npm install bootstrap axios sweetalert2 react-autocomplete
   ```

3. **Set Up Bootstrap**:
   Import Bootstrap CSS in `src/index.tsx`.

   ```typescript
   import 'bootstrap/dist/css/bootstrap.min.css';
   ```

4. **Create Components**:
   Create components for managing clients and accounts.

   - **ClientList.tsx**: Display a list of clients with delete functionality.
   - **AccountForm.tsx**: Form for creating accounts with autocomplete for client selection.

   ```typescript
   // ClientList.tsx
   import React, { useEffect, useState } from 'react';
   import axios from 'axios';
   import Swal from 'sweetalert2';

   const ClientList: React.FC = () => {
       const [clients, setClients] = useState([]);

       useEffect(() => {
           fetchClients();
       }, []);

       const fetchClients = async () => {
           const response = await axios.get('/api/clients');
           setClients(response.data);
       };

       const deleteClient = async (id: number) => {
           const result = await Swal.fire({
               title: 'Are you sure?',
               text: 'You won\'t be able to revert this!',
               icon: 'warning',
               showCancelButton: true,
               confirmButtonText: 'Yes, delete it!',
           });

           if (result.isConfirmed) {
               await axios.delete(`/api/clients/${id}`);
               fetchClients();
               Swal.fire('Deleted!', 'Your file has been deleted.', 'success');
           }
       };

       return (
           <div>
               <h2>Clients</h2>
               <ul className="list-group">
                   {clients.map(client => (
                       <li key={client.id} className="list-group-item d-flex justify-content-between align-items-center">
                           {client.name} {client.surname}
                           <button className="btn btn-danger" onClick={() => deleteClient(client.id)}>Delete</button>
                       </li>
                   ))}
               </ul>
           </div>
       );
   };

   export default ClientList;
   ```

   ```typescript
   // AccountForm.tsx
   import React, { useEffect, useState } from 'react';
   import axios from 'axios';
   import Autocomplete from 'react-autocomplete';

   const AccountForm: React.FC = () => {
       const [clients, setClients] = useState([]);
       const [selectedClient, setSelectedClient] = useState('');
       const [rib, setRib] = useState('');
       const [balance, setBalance] = useState(0);

       useEffect(() => {
           fetchClients();
       }, []);

       const fetchClients = async () => {
           const response = await axios.get('/api/clients');
           setClients(response.data);
       };

       const handleSubmit = async (e: React.FormEvent) => {
           e.preventDefault();
           const client = clients.find(c => `${c.name} ${c.surname}` === selectedClient);
           await axios.post('/api/accounts', { rib, balance, client });
           setRib('');
           setBalance(0);
           setSelectedClient('');
       };

       return (
           <form onSubmit={handleSubmit}>
               <div className="mb-3">
                   <label className="form-label">RIB</label>
                   <input type="text" className="form-control" value={rib} onChange={e => setRib(e.target.value)} required />
               </div>
               <div className="mb-3">
                   <label className="form-label">Balance</label>
                   <input type="number" className="form-control" value={balance} onChange={e => setBalance(Number(e.target.value))} required />
               </div>
               <div className="mb-3">
                   <label className="form-label">Client</label>
                   <Autocomplete
                       items={clients}
                       getItemValue={(item) => `${item.name} ${item.surname}`}
                       renderItem={(item, isHighlighted) =>
                           <div key={item.id} style={{ background: isHighlighted ? '#eee' : 'transparent' }}>
                               {item.name} {item.surname}
                           </div>
                       }
                       value={selectedClient}
                       onChange={(e) => setSelectedClient(e.target.value)}
                       onSelect={(val) => setSelectedClient(val)}
                   />
               </div>
               <button type="submit" className="btn btn-primary">Create Account</button>
           </form>
       );
   };

   export default AccountForm;
   ```

5. **Set Up Routing**:
   Use React Router to navigate between components.

   ```bash
   npm install react-router-dom
   ```

   In `src/App.tsx`:

   ```typescript
   import React from 'react';
   import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
   import ClientList from './ClientList';
   import AccountForm from './AccountForm';

   const App: React.FC = () => {
       return (
           <Router>
               <div className="container">
                   <h1>Client and Account Management</h1>
                   <Switch>
                       <Route path="/clients" component={ClientList} />
                       <Route path="/accounts" component={AccountForm} />
                   </Switch>
               </div>
           </Router>
       );
   };

   export default App;
   ```

### Step 3: Run the Application

1. **Run the Spring Boot Application**:
   Navigate to your Spring Boot project directory and run:

   ```bash
   ./mvnw spring-boot:run
   ```

2. **Run the React Application**:
   Navigate to your React project directory and run:

   ```bash
   npm start
   ```

### Conclusion

You now have a basic CRUD application for managing clients and accounts using Spring Boot for the backend and React with TypeScript for the frontend. You can enhance the application further by adding features like validation, error handling, and more sophisticated UI components.