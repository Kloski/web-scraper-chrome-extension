const Job = require('./../../extension/scripts/Job')
const assert = require('chai').assert

describe('Job', function () {
  it('should be able to create correct url from parent job', function () {
    var parent = new Job('http://example.com/')
    var child = new Job('/test/', null, null, parent)
    assert.equal(child.url, 'http://example.com/test/')

    parent = new Job('http://example.com')
    child = new Job('test/', null, null, parent)
    assert.equal(child.url, 'http://example.com/test/')

    parent = new Job('http://example.com/asdasdad')
    child = new Job('tvnet.lv', null, null, parent)
    assert.equal(child.url, 'http://tvnet.lv/')

    parent = new Job('http://example.com/asdasdad')
    child = new Job('?test', null, null, parent)
    assert.equal(child.url, 'http://example.com/asdasdad?test')

    parent = new Job('http://example.com/1/')
    child = new Job('2/', null, null, parent)
    assert.equal(child.url, 'http://example.com/1/2/')

    parent = new Job('http://127.0.0.1/1/')
    child = new Job('2/', null, null, parent)
    assert.equal(child.url, 'http://127.0.0.1/1/2/')

    parent = new Job('http://xn--80aaxitdbjk.xn--p1ai/')
    child = new Job('2/', null, null, parent)

    assert.equal(child.url, 'http://xn--80aaxitdbjk.xn--p1ai/2/')
  })

  it('should be able to create correct url from parent job with slashes after question mark', function () {
    var parent = new Job('http://www.sportstoto.com.my/results_past.asp?date=5/1/1992')
    var child = new Job('popup_past_results.asp?drawNo=418/92', null, null, parent)
    assert.equal(child.url, 'http://www.sportstoto.com.my/popup_past_results.asp?drawNo=418/92')
  })

  it('should be able to create correct url with a port number', function () {
    var parent = new Job('http://nukrobi2.nuk.uni-lj.si:8080/wayback/20101021090940/http://volitve.gov.si/lv2010/kandidati/seznam_obcin.html')
    var child = new Job('http://nukrobi2.nuk.uni-lj.si:8080/wayback/20101021091250/http://volitve.gov.si/lv2010/kandidati/zupani_os_celje.html', null, null, parent)
    assert.equal(child.url, 'http://nukrobi2.nuk.uni-lj.si:8080/wayback/20101021091250/http://volitve.gov.si/lv2010/kandidati/zupani_os_celje.html')

    parent = new Job('http://nukrobi2.nuk.uni-lj.si:8080')
    child = new Job('zupani_os_celje.html', null, null, parent)
    assert.equal(child.url, 'http://nukrobi2.nuk.uni-lj.si:8080/zupani_os_celje.html')
  })

  it('should not override data with base data if it already exists', function () {
    var browser = {
      fetchData: function (url, sitemap, parentSelector, callback) {
        callback(null, [{a: 1, b: 2}])
      }
    }

    var job = new Job(undefined, undefined, {sitemap: undefined}, undefined, {a: 'do not override', c: 3})
    job.execute(browser, function () {})
    var results = job.getResults()
    assert.deepEqual(results, [{a: 1, b: 2, c: 3}])
  })
})
