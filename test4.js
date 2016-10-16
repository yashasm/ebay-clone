
/**
 * New node file
 */

var should = require('should');
var request = require('request');
var expect = require('chai').expect;
var baseURL = 'http://localhost:3000';
var util = require('util');

describe('return item detail with itemid 1', function(){
	it('it returns item detail with itemid 1',function(done){
		request.get({url:baseURL + '/search-item?searchid=1'},				
		function(error, response, body){
			expect(response.statusCode).to.equal(200);
			console.log(body);
			done();
		});
	});
});
