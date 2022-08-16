package queries

import (
	"time"

	"github.com/jackc/pgtype/zeronull"
)

var zeroTime = zeronull.Timestamptz{}
var maxTime = zeronull.Timestamptz(time.Date(3100, 1, 1, 1, 1, 1, 0, time.UTC))
var fixedTime = zeronull.Timestamptz(time.Date(2020, 1, 1, 1, 1, 1, 0, time.UTC))
