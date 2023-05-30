/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { CostCenterService } from './CostCenter.service';

describe('Service: CostCenter', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CostCenterService]
    });
  });

  it('should ...', inject([CostCenterService], (service: CostCenterService) => {
    expect(service).toBeTruthy();
  }));
});
