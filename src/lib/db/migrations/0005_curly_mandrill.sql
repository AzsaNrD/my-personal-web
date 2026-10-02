CREATE TABLE "view_hits" (
	"slug" text NOT NULL,
	"visitor" text NOT NULL,
	"day" text NOT NULL,
	CONSTRAINT "view_hits_slug_visitor_day_pk" PRIMARY KEY("slug","visitor","day")
);
