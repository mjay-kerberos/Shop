# `db_setup` — Shop Database & Automation

This folder contains the **automated PostgreSQL database setup** for the **Shop** application.  
It uses **Ansible** to install PostgreSQL, create the database and user, set permissions, and initialize all required tables using `init_db.sql`.

> For the full application overview, architecture, and setup instructions, return to the main project README:  
> **[← Back to Shop README](../README.md)**

---

## What This Setup Includes

### Automated PostgreSQL installation

The Ansible playbook:

- Installs system dependencies (`bash`, `openssl`, `libssl-*`, etc.)
- Installs PostgreSQL and contrib packages
- Ensures PostgreSQL is **running** and **enabled**
- Creates the database defined in your variables
- Creates and configures the database user
- Applies required permissions
- Uploads and executes the SQL initialization script

### Database schema initialization

`init_db.sql` creates the core tables used by the Shop platform:

- **products**
- **users**
- **purchases**
- **inventory**
- **team_credits**

These tables are also pre-seeded with initial values so the app is fully usable after provisioning.

---

## File Structure

```text
db_setup/
│
├── ansible.cfg
├── hosts.ini
├── playbook.yaml
└── roles/
    └── setup/
        ├── defaults/
        │   └── main.yml
        ├── vars/
        │   └── main.yml
        ├── files/
        │   └── init_db.sql
        ├── handlers/
        │   └── main.yml
        └── tasks/
            └── main.yml
````

---

## Configuration (What You Should Modify)

Configuration is split into **infrastructure settings** and **game data**.

### 1. Database & PostgreSQL defaults

`roles/setup/defaults/main.yml`:

```yaml
postgresql_version: "14"
postgresql_encoding: "UTF-8"
postgresql_locale: "en_US.UTF-8"

db_user: "shop_admin"
db_password: "secure_password"
db_name: "shop_db"
```

Change these if:

* You want a **different database name**
* You want a **different user/password** for the app
* You’re deploying in a new environment with different requirements

### 2. Teams & products (game data)

`roles/setup/vars/main.yml`:

* Defines the **teams** (blue / red / gray, etc.)
* Defines the **products** (Fire Cannons, Repair Droids, etc.)

Update this file if you want to:

* Add or remove teams
* Change item prices, descriptions, or images
* Add new Star Wars–themed shop items

---

## How to Run the Playbook

### 1. Update `hosts.ini`

Ensure it contains the correct target VM / server:

```ini
[target]
192.168.1.50 ansible_user=ubuntu ansible_python_interpreter=/usr/bin/python3
```

For purely local setup, you can also target `localhost`.

### 2. Run the playbook

```sh
ansible-playbook -i hosts.ini playbook.yaml
```

This will:

1. Install PostgreSQL
2. Create your database + user
3. Upload `init_db.sql`
4. Execute the schema and seed data

---

## Updating the Database Schema

If you need to **change or add tables**, modify:

* `roles/setup/files/init_db.sql` for schema and initial data
* Then rerun the playbook (or apply migrations manually)

If you only change **table data**, you may run:

```sh
psql -U postgres -d shop_db -f roles/setup/files/init_db.sql
```

(or adjust the path if you’re running it directly on the server).

---

## Resetting or Re-initializing the Database

### Option 1 — Drop & recreate using PostgreSQL tools

```sh
sudo -u postgres dropdb shop_db
sudo -u postgres createdb shop_db
sudo -u postgres psql -d shop_db -f /path/to/init_db.sql
```

(Replace `/path/to/init_db.sql` with the actual location on your host, e.g. `/tmp/init_db.sql` if you re-copy it.)

### Option 2 — Re-run the playbook

If your tasks use `state: present` (not “absent then present”), you may need to manually drop the DB first (as above), then run:

```sh
ansible-playbook -i hosts.ini playbook.yaml
```

---

## Notes

* This automation is designed for **Debian-based** environments (Ubuntu, Kali, etc.).
* For RedHat/RHEL systems, additional tasks will be required (e.g., using `dnf`/`yum` instead of `apt`).
* This was an insecure database design being with the intention of students trying to modify values, do NOT use in a real production setup. 
* In a real production setup, security-sensitive variables like `db_password` should be encrypted with **Ansible Vault** and not stored in plaintext.

---

##  Related Documentation

* **Main README (Project Overview, Features, Running the App)**
  [../README.md](../README.md)
* **PostgreSQL Docs**
  [https://www.postgresql.org/docs/](https://www.postgresql.org/docs/)
* **Ansible PostgreSQL Modules**
  [https://docs.ansible.com/ansible/latest/collections/community/postgresql/](https://docs.ansible.com/ansible/latest/collections/community/postgresql/)

