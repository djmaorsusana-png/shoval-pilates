-- Enable RLS
alter default privileges in schema public grant all on tables to postgres, anon, authenticated, service_role;

-- Clients
create table clients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text,
  email text,
  birth_date date,
  height_cm numeric(5,1),
  gender text check (gender in ('male', 'female')),
  start_date date default current_date,
  status text default 'active' check (status in ('active', 'inactive')),
  notes text,
  nutrition_calories_target integer,
  nutrition_protein_target integer,
  nutrition_carbs_target integer,
  nutrition_fat_target integer,
  created_at timestamptz default now()
);

-- Measurements
create table measurements (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references clients(id) on delete cascade,
  measured_at date not null default current_date,
  weight_kg numeric(5,2),
  body_fat_pct numeric(4,1),
  waist_cm numeric(5,1),
  hips_cm numeric(5,1),
  chest_cm numeric(5,1),
  arms_cm numeric(5,1),
  thighs_cm numeric(5,1),
  notes text,
  created_at timestamptz default now()
);

-- Appointments
create table appointments (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references clients(id) on delete cascade,
  appointment_date date not null,
  appointment_time time not null,
  duration_minutes integer default 60,
  type text default 'pilates' check (type in ('pilates', 'nutrition', 'followup', 'other')),
  status text default 'scheduled' check (status in ('scheduled', 'completed', 'cancelled', 'noshow')),
  price numeric(8,2),
  notes text,
  created_at timestamptz default now()
);

-- Payments
create table payments (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references clients(id) on delete cascade,
  appointment_id uuid references appointments(id) on delete set null,
  amount numeric(8,2) not null,
  payment_date date not null default current_date,
  method text default 'cash' check (method in ('cash', 'transfer', 'credit', 'other')),
  description text,
  created_at timestamptz default now()
);

-- Menu Templates
create table menu_templates (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  calories_target integer,
  protein_target integer,
  carbs_target integer,
  fat_target integer,
  created_at timestamptz default now()
);

-- Menus (per client)
create table menus (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references clients(id) on delete cascade,
  template_id uuid references menu_templates(id) on delete set null,
  name text not null,
  menu_date date default current_date,
  notes text,
  created_at timestamptz default now()
);

-- Menu Items
create table menu_items (
  id uuid primary key default gen_random_uuid(),
  menu_id uuid references menus(id) on delete cascade,
  food_name text not null,
  food_usda_id text,
  quantity_grams numeric(7,2),
  meal_type text default 'breakfast' check (meal_type in ('breakfast', 'morning_snack', 'lunch', 'afternoon_snack', 'dinner', 'evening_snack')),
  calories numeric(7,2),
  protein_g numeric(6,2),
  carbs_g numeric(6,2),
  fat_g numeric(6,2),
  sort_order integer default 0,
  created_at timestamptz default now()
);

-- Enable Row Level Security
alter table clients enable row level security;
alter table measurements enable row level security;
alter table appointments enable row level security;
alter table payments enable row level security;
alter table menu_templates enable row level security;
alter table menus enable row level security;
alter table menu_items enable row level security;

-- RLS Policies (authenticated users can access all)
create policy "Allow authenticated access to clients" on clients for all using (auth.role() = 'authenticated');
create policy "Allow authenticated access to measurements" on measurements for all using (auth.role() = 'authenticated');
create policy "Allow authenticated access to appointments" on appointments for all using (auth.role() = 'authenticated');
create policy "Allow authenticated access to payments" on payments for all using (auth.role() = 'authenticated');
create policy "Allow authenticated access to menu_templates" on menu_templates for all using (auth.role() = 'authenticated');
create policy "Allow authenticated access to menus" on menus for all using (auth.role() = 'authenticated');
create policy "Allow authenticated access to menu_items" on menu_items for all using (auth.role() = 'authenticated');
