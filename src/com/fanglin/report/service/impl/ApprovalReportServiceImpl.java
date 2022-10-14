package com.fanglin.report.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.report.dao.ApprovalReportDao;
import com.fanglin.report.po.ApprovalAchievementPO;
import com.fanglin.report.service.ApprovalReportService;
import com.fanglin.report.vo.ApprovalAchievementVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("ApprovalReportService")
@Transactional(readOnly = true)
public class ApprovalReportServiceImpl implements ApprovalReportService {

	@Autowired
	private ApprovalReportDao approvalReportDao;

	@Override
	public void queryApproval7Achievement(Paging paging, List<Filter> filters, int company) throws FLException {

		List<ApprovalAchievementPO> approvalAchievementPOs = approvalReportDao.queryApproval7Achievement(paging, filters, company);
		List<ApprovalAchievementVO> approvalAchievementVOs = new ArrayList<ApprovalAchievementVO>();
		ApprovalAchievementVO approvalAchievementVO;

		for (ApprovalAchievementPO approvalAchievementPO : approvalAchievementPOs) {
			
			approvalAchievementVO = new ApprovalAchievementVO();
			BeanUtil.copyProperties(approvalAchievementPO, approvalAchievementVO);

			approvalAchievementVOs.add(approvalAchievementVO);
		}

		paging.setData(approvalAchievementVOs);

	}
}
