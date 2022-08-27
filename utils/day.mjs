import dayjs from 'dayjs';
 
dayjs.locale('kr');

class Day {
    constructor (day) {
        this.day = day;
    }

    static today() {
        return new Day(dayjs());
    }

    static create(dayAsText) {
        return new Day(dayjs(dayAsText));
    }

    static tomorrow(dayAsText) {
        return this.create(dayAsText).tomorrow();
    }

    static forEach(begin, until, each) {
        for (var day = begin; day.day < until.day; day = day.tomorrow())
        {
            each(day);
        }
    }

    static forEachAsync(begin, until, each) {
        return new Promise(async (resolve, error) => {
            for (var day = begin; day.day < until.day; day = day.tomorrow())
            {
                await each(day);
            }

            resolve();
        });
    }

    toString() {
        return this.day.format('YYYY-MM-DD');
    }

    toStringWithoutDash() {
        return this.day.format('YYYYMMDD');
    }

    tomorrow() {
        return new Day(this.day.add(1, 'day'));
    }

    delta(amount, unit) {
        return new Day(this.day.add(amount, unit));
    }

    nextBusinessDay() {
        let dayOfWeek = this.day.day();

        let adder = 1;
        if (dayOfWeek == 5) adder = 3;
        else if (dayOfWeek == 6) adder = 2;

        return Day.create(this.day.add(adder, 'day'));
    }
}

export default Day;