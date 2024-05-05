package com.fanglin.communion.service;

import java.util.List;

import com.fanglin.communion.vo.HouseLayoutVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

public interface HouseLayoutService {

	public void pageHouseLayout(Paging paging, List<Filter> filters);

	public List<HouseLayoutVO> queryHouseLayout(HouseLayoutVO houseLayoutVO);

	public void addHouseLayout(HouseLayoutVO houseLayoutVO) throws FLException;

	public void deleteHouseLayout(HouseLayoutVO houseLayoutVO) throws FLException;

}
