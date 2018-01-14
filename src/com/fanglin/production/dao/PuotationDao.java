package com.fanglin.production.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.production.po.PuotationPO;

public interface PuotationDao extends Dao<PuotationPO>{
	
	public List<PuotationPO> queryPuotationByPid(long pid);
	
	public PuotationPO queryPuotationByQid(long qid);
	
}
