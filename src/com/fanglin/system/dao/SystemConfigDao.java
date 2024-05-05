package com.fanglin.system.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.system.po.SystemConfigPO;
import com.fanglin.utils.Paging;

public interface SystemConfigDao extends Dao<SystemConfigPO> {

	public List<SystemConfigPO> pageSystemConfig(Paging paging, List<Filter> filters) throws FLException;

	public SystemConfigPO querySystemConfig(String key);

	public SystemConfigPO querySystemConfig(String key, int company);

	public List<SystemConfigPO> querySystemConfigByCid(Integer company);

	public SystemConfigPO querySystemConfigById(long scid);

	public List<SystemConfigPO> obtainSystemConfig(String key, int company);

}
