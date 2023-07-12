//
//  RCTLocationCoder.h
//  Whereisit
//
//  Created by Thomas Urey on 2/12/23.
//

#ifndef RCTLocationCoder_h
#define RCTLocationCoder_h

#import <React/RCTBridgeModule.h>
#import <CoreLocation/CoreLocation.h>
#import <React/RCTConvert.h>

@interface RCTConvert (CoreLocation)

+ (CLLocation *)CLLocation:(id)json;

@end

@interface RCTLocationCoder : NSObject <RCTBridgeModule>

@property (nonatomic, strong) CLGeocoder *geocoder;

@end

#endif /* RCTLocationCoder_h */
