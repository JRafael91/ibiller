ALTER TABLE "business_user" DROP CONSTRAINT "business_user_user_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "business_user" DROP CONSTRAINT "business_user_business_id_business_id_fk";
--> statement-breakpoint
ALTER TABLE "business_user" ADD CONSTRAINT "business_user_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "business_user" ADD CONSTRAINT "business_user_business_id_business_id_fk" FOREIGN KEY ("business_id") REFERENCES "public"."business"("id") ON DELETE cascade ON UPDATE no action;