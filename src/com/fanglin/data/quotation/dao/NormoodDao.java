package com.fanglin.data.quotation.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.data.po.NormoodPO;

public interface NormoodDao extends Dao<NormoodPO> {
	
	public List<NormoodPO> queryNormoodByQiid(Long qiid);

}
