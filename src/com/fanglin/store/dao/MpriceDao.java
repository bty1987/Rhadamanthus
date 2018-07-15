package com.fanglin.store.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.store.po.MpricePO;

public interface MpriceDao extends Dao<MpricePO>{
	
	public List<MpricePO> queryMprice(long gid);

	public List<MpricePO> queryMpriceByGid(long gid);
	
	public List<MpricePO> queryMpriceByPinyin(String pinyinName);
	
	public List<MpricePO> queryMpriceForShow(short status);
	
	public MpricePO queryMpriceByPid(long pid);
	
	public int count(long gid, long cid, long fid);
	
}
