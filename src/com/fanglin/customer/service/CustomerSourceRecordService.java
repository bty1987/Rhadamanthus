package com.fanglin.customer.service;

import java.util.List;

import com.fanglin.customer.vo.CustomerSourceRecordVO;

public interface CustomerSourceRecordService {

	public List<CustomerSourceRecordVO> queryCustomerSourceRecord(CustomerSourceRecordVO customerSourceRecord);

}
