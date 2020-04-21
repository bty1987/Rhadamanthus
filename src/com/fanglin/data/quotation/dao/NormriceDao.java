package com.fanglin.data.quotation.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.data.po.NormricePO;

public interface NormriceDao extends Dao<NormricePO> {
	
	public List<NormricePO> queryNormriceByQiid(Long qiid);
	
}
