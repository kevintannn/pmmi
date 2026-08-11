-- CreateTable
CREATE TABLE "visits" (
    "id" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "path" TEXT,
    "locale" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "visits_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "visits_date_idx" ON "visits"("date");
