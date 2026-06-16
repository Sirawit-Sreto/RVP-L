CREATE SCHEMA "public";
CREATE TABLE "api" (
	"api_id" serial PRIMARY KEY,
	"api_category" varchar(100) NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE "category" (
	"category_id" serial PRIMARY KEY,
	"category_name" varchar(100) NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE "config" (
	"config_id" serial PRIMARY KEY,
	"config_name" varchar(100) NOT NULL,
	"group_choice" varchar(100) NOT NULL,
	"create_at" timestamp DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE "cr" (
	"cr_id" serial PRIMARY KEY,
	"user_id" integer,
	"project_id" integer,
	"cr_no" varchar(100) NOT NULL,
	"cr_detail" text,
	"create_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	"close_at" timestamp
);
CREATE TABLE "department" (
	"department_id" serial PRIMARY KEY,
	"department_name" varchar(100) NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE "movement" (
	"move_id" serial PRIMARY KEY,
	"user_id" integer,
	"project_id" integer,
	"move_name" varchar(100) NOT NULL,
	"create_at" timestamp DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE "outsource" (
	"user_out_id" serial PRIMARY KEY,
	"user_id" integer,
	"role_id" integer,
	"project_id" integer,
	"first_name" varchar(255) NOT NULL,
	"last_name" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	"update_at" timestamp DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE "position" (
	"position_id" serial PRIMARY KEY,
	"position_name" varchar(100) NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE "projects" (
	"project_id" serial PRIMARY KEY,
	"status_id" integer,
	"user_id" integer,
	"config_id" integer,
	"project_name" varchar(255) NOT NULL,
	"company_name" varchar(255),
	"start_project" varchar(255) NOT NULL,
	"end_project" varchar(255),
	"project_pic" text,
	"description" text,
	"dns" text,
	"frontend" text,
	"backend" text,
	"database" text,
	"link_path" text,
	"link_name" text,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	"update_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	"is_deleted" boolean DEFAULT false,
	"user_out_id" integer
);
CREATE TABLE "request" (
	"req_id" serial PRIMARY KEY,
	"user_id" integer,
	"project_id" integer,
	"req_no" varchar(100) NOT NULL,
	"req_detail" text,
	"create_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	"close_at" timestamp
);
CREATE TABLE "roles" (
	"role_id" serial PRIMARY KEY,
	"role_name" varchar(100) NOT NULL
);
CREATE TABLE "status" (
	"status_id" serial PRIMARY KEY,
	"status_name" varchar(100) NOT NULL
);
CREATE TABLE "tags" (
	"tag_id" serial PRIMARY KEY,
	"tag_name" varchar(100) NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE "task" (
	"task_id" serial PRIMARY KEY,
	"project_id" integer,
	"user_id" integer,
	"config_id" integer,
	"cr_id" integer,
	"role_id" integer,
	"task_name" varchar(255) NOT NULL,
	"task_version" varchar(255) NOT NULL,
	"task_description" varchar(500),
	"create_at" timestamp DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE "teamMember" (
	"team_id" serial PRIMARY KEY,
	"team_category" varchar(100) NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE "tech" (
	"tech_id" serial,
	"tech_category" varchar(100) NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT "techStack_pkey" PRIMARY KEY("tech_id")
);
CREATE TABLE "tools" (
	"tools_id" serial PRIMARY KEY,
	"tools_category" varchar(100) NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE "types" (
	"type_id" serial PRIMARY KEY,
	"type_name" varchar(100) NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE "users" (
	"user_id" serial PRIMARY KEY,
	"role_id" integer,
	"user_firstname" varchar(255) NOT NULL,
	"user_lastname" varchar(255) NOT NULL,
	"user_department" varchar(100),
	"user_pic" text,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	"update_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	"is_deleted" boolean DEFAULT false,
	"password_hash" varchar(255) DEFAULT NULL
);
CREATE UNIQUE INDEX "api_pkey" ON "api" ("api_id");
CREATE UNIQUE INDEX "category_pkey" ON "category" ("category_id");
CREATE UNIQUE INDEX "config_pkey" ON "config" ("config_id");
CREATE UNIQUE INDEX "cr_pkey" ON "cr" ("cr_id");
CREATE UNIQUE INDEX "department_pkey" ON "department" ("department_id");
CREATE UNIQUE INDEX "movement_pkey" ON "movement" ("move_id");
CREATE UNIQUE INDEX "outsource_pkey" ON "outsource" ("user_out_id");
CREATE UNIQUE INDEX "position_pkey" ON "position" ("position_id");
CREATE UNIQUE INDEX "projects_pkey" ON "projects" ("project_id");
CREATE UNIQUE INDEX "request_pkey" ON "request" ("req_id");
CREATE UNIQUE INDEX "roles_pkey" ON "roles" ("role_id");
CREATE UNIQUE INDEX "status_pkey" ON "status" ("status_id");
CREATE UNIQUE INDEX "tags_pkey" ON "tags" ("tag_id");
CREATE UNIQUE INDEX "task_pkey" ON "task" ("task_id");
CREATE UNIQUE INDEX "teamMember_pkey" ON "teamMember" ("team_id");
CREATE UNIQUE INDEX "techStack_pkey" ON "tech" ("tech_id");
CREATE UNIQUE INDEX "tools_pkey" ON "tools" ("tools_id");
CREATE UNIQUE INDEX "types_pkey" ON "types" ("type_id");
CREATE UNIQUE INDEX "users_pkey" ON "users" ("user_id");
ALTER TABLE "cr" ADD CONSTRAINT "cr_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("project_id") ON DELETE CASCADE;
ALTER TABLE "cr" ADD CONSTRAINT "cr_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE SET NULL;
ALTER TABLE "outsource" ADD CONSTRAINT "outsource_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("project_id") ON DELETE CASCADE;
ALTER TABLE "outsource" ADD CONSTRAINT "outsource_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("role_id") ON DELETE SET NULL;
ALTER TABLE "outsource" ADD CONSTRAINT "outsource_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE SET NULL;
ALTER TABLE "projects" ADD CONSTRAINT "projects_config_id_fkey" FOREIGN KEY ("config_id") REFERENCES "config"("config_id") ON DELETE SET NULL;
ALTER TABLE "projects" ADD CONSTRAINT "projects_status_id_fkey" FOREIGN KEY ("status_id") REFERENCES "status"("status_id") ON DELETE SET NULL;
ALTER TABLE "projects" ADD CONSTRAINT "projects_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE SET NULL;
ALTER TABLE "projects" ADD CONSTRAINT "projects_user_out_id_fkey" FOREIGN KEY ("user_out_id") REFERENCES "outsource"("user_out_id") ON DELETE SET NULL;
ALTER TABLE "request" ADD CONSTRAINT "request_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("project_id") ON DELETE CASCADE;
ALTER TABLE "request" ADD CONSTRAINT "request_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE SET NULL;
ALTER TABLE "task" ADD CONSTRAINT "task_config_id_fkey" FOREIGN KEY ("config_id") REFERENCES "config"("config_id") ON DELETE SET NULL;
ALTER TABLE "task" ADD CONSTRAINT "task_cr_id_fkey" FOREIGN KEY ("cr_id") REFERENCES "cr"("cr_id") ON DELETE SET NULL;
ALTER TABLE "task" ADD CONSTRAINT "task_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("project_id") ON DELETE CASCADE;
ALTER TABLE "task" ADD CONSTRAINT "task_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("role_id") ON DELETE SET NULL;
ALTER TABLE "task" ADD CONSTRAINT "task_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE SET NULL;
ALTER TABLE "users" ADD CONSTRAINT "users_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("role_id") ON DELETE SET NULL;