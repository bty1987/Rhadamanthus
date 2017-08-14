package com.fanglin.upgrade.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.upgrade.vo.VersionVO;
import com.fanglin.utils.Paging;

public interface VersionService {

	public void pageVersion(Paging paging, List<Filter> filters);

	public List<VersionVO> queryVersion(List<Filter> filters);
	
	public int addVersion(VersionVO versionVO) throws FLException;
	
	public int updateVersion(VersionVO versionVO) throws FLException;
	
	public int updateVersionForStatus(VersionVO versionVO) throws FLException;
	
	public int deleteVersion(VersionVO versionVO) throws FLException;
	
}
