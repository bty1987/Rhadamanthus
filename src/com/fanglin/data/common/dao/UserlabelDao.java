package com.fanglin.data.common.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.data.po.UserlabelPO;

public interface UserlabelDao extends Dao<UserlabelPO> {

	public List<UserlabelPO> querylabelByuid(Integer uid);
	
	public List<UserlabelPO> queryUserLbaelBylids(List<Integer> lids);
	
	public List<UserlabelPO> queryUserLabelByUidValue(Integer uid);

}
