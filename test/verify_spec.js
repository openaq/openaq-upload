const expect = require('chai').expect;
const fs = require('fs');

const verifyCsv = require('../app/assets/scripts/services/verify')

const failureTypes = require('../app/assets/scripts/constants')


const readFile = async (filename) => {
    return new Promise((resolve, reject) => {
        verifyCsv(fs.createReadStream(`./test_data/${filename}`)).then(data => {
            resolve(data)
        }).catch(err => {
            reject(err)
        });
    })
}

describe('Verify function', function () {
    describe(`Empty file should fail`, function () {
        let failures = undefined
        const filename = '00_error_parsing.csv'
        readFile(filename).then(_ => {
            throw new Error('Was expected to fail')
        }).catch(error => {
            failures = error.failures
        })
        it(`should not have 0 failures`, function () {
            expect(failures[0].length).to.not.equal(0)
        });
        it(`should have failure code equal to 0`, function () {
            expect(failures[0].code).to.equal(0)
        });
    });

    describe(`Empty CSV file should fail`, function () {
        let failures = undefined
        const filename = '01_empty_csv.csv'
        readFile(filename).then(_ => {
            throw new Error('Was expected to fail')
        }).catch(error => {
            failures = error.failures
        })
        it(`should not have 0 failures`, function () {
            expect(failures[0].length).to.not.equal(0)
        });
        it(`should have failure code equal to 2`, function () {
            expect(failures[0].code).to.equal(2)
        });
    });

    describe(`Successful CSV should pass`, function () {
        let result = undefined
        const filename = '02_successful_form.csv'
        let readingError = false
        readFile(filename).then(data => {
            result = data
        }).catch(error => {
            readingError = true
        })
        it('should pass verify', function() {
            expect(readingError).to.equal(false)
        })
        it(`should not have any failures`, function () {
            expect(result.failures.length).to.equal(0)
        });
        it(`should have a csvOutput`, function () {
            expect(result.csvOutput).to.not.equal('')
        });
    });

    describe(`Should fail attribution_name missing`, function () {
        let failures = undefined
        const filename = '03_additional_attribution_missing.csv'
        readFile(filename).then(_ => {
            throw new Error('Was expected to fail')
        }).catch(error => {
            failures = error.failures
        })
        it(`should not have 0 failures`, function () {
            expect(failures[0].length).to.not.equal(0)
        });
        it(`should have failure code equal to 2`, function () {
            expect(failures[0].code).to.equal(2)
        });
    });

    describe(`Should fail because you need "attribution_name_2" and not "attribution_name_1"`, function () {
        let failures = undefined
        const filename = '04_additional_attribution_error.csv'
        readFile(filename).then(_ => {
            throw new Error('Was expected to fail')
        }).catch(error => {
            failures = error.failures
        })
        it(`should not have 0 failures`, function () {
            expect(failures[0].length).to.not.equal(0)
        });
        it(`should have failure code equal to 3`, function () {
            expect(failures[0].code).to.equal(3)
        });
    });
    
    describe(`Should fail because it is missing one more more columns`, function () {
        let failures = undefined
        const filename = '05_missing_column.csv'
        readFile(filename).then(_ => {
            throw new Error('Was expected to fail')
        }).catch(error => {
            failures = error.failures
        })
        it(`should not have 0 failures`, function () {
            expect(failures[0].length).to.not.equal(0)
        });
        it(`should have failure code equal to 2`, function () {
            expect(failures[0].code).to.equal(2)
        });
    });
});