package com.fanglin.report.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.report.po.ApprovalAchievementPO;
import com.fanglin.utils.Paging;

public interface ApprovalReportDao extends Dao<ApprovalAchievementPO> {

	public List<ApprovalAchievementPO> queryApproval7Achievement(Paging paging, List<Filter> filters, int company);

}
