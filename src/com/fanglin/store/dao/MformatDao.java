package com.fanglin.store.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.store.po.MformatPO;

public interface MformatDao extends Dao<MformatPO>{
	
	public List<MformatPO> queryMformatByGid(long gid, Boolean flag);

}
