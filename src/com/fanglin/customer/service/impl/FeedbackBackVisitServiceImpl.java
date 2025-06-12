package com.fanglin.customer.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.customer.dao.FeedbackBackVisitDao;
import com.fanglin.customer.po.FeedbackBackVisitPO;
import com.fanglin.customer.service.FeedbackBackVisitService;
import com.fanglin.customer.vo.FeedbackBackVisitVO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;

@Service("feedbackBackVisitService")
@Transactional(readOnly = true)
public class FeedbackBackVisitServiceImpl implements FeedbackBackVisitService {

	@Autowired
	private FeedbackBackVisitDao feedbackBackVisitDao;

	@Autowired
	private UserDao userDao;

	@Override
	public List<FeedbackBackVisitVO> queryFeedbackBackVisit(FeedbackBackVisitVO feedbackBackVisit) {

		List<FeedbackBackVisitPO> feedbackBackVisitPOs = feedbackBackVisitDao.queryFeedbackBackVisit(feedbackBackVisit.getFid());
		List<FeedbackBackVisitVO> feedbackBackVisitVOs = new ArrayList<FeedbackBackVisitVO>();

		for (FeedbackBackVisitPO feedbackBackVisitPO : feedbackBackVisitPOs) {
			feedbackBackVisitVOs.add(feedbackBackVisitPO.ptv(new FeedbackBackVisitVO(new UserBaseVO(), new UserBaseVO())));
		}

		return feedbackBackVisitVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public long addFeedbackBackVisit(FeedbackBackVisitVO feedbackBackVisitVO, String userId) throws FLException {

		FeedbackBackVisitPO feedbackBackVisitPO = new FeedbackBackVisitPO();

		BeanUtil.copyPropertie(feedbackBackVisitVO, feedbackBackVisitPO, Arrays.asList("creater", "praiser"));

		UserPO creater = userDao.queryUserByUserId(userId);

		UserPO praiser = userDao.queryUserByUserId(feedbackBackVisitVO.getPraiser().getUserId());

		if (praiser == null) {
			throw new FLException(190005, "人员不存在");
		}

		feedbackBackVisitPO.setCreater(creater);
		feedbackBackVisitPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		feedbackBackVisitPO.setPraiser(praiser);

		feedbackBackVisitDao.save(feedbackBackVisitPO);

		return feedbackBackVisitPO.getFbid();
	}
}
