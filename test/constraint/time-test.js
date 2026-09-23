const later = require('../../index'),
    runner = require('./runner')(later, later.time),
    should = require('should');

describe('Later.time', function() {

  const tests = [
    {
      // first second of year
      date: new Date(2008, 0, 1),
      val: 0,
      extent: [0, 86399],
      start: new Date(2008, 0, 1),
      end: new Date(2008, 0, 1)
    },
    {
      // last second of year
      date: new Date(2009, 11, 31, 23, 59, 59),
      val: 86399,
      extent: [0, 86399],
      start: new Date(2009, 11, 31, 23, 59, 59),
      end: new Date(2009, 11, 31, 23, 59, 59)
    },
    {
      // first second of month starting on Sunday
      date: new Date(2010, 7, 1),
      val: 0,
      extent: [0, 86399],
      start: new Date(2010, 7, 1),
      end: new Date(2010, 7, 1)
    },
    {
      // last second of month ending on Saturday
      date: new Date(2011, 3, 30, 23, 59, 59),
      val: 86399,
      extent: [0, 86399],
      start: new Date(2011, 3, 30, 23, 59, 59),
      end: new Date(2011, 3, 30, 23, 59, 59)
    },
    {
      // first second of day
      date: new Date(2012, 1, 28),
      val: 0,
      extent: [0, 86399],
      start: new Date(2012, 1, 28),
      end: new Date(2012, 1, 28)
    },
    {
      // last second of day on leap day
      date: new Date(2012, 1, 29, 23, 59, 59),
      val: 86399,
      extent: [0, 86399],
      start: new Date(2012, 1, 29, 23, 59, 59),
      end: new Date(2012, 1, 29, 23, 59, 59)
    },
    {
      // first second of hour
      date: new Date(2012, 10, 8, 14),
      val: 50400,
      extent: [0, 86399],
      start: new Date(2012, 10, 8, 14),
      end: new Date(2012, 10, 8, 14)
    },
/*    {
      // last second of hour (start DST)
      date: new Date(2013, 2, 10, 1, 59, 59),
      val: 7199,
      extent: [0, 86399],
      start: new Date(2013, 2, 10, 1, 59, 59),
      end: new Date(2013, 2, 10, 1, 59, 59)
    },*/
    {
      // first second of hour (end DST)
      date: new Date(2013, 10, 3, 2),
      val: 7200,
      extent: [0, 86399],
      start: new Date(2013, 10, 3, 2),
      end: new Date(2013, 10, 3, 2)
    },
    {
      // last second of hour
      date: new Date(2014, 1, 22, 6, 59, 59),
      val: 25199,
      extent: [0, 86399],
      start: new Date(2014, 1, 22, 6, 59, 59),
      end: new Date(2014, 1, 22, 6, 59, 59)
    },
    {
      // first second of minute
      date: new Date(2015, 5, 19, 18, 22),
      val: 66120,
      extent: [0, 86399],
      start: new Date(2015, 5, 19, 18, 22),
      end: new Date(2015, 5, 19, 18, 22)
    },
    {
      // last second of minute
      date: new Date(2016, 7, 29, 2, 56, 59),
      val: 10619,
      extent: [0, 86399],
      start: new Date(2016, 7, 29, 2, 56, 59),
      end: new Date(2016, 7, 29, 2, 56, 59)
    },
    {
      // second
      date: new Date(2017, 8, 4, 10, 31, 22),
      val: 37882,
      extent: [0, 86399],
      start: new Date(2017, 8, 4, 10, 31, 22),
      end: new Date(2017, 8, 4, 10, 31, 22)
    }
  ];

  runner.run(tests);

});

it('Later.time.includeDST', function () {
  const previousTZ = process.env.TZ;
  try {
    process.env.TZ = 'Europe/Bucharest';
    later.date.localTime();
    later.time.includeDST(true);
    const expression1 = later.parse.recur().every(1).dayEx().on(['03:10']).time();
    expression1.reference(new Date('2026-03-28T01:10:00Z'));
    const schedule = later.schedule(expression1);
    const next1 = schedule.next(3, new Date('2026-03-28T01:10:00Z')).slice(1);
    should(next1).eql([new Date('2026-03-29T01:10:00Z'), new Date('2026-03-30T00:10:00Z')]);

    // test with DST at 00:00
    process.env.TZ = 'Atlantic/Azores';
    const expression2 = later.parse.recur().every(1).dayEx().on(['00:00']).time();
    expression2.reference(new Date('2026-03-28T00:00:00Z'));
    const schedule2 = later.schedule(expression2);
    const next2 = schedule2.next(3, new Date('2026-03-28T00:00:00Z')).slice(1);
    should(next2).eql([new Date('2026-03-29T01:00:00Z'), new Date('2026-03-30T00:00:00Z')]);
  } finally {
    later.date.UTC();
    later.time.includeDST(false);
    if (previousTZ === undefined) {
      delete process.env.TZ;
    } else {
      process.env.TZ = previousTZ;
    }
  }
});