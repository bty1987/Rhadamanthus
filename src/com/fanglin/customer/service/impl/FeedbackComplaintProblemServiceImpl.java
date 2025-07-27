package com.fanglin.customer.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.customer.dao.FeedbackComplaintProblemDao;
import com.fanglin.customer.po.FeedbackComplaintProblemPO;
import com.fanglin.customer.service.FeedbackComplaintProblemService;
import com.fanglin.customer.vo.FeedbackComplaintProblemVO;
import com.fanglin.utils.BeanUtil;

@Service("feedbackComplaintProblemService")
@Transactional(readOnly = true)
public class FeedbackComplaintProblemServiceImpl implements FeedbackComplaintProblemService {

	@Autowired
	private FeedbackComplaintProblemDao feedbackComplaintProblemDao;

	@Override
	public List<FeedbackComplaintProblemVO> queryFeedbackComplaintProblem(List<Long> deptTypes) {

		List<FeedbackComplaintProblemPO> FeedbackComplaintProblemPOs = feedbackComplaintProblemDao.queryFeedbackComplaintProblem(deptTypes);
		List<FeedbackComplaintProblemVO> FeedbackComplaintProblemVOs = new ArrayList<FeedbackComplaintProblemVO>();

		for (FeedbackComplaintProblemPO feedbackComplaintProblemPO : FeedbackComplaintProblemPOs) {

			FeedbackComplaintProblemVO feedbackComplaintProblemVO = new FeedbackComplaintProblemVO();

			BeanUtil.copyPropertie(feedbackComplaintProblemPO, feedbackComplaintProblemVO);

			FeedbackComplaintProblemVOs.add(feedbackComplaintProblemVO);
		}

		return FeedbackComplaintProblemVOs;
	}

}
