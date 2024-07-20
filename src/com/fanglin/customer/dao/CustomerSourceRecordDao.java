package com.fanglin.customer.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.customer.po.CustomerSourceRecordPO;
import com.fanglin.utils.Paging;

public interface CustomerSourceRecordDao extends Dao<CustomerSourceRecordPO> {

	public List<CustomerSourceRecordPO> pageCustomerSourceRecord(Paging paging, List<Filter> filters, Long csid);

	public List<CustomerSourceRecordPO> queryCustomerSourceRecord(long csid);

}
