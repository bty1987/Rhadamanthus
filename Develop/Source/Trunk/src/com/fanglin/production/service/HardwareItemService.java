package com.fanglin.production.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.production.vo.HardwareItemVO;
import com.fanglin.production.vo.HardwareVO;
import com.fanglin.utils.Paging;

public interface HardwareItemService {

	public void pageHardwareItemByHid(Paging paging, List<Filter> filters,HardwareVO hardwareVO);
	
	public int addHardwareItem(List<HardwareItemVO> hardwareItems, HardwareVO HardwareVO) throws FLException;
	
	public int deleteHardwareItem(HardwareItemVO hardwareItemVO) throws FLException;
	
}
