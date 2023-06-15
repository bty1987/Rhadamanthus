package com.fanglin.report.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.report.vo.DecorationAchievementVO;
import com.fanglin.utils.Paging;

public interface DecorationReportService {

	public void queryDecoration7Construction(Paging paging, List<Filter> list) throws FLException;

	public void queryDecoration7Achievement(Paging paging, List<Filter> list, int company) throws FLException;

	public void updateDecoration7Construction() throws Exception;

	public void updateDecoration7Achievement(DecorationAchievementVO decorationAchievement, int company) throws Exception;

}
