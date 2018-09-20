package com.fanglin.customer.service;

import java.util.List;

import com.fanglin.customer.vo.CustomerRecordVO;


public interface CustomerRecordService {

	public List<CustomerRecordVO> queryCustomerRecord(CustomerRecordVO customerRecord);
	
	public void addCustomerRecord(CustomerRecordVO customerRecord,String userId);
	
}
