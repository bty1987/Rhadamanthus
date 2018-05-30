package com.fanglin.store.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.store.po.MpricePO;

public interface MpriceDao extends Dao<MpricePO>{
	
	public List<MpricePO> queryMprice(long gid);

	public List<MpricePO> queryMpriceByGid(long gid);
	
	public List<MpricePO> queryMpriceByBid(long bid);
	
	public List<MpricePO> queryMpriceByPinyinName(String pinyinName);
	
	public List<MpricePO> queryMpriceByStatus(short status);
	
	public List<MpricePO> queryMpriceByGidAndCid(long gid, long cid);
	
	public List<MpricePO> queryMpriceByGidAndFid(long gid, long fid);
	
	public MpricePO queryMpriceByPid(long pid);
}
