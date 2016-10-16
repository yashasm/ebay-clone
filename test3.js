
/**
 * New node file
 */


var should = require('should');
var request = require('request');
var expect = require('chai').expect;
var baseURL = 'http://localhost:3000';
var util = require('util');

describe('return search for query samsung', function(){
	it('it returns search result for query samsung',function(done){
		request.get({url:baseURL + '/search-details?searchstring=samsung'},				
		function(error, response, body){
			expect(response.statusCode).to.equal(200);
			console.log(body);
			done();
		});
	});
});
