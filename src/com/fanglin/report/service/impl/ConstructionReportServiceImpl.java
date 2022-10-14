package com.fanglin.report.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.report.dao.ConstructionReportDao;
import com.fanglin.report.po.ConstructionReportPO;
import com.fanglin.report.service.ConstructionReportService;
import com.fanglin.report.vo.ConstructionReportVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("ConstructionReportService")
@Transactional(readOnly = true)
public class ConstructionReportServiceImpl implements ConstructionReportService {

	@Autowired
	private ConstructionReportDao constructionReportDao;

	@Override
	public void queryConstruction7Achievement(Paging paging, List<Filter> filters, int company) throws FLException {

		List<ConstructionReportPO> constructionReportPOs = constructionReportDao.queryConstruction7Achievement(paging, filters, company);
		List<ConstructionReportVO> constructionReportVOs = new ArrayList<ConstructionReportVO>();
		ConstructionReportVO constructionReportVO;

		for (ConstructionReportPO salesAchievementsPO : constructionReportPOs) {

			constructionReportVO = new ConstructionReportVO();
			BeanUtil.copyProperties(salesAchievementsPO, constructionReportVO);

			constructionReportVOs.add(constructionReportVO);
		}

		paging.setData(constructionReportVOs);

	}
}
