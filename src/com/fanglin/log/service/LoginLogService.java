package com.fanglin.log.service;

import java.util.List;

import com.fanglin.core.vo.Filter;
import com.fanglin.log.vo.LoginLogVO;
import com.fanglin.utils.Paging;

public interface LoginLogService {
	
	public int addLoginLog(LoginLogVO loginLog);
	
	public void pageLoginLog(Paging paging, List<Filter> filters);

	public int isCanLogin(LoginLogVO lv);
}
