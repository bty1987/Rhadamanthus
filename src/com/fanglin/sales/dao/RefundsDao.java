package com.fanglin.sales.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.sales.po.RefundsPO;

public interface RefundsDao extends Dao<RefundsPO>{
	
	public List<RefundsPO> queryRefundsBySid(Long sid);
	
	public void updateRefundsForStatusBySpid(Long spid, short status);

}
