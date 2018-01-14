package com.fanglin.inventory.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.inventory.po.ColorPO;

public interface ColorDao extends Dao<ColorPO>{
	
	public List<ColorPO> queryColorByGid(long gid);
	
	public List<ColorPO> queryColorForEnableByGid(long gid);
	
	public ColorPO queryColorByName(long gid,String name);
	
}
