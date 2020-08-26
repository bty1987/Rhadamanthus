package com.fanglin.personel.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.personel.po.DutmentPO;

public interface DutmentDao extends Dao<DutmentPO> {

	public List<DutmentPO> queryDutmentByDeid(Integer did);

	public List<DutmentPO> queryDutmentByDuid(Long did);
	
	public DutmentPO queryDutmentByDids(Integer deid, Long did);

}
