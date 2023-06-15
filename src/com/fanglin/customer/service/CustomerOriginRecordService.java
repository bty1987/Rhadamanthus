package com.fanglin.customer.service;

import java.util.List;

import com.fanglin.customer.vo.CustomerOriginRecordVO;

public interface CustomerOriginRecordService {

	public List<CustomerOriginRecordVO> queryCustomerOriginRecord(CustomerOriginRecordVO customerOriginRecord);

	public void addCustomerOriginRecord(CustomerOriginRecordVO customerOriginRecord, String userId);

}
