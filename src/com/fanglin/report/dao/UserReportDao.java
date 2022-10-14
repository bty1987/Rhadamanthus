package com.fanglin.report.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.report.po.UserAchievementPO;
import com.fanglin.utils.Paging;

public interface UserReportDao extends Dao<UserAchievementPO> {

	public List<UserAchievementPO> queryUser7Achievement(Paging paging, List<Filter> filters, int company);

}
