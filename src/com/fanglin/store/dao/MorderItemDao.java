package com.fanglin.store.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.store.po.MorderItemPO;

public interface MorderItemDao extends Dao<MorderItemPO>{
	
	public List<MorderItemPO> queryMorderItemByUidAndStatus(Long uid, Short status);

	public List<MorderItemPO> queryMorderItemByOid(Long oid);
	
}
