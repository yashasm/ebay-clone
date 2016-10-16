/**
 * New node file
 */


var should = require('should');
var request = require('request');
var expect = require('chai').expect;
var baseURL = 'http://localhost:3000';
var util = require('util');

describe('return all search details', function(){
	it('it returns all search details',function(done){
		request.get({url:baseURL + '/search-details'},				
		function(error, response, body){
			expect(response.statusCode).to.equal(200);
			console.log(body);
			done();
		});
	});
});
