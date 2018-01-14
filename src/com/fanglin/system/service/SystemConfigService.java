package com.fanglin.system.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.system.vo.SystemConfigVO;
import com.fanglin.utils.Paging;

public interface SystemConfigService {
	
	public List<SystemConfigVO> pageSystemConfig(Paging paging,List<Filter> filters);
	
	public int updateSystemConfig(SystemConfigVO systemConfigVO) throws FLException;
	
}
