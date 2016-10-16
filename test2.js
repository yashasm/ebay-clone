
/**
 * New node file
 */


var should = require('should');
var request = require('request');
var expect = require('chai').expect;
var baseURL = 'http://localhost:3000';
var util = require('util');

describe('return search for query nike', function(){
	it('it returns search result for query nike',function(done){
		request.get({url:baseURL + '/search-details?searchstring=nike'},				
		function(error, response, body){
			expect(response.statusCode).to.equal(200);
			console.log(body);
			done();
		});
	});
});
