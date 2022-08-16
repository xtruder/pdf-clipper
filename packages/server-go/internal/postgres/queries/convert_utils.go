package queries

import (
	"time"

	"github.com/google/uuid"
	"github.com/jackc/pgtype"
)

var nullTime = pgtype.Timestamptz{Status: pgtype.Null}

func timeToTimestamptz(t *time.Time) (ts pgtype.Timestamptz) {
	ts.Set(t)
	return
}

func timestamptzToTimePtr(ts pgtype.Timestamptz) *time.Time {
	switch ts.Status {
	case pgtype.Null:
		return nil
	case pgtype.Present:
		return &ts.Time
	default:
		panic("invalid timestamp status")
	}
}

func stringToUUID(uuid string) (u pgtype.UUID) {
	u.Set(uuid)
	return
}

func uuidToPgUUID(uuid uuid.UUID) (u pgtype.UUID) {
	u.Set(uuid)
	return
}

func pgUUIDToUUID(u pgtype.UUID) (uu uuid.UUID) {
	switch u.Status {
	case pgtype.Null:
		return
	case pgtype.Present:
		var err error
		if uu, err = uuid.FromBytes(u.Bytes[:]); err != nil {
			panic(err)
		}

		return
	default:
		panic("invalid uuid status")
	}
}

func strToStrPtr(str string) *string {
	return &str
}

func strPtrToStr(strPtr *string) (str string) {
	if strPtr != nil {
		str = *strPtr
	}
	return
}

func valToJSONB(val interface{}) (jsonb pgtype.JSONB) {
	jsonb.Set(val)
	return
}
