-- Create the 'products' table
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  image VARCHAR(255),
  description TEXT
);

-- Insert example products
INSERT INTO products (name, price, image, description) VALUES
('Fire Cannons!', 600, 'cannon.jpg', 'The opposing blue team boxes will be inhibited for 10 minutes depending on their operating system: Windows will lose GUI access; Linux will have a non-interactive shell.'),
('Repair Droids', 400, 'droid.jpg', 'Red team must fix a service of your choosing and tell you what they did.'),
('Mind Probe', 150, 'mind.jpg', 'Get a hint on how to fix your service.'),
('Force Barrier', 100, 'force.jpg', 'Grants the ability to use firewall rules for 8 minutes. Only usable once per competition day.'),
('A Darth Wager', 50, 'darth.jpg', 'Play best of one rock paper scissors with a member of the gray team. If you win, you get 100 points. If you lose, you get nothing.');

-- Create the 'users' table
CREATE TABLE IF NOT EXISTS users (
  username VARCHAR(255) PRIMARY KEY,
  password VARCHAR(255) NOT NULL
);

-- Insert example users
INSERT INTO users (username, password) VALUES
('blue_team_1', 'blueT3am123'),
('blue_team_2', 'blueT3am246'),
('red_team', 'red_t3am123'),
('gray_team', 'Gray123!');

-- Create the 'purchases' table
CREATE TABLE IF NOT EXISTS purchases (
  purchase_id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) REFERENCES users(username),
  product_id INTEGER REFERENCES products(id),
  quantity INTEGER NOT NULL,
  purchase_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create the 'inventory' table
CREATE TABLE IF NOT EXISTS inventory (
  product_id INTEGER PRIMARY KEY REFERENCES products(id),
  quantity INTEGER NOT NULL CHECK (quantity <= 10)
);

-- Optionally, you can initialize the inventory with some data
INSERT INTO inventory (product_id, quantity) VALUES
(1, 10), -- Assuming product_id 1 is 'Fire Cannons!'
(2, 10), -- Assuming product_id 2 is 'Repair Droids'
(3, 6), -- etc.
(4, 10),
(5, 10);

CREATE TABLE IF NOT EXISTS team_credits (
  username VARCHAR(255) PRIMARY KEY REFERENCES users(username),
  starting_credit NUMERIC(10,2) NOT NULL,
  current_credit NUMERIC(10,2) NOT NULL
);

INSERT INTO team_credits (username, starting_credit, current_credit) VALUES
('blue_team_1', 1000, 1000),
('blue_team_2', 1000, 1000),
('red_team', 1000, 1000),
('gray_team', 1000, 1000);
