package com.fanglin.communion.service;

import java.util.List;

import com.fanglin.communion.vo.CustomerRecordVO;

public interface CustomerRecordService {

	public List<CustomerRecordVO> queryCustomerRecord(CustomerRecordVO customerRecord);

	public void addCustomerRecord(CustomerRecordVO customerRecord, String userId);

}
