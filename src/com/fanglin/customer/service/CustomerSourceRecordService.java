package com.fanglin.customer.service;

import java.util.List;

import com.fanglin.core.vo.Filter;
import com.fanglin.customer.vo.CustomerSourceRecordVO;
import com.fanglin.utils.Paging;

public interface CustomerSourceRecordService {

	public void pageCustomerSourceRecord(Paging paging, List<Filter> filters, CustomerSourceRecordVO customerSourceRecord);

	public List<CustomerSourceRecordVO> queryCustomerSourceRecord(CustomerSourceRecordVO customerSourceRecord);

}
