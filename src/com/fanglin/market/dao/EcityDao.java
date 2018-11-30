package com.fanglin.market.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.market.po.EcityPO;
import com.fanglin.utils.Paging;

public interface EcityDao extends Dao<EcityPO>{

	public List<EcityPO> pageEcity(Paging paging, List<Filter> filters);
	
	public List<EcityPO> queryEcity();
	
	public EcityPO queryEcityByXandY(Double addX, Double subX, Double addY, Double subY);
	
	public List<EcityPO> queryEcityByPinYin(String pinyin);
	
	public EcityPO queryEcityByCityString(String city);

}
