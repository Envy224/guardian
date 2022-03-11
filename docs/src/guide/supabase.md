# Supabase setup

## Setting up your project

To use Guardian, you must set up a Supabase database. To start visit [supabase.com](https://supabase.com) and click on "Start your project" in the top right corner.

![Supabase landing page](/supabase-landing.png)

Supabase will then ask bring you to another page, where you must click on Sign in with Github in the middle or top right corner of the screen.

![Supabase app landing page](/supabase-app-landing.png)

Once you sign in or sign up with your Github account and then you will be redirected back to the Supabase dashboard.

## Creating the project and adding the tables

Create a new project in the top left corner and name it whatever you want. Select the 'Free' tier.

Once you have created the project, visit the 'SQL Query' tab.

![Supabase sidebar](/sidebar.png)

Then, create a new query.

![Supabase create new query button](/new-query-button.png)

Copy in the following SQL code to create the required tables:

```sql
create table bannedUsers(
  userId bigint not null primary key,
  reason text not null,
  timestamp timestamptz default now(),
  username text not null,
  messageId text
)

create table bannedGroups(
  id bigint not null primary key,
  reason text not null,
  timestamp timestamptz default now(),
  messageId text
)

create table moderators(
  id text not null primary key
  owner bool default false
)
```

Click on 'Run' in the bottom right corner, and it should give the following response.

```
Success. No rows returned.
```

## Enabling realtime

For realtime blacklist notifiactions, you need to enable realtime on the Supabase database.

To start, visit the 'Database' tab on the sidebar.

![Supabase sidebar](/sidebar2.png)

Once there, select 'Replication' from the choices provided.

![Replication tab](/replication.png)
