import { TestBed } from '@angular/core/testing';

import { CodebookService } from './codebook.service';

describe('CodebookService', () => {
  let service: CodebookService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CodebookService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
