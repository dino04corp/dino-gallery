package db

import (
	"fmt"
	"log"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func Init(dbhost string, dbport int, dbuser, dbpass, dbname string, usessl bool) *gorm.DB {
	dbssl := "disable"
	if usessl {
		dbssl = "require"
	}
	dsn := fmt.Sprintf(
		"host=%s port=%d user=%s password=%s dbname=%s sslmode=%s",
		dbhost, dbport, dbuser, dbpass, dbname, dbssl,
	)
	log.Printf("Connecting to database with DSN: %s", dsn)

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalln(err)
	}
	// if err != nil {
	// 	panic("failed to connect to database: " + err.Error())
	// }

	return db
}
