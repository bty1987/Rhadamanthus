package com.fanglin.customer.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.customer.po.ComplackPO;

public interface ComplackDao extends Dao<ComplackPO>{
	
	public List<ComplackPO> queryComplack(long ctid);

}
