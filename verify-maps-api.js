#!/usr/bin/env node

/**
 * Quick verification script for Google Maps API
 * Run with: node verify-maps-api.js
 */

const https = require('https');

const API_KEY = 'AIzaSyA0avFG5U5_eVK-Aw9Nsnl8HfyYJcyjEWM';

console.log('Google Maps API Verification\n' + '='.repeat(40));

// Test 1: Geocoding API
function testGeocoding() {
    console.log('\n1. Testing Geocoding API...');
    
    const address = encodeURIComponent('123 Main St, Dallas, TX 75201');
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${API_KEY}`;
    
    https.get(url, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
            try {
                const result = JSON.parse(data);
                if (result.status === 'OK') {
                    console.log('✓ Geocoding API: WORKING');
                    console.log(`  - Address: ${result.results[0].formatted_address}`);
                    console.log(`  - Location: ${result.results[0].geometry.location.lat}, ${result.results[0].geometry.location.lng}`);
                } else {
                    console.log(`✗ Geocoding API: ${result.status}`);
                    if (result.error_message) {
                        console.log(`  - Error: ${result.error_message}`);
                    }
                }
            } catch (e) {
                console.log('✗ Geocoding API: Failed to parse response');
            }
            
            // Test 2: Places API
            testPlaces();
        });
    }).on('error', (e) => {
        console.log(`✗ Geocoding API: ${e.message}`);
        testPlaces();
    });
}

// Test 2: Places API (Text Search)
function testPlaces() {
    console.log('\n2. Testing Places API (Text Search)...');
    
    const query = encodeURIComponent('attic cleaning in Dallas');
    const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${query}&key=${API_KEY}`;
    
    https.get(url, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
            try {
                const result = JSON.parse(data);
                if (result.status === 'OK') {
                    console.log('✓ Places API: WORKING');
                    console.log(`  - Found ${result.results.length} results`);
                    if (result.results.length > 0) {
                        console.log(`  - First result: ${result.results[0].name}`);
                    }
                } else {
                    console.log(`✗ Places API: ${result.status}`);
                    if (result.error_message) {
                        console.log(`  - Error: ${result.error_message}`);
                    }
                }
            } catch (e) {
                console.log('✗ Places API: Failed to parse response');
            }
            
            // Summary
            printSummary();
        });
    }).on('error', (e) => {
        console.log(`✗ Places API: ${e.message}`);
        printSummary();
    });
}

function printSummary() {
    console.log('\n' + '='.repeat(40));
    console.log('Summary:');
    console.log('- API Key: AIzaSyA0avFG5U5_eVK-Aw9Nsnl8HfyYJcyjEWM');
    console.log('- Key is configured in: /js/modules/api.js');
    console.log('\nTo test in browser:');
    console.log('1. Run: python3 test-server.py');
    console.log('2. Open: http://localhost:8080/test-maps-simple.html');
    console.log('3. Or open: http://localhost:8080/test-google-maps.html');
}

// Start tests
testGeocoding();