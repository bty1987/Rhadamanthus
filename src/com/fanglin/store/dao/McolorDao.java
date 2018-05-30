package com.fanglin.store.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.store.po.McolorPO;

public interface McolorDao extends Dao<McolorPO>{
	
	public List<McolorPO> queryMcolorByGid(long gid, Boolean flag);
	
}
