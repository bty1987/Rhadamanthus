package com.fanglin.common.dao;

import java.sql.Timestamp;
import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.log.po.LoginLogPO;
import com.fanglin.utils.Paging;

public interface LoginLogDao extends Dao<LoginLogPO> {

	public List<LoginLogPO> getPageLoginLog(Paging paging, List<Filter> filters);

	public void delteBeforLoginTime(Timestamp beforeTime);

	public List<LoginLogPO> getLoginLogByLoginIdAndStartEndTime(String loginId, Timestamp start, Timestamp end);
}
