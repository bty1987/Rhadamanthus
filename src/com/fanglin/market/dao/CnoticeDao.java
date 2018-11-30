package com.fanglin.market.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.market.po.CnoticePO;

public interface CnoticeDao extends Dao<CnoticePO> {
	
	public List<CnoticePO> queryCnoticeBySuid(long suid);
	
	public List<CnoticePO> queryCnoticeByRuid(long ruid);
	
	public int countCnoticeBySuid(long suid, short status);
	
	public int countCnoticeByRuid(long ruid, short status);

}
