package com.fanglin.production.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.production.po.PuotationItemPO;

public interface PuotationItemDao extends Dao<PuotationItemPO> {

	public List<PuotationItemPO> queryPuotationItemByQid(long qid);

	public PuotationItemPO queryPuotationItemByQiid(long qiid);
	
	public int deletePuotationItemByQId(long qid);
}
