package com.fanglin.quotation.dao;

import com.fanglin.core.dao.Dao;
import com.fanglin.quotation.po.SelectionPO;

public interface SelectionDao extends Dao<SelectionPO>{
	
	public SelectionPO querySelectionByQid(long qid);
	
	public SelectionPO querySelectionByOrderId(String orderId);
	
	public int updateSelectionForQidByOrderId(String orderId, long qid);
	
	public void deleteSelectionByQid(long qid);
	
}
