import { TestBed } from '@angular/core/testing';

import { YoutubePlayerApiService } from './youtube-player-api.service';

describe('YoutubePlayerApiService', () => {
  let service: YoutubePlayerApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(YoutubePlayerApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
