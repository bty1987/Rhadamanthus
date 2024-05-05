package com.fanglin.communion.dao;

import java.util.List;

import com.fanglin.communion.po.CustomerRecordPO;
import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

public interface CustomerRecordDao extends Dao<CustomerRecordPO> {

	public List<CustomerRecordPO> pageCustomerRecord(Paging paging, List<Filter> filters, Long cid);

	public List<CustomerRecordPO> queryCustomerRecord(long cid);

}
