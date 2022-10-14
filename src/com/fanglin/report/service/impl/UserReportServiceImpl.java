package com.fanglin.report.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.report.dao.UserReportDao;
import com.fanglin.report.po.UserAchievementPO;
import com.fanglin.report.service.UserReportService;
import com.fanglin.report.vo.UserAchievementVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("UserReportService")
@Transactional(readOnly = true)
public class UserReportServiceImpl implements UserReportService {

	@Autowired
	private UserReportDao userReportDao;

	@Override
	public void queryUser7Achievement(Paging paging, List<Filter> filters, int company) throws FLException {

		List<UserAchievementPO> userAchievementsPOs = userReportDao.queryUser7Achievement(paging, filters, company);
		List<UserAchievementVO> userAchievementsVOs = new ArrayList<UserAchievementVO>();
		UserAchievementVO userAchievementsVO;

		for (UserAchievementPO userAchievementsPO : userAchievementsPOs) {

			userAchievementsVO = new UserAchievementVO();
			BeanUtil.copyProperties(userAchievementsPO, userAchievementsVO);

			userAchievementsVOs.add(userAchievementsVO);
		}

		paging.setData(userAchievementsVOs);

	}
}
