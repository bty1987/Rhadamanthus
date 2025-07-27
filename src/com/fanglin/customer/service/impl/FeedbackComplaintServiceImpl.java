package com.fanglin.customer.service.impl;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Authentication;
import com.fanglin.customer.dao.FeedbackComplaintDao;
import com.fanglin.customer.dao.FeedbackDao;
import com.fanglin.customer.po.FeedbackComplaintPO;
import com.fanglin.customer.po.FeedbackPO;
import com.fanglin.customer.service.FeedbackComplaintService;
import com.fanglin.customer.vo.FeedbackComplaintVO;
import com.fanglin.decoration.dao.DecorationDao;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;

@Service("feedbackComplaintService")
@Transactional(readOnly = true)
public class FeedbackComplaintServiceImpl implements FeedbackComplaintService {

	@Autowired
	private FeedbackComplaintDao feedbackComplaintDao;

	@Autowired
	private FeedbackDao feedbackDao;

	@Autowired
	private DecorationDao decorationDao;

	@Autowired
	private UserDao userDao;

	@Override
	public List<FeedbackComplaintVO> queryFeedbackComplaint(FeedbackComplaintVO feedbackComplaint) {

		List<FeedbackComplaintPO> feedbackComplaintPOs = feedbackComplaintDao.queryFeedbackComplaint(feedbackComplaint.getFid());
		List<FeedbackComplaintVO> feedbackComplaintVOs = new ArrayList<FeedbackComplaintVO>();

		for (FeedbackComplaintPO feedbackComplaintPO : feedbackComplaintPOs) {

			feedbackComplaint = new FeedbackComplaintVO();

			BeanUtil.copyProperties(feedbackComplaintPO, feedbackComplaint);

			feedbackComplaintVOs.add(feedbackComplaint);
		}

		return feedbackComplaintVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public long addFeedbackComplaint(FeedbackComplaintVO feedbackComplaint, Authentication authentication) throws FLException {
		List<FeedbackComplaintPO> feedbackComplaintPOs = feedbackComplaintDao.queryFeedbackComplaint(feedbackComplaint.getFid());

		if (feedbackComplaintPOs.size() == 1) {
			throw new FLException(330053, "反馈信息已存在");
		}

		String userId = authentication.getUserId();

		FeedbackPO feedbackPO = feedbackDao.get(feedbackComplaint.getFid());

		if (feedbackPO == null) {
			throw new FLException(330053, "反馈信息不存在");
		}

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(feedbackComplaint.getOrderId());

		if (decorationPO == null) {
			throw new FLException(140013, "装修单不存在");
		}

		UserPO userPO = userDao.queryUserByUserId(userId);

		FeedbackComplaintPO feedbackComplaintPO = new FeedbackComplaintPO();

		BeanUtil.copyPropertie(feedbackComplaint, feedbackComplaintPO, Arrays.asList("feedback", "servicer", "materialer", "creater"));

		feedbackComplaintPO.setServicer(userPO);
		feedbackComplaintPO.setMaterialer(userPO);
		feedbackComplaintPO.setCreater(userPO);

		feedbackComplaintPO.setCreateTime(new Timestamp(System.currentTimeMillis()));

		feedbackComplaintDao.save(feedbackComplaintPO);

		return feedbackComplaintPO.getFcid();
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int finishFeedbackComplaint(FeedbackComplaintVO feedbackComplaint, Authentication authentication) throws FLException {

		FeedbackComplaintPO feedbackComplaintPO = feedbackComplaintDao.get(feedbackComplaint.getFcid());

		if (feedbackComplaintPO == null) {
			throw new FLException(330013, "投诉记录不存在");
		}

		if (feedbackComplaintPO.getResults() != FeedbackComplaintPO.RESULTS_COMPLETE) {
			throw new FLException(330054, "该投诉已完成");
		}

		feedbackComplaintPO.setResults(FeedbackComplaintPO.RESULTS_COMPLETE);
		feedbackComplaintPO.setFinishTime(DateUtil.getDateToTimestamp(new Date()));

		feedbackComplaintDao.update(feedbackComplaintPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateFeedbackComplaint(FeedbackComplaintVO feedbackComplaint) {

		FeedbackComplaintPO feedbackComplaintPO = feedbackComplaintDao.get(feedbackComplaint.getFcid());

		BeanUtil.copyPropertie(feedbackComplaint, feedbackComplaintPO, Arrays.asList("feedback", "servicer", "materialer", "creater"));

		feedbackComplaintDao.update(feedbackComplaintPO);

	}
}
