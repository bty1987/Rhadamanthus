package com.fanglin.system.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.system.vo.SystemConfigVO;
import com.fanglin.utils.Paging;

public interface SystemConfigService {

	public void pageSystemConfig(Paging paging, List<Filter> filters) throws FLException;

	public List<SystemConfigVO> querySystemConfigByCid(SystemConfigVO systemConfigVO);

	public List<SystemConfigVO> querySystemConfigByGroup(SystemConfigVO systemConfigVO, Integer company);

	public SystemConfigVO querySystemConfigByKey(SystemConfigVO systemConfigVO, Integer company);

	public int updateSystemConfig(SystemConfigVO systemConfigVO) throws FLException;

	public void addSystemConfig(SystemConfigVO systemConfigVO, String userId) throws FLException;

	public int deleteSystemConfig(SystemConfigVO systemConfigVO) throws FLException;

}
