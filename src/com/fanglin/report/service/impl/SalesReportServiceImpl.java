package com.fanglin.report.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.communion.vo.DepartmentVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.report.dao.SalesReportDao;
import com.fanglin.report.po.SalesAchievementsPO;
import com.fanglin.report.service.SalesReportService;
import com.fanglin.report.vo.SalesAchievementsVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("SalesReportService")
@Transactional(readOnly = true)
public class SalesReportServiceImpl implements SalesReportService {

	@Autowired
	private SalesReportDao salesReportDao;

	@Override
	public void querySales7Achievement(Paging paging, List<Filter> filters, int company) throws FLException {

		List<SalesAchievementsPO> salesAchievementsPOs = salesReportDao.querySales7Achievement(paging, filters, company);
		List<SalesAchievementsVO> salesAchievementsVOs = new ArrayList<SalesAchievementsVO>();
		SalesAchievementsVO salesAchievementsVO;

		for (SalesAchievementsPO salesAchievementsPO : salesAchievementsPOs) {

			salesAchievementsVO = new SalesAchievementsVO(new DepartmentVO());
			BeanUtil.copyProperties(salesAchievementsPO, salesAchievementsVO, Arrays.asList("department"));
			BeanUtil.copyProperties(salesAchievementsPO.getDepartment(), salesAchievementsVO.getDepartment(), Arrays.asList("type", "fatherDept", "manager"));

			salesAchievementsVOs.add(salesAchievementsVO);
		}

		paging.setData(salesAchievementsVOs);

	}
}
