package com.fanglin.communion.service;

import java.util.List;

import com.fanglin.communion.vo.CustomerRecordVO;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

public interface CustomerRecordService {

	public void pageCustomerRecord(Paging paging, List<Filter> filters, CustomerRecordVO customerRecordVO);

	public List<CustomerRecordVO> queryCustomerRecord(CustomerRecordVO customerRecord);

	public void addCustomerRecord(CustomerRecordVO customerRecord, String userId);

}
