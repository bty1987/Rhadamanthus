package com.fanglin.market.service;

import java.util.List;

import com.fanglin.core.vo.Filter;
import com.fanglin.market.vo.EcityVO;
import com.fanglin.utils.Paging;

public interface EcityService {

	public void pageEcity(Paging paging, List<Filter> filters);
	
	public List<EcityVO> queryEcity();
	
	public EcityVO queryEcityByXandY(EcityVO ecity);

	public List<EcityVO> queryEcityByPinYin(EcityVO ecity);

	public void addEcity(EcityVO ecity);

	public void updateEcity(EcityVO ecity);

}
